module reflect {

    export class SignatureImpl implements Signature {

        declaration: SignatureDeclaration;  // Originating declaration
        typeParameters: TypeParameter[];    // Type parameters (undefined if non-generic)
        parameters: Symbol[];               // Parameters
        resolvedReturnType: Type;           // Resolved return type
        minArgumentCount: number;           // Number of non-optional parameters
        hasRestParameter: boolean;          // True if last parameter is rest parameter
        hasStringLiterals: boolean;         // True if specialized
        annotations: Annotation[];
        annotationsByName: AnnotationMap;

        getDescription(): string {

            return this.declaration.description;
        }

        getParameters(): Symbol[] {

            return this.parameters;
        }

        private parametersByName: { [name: string]: Symbol };

        getParameter(name: string): Symbol {

            if(!this.parametersByName) {

                this.parametersByName = {};
                forEach(this.parameters, parameter => {
                    this.parametersByName[parameter.name] = parameter;
                });
            }

            return this.parametersByName[name];
        }

        getReturnType(): Type {

            return getReturnTypeOfSignature(this);
        }

        getAnnotations(name?: string): Annotation[] {

            return getAnnotationsFromSymbolOrSignature(name, this);
        }

        hasAnnotation(name: string): boolean {

            return hasAnnotation(name, this);
        }
    }
}