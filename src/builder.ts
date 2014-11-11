/// <reference path="diagnostics.ts"/>
/// <reference path="arrayUtil.ts"/>

module reflect {

    var nextNodeId = 1;
    var nextSymbolId = 1;

    var nodeLinks: NodeLinks[] = [];
    var symbolLinks: SymbolLinks[] = [];

    export var globals: SymbolTable = {};

    var errors: Diagnostic[] = [];

    var undefinedSymbol = new Symbol(SymbolFlags.Property | SymbolFlags.Transient, "undefined");
    var unknownSymbol = new Symbol(SymbolFlags.Property | SymbolFlags.Transient, "unknown");
    var resolvingSymbol = new Symbol(SymbolFlags.Transient, "__resolving__");

    var anyType = new IntrinsicType(TypeFlags.Any, "any");
    var stringType = new IntrinsicType(TypeFlags.String, "string");
    var numberType = new IntrinsicType(TypeFlags.Number, "number");
    var booleanType = new IntrinsicType(TypeFlags.Boolean, "boolean");
    var voidType = new IntrinsicType(TypeFlags.Void, "void");
    var undefinedType = new IntrinsicType(TypeFlags.Undefined, "undefined");
    var nullType = new IntrinsicType(TypeFlags.Null, "null");
    var unknownType = new IntrinsicType(TypeFlags.Any, "unknown");
    var resolvingType = new IntrinsicType(TypeFlags.Any, "__resolving__");

    var globalArraySymbol: Symbol;
    var globalArrayType: Type;

    globalArraySymbol = getGlobalSymbol("Array");
    globalArrayType = getDeclaredTypeOfSymbol(globalArraySymbol);

    var emptyObjectType = new ObjectType(TypeFlags.Anonymous);

    export function buildTypes(file: SourceFile): void {

        console.log('building types for ' + file.filename);
        scanSourceFile(file);
    }

    function scanSourceFile(file: SourceFile): void {

        forEach(file.declares, scanSourceElement);
    }

    function scanSourceElement(node: Node): void {

        switch(node.kind) {
            case NodeKind.Interface:
                scanInterfaceDeclaration(<InterfaceDeclaration>node);
                break;
            case NodeKind.Class:
                scanClassDeclaration(<ClassDeclaration>node);
                break;
            case NodeKind.Enum:
                scanEnumDeclaration(<EnumDeclaration>node);
                break;
            case NodeKind.Module:
                scanModuleDeclaration(<ModuleElementDeclaration>node);
                break;
            case NodeKind.Function:
                scanFunctionDeclaration(<FunctionDeclaration>node);
                break;
            case NodeKind.Variable:
                scanVariableDeclaration(<VariableDeclaration>node);
                break;
            case NodeKind.Import:
                scanImportDeclaration(<ImportDeclaration>node);
                break;
            case NodeKind.Index:
                scanIndexDeclaration(<IndexMemberDeclaration>node);
                break;
            case NodeKind.Field:
                scanFieldDeclaration(<FieldMemberDeclaration>node);
                break;
            case NodeKind.Method:
                scanMethodDeclaration(<MethodMemberDeclaration>node);
                break;
            case NodeKind.Constructor:
                scanConstructorDeclaration(<ConstructorMemberDeclaration>node);
                break;
            case NodeKind.GetAccessor:
                scanGetAccessorDeclaration(<GetAccessorMemberDeclaration>node);
                break;
            case NodeKind.SetAccessor:
                scanSetAccessorDeclaration(<SetAccessorMemberDeclaration>node);
                break;
            case NodeKind.PropertySignature:
                scanPropertySignatureDeclaration(<PropertySignatureDeclaration>node);
                break;
            case NodeKind.ConstructSignature:
                scanConstructSignatureDeclaration(<ConstructSignatureDeclaration>node);
                break;
            case NodeKind.MethodSignature:
                scanMethodSignatureDeclaration(<MethodSignatureDeclaration>node);
                break;
            case NodeKind.IndexSignature:
                scanIndexSignatureDeclaration(<IndexSignatureDeclaration>node);
                break;
            case NodeKind.CallSignature:
                scanCallSignatureDeclaration(<CallSignatureDeclaration>node);
                break;
            case NodeKind.FunctionType:
                scanFunctionTypeNode(<FunctionTypeNode>node);
                break;
            case NodeKind.ArrayType:
                scanArrayTypeNode(<ArrayTypeNode>node);
                break;
            case NodeKind.ConstructorType:
                scanConstructorTypeNode(<ConstructorTypeNode>node);
                break;
            case NodeKind.TypeReference:
                scanTypeReferenceNode(<TypeReferenceNode>node);
                break;
            case NodeKind.ObjectType:
                scanObjectTypeNode(<ObjectTypeNode>node);
                break;
        }
    }

