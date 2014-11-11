module reflect {

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

}
