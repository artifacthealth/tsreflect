/*! *****************************************************************************
 The source code contained in this file was originally from TypeScript by
 Microsoft. It has been modified by Artifact Health, LLC. The original copyright notice
 is provide below for informational purposes only.

 Copyright (c) Artifact Health, LLC. All rights reserved.
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 this file except in compliance with the License. You may obtain a copy of the
 License at http://www.apache.org/licenses/LICENSE-2.0

 THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
 WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 MERCHANTABLITY OR NON-INFRINGEMENT.

 See the Apache Version 2.0 License for specific language governing permissions
 and limitations under the License.


 Original Microsoft Copyright Notice:

 Copyright (c) Microsoft Corporation. All rights reserved.
 Licensed under the Apache License, Version 2.0 (the "License"); you may not use
 this file except in compliance with the License. You may obtain a copy of the
 License at http://www.apache.org/licenses/LICENSE-2.0

 THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
 WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
 MERCHANTABLITY OR NON-INFRINGEMENT.

 See the Apache Version 2.0 License for specific language governing permissions
 and limitations under the License.
 ***************************************************************************** */

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

        private _checker: TypeChecker;

        constructor(checker: TypeChecker) {
            this._checker = checker;
        }

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

            return this._checker.getReturnTypeOfSignature(this);
        }

        getAnnotations(name?: string): Annotation[] {

            return getAnnotationsFromSymbolOrSignature(this._checker, name, this);
        }

        hasAnnotation(name: string): boolean {

            return hasAnnotation(this._checker, name, this);
        }
    }
}