    function scanInterfaceDeclaration(node: InterfaceDeclaration): void {

        forEach(node.typeParameters, scanTypeParameterDeclaration);
        forEach(node.extends, scanTypeReferenceNode);
        forEach(node.signatures, scanSourceElement);
    }

    function scanTypeParameterDeclaration(node: TypeParameterDeclaration): void {

        scanSourceElement(node.constraint);
    }

    function scanClassDeclaration(node: ClassDeclaration): void {

        var type = <InterfaceType>getDeclaredTypeOfSymbol(node.symbol);
        console.log('class');

        forEach(node.typeParameters, scanTypeParameterDeclaration);
        scanTypeReferenceNode(node.extends);
        forEach(node.implements, scanTypeReferenceNode);
        forEach(node.members, scanSourceElement);
    }

    function scanEnumDeclaration(node: EnumDeclaration): void {

        forEach(node.members, scanEnumMemberDeclaration);
    }

    function scanEnumMemberDeclaration(node: EnumMemberDeclaration): void {

    }

    function scanModuleDeclaration(node: ModuleDeclaration): void {

        forEach(node.declares, scanSourceElement);
    }

    function scanFunctionDeclaration(node: FunctionDeclaration): void {

        scanCallSignatureDeclaration(node);
    }

    function scanVariableDeclaration(node: VariableDeclaration): void {

        scanSourceElement(node.type);
    }

    function scanImportDeclaration(node: ImportDeclaration): void {

    }

    function scanIndexDeclaration(node: IndexMemberDeclaration): void {

        scanParameterDeclaration(node.parameter);
        scanSourceElement(node.returns);
    }

    function scanFieldDeclaration(node: FieldMemberDeclaration): void {

        scanSourceElement(node.type);
    }

    function scanMethodDeclaration(node: MethodMemberDeclaration): void {

        scanCallSignature(node);
    }

    function scanConstructorDeclaration(node: ConstructorMemberDeclaration): void {

        scanCallSignature(node);
    }

    function scanGetAccessorDeclaration(node: GetAccessorMemberDeclaration): void {

        scanSourceElement(node.returns);
    }

    function scanSetAccessorDeclaration(node: SetAccessorMemberDeclaration): void {

        scanParameterDeclaration(node.parameter);
    }

    function scanPropertySignatureDeclaration(node: PropertySignatureDeclaration): void {

        scanSourceElement(node.type);
    }

    function scanConstructSignatureDeclaration(node: ConstructSignatureDeclaration): void {

        scanCallSignature(node);
    }

    function scanMethodSignatureDeclaration(node: MethodSignatureDeclaration): void {

        scanCallSignature(node);
    }

    function scanIndexSignatureDeclaration(node: IndexSignatureDeclaration): void {

        scanParameterDeclaration(node.parameter);
        scanSourceElement(node.returns);
    }

    function scanCallSignatureDeclaration(node: CallSignatureDeclaration): void {

        scanCallSignature(node);
    }

