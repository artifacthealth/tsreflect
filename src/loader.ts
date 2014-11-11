/// <reference path="pathUtil.ts"/>

module reflect {

    var options = {
        noLib: false,
        noResolve: false,
        charset: "utf8"
    }

    var files: SourceFile[] = [];
    var filesByName: Map<SourceFile> = {};
    var errors: Diagnostic[] = [];
    var seenNoDefaultLib = options.noLib;

    var fs = require("fs");

    export function getLoadedSourceFile(filename: string) {
        filename = getCanonicalFileName(filename);
        return hasProperty(filesByName, filename) ? filesByName[filename] : undefined;
    }

    export function processRootFile(filename: string, isDefaultLib: boolean = false): SourceFile[] {

        processSourceFile(normalizePath(filename), isDefaultLib);
        return files;
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
            errors.push(new Diagnostic(refFile, diagnostic, filename));
        }
        return ret;
    }

    function getSourceFile(filename:string, onError?:(message:string) => void): SourceFile {
        try {
            var text = fs.readFileSync(filename, options.charset);
        }
        catch (e) {
            if (onError) {
                onError(e.message);
            }
            text = "";
        }
        return text ? createSourceFile(filename, text) : undefined;
    }

    // Get source file from normalized filename
    function findSourceFile(filename: string, isDefaultLib: boolean, refFile?: SourceFile): SourceFile {
        var canonicalName = getCanonicalFileName(filename);
        if (hasProperty(filesByName, canonicalName)) {
            // We've already looked for this file, use cached result
            var file = filesByName[canonicalName];
            if (file && useCaseSensitiveFileNames && canonicalName !== file.filename) {
                errors.push(new Diagnostic(refFile,
                    Diagnostics.Filename_0_differs_from_already_included_filename_1_only_in_casing, filename, file.filename));
            }
        }
        else {
            // We haven't looked for this file, do so now and cache result
            var file = filesByName[canonicalName] = getSourceFile(filename, hostErrorMessage => {
                errors.push(new Diagnostic(refFile, Diagnostics.Cannot_read_file_0_Colon_1, filename, hostErrorMessage));
            });
            if (file) {
                seenNoDefaultLib = seenNoDefaultLib || file.hasNoDefaultLib;
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
                forEach(file.errors, e => {
                    errors.push(e);
                });
            }
        }
        return file;
    }

    function processReferencedFiles(file: SourceFile, basePath: string) {
        forEach(file.references, filename => {
            processSourceFile(normalizePath(combinePaths(basePath, filename)), /* isDefaultLib */ false, file);
        });
    }

    function processImportedModules(file: SourceFile, basePath: string) {
        forEach(file.declares, node => {
            if (node.kind === NodeKind.Import && (<ImportDeclaration>node).require) {
                var moduleName = (<ImportDeclaration>node).require;
                if (moduleName) {
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
            }
            else if (node.kind === NodeKind.Module && (node.flags & NodeFlags.ExternalModule)) {
                // TypeScript 1.0 spec (April 2014): 12.1.6
                // An AmbientExternalModuleDeclaration declares an external module.
                // This type of declaration is permitted only in the global module.
                // The StringLiteral must specify a top - level external module name.
                // Relative external module names are not permitted
                forEachChild(node, node => {
                    if (node.kind === NodeKind.Import && (<ImportDeclaration>node).require) {
                        var moduleName = (<ImportDeclaration>node).require;
                        if (moduleName) {
                            // TypeScript 1.0 spec (April 2014): 12.1.6
                            // An ExternalImportDeclaration in anAmbientExternalModuleDeclaration may reference other external modules
                            // only through top - level external module names. Relative external module names are not permitted.
                            var searchName = normalizePath(combinePaths(basePath, moduleName));
                            findSourceFile(searchName + ".d.json", false, file);
                        }
                    }
                });
            }
        });
    }

    function createSourceFile(filename: string, text: string): SourceFile {

        function scanSourceFile(file: SourceFile): void {

            file.kind = NodeKind.SourceFile;
            scanFlags(file);
            forEach(file.declares, scanModuleElementDeclaration);
        }

        function scanModuleElementDeclaration(node: ModuleElementDeclaration): void {

            switch(<any>node.kind) {
                case DeclarationKind.Interface:
                    scanInterfaceDeclaration(<InterfaceDeclaration>node);
                    break;
                case DeclarationKind.Class:
                    scanClassDeclaration(<ClassDeclaration>node);
                    break;
                case DeclarationKind.Enum:
                    scanEnumDeclaration(<EnumDeclaration>node);
                    break;
                case DeclarationKind.Module:
                    scanModuleDeclaration(<ModuleElementDeclaration>node);
                    break;
                case DeclarationKind.Function:
                    scanFunctionDeclaration(<FunctionDeclaration>node);
                    break;
                case DeclarationKind.Variable:
                    scanVariableDeclaration(<VariableDeclaration>node);
                    break;
                case DeclarationKind.Import:
                    scanImportDeclaration(<ImportDeclaration>node);
                    break;
            }
        }

        function scanInterfaceDeclaration(node: InterfaceDeclaration): void {

            node.kind = NodeKind.Interface;
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

            node.kind = NodeKind.Class;
            scanFlags(node);
            scanTypeParameterDeclarations(node.typeParameters);
            scanChildTypeReferenceNode(node, "extends");
            scanTypeReferenceNodes(node.implements);
            forEach(node.members, scanClassMemberDeclaration);
        }

        function scanEnumDeclaration(node: EnumDeclaration): void {

            node.kind = NodeKind.Enum;
            scanFlags(node);
            forEach(node.members, scanEnumMemberDeclaration);
        }

        function scanEnumMemberDeclaration(node: EnumMemberDeclaration): void {

            node.kind = NodeKind.EnumMember;
            scanFlags(node);
        }

        function scanModuleDeclaration(node: ModuleDeclaration): void {

            node.kind = NodeKind.Module;
            scanFlags(node);
            forEach(node.declares, scanModuleElementDeclaration);
        }

        function scanFunctionDeclaration(node: FunctionDeclaration): void {

            node.kind = NodeKind.Function;
            scanCallSignatureDeclaration(node);
        }

        function scanParameterDeclaration(node: ParameterDeclaration): void {

            if(!node) return;

            node.kind = NodeKind.Parameter;
            scanFlags(node);
            scanChildTypeNode(node, "type");
        }

        function scanVariableDeclaration(node: VariableDeclaration): void {

            node.kind = NodeKind.Variable;
            scanFlags(node);
            scanChildTypeNode(node, "type");
        }

        function scanImportDeclaration(node: ImportDeclaration): void {

            node.kind = NodeKind.Import;
            scanFlags(node);
        }

        function scanClassMemberDeclaration(node: MemberDeclaration): void {

            switch(<any>node.kind) {
                case DeclarationKind.Index:
                    scanIndexDeclaration(<IndexMemberDeclaration>node);
                    break;
                case DeclarationKind.Field:
                    scanFieldDeclaration(<FieldMemberDeclaration>node);
                    break;
                case DeclarationKind.Method:
                    scanMethodDeclaration(<MethodMemberDeclaration>node);
                    break;
                case DeclarationKind.Constructor:
                    scanConstructorDeclaration(<ConstructorMemberDeclaration>node);
                    break;
                case DeclarationKind.GetAccessor:
                    scanGetAccessorDeclaration(<GetAccessorMemberDeclaration>node);
                    break;
                case DeclarationKind.SetAccessor:
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
                case DeclarationKind.PropertySignature:
                    scanPropertySignatureDeclaration(<PropertySignatureDeclaration>node);
                    break;
                case DeclarationKind.ConstructSignature:
                    scanConstructSignatureDeclaration(<ConstructSignatureDeclaration>node);
                    break;
                case DeclarationKind.MethodSignature:
                    scanMethodSignatureDeclaration(<MethodSignatureDeclaration>node);
                    break;
                case DeclarationKind.IndexSignature:
                    scanIndexSignatureDeclaration(<IndexSignatureDeclaration>node);
                    break;
                case DeclarationKind.CallSignature:
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
                (<any>node)[typeNodeName] = createTypeReferenceNode(typeNode);
            }
            else {
                switch (<any>typeNode.kind) {
                    case DeclarationKind.FunctionType:
                        scanFunctionTypeNode(<FunctionTypeNode>typeNode);
                        break;
                    case DeclarationKind.ArrayType:
                        scanArrayTypeNode(<ArrayTypeNode>typeNode);
                        break;
                    case DeclarationKind.ConstructorType:
                        scanConstructorTypeNode(<ConstructorTypeNode>typeNode);
                        break;
                    case DeclarationKind.TypeReference:
                        scanTypeReferenceNode(<TypeReferenceNode>typeNode);
                        break;
                    case DeclarationKind.ObjectType:
                        scanObjectTypeNode(<ObjectTypeNode>typeNode);
                        break;
                }
            }
        }

        function scanFunctionTypeNode(node: FunctionTypeNode): void {

            scanCallSignature(node, NodeKind.FunctionType);
        }

        function scanArrayTypeNode(node: ArrayTypeNode): void {

            node.kind = NodeKind.ArrayType;
            scanChildTypeNode(node, "type");
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

        function scanTypeReferenceNode(node: TypeReferenceNode): void {

            node.kind = NodeKind.TypeReference;
            node.flags = NodeFlags.None;
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
            // TODO: add error to errors list
        }

        if(file) {
            file.filename = filename;
            scanSourceFile(file);
        }

        return file;
    }

    var flagMap: { [name: string]: NodeFlags } = {

        "external": NodeFlags.ExternalModule,
        "export": NodeFlags.Export,
        "private": NodeFlags.Private,
        "static": NodeFlags.Static,
        "optional": NodeFlags.QuestionMark,
        "rest": NodeFlags.Rest
    }

    var flags = Object.keys(flagMap);

    module DeclarationKind {

        export var Interface = "interface";
        export var Class = "class";
        export var Enum = "enum";
        export var Module = "module";
        export var Function = "function";
        export var Variable = "variable";
        export var Import = "import";
        export var Index = "index";
        export var Field = "field";
        export var Method = "method";
        export var Constructor = "constructor";
        export var GetAccessor = "get";
        export var SetAccessor = "set";
        export var PropertySignature = "property";
        export var ConstructSignature = "constructor";
        export var MethodSignature = "method";
        export var IndexSignature = "index";
        export var CallSignature = "call";
        export var FunctionType = "function";
        export var ArrayType = "array";
        export var ConstructorType = "constructor";
        export var TypeReference = "reference";
        export var ObjectType = "object";
    }
}