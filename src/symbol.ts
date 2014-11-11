/// <reference path="declaration.ts"/>
/// <reference path="type.ts"/>

module reflect {

    export class Symbol {

        id: number;
        declarations: Declaration[];
        parent: Symbol;
        exports: SymbolTable;
        members: SymbolTable;
        valueDeclaration: Declaration;
        exportSymbol: Symbol;

        constructor(public flags: SymbolFlags, public name: string) {

        }
    }

    export interface SymbolLinks {
        target?: Symbol;               // Resolved (non-alias) target of an alias
        type?: Type;                   // Type of value symbol
        declaredType?: Type;           // Type of class, interface, enum, or type parameter
//        mapper?: TypeMapper;           // Type mapper for instantiation alias
        referenced?: boolean;          // True if alias symbol has been referenced as a value
        exportAssignSymbol?: Symbol;   // Symbol exported from external module
    }

    export interface SymbolTable {

        [index: string]: Symbol;
    }

    export enum SymbolFlags {
        Variable           = 0x00000001,  // Variable or parameter
        Property           = 0x00000002,  // Property or enum member
        EnumMember         = 0x00000004,  // Enum member
        Function           = 0x00000008,  // Function
        Class              = 0x00000010,  // Class
        Interface          = 0x00000020,  // Interface
        Enum               = 0x00000040,  // Enum
        ValueModule        = 0x00000080,  // Instantiated module
        NamespaceModule    = 0x00000100,  // Uninstantiated module
        TypeLiteral        = 0x00000200,  // Type Literal
        ObjectLiteral      = 0x00000400,  // Object Literal
        Method             = 0x00000800,  // Method
        Constructor        = 0x00001000,  // Constructor
        GetAccessor        = 0x00002000,  // Get accessor
        SetAccessor        = 0x00004000,  // Set accessor
        CallSignature      = 0x00008000,  // Call signature
        ConstructSignature = 0x00010000,  // Construct signature
        IndexSignature     = 0x00020000,  // Index signature
        TypeParameter      = 0x00040000,  // Type parameter

        // Export markers (see comment in declareModuleMember in binder)
        ExportValue        = 0x00080000,  // Exported value marker
        ExportType         = 0x00100000,  // Exported type marker
        ExportNamespace    = 0x00200000,  // Exported namespace marker

        Import             = 0x00400000,  // Import
        Instantiated       = 0x00800000,  // Instantiated symbol
        Merged             = 0x01000000,  // Merged symbol (created during program binding)
        Transient          = 0x02000000,  // Transient symbol (created during type check)
        Prototype          = 0x04000000,  // Symbol for the prototype property (without source code representation)

        Value     = Variable | Property | EnumMember | Function | Class | Enum | ValueModule | Method | GetAccessor | SetAccessor,
        Type      = Class | Interface | Enum | TypeLiteral | ObjectLiteral | TypeParameter,
        Namespace = ValueModule | NamespaceModule,
        Module    = ValueModule | NamespaceModule,
        Accessor  = GetAccessor | SetAccessor,
        Signature = CallSignature | ConstructSignature | IndexSignature,

        ParameterExcludes       = Value,
        VariableExcludes        = Value & ~Variable,
        PropertyExcludes        = Value,
        EnumMemberExcludes      = Value,
        FunctionExcludes        = Value & ~(Function | ValueModule),
        ClassExcludes           = (Value | Type) & ~ValueModule,
        InterfaceExcludes       = Type & ~Interface,
        EnumExcludes            = (Value | Type) & ~(Enum | ValueModule),
        ValueModuleExcludes     = Value & ~(Function | Class | Enum | ValueModule),
        NamespaceModuleExcludes = 0,
        MethodExcludes          = Value & ~Method,
        GetAccessorExcludes     = Value & ~SetAccessor,
        SetAccessorExcludes     = Value & ~GetAccessor,
        TypeParameterExcludes   = Type & ~TypeParameter,

        // Imports collide with all other imports with the same name.
        ImportExcludes          = Import,

        ModuleMember = Variable | Function | Class | Interface | Enum | Module | Import,

        ExportHasLocal = Function | Class | Enum | ValueModule,

        HasLocals  = Function | Module | Method | Constructor | Accessor | Signature,
        HasExports = Class | Enum | Module,
        HasMembers = Class | Interface | TypeLiteral | ObjectLiteral,

        IsContainer = HasLocals | HasExports | HasMembers,
        PropertyOrAccessor      = Property | Accessor,
        Export                  = ExportNamespace | ExportType | ExportValue,
    }

}