    function scanCallSignature(node: CallSignatureDeclaration): void {

        forEach(node.typeParameters, scanTypeParameterDeclaration);
        forEach(node.parameters, scanParameterDeclaration);
        scanSourceElement(node.returns);
    }

    function scanParameterDeclaration(node: ParameterDeclaration): void {

        scanSourceElement(node.type);
    }

    function scanFunctionTypeNode(node: FunctionTypeNode): void {

        scanCallSignature(node);
    }

    function scanArrayTypeNode(node: ArrayTypeNode): void {

        scanSourceElement(node.type);
    }

    function scanConstructorTypeNode(node: ConstructorTypeNode): void {

        scanCallSignature(node);
    }

    function scanTypeReferenceNode(node: TypeReferenceNode): void {

    }

    function scanObjectTypeNode(node: ObjectTypeNode): void {

        forEach(node.signatures, scanSourceElement);
    }

    function getDeclaredTypeOfSymbol(symbol: Symbol): Type {
        if (symbol.flags & SymbolFlags.Class) {
            return getDeclaredTypeOfClass(symbol);
        }
        if (symbol.flags & SymbolFlags.Interface) {
            return getDeclaredTypeOfInterface(symbol);
        }
        if (symbol.flags & SymbolFlags.Enum) {
            return getDeclaredTypeOfEnum(symbol);
        }
        if (symbol.flags & SymbolFlags.TypeParameter) {
            return getDeclaredTypeOfTypeParameter(symbol);
        }
        if (symbol.flags & SymbolFlags.Import) {
            return getDeclaredTypeOfImport(symbol);
        }
        return unknownType;
    }

    function getDeclaredTypeOfClass(symbol: Symbol): InterfaceType {
        var links = getSymbolLinks(symbol);
        if (!links.declaredType) {
            var type: InterfaceType;
            var typeParameters = getTypeParametersOfClassOrInterface(symbol);
            if(!typeParameters) {
                type = links.declaredType = new InterfaceType(TypeFlags.Class, symbol);
            }
            else {
                type = links.declaredType = new GenericType(TypeFlags.Class, symbol, typeParameters);
            }
            type.baseTypes = [];
            var declaration = <ClassDeclaration>getDeclarationOfKind(symbol, NodeKind.Class);
            if (declaration.extends) {
                type.baseTypes.push(getTypeFromTypeReferenceNode(declaration.extends));
            }

            // TODO: get signatures from class
            /*
            type.declaredProperties = getNamedMembers(symbol.members);
            type.declaredCallSignatures = emptyArray;
            type.declaredConstructSignatures = emptyArray;
            type.declaredStringIndexType = getIndexTypeOfSymbol(symbol, IndexKind.String);
            type.declaredNumberIndexType = getIndexTypeOfSymbol(symbol, IndexKind.Number);
            */
        }
        return <InterfaceType>links.declaredType;
    }

    // Return combined list of type parameters from all declarations of a class or interface. Elsewhere we check they're all
    // the same, but even if they're not we still need the complete list to ensure instantiations supply type arguments
    // for all type parameters.
    function getTypeParametersOfClassOrInterface(symbol: Symbol): TypeParameter[] {
        var result: TypeParameter[];
        forEach(symbol.declarations, node => {
            if (node.kind === NodeKind.Interface || node.kind === NodeKind.Class) {
                var declaration = <InterfaceDeclaration>node;
                if (declaration.typeParameters && declaration.typeParameters.length) {
                    forEach(declaration.typeParameters, node => {
                        var tp = getDeclaredTypeOfTypeParameter(getSymbolOfNode(node));
                        if (!result) {
                            result = [tp];
                        }
                        else if (!contains(result, tp)) {
                            result.push(tp);
                        }
                    });
                }
            }
        });
        return result;
    }

