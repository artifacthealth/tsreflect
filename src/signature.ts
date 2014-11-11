module reflect {

    export enum SignatureKind {
        Call,
        Construct,
    }

    export class Signature {
        declaration: SignatureDeclaration;  // Originating declaration
        typeParameters: TypeParameter[];    // Type parameters (undefined if non-generic)
        parameters: Symbol[];               // Parameters
        resolvedReturnType: Type;           // Resolved return type
        minArgumentCount: number;           // Number of non-optional parameters
        hasRestParameter: boolean;          // True if last parameter is rest parameter
        hasStringLiterals: boolean;         // True if instantiated
        target: Signature;                 // Instantiation target
        mapper: TypeMapper;                // Instantiation mapper
        erasedSignatureCache: Signature;   // Erased version of signature (deferred)
    }

    export enum IndexKind {
        String,
        Number,
    }
    /*
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
*/
}