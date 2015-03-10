/*! *****************************************************************************
 The source code contained in this file was originally from TypeScript by
 Microsoft. It has been modified by Artifact Health, LLC. The original copyright notice
 is provide below for informational purposes only.

 Copyright (c) Artifact Health, LLC. All rights reserved.
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 this file except in compliance with the License. You may obtain a copy of the
 License at http://www.apache.org/licenses/LICENSE-2.0

 THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
 WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 MERCHANTABLITY OR NON-INFRINGEMENT.

 See the Apache Version 2.0 License for specific language governing permissions
 and limitations under the License.


 Original Microsoft Copyright Notice:

 Copyright (c) Microsoft Corporation. All rights reserved.
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 this file except in compliance with the License. You may obtain a copy of the
 License at http://www.apache.org/licenses/LICENSE-2.0

 THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
 WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 MERCHANTABLITY OR NON-INFRINGEMENT.

 See the Apache Version 2.0 License for specific language governing permissions
 and limitations under the License.
 ***************************************************************************** */

module reflect {

    export class TypeImpl implements Type, IntrinsicType, InterfaceType, TypeReference, GenericType, TupleType, UnionType {

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
        elementTypes: TypeImpl[];          // Element types
        types: TypeImpl[];                    // Constituent types
        baseArrayType: TypeImpl;  // Array<T> where T is best common type of element types

        resolvedProperties: SymbolTable;  // Cache of resolved properties

        private _checker: TypeChecker;


        constructor(checker: TypeChecker, public flags: TypeFlags) {
            this._checker = checker;
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

            // TODO: what about duplicates from inherited annotations? Should we only inherit from classes?
            if(inherit) {
                var baseTypes = this.baseTypes;
                for(var i = 0, l = baseTypes.length; i < l; i++) {
                    var baseType = baseTypes[i];
                    annotations = (baseType.getAnnotations(name, inherit)).concat(annotations);
                }
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
                var baseTypes = this.baseTypes;
                for(var i = 0, l = baseTypes.length; i < l; i++) {

                    if (baseTypes[i].hasAnnotation(name, inherit)) {
                        return true;
                    }
                }
            }

            return false;
        }

        getProperties(): Symbol[] {

            return this._checker.getPropertiesOfType(this);
        }

        getProperty(name: string): Symbol {

            return this._checker.getPropertyOfType(this, name);
        }

        getCallSignatures(): Signature[] {

            return this._checker.getSignaturesOfType(this, SignatureKind.Call);
        }

        getConstructSignatures(): Signature[] {

            return this._checker.getSignaturesOfType(this, SignatureKind.Construct);
        }

        getStringIndexType(): Type {

            return this._checker.getIndexTypeOfType(this, IndexKind.String);
        }

        getNumberIndexType(): Type {

            return this._checker.getIndexTypeOfType(this, IndexKind.Number);
        }

        isIdenticalTo(target: Type, diagnostics?: Diagnostic[]): boolean {

            return this._checker.isTypeIdenticalTo(this, target, diagnostics);
        }

        isSubtypeOf(target: Type, diagnostics?: Diagnostic[]): boolean {

            return this._checker.isTypeSubtypeOf(this, target, diagnostics);
        }

        isAssignableTo(target: Type, diagnostics?: Diagnostic[]): boolean {

            return this._checker.isTypeAssignableTo(this, target, diagnostics);
        }

        hasBaseType(target: Type): boolean {

            // TODO: cache?
            return check(this);
            function check(type: TypeImpl): boolean {
                var type = type._getTargetType();
                return type === target || forEach(type.baseTypes, check);
            }
        }

        getBaseTypes(): TypeImpl[] {
            return this.baseTypes;
        }

        getBaseType(name: string): TypeImpl {

            // TODO: cache?
            return check(this);
            function check(type: TypeImpl): TypeImpl {
                var type = type._getTargetType();
                if(type.getName() == name) {
                    return type;
                }
                return forEach(type.baseTypes, check);
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
                baseClass = baseClass.getBaseClass();
            }
            return false;
        }

        private _baseClass: TypeImpl;

