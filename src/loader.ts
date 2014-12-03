/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/async.d.ts"/>

/// <reference path="pathUtil.ts"/>
/// <reference path="nodes.ts"/>

module reflect {

    var options = {

        noLib: false,
        noResolve: false,
        charset: "utf8"
    }

    var files: SourceFile[] = [];
    var filesByName: Map<SourceFile> = {};
    var seenNoDefaultLib = options.noLib;
    var initializedGlobals = false;

    var flagMap: { [name: string]: NodeFlags } = {

        "external": NodeFlags.ExternalModule,
        "export": NodeFlags.Export,
        "private": NodeFlags.Private,
        "static": NodeFlags.Static,
        "optional": NodeFlags.QuestionMark,
        "rest": NodeFlags.Rest
    }

    var flags = Object.keys(flagMap);

    var fs = require("fs");
    var async = require("async");

    export function getLoadedSourceFile(filename: string) {

        // TODO: do I need to normalize this?
        filename = getCanonicalFileName(filename);
        return hasProperty(filesByName, filename) ? filesByName[filename] : undefined;
    }

    export function processRootFile(filename: string): SourceFile {

        var sourceFile = processSourceFile(filename, false);
        bindPendingFiles();
        return sourceFile;
    }

    export function processRootFileAsync(filename: string, callback: (err: Error, file: SourceFile) => void): void {

        processSourceFileAsync(filename, false, null, (err, sourceFile) => {
            if(err) return callback(err, null);

            bindPendingFilesAsync((err) => {
                if(err) return callback(err, null);

                callback(null, sourceFile);
            });
        });
    }

    export function processExternalModule(moduleName: string, searchPath: string): Symbol {

        var isRelative = isExternalModuleNameRelative(moduleName);
        if (!isRelative) {
            var symbol = getSymbol(globals, '"' + moduleName + '"', SymbolFlags.ValueModule);
            if (symbol) {
                return getResolvedExportSymbol(symbol);
            }
        }

        while (true) {
            var filename = normalizePath(combinePaths(searchPath, moduleName));
            var sourceFile = findSourceFile(filename + ".d.json", false);
            if (sourceFile || isRelative) break;
            var parentPath = getDirectoryPath(searchPath);
            if (parentPath === searchPath) break;
            searchPath = parentPath;
        }

        if (sourceFile) {
            bindPendingFiles();

            if (sourceFile.symbol) {
                return getResolvedExportSymbol(sourceFile.symbol);
            }

            addDiagnostic(new Diagnostic(undefined, Diagnostics.File_0_is_not_an_external_module, sourceFile.filename));
            return;
        }

        addDiagnostic(new Diagnostic(undefined, Diagnostics.Cannot_find_external_module_0, moduleName));
    }

    function bindPendingFilesAsync(callback: (err: Error) => void): void {

        if(!seenNoDefaultLib) {
            processSourceFileAsync(normalizePath(getDefaultLibFilename()), true, null, (err) => {
                if(err) return callback(err);

                processFiles();
            });
        }
        else {
            process.nextTick(processFiles);
        }

        function processFiles() {
            processBindFilesQueue();
            callback(hasDiagnosticErrors ? createDiagnosticError() : null);
        }
    }

    function bindPendingFiles(): void {

        if (!seenNoDefaultLib) {
            processSourceFile(normalizePath(getDefaultLibFilename()), true);
        }

        processBindFilesQueue();
    }

    function processBindFilesQueue(): void {

        forEach(files, bindSourceFile);
        forEach(files, bindSourceFile);
        files = [];

        if (!initializedGlobals) {
            initializeGlobalTypes();
            initializedGlobals = true;
        }
    }

    // TODO: move to host
    // TODO: make configurable
    function getDefaultLibFilename(): string {

        return combinePaths(normalizePath(__dirname), "lib.core.d.json");
    }

