/// <reference path="node.ts"/>

module reflect {

    export interface TypeNode extends Node {

    }

    export interface FunctionTypeNode extends TypeNode, CallSignatureDeclaration {

    }

    export interface ArrayTypeNode extends TypeNode {

        type: TypeNode;
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

