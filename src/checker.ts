/// <reference path="arrayUtil.ts"/>
/// <reference path="nodes.ts"/>
/// <reference path="diagnostics.ts"/>

module reflect {

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

    export var globals: SymbolTable = {};

    var globalArraySymbol: Symbol;

    var globalObjectType: ObjectType;
    var globalFunctionType: ObjectType;
    var globalArrayType: ObjectType;
    var globalStringType: ObjectType;
    var globalNumberType: ObjectType;
    var globalBooleanType: ObjectType;

    var stringLiteralTypes: Map<StringLiteralType> = {};

    var symbolLinks: SymbolLinks[] = [];
    var nodeLinks: NodeLinks[] = [];

    enum CharacterCodes {
        _ = 0x5F
    }

    var errors: Diagnostic[] = [];

    export function printTypeErrors(): void {

        forEach(errors, x => {
            console.log(x);
        });
    }

    function error(location: Node, message: DiagnosticMessage, arg0?: any, arg1?: any, arg2?: any): void {

        errors.push(new Diagnostic(getSourceFile(location), message, arg0, arg1, arg2));
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
        return new Symbol(flags, name);
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

    function getSourceFile(node: Node): SourceFile {
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

    function resolveName(location: Node, name: string, meaning: SymbolFlags): Symbol {

        var errorLocation = location;
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
                error(location, Diagnostics.Module_0_has_no_exported_member_1, name.join('.'), rightName);
                return;
            }
        }

        return symbol.flags & meaning ? symbol : resolveImport(symbol);
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
        // If the symbol has the value flag, it is trivially a value.
        if (symbol.flags & SymbolFlags.Value) {
            return true;
        }

        // If it is an import, then it is a value if the symbol it resolves to is a value.
        if (symbol.flags & SymbolFlags.Import) {
            return (resolveImport(symbol).flags & SymbolFlags.Value) !== 0;
        }

        // If it is an instantiated symbol, then it is a value if the symbol it is an
        // instantiation of is a value.
        if (symbol.flags & SymbolFlags.Instantiated) {
            return (getSymbolLinks(symbol).target.flags & SymbolFlags.Value) !== 0;
        }

        return false;
    }