    function processSourceFileAsync(filename: string, isDefaultLib: boolean, refFile: SourceFile, callback: (err: Error, result: SourceFile) => void): void {

        var ret: SourceFile;
        var diagnostic: DiagnosticMessage;
        if (hasExtension(filename)) {
            if (!fileExtensionIs(filename, ".d.json")) {
                process.nextTick(() => {
                    handleCallback(null, null, Diagnostics.File_0_must_have_extension_d_json);
                });
            }
            else {
                findSourceFileAsync(filename, isDefaultLib, refFile, handleCallback);
            }
        }
        else {
            filename += ".d.json";
            findSourceFileAsync(filename, isDefaultLib, refFile, handleCallback);
        }

        function handleCallback(err: Error, file: SourceFile, diagnostic?: DiagnosticMessage) {
            if (err) return callback(err, null);

            if (!diagnostic && !file) {
                diagnostic = Diagnostics.File_0_not_found;
            }
            if (diagnostic) {
                addDiagnostic(new Diagnostic(refFile, diagnostic, filename));
                return callback(createDiagnosticError(), null);
            }
            callback(null, file);
        }
    }

    function processSourceFile(filename: string, isDefaultLib: boolean, refFile?: SourceFile): SourceFile {

        var ret: SourceFile;
        var diagnostic: DiagnosticMessage;
        if (hasExtension(filename)) {
            if (!fileExtensionIs(filename, ".d.json")) {
                diagnostic = Diagnostics.File_0_must_have_extension_d_json;
            }
            else if (!(ret = findSourceFile(filename, isDefaultLib, refFile))) {
                diagnostic = Diagnostics.File_0_not_found;
            }
        }
        else {
            if (!(ret = findSourceFile(filename + ".d.json", isDefaultLib, refFile))) {
                diagnostic = Diagnostics.File_0_not_found;
                filename += ".d.json";
            }
        }

        if (diagnostic) {
            addDiagnostic(new Diagnostic(refFile, diagnostic, filename));
        }
        return ret;
    }

    function findSourceFileAsync(filename: string, isDefaultLib: boolean, refFile: SourceFile, callback: (err: Error, result: SourceFile) => void): void {
        var canonicalName = getCanonicalFileName(filename);
        if (hasProperty(filesByName, canonicalName)) {
            // We've already looked for this file, use cached result
            var file = filesByName[canonicalName];
            if (file && useCaseSensitiveFileNames && canonicalName !== file.filename) {
                addDiagnostic(new Diagnostic(refFile,
                    Diagnostics.Filename_0_differs_from_already_included_filename_1_only_in_casing, filename, file.filename));
                return callback(createDiagnosticError(), null);
            }

            process.nextTick(() => {
                callback(null, file);
            });
            return;
        }

        // We haven't looked for this file, do so now and cache result
        readSourceFileAsync(filename, (err, file) => {

            if (err) {
                addDiagnostic(new Diagnostic(refFile, Diagnostics.Cannot_read_file_0_Colon_1, filename, err.message));
                return callback(createDiagnosticError(), null);
            }

            filesByName[canonicalName] = file;

            if (!file) {
                return callback(null, undefined);
            }

            seenNoDefaultLib = seenNoDefaultLib || file.noDefaultLib;
            if (options.noResolve) {
                handleCallback(file);
                return;
            }

            var basePath = getDirectoryPath(filename);

            processReferencedFilesAsync(file, basePath, (err) => {
                if (err) return callback(err, null);

                processImportedModulesAsync(file, basePath, (err) => {
                    if (err) return callback(err, null);
                    handleCallback(file);
                });
            });
        });

        function handleCallback(file: SourceFile) {
            if (isDefaultLib) {
                files.unshift(file);
            }
            else {
                files.push(file);
            }
            callback(null, file);
        }
    }

    // Get source file from normalized filename
    function findSourceFile(filename: string, isDefaultLib: boolean, refFile?: SourceFile): SourceFile {
        var canonicalName = getCanonicalFileName(filename);
        if (hasProperty(filesByName, canonicalName)) {
            // We've already looked for this file, use cached result
            var file = filesByName[canonicalName];
            if (file && useCaseSensitiveFileNames && canonicalName !== file.filename) {
                addDiagnostic(new Diagnostic(refFile,
                    Diagnostics.Filename_0_differs_from_already_included_filename_1_only_in_casing, filename, file.filename));
            }
        }
        else {
            // We haven't looked for this file, do so now and cache result
            try {
                var file = filesByName[canonicalName] = readSourceFile(filename);
            }
            catch (e) {
                addDiagnostic(new Diagnostic(refFile, Diagnostics.Cannot_read_file_0_Colon_1, filename, e.message));
            }
            if (file) {
                seenNoDefaultLib = seenNoDefaultLib || file.noDefaultLib;
                if (!options.noResolve) {
                    var basePath = getDirectoryPath(filename);
                    processReferencedFiles(file, basePath);
                    processImportedModules(file, basePath);
                }
                if (isDefaultLib) {
                    files.unshift(file);
                }
                else {
                    files.push(file);
                }
            }
        }
        return file;
    }