        private getBaseClass(): TypeImpl {

            // note: does not check that the current type is a class. if the current type is an interface,
            // this could incorrectly return that it has a base class if the interface extends a class.

            if(this._baseClass !== undefined) {
                return this._baseClass;
            }

            var baseClass: TypeImpl = null;

            var baseTypes = this.baseTypes;
            for(var i = 0, l = baseTypes.length; i < l; i++) {

                var candidate = baseTypes[i]._getTargetType();
                if(candidate.flags & TypeFlags.Class) {
                    baseClass = candidate;
                    break;
                }
            }

            return this._baseClass = baseClass;
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

        isUnion(): boolean {
            return (this.flags & TypeFlags.Union) !== 0;
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
            return this.hasBaseType(this._checker.getGlobalArrayType());
        }

        private _isIndex: boolean;

        isIndex(): boolean {
            return this._isIndex || (this._isIndex = !!(this.getStringIndexType() || this.getNumberIndexType()));
        }

        isObjectType(): boolean {
            return (this.flags & TypeFlags.ObjectType) !== 0;
        }

        getEnumValue(value: string, ignoreCase = false): number {

            if(!this.isEnum()) {
                throw new Error("Type must be an Enum type.");
            }

            var enumMapping = this._getEnumMapping();
            if(!ignoreCase) {
                return enumMapping[value];
            }

            value = value.toLowerCase();

            for(var name in enumMapping) {
                if(enumMapping.hasOwnProperty(name) && isNaN(name)) {
                    if(name.toLowerCase() === value) {
                        return enumMapping[name];
                    }
                }
            }
        }

        private _enumNames: string[];

        // TODO: need to decide how to handle const enums

        getEnumNames(): string[] {

            if(this._enumNames) {
                return this._enumNames;
            }

            if(!this.isEnum()) {
                throw new Error("Type must be an Enum type.");
            }

            var names: string[] = [];

            var enumMapping = this._getEnumMapping();
            for(var name in enumMapping) {
                if(enumMapping.hasOwnProperty(name) && isNaN(name)) {
                    names.push(name);
                }
            }

            return this._enumNames = names;
        }

        getEnumName(value: number): string {

            if(!this.isEnum()) {
                throw new Error("Type must be an Enum type.");
            }

            var enumMapping = this._getEnumMapping();
            return enumMapping[value];
        }

        private _enumMapping: any;

        private _getEnumMapping(): any {

            if(this._enumMapping) {
                return this._enumMapping;
            }

            var exports = this.symbol.exports;

            // See if the implementation is available
            var enumImplementation = this._getImplementation();
            if(enumImplementation) {
                // check to make sure the implementation is valid
                var valid = true;
                for(var name in exports) {
                    if(enumImplementation[name] === undefined) {
                        valid = false;
                        break;
                    }
                }
                if(valid) {
                    return this._enumMapping = enumImplementation;
                }
            }

            // Can't find valid implementation. May be a const enum. Try to build the mapping from the declarations.
            var mapping: any = {};
            for(var name in exports) {
                var value = (<EnumMemberDeclaration>exports[name].valueDeclaration).value;
                if(value !== undefined) {
                    mapping[name] = value;
                    mapping[value] = name;
                }
            }

            return this._enumMapping = mapping;
        }


        private _elementType: TypeImpl;

        getElementType(): TypeImpl {

            if(this._elementType !== undefined) {
                return this._elementType;
            }

            if(!this.isArray()) {
                throw new Error("Type must be an Array type");
            }

            var elementType: TypeImpl = null;
            var globalArrayType = this._checker.getGlobalArrayType();

            var reference = getArrayReference(this);
            if(reference) {
                elementType = reference.typeArguments[0];
            }
            return this._elementType = elementType;

            function getArrayReference(type: TypeImpl): TypeImpl {
                var target = type._getTargetType();
                if(target === globalArrayType) {
                    return type;
                }
                return forEach(target.baseTypes, getArrayReference);
            }
        }

        getElementTypes(): TypeImpl[] {

            if(this.isUnion()) {
                return this.types;
            }

            if(this.isTuple()) {
                return this.elementTypes;
            }

            throw new Error("Type must be a Union or Tuple type");
        }

        createInstance(args?: any[]): any {

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

        getConstructor(): Function {

            if(!this.isClass()) {
                throw new Error("Type must be a Class type");
            }
            return this._getImplementation();
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
                var name = this._checker.symbolToString(this.symbol);
            }
            else {
                // class is in an external module, load the javascript module
                var moduleName = moduleSymbol.name.replace(/^"|"$/g, "");
                if (this._checker.isExternalModuleNameRelative(moduleName)) {
                    var obj = module.require(absolutePath(moduleName));
                }
                else {
                    var obj = module.require(moduleName);
                }

                // find the name of the symbol in the module
                var name = this._checker.symbolToString(this.symbol, this._checker.getResolvedExportSymbol(moduleSymbol));
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
