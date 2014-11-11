module reflect {

    export class Signature {

        kind: SignatureKind;
        declaration: SignatureDeclaration;
    }

    export enum SignatureKind {

        Call,
        Construct,
        Index,
        Method,
        Property
    }

    export class CallSignature extends Signature {

        typeParameters: TypeParameter[];
        parameters: Parameter[];
        returnType: Type;
    }

    export class PropertySignature extends Signature {

        symbol: Symbol;
    }

    export class Parameter {

        flags: ParameterFlags;
        symbol: Symbol;
    }

    export enum ParameterFlags {

        None,
        Optional,
        Rest
    }

}