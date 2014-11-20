declare module "tsreflect" {

    function require (moduleName: string): Symbol;
    function reference (fileName: string): void;
    function resolve (entityName: string): Symbol;
    function createObject(classType: Type): any;

    enum SymbolFlags {

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

    interface Symbol {

        getName(): string;
        getFullName(): string;
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

    interface Annotation {

        name: string;
        value: any;
    }

    export enum TypeFlags {
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

    interface Type {

        getName(): string;
        getFullName(): string;
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
    }

    interface Signature {

        getDescription(): string;
        getAnnotations(name?: string): Annotation[];

        getParameters(): Symbol[];
        getParameter(name: string): Symbol;
        getReturnType(): Type;
    }

    interface Diagnostic {

        filename?: string;
        messageText: string;
        code: number;
    }

}