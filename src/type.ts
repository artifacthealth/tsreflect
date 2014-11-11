/// <reference path="signature.ts"/>

module reflect {

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
    }
}