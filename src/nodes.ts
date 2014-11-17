/// <reference path="types.ts"/>

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
        TupleType,

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
        Protected        = 0x00000040,  // Property/Method
        Static           = 0x00000080,  // Property/Method
        MultiLine        = 0x00000100,  // Multi-line array or object literal
        Synthetic        = 0x00000200,  // Synthetic node (for full fidelity)
        ExternalModule   = 0x00000400,  // External module flag

        Modifier = Export | Ambient | Public | Private | Protected | Static,
        AccessibilityModifier = Public | Private | Protected
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