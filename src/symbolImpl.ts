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

    export class SymbolImpl implements Symbol {

        id: number;
        declarations: Declaration[];
        valueDeclaration: Declaration; // First value declaration of the symbol
        annotations: Annotation[];
        annotationsByName: AnnotationMap;
        parent: SymbolImpl;               // Parent symbol
        exports: SymbolTable;         // Module exports
        private _checker: TypeChecker;

        constructor(checker: TypeChecker, public flags: SymbolFlags, public name: string) {
            this._checker = checker;
        }

        resolve(name: string, meaning: SymbolFlags = SymbolFlags.Namespace | SymbolFlags.Type | SymbolFlags.Value): Symbol {

            if (!name) {
                throw new Error("Missing required argument 'name'.")
            }

            if (!this.declarations || this.declarations.length == 0) {
                return undefined;
            }

            var ret = this._checker.resolveEntityName(this.declarations[0], name, meaning);
            this._throwIfErrors();
            return ret;
        }

        getValue(obj: any): any {

            if(!this.name || (this.flags & (SymbolFlags.Property | SymbolFlags.Variable | SymbolFlags.Accessor)) === 0) {
                throw new Error("Symbol must be a property, accessor, or variable.");
            }

            // Generate getters for VM optimization on first call to the getter. Verified that this improves performance
            // more than 3x for subsequent calls. We need to wait until the first call to generate the getter because
            // the 'flags' are not necessarily set in the constructor.
            // https://docs.google.com/document/d/10W46qDNO8Dl0Uye3QX0oUDPYAwaPl0qNy73TVLjd1WI/edit?pli=1#heading=h.rigwvvsmj92x
            this.getValue = <any>(new Function("o", "return o['" + this.name + "']"));

            return obj[this.name];
        }

        setValue(obj: any, value: any): void {

            if(!this.name || (this.flags & (SymbolFlags.Property | SymbolFlags.Variable | SymbolFlags.Accessor)) === 0) {
                throw new Error("Symbol must be a property, accessor, or variable.");
            }

            // See comment in getValue. Verified performance improvement for setting a value as well, but for
            // setting we got almost a 10x performance improvement.
            this.setValue = <any>(new Function("o,v", "o['" + this.name + "'] = v"));

            obj[this.name] = value;
        }

        getFullName(): string {

            return this._checker.symbolToString(this)
        }

        getName(): string {

            return this.name;
        }

        getDescription(): string {

            var declarations = this.declarations;
            for(var i = 0, l = declarations.length; i < l; i++) {
                var declaration = declarations[i];

                var description = declaration.description;
                if(description) {
                    return description;
                }
            }
        }

        // TODO: list all symbols in symbol? List all types in symbol? List all symbols with annotation?
        getAnnotations(name?: string): Annotation[] {

            return getAnnotationsFromSymbolOrSignature(this._checker, name, this);
        }

        hasAnnotation(name: string): boolean {

            return hasAnnotation(this._checker, name, this);
        }

        getType(): Type {

            // TODO:  return unknown type as undefined? or maybe this is better. We can still have a way to check for
            // unknown but code that wants to get properties of type or something can continue without a separate check.
            var ret = this._checker.getTypeOfSymbol(this);
            this._throwIfErrors();
            return ret;
        }

        getDeclaredType(): Type {

            var ret = this._checker.getDeclaredTypeOfSymbol(this);
            this._throwIfErrors();
            return ret;
        }

        getExports(): Symbol[] {

            var ret = this._checker.getExportedSymbols(this.exports, SymbolFlags.Value | SymbolFlags.Type | SymbolFlags.Namespace);
            this._throwIfErrors();
            return ret;
        }

        isOptionalProperty(): boolean {


            // TODO: this can be simplified if we disallow constructor properties in JSON declaration

            //  class C {
            //      constructor(public x?) { }
            //  }
            //
            // x is an optional parameter, but it is a required property.
            return this.valueDeclaration &&
                this.valueDeclaration.flags & NodeFlags.QuestionMark &&
                this.valueDeclaration.kind !== NodeKind.Parameter;
        }

        isVariable(): boolean {
            return (this.flags & SymbolFlags.Variable) !== 0;
        }

        isFunction(): boolean {
            return (this.flags & SymbolFlags.Function) !== 0;
        }

        isClass(): boolean {
            return (this.flags & SymbolFlags.Class) !== 0;
        }

        isInterface(): boolean {
            return (this.flags & SymbolFlags.Interface) !== 0;
        }

        isEnum(): boolean {
            return (this.flags & SymbolFlags.Enum) !== 0;
        }

        isModule(): boolean {
            return (this.flags & SymbolFlags.Module) !== 0;
        }

        isImport(): boolean {
            return (this.flags & SymbolFlags.Import) !== 0;
        }

        isTypeParameter(): boolean {
            return (this.flags & SymbolFlags.TypeParameter) !== 0;
        }

        isProperty(): boolean {
            return (this.flags & SymbolFlags.Property) !== 0;
        }

        isMethod(): boolean {
            return (this.flags & SymbolFlags.Method) !== 0;
        }

        isAccessor(): boolean {
            return (this.flags & SymbolFlags.Accessor) !== 0;
        }

        isGetAccessor(): boolean {
            return (this.flags & SymbolFlags.GetAccessor) !== 0;
        }

        isSetAccessor(): boolean {
            return (this.flags & SymbolFlags.SetAccessor) !== 0;
        }

        isEnumMember(): boolean {
            return (this.flags & SymbolFlags.EnumMember) !== 0;
        }

        isTypeAlias(): boolean {
            return (this.flags & SymbolFlags.TypeAlias) !== 0;
        }

        private _throwIfErrors(): void {
            var errors = this._checker.getErrors();
            throwDiagnosticError(errors);
        }
    }

    export interface AnnotationMap {

        [name: string]: Annotation[];
    }

    export interface AnnotationContainer {

        annotations: Annotation[];
        annotationsByName: AnnotationMap;
        declaration?: Declaration;
        declarations?: Declaration[];
    }

    export function hasAnnotation(checker: TypeChecker, name: string, container: AnnotationContainer): boolean {

        if(!container.annotations) {
            getAnnotationsFromSymbolOrSignature(checker, name, container);
        }
        return container.annotationsByName[name] !== undefined;
    }

    export function getAnnotationsFromSymbolOrSignature(checker: TypeChecker, name: string, container: AnnotationContainer): Annotation[] {

        if(!container.annotations) {

            container.annotations = [];
            container.annotationsByName = {};

            if(container.declarations) {
                var declarations = container.declarations;
            }
            else if (container.declaration) {
                var declarations = [container.declaration];
            }

            if(declarations) {
                for (var i = 0, l = declarations.length; i < l; i++) {
                    var declaration = declarations[i];
                    var annotations = declaration.annotations;
                    if (annotations) {
                        for (var j = 0, k = annotations.length; j < k; j++) {

                            var annotation = new AnnotationImpl(checker, annotations[j], declaration);
                            var list = container.annotationsByName[annotation.name];
                            if (!list) {
                                list = container.annotationsByName[annotation.name] = [];
                            }
                            list.push(annotation);
                            container.annotations.push(annotation);
                        }
                    }
                }
            }
        }

        if(name) {
            return container.annotationsByName[name] || [];
        }

        return container.annotations;
    }

    export class AnnotationImpl implements Annotation {

        name: string;
        value: string;
        private _checker: TypeChecker;

        constructor(checker: TypeChecker, annotation: Annotation, private declaration: Declaration) {

            this._checker = checker;
            this.name = annotation.name;
            this.value = annotation.value;
        }

        getDeclarationFileName(): string {

            return this._checker.getSourceFile(this.declaration).filename;
        }
    }
}