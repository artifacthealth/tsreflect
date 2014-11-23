
module reflect {

    export class TypeImpl implements Type {

        id: number;
        symbol: Symbol;

        constructor(public flags: TypeFlags) {

        }

        getFullName(): string {
            if (this.symbol) {
                return (<SymbolImpl>this.symbol).getFullName();
            }
        }

        getName(): string {
            if (this.symbol) {
                return (<SymbolImpl>this.symbol).getName();
            }
        }

        getDescription(): string {
            if (this.symbol) {
                return (<SymbolImpl>this.symbol).getDescription();
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

            var annotations = (<SymbolImpl>this.symbol).getAnnotations(name);

            if(inherit) {
                forEach((<InterfaceType>(<any>this)).baseTypes, baseType => {
                   annotations = ((<TypeImpl>baseType).getAnnotations(name, inherit)).concat(annotations);
                });
            }

            return annotations;
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

        isObjectType(): boolean {
            return (this.flags & TypeFlags.ObjectType) !== 0;
        }

        getEnumValue(value: string, ignoreCase = false): number {

            if(!this.isEnum()) {
                throw new Error("Type must be an Enum type.");
            }

            var enumImplementation = getImplementationOfType(this);

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

            var enumImplementation = getImplementationOfType(this);
            return enumImplementation[value];
        }

    }
}