    function readSourceFileAsync(filename: string, callback: (err: Error, result: SourceFile) => void): void {

        fs.exists(filename, (exists: boolean) => {
            if (!exists) return callback(null, undefined);

            fs.readFile(filename, options.charset, (err: Error, text: string) => {
                if (err) return callback(err, null);

                if (!text) return callback(null, undefined);

                if (!isRelativePath(filename)) {
                    filename = "./" + filename;
                }

                var sourceFile = createSourceFile(filename, text);
                if(hasDiagnosticErrors) {
                    return callback(createDiagnosticError(), null);
                }
                callback(null, sourceFile);
            });
        });
    }

    function readSourceFile(filename: string): SourceFile {

        if (!fs.existsSync(filename)) {
            return undefined;
        }

        var text = fs.readFileSync(filename, options.charset);
        if (text) {
            if (!isRelativePath(filename)) {
                filename = "./" + filename;
            }
            return createSourceFile(filename, text);
        }
    }

    function processReferencedFilesAsync(file: SourceFile, basePath: string, callback: (err: Error) => void): void {

        async.each(file.references || [], (filename: string, callback: (err?: Error) => void) => {
            processSourceFileAsync(normalizePath(combinePaths(basePath, filename)), /* isDefaultLib */ false, file, callback);
        }, callback);
    }

    function processReferencedFiles(file: SourceFile, basePath: string): void {

        forEach(file.references, filename => {
            processSourceFile(normalizePath(combinePaths(basePath, filename)), /* isDefaultLib */ false, file);
        });
    }

    function processImportedModulesAsync(file: SourceFile, basePath: string, callback: (err: Error) => void): void {

        async.each(getExternalImportDeclarations(file), (node: ImportDeclaration, callback: (err?: Error) => void) => {

            if(node.parent !== file) {
                // TypeScript 1.0 spec (April 2014): 12.1.6
                // An ExternalImportDeclaration in anAmbientExternalModuleDeclaration may reference other external modules
                // only through top - level external module names. Relative external module names are not permitted.
                var searchName = normalizePath(combinePaths(basePath, node.require));
                return findSourceFileAsync(searchName + ".d.json", false, file, callback);
            }

            searchForModule(basePath, node.require);

            function searchForModule(searchPath: string, moduleName: string) {

                var searchName = normalizePath(combinePaths(searchPath, moduleName));
                findSourceFileAsync(searchName + ".d.json", false, file, (err, result) => {
                    if(err) return callback(err);

                    if(result) {
                        return callback();
                    }

                    var parentPath = getDirectoryPath(searchPath);
                    if (parentPath === searchPath) {
                        return callback();
                    }
                    searchPath = parentPath;

                    searchForModule(searchPath, moduleName);
                });
            }

        }, callback);
    }

    function processImportedModules(file: SourceFile, basePath: string): void {

        forEach(getExternalImportDeclarations(file), node => {

            if(node.parent === file) {
                var moduleName = node.require;
                var searchPath = basePath;
                while (true) {
                    var searchName = normalizePath(combinePaths(searchPath, moduleName));
                    if (findSourceFile(searchName + ".d.json", false, file)) {
                        break;
                    }

                    var parentPath = getDirectoryPath(searchPath);
                    if (parentPath === searchPath) {
                        break;
                    }
                    searchPath = parentPath;
                }
            }
            else {
                // TypeScript 1.0 spec (April 2014): 12.1.6
                // An ExternalImportDeclaration in anAmbientExternalModuleDeclaration may reference other external modules
                // only through top - level external module names. Relative external module names are not permitted.
                var searchName = normalizePath(combinePaths(basePath, node.require));
                findSourceFile(searchName + ".d.json", false, file);
            }
        });
    }