    function getDeclaredTypeOfInterface(symbol: Symbol): InterfaceType {
        var links = getSymbolLinks(symbol);
        if (!links.declaredType) {
            var type: InterfaceType;
            var typeParameters = getTypeParametersOfClassOrInterface(symbol);
            if (!typeParameters) {
                type = links.declaredType = new InterfaceType(TypeFlags.Interface, symbol);
            }
            else {
                type = links.declaredType = new GenericType(TypeFlags.Interface, symbol, typeParameters);
            }
            type.baseTypes = [];
            forEach(symbol.declarations, declaration => {
                if (declaration.kind === NodeKind.Interface && (<InterfaceDeclaration>declaration).extends) {
                    forEach((<InterfaceDeclaration>declaration).extends, node => {
                        var baseType = getTypeFromTypeReferenceNode(node);
                        if (baseType !== unknownType) {
                            type.baseTypes.push(baseType);
                        }
                    });
                }
            });

            // TODO: get signatures from declarations
            /*
            type.declaredProperties = getNamedMembers(symbol.members);
            type.declaredCallSignatures = getSignaturesOfSymbol(symbol.members["__call"]);
            type.declaredConstructSignatures = getSignaturesOfSymbol(symbol.members["__new"]);
            type.declaredStringIndexType = getIndexTypeOfSymbol(symbol, IndexKind.String);
            type.declaredNumberIndexType = getIndexTypeOfSymbol(symbol, IndexKind.Number);
            */
        }
        return <InterfaceType>links.declaredType;
    }

    function getDeclaredTypeOfEnum(symbol: Symbol): Type {
        var links = getSymbolLinks(symbol);
        if (!links.declaredType) {
            var type = new Type(TypeFlags.Enum);
            type.symbol = symbol;
            links.declaredType = type;
        }
        return links.declaredType;
    }

    function getDeclaredTypeOfTypeParameter(symbol: Symbol): TypeParameter {
        var links = getSymbolLinks(symbol);
        if (!links.declaredType) {
            var type = new TypeParameter(TypeFlags.TypeParameter);
            type.symbol = symbol;
            if (!(<TypeParameterDeclaration>getDeclarationOfKind(symbol, NodeKind.TypeParameter)).constraint) {
                // TODO: do something here?
                //type.constraint = noConstraintType;
            }
            links.declaredType = type;
        }
        return <TypeParameter>links.declaredType;
    }

    function getDeclaredTypeOfImport(symbol: Symbol): Type {
        var links = getSymbolLinks(symbol);
        if (!links.declaredType) {
            links.declaredType = getDeclaredTypeOfSymbol(resolveImport(symbol));
        }
        return links.declaredType;
    }

    function getTypeFromArrayTypeNode(node: ArrayTypeNode): Type {
        var links = getNodeLinks(node);
        if (!links.resolvedType) {
            links.resolvedType = createArrayType(getTypeFromTypeNode(node.type));
        }
        return links.resolvedType;
    }

    function createArrayType(elementType: Type): Type {
        // globalArrayType will be undefined if we get here during creation of the Array type. This for example happens if
        // user code augments the Array type with call or construct signatures that have an array type as the return type.
        // We instead use globalArraySymbol to obtain the (not yet fully constructed) Array type.
        var arrayType = globalArrayType || getDeclaredTypeOfSymbol(globalArraySymbol);
        return arrayType !== emptyObjectType ? createTypeReference(<GenericType>arrayType, [elementType]) : emptyObjectType;
    }

