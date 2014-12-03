/// <reference path="arrayUtil.ts"/>

module reflect {

    export interface SymbolLinks {
        target?: Symbol;               // Resolved (non-alias) target of an alias
        type?: Type;                   // Type of value symbol
        declaredType?: Type;           // Type of class, interface, enum, or type parameter
        mapper?: TypeMapper;           // Type mapper for instantiation alias
        referenced?: boolean;          // True if alias symbol has been referenced as a value
        exportAssignSymbol?: Symbol;   // Symbol exported from external module
    }

    export interface TransientSymbol extends Symbol, SymbolLinks { }

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
        Prototype          = 0x04000000,  // Symbol for the prototype property (without source code representation

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

    export interface Symbol {
        flags: SymbolFlags;            // Symbol flags
        name: string;                  // Name of symbol
        id?: number;                   // Unique id (used to look up SymbolLinks)
        mergeId?: number;              // Merge id (used to look up merged symbol)
        declarations?: Declaration[];  // Declarations associated with this symbol
        parent?: Symbol;               // Parent symbol
        members?: SymbolTable;         // Class, interface or literal instance members
        exports?: SymbolTable;         // Module exports
        exportSymbol?: Symbol;         // Exported symbol associated with this symbol
        valueDeclaration?: Declaration // First value declaration of the symbol
    }

    export enum TypeFlags {
        Any                = 0x00000001,
        String             = 0x00000002,
        Number             = 0x00000004,
        Boolean            = 0x00000008,
        Void               = 0x00000010,
        Undefined          = 0x00000020,
        Null               = 0x00000040,
        Enum               = 0x00000080,  // Enum type
        StringLiteral      = 0x00000100,  // String literal type
        TypeParameter      = 0x00000200,  // Type parameter
        Class              = 0x00000400,  // Class
        Interface          = 0x00000800,  // Interface
        Reference          = 0x00001000,  // Generic type reference
        Tuple              = 0x00002000,  // Tuple
        Anonymous          = 0x00004000,  // Anonymous
        FromSignature      = 0x00008000,  // Created for signature assignment check

        Intrinsic = Any | String | Number | Boolean | Void | Undefined | Null,
        StringLike = String | StringLiteral,
        NumberLike = Number | Enum,
        ObjectType = Class | Interface | Reference | Tuple | Anonymous
    }

    // Properties common to all types
    export interface Type {
        flags: TypeFlags;  // Flags
        id: number;        // Unique ID
        symbol?: Symbol;   // Symbol associated with type (if any)
    }

    // Intrinsic types (TypeFlags.Intrinsic)
    export interface IntrinsicType extends Type {
        intrinsicName: string;  // Name of intrinsic type
    }

    // String literal types (TypeFlags.StringLiteral)
    export interface StringLiteralType extends Type {
        text: string;  // Text of string literal
    }

    // Object types (TypeFlags.ObjectType)
    export interface ObjectType extends Type { }

    export interface ApparentType extends Type {
        // This property is not used. It is just to make the type system think ApparentType
        // is a strict subtype of Type.
        _apparentTypeBrand: any;
    }

    // Class and interface types (TypeFlags.Class and TypeFlags.Interface)
    export interface InterfaceType extends ObjectType {
        typeParameters: TypeParameter[];           // Type parameters (undefined if non-generic)
        baseTypes: ObjectType[];                   // Base types
        declaredProperties: Symbol[];              // Declared members
        declaredCallSignatures: Signature[];       // Declared call signatures
        declaredConstructSignatures: Signature[];  // Declared construct signatures
        declaredStringIndexType: Type;             // Declared string index type
        declaredNumberIndexType: Type;             // Declared numeric index type
    }

    // Type references (TypeFlags.Reference)
    export interface TypeReference extends ObjectType {
        target: GenericType;    // Type reference target
        typeArguments: Type[];  // Type reference type arguments
    }

    // Generic class and interface types
    export interface GenericType extends InterfaceType, TypeReference {
        instantiations: Map<TypeReference>;   // Generic instantiation cache
        openReferenceTargets: GenericType[];  // Open type reference targets
        openReferenceChecks: Map<boolean>;    // Open type reference check cache
    }

    export interface TupleType extends ObjectType {
        elementTypes: Type[];          // Element types
        baseArrayType: TypeReference;  // Array<T> where T is best common type of element types
    }

    // Resolved object type
    export interface ResolvedObjectType extends ObjectType {
        members: SymbolTable;              // Properties by name
        properties: Symbol[];              // Properties
        callSignatures: Signature[];       // Call signatures of type
        constructSignatures: Signature[];  // Construct signatures of type
        stringIndexType: Type;             // String index type
        numberIndexType: Type;             // Numeric index type
    }

    // Type parameters (TypeFlags.TypeParameter)
    export interface TypeParameter extends Type {
        constraint: Type;        // Constraint
        target?: TypeParameter;  // Instantiation target
        mapper?: TypeMapper;     // Instantiation mapper
    }

    export enum SignatureKind {
        Call,
        Construct,
    }

    export interface Signature {
        declaration: SignatureDeclaration;  // Originating declaration
        typeParameters: TypeParameter[];    // Type parameters (undefined if non-generic)
        parameters: Symbol[];               // Parameters
        resolvedReturnType: Type;           // Resolved return type
        minArgumentCount: number;           // Number of non-optional parameters
        hasRestParameter: boolean;          // True if last parameter is rest parameter
        hasStringLiterals: boolean;         // True if specialized
        target?: Signature;                 // Instantiation target
        mapper?: TypeMapper;                // Instantiation mapper
        erasedSignatureCache?: Signature;   // Erased version of signature (deferred)
        isolatedSignatureType?: ObjectType; // A manufactured type that just contains the signature for purposes of signature comparison
    }

    export enum IndexKind {
        String,
        Number,
    }

    export interface TypeMapper {
        (t: Type): Type;
    }
}