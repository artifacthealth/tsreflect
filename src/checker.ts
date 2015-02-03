/// <reference path="arrayUtil.ts"/>
/// <reference path="nodes.ts"/>
/// <reference path="diagnostics.ts"/>
/// <reference path="types.ts"/>
/// <reference path="typeImpl.ts"/>
/// <reference path="signatureImpl.ts"/>

module reflect {

    // Ternary values are defined such that
    // x & y is False if either x or y is False.
    // x & y is Maybe if either x or y is Maybe, but neither x or y is False.
    // x & y is True if both x and y are True.
    // x | y is False if both x and y are False.
    // x | y is Maybe if either x or y is Maybe, but neither x or y is True.
    // x | y is True if either x or y is True.
    export const enum Ternary {
        False = 0,
        Maybe = 1,
        True  = -1
    }

    var nextSymbolId = 1;
    var nextNodeId = 1;

    var typeCount = 0;

    var emptyArray: any[] = [];
    var emptySymbols: SymbolTable = {};

    var unknownSymbol = createSymbol(SymbolFlags.Property | SymbolFlags.Transient, "unknown");
    var resolvingSymbol = createSymbol(SymbolFlags.Transient, "__resolving__");

    var anyType = createIntrinsicType(TypeFlags.Any, "any");
    var stringType = createIntrinsicType(TypeFlags.String, "string");
    var numberType = createIntrinsicType(TypeFlags.Number, "number");
    var booleanType = createIntrinsicType(TypeFlags.Boolean, "boolean");
    var voidType = createIntrinsicType(TypeFlags.Void, "void");
    var undefinedType = createIntrinsicType(TypeFlags.Undefined, "undefined");
    var nullType = createIntrinsicType(TypeFlags.Null, "null");
    var unknownType = createIntrinsicType(TypeFlags.Any, "unknown");
    var resolvingType = createIntrinsicType(TypeFlags.Any, "__resolving__");

    var emptyObjectType = createAnonymousType(undefined, emptySymbols, emptyArray, emptyArray, undefined, undefined);
    var anyFunctionType = createAnonymousType(undefined, emptySymbols, emptyArray, emptyArray, undefined, undefined);
    var noConstraintType = createAnonymousType(undefined, emptySymbols, emptyArray, emptyArray, undefined, undefined);
    var inferenceFailureType = createAnonymousType(undefined, emptySymbols, emptyArray, emptyArray, undefined, undefined);

    var anySignature = createSignature(undefined, undefined, emptyArray, anyType, 0, false, false);
    var unknownSignature = createSignature(undefined, undefined, emptyArray, unknownType, 0, false, false);

    export var globals: SymbolTable = {};

    var globalArraySymbol: Symbol;

    var globalObjectType: ObjectType;
    var globalFunctionType: ObjectType;
    export var globalArrayType: ObjectType;
    var globalStringType: ObjectType;
    var globalNumberType: ObjectType;
    var globalBooleanType: ObjectType;

    var tupleTypes: Map<TupleType> = {};
    var unionTypes: Map<UnionType> = {};
    var stringLiteralTypes: Map<StringLiteralType> = {};

    var symbolLinks: SymbolLinks[] = [];
    var nodeLinks: NodeLinks[] = [];

    enum CharacterCodes {
        _ = 0x5F
    }

