
module reflect {

    export class TypeImpl implements Type, IntrinsicType, InterfaceType, TypeReference, GenericType, TupleType {

        id: number;
        symbol: SymbolImpl;

        // Implementation of IntrinsicType
        intrinsicName: string;  // Name of intrinsic type

        // Implementation of InterfaceType
        typeParameters: TypeParameter[];           // Type parameters (undefined if non-generic)
        baseTypes: TypeImpl[];                   // Base types
        declaredProperties: Symbol[];              // Declared members
        declaredCallSignatures: Signature[];       // Declared call signatures
        declaredConstructSignatures: Signature[];  // Declared construct signatures
        declaredStringIndexType: Type;             // Declared string index type
        declaredNumberIndexType: Type;             // Declared numeric index type

        // Implementation of TypeReference
        target: TypeImpl;    // Type reference target
        typeArguments: TypeImpl[];  // Type reference type arguments

        // Implementation of GenericType
        instantiations: Map<TypeReference>;   // Generic instantiation cache
        openReferenceTargets: GenericType[];  // Open type reference targets
        openReferenceChecks: Map<boolean>;    // Open type reference check cache

        // Implementation of TupleType
        elementTypes: Type[];          // Element types
        baseArrayType: TypeReference;  // Array<T> where T is best common type of element types


        constructor(public flags: TypeFlags) {

        }

        getFullName(): string {
            if (this.symbol) {
                return this.symbol.getFullName();
            }
        }

        getName(): string {
            if (this.symbol) {
                return this.symbol.getName();
            }
        }

        getDescription(): string {
            if (this.symbol) {
                return this.symbol.getDescription();
            }
        }

        getAnnotations(inherit: boolean): Annotation[];
        getAnnotations(name?: string, inherit?: boolean): Annotation[];
        getAnnotations(nameOrInherit?: any, inherit?: boolean): Annotation[] {

            if (!this.symbol) {
                return [];
            }

            if(typeof nameOrInherit === "string" || inherit !== undefined) {
                var name: string = nameOrInherit;
            }
            else {
                inherit = nameOrInherit;
            }

            var annotations = this.symbol.getAnnotations(name);

            if(inherit) {
                forEach(this.baseTypes, baseType => {
                   annotations = (baseType.getAnnotations(name, inherit)).concat(annotations);
                });
            }

            return annotations;
        }

        hasAnnotation(name: string, inherit?: boolean): boolean {

            if(!this.symbol) {
                return false;
            }

            if(this.symbol.hasAnnotation(name)) {
                return true;
            }

            if(inherit) {
                return forEach(this.baseTypes, baseType => baseType.hasAnnotation(name, inherit));
            }

            return false;
        }

        getFlags(): TypeFlags {
            return this.flags;
        }

        getProperties(): Symbol[] {

            return getPropertiesOfType(this);
        }

        getProperty(name: string): Symbol {

            return getPropertyOfType(this, name);
        }

        getCallSignatures(): Signature[] {

            return getSignaturesOfType(this, SignatureKind.Call);
        }

        getConstructSignatures(): Signature[] {

            return getSignaturesOfType(this, SignatureKind.Construct);
        }

        getStringIndexType(): Type {

            return getIndexTypeOfType(this, IndexKind.String);
        }

        getNumberIndexType(): Type {

            return getIndexTypeOfType(this, IndexKind.Number);
        }

        isIdenticalTo(target: Type, diagnostics?: Diagnostic[]): boolean {

            return isTypeIdenticalTo(this, target, diagnostics);
        }

        isSubtypeOf(target: Type, diagnostics?: Diagnostic[]): boolean {

            return isTypeSubtypeOf(this, target, diagnostics);
        }

        isAssignableTo(target: Type, diagnostics?: Diagnostic[]): boolean {

            return isTypeAssignableTo(this, target, diagnostics);
        }

        hasBaseType(target: Type): boolean {

            // TODO: cache?
            return check(this);
            function check(type: TypeImpl): boolean {
                var type = type._getTargetType();
                return type === target || forEach(type.baseTypes, check);
            }
        }

        private _getTargetType(): TypeImpl {
            return this.flags & TypeFlags.Reference ? this.target : this;
        }

        isSubclassOf(target: Type): boolean {

            if(target === this) {
                return false;
            }

            var baseClass = this._getTargetType();
            if((baseClass.flags & TypeFlags.Class) === 0) {
                return false;
            }

            while(baseClass) {
                if(baseClass === target) {
                    return true;
                }
                baseClass = baseClass._getBaseClass();
            }
            return false;
        }

        private _baseClass: TypeImpl;

        private _getBaseClass(): TypeImpl {

            // note: does not check that the current type is a class. if the current type is an interface,
            // this could incorrectly return that it has a base class if the interface extends a class.

            if(this._baseClass !== undefined) {
                return this._baseClass;
            }

            return this._baseClass = null || forEach(this.baseTypes, baseType => {

                var type = baseType._getTargetType();
                if(type.flags & TypeFlags.Class) {
                    return type;
                }
            });
        }