    function getTypeFromTypeReferenceNode(node: TypeReferenceNode): Type {
        var links = getNodeLinks(node);
        if (!links.resolvedType) {

            // handle any string number boolean void
            switch(node.type) {
                case 'any':
                    return anyType;
                case 'string':
                    return stringType;
                case 'number':
                    return numberType;
                case 'boolean':
                    return booleanType;
                case 'void':
                    return voidType;
                default:
                    var symbol = resolveEntityName(node, node.type, SymbolFlags.Type);
                    if (symbol) {
                        var type = getDeclaredTypeOfSymbol(symbol);
                        if (type.flags & (TypeFlags.Class | TypeFlags.Interface) && type.flags & TypeFlags.Reference) {
                            var typeParameters = (<GenericType>type).typeParameters;
                            if (node.arguments && node.arguments.length === typeParameters.length) {
                                type = createTypeReference(<GenericType>type, map(node.arguments, t => getTypeFromTypeNode(t)));
                            }
                            else {
                                error(node, Diagnostics.Generic_type_0_requires_1_type_argument_s, symbol.name, typeParameters.length);
                                type = undefined;
                            }
                        }
                        else {
                            if (node.arguments) {
                                error(node, Diagnostics.Type_0_is_not_generic, symbol.name);
                                type = undefined;
                            }
                        }
                    }
                    break;
            }

            links.resolvedType = type || unknownType;
        }

        return links.resolvedType;
    }


    function createTypeReference(target: GenericType, typeArguments: Type[]): TypeReference {
        var id = getTypeListId(typeArguments);
        var type = target.instantiations[id];
        if (!type) {
            type = target.instantiations[id] = new TypeReference(target.symbol);
            type.target = target;
            type.typeArguments = typeArguments;
        }
        return type;
    }

    function getTypeListId(types: Type[]) {
        switch (types.length) {
            case 1:
                return "" + types[0].id;
            case 2:
                return types[0].id + "," + types[1].id;
            default:
                var result = "";
                for (var i = 0; i < types.length; i++) {
                    if (i > 0) result += ",";
                    result += types[i].id;
                }
                return result;
        }
    }

    function getTypeFromTypeNode(node: TypeNode): Type {
        switch (node.kind) {
            /*
            case NodeKind.StringLiteral:
                return getTypeFromStringLiteral(<StringLiteralTypeNode>node);
            case NodeKind.TypeQuery:
                return getTypeFromTypeQueryNode(<TypeQueryNode>node);
                */
            case NodeKind.TypeReference:
                return getTypeFromTypeReferenceNode(<TypeReferenceNode>node);
            case NodeKind.ArrayType:
                return getTypeFromArrayTypeNode(<ArrayTypeNode>node);
            //case NodeKind.TypeLiteral:
            //    return getTypeFromTypeLiteralNode(<TypeLiteralNode>node);
            // This function assumes that an identifier or qualified name is a type expression
            // Callers should first ensure this by calling isTypeNode
            default:
                return unknownType;
        }
    }

    // Resolves a qualified name and any involved import aliases
    function resolveEntityName(location: Node, name: string, meaning: SymbolFlags): Symbol;
    function resolveEntityName(location: Node, name: string[], meaning: SymbolFlags): Symbol;
    function resolveEntityName(location: Node, name: any, meaning: SymbolFlags): Symbol {

        if(!name) {
            return;
        }

        if(typeof name === "string") {
            return resolveEntityName(location, name.split('.'), meaning);
        }

        if (name.length == 1) {
            var symbol = resolveName(location, name[0], meaning);
            if (!symbol) {
                return;
            }
        }
        else {
            var rightName = name.pop();
            var namespace = resolveEntityName(location, name, SymbolFlags.Namespace);

            if (!namespace || namespace === unknownSymbol) return;

            var symbol = getSymbol(namespace.exports, rightName, meaning);
            if (!symbol) {
                error(location, Diagnostics.Module_0_has_no_exported_member_1, name.join('.'), rightName);
                return;
            }
        }

        return symbol.flags & meaning ? symbol : resolveImport(symbol);
    }

    function resolveImport(symbol: Symbol): Symbol {
        var links = getSymbolLinks(symbol);
        if (!links.target) {
            links.target = resolvingSymbol;
            var node = <ImportDeclaration>getDeclarationOfKind(symbol, NodeKind.Import);
            var target = node.require ?
                resolveExternalModuleName(node, node.require) :
                resolveEntityName(node, node.value, SymbolFlags.Value | SymbolFlags.Type | SymbolFlags.Namespace);
            if (links.target === resolvingSymbol) {
                links.target = target || unknownSymbol;
            }
            else {
                error(node, Diagnostics.Circular_definition_of_import_alias_0, symbol.name);
            }
        }
        else if (links.target === resolvingSymbol) {
            links.target = unknownSymbol;
        }
        return links.target;
    }