    function error(location: Node, message: DiagnosticMessage, arg0?: any, arg1?: any, arg2?: any): void {

        addDiagnostic(new Diagnostic(getSourceFile(location), message, arg0, arg1, arg2));
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

    function createSymbol(flags: SymbolFlags, name: string): Symbol {
        return new SymbolImpl(flags, name);
    }

    function getSymbolLinks(symbol: Symbol): SymbolLinks {
        if (symbol.flags & SymbolFlags.Transient) return <TransientSymbol>symbol;
        if (!symbol.id) symbol.id = nextSymbolId++;
        return symbolLinks[symbol.id] || (symbolLinks[symbol.id] = {});
    }

    function getNodeLinks(node: Node): NodeLinks {
        if (!node.id) node.id = nextNodeId++;
        return nodeLinks[node.id] || (nodeLinks[node.id] = {});
    }

    export function getSourceFile(node: Node): SourceFile {
        return <SourceFile>getAncestor(node, NodeKind.SourceFile);
    }

    function isGlobalSourceFile(node: Node) {
        return node.kind === NodeKind.SourceFile && !isExternalModule(<SourceFile>node);
    }

    function isExternalModule(file: SourceFile): boolean {
        return (file.flags & NodeFlags.ExternalModule) !== 0;
    }

    export function getSymbol(symbols: SymbolTable, name: string, meaning: SymbolFlags): Symbol {
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

    export function getExportedSymbols(symbols: SymbolTable, flags: SymbolFlags): Symbol[] {

        var matches: Symbol[] = [];

        for(var name in symbols) {
            if(symbols.hasOwnProperty(name)) {
                var symbol = symbols[name];

                if(symbol.flags & flags) {
                    matches.push(symbol);
                }
                else if (symbol.flags & SymbolFlags.Import) {
                    symbol = resolveImport(symbol);
                    // unknown symbol indicates there were reported errors during import resolution.
                    if (symbol !== unknownSymbol && symbol.flags & flags) {
                        matches.push(symbol);
                    }
                }
            }
        }

        return matches;
    }

    function resolveName(location: Node, name: string, meaning: SymbolFlags): Symbol {

        var errorLocation = location;
        var result: Symbol;
        var lastLocation: Node;

        function returnResolvedSymbol(s: Symbol) {
            if (!s) {
                error(errorLocation, Diagnostics.Cannot_find_name_0, name);
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
                    if (!isExternalModule(<SourceFile>location)) break;
                case NodeKind.ModuleDeclaration:
                    if (result = getSymbol(getSymbolOfNode(location).exports, name, meaning & SymbolFlags.ModuleMember)) {
                        return returnResolvedSymbol(result);
                    }
                    break;
                case NodeKind.EnumDeclaration:
                    if (result = getSymbol(getSymbolOfNode(location).exports, name, meaning & SymbolFlags.EnumMember)) {
                        return returnResolvedSymbol(result);
                    }
                    break;
                case NodeKind.ClassDeclaration:
                case NodeKind.InterfaceDeclaration:
                    if (result = getSymbol(getSymbolOfNode(location).members, name, meaning & SymbolFlags.Type)) {
                        if (lastLocation && lastLocation.flags & NodeFlags.Static) {
                            // TypeScript 1.0 spec (April 2014): 3.4.1
                            // The scope of a type parameter extends over the entire declaration
                            // with which the type parameter list is associated, with the exception of static member declarations in classes.
                            error(errorLocation, Diagnostics.Static_members_cannot_reference_class_type_parameters);
                            return undefined;
                        }
                        else {
                            return returnResolvedSymbol(result);
                        }
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

    function resolveImport(symbol: Symbol): Symbol {
        var links = getSymbolLinks(symbol);
        if (!links.target) {
            links.target = resolvingSymbol;
            var node = <ImportDeclaration>getDeclarationOfKind(symbol, NodeKind.ImportDeclaration);
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

    // Resolves a qualified name and any involved import aliases
    export function resolveEntityName(location: Node, name: string, meaning: SymbolFlags): Symbol;
    export function resolveEntityName(location: Node, name: string[], meaning: SymbolFlags): Symbol;
    export function resolveEntityName(location: Node, name: any, meaning: SymbolFlags): Symbol {

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
                error(location, Diagnostics.Module_0_has_no_exported_member_1, symbolToString(namespace), rightName);
                return;
            }
        }

        return symbol.flags & meaning ? symbol : resolveImport(symbol);
    }

    function getFullyQualifiedName(symbol: Symbol): string {
        return symbol.parent ? getFullyQualifiedName(symbol.parent) + "." + symbolToString(symbol) : symbolToString(symbol);
    }

    export function isExternalModuleNameRelative(moduleName: string): boolean {
        // TypeScript 1.0 spec (April 2014): 11.2.1
        // An external module name is "relative" if the first term is "." or "..".
        return moduleName.substr(0, 2) === "./" || moduleName.substr(0, 3) === "../" || moduleName.substr(0, 2) === ".\\" || moduleName.substr(0, 3) === "..\\";
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

    export function getResolvedExportSymbol(moduleSymbol: Symbol): Symbol {
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

    function getSymbolOfNode(node: Node): Symbol {
        return node.symbol;
    }

    function getParentOfSymbol(symbol: Symbol): Symbol {
        return symbol.parent;
    }

    function symbolIsValue(symbol: Symbol): boolean {
        // If it is an instantiated symbol, then it is a value if the symbol it is an
        // instantiation of is a value.
        if (symbol.flags & SymbolFlags.Instantiated) {
            return symbolIsValue(getSymbolLinks(symbol).target);
        }

        // If the symbol has the value flag, it is trivially a value.
        if (symbol.flags & SymbolFlags.Value) {
            return true;
        }

        // If it is an import, then it is a value if the symbol it resolves to is a value.
        if (symbol.flags & SymbolFlags.Import) {
            return (resolveImport(symbol).flags & SymbolFlags.Value) !== 0;
        }

        return false;
    }

    function createType(flags: TypeFlags): Type {
        var result = new TypeImpl(flags);
        result.id = typeCount++;
        return result;
    }

    function createIntrinsicType(kind: TypeFlags, intrinsicName: string): IntrinsicType {
        var type = <IntrinsicType>createType(kind);
        type.intrinsicName = intrinsicName;
        return type;
    }

    function createObjectType(kind: TypeFlags, symbol?: Symbol): ObjectType {
        var type = <ObjectType>createType(kind);
        type.symbol = symbol;
        return type;
    }

    // A reserved member name starts with two underscores followed by a non-underscore
    function isReservedMemberName(name: string) {
        return name.charCodeAt(0) === CharacterCodes._ && name.charCodeAt(1) === CharacterCodes._ && name.charCodeAt(2) !== CharacterCodes._;
    }

    function getNamedMembers(members: SymbolTable): Symbol[] {
        var result: Symbol[];
        for (var id in members) {
            if (hasProperty(members, id)) {
                if (!isReservedMemberName(id)) {
                    if (!result) result = [];
                    var symbol = members[id];
                    if (symbolIsValue(symbol)) {
                        result.push(symbol);
                    }
                }
            }
        }
        return result || emptyArray;
    }

    function setObjectTypeMembers(type: ObjectType, members: SymbolTable, callSignatures: Signature[], constructSignatures: Signature[], stringIndexType: Type, numberIndexType: Type): ResolvedType {
        (<ResolvedType>type).members = members;
        (<ResolvedType>type).properties = getNamedMembers(members);
        (<ResolvedType>type).callSignatures = callSignatures;
        (<ResolvedType>type).constructSignatures = constructSignatures;
        if (stringIndexType) (<ResolvedType>type).stringIndexType = stringIndexType;
        if (numberIndexType) (<ResolvedType>type).numberIndexType = numberIndexType;
        return <ResolvedType>type;
    }

    function createAnonymousType(symbol: Symbol, members: SymbolTable, callSignatures: Signature[], constructSignatures: Signature[], stringIndexType: Type, numberIndexType: Type): ResolvedType {
        return setObjectTypeMembers(createObjectType(TypeFlags.Anonymous, symbol),
            members, callSignatures, constructSignatures, stringIndexType, numberIndexType);
    }

    function isOptionalProperty(propertySymbol: Symbol): boolean {
        //  class C {
        //      constructor(public x?) { }
        //  }
        //
        // x is an optional parameter, but it is a required property.
        return propertySymbol.valueDeclaration &&
            hasQuestionToken(propertySymbol.valueDeclaration) &&
            propertySymbol.valueDeclaration.kind !== NodeKind.Parameter;
    }

    function hasDotDotDotToken(node: Node) {
        return node && node.kind === NodeKind.Parameter && (node.flags & NodeFlags.Rest) !== 0;
    }

    function hasQuestionToken(node: Node) {
        if (node) {
            switch (node.kind) {
                case NodeKind.Parameter:
                case NodeKind.MethodSignature:
                case NodeKind.PropertySignature:
                    return (node.flags & NodeFlags.QuestionMark) !== 0;
            }
        }

        return false;
    }


    function getTypeOfPrototypeProperty(prototype: Symbol): Type {
        // TypeScript 1.0 spec (April 2014): 8.4
        // Every class automatically contains a static property member named 'prototype',
        // the type of which is an instantiation of the class type with type Any supplied as a type argument for each type parameter.
        // It is an error to explicitly declare a static property member with the name 'prototype'.
        var classType = <InterfaceType>getDeclaredTypeOfSymbol(prototype.parent);
        return classType.typeParameters ? createTypeReference(<GenericType>classType, map(classType.typeParameters, _ => anyType)) : classType;
    }

    function getTypeOfVariableOrParameterOrPropertyDeclaration(declaration: VariableDeclaration): Type {
        // Use type from type annotation if one is present
        if (declaration.type) {
            return getTypeFromTypeNode(declaration.type);
        }
        if (declaration.kind === NodeKind.Parameter) {
            var func = <FunctionDeclaration>declaration.parent;
            // For a parameter of a set accessor, use the type of the get accessor if one is present
            if (func.kind === NodeKind.SetAccessor) {
                var getter = <GetAccessorMemberDeclaration>getDeclarationOfKind(declaration.parent.symbol, NodeKind.GetAccessor);
                if (getter) {
                    return getReturnTypeOfSignature(getSignatureFromDeclaration(getter));
                }
            }
        }

        // Rest parameters default to type any[], other parameters default to type any
        var type = hasDotDotDotToken(declaration) ? createArrayType(anyType) : anyType;
        return type;
    }

    function getTypeOfVariableOrParameterOrProperty(symbol: Symbol): Type {
        var links = getSymbolLinks(symbol);
        if (!links.type) {
            // Handle prototype property
            if (symbol.flags & SymbolFlags.Prototype) {
                return links.type = getTypeOfPrototypeProperty(symbol);
            }
            var declaration = symbol.valueDeclaration;
            // Handle variable, parameter or property
            links.type = resolvingType;
            var type = getTypeOfVariableOrParameterOrPropertyDeclaration(<VariableDeclaration>declaration);
            if (links.type === resolvingType) {
                links.type = type;
            }
        }
        else if (links.type === resolvingType) {
            links.type = anyType;
        }
        return links.type;
    }

    function getSetAccessorTypeAnnotationNode(accessor: SetAccessorMemberDeclaration): TypeNode {
        return accessor && accessor.parameter && accessor.parameter.type;
    }

    function getAnnotatedAccessorType(accessor: GetAccessorMemberDeclaration): Type {
        if (accessor) {
            if (accessor.kind === NodeKind.GetAccessor) {
                var getter = <GetAccessorMemberDeclaration>accessor;
                return getter.returns && getTypeFromTypeNode(getter.returns);
            }
            else {
                var setter = <SetAccessorMemberDeclaration>accessor;
                var setterTypeAnnotation = getSetAccessorTypeAnnotationNode(setter);
                return setterTypeAnnotation && getTypeFromTypeNode(setterTypeAnnotation);
            }
        }
        return undefined;
    }

    function getTypeOfAccessors(symbol: Symbol): Type {
        var links = getSymbolLinks(symbol);
        checkAndStoreTypeOfAccessors(symbol, links);
        return links.type;
    }

    function checkAndStoreTypeOfAccessors(symbol: Symbol, links?: SymbolLinks) {
        links = links || getSymbolLinks(symbol);
        if (!links.type) {
            links.type = resolvingType;
            var getter = <GetAccessorMemberDeclaration>getDeclarationOfKind(symbol, NodeKind.GetAccessor);
            var setter = <SetAccessorMemberDeclaration>getDeclarationOfKind(symbol, NodeKind.SetAccessor);

            var type: Type;

            // First try to see if the user specified a return type on the get-accessor.
            var getterReturnType = getAnnotatedAccessorType(getter);
            if (getterReturnType) {
                type = getterReturnType;
            }
            else {
                // If the user didn't specify a return type, try to use the set-accessor's parameter type.
                var setterParameterType = getAnnotatedAccessorType(setter);
                if (setterParameterType) {
                    type = setterParameterType;
                }
                else {
                    type = anyType;
                }
            }

            if (links.type === resolvingType) {
                links.type = type;
            }
        }
        else if (links.type === resolvingType) {
            links.type = anyType;
        }
    }

    function getTypeOfFuncClassEnumModule(symbol: Symbol): Type {
        var links = getSymbolLinks(symbol);
        if (!links.type) {
            links.type = createObjectType(TypeFlags.Anonymous, symbol);
        }
        return links.type;
    }

    function getTypeOfEnumMember(symbol: Symbol): Type {
        var links = getSymbolLinks(symbol);
        if (!links.type) {
            links.type = getDeclaredTypeOfEnum(getParentOfSymbol(symbol));
        }
        return links.type;
    }

    function getTypeOfImport(symbol: Symbol): Type {
        var links = getSymbolLinks(symbol);
        if (!links.type) {
            links.type = getTypeOfSymbol(resolveImport(symbol));
        }
        return links.type;
    }

    function getTypeOfInstantiatedSymbol(symbol: Symbol): Type {
        var links = getSymbolLinks(symbol);
        if (!links.type) {
            links.type = instantiateType(getTypeOfSymbol(links.target), links.mapper);
        }
        return links.type;
    }

    export function getTypeOfSymbol(symbol: Symbol): Type {
        if (symbol.flags & SymbolFlags.Instantiated) {
            return getTypeOfInstantiatedSymbol(symbol);
        }
        if (symbol.flags & (SymbolFlags.Variable | SymbolFlags.Property)) {
            return getTypeOfVariableOrParameterOrProperty(symbol);
        }
        if (symbol.flags & (SymbolFlags.Function | SymbolFlags.Method | SymbolFlags.Class | SymbolFlags.Enum | SymbolFlags.ValueModule)) {
            return getTypeOfFuncClassEnumModule(symbol);
        }
        if (symbol.flags & SymbolFlags.EnumMember) {
            return getTypeOfEnumMember(symbol);
        }
        if (symbol.flags & SymbolFlags.Accessor) {
            return getTypeOfAccessors(symbol);
        }
        if (symbol.flags & SymbolFlags.Import) {
            return getTypeOfImport(symbol);
        }
        return unknownType;
    }

    function getTargetType(type: ObjectType): Type {
        return type.flags & TypeFlags.Reference ? (<TypeReference>type).target : type;
    }

    function hasBaseType(type: InterfaceType, checkBase: InterfaceType) {
        return check(type);
        function check(type: InterfaceType): boolean {
            var target = <InterfaceType>getTargetType(type);
            return target === checkBase || forEach(target.baseTypes, check);
        }
    }

    // Return combined list of type parameters from all declarations of a class or interface. Elsewhere we check they're all
    // the same, but even if they're not we still need the complete list to ensure instantiations supply type arguments
    // for all type parameters.
    function getTypeParametersOfClassOrInterface(symbol: Symbol): TypeParameter[] {
        var result: TypeParameter[];
        forEach(symbol.declarations, node => {
            if (node.kind === NodeKind.InterfaceDeclaration || node.kind === NodeKind.ClassDeclaration) {
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

    function getDeclaredTypeOfClass(symbol: Symbol): InterfaceType {
        var links = getSymbolLinks(symbol);
        if (!links.declaredType) {
            var type = links.declaredType = <InterfaceType>createObjectType(TypeFlags.Class, symbol);
            var typeParameters = getTypeParametersOfClassOrInterface(symbol);
            if (typeParameters) {
                type.flags |= TypeFlags.Reference;
                type.typeParameters = typeParameters;
                (<GenericType>type).instantiations = {};
                (<GenericType>type).instantiations[getTypeListId(type.typeParameters)] = <GenericType>type;
                (<GenericType>type).target = <GenericType>type;
                (<GenericType>type).typeArguments = type.typeParameters;
            }
            type.baseTypes = [];
            var declaration = <ClassDeclaration>getDeclarationOfKind(symbol, NodeKind.ClassDeclaration);
            var baseTypeNode = getClassBaseTypeNode(declaration);
            if (baseTypeNode) {
                var baseType = getTypeFromTypeReferenceNode(baseTypeNode);
                if (baseType !== unknownType) {
                    if (getTargetType(baseType).flags & TypeFlags.Class) {
                        if (type !== baseType && !hasBaseType(<InterfaceType>baseType, type)) {
                            type.baseTypes.push(baseType);
                        }
                        else {
                            error(declaration, Diagnostics.Type_0_recursively_references_itself_as_a_base_type, typeToString(type));
                        }
                    }
                    else {
                        error(baseTypeNode, Diagnostics.A_class_may_only_extend_another_class);
                    }
                }
            }
            type.declaredProperties = getNamedMembers(symbol.members);
            type.declaredCallSignatures = emptyArray;
            type.declaredConstructSignatures = emptyArray;
            type.declaredStringIndexType = getIndexTypeOfSymbol(symbol, IndexKind.String);
            type.declaredNumberIndexType = getIndexTypeOfSymbol(symbol, IndexKind.Number);
        }
        return <InterfaceType>links.declaredType;
    }

    function getClassBaseTypeNode(node: ClassDeclaration): TypeReferenceNode {
        return node.extends;
    }

    export function getInterfaceBaseTypeNodes(node: InterfaceDeclaration) {
        return node.extends;
    }

    function getDeclaredTypeOfInterface(symbol: Symbol): InterfaceType {
        var links = getSymbolLinks(symbol);
        if (!links.declaredType) {
            var type = links.declaredType = <InterfaceType>createObjectType(TypeFlags.Interface, symbol);
            var typeParameters = getTypeParametersOfClassOrInterface(symbol);
            if (typeParameters) {
                type.flags |= TypeFlags.Reference;
                type.typeParameters = typeParameters;
                (<GenericType>type).instantiations = {};
                (<GenericType>type).instantiations[getTypeListId(type.typeParameters)] = <GenericType>type;
                (<GenericType>type).target = <GenericType>type;
                (<GenericType>type).typeArguments = type.typeParameters;
            }
            type.baseTypes = [];
            forEach(symbol.declarations, declaration => {
                if (declaration.kind === NodeKind.InterfaceDeclaration && getInterfaceBaseTypeNodes(<InterfaceDeclaration>declaration)) {
                    forEach(getInterfaceBaseTypeNodes(<InterfaceDeclaration>declaration), node => {
                        var baseType = getTypeFromTypeReferenceNode(node);
                        if (baseType !== unknownType) {
                            if (getTargetType(baseType).flags & (TypeFlags.Class | TypeFlags.Interface)) {
                                if (type !== baseType && !hasBaseType(<InterfaceType>baseType, type)) {
                                    type.baseTypes.push(baseType);
                                }
                                else {
                                    error(declaration, Diagnostics.Type_0_recursively_references_itself_as_a_base_type, typeToString(type));
                                }
                            }
                            else {
                                error(node, Diagnostics.An_interface_may_only_extend_a_class_or_another_interface);
                            }
                        }
                    });
                }
            });
            type.declaredProperties = getNamedMembers(symbol.members);
            type.declaredCallSignatures = getSignaturesOfSymbol(symbol.members["__call"]);
            type.declaredConstructSignatures = getSignaturesOfSymbol(symbol.members["__new"]);
            type.declaredStringIndexType = getIndexTypeOfSymbol(symbol, IndexKind.String);
            type.declaredNumberIndexType = getIndexTypeOfSymbol(symbol, IndexKind.Number);
        }
        return <InterfaceType>links.declaredType;
    }

    function getDeclaredTypeOfTypeAlias(symbol: Symbol): Type {
        var links = getSymbolLinks(symbol);
        if (!links.declaredType) {
            links.declaredType = resolvingType;
            var declaration = <TypeAliasDeclaration>getDeclarationOfKind(symbol, NodeKind.TypeAliasDeclaration);
            var type = getTypeFromTypeNode(declaration.type);
            if (links.declaredType === resolvingType) {
                links.declaredType = type;
            }
        }
        else if (links.declaredType === resolvingType) {
            links.declaredType = unknownType;
            var declaration = <TypeAliasDeclaration>getDeclarationOfKind(symbol, NodeKind.TypeAliasDeclaration);
            error(declaration, Diagnostics.Type_alias_0_circularly_references_itself, symbolToString(symbol));
        }
        return links.declaredType;
    }

    function getDeclaredTypeOfEnum(symbol: Symbol): Type {
        var links = getSymbolLinks(symbol);
        if (!links.declaredType) {
            var type = createType(TypeFlags.Enum);
            type.symbol = symbol;
            links.declaredType = type;
        }
        return links.declaredType;
    }

    function getDeclaredTypeOfTypeParameter(symbol: Symbol): TypeParameter {
        var links = getSymbolLinks(symbol);
        if (!links.declaredType) {
            var type = <TypeParameter>createType(TypeFlags.TypeParameter);
            type.symbol = symbol;
            if (!(<TypeParameterDeclaration>getDeclarationOfKind(symbol, NodeKind.TypeParameter)).constraint) {
                type.constraint = noConstraintType;
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

    export function getDeclaredTypeOfSymbol(symbol: Symbol): Type {
        if (symbol.flags & SymbolFlags.Class) {
            return getDeclaredTypeOfClass(symbol);
        }
        if (symbol.flags & SymbolFlags.Interface) {
            return getDeclaredTypeOfInterface(symbol);
        }
        if (symbol.flags & SymbolFlags.TypeAlias) {
            return getDeclaredTypeOfTypeAlias(symbol);
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

    function createSymbolTable(symbols: Symbol[]): SymbolTable {
        var result: SymbolTable = {};
        for (var i = 0; i < symbols.length; i++) {
            var symbol = symbols[i];
            result[symbol.name] = symbol;
        }
        return result;
    }

    function createInstantiatedSymbolTable(symbols: Symbol[], mapper: TypeMapper): SymbolTable {
        var result: SymbolTable = {};
        for (var i = 0; i < symbols.length; i++) {
            var symbol = symbols[i];
            result[symbol.name] = instantiateSymbol(symbol, mapper);
        }
        return result;
    }

    function addInheritedMembers(symbols: SymbolTable, baseSymbols: Symbol[]) {
        for (var i = 0; i < baseSymbols.length; i++) {
            var s = baseSymbols[i];
            if (!hasProperty(symbols, s.name)) {
                symbols[s.name] = s;
            }
        }
    }

    function resolveClassOrInterfaceMembers(type: InterfaceType): void {
        var members = type.symbol.members;
        var callSignatures = type.declaredCallSignatures;
        var constructSignatures = type.declaredConstructSignatures;
        var stringIndexType = type.declaredStringIndexType;
        var numberIndexType = type.declaredNumberIndexType;
        if (type.baseTypes.length) {
            members = createSymbolTable(type.declaredProperties);
            forEach(type.baseTypes, baseType => {
                addInheritedMembers(members, getPropertiesOfObjectType(baseType));
                callSignatures = concatenate(callSignatures, getSignaturesOfType(baseType, SignatureKind.Call));
                constructSignatures = concatenate(constructSignatures, getSignaturesOfType(baseType, SignatureKind.Construct));
                stringIndexType = stringIndexType || getIndexTypeOfType(baseType, IndexKind.String);
                numberIndexType = numberIndexType || getIndexTypeOfType(baseType, IndexKind.Number);
            });
        }
        setObjectTypeMembers(type, members, callSignatures, constructSignatures, stringIndexType, numberIndexType);
    }

    function resolveTypeReferenceMembers(type: TypeReference): void {
        var target = type.target;
        var mapper = createTypeMapper(target.typeParameters, type.typeArguments);
        var members = createInstantiatedSymbolTable(target.declaredProperties, mapper);
        var callSignatures = instantiateList(target.declaredCallSignatures, mapper, instantiateSignature);
        var constructSignatures = instantiateList(target.declaredConstructSignatures, mapper, instantiateSignature);
        var stringIndexType = target.declaredStringIndexType ? instantiateType(target.declaredStringIndexType, mapper) : undefined;
        var numberIndexType = target.declaredNumberIndexType ? instantiateType(target.declaredNumberIndexType, mapper) : undefined;
        forEach(target.baseTypes, baseType => {
            var instantiatedBaseType = instantiateType(baseType, mapper);
            addInheritedMembers(members, getPropertiesOfObjectType(instantiatedBaseType));
            callSignatures = concatenate(callSignatures, getSignaturesOfType(instantiatedBaseType, SignatureKind.Call));
            constructSignatures = concatenate(constructSignatures, getSignaturesOfType(instantiatedBaseType, SignatureKind.Construct));
            stringIndexType = stringIndexType || getIndexTypeOfType(instantiatedBaseType, IndexKind.String);
            numberIndexType = numberIndexType || getIndexTypeOfType(instantiatedBaseType, IndexKind.Number);
        });
        setObjectTypeMembers(type, members, callSignatures, constructSignatures, stringIndexType, numberIndexType);
    }

    function createSignature(declaration: SignatureDeclaration, typeParameters: TypeParameter[], parameters: Symbol[],
        resolvedReturnType: Type, minArgumentCount: number, hasRestParameter: boolean, hasStringLiterals: boolean): Signature {
        var sig = new SignatureImpl();
        sig.declaration = declaration;
        sig.typeParameters = typeParameters;
        sig.parameters = parameters;
        sig.resolvedReturnType = resolvedReturnType;
        sig.minArgumentCount = minArgumentCount;
        sig.hasRestParameter = hasRestParameter;
        sig.hasStringLiterals = hasStringLiterals;
        return sig;
    }

    function cloneSignature(sig: Signature): Signature {
        return createSignature(sig.declaration, sig.typeParameters, sig.parameters, sig.resolvedReturnType,
            sig.minArgumentCount, sig.hasRestParameter, sig.hasStringLiterals);
    }

    function getDefaultConstructSignatures(classType: InterfaceType): Signature[] {
        if (classType.baseTypes.length) {
            var baseType = classType.baseTypes[0];
            var baseSignatures = getSignaturesOfType(getTypeOfSymbol(baseType.symbol), SignatureKind.Construct);
            return map(baseSignatures, baseSignature => {
                var signature = baseType.flags & TypeFlags.Reference ?
                    getSignatureInstantiation(baseSignature, (<TypeReference>baseType).typeArguments) : cloneSignature(baseSignature);
                signature.typeParameters = classType.typeParameters;
                signature.resolvedReturnType = classType;
                return signature;
            });
        }
        return [createSignature(undefined, classType.typeParameters, emptyArray, classType, 0, false, false)];
    }

    function createTupleTypeMemberSymbols(memberTypes: Type[]): SymbolTable {
        var members: SymbolTable = {};
        for (var i = 0; i < memberTypes.length; i++) {
            var symbol = <TransientSymbol>createSymbol(SymbolFlags.Property | SymbolFlags.Transient, "" + i);
            symbol.type = memberTypes[i];
            members[i] = symbol;
        }
        return members;
    }

    function resolveTupleTypeMembers(type: TupleType) {
        var arrayType = resolveObjectOrUnionTypeMembers(createArrayType(getUnionType(type.elementTypes)));
        var members = createTupleTypeMemberSymbols(type.elementTypes);
        addInheritedMembers(members, arrayType.properties);
        setObjectTypeMembers(type, members, arrayType.callSignatures, arrayType.constructSignatures, arrayType.stringIndexType, arrayType.numberIndexType);
    }

    function signatureListsIdentical(s: Signature[], t: Signature[]): boolean {
        if (s.length !== t.length) {
            return false;
        }
        for (var i = 0; i < s.length; i++) {
            if (!compareSignatures(s[i], t[i], /*compareReturnTypes*/ false, compareTypes)) {
                return false;
            }
        }
        return true;
    }

    // If the lists of call or construct signatures in the given types are all identical except for return types,
    // and if none of the signatures are generic, return a list of signatures that has substitutes a union of the
    // return types of the corresponding signatures in each resulting signature.
    function getUnionSignatures(types: Type[], kind: SignatureKind): Signature[] {
        var signatureLists = map(types, t => getSignaturesOfType(t, kind));
        var signatures = signatureLists[0];
        for (var i = 0; i < signatures.length; i++) {
            if (signatures[i].typeParameters) {
                return emptyArray;
            }
        }
        for (var i = 1; i < signatureLists.length; i++) {
            if (!signatureListsIdentical(signatures, signatureLists[i])) {
                return emptyArray;
            }
        }
        var result = map(signatures, cloneSignature);
        for (var i = 0; i < result.length; i++) {
            var s = result[i];
            // Clear resolved return type we possibly got from cloneSignature
            s.resolvedReturnType = undefined;
            s.unionSignatures = map(signatureLists, signatures => signatures[i]);
        }
        return result;
    }

    function getUnionIndexType(types: Type[], kind: IndexKind): Type {
        var indexTypes: Type[] = [];
        for (var i = 0; i < types.length; i++) {
            var indexType = getIndexTypeOfType(types[i], kind);
            if (!indexType) {
                return undefined;
            }
            indexTypes.push(indexType);
        }
        return getUnionType(indexTypes);
    }

    function resolveUnionTypeMembers(type: UnionType) {
        // The members and properties collections are empty for union types. To get all properties of a union
        // type use getPropertiesOfType (only the language service uses this).
        var callSignatures = getUnionSignatures(type.types, SignatureKind.Call);
        var constructSignatures = getUnionSignatures(type.types, SignatureKind.Construct);
        var stringIndexType = getUnionIndexType(type.types, IndexKind.String);
        var numberIndexType = getUnionIndexType(type.types, IndexKind.Number);
        setObjectTypeMembers(type, emptySymbols, callSignatures, constructSignatures, stringIndexType, numberIndexType);
    }

    function resolveAnonymousTypeMembers(type: ObjectType) {
        var symbol = type.symbol;
        if (symbol.flags & SymbolFlags.TypeLiteral) {
            var members = symbol.members;
            var callSignatures = getSignaturesOfSymbol(members["__call"]);
            var constructSignatures = getSignaturesOfSymbol(members["__new"]);
            var stringIndexType = getIndexTypeOfSymbol(symbol, IndexKind.String);
            var numberIndexType = getIndexTypeOfSymbol(symbol, IndexKind.Number);
        }
        else {
            // Combinations of function, class, enum and module
            var members = emptySymbols;
            var callSignatures: Signature[] = emptyArray;
            var constructSignatures: Signature[] = emptyArray;
            if (symbol.flags & SymbolFlags.HasExports) {
                members = symbol.exports;
            }
            if (symbol.flags & (SymbolFlags.Function | SymbolFlags.Method)) {
                callSignatures = getSignaturesOfSymbol(symbol);
            }
            if (symbol.flags & SymbolFlags.Class) {
                var classType = getDeclaredTypeOfClass(symbol);
                constructSignatures = getSignaturesOfSymbol(symbol.members["__constructor"]);
                if (!constructSignatures.length) {
                    constructSignatures = getDefaultConstructSignatures(classType);
                }
                if (classType.baseTypes.length) {
                    members = createSymbolTable(getNamedMembers(members));
                    addInheritedMembers(members, getPropertiesOfObjectType(getTypeOfSymbol(classType.baseTypes[0].symbol)));
                }
            }
            var stringIndexType: Type = undefined;
            var numberIndexType: Type = (symbol.flags & SymbolFlags.Enum) ? stringType : undefined;
        }
        setObjectTypeMembers(type, members, callSignatures, constructSignatures, stringIndexType, numberIndexType);
    }

    function resolveObjectOrUnionTypeMembers(type: ObjectType): ResolvedType {
        if (!(<ResolvedType>type).members) {
            if (type.flags & (TypeFlags.Class | TypeFlags.Interface)) {
                resolveClassOrInterfaceMembers(<InterfaceType>type);
            }
            else if (type.flags & TypeFlags.Anonymous) {
                resolveAnonymousTypeMembers(<ObjectType>type);
            }
            else if (type.flags & TypeFlags.Tuple) {
                resolveTupleTypeMembers(<TupleType>type);
            }
            else if (type.flags & TypeFlags.Union) {
                resolveUnionTypeMembers(<UnionType>type);
            }
            else {
                resolveTypeReferenceMembers(<TypeReference>type);
            }
        }
        return <ResolvedType>type;
    }

    // Return properties of an object type or an empty array for other types
    function getPropertiesOfObjectType(type: Type): Symbol[] {
        if (type.flags & TypeFlags.ObjectType) {
            return resolveObjectOrUnionTypeMembers(<ObjectType>type).properties;
        }
        return emptyArray;
    }

    // If the given type is an object type and that type has a property by the given name, return
    // the symbol for that property. Otherwise return undefined.
    function getPropertyOfObjectType(type: Type, name: string): Symbol {
        if (type.flags & TypeFlags.ObjectType) {
            var resolved = resolveObjectOrUnionTypeMembers(<ObjectType>type);
            if (hasProperty(resolved.members, name)) {
                var symbol = resolved.members[name];
                if (symbolIsValue(symbol)) {
                    return symbol;
                }
            }
        }
    }

    function getPropertiesOfUnionType(type: UnionType): Symbol[] {
        var result: Symbol[] = [];
        forEach(getPropertiesOfType(type.types[0]), prop => {
            var unionProp = getPropertyOfUnionType(type, prop.name);
            if (unionProp) {
                result.push(unionProp);
            }
        });
        return result;
    }

    export function getPropertiesOfType(type: Type): Symbol[] {
        if (type.flags & TypeFlags.Union) {
            return getPropertiesOfUnionType(<UnionType>type);
        }
        return getPropertiesOfObjectType(getApparentType(type));
    }

    // For a type parameter, return the base constraint of the type parameter. For the string, number, and
    // boolean primitive types, return the corresponding object types.Otherwise return the type itself.
    // Note that the apparent type of a union type is the union type itself.
    function getApparentType(type: Type): Type {
        if (type.flags & TypeFlags.TypeParameter) {
            do {
                type = getConstraintOfTypeParameter(<TypeParameter>type);
            } while (type && type.flags & TypeFlags.TypeParameter);
            if (!type) {
                type = emptyObjectType;
            }
        }
        if (type.flags & TypeFlags.StringLike) {
            type = globalStringType;
        }
        else if (type.flags & TypeFlags.NumberLike) {
            type = globalNumberType;
        }
        else if (type.flags & TypeFlags.Boolean) {
            type = globalBooleanType;
        }
        return type;
    }

    function createUnionProperty(unionType: UnionType, name: string): Symbol {
        var types = unionType.types;
        var props: Symbol[];
        for (var i = 0; i < types.length; i++) {
            var type = getApparentType(types[i]);
            if (type !== unknownType) {
                var prop = getPropertyOfType(type, name);
                if (!prop) {
                    return undefined;
                }
                if (!props) {
                    props = [prop];
                }
                else {
                    props.push(prop);
                }
            }
        }
        var propTypes: Type[] = [];
        var declarations: Declaration[] = [];
        for (var i = 0; i < props.length; i++) {
            var prop = props[i];
            if (prop.declarations) {
                declarations.push.apply(declarations, prop.declarations);
            }
            propTypes.push(getTypeOfSymbol(prop));
        }
        var result = <TransientSymbol>createSymbol(SymbolFlags.Property | SymbolFlags.Transient | SymbolFlags.UnionProperty, name);
        result.unionType = unionType;
        result.declarations = declarations;
        result.type = getUnionType(propTypes);
        return result;
    }

    function getPropertyOfUnionType(type: UnionType, name: string): Symbol {
        var properties = type.resolvedProperties || (type.resolvedProperties = {});
        if (hasProperty(properties, name)) {
            return properties[name];
        }
        var property = createUnionProperty(type, name);
        if (property) {
            properties[name] = property;
        }
        return property;
    }

    // Return the symbol for the property with the given name in the given type. Creates synthetic union properties when
    // necessary, maps primitive types and type parameters are to their apparent types, and augments with properties from
    // Object and Function as appropriate.
    export function getPropertyOfType(type: Type, name: string): Symbol {
        if (type.flags & TypeFlags.Union) {
            return getPropertyOfUnionType(<UnionType>type, name);
        }
        if (!(type.flags & TypeFlags.ObjectType)) {
            type = getApparentType(type);
            if (!(type.flags & TypeFlags.ObjectType)) {
                return undefined;
            }
        }
        var resolved = resolveObjectOrUnionTypeMembers(type);
        if (hasProperty(resolved.members, name)) {
            var symbol = resolved.members[name];
            if (symbolIsValue(symbol)) {
                return symbol;
            }
        }
        if (resolved === anyFunctionType || resolved.callSignatures.length || resolved.constructSignatures.length) {
            var symbol = getPropertyOfObjectType(globalFunctionType, name);
            if (symbol) return symbol;
        }
        return getPropertyOfObjectType(globalObjectType, name);
    }

    function getSignaturesOfObjectOrUnionType(type: Type, kind: SignatureKind): Signature[] {
        if (type.flags & (TypeFlags.ObjectType | TypeFlags.Union)) {
            var resolved = resolveObjectOrUnionTypeMembers(<ObjectType>type);
            return kind === SignatureKind.Call ? resolved.callSignatures : resolved.constructSignatures;
        }
        return emptyArray;
    }

    // Return the signatures of the given kind in the given type. Creates synthetic union signatures when necessary and
    // maps primitive types and type parameters are to their apparent types.
    export function getSignaturesOfType(type: Type, kind: SignatureKind): Signature[] {
        return getSignaturesOfObjectOrUnionType(getApparentType(type), kind);
    }

    export function getIndexTypeOfObjectOrUnionType(type: Type, kind: IndexKind): Type {
        if (type.flags & (TypeFlags.ObjectType | TypeFlags.Union)) {
            var resolved = resolveObjectOrUnionTypeMembers(<ObjectType>type);
            return kind === IndexKind.String ? resolved.stringIndexType : resolved.numberIndexType;
        }
    }

    // Return the index type of the given kind in the given type. Creates synthetic union index types when necessary and
    // maps primitive types and type parameters are to their apparent types.
    export function getIndexTypeOfType(type: Type, kind: IndexKind): Type {
        return getIndexTypeOfObjectOrUnionType(getApparentType(type), kind);
    }

    // Return list of type parameters with duplicates removed (duplicate identifier errors are generated in the actual
    // type checking functions).
    function getTypeParametersFromDeclaration(typeParameterDeclarations: TypeParameterDeclaration[]): TypeParameter[] {
        var result: TypeParameter[] = [];
        forEach(typeParameterDeclarations, node => {
            var tp = getDeclaredTypeOfTypeParameter(node.symbol);
            if (!contains(result, tp)) {
                result.push(tp);
            }
        });
        return result;
    }

    function getSignatureFromDeclaration(declaration: CallSignatureDeclaration): Signature {
        var links = getNodeLinks(declaration);
        if (!links.resolvedSignature) {
            var classType = declaration.kind === NodeKind.Constructor ? getDeclaredTypeOfClass((<ClassDeclaration>declaration.parent).symbol) : undefined;
            var typeParameters = classType ? classType.typeParameters :
                declaration.typeParameters ? getTypeParametersFromDeclaration(declaration.typeParameters) : undefined;
            var parameters: Symbol[] = [];
            var hasStringLiterals = false;
            var minArgumentCount = -1;
            for (var i = 0, n = declaration.parameters.length; i < n; i++) {
                var param = declaration.parameters[i];
                parameters.push(param.symbol);
                if (param.type && param.type.kind === NodeKind.StringLiteral) {
                    hasStringLiterals = true;
                }
                if (minArgumentCount < 0) {
                    if (param.flags & (NodeFlags.QuestionMark | NodeFlags.Rest)) {
                        minArgumentCount = i;
                    }
                }
            }

            if (minArgumentCount < 0) {
                minArgumentCount = declaration.parameters.length;
            }

            var returnType: Type;
            if (classType) {
                returnType = classType;
            }
            else if (declaration.returns) {
                returnType = getTypeFromTypeNode(declaration.returns);
            }
            else {
                // TypeScript 1.0 spec (April 2014):
                // If only one accessor includes a type annotation, the other behaves as if it had the same type annotation.
                if (declaration.kind === NodeKind.GetAccessor) {
                    var setter = <SetAccessorMemberDeclaration>getDeclarationOfKind(declaration.symbol, NodeKind.SetAccessor);
                    returnType = getAnnotatedAccessorType(setter);
                }

                if (!returnType) {
                    returnType = anyType;
                }
            }

            links.resolvedSignature = createSignature(declaration, typeParameters, parameters, returnType,
                minArgumentCount, hasRestParameters(declaration), hasStringLiterals);
        }
        return links.resolvedSignature;
    }

    function hasRestParameters(s: CallSignatureDeclaration): boolean {
        return s.parameters.length > 0 && (s.parameters[s.parameters.length - 1].flags & NodeFlags.Rest) !== 0;
    }

    function getSignaturesOfSymbol(symbol: Symbol): Signature[] {
        if (!symbol) return emptyArray;
        var result: Signature[] = [];
        for (var i = 0, len = symbol.declarations.length; i < len; i++) {
            var node = symbol.declarations[i];
            switch (node.kind) {
                case NodeKind.FunctionType:
                case NodeKind.ConstructorType:
                case NodeKind.FunctionDeclaration:
                case NodeKind.Method:
                case NodeKind.MethodSignature:
                case NodeKind.Constructor:
                case NodeKind.CallSignature:
                case NodeKind.ConstructSignature:
                case NodeKind.IndexSignature:
                case NodeKind.GetAccessor:
                case NodeKind.SetAccessor:
                    result.push(getSignatureFromDeclaration(<SignatureDeclaration>node));
            }
        }
        return result;
    }

    export function getReturnTypeOfSignature(signature: Signature): Type {
        if (!signature.resolvedReturnType) {
            signature.resolvedReturnType = resolvingType;
            if (signature.target) {
                var type = instantiateType(getReturnTypeOfSignature(signature.target), signature.mapper);
            }
            else if (signature.unionSignatures) {
                var type = getUnionType(map(signature.unionSignatures, getReturnTypeOfSignature));
            }
            if (signature.resolvedReturnType === resolvingType) {
                signature.resolvedReturnType = type;
            }
        }
        else if (signature.resolvedReturnType === resolvingType) {
            signature.resolvedReturnType = anyType;
        }
        return signature.resolvedReturnType;
    }

    function getRestTypeOfSignature(signature: Signature): Type {
        if (signature.hasRestParameter) {
            var type = getTypeOfSymbol(signature.parameters[signature.parameters.length - 1]);
            if (type.flags & TypeFlags.Reference && (<TypeReference>type).target === globalArrayType) {
                return (<TypeReference>type).typeArguments[0];
            }
        }
        return anyType;
    }

    function getSignatureInstantiation(signature: Signature, typeArguments: Type[]): Signature {
        return instantiateSignature(signature, createTypeMapper(signature.typeParameters, typeArguments), true);
    }

    function getErasedSignature(signature: Signature): Signature {
        if (!signature.typeParameters) return signature;
        if (!signature.erasedSignatureCache) {
            if (signature.target) {
                signature.erasedSignatureCache = instantiateSignature(getErasedSignature(signature.target), signature.mapper);
            }
            else {
                signature.erasedSignatureCache = instantiateSignature(signature, createTypeEraser(signature.typeParameters), true);
            }
        }
        return signature.erasedSignatureCache;
    }

    function getIndexSymbol(symbol: Symbol): Symbol {
        return symbol.members["__index"];
    }

    function getIndexDeclarationOfSymbol(symbol: Symbol, kind: IndexKind): IndexSignatureDeclaration {

        var typeName = kind === IndexKind.Number ? "number" : "string";
        var indexSymbol = getIndexSymbol(symbol);
        if (indexSymbol) {
            var len = indexSymbol.declarations.length;
            for (var i = 0; i < len; i++) {
                var node = <IndexSignatureDeclaration>indexSymbol.declarations[i];
                if (node.parameter) {
                    var parameter = node.parameter;
                    if (parameter && parameter.type && parameter.type.kind === NodeKind.TypeReference) {
                        var reference = <TypeReferenceNode>parameter.type;
                        if(reference.type === typeName) {
                            return node;
                        }
                    }
                }
            }
        }

        return undefined;
    }

    function getIndexTypeOfSymbol(symbol: Symbol, kind: IndexKind): Type {
        var declaration = getIndexDeclarationOfSymbol(symbol, kind);
        return declaration
            ? declaration.returns ? getTypeFromTypeNode(declaration.returns) : anyType
            : undefined;
    }

    function getConstraintOfTypeParameter(type: TypeParameter): Type {
        if (!type.constraint) {
            if (type.target) {
                var targetConstraint = getConstraintOfTypeParameter(type.target);
                type.constraint = targetConstraint ? instantiateType(targetConstraint, type.mapper) : noConstraintType;
            }
            else {
                type.constraint = getTypeFromTypeNode((<TypeParameterDeclaration>getDeclarationOfKind(type.symbol, NodeKind.TypeParameter)).constraint);
            }
        }
        return type.constraint === noConstraintType ? undefined : type.constraint;
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

    function createTypeReference(target: GenericType, typeArguments: Type[]): TypeReference {
        var id = getTypeListId(typeArguments);
        var type = target.instantiations[id];
        if (!type) {
            type = target.instantiations[id] = <TypeReference>createObjectType(TypeFlags.Reference, target.symbol);
            type.target = target;
            type.typeArguments = typeArguments;
        }
        return type;
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

    function getTypeOfGlobalSymbol(symbol: Symbol, arity: number): ObjectType {

        if (!symbol) {
            return emptyObjectType;
        }

        return getDeclaredTypeOfSymbol(symbol);
    }

    function getGlobalSymbol(name: string): Symbol {
        return resolveName(undefined, name, SymbolFlags.Type);
    }

    function getGlobalType(name: string): ObjectType {
        return getTypeOfGlobalSymbol(getGlobalSymbol(name), 0);
    }

    function createArrayType(elementType: Type): Type {
        // globalArrayType will be undefined if we get here during creation of the Array type. This for example happens if
        // user code augments the Array type with call or construct signatures that have an array type as the return type.
        // We instead use globalArraySymbol to obtain the (not yet fully constructed) Array type.
        var arrayType = globalArrayType || getDeclaredTypeOfSymbol(globalArraySymbol);
        return arrayType !== emptyObjectType ? createTypeReference(<GenericType>arrayType, [elementType]) : emptyObjectType;
    }

    function getTypeFromArrayTypeNode(node: ArrayTypeNode): Type {
        var links = getNodeLinks(node);
        if (!links.resolvedType) {
            links.resolvedType = createArrayType(getTypeFromTypeNode(node.type));
        }
        return links.resolvedType;
    }

    function createTupleType(elementTypes: Type[]) {
        var id = getTypeListId(elementTypes);
        var type = tupleTypes[id];
        if (!type) {
            type = tupleTypes[id] = <TupleType>createObjectType(TypeFlags.Tuple);
            type.elementTypes = elementTypes;
        }
        return type;
    }

    function getTypeFromTupleTypeNode(node: TupleTypeNode): Type {
        var links = getNodeLinks(node);
        if (!links.resolvedType) {
            links.resolvedType = createTupleType(map(node.types, getTypeFromTypeNode));
        }
        return links.resolvedType;
    }

    function addTypeToSortedSet(sortedSet: Type[], type: Type) {
        if (type.flags & TypeFlags.Union) {
            addTypesToSortedSet(sortedSet, (<UnionType>type).types);
        }
        else {
            var i = 0;
            var id = type.id;
            while (i < sortedSet.length && sortedSet[i].id < id) {
                i++;
            }
            if (i === sortedSet.length || sortedSet[i].id !== id) {
                sortedSet.splice(i, 0, type);
            }
        }
    }

    function addTypesToSortedSet(sortedTypes: Type[], types: Type[]) {
        for (var i = 0, len = types.length; i < len; i++) {
            addTypeToSortedSet(sortedTypes, types[i]);
        }
    }

    function isSubtypeOfAny(candidate: Type, types: Type[]): boolean {
        for (var i = 0, len = types.length; i < len; i++) {
            if (candidate !== types[i] && isTypeSubtypeOf(candidate, types[i])) {
                return true;
            }
        }
        return false;
    }

    function removeSubtypes(types: Type[]) {
        var i = types.length;
        while (i > 0) {
            i--;
            if (isSubtypeOfAny(types[i], types)) {
                types.splice(i, 1);
            }
        }
    }

    function containsAnyType(types: Type[]) {
        for (var i = 0; i < types.length; i++) {
            if (types[i].flags & TypeFlags.Any) {
                return true;
            }
        }
        return false;
    }

    function removeAllButLast(types: Type[], typeToRemove: Type) {
        var i = types.length;
        while (i > 0 && types.length > 1) {
            i--;
            if (types[i] === typeToRemove) {
                types.splice(i, 1);
            }
        }
    }

    function getUnionType(types: Type[], noSubtypeReduction?: boolean): Type {
        if (types.length === 0) {
            return emptyObjectType;
        }
        var sortedTypes: Type[] = [];
        addTypesToSortedSet(sortedTypes, types);
        if (noSubtypeReduction) {
            if (containsAnyType(sortedTypes)) {
                return anyType;
            }
            removeAllButLast(sortedTypes, undefinedType);
            removeAllButLast(sortedTypes, nullType);
        }
        else {
            removeSubtypes(sortedTypes);
        }
        if (sortedTypes.length === 1) {
            return sortedTypes[0];
        }
        var id = getTypeListId(sortedTypes);
        var type = unionTypes[id];
        if (!type) {
            type = unionTypes[id] = <UnionType>createObjectType(TypeFlags.Union);
            type.types = sortedTypes;
        }
        return type;
    }

    function getTypeFromUnionTypeNode(node: UnionTypeNode): Type {
        var links = getNodeLinks(node);
        if (!links.resolvedType) {
            links.resolvedType = getUnionType(map(node.types, getTypeFromTypeNode), /*noSubtypeReduction*/ true);
        }
        return links.resolvedType;
    }

    function getTypeFromTypeLiteralOrFunctionOrConstructorTypeNode(node: Node): Type {
        var links = getNodeLinks(node);
        if (!links.resolvedType) {
            // Deferred resolution of members is handled by resolveObjectTypeMembers
            links.resolvedType = createObjectType(TypeFlags.Anonymous, node.symbol);
        }
        return links.resolvedType;
    }

    function getStringLiteralType(node: StringLiteralTypeNode): StringLiteralType {
        if (hasProperty(stringLiteralTypes, node.text)) return stringLiteralTypes[node.text];
        var type = stringLiteralTypes[node.text] = <StringLiteralType>createType(TypeFlags.StringLiteral);
        type.text = node.text;
        return type;
    }

    function getTypeFromStringLiteral(node: StringLiteralTypeNode): Type {
        var links = getNodeLinks(node);
        if (!links.resolvedType) {
            links.resolvedType = getStringLiteralType(node);
        }
        return links.resolvedType;
    }

    function getTypeFromTypeNode(node: TypeNode): Type {
        switch (node.kind) {
            case NodeKind.StringLiteral:
                return getTypeFromStringLiteral(<StringLiteralTypeNode>node);
            case NodeKind.TypeReference:
                return getTypeFromTypeReferenceNode(<TypeReferenceNode>node);
            case NodeKind.ArrayType:
                return getTypeFromArrayTypeNode(<ArrayTypeNode>node);
            case NodeKind.TupleType:
                return getTypeFromTupleTypeNode(<TupleTypeNode>node);
            case NodeKind.UnionType:
                return getTypeFromUnionTypeNode(<UnionTypeNode>node);
            case NodeKind.FunctionType:
            case NodeKind.ConstructorType:
            case NodeKind.ObjectType:
                return getTypeFromTypeLiteralOrFunctionOrConstructorTypeNode(node);
            default:
                return unknownType;
        }
    }

    function instantiateList<T>(items: T[], mapper: TypeMapper, instantiator: (item: T, mapper: TypeMapper) => T): T[] {
        if (items && items.length) {
            var result: T[] = [];
            for (var i = 0; i < items.length; i++) {
                result.push(instantiator(items[i], mapper));
            }
            return result;
        }
        return items;
    }

    function createUnaryTypeMapper(source: Type, target: Type): TypeMapper {
        return t => t === source ? target : t;
    }

    function createBinaryTypeMapper(source1: Type, target1: Type, source2: Type, target2: Type): TypeMapper {
        return t => t === source1 ? target1 : t === source2 ? target2 : t;
    }

    function createTypeMapper(sources: Type[], targets: Type[]): TypeMapper {
        switch (sources.length) {
            case 1: return createUnaryTypeMapper(sources[0], targets[0]);
            case 2: return createBinaryTypeMapper(sources[0], targets[0], sources[1], targets[1]);
        }
        return t => {
            for (var i = 0; i < sources.length; i++) {
                if (t === sources[i]) return targets[i];
            }
            return t;
        };
    }

    function createUnaryTypeEraser(source: Type): TypeMapper {
        return t => t === source ? anyType : t;
    }

    function createBinaryTypeEraser(source1: Type, source2: Type): TypeMapper {
        return t => t === source1 || t === source2 ? anyType : t;
    }

    function createTypeEraser(sources: Type[]): TypeMapper {
        switch (sources.length) {
            case 1: return createUnaryTypeEraser(sources[0]);
            case 2: return createBinaryTypeEraser(sources[0], sources[1]);
        }
        return t => {
            for (var i = 0; i < sources.length; i++) {
                if (t === sources[i]) return anyType;
            }
            return t;
        };
    }

    function identityMapper(type: Type): Type {
        return type;
    }

    function combineTypeMappers(mapper1: TypeMapper, mapper2: TypeMapper): TypeMapper {
        return t => mapper2(mapper1(t));
    }

    function instantiateTypeParameter(typeParameter: TypeParameter, mapper: TypeMapper): TypeParameter {
        var result = <TypeParameter>createType(TypeFlags.TypeParameter);
        result.symbol = typeParameter.symbol;
        if (typeParameter.constraint) {
            result.constraint = instantiateType(typeParameter.constraint, mapper);
        }
        else {
            result.target = typeParameter;
            result.mapper = mapper;
        }
        return result;
    }

    function instantiateSignature(signature: Signature, mapper: TypeMapper, eraseTypeParameters?: boolean): Signature {
        if (signature.typeParameters && !eraseTypeParameters) {
            var freshTypeParameters = instantiateList(signature.typeParameters, mapper, instantiateTypeParameter);
            mapper = combineTypeMappers(createTypeMapper(signature.typeParameters, freshTypeParameters), mapper);
        }
        var result = createSignature(signature.declaration, freshTypeParameters,
            instantiateList(signature.parameters, mapper, instantiateSymbol),
            signature.resolvedReturnType ? instantiateType(signature.resolvedReturnType, mapper) : undefined,
            signature.minArgumentCount, signature.hasRestParameter, signature.hasStringLiterals);
        result.target = signature;
        result.mapper = mapper;
        return result;
    }

    function instantiateSymbol(symbol: Symbol, mapper: TypeMapper): Symbol {
        if (symbol.flags & SymbolFlags.Instantiated) {
            var links = getSymbolLinks(symbol);
            // If symbol being instantiated is itself a instantiation, fetch the original target and combine the
            // type mappers. This ensures that original type identities are properly preserved and that aliases
            // always reference a non-aliases.
            symbol = links.target;
            mapper = combineTypeMappers(links.mapper, mapper);
        }

        // Keep the flags from the symbol we're instantiating.  Mark that is instantiated, and
        // also transient so that we can just store data on it directly.
        var result = <TransientSymbol>createSymbol(SymbolFlags.Instantiated | SymbolFlags.Transient | symbol.flags, symbol.name);
        result.declarations = symbol.declarations;
        result.parent = symbol.parent;
        result.target = symbol;
        result.mapper = mapper;
        if (symbol.valueDeclaration) {
            result.valueDeclaration = symbol.valueDeclaration;
        }

        return result;
    }

    function instantiateAnonymousType(type: ObjectType, mapper: TypeMapper): ObjectType {
        var result = <ResolvedType>createObjectType(TypeFlags.Anonymous, type.symbol);
        result.properties = instantiateList(getPropertiesOfObjectType(type), mapper, instantiateSymbol);
        result.members = createSymbolTable(result.properties);
        result.callSignatures = instantiateList(getSignaturesOfType(type, SignatureKind.Call), mapper, instantiateSignature);
        result.constructSignatures = instantiateList(getSignaturesOfType(type, SignatureKind.Construct), mapper, instantiateSignature);
        var stringIndexType = getIndexTypeOfType(type, IndexKind.String);
        var numberIndexType = getIndexTypeOfType(type, IndexKind.Number);
        if (stringIndexType) result.stringIndexType = instantiateType(stringIndexType, mapper);
        if (numberIndexType) result.numberIndexType = instantiateType(numberIndexType, mapper);
        return result;
    }

    function instantiateType(type: Type, mapper: TypeMapper): Type {
        if (mapper !== identityMapper) {
            if (type.flags & TypeFlags.TypeParameter) {
                return mapper(type);
            }
            if (type.flags & TypeFlags.Anonymous) {
                return type.symbol && type.symbol.flags & (SymbolFlags.Function | SymbolFlags.Method | SymbolFlags.TypeLiteral | SymbolFlags.ObjectLiteral) ?
                    instantiateAnonymousType(<ObjectType>type, mapper) : type;
            }
            if (type.flags & TypeFlags.Reference) {
                return createTypeReference((<TypeReference>type).target, instantiateList((<TypeReference>type).typeArguments, mapper, instantiateType));
            }
            if (type.flags & TypeFlags.Tuple) {
                return createTupleType(instantiateList((<TupleType>type).elementTypes, mapper, instantiateType));
            }
            if (type.flags & TypeFlags.Union) {
                return getUnionType(instantiateList((<UnionType>type).types, mapper, instantiateType), /*noSubtypeReduction*/ true);
            }
        }
        return type;
    }

    function typeToString(type: Type, fallback?: string): string {

        if(type.symbol) {
            return symbolToString(type.symbol);
        }

        return fallback || "Anonymous";
    }

    export function symbolToString(symbol: Symbol, containingSymbol?: Symbol): string {

        var name = "";
        var parentSymbol: Symbol;

        function writeSymbolName(symbol: Symbol): void {
            if (parentSymbol) {
                name += ".";
            }
            parentSymbol = symbol;
            if (symbol.declarations && symbol.declarations.length > 0) {
                var declaration = symbol.declarations[0];
                if (declaration.name) {
                    name += declaration.name;
                    return;
                }
            }

            name += symbol.name;
        }

        function walkSymbol(symbol: Symbol): void {
            if (containingSymbol && containingSymbol == symbol) {
                return;
            }
            if (symbol) {

                // Go up and add our parent.
                walkSymbol(symbol.parent);

                if (!parentSymbol && forEach(symbol.declarations, declaration => (declaration.flags & NodeFlags.ExternalModule))) {
                    return;
                }

                // if this is anonymous type break
                if (symbol.flags & SymbolFlags.TypeLiteral || symbol.flags & SymbolFlags.ObjectLiteral) {
                    return;
                }

                writeSymbolName(symbol);
            }
        }

        walkSymbol(symbol);

        return name;
    }


    // TYPE CHECKING

    var subtypeRelation: Map<boolean> = {};
    var assignableRelation: Map<boolean> = {};
    var identityRelation: Map<boolean> = {};

    export function isTypeIdenticalTo(source: Type, target: Type, diagnostics?: Diagnostic[]): boolean {
        return checkTypeRelatedTo(source, target, identityRelation, diagnostics);
    }

    export function isTypeSubtypeOf(source: Type, target: Type, diagnostics?: Diagnostic[]): boolean {
        return checkTypeRelatedTo(source, target, subtypeRelation, diagnostics);
    }

    export function isTypeAssignableTo(source: Type, target: Type, diagnostics?: Diagnostic[]): boolean {
        return checkTypeRelatedTo(source, target, assignableRelation, diagnostics);
    }

    function compareTypes(source: Type, target: Type): Ternary {
        return checkTypeRelatedTo(source, target, identityRelation, /*errorNode*/ undefined) ? Ternary.True : Ternary.False;
    }

    function getTargetSymbol(s: Symbol) {
        // if symbol is instantiated it's flags are not copied from the 'target'
        // so we'll need to get back original 'target' symbol to work with correct set of flags
        return s.flags & SymbolFlags.Instantiated ? getSymbolLinks(s).target : s;
    }

    function checkTypeRelatedTo(source: Type, target: Type, relation: Map<boolean>, diagnostics: Diagnostic[]): boolean {

        var errorInfo: DiagnosticMessageChain;
        var sourceStack: ObjectType[];
        var targetStack: ObjectType[];
        var maybeStack: Map<boolean>[];
        var expandingFlags: number;
        var depth = 0;
        var overflow = false;

        var result = isRelatedTo(source, target, true);
        if (overflow) {
            error(undefined, Diagnostics.Excessive_stack_depth_comparing_types_0_and_1, sourceTypeString(), targetTypeString());
        }
        else if (errorInfo && diagnostics) {

            // push all diagnostics in the chain into the diagnostics array
            var chain = errorInfo;
            while (chain) {
                diagnostics.push(chain.diagnostic);
                chain = chain.next;
            }
        }
        return result !== Ternary.False;

        function sourceTypeString() {
            return typeToString(source, "source");
        }

        function targetTypeString() {
            return typeToString(target, "target");
        }

        function reportError(message: DiagnosticMessage, arg0?: string, arg1?: string, arg2?: string): void {

            errorInfo = chainDiagnosticMessages(errorInfo, new Diagnostic(undefined, message, arg0, arg1, arg2));
        }

        // Compare two types and return
        // Ternary.True if they are related with no assumptions,
        // Ternary.Maybe if they are related with assumptions of other relationships, or
        // Ternary.False if they are not related.
        function isRelatedTo(source: Type, target: Type, reportErrors?: boolean): Ternary {
            var result: Ternary;
            if (relation === identityRelation) {
                // both types are the same - covers 'they are the same primitive type or both are Any' or the same type parameter cases
                if (source === target) return Ternary.True;
            }
            else {
                if (source === target) return Ternary.True;
                if (target.flags & TypeFlags.Any) return Ternary.True;
                if (source === undefinedType) return Ternary.True;
                if (source === nullType && target !== undefinedType) return Ternary.True;
                if (source.flags & TypeFlags.Enum && target === numberType) return Ternary.True;
                if (source.flags & TypeFlags.StringLiteral && target === stringType) return Ternary.True;
                if (relation === assignableRelation) {
                    if (source.flags & TypeFlags.Any) return Ternary.True;
                    if (source === numberType && target.flags & TypeFlags.Enum) return Ternary.True;
                }
            }
            if (source.flags & TypeFlags.Union) {
                if (result = unionTypeRelatedToType(<UnionType>source, target, reportErrors)) {
                    return result;
                }
            }
            else if (target.flags & TypeFlags.Union) {
                if (result = typeRelatedToUnionType(source, <UnionType>target, reportErrors)) {
                    return result;
                }
            }
            else if (source.flags & TypeFlags.TypeParameter && target.flags & TypeFlags.TypeParameter) {
                if (result = typeParameterRelatedTo(<TypeParameter>source, <TypeParameter>target, reportErrors)) {
                    return result;
                }
            }
            else {
                var saveErrorInfo = errorInfo;
                if (source.flags & TypeFlags.Reference && target.flags & TypeFlags.Reference && (<TypeReference>source).target === (<TypeReference>target).target) {
                    // We have type references to same target type, see if relationship holds for all type arguments
                    if (result = typesRelatedTo((<TypeReference>source).typeArguments, (<TypeReference>target).typeArguments, reportErrors)) {
                        return result;
                    }
                }
                // Even if relationship doesn't hold for type arguments, it may hold in a structural comparison
                // Report structural errors only if we haven't reported any errors yet
                var reportStructuralErrors = reportErrors && errorInfo === saveErrorInfo;
                // identity relation does not use apparent type
                var sourceOrApparentType = relation === identityRelation ? source : getApparentType(source);
                if (sourceOrApparentType.flags & TypeFlags.ObjectType && target.flags & TypeFlags.ObjectType &&
                    (result = objectTypeRelatedTo(sourceOrApparentType, <ObjectType>target, reportStructuralErrors))) {
                    errorInfo = saveErrorInfo;
                    return result;
                }
            }
            if (reportErrors) {
                // The error should end in a period when this is the deepest error in the chain
                // (when errorInfo is undefined). Otherwise, it has a colon before the nested
                // error.

                var chainedMessage = Diagnostics.Type_0_is_not_assignable_to_type_1_Colon;
                var terminalMessage = Diagnostics.Type_0_is_not_assignable_to_type_1;
                var diagnosticKey = errorInfo ? chainedMessage : terminalMessage;

                reportError(diagnosticKey, sourceTypeString(), targetTypeString());
            }
            return Ternary.False;
        }

        function typeRelatedToUnionType(source: Type, target: UnionType, reportErrors: boolean): Ternary {
            var targetTypes = target.types;
            for (var i = 0, len = targetTypes.length; i < len; i++) {
                var related = isRelatedTo(source, targetTypes[i], reportErrors && i === len - 1);
                if (related) {
                    return related;
                }
            }
            return Ternary.False;
        }

        function unionTypeRelatedToType(source: UnionType, target: Type, reportErrors: boolean): Ternary {
            var result = Ternary.True;
            var sourceTypes = source.types;
            for (var i = 0, len = sourceTypes.length; i < len; i++) {
                var related = isRelatedTo(sourceTypes[i], target, reportErrors);
                if (!related) {
                    return Ternary.False;
                }
                result &= related;
            }
            return result;
        }

        function typesRelatedTo(sources: Type[], targets: Type[], reportErrors: boolean): Ternary {
            var result = Ternary.True;
            for (var i = 0, len = sources.length; i < len; i++) {
                var related = isRelatedTo(sources[i], targets[i], reportErrors);
                if (!related) {
                    return Ternary.False;
                }
                result &= related;
            }
            return result;
        }

        function typeParameterRelatedTo(source: TypeParameter, target: TypeParameter, reportErrors: boolean): Ternary {
            if (relation === identityRelation) {
                if (source.symbol.name !== target.symbol.name) {
                    return Ternary.False;
                }
                // covers case when both type parameters does not have constraint (both equal to noConstraintType)
                if (source.constraint === target.constraint) {
                    return Ternary.True;
                }
                if (source.constraint === noConstraintType || target.constraint === noConstraintType) {
                    return Ternary.False;
                }
                return isRelatedTo(source.constraint, target.constraint, reportErrors);
            }
            else {
                while (true) {
                    var constraint = getConstraintOfTypeParameter(source);
                    if (constraint === target) return Ternary.True;
                    if (!(constraint && constraint.flags & TypeFlags.TypeParameter)) break;
                    source = <TypeParameter>constraint;
                }
                return Ternary.False;
            }
        }

        // Determine if two object types are related by structure. First, check if the result is already available in the global cache.
        // Second, check if we have already started a comparison of the given two types in which case we assume the result to be true.
        // Third, check if both types are part of deeply nested chains of generic type instantiations and if so assume the types are
        // equal and infinitely expanding. Fourth, if we have reached a depth of 100 nested comparisons, assume we have runaway recursion
        // and issue an error. Otherwise, actually compare the structure of the two types.
        function objectTypeRelatedTo(source: ObjectType, target: ObjectType, reportErrors: boolean): Ternary {
            if (overflow) {
                return Ternary.False;
            }
            var id = source.id + "," + target.id;
            var related = relation[id];
            if (related !== undefined) {
                return related ? Ternary.True : Ternary.False;
            }
            if (depth > 0) {
                for (var i = 0; i < depth; i++) {
                    // If source and target are already being compared, consider them related with assumptions
                    if (maybeStack[i][id]) {
                        return Ternary.Maybe;
                    }
                }
                if (depth === 100) {
                    overflow = true;
                    return Ternary.False;
                }
            }
            else {
                sourceStack = [];
                targetStack = [];
                maybeStack = [];
                expandingFlags = 0;
            }
            sourceStack[depth] = source;
            targetStack[depth] = target;
            maybeStack[depth] = {};
            maybeStack[depth][id] = true;
            depth++;
            var saveExpandingFlags = expandingFlags;
            if (!(expandingFlags & 1) && isDeeplyNestedGeneric(source, sourceStack)) expandingFlags |= 1;
            if (!(expandingFlags & 2) && isDeeplyNestedGeneric(target, targetStack)) expandingFlags |= 2;
            if (expandingFlags === 3) {
                var result = Ternary.Maybe;
            }
            else {
                var result = propertiesRelatedTo(source, target, reportErrors);
                if (result) {
                    result &= signaturesRelatedTo(source, target, SignatureKind.Call, reportErrors);
                    if (result) {
                        result &= signaturesRelatedTo(source, target, SignatureKind.Construct, reportErrors);
                        if (result) {
                            result &= stringIndexTypesRelatedTo(source, target, reportErrors);
                            if (result) {
                                result &= numberIndexTypesRelatedTo(source, target, reportErrors);
                            }
                        }
                    }
                }
            }
            expandingFlags = saveExpandingFlags;
            depth--;
            if (result) {
                var maybeCache = maybeStack[depth];
                // If result is definitely true, copy assumptions to global cache, else copy to next level up
                var destinationCache = result === Ternary.True || depth === 0 ? relation : maybeStack[depth - 1];
                for (var p in maybeCache) {
                    destinationCache[p] = maybeCache[p];
                }
            }
            else {
                // A false result goes straight into global cache (when something is false under assumptions it
                // will also be false without assumptions)
                relation[id] = false;
            }
            return result;
        }

        // Return true if the given type is part of a deeply nested chain of generic instantiations. We consider this to be the case
        // when structural type comparisons have been started for 10 or more instantiations of the same generic type. It is possible,
        // though highly unlikely, for this test to be true in a situation where a chain of instantiations is not infinitely expanding.
        // Effectively, we will generate a false positive when two types are structurally equal to at least 10 levels, but unequal at
        // some level beyond that.
        function isDeeplyNestedGeneric(type: ObjectType, stack: ObjectType[]): boolean {
            if (type.flags & TypeFlags.Reference && depth >= 10) {
                var target = (<TypeReference>type).target;
                var count = 0;
                for (var i = 0; i < depth; i++) {
                    var t = stack[i];
                    if (t.flags & TypeFlags.Reference && (<TypeReference>t).target === target) {
                        count++;
                        if (count >= 10) return true;
                    }
                }
            }
            return false;
        }

        function propertiesRelatedTo(source: ObjectType, target: ObjectType, reportErrors: boolean): Ternary {
            if (relation === identityRelation) {
                return propertiesIdenticalTo(source, target);
            }
            var result = Ternary.True;
            var properties = getPropertiesOfObjectType(target);
            for (var i = 0; i < properties.length; i++) {
                var targetProp = properties[i];
                var sourceProp = getPropertyOfType(source, targetProp.name);
                if (sourceProp !== targetProp) {
                    if (!sourceProp) {
                        if (relation === subtypeRelation || !isOptionalProperty(targetProp)) {
                            if (reportErrors) {
                                reportError(Diagnostics.Property_0_is_missing_in_type_1, symbolToString(targetProp), sourceTypeString());
                            }
                            return Ternary.False;
                        }
                    }
                    else if (!(targetProp.flags & SymbolFlags.Prototype)) {
                        var sourceFlags = getDeclarationFlagsFromSymbol(sourceProp);
                        var targetFlags = getDeclarationFlagsFromSymbol(targetProp);
                        if (sourceFlags & NodeFlags.Private || targetFlags & NodeFlags.Private) {
                            if (sourceProp.valueDeclaration !== targetProp.valueDeclaration) {
                                if (reportErrors) {
                                    if (sourceFlags & NodeFlags.Private && targetFlags & NodeFlags.Private) {
                                        reportError(Diagnostics.Types_have_separate_declarations_of_a_private_property_0, symbolToString(targetProp));
                                    }
                                    else {
                                        reportError(Diagnostics.Property_0_is_private_in_type_1_but_not_in_type_2, symbolToString(targetProp),
                                            sourceFlags & NodeFlags.Private ? sourceTypeString() : targetTypeString(),
                                            sourceFlags & NodeFlags.Private ? targetTypeString() : sourceTypeString());

                                    }
                                }
                                return Ternary.False;
                            }
                        }
                        else if (targetFlags & NodeFlags.Protected) {
                            var sourceDeclaredInClass = sourceProp.parent && sourceProp.parent.flags & SymbolFlags.Class;
                            var sourceClass = sourceDeclaredInClass ? <InterfaceType>getDeclaredTypeOfSymbol(sourceProp.parent) : undefined;
                            var targetClass = <InterfaceType>getDeclaredTypeOfSymbol(targetProp.parent);
                            if (!sourceClass || !hasBaseType(sourceClass, targetClass)) {
                                if (reportErrors) {
                                    reportError(Diagnostics.Property_0_is_protected_but_type_1_is_not_a_class_derived_from_2,
                                        symbolToString(targetProp), typeToString(sourceClass || source, "source"), typeToString(targetClass, "target"));
                                }
                                return Ternary.False;
                            }
                        }
                        else if (sourceFlags & NodeFlags.Protected) {
                            if (reportErrors) {
                                reportError(Diagnostics.Property_0_is_protected_in_type_1_but_public_in_type_2,
                                    symbolToString(targetProp), sourceTypeString(), targetTypeString());
                            }
                            return Ternary.False;
                        }
                        var related = isRelatedTo(getTypeOfSymbol(sourceProp), getTypeOfSymbol(targetProp), reportErrors);
                        if (!related) {
                            if (reportErrors) {
                                reportError(Diagnostics.Types_of_property_0_are_incompatible, symbolToString(targetProp));
                            }
                            return Ternary.False;
                        }
                        result &= related;
                        if (isOptionalProperty(sourceProp) && !isOptionalProperty(targetProp)) {
                            // TypeScript 1.0 spec (April 2014): 3.8.3
                            // S is a subtype of a type T, and T is a supertype of S if ...
                            // S' and T are object types and, for each member M in T..
                            // M is a property and S' contains a property N where
                            // if M is a required property, N is also a required property
                            // (M - property in T)
                            // (N - property in S)
                            if (reportErrors) {
                                reportError(Diagnostics.Property_0_is_optional_in_type_1_but_required_in_type_2,
                                    symbolToString(targetProp), sourceTypeString(), targetTypeString());
                            }
                            return Ternary.False;
                        }
                    }
                }
            }
            return result;
        }

        function propertiesIdenticalTo(source: ObjectType, target: ObjectType): Ternary {
            var sourceProperties = getPropertiesOfObjectType(source);
            var targetProperties = getPropertiesOfObjectType(target);
            if (sourceProperties.length !== targetProperties.length) {
                return Ternary.False;
            }
            var result = Ternary.True;
            for (var i = 0, len = sourceProperties.length; i < len; ++i) {
                var sourceProp = sourceProperties[i];
                var targetProp = getPropertyOfObjectType(target, sourceProp.name);
                if (!targetProp) {
                    return Ternary.False;
                }
                var related = compareProperties(sourceProp, targetProp, isRelatedTo);
                if (!related) {
                    return Ternary.False;
                }
                result &= related;
            }
            return result;
        }

        function signaturesRelatedTo(source: ObjectType, target: ObjectType, kind: SignatureKind, reportErrors: boolean): Ternary {
            if (relation === identityRelation) {
                return signaturesIdenticalTo(source, target, kind);
            }
            if (target === anyFunctionType || source === anyFunctionType) {
                return Ternary.True;
            }
            var sourceSignatures = getSignaturesOfType(source, kind);
            var targetSignatures = getSignaturesOfType(target, kind);
            var result = Ternary.True;
            var saveErrorInfo = errorInfo;
            outer: for (var i = 0; i < targetSignatures.length; i++) {
                var t = targetSignatures[i];
                if (!t.hasStringLiterals || target.flags & TypeFlags.FromSignature) {
                    var localErrors = reportErrors;
                    for (var j = 0; j < sourceSignatures.length; j++) {
                        var s = sourceSignatures[j];
                        if (!s.hasStringLiterals || source.flags & TypeFlags.FromSignature) {
                            var related = signatureRelatedTo(s, t, localErrors);
                            if (related) {
                                result &= related;
                                errorInfo = saveErrorInfo;
                                continue outer;
                            }
                            // Only report errors from the first failure
                            localErrors = false;
                        }
                    }
                    return Ternary.False;
                }
            }
            return result;
        }

        function signatureRelatedTo(source: Signature, target: Signature, reportErrors: boolean): Ternary {
            if (source === target) {
                return Ternary.True;
            }
            if (!target.hasRestParameter && source.minArgumentCount > target.parameters.length) {
                return Ternary.False;
            }
            var sourceMax = source.parameters.length;
            var targetMax = target.parameters.length;
            var checkCount: number;
            if (source.hasRestParameter && target.hasRestParameter) {
                checkCount = sourceMax > targetMax ? sourceMax : targetMax;
                sourceMax--;
                targetMax--;
            }
            else if (source.hasRestParameter) {
                sourceMax--;
                checkCount = targetMax;
            }
            else if (target.hasRestParameter) {
                targetMax--;
                checkCount = sourceMax;
            }
            else {
                checkCount = sourceMax < targetMax ? sourceMax : targetMax;
            }
            // Spec 1.0 Section 3.8.3 & 3.8.4:
            // M and N (the signatures) are instantiated using type Any as the type argument for all type parameters declared by M and N
            source = getErasedSignature(source);
            target = getErasedSignature(target);
            var result = Ternary.True;
            for (var i = 0; i < checkCount; i++) {
                var s = i < sourceMax ? getTypeOfSymbol(source.parameters[i]) : getRestTypeOfSignature(source);
                var t = i < targetMax ? getTypeOfSymbol(target.parameters[i]) : getRestTypeOfSignature(target);
                var saveErrorInfo = errorInfo;
                var related = isRelatedTo(s, t, reportErrors);
                if (!related) {
                    related = isRelatedTo(t, s, false);
                    if (!related) {
                        if (reportErrors) {
                            reportError(Diagnostics.Types_of_parameters_0_and_1_are_incompatible,
                                source.parameters[i < sourceMax ? i : sourceMax].name,
                                target.parameters[i < targetMax ? i : targetMax].name);
                        }
                        return Ternary.False;
                    }
                    errorInfo = saveErrorInfo;
                }
                result &= related;
            }
            var t = getReturnTypeOfSignature(target);
            if (t === voidType) return result;
            var s = getReturnTypeOfSignature(source);
            return result & isRelatedTo(s, t, reportErrors);
        }

        function signaturesIdenticalTo(source: ObjectType, target: ObjectType, kind: SignatureKind): Ternary {
            var sourceSignatures = getSignaturesOfType(source, kind);
            var targetSignatures = getSignaturesOfType(target, kind);
            if (sourceSignatures.length !== targetSignatures.length) {
                return Ternary.False;
            }
            var result = Ternary.True;
            for (var i = 0, len = sourceSignatures.length; i < len; ++i) {
                var related = compareSignatures(sourceSignatures[i], targetSignatures[i], /*compareReturnTypes*/ true, isRelatedTo);
                if (!related) {
                    return Ternary.False;
                }
                result &= related;
            }
            return result;
        }

        function stringIndexTypesRelatedTo(source: ObjectType, target: ObjectType, reportErrors: boolean): Ternary {
            if (relation === identityRelation) {
                return indexTypesIdenticalTo(IndexKind.String, source, target);
            }
            var targetType = getIndexTypeOfType(target, IndexKind.String);
            if (targetType) {
                var sourceType = getIndexTypeOfType(source, IndexKind.String);
                if (!sourceType) {
                    if (reportErrors) {
                        reportError(Diagnostics.Index_signature_is_missing_in_type_0, sourceTypeString());
                    }
                    return Ternary.False;
                }
                var related = isRelatedTo(sourceType, targetType, reportErrors);
                if (!related) {
                    if (reportErrors) {
                        reportError(Diagnostics.Index_signatures_are_incompatible);
                    }
                    return Ternary.False;
                }
                return related;
            }
            return Ternary.True;
        }

        function numberIndexTypesRelatedTo(source: ObjectType, target: ObjectType, reportErrors: boolean): Ternary {
            if (relation === identityRelation) {
                return indexTypesIdenticalTo(IndexKind.Number, source, target);
            }
            var targetType = getIndexTypeOfType(target, IndexKind.Number);
            if (targetType) {
                var sourceStringType = getIndexTypeOfType(source, IndexKind.String);
                var sourceNumberType = getIndexTypeOfType(source, IndexKind.Number);
                if (!(sourceStringType || sourceNumberType)) {
                    if (reportErrors) {
                        reportError(Diagnostics.Index_signature_is_missing_in_type_0, sourceTypeString());
                    }
                    return Ternary.False;
                }
                if (sourceStringType && sourceNumberType) {
                    // If we know for sure we're testing both string and numeric index types then only report errors from the second one
                    var related = isRelatedTo(sourceStringType, targetType, false) || isRelatedTo(sourceNumberType, targetType, reportErrors);
                }
                else {
                    var related = isRelatedTo(sourceStringType || sourceNumberType, targetType, reportErrors);
                }
                if (!related) {
                    if (reportErrors) {
                        reportError(Diagnostics.Index_signatures_are_incompatible);
                    }
                    return Ternary.False;
                }
                return related;
            }
            return Ternary.True;
        }

        function indexTypesIdenticalTo(indexKind: IndexKind, source: ObjectType, target: ObjectType): Ternary {
            var targetType = getIndexTypeOfType(target, indexKind);
            var sourceType = getIndexTypeOfType(source, indexKind);
            if (!sourceType && !targetType) {
                return Ternary.True;
            }
            if (sourceType && targetType) {
                return isRelatedTo(sourceType, targetType);
            }
            return Ternary.False;
        }
    }

    function compareProperties(sourceProp: Symbol, targetProp: Symbol, compareTypes: (source: Type, target: Type) => Ternary): Ternary {
        // Two members are considered identical when
        // - they are public properties with identical names, optionality, and types,
        // - they are private or protected properties originating in the same declaration and having identical types
        if (sourceProp === targetProp) {
            return Ternary.True;
        }
        var sourcePropAccessibility = getDeclarationFlagsFromSymbol(sourceProp) & (NodeFlags.Private | NodeFlags.Protected);
        var targetPropAccessibility = getDeclarationFlagsFromSymbol(targetProp) & (NodeFlags.Private | NodeFlags.Protected);
        if (sourcePropAccessibility !== targetPropAccessibility) {
            return Ternary.False;
        }
        if (sourcePropAccessibility) {
            if (getTargetSymbol(sourceProp) !== getTargetSymbol(targetProp)) {
                return Ternary.False;
            }
        }
        else {
            if (isOptionalProperty(sourceProp) !== isOptionalProperty(targetProp)) {
                return Ternary.False;
            }
        }
        return compareTypes(getTypeOfSymbol(sourceProp), getTypeOfSymbol(targetProp));
    }

    function compareSignatures(source: Signature, target: Signature, compareReturnTypes: boolean, compareTypes: (s: Type, t: Type) => Ternary): Ternary {
        if (source === target) {
            return Ternary.True;
        }
        if (source.parameters.length !== target.parameters.length ||
            source.minArgumentCount !== target.minArgumentCount ||
            source.hasRestParameter !== target.hasRestParameter) {
            return Ternary.False;
        }
        var result = Ternary.True;
        if (source.typeParameters && target.typeParameters) {
            if (source.typeParameters.length !== target.typeParameters.length) {
                return Ternary.False;
            }
            for (var i = 0, len = source.typeParameters.length; i < len; ++i) {
                var related = compareTypes(source.typeParameters[i], target.typeParameters[i]);
                if (!related) {
                    return Ternary.False;
                }
                result &= related;
            }
        }
        else if (source.typeParameters || source.typeParameters) {
            return Ternary.False;
        }
        // Spec 1.0 Section 3.8.3 & 3.8.4:
        // M and N (the signatures) are instantiated using type Any as the type argument for all type parameters declared by M and N
        source = getErasedSignature(source);
        target = getErasedSignature(target);
        for (var i = 0, len = source.parameters.length; i < len; i++) {
            var s = source.hasRestParameter && i === len - 1 ? getRestTypeOfSignature(source) : getTypeOfSymbol(source.parameters[i]);
            var t = target.hasRestParameter && i === len - 1 ? getRestTypeOfSignature(target) : getTypeOfSymbol(target.parameters[i]);
            var related = compareTypes(s, t);
            if (!related) {
                return Ternary.False;
            }
            result &= related;
        }
        if (compareReturnTypes) {
            result &= compareTypes(getReturnTypeOfSignature(source), getReturnTypeOfSignature(target));
        }
        return result;
    }

    function getAncestor(node: Node, kind: NodeKind): Node {
        switch (kind) {
            // special-cases that can be come first
            case NodeKind.ClassDeclaration:
                while (node) {
                    switch (node.kind) {
                        case NodeKind.ClassDeclaration:
                            return <ClassDeclaration>node;
                        case NodeKind.EnumDeclaration:
                        case NodeKind.InterfaceDeclaration:
                        case NodeKind.ModuleDeclaration:
                        case NodeKind.ImportDeclaration:
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

    function getDeclarationFlagsFromSymbol(s: Symbol) {
        return s.flags & SymbolFlags.Prototype ? NodeFlags.Public | NodeFlags.Static : s.valueDeclaration.flags;
    }
    export function initializeGlobalTypes() {
        // Initialize special symbols
        getSymbolLinks(unknownSymbol).type = unknownType;
        // Initialize special types
        globalArraySymbol = getGlobalSymbol("Array");
        globalArrayType = getTypeOfGlobalSymbol(globalArraySymbol, 1);
        globalObjectType = getGlobalType("Object");
        globalFunctionType = getGlobalType("Function");
        globalStringType = getGlobalType("String");
        globalNumberType = getGlobalType("Number");
        globalBooleanType = getGlobalType("Boolean");
    }
}

