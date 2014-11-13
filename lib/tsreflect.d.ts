declare module "tsreflect" {

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

        flags: SymbolFlags;
        name: string;

        resolve (name: string, meaning?: SymbolFlags): Symbol;
        getType(): Type;
        getDeclaredType(): Type;
    }

    interface Type {

    }

    function require (moduleName: string): Symbol;
    function reference (filename: string): void;
    function resolve (name: string, meaning?: SymbolFlags): Symbol;
}