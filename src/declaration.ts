/// <reference path="node.ts"/>
/// <reference path="memberDeclaration.ts"/>
/// <reference path="signatureDeclaration.ts"/>
/// <reference path="typeNode.ts"/>
/// <reference path="diagnostics.ts"/>

module reflect {

    export interface Block extends Node {

        declares?: ModuleElementDeclaration[];
        exportName?: string;
    }

    export interface SourceFile extends Block {

        filename: string;
        references?: string[];
        errors: Diagnostic[];
        hasNoDefaultLib: boolean; // TODO: handle this
    }

    export interface Declaration extends Node {

        name?: string;
        description?: string;
    }

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

}