        isClass(): boolean {
            return (this.flags & TypeFlags.Class) !== 0;
        }

        isInterface(): boolean {
            return (this.flags & TypeFlags.Interface) !== 0;
        }

        isTuple(): boolean {
            return (this.flags & TypeFlags.Tuple) !== 0;
        }

        isAnonymous(): boolean {
            return (this.flags & TypeFlags.Anonymous) !== 0;
        }

        isReference(): boolean {
            return (this.flags & TypeFlags.Reference) !== 0;
        }

        isEnum(): boolean {
            return (this.flags & TypeFlags.Enum) !== 0;
        }

        isStringLiteral(): boolean {
            return (this.flags & TypeFlags.StringLiteral) !== 0;
        }

        isTypeParameter(): boolean {
            return (this.flags & TypeFlags.TypeParameter) !== 0;
        }

        isAny(): boolean {
            return (this.flags & TypeFlags.Any) !== 0;
        }

        isString(): boolean {
            return (this.flags & TypeFlags.String) !== 0;
        }

        isNumber(): boolean {
            return (this.flags & TypeFlags.Number) !== 0;
        }

        isBoolean(): boolean {
            return (this.flags & TypeFlags.Boolean) !== 0;
        }

        isVoid(): boolean {
            return (this.flags & TypeFlags.Void) !== 0;
        }

        isIntrinsic(): boolean {
            return (this.flags & TypeFlags.Intrinsic) !== 0;
        }

        isArray(): boolean {
            return this.hasBaseType(globalArrayType);
        }

        isObjectType(): boolean {
            return (this.flags & TypeFlags.ObjectType) !== 0;
        }

        getEnumValue(value: string, ignoreCase = false): number {

            if(!this.isEnum()) {
                throw new Error("Type must be an Enum type.");
            }

            var enumImplementation = this._getImplementation();

            if(!ignoreCase) {
                return enumImplementation[value];
            }

            value = value.toLowerCase();

            for(var name in enumImplementation) {
                if(enumImplementation.hasOwnProperty(name) && typeof name === "string") {
                    if(name.toLowerCase() === value) {
                        return enumImplementation[name];
                    }
                }
            }
        }

        getEnumName(value: number): string {

            if(!this.isEnum()) {
                throw new Error("Type must be an Enum type.");
            }

            var enumImplementation = this._getImplementation();
            return enumImplementation[value];
        }

        private _elementType: TypeImpl;

        getElementType(): TypeImpl {

            if(this._elementType !== undefined) {
                return this._elementType;
            }

            if(!this.isArray()) {
                throw new Error("Type must be an Array type");
            }

            var reference = getArrayReference(this);
            if(reference) {
                return this._elementType = reference.typeArguments[0];
            }

            function getArrayReference(type: TypeImpl): TypeImpl {
                var target = type._getTargetType();
                if(target === globalArrayType) {
                    return type;
                }
                return forEach(target.baseTypes, getArrayReference);
            }
        }

        createObject(args?: any[]): any {

            var constructor = this._getImplementation();

            if(!constructor.prototype) {
                throw new Error("Constructor '" + this.getFullName() + "' does not have a prototype.");
            }

            var instance = Object.create(constructor.prototype);
            if(args) {
                constructor.apply(instance, args);
            }
            return instance;
        }

        private _cachedImplementation: any;

        private _getImplementation(): any {

            var obj = this._cachedImplementation;
            if(obj) {
                return obj;
            }

            // find the module containing this class
            var moduleSymbol = this._findContainingExternalModule();
            if(!moduleSymbol) {
                // class is in the global namespace
                var obj = global;
                var moduleName = "globals"; // for error reporting
                var name = symbolToString(this.symbol);
            }
            else {
                // class is in an external module, load the javascript module
                var moduleName = moduleSymbol.name.replace(/^"|"$/g, "");
                if (isExternalModuleNameRelative(moduleName)) {
                    var obj = module.require(absolutePath(moduleName));
                }
                else {
                    var obj = module.require(moduleName);
                }

                // find the name of the symbol in the module
                var name = symbolToString(this.symbol, getResolvedExportSymbol(moduleSymbol));
            }
            if(name) {
                var path = name.split('.');
                for (var i = 0, l = path.length; i < l; i++) {
                    obj = obj[path[i]];
                    if (!obj) {
                        throw new Error("Could not find '" + name + "' in module '" + moduleName + "'.");
                    }
                }
            }

            return this._cachedImplementation = obj;
        }

        private _findContainingExternalModule(): Symbol {

            var symbol = this.symbol;

            while(symbol) {
                if(symbol.valueDeclaration && symbol.valueDeclaration.flags & NodeFlags.ExternalModule) {
                    return symbol;
                }
                symbol = symbol.parent;
            }
        }
    }
}