    function getExternalImportDeclarations(file: SourceFile): ImportDeclaration[] {

        var nodes: ImportDeclaration[] = [];

        forEach(file.declares, node => {
            if (node.kind === NodeKind.ImportDeclaration && (<ImportDeclaration>node).require) {
                var moduleName = (<ImportDeclaration>node).require;
                if (moduleName) {
                    nodes.push(<ImportDeclaration>node);
                }
            }
            else if (node.kind === NodeKind.ModuleDeclaration && (node.flags & NodeFlags.ExternalModule)) {
                // TypeScript 1.0 spec (April 2014): 12.1.6
                // An AmbientExternalModuleDeclaration declares an external module.
                // This type of declaration is permitted only in the global module.
                // The StringLiteral must specify a top - level external module name.
                // Relative external module names are not permitted
                forEachChild(node, node => {
                    if (node.kind === NodeKind.ImportDeclaration && (<ImportDeclaration>node).require) {
                        var moduleName = (<ImportDeclaration>node).require;
                        if (moduleName) {
                            nodes.push(<ImportDeclaration>node);
                        }
                    }
                });
            }
        });

        return nodes;
    }


    function createSourceFile(filename: string, text: string): SourceFile {

        function scanSourceFile(file: SourceFile): void {

            file.kind = NodeKind.SourceFile;
            scanFlags(file);
            forEach(file.declares, scanModuleElementDeclaration);
        }

        function scanModuleElementDeclaration(node: ModuleElementDeclaration): void {

            switch(<any>node.kind) {
                case "interface":
                    scanInterfaceDeclaration(<InterfaceDeclaration>node);
                    break;
                case "class":
                    scanClassDeclaration(<ClassDeclaration>node);
                    break;
                case "enum":
                    scanEnumDeclaration(<EnumDeclaration>node);
                    break;
                case "module":
                    scanModuleDeclaration(<ModuleElementDeclaration>node);
                    break;
                case "function":
                    scanFunctionDeclaration(<FunctionDeclaration>node);
                    break;
                case "variable":
                    scanVariableDeclaration(<VariableDeclaration>node);
                    break;
                case "import":
                    scanImportDeclaration(<ImportDeclaration>node);
                    break;
            }
        }

        function scanInterfaceDeclaration(node: InterfaceDeclaration): void {

            node.kind = NodeKind.InterfaceDeclaration;
            scanFlags(node);
            scanTypeParameterDeclarations(node.typeParameters);
            scanTypeReferenceNodes(node.extends);
            forEach(node.signatures, scanSignatureDeclaration);
        }

        function scanTypeParameterDeclarations(nodes: TypeParameterDeclaration[]): void {

            if(!nodes) return;

            for(var i = 0, l = nodes.length; i < l; i++) {

                var parameter = nodes[i];
                parameter.kind = NodeKind.TypeParameter;
                scanChildTypeNode(parameter, "constraint");
            }
        }

        function scanClassDeclaration(node: ClassDeclaration): void {

            node.kind = NodeKind.ClassDeclaration;
            scanFlags(node);
            scanTypeParameterDeclarations(node.typeParameters);
            scanChildTypeReferenceNode(node, "extends");
            scanTypeReferenceNodes(node.implements);
            forEach(node.members, scanClassMemberDeclaration);
        }

        function scanEnumDeclaration(node: EnumDeclaration): void {

            node.kind = NodeKind.EnumDeclaration;
            scanFlags(node);
            forEach(node.members, scanEnumMemberDeclaration);
        }

        function scanEnumMemberDeclaration(node: EnumMemberDeclaration): void {

            node.kind = NodeKind.EnumMember;
            scanFlags(node);
        }

        function scanModuleDeclaration(node: ModuleDeclaration): void {

            node.kind = NodeKind.ModuleDeclaration;
            scanFlags(node);
            forEach(node.declares, scanModuleElementDeclaration);
        }

        function scanFunctionDeclaration(node: FunctionDeclaration): void {

            scanCallSignature(node, NodeKind.FunctionDeclaration);
        }

        function scanParameterDeclaration(node: ParameterDeclaration): void {

            if(!node) return;

            node.kind = NodeKind.Parameter;
            scanFlags(node);
            scanChildTypeNode(node, "type");
        }

        function scanVariableDeclaration(node: VariableDeclaration): void {

            node.kind = NodeKind.VariableDeclaration;
            scanFlags(node);
            scanChildTypeNode(node, "type");
        }

        function scanImportDeclaration(node: ImportDeclaration): void {

            node.kind = NodeKind.ImportDeclaration;
            scanFlags(node);
        }

        function scanClassMemberDeclaration(node: MemberDeclaration): void {

            switch(<any>node.kind) {
                case "index":
                    scanIndexDeclaration(<IndexMemberDeclaration>node);
                    break;
                case "field":
                    scanFieldDeclaration(<FieldMemberDeclaration>node);
                    break;
                case "method":
                    scanMethodDeclaration(<MethodMemberDeclaration>node);
                    break;
                case "constructor":
                    scanConstructorDeclaration(<ConstructorMemberDeclaration>node);
                    break;
                case "get":
                    scanGetAccessorDeclaration(<GetAccessorMemberDeclaration>node);
                    break;
                case "set":
                    scanSetAccessorDeclaration(<SetAccessorMemberDeclaration>node);
                    break;
            }
        }

        function scanIndexDeclaration(node: IndexMemberDeclaration): void {

            node.kind = NodeKind.Index;
            scanFlags(node);
            scanParameterDeclaration(node.parameter);
            scanChildTypeNode(node, "returns");
        }

        function scanFieldDeclaration(node: FieldMemberDeclaration): void {

            node.kind = NodeKind.Field;
            scanFlags(node);
            scanChildTypeNode(node, "type");
        }

        function scanMethodDeclaration(node: MethodMemberDeclaration): void {

            scanCallSignature(node, NodeKind.Method);
        }

        function scanConstructorDeclaration(node: ConstructorMemberDeclaration): void {

            scanCallSignature(node, NodeKind.Constructor);
        }

        function scanGetAccessorDeclaration(node: GetAccessorMemberDeclaration): void {

            node.kind = NodeKind.GetAccessor;
            scanFlags(node);
            scanChildTypeNode(node, "returns");
        }

        function scanSetAccessorDeclaration(node: SetAccessorMemberDeclaration): void {

            node.kind = NodeKind.SetAccessor;
            scanFlags(node);
            scanParameterDeclaration(node.parameter);
        }

        function scanSignatureDeclaration(node: SignatureDeclaration): void {

            switch(<any>node.kind) {
                case "property":
                    scanPropertySignatureDeclaration(<PropertySignatureDeclaration>node);
                    break;
                case "constructor":
                    scanConstructSignatureDeclaration(<ConstructSignatureDeclaration>node);
                    break;
                case "method":
                    scanMethodSignatureDeclaration(<MethodSignatureDeclaration>node);
                    break;
                case "index":
                    scanIndexSignatureDeclaration(<IndexSignatureDeclaration>node);
                    break;
                case "call":
                    scanCallSignatureDeclaration(<CallSignatureDeclaration>node);
                    break;
            }
        }

        function scanPropertySignatureDeclaration(node: PropertySignatureDeclaration): void {

            node.kind = NodeKind.PropertySignature;
            scanFlags(node);
            scanChildTypeNode(node, "type");
        }

        function scanConstructSignatureDeclaration(node: ConstructSignatureDeclaration): void {

            scanCallSignature(node, NodeKind.ConstructSignature);
        }

        function scanMethodSignatureDeclaration(node: MethodSignatureDeclaration): void {

            scanCallSignature(node, NodeKind.MethodSignature);
        }

        function scanIndexSignatureDeclaration(node: IndexSignatureDeclaration): void {

            node.kind = NodeKind.IndexSignature;
            scanFlags(node);
            scanParameterDeclaration(node.parameter);
            scanChildTypeNode(node, "returns");
        }

        function scanCallSignatureDeclaration(node: CallSignatureDeclaration): void {

            scanCallSignature(node, NodeKind.CallSignature);
        }

        function scanCallSignature(node: CallSignatureDeclaration, kind: NodeKind): void {

            node.kind = kind;
            scanFlags(node);
            scanTypeParameterDeclarations(node.typeParameters);
            forEach(node.parameters, scanParameterDeclaration);
            scanChildTypeNode(node, "returns");
        }

        function scanChildTypeNode(node: Node, typeNodeName: string): void {

            var typeNode = (<any>node)[typeNodeName];
            if(!typeNode) return;

            if(typeof typeNode === "string") {
                (<any>node)[typeNodeName] = createTypeNodeFromString(typeNode);
            }
            else {
                scanTypeNode(<TypeNode>typeNode);
            }
        }

        function scanTypeNodes(nodes: TypeNode[]): void {

            if(!nodes) return;

            for(var i = 0, l = nodes.length; i < l; i++) {

                var typeNode = nodes[i];
                if(typeof typeNode === "string") {
                    nodes.splice(i, 1, createTypeNodeFromString(<any>typeNode));
                }
                else {
                    scanTypeNode(<TypeNode>typeNode);
                }
            }
        }

        function scanTypeNode(node: TypeNode) {

            switch (<any>node.kind) {
                case "function":
                    scanFunctionTypeNode(<FunctionTypeNode>node);
                    break;
                case "array":
                    scanArrayTypeNode(<ArrayTypeNode>node);
                    break;
                case "constructor":
                    scanConstructorTypeNode(<ConstructorTypeNode>node);
                    break;
                case "reference":
                    scanTypeReferenceNode(<TypeReferenceNode>node);
                    break;
                case "object":
                    scanObjectTypeNode(<ObjectTypeNode>node);
                    break;
                case "tuple":
                    scanTupleTypeNode(<TupleTypeNode>node);
                    break;
            }
        }

        function createTypeNodeFromString(text: string): TypeNode {

            if(isStringLiteral(text)) {
                return createStringLiteralTypeNode(text);
            }

            return createTypeReferenceNode(text);
        }

        function isStringLiteral(text: string): boolean {

            return /^"[^"]+"$/.test(text);
        }

