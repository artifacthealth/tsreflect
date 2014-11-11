/// <reference path="arrayUtil.ts"/>
/// <reference path="signature.ts"/>

module reflect {


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
        Anonymous          = 0x00002000,  // Anonymous
        FromSignature      = 0x00004000,  // Created for signature assignment check

        Intrinsic = Any | String | Number | Boolean | Void | Undefined | Null,
        StringLike = String | StringLiteral,
        NumberLike = Number | Enum,
        ObjectType = Class | Interface | Reference | Anonymous
    }

    // Properties common to all types
    export class Type {

        id: number;
        symbol: Symbol;

        constructor(public flags: TypeFlags) {

        }
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



    /*
    var nextTypeId = 1;

    export class Type {

        id: number;
        symbol: Symbol;

        constructor(public flags: TypeFlags) {

            this.id = nextTypeId++;
        }
    }

    export class ObjectType extends Type {

        signatures: Signature[];
    }

    export class InterfaceType extends ObjectType {

        baseTypes: Type[];

        constructor (flags: TypeFlags, symbol: Symbol) {

            super(flags);
            this.symbol = symbol;
        }
    }

    // Type references (TypeFlags.Reference)
    export class TypeReference extends ObjectType {

        target: GenericType;    // Type reference target
        typeArguments: Type[];  // Type reference type arguments

        constructor(symbol: Symbol) {

            super(TypeFlags.Reference);

            this.symbol = symbol;
        }
    }

    export class TypeParameter extends Type {

        constraint: Type;
    }

    export class GenericType extends InterfaceType {

        typeParameters: TypeParameter[];
        instantiations: Map<TypeReference>;   // Generic instantiation cache
        openReferenceTargets: GenericType[];  // Open type reference targets
        openReferenceChecks: Map<boolean>;    // Open type reference check cache

        constructor(flags: TypeFlags, symbol: Symbol, typeParameters: TypeParameter[]) {

            super(flags, symbol);

            this.typeParameters = typeParameters;
            this.instantiations = {};
        }
    }

    export class IntrinsicType extends Type {

        intrinsicName: string;  // Name of intrinsic type

        constructor(flags: TypeFlags, intrinsicName: string) {

            super(flags);

            this.intrinsicName = intrinsicName;
        }
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
        Anonymous          = 0x00002000,  // Anonymous
        FromSignature      = 0x00004000,  // Created for signature assignment check

        Intrinsic = Any | String | Number | Boolean | Void | Undefined | Null,
        StringLike = String | StringLiteral,
        NumberLike = Number | Enum,
        ObjectType = Class | Interface | Reference | Anonymous
    }*/
}