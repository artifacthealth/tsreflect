/// <reference path="symbol.ts"/>

module reflect {

    export enum NodeKind {

        SourceFile,

        InterfaceDeclaration,
        ClassDeclaration,
        EnumDeclaration,
        ModuleDeclaration,
        FunctionDeclaration,
        VariableDeclaration,
        ImportDeclaration,

        EnumMember,

        Index,
        Field,
        Method,
        Constructor,
        GetAccessor,
        SetAccessor,

        PropertySignature,
        ConstructSignature,
        MethodSignature,
        IndexSignature,
        CallSignature,

        FunctionType,
        ArrayType,
        ConstructorType,
        ObjectType,
        TypeReference,
        StringLiteral,

        Parameter,
        TypeParameter
    }

    export enum NodeFlags {

        None             = 0,
        Export           = 0x00000001,  // Declarations
        Ambient          = 0x00000002,  // Declarations
        QuestionMark     = 0x00000004,  // Parameter/Property/Method
        Rest             = 0x00000008,  // Parameter
        Public           = 0x00000010,  // Property/Method
        Private          = 0x00000020,  // Property/Method
        Static           = 0x00000040,  // Property/Method
        MultiLine        = 0x00000080,  // Multi-line array or object literal
        Synthetic        = 0x00000100,  // Synthetic node (for full fidelity)
        DeclarationFile  = 0x00000200,  // Node is a .d.ts file
        ExternalModule   = 0x00000400,  // External module declaration

        Modifier = Export | Ambient | Public | Private | Static
    }

    export interface Node {

        id?: number;                  // Unique id (used to look up NodeLinks)
        kind: NodeKind;
        flags: NodeFlags;
        parent?: Node;                // Parent node (initialized by binding)
        symbol?: Symbol;              // Symbol declared by node (initialized by binding)
        locals?: SymbolTable;         // Locals associated with node (initialized by binding)
        nextContainer?: Node;         // Next container in declaration order (initialized by binding)
        localSymbol?: Symbol;         // Local symbol declared by node (initialized by binding only for exported nodes)
    }

    export interface NodeLinks {
        resolvedType?: Type;            // Cached type of type node
        resolvedSignature?: Signature;  // Cached signature of signature node or call expression
        resolvedSymbol?: Symbol;        // Cached name resolution result
        flags?: NodeCheckFlags;         // Set of flags specific to Node
        enumMemberValue?: number;       // Constant value of enum member
        isIllegalTypeReferenceInConstraint?: boolean; // Is type reference in constraint refers to the type parameter from the same list
        isVisible?: boolean;            // Is this node visible
        localModuleName?: string;       // Local name for module instance
    }

    export enum NodeCheckFlags {
        TypeChecked    = 0x00000001,  // Node has been type checked
        LexicalThis    = 0x00000002,  // Lexical 'this' reference
        CaptureThis    = 0x00000004,  // Lexical 'this' used in body
        EmitExtends    = 0x00000008,  // Emit __extends
        SuperInstance  = 0x00000010,  // Instance 'super' reference
        SuperStatic    = 0x00000020,  // Static 'super' reference
        ContextChecked = 0x00000040,  // Contextual types have been assigned
    }
}