        function scanFunctionTypeNode(node: FunctionTypeNode): void {

            scanCallSignature(node, NodeKind.FunctionType);
        }

        function scanArrayTypeNode(node: ArrayTypeNode): void {

            node.kind = NodeKind.ArrayType;
            scanChildTypeNode(node, "type");
        }

        function scanTupleTypeNode(node: TupleTypeNode): void {

            node.kind = NodeKind.TupleType;
            scanTypeNodes(node.types);
        }

        function scanConstructorTypeNode(node: ConstructorTypeNode): void {

            scanCallSignature(node, NodeKind.ConstructorType);
        }

        function scanTypeReferenceNodes(nodes: TypeReferenceNode[]): void {

            if(!nodes) return;

            for(var i = 0, l = nodes.length; i < l; i++) {

                var typeReferenceNode = nodes[i];
                if(typeof typeReferenceNode === "string") {
                    nodes.splice(i, 1, createTypeReferenceNode(<any>typeReferenceNode));
                }
                else {
                    scanTypeReferenceNode(typeReferenceNode);
                }
            }
        }

        function scanChildTypeReferenceNode(node: Node, typeReferenceNodeName: string): void {

            var typeReferenceNode = (<any>node)[typeReferenceNodeName];
            if(!typeReferenceNode) return;

            if(typeof typeReferenceNode === "string") {
                (<any>node)[typeReferenceNodeName] = createTypeReferenceNode(typeReferenceNode);
            }
            else {
                scanTypeReferenceNode(<TypeReferenceNode>typeReferenceNode);
            }
        }