    function createType(flags: TypeFlags): Type {
        var result = new Type(flags);
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

    function setObjectTypeMembers(type: ObjectType, members: SymbolTable, callSignatures: Signature[], constructSignatures: Signature[], stringIndexType: Type, numberIndexType: Type): ResolvedObjectType {
        (<ResolvedObjectType>type).members = members;
        (<ResolvedObjectType>type).properties = getNamedMembers(members);
        (<ResolvedObjectType>type).callSignatures = callSignatures;
        (<ResolvedObjectType>type).constructSignatures = constructSignatures;
        if (stringIndexType) (<ResolvedObjectType>type).stringIndexType = stringIndexType;
        if (numberIndexType) (<ResolvedObjectType>type).numberIndexType = numberIndexType;
        return <ResolvedObjectType>type;
    }

    function createAnonymousType(symbol: Symbol, members: SymbolTable, callSignatures: Signature[], constructSignatures: Signature[], stringIndexType: Type, numberIndexType: Type): ResolvedObjectType {
        return setObjectTypeMembers(createObjectType(TypeFlags.Anonymous, symbol),
            members, callSignatures, constructSignatures, stringIndexType, numberIndexType);
    }

    function isOptionalProperty(propertySymbol: Symbol): boolean {
        if (propertySymbol.flags & SymbolFlags.Prototype) {
            return false;
        }
        //  class C {
        //      constructor(public x?) { }
        //  }
        //
        // x is an optional parameter, but it is a required property.
        return (propertySymbol.valueDeclaration.flags & NodeFlags.QuestionMark) && propertySymbol.valueDeclaration.kind !== NodeKind.Parameter;
    }

    function getApparentType(type: Type): ApparentType {
        if (type.flags & TypeFlags.TypeParameter) {
            do {
                type = getConstraintOfTypeParameter(<TypeParameter>type);
            } while (type && type.flags & TypeFlags.TypeParameter);
            if (!type) type = emptyObjectType;
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
        return <ApparentType>type;
    }

    function getTypeOfPrototypeProperty(prototype: Symbol): Type {
        // TypeScript 1.0 spec (April 2014): 8.4
        // Every class automatically contains a static property member named 'prototype',
        // the type of which is an instantiation of the class type with type Any supplied as a type argument for each type parameter.
        // It is an error to explicitly declare a static property member with the name 'prototype'.
        var classType = <InterfaceType>getDeclaredTypeOfSymbol(prototype.parent);
        return classType.typeParameters ? createTypeReference(<GenericType>classType, map(classType.typeParameters, _ => anyType)) : classType;
    }

    function getTypeOfVariableDeclaration(declaration: VariableDeclaration): Type {

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
        var type = declaration.flags & NodeFlags.Rest ? createArrayType(anyType) : anyType;
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
            var type = getTypeOfVariableDeclaration(<VariableDeclaration>declaration);
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

    function getAnnotatedAccessorType(accessor: MemberDeclaration): Type {
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
        if (symbol.flags & SymbolFlags.Instantiated) {
            return getTypeOfInstantiatedSymbol(symbol);
        }
        return unknownType;
    }

    function getTargetType(type: ObjectType): Type {
        return type.flags & TypeFlags.Reference ? (<TypeReference>type).target : type;
    }

    function hasBaseType(type: InterfaceType, checkBase: InterfaceType) {
        return check(type);
        function check(type: InterfaceType) {
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
            if (declaration.extends) {
                var baseType = getTypeFromTypeReferenceNode(declaration.extends);
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
                        error(declaration.extends, Diagnostics.A_class_may_only_extend_another_class);
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
                if (declaration.kind === NodeKind.InterfaceDeclaration && (<InterfaceDeclaration>declaration).extends) {
                    forEach((<InterfaceDeclaration>declaration).extends, node => {
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
                addInheritedMembers(members, getPropertiesOfType(baseType));
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
            addInheritedMembers(members, getPropertiesOfType(instantiatedBaseType));
            callSignatures = concatenate(callSignatures, getSignaturesOfType(instantiatedBaseType, SignatureKind.Call));
            constructSignatures = concatenate(constructSignatures, getSignaturesOfType(instantiatedBaseType, SignatureKind.Construct));
            stringIndexType = stringIndexType || getIndexTypeOfType(instantiatedBaseType, IndexKind.String);
            numberIndexType = numberIndexType || getIndexTypeOfType(instantiatedBaseType, IndexKind.Number);
        });
        setObjectTypeMembers(type, members, callSignatures, constructSignatures, stringIndexType, numberIndexType);
    }

    function createSignature(declaration: SignatureDeclaration, typeParameters: TypeParameter[], parameters: Symbol[],
                             resolvedReturnType: Type, minArgumentCount: number, hasRestParameter: boolean, hasStringLiterals: boolean): Signature {
        var sig = new Signature();
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
                    addInheritedMembers(members, getPropertiesOfType(getTypeOfSymbol(classType.baseTypes[0].symbol)));
                }
            }
            var stringIndexType: Type = undefined;
            var numberIndexType: Type = (symbol.flags & SymbolFlags.Enum) ? stringType : undefined;
        }
        setObjectTypeMembers(type, members, callSignatures, constructSignatures, stringIndexType, numberIndexType);
    }

    function resolveObjectTypeMembers(type: ObjectType): ResolvedObjectType {
        if (!(<ResolvedObjectType>type).members) {
            if (type.flags & (TypeFlags.Class | TypeFlags.Interface)) {
                resolveClassOrInterfaceMembers(<InterfaceType>type);
            }
            else if (type.flags & TypeFlags.Anonymous) {
                resolveAnonymousTypeMembers(<ObjectType>type);
            }
            else {
                resolveTypeReferenceMembers(<TypeReference>type);
            }
        }
        return <ResolvedObjectType>type;
    }

    function getPropertiesOfType(type: Type): Symbol[] {
        if (type.flags & TypeFlags.ObjectType) {
            return resolveObjectTypeMembers(<ObjectType>type).properties;
        }
        return emptyArray;
    }

    function getPropertyOfType(type: Type, name: string): Symbol {
        if (type.flags & TypeFlags.ObjectType) {
            var resolved = resolveObjectTypeMembers(<ObjectType>type);
            if (hasProperty(resolved.members, name)) {
                var symbol = resolved.members[name];
                if (symbolIsValue(symbol)) {
                    return symbol;
                }
            }
        }
    }

    function getPropertyOfApparentType(type: ApparentType, name: string): Symbol {
        if (type.flags & TypeFlags.ObjectType) {
            var resolved = resolveObjectTypeMembers(<ObjectType>type);
            if (hasProperty(resolved.members, name)) {
                var symbol = resolved.members[name];
                if (symbolIsValue(symbol)) {
                    return symbol;
                }
            }
            if (resolved === anyFunctionType || resolved.callSignatures.length || resolved.constructSignatures.length) {
                var symbol = getPropertyOfType(globalFunctionType, name);
                if (symbol) return symbol;
            }
            return getPropertyOfType(globalObjectType, name);
        }
    }

    function getSignaturesOfType(type: Type, kind: SignatureKind): Signature[] {
        if (type.flags & TypeFlags.ObjectType) {
            var resolved = resolveObjectTypeMembers(<ObjectType>type);
            return kind === SignatureKind.Call ? resolved.callSignatures : resolved.constructSignatures;
        }
        return emptyArray;
    }

    function getIndexTypeOfType(type: Type, kind: IndexKind): Type {
        if (type.flags & TypeFlags.ObjectType) {
            var resolved = resolveObjectTypeMembers(<ObjectType>type);
            return kind === IndexKind.String ? resolved.stringIndexType : resolved.numberIndexType;
        }
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
                case NodeKind.FunctionDeclaration:
                case NodeKind.Method:
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

    function getReturnTypeOfSignature(signature: Signature): Type {
        if (!signature.resolvedReturnType) {
            signature.resolvedReturnType = resolvingType;
            if (signature.target) {
                var type = instantiateType(getReturnTypeOfSignature(signature.target), signature.mapper);
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

    function getTypeFromTypeLiteralNode(node: TypeNode): Type {
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
            case NodeKind.FunctionType:
            case NodeKind.ConstructorType:
            case NodeKind.ObjectType:
                return getTypeFromTypeLiteralNode(<TypeNode>node);
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
        var result = <TransientSymbol>createSymbol(SymbolFlags.Instantiated | SymbolFlags.Transient, symbol.name);
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
        var result = <ResolvedObjectType>createObjectType(TypeFlags.Anonymous, type.symbol);
        result.properties = instantiateList(getPropertiesOfType(type), mapper, instantiateSymbol);
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
        }
        return type;
    }

    // TYPE CHECKING
    var subtypeRelation: Map<boolean> = {};
    var assignableRelation: Map<boolean> = {};
    var identityRelation: Map<boolean> = {};

    function isTypeIdenticalTo(source: Type, target: Type): boolean {
        return checkTypeRelatedTo(source, target, identityRelation);
    }

    function isTypeSubtypeOf(source: Type, target: Type): boolean {
        return checkTypeSubtypeOf(source, target);
    }

    function checkTypeSubtypeOf(source: Type, target: Type): boolean {
        return checkTypeRelatedTo(source, target, subtypeRelation);
    }

    export function isTypeAssignableTo(source: Type, target: Type): boolean {
        return checkTypeAssignableTo(source, target);
    }

    function checkTypeAssignableTo(source: Type, target: Type): boolean {
        return checkTypeRelatedTo(source, target, assignableRelation);
    }

    function isPropertyIdenticalToRecursive(sourceProp: Symbol, targetProp: Symbol, reportErrors: boolean, relate: (source: Type, target: Type, reportErrors: boolean) => boolean): boolean {

        if (!targetProp) {
            return false;
        }

        // Two members are considered identical when
        // - they are public properties with identical names, optionality, and types,
        // - they are private properties originating in the same declaration and having identical types
        var sourcePropIsPrivate = getDeclarationFlagsFromSymbol(sourceProp) & NodeFlags.Private;
        var targetPropIsPrivate = getDeclarationFlagsFromSymbol(targetProp) & NodeFlags.Private;
        if (sourcePropIsPrivate !== targetPropIsPrivate) {
            return false;
        }

        if (sourcePropIsPrivate) {
            return (getTargetSymbol(sourceProp).parent === getTargetSymbol(targetProp).parent) && relate(getTypeOfSymbol(sourceProp), getTypeOfSymbol(targetProp), reportErrors);
        }
        else {
            return isOptionalProperty(sourceProp) === isOptionalProperty(targetProp) && relate(getTypeOfSymbol(sourceProp), getTypeOfSymbol(targetProp), reportErrors);
        }
    }

    function getTargetSymbol(s: Symbol) {
        // if symbol is instantiated it's flags are not copied from the 'target'
        // so we'll need to get back original 'target' symbol to work with correct set of flags
        return s.flags & SymbolFlags.Instantiated ? getSymbolLinks(s).target : s;
    }

    function typeToString(type: Type): string {

        if(type.symbol) {
            return symbolToString(type.symbol);
        }

        return "Anonymous";
    }

    function symbolToString(symbol: Symbol): string {

        if (symbol.declarations && symbol.declarations.length > 0) {
            var declaration = symbol.declarations[0];
            if (declaration.name) {
                return declaration.name;
            }
        }
        return symbol.name;
    }

    function checkTypeRelatedTo(source: Type, target: Type, relation: Map<boolean>): boolean {
        var errorInfo: DiagnosticMessageChain;
        var sourceStack: ObjectType[];
        var targetStack: ObjectType[];
        var expandingFlags: number;
        var depth = 0;
        var overflow = false;

        var result = isRelatedTo(source, target, true);
        if (overflow) {
            error(undefined, Diagnostics.Excessive_stack_depth_comparing_types_0_and_1, typeToString(source), typeToString(target));
        }
        else if (errorInfo) {
            errors.push(errorInfo.flatten());
        }
        return result;

        function reportError(message: DiagnosticMessage, arg0?: string, arg1?: string): void {
            errorInfo = Diagnostic.chain(errorInfo, message, arg0, arg1);
        }

        function isRelatedTo(source: Type, target: Type, reportErrors: boolean): boolean {
            if (relation === identityRelation) {
                // both types are the same - covers 'they are the same primitive type or both are Any' or the same type parameter cases
                if (source === target) return true;
            }
            else {
                if (source === target) return true;
                if (target.flags & TypeFlags.Any) return true;
                if (source === undefinedType) return true;
                if (source === nullType && target !== undefinedType) return true;
                if (source.flags & TypeFlags.Enum && target === numberType) return true;
                if (source.flags & TypeFlags.StringLiteral && target === stringType) return true;
                if (relation === assignableRelation) {
                    if (source.flags & TypeFlags.Any) return true;
                    if (source === numberType && target.flags & TypeFlags.Enum) return true;
                }
            }

            if (source.flags & TypeFlags.TypeParameter && target.flags & TypeFlags.TypeParameter) {
                if (typeParameterRelatedTo(<TypeParameter>source, <TypeParameter>target, reportErrors)) {
                    return true;
                }
            }
            else {
                var saveErrorInfo = errorInfo;
                if (source.flags & TypeFlags.Reference && target.flags & TypeFlags.Reference && (<TypeReference>source).target === (<TypeReference>target).target) {
                    // We have type references to same target type, see if relationship holds for all type arguments
                    if (typesRelatedTo((<TypeReference>source).typeArguments, (<TypeReference>target).typeArguments, reportErrors)) {
                        return true;
                    }
                }
                // Even if relationship doesn't hold for type arguments, it may hold in a structural comparison
                // Report structural errors only if we haven't reported any errors yet
                var reportStructuralErrors = reportErrors && errorInfo === saveErrorInfo;
                // identity relation does not use apparent type
                var sourceOrApparentType =  relation === identityRelation ? source : getApparentType(source);
                if (sourceOrApparentType.flags & TypeFlags.ObjectType && target.flags & TypeFlags.ObjectType &&
                    objectTypeRelatedTo(sourceOrApparentType, <ObjectType>target, reportStructuralErrors)) {
                    errorInfo = saveErrorInfo;
                    return true;
                }
            }
            if (reportErrors) {
                // The error should end in a period when this is the deepest error in the chain
                // (when errorInfo is undefined). Otherwise, it has a colon before the nested
                // error.

                var chainedMessage = Diagnostics.Type_0_is_not_assignable_to_type_1_Colon;
                var terminalMessage = Diagnostics.Type_0_is_not_assignable_to_type_1;
                var diagnosticKey = errorInfo ? chainedMessage : terminalMessage;

                reportError(diagnosticKey, typeToString(source), typeToString(target));
            }
            return false;
        }

        function typesRelatedTo(sources: Type[], targets: Type[], reportErrors: boolean): boolean {
            for (var i = 0, len = sources.length; i < len; i++) {
                if (!isRelatedTo(sources[i], targets[i], reportErrors)) return false;
            }
            return true;
        }

        function typeParameterRelatedTo(source: TypeParameter, target: TypeParameter, reportErrors: boolean): boolean {
            if (relation === identityRelation) {
                if (source.symbol.name !== target.symbol.name) {
                    return false;
                }

                // covers case when both type parameters does not have constraint (both equal to noConstraintType)
                if (source.constraint === target.constraint) {
                    return true;
                }

                if (source.constraint === noConstraintType || target.constraint === noConstraintType) {
                    return false;
                }

                return isRelatedTo(source.constraint, target.constraint, reportErrors);
            }
            else {
                while (true) {
                    var constraint = getConstraintOfTypeParameter(source);
                    if (constraint === target) return true;
                    if (!(constraint && constraint.flags & TypeFlags.TypeParameter)) break;
                    source = <TypeParameter>constraint;
                }
                return false;
            }
        }

        // Determine if two object types are related by structure. First, check if the result is already available in the global cache.
        // Second, check if we have already started a comparison of the given two types in which case we assume the result to be true.
        // Third, check if both types are part of deeply nested chains of generic type instantiations and if so assume the types are
        // equal and infinitely expanding. Fourth, if we have reached a depth of 100 nested comparisons, assume we have runaway recursion
        // and issue an error. Otherwise, actually compare the structure of the two types.
        function objectTypeRelatedTo(source: ObjectType, target: ObjectType, reportErrors: boolean): boolean {
            if (overflow) return false;
            var result: boolean;
            var id = source.id + "," + target.id;
            if ((result = relation[id]) !== undefined) return result;
            if (depth > 0) {
                for (var i = 0; i < depth; i++) {
                    if (source === sourceStack[i] && target === targetStack[i]) return true;
                }
                if (depth === 100) {
                    overflow = true;
                    return false;
                }
            }
            else {
                sourceStack = [];
                targetStack = [];
                expandingFlags = 0;
            }
            sourceStack[depth] = source;
            targetStack[depth] = target;
            depth++;
            var saveExpandingFlags = expandingFlags;
            if (!(expandingFlags & 1) && isDeeplyNestedGeneric(source, sourceStack)) expandingFlags |= 1;
            if (!(expandingFlags & 2) && isDeeplyNestedGeneric(target, targetStack)) expandingFlags |= 2;
            result = expandingFlags === 3 ||
            propertiesRelatedTo(source, target, reportErrors) &&
            signaturesRelatedTo(source, target, SignatureKind.Call, reportErrors) &&
            signaturesRelatedTo(source, target, SignatureKind.Construct, reportErrors) &&
            stringIndexTypesRelatedTo(source, target, reportErrors) &&
            numberIndexTypesRelatedTo(source, target, reportErrors);
            expandingFlags = saveExpandingFlags;
            depth--;
            if (depth === 0) {
                relation[id] = result;
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

        function propertiesRelatedTo(source: ObjectType, target: ObjectType, reportErrors: boolean): boolean {
            if (relation === identityRelation) {
                return propertiesAreIdenticalTo(source, target, reportErrors);
            }
            else {
                return propertiesAreSubtypeOrAssignableTo(<ApparentType>source, target, reportErrors);
            }
        }

        function propertiesAreIdenticalTo(source: ObjectType, target: ObjectType, reportErrors: boolean): boolean {
            if (source === target) {
                return true;
            }

            var sourceProperties = getPropertiesOfType(source);
            var targetProperties = getPropertiesOfType(target);
            if (sourceProperties.length !== targetProperties.length) {
                return false;
            }

            for (var i = 0, len = sourceProperties.length; i < len; ++i) {
                var sourceProp = sourceProperties[i];
                var targetProp = getPropertyOfType(target, sourceProp.name);

                if (!isPropertyIdenticalToRecursive(sourceProp, targetProp, reportErrors, isRelatedTo)) {
                    return false;
                }
            }

            return true;
        }

        function propertiesAreSubtypeOrAssignableTo(source: ApparentType, target: ObjectType, reportErrors: boolean): boolean {
            var properties = getPropertiesOfType(target);
            for (var i = 0; i < properties.length; i++) {
                var targetProp = properties[i];
                var sourceProp = getPropertyOfApparentType(source, targetProp.name);
                if (sourceProp === targetProp) {
                    continue;
                }

                var targetPropIsOptional = isOptionalProperty(targetProp);
                if (!sourceProp) {
                    if (!targetPropIsOptional) {
                        if (reportErrors) {
                            reportError(Diagnostics.Property_0_is_missing_in_type_1, symbolToString(targetProp), typeToString(source));
                        }
                        return false;
                    }
                }
                else if (sourceProp !== targetProp) {
                    if (targetProp.flags & SymbolFlags.Prototype) {
                        continue;
                    }

                    if (getDeclarationFlagsFromSymbol(sourceProp) & NodeFlags.Private || getDeclarationFlagsFromSymbol(targetProp) & NodeFlags.Private) {
                        if (sourceProp.valueDeclaration !== targetProp.valueDeclaration) {
                            if (reportErrors) {
                                reportError(Diagnostics.Private_property_0_cannot_be_reimplemented, symbolToString(targetProp));
                            }
                            return false;
                        }
                    }
                    if (!isRelatedTo(getTypeOfSymbol(sourceProp), getTypeOfSymbol(targetProp), reportErrors)) {
                        if (reportErrors) {
                            reportError(Diagnostics.Types_of_property_0_are_incompatible_Colon, symbolToString(targetProp));
                        }
                        return false;
                    }
                    else if (isOptionalProperty(sourceProp) && !targetPropIsOptional) {
                        // TypeScript 1.0 spec (April 2014): 3.8.3
                        // S is a subtype of a type T, and T is a supertype of S if ...
                        // S' and T are object types and, for each member M in T..
                        // M is a property and S' contains a property N where
                        // if M is a required property, N is also a required property
                        // (M - property in T)
                        // (N - property in S)
                        if (reportErrors) {
                            reportError(Diagnostics.Required_property_0_cannot_be_reimplemented_with_optional_property_in_1, targetProp.name, typeToString(source));
                        }
                        return false;
                    }
                }
            }
            return true;
        }

        function signaturesRelatedTo(source: ObjectType, target: ObjectType, kind: SignatureKind, reportErrors: boolean): boolean {
            if (relation === identityRelation) {
                return areSignaturesIdenticalTo(source, target, kind, reportErrors);
            }
            else {
                return areSignaturesSubtypeOrAssignableTo(source, target, kind, reportErrors);
            }
        }

        function areSignaturesIdenticalTo(source: ObjectType, target: ObjectType, kind: SignatureKind, reportErrors: boolean): boolean {
            var sourceSignatures = getSignaturesOfType(source, kind);
            var targetSignatures = getSignaturesOfType(target, kind);
            if (sourceSignatures.length !== targetSignatures.length) {
                return false;
            }

            for (var i = 0, len = sourceSignatures.length; i < len; ++i) {
                if (!isSignatureIdenticalTo(sourceSignatures[i], targetSignatures[i], reportErrors)) {
                    return false;
                }
            }

            return true;
        }

        function isSignatureIdenticalTo(source: Signature, target: Signature, reportErrors: boolean): boolean {
            if (source === target) {
                return true;
            }

            if (source.hasRestParameter !== target.hasRestParameter) {
                return false;
            }

            if (source.parameters.length !== target.parameters.length) {
                return false;
            }

            if (source.minArgumentCount !== target.minArgumentCount) {
                return false;
            }

            if (source.typeParameters && target.typeParameters) {
                if (source.typeParameters.length !== target.typeParameters.length) {
                    return false;
                }

                for (var i = 0, len = source.typeParameters.length; i < len; ++i) {
                    if (!isRelatedTo(source.typeParameters[i], target.typeParameters[i], reportErrors)) {
                        return false;
                    }
                }
            }
            else if (source.typeParameters || source.typeParameters) {
                return false;
            }

            // Spec 1.0 Section 3.8.3 & 3.8.4:
            // M and N (the signatures) are instantiated using type Any as the type argument for all type parameters declared by M and N
            source = getErasedSignature(source);
            target = getErasedSignature(target);
            for (var i = 0, len = source.parameters.length; i < len; i++) {
                var s = source.hasRestParameter && i === len - 1 ? getRestTypeOfSignature(source) : getTypeOfSymbol(source.parameters[i]);
                var t = target.hasRestParameter && i === len - 1 ? getRestTypeOfSignature(target) : getTypeOfSymbol(target.parameters[i]);
                if (!isRelatedTo(s, t, reportErrors)) {
                    return false;
                }
            }
            var t = getReturnTypeOfSignature(target);
            var s = getReturnTypeOfSignature(source);
            return isRelatedTo(s, t, reportErrors);
        }

        function areSignaturesSubtypeOrAssignableTo(source: ObjectType, target: ObjectType, kind: SignatureKind, reportErrors: boolean): boolean {
            if (target === anyFunctionType || source === anyFunctionType) return true;
            var sourceSignatures = getSignaturesOfType(source, kind);
            var targetSignatures = getSignaturesOfType(target, kind);
            var saveErrorInfo = errorInfo;
            outer: for (var i = 0; i < targetSignatures.length; i++) {
                var t = targetSignatures[i];
                if (!t.hasStringLiterals || target.flags & TypeFlags.FromSignature) {
                    var localErrors = reportErrors;
                    for (var j = 0; j < sourceSignatures.length; j++) {
                        var s = sourceSignatures[j];
                        if (!s.hasStringLiterals || source.flags & TypeFlags.FromSignature) {
                            if (isSignatureSubtypeOrAssignableTo(s, t, localErrors)) {
                                errorInfo = saveErrorInfo;
                                continue outer;
                            }
                            // Only report errors from the first failure
                            localErrors = false;
                        }
                    }
                    return false;
                }
            }
            return true;
        }

        function isSignatureSubtypeOrAssignableTo(source: Signature, target: Signature, reportErrors: boolean): boolean {
            if (source === target) {
                return true;
            }

            if (!target.hasRestParameter && source.minArgumentCount > target.parameters.length) {
                return false;
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
            for (var i = 0; i < checkCount; i++) {
                var s = i < sourceMax ? getTypeOfSymbol(source.parameters[i]) : getRestTypeOfSignature(source);
                var t = i < targetMax ? getTypeOfSymbol(target.parameters[i]) : getRestTypeOfSignature(target);
                var saveErrorInfo = errorInfo;
                if (!isRelatedTo(s, t, reportErrors)) {
                    if (!isRelatedTo(t, s, false)) {
                        if (reportErrors) {
                            reportError(Diagnostics.Types_of_parameters_0_and_1_are_incompatible_Colon,
                                source.parameters[i < sourceMax ? i : sourceMax].name,
                                target.parameters[i < targetMax ? i : targetMax].name);
                        }
                        return false;
                    }
                    errorInfo = saveErrorInfo;
                }
            }
            var t = getReturnTypeOfSignature(target);
            if (t === voidType) return true;
            var s = getReturnTypeOfSignature(source);
            return isRelatedTo(s, t, reportErrors);
        }

        function stringIndexTypesRelatedTo(source: ObjectType, target: ObjectType, reportErrors: boolean): boolean {
            if (relation === identityRelation) {
                return areIndexTypesIdenticalTo(IndexKind.String, source, target, reportErrors);
            }
            else {
                var targetType = getIndexTypeOfType(target, IndexKind.String);
                if (targetType) {
                    var sourceType = getIndexTypeOfType(source, IndexKind.String);
                    if (!sourceType) {
                        if (reportErrors) {
                            reportError(Diagnostics.Index_signature_is_missing_in_type_0, typeToString(source));
                        }
                        return false;
                    }
                    if (!isRelatedTo(sourceType, targetType, reportErrors)) {
                        if (reportErrors) {
                            reportError(Diagnostics.Index_signatures_are_incompatible_Colon);
                        }
                        return false;
                    }
                }
                return true;
            }
        }

        function numberIndexTypesRelatedTo(source: ObjectType, target: ObjectType, reportErrors: boolean): boolean {
            if (relation === identityRelation) {
                return areIndexTypesIdenticalTo(IndexKind.Number, source, target, reportErrors);
            }
            else {
                var targetType = getIndexTypeOfType(target, IndexKind.Number);
                if (targetType) {
                    var sourceStringType = getIndexTypeOfType(source, IndexKind.String);
                    var sourceNumberType = getIndexTypeOfType(source, IndexKind.Number);
                    if (!(sourceStringType || sourceNumberType)) {
                        if (reportErrors) {
                            reportError(Diagnostics.Index_signature_is_missing_in_type_0, typeToString(source));
                        }
                        return false;
                    }
                    if (sourceStringType && sourceNumberType) {
                        // If we know for sure we're testing both string and numeric index types then only report errors from the second one
                        var compatible = isRelatedTo(sourceStringType, targetType, false) || isRelatedTo(sourceNumberType, targetType, reportErrors);
                    }
                    else {
                        var compatible = isRelatedTo(sourceStringType || sourceNumberType, targetType, reportErrors);
                    }
                    if (!compatible) {
                        if (reportErrors) {
                            reportError(Diagnostics.Index_signatures_are_incompatible_Colon);
                        }
                        return false;
                    }
                }
                return true;
            }
        }

        function areIndexTypesIdenticalTo(indexKind: IndexKind, source: ObjectType, target: ObjectType, reportErrors: boolean): boolean {
            var targetType = getIndexTypeOfType(target, indexKind);
            var sourceType = getIndexTypeOfType(source, indexKind);
            return (!sourceType && !targetType) || (sourceType && targetType && isRelatedTo(sourceType, targetType, reportErrors));
        }
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