    function resolveExternalModuleName(location: Node, moduleName: string): Symbol {

        if (!moduleName) return;

        var searchPath = getDirectoryPath(getSourceFile(location).filename);
        var isRelative = isExternalModuleNameRelative(moduleName);
        if (!isRelative) {
            var symbol = getSymbol(globals, '"' + moduleName + '"', SymbolFlags.ValueModule);
            if (symbol) {
                return getResolvedExportSymbol(symbol);
            }
        }
        while (true) {
            var filename = normalizePath(combinePaths(searchPath, moduleName));
            var sourceFile = getLoadedSourceFile(filename + ".d.json");
            if (sourceFile || isRelative) break;
            var parentPath = getDirectoryPath(searchPath);
            if (parentPath === searchPath) break;
            searchPath = parentPath;
        }
        if (sourceFile) {
            if (sourceFile.symbol) {
                return getResolvedExportSymbol(sourceFile.symbol);
            }
            error(location, Diagnostics.File_0_is_not_an_external_module, sourceFile.filename);
            return;
        }
        error(location, Diagnostics.Cannot_find_external_module_0, moduleName);
    }

    function isExternalModuleNameRelative(moduleName: string): boolean {
        // TypeScript 1.0 spec (April 2014): 11.2.1
        // An external module name is "relative" if the first term is "." or "..".
        return moduleName.substr(0, 2) === "./" || moduleName.substr(0, 3) === "../" || moduleName.substr(0, 2) === ".\\" || moduleName.substr(0, 3) === "..\\";
    }

    function getResolvedExportSymbol(moduleSymbol: Symbol): Symbol {
        var symbol = getExportAssignmentSymbol(moduleSymbol);
        if (symbol) {
            if (symbol.flags & (SymbolFlags.Value | SymbolFlags.Type | SymbolFlags.Namespace)) {
                return symbol;
            }
            if (symbol.flags & SymbolFlags.Import) {
                return resolveImport(symbol);
            }
        }
        return moduleSymbol;
    }

    function getExportAssignmentSymbol(symbol: Symbol): Symbol {

        var symbolLinks = getSymbolLinks(symbol);
        if (!symbolLinks.exportAssignSymbol) {

            var block = getBlockWithExportAssignment(symbol);
            if(block) {
                var meaning = SymbolFlags.Value | SymbolFlags.Type | SymbolFlags.Namespace;
                var exportSymbol = resolveName(block, block.exportName, meaning);
            }
            symbolLinks.exportAssignSymbol = exportSymbol || unknownSymbol;
        }

        return symbolLinks.exportAssignSymbol === unknownSymbol ? undefined : symbolLinks.exportAssignSymbol;
    }

    function getBlockWithExportAssignment(symbol: Symbol): Block {

        for(var i = 0, l = symbol.declarations.length; i < l; i++) {

            var block = <Block>symbol.declarations[i];
            if(block.exportName) {
                return block;
            }
        }

        // return undefined if not found
    }

