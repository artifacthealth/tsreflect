/// <reference path="types.ts"/>

module reflect {

    export const enum NodeKind {

        SourceFile,

        InterfaceDeclaration,
        ClassDeclaration,
        EnumDeclaration,
        ModuleDeclaration,
        FunctionDeclaration,
        VariableDeclaration,
        ImportDeclaration,
        TypeAliasDeclaration,

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
        TupleType,
        UnionType,

        Parameter,
        TypeParameter
    }

    export const enum NodeFlags {
        None                = 0,
        Export              = 0x00000001,  // Declarations
        Ambient             = 0x00000002,  // Declarations
        Public              = 0x00000010,  // Property/Method
        Private             = 0x00000020,  // Property/Method
        Protected           = 0x00000040,  // Property/Method
        Static              = 0x00000080,  // Property/Method
        MultiLine           = 0x00000100,  // Multi-line array or object literal
        Synthetic           = 0x00000200,  // Synthetic node (for full fidelity)
        DeclarationFile     = 0x00000400,  // Node is a .d.ts file
        Let                 = 0x00000800,  // Variable declaration
        Const               = 0x00001000,  // Variable declaration
        OctalLiteral        = 0x00002000,
        ExternalModule      = 0x00004000,  // External module flag
        QuestionMark        = 0x00008000,  // Parameter/Property/Method
        Rest                = 0x00010000,  // Parameter

        Modifier = Export | Ambient | Public | Private | Protected | Static,
        AccessibilityModifier = Public | Private | Protected,
        BlockScoped = Let | Const
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
        enumMemberValue?: number;       // Constant value of enum member
        isIllegalTypeReferenceInConstraint?: boolean; // Is type reference in constraint refers to the type parameter from the same list
        isVisible?: boolean;            // Is this node visible
        localModuleName?: string;       // Local name for module instance
    }

    export interface Block extends Node {

        declares?: ModuleElementDeclaration[];
        exportName?: string;
    }

    export interface SourceFile extends Block {

        filename: string;
        references?: string[];
        noDefaultLib?: boolean;
    }

    export interface Annotation {

        name: string;
        value: any;
    }

    export interface Declaration extends Node {

        name?: string;
        description?: string;
        annotations?: Annotation[];   // Array of custom annotations
    }


    // Module Element Declarations

    export interface ModuleElementDeclaration extends Declaration {

    }

    export interface EnumDeclaration extends ModuleElementDeclaration {

        members: EnumMemberDeclaration[];
    }

    export interface EnumMemberDeclaration extends Declaration {

        value?: number;
    }

    export interface VariableDeclaration extends ModuleElementDeclaration {

        type: TypeNode;
    }

    export interface FunctionDeclaration extends ModuleElementDeclaration, CallSignatureDeclaration {

    }

    export interface InterfaceDeclaration extends ModuleElementDeclaration {

        typeParameters?: TypeParameterDeclaration[];
        extends?: TypeReferenceNode[];
        signatures?: SignatureDeclaration[];
    }

    export interface ClassDeclaration extends ModuleElementDeclaration {

        typeParameters?: TypeParameterDeclaration[];
        extends?: TypeReferenceNode;
        implements?: TypeReferenceNode[];
        members?: MemberDeclaration[];
    }

    export interface ModuleDeclaration extends ModuleElementDeclaration, Block {

    }

    export interface ImportDeclaration extends ModuleElementDeclaration {

        value?: string;
        require?: string;
    }

    export interface TypeAliasDeclaration extends ModuleElementDeclaration {
        name: string;
        type: TypeNode;
    }

    // Class Member Declarations

    export interface MemberDeclaration extends Declaration {

    }

    export interface FieldMemberDeclaration extends MemberDeclaration {

        type?: TypeNode
    }

    export interface MethodMemberDeclaration extends MemberDeclaration, CallSignatureDeclaration {

    }

    export interface GetAccessorMemberDeclaration extends MemberDeclaration {

        returns?: TypeNode;
    }

    export interface SetAccessorMemberDeclaration extends MemberDeclaration {

        parameter: ParameterDeclaration;
    }

    export interface ConstructorMemberDeclaration extends MemberDeclaration {

        parameters?: ParameterDeclaration[];
    }

    export interface IndexMemberDeclaration extends  MemberDeclaration {

        parameter: ParameterDeclaration;
        returns: TypeNode;
    }


    // Signature Declarations

    export interface SignatureDeclaration extends Declaration {

    }

    export interface CallSignatureDeclaration extends SignatureDeclaration {

        typeParameters?: TypeParameterDeclaration[];
        parameters?: ParameterDeclaration[];
        returns?: TypeNode;
    }

    export interface ParameterDeclaration extends Declaration {

        type?: TypeNode;
    }

    export interface TypeParameterDeclaration extends Declaration {

        constraint?: TypeNode;
    }

    export interface PropertySignatureDeclaration extends SignatureDeclaration {

        type?: TypeNode
    }

    export interface MethodSignatureDeclaration extends CallSignatureDeclaration {

    }

    export interface ConstructSignatureDeclaration extends CallSignatureDeclaration {

    }

    export interface IndexSignatureDeclaration extends  SignatureDeclaration {

        parameter: ParameterDeclaration;
        returns: TypeNode;
    }


    // Type Nodes

    export interface TypeNode extends Node {

    }

    export interface FunctionTypeNode extends TypeNode, CallSignatureDeclaration {

    }

    export interface ArrayTypeNode extends TypeNode {

        type: TypeNode;
    }

    export interface TupleTypeNode extends TypeNode {

        types: TypeNode[];
    }

    export interface UnionTypeNode extends TypeNode {

        types: TypeNode[];
    }

    export interface ConstructorTypeNode extends FunctionTypeNode {

    }

    export interface ObjectTypeNode extends TypeNode {

        signatures: SignatureDeclaration[];
    }

    export interface TypeReferenceNode extends TypeNode {

        type: string;
        arguments?: TypeNode[];
    }

    export interface StringLiteralTypeNode extends TypeNode {

        text: string;
    }
}