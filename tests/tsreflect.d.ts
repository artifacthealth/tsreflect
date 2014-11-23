export declare function require (moduleName: string): Symbol;
export declare function reference (filename: string): void;
export declare function resolve (entityName: string): Symbol;
export declare function createObject(classType: Type): any;

export declare enum SymbolFlags {

    Variable,
    Property,
    EnumMember,
    Function,
    Class,
    Interface,
    Enum,
    ValueModule,
    NamespaceModule,
    TypeLiteral,
    Method,
    Constructor,
    GetAccessor,
    SetAccessor,
    CallSignature,
    ConstructSignature,
    IndexSignature,
    TypeParameter,
    Import,
    Value,
    Type,
    Namespace,
    Module,
    Accessor,
    Signature,
    ModuleMember
}

export interface Symbol {

    getFullName(): string;
    getName(): string;
    getDescription(): string;
    getAnnotations(name?: string): Annotation[];

    getFlags(): SymbolFlags;

    getType(): Type;
    getDeclaredType(): Type;

    resolve (name: string): Symbol;

    isVariable(): boolean;
    isFunction(): boolean;
    isClass(): boolean;
    isInterface(): boolean;
    isEnum(): boolean;
    isModule(): boolean;
    isImport(): boolean;
    isTypeParameter(): boolean;
    isProperty(): boolean;
    isMethod(): boolean;
    isAccessor(): boolean;
    isGetAccessor(): boolean;
    isSetAccessor(): boolean;
    isEnumMember(): boolean;

}

export interface Annotation {

    name: string;
    value: any;
}

export declare enum TypeFlags {
    Any,
    String,
    Number,
    Boolean,
    Void,
    Undefined,
    Null,
    Enum,
    StringLiteral,
    TypeParameter,
    Class,
    Interface,
    Reference,
    Tuple,
    Anonymous,
    FromSignature,
    Intrinsic,
    StringLike,
    NumberLike,
    ObjectType
}

export interface Type {

    getFullName(): string;
    getName(): string;
    getDescription(): string;
    getAnnotations(inherit: boolean): Annotation[];
    getAnnotations(name?: string, inherit?: boolean): Annotation[];

    getFlags(): TypeFlags;

    getProperties(): Symbol[];
    getProperty(name: string): Symbol;
    getCallSignatures(): Signature[];
    getConstructSignatures(): Signature[];
    getStringIndexType(): Type;
    getNumberIndexType(): Type;

    isIdenticalTo(target: Type, diagnostics?: Diagnostic[]): boolean;
    isSubtypeOf(target: Type, diagnostics?: Diagnostic[]): boolean;
    isAssignableTo(target: Type, diagnostics?: Diagnostic[]): boolean;

    isClass(): boolean;
    isInterface(): boolean;
    isTuple(): boolean;
    isAnonymous(): boolean;
    isReference(): boolean;
    isEnum(): boolean;
    isStringLiteral(): boolean;
    isTypeParameter(): boolean;
    isAny(): boolean;
    isString(): boolean;
    isNumber(): boolean;
    isBoolean(): boolean;
    isVoid(): boolean;
    isIntrinsic(): boolean;
    isObjectType(): boolean;

    getEnumValue(value: string, ignoreCase?: boolean): number;
    getEnumName(value: number): string;
    getReferenceTarget(): Type;
}

export interface Signature {

    getDescription(): string;
    getAnnotations(name?: string): Annotation[];

    getParameters(): Symbol[];
    getParameter(name: string): Symbol;
    getReturnType(): Type;
}

export interface Diagnostic {

    filename?: string;
    messageText: string;
    code: number;
}