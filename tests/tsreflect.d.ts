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

    flags: SymbolFlags;
    name: string;

    resolve (name: string, meaning?: SymbolFlags): Symbol;
    getType(): Type;
    getDeclaredType(): Type;
}

export interface Type {

}

export declare function require (moduleName: string): Symbol;
export declare function reference (filename: string): void;
export declare function resolve (name: string, meaning?: SymbolFlags): Symbol;
