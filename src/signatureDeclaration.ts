module reflect {

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

}