    function resolveName(location: Node, name: string, meaning: SymbolFlags): Symbol {

        var result: Symbol;
        var lastLocation: Node;

        function returnResolvedSymbol(s: Symbol) {
            if (!s) {
                error(location, Diagnostics.Cannot_find_name_0, name);
            }
            return s;
        }

        while (location) {
            // Locals of a source file are not in scope (because they get merged into the global symbol table)
            if (location.locals && !isGlobalSourceFile(location)) {
                if (result = getSymbol(location.locals, name, meaning)) {
                    return returnResolvedSymbol(result);
                }
            }
            switch (location.kind) {
                case NodeKind.SourceFile:
                    if (!(location.flags & NodeFlags.ExternalModule)) break;
                case NodeKind.Module:
                    if (result = getSymbol(getSymbolOfNode(location).exports, name, meaning & SymbolFlags.ModuleMember)) {
                        return returnResolvedSymbol(result);
                    }
                    break;
                case NodeKind.Enum:
                    if (result = getSymbol(getSymbolOfNode(location).exports, name, meaning & SymbolFlags.EnumMember)) {
                        return returnResolvedSymbol(result);
                    }
                    break;
                case NodeKind.Class:
                case NodeKind.Interface:
                    if (result = getSymbol(getSymbolOfNode(location).members, name, meaning & SymbolFlags.Type)) {
                        return returnResolvedSymbol(result);
                    }
                    break;
            }
            lastLocation = location;
            location = location.parent;
        }

        if (result = getSymbol(globals, name, meaning)) {
            return returnResolvedSymbol(result);
        }

        return returnResolvedSymbol(undefined);
    }

    function getSymbolOfNode(node: Node): Symbol {
        // TODO: verify this is OK
        return node.symbol;
//            return getMergedSymbol(node.symbol);
    }

    function isGlobalSourceFile(node: Node) {
        return node.kind === NodeKind.SourceFile && !(node.flags & NodeFlags.ExternalModule);
    }

    function getSymbol(symbols: SymbolTable, name: string, meaning: SymbolFlags): Symbol {
        if (meaning && hasProperty(symbols, name)) {
            var symbol = symbols[name];

            if (symbol.flags & meaning) {
                return symbol;
            }

            if (symbol.flags & SymbolFlags.Import) {
                var target = resolveImport(symbol);
                // unknown symbol will mean that there were reported error during import resolution
                // treat it as positive answer to avoid cascading errors
                if (target === unknownSymbol || target.flags & meaning) {
                    return symbol;
                }
            }
        }

        // return undefined if we can't find a symbol.
    }

    function getSourceFile(node: Node): SourceFile {
        return <SourceFile>getAncestor(node, NodeKind .SourceFile);
    }

    function getSymbolLinks(symbol: Symbol): SymbolLinks {
        //if (symbol.flags & SymbolFlags.Transient) return <TransientSymbol>symbol;
        if (!symbol.id) symbol.id = nextSymbolId++;
        return symbolLinks[symbol.id] || (symbolLinks[symbol.id] = {});
    }

    function getNodeLinks(node: Node): NodeLinks {
        if (!node.id) node.id = nextNodeId++;
        return nodeLinks[node.id] || (nodeLinks[node.id] = {});
    }

    function getAncestor(node: Node, kind: NodeKind): Node {
        switch (kind) {
            // special-cases that can be come first
            case NodeKind.Class:
                while (node) {
                    switch (node.kind) {
                        case NodeKind.Class:
                            return <ClassDeclaration>node;
                        case NodeKind.Enum:
                        case NodeKind.Interface:
                        case NodeKind.Module:
                        case NodeKind.Import:
                            // early exit cases - declarations cannot be nested in classes
                            return undefined;
                        default:
                            node = node.parent;
                            continue;
                    }
                }
                break;
            default:
                while (node) {
                    if (node.kind === kind) {
                        return node;
                    }
                    else {
                        node = node.parent;
                    }
                }
                break;
        }

        return undefined;
    }

    function getDeclarationOfKind(symbol: Symbol, kind: NodeKind): Declaration {
        var declarations = symbol.declarations;
        for (var i = 0; i < declarations.length; i++) {
            var declaration = declarations[i];
            if (declaration.kind === kind) {
                return declaration;
            }
        }

        return undefined;
    }

    function error(location: Node, message: DiagnosticMessage, arg0?: any, arg1?: any, arg2?: any): void {

        errors.push(new Diagnostic(getSourceFile(location), message, arg0, arg1, arg2));
    }

    function getGlobalSymbol(name: string): Symbol {
        return resolveName(undefined, name, SymbolFlags.Type);
    }
}