        function createTypeReferenceNode(typeName: string): TypeReferenceNode {

            return {
                kind: NodeKind.TypeReference,
                flags: NodeFlags.None,
                type: typeName
            }
        }

        function createStringLiteralTypeNode(stringLiteral: string): StringLiteralTypeNode {

            return {
                kind: NodeKind.StringLiteral,
                flags: NodeFlags.None,
                text: stringLiteral.replace(/^"|"$/g,"")
            }
        }

        function scanTypeReferenceNode(node: TypeReferenceNode): void {

            node.kind = NodeKind.TypeReference;
            node.flags = NodeFlags.None;
            scanTypeNodes(node.arguments);
        }

        function scanObjectTypeNode(node: ObjectTypeNode): void {

            node.kind = NodeKind.ObjectType;
            forEach(node.signatures, scanSignatureDeclaration);
        }

        function scanFlags(node: Node) {

            node.flags = NodeFlags.None;

            for(var i = 0, l = flags.length; i < l; i++) {
                var flag = flags[i];
                if((<any>node)[flag]) {
                    node.flags |= flagMap[flag];
                    delete (<any>node)[flag];
                }
            }
        }

        // scan input
        var file: SourceFile;

        try {
            file = JSON.parse(text);
        }
        catch(e) {
            addDiagnostic(new Diagnostic(undefined, Diagnostics.File_0_has_invalid_json_format_1, filename, e.message));
            return;
        }

        if(file) {
            file.filename = filename;
            scanSourceFile(file);
        }

        return file;
    }
}