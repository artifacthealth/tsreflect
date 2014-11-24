module reflect {

    export class SymbolImpl implements Symbol {

        id: number;
        declarations: Declaration[];
        valueDeclaration: Declaration; // First value declaration of the symbol
        annotations: Annotation[];
        annotationsByName: AnnotationMap;

        constructor(public flags: SymbolFlags, public name: string) {

        }

        resolve(name: string, meaning: SymbolFlags = SymbolFlags.Namespace | SymbolFlags.Type | SymbolFlags.Value): Symbol {

            if (!name) {
                throw new Error("Missing required argument 'name'.")
            }

            if (!this.declarations || this.declarations.length == 0) {
                return undefined;
            }

            var ret = resolveEntityName(this.declarations[0], name, meaning);
            if(hasDiagnosticErrors) {
                throwDiagnosticError();
            }
            return ret;
        }

        getFullName(): string {

            return symbolToString(this)
        }

        getName(): string {

            return this.name;
        }

        getFlags(): SymbolFlags {
            return this.flags;
        }

        getDescription(): string {

            return forEach(this.declarations, x => x.description);
        }

        // TODO: list all symbols in symbol? List all types in symbol? List all symbols with annotation?
        getAnnotations(name?: string): Annotation[] {

            return getAnnotationsFromSymbolOrSignature(name, this);
        }

        getType(): Type {

            // TODO:  return unknown type as undefined? or maybe this is better. We can still have a way to check for
            // unknown but code that wants to get properties of type or something can continue without a separate check.
            return getTypeOfSymbol(this);
        }

        getDeclaredType(): Type {

            var ret = getDeclaredTypeOfSymbol(this);
            if(hasDiagnosticErrors) {
                throwDiagnosticError();
            }
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

        /*
        Value,
        Type,
        Namespace,
        ModuleMember
        */
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

    export function getAnnotationsFromSymbolOrSignature(name: string, container: AnnotationContainer): Annotation[] {

        if(!container.annotations) {

            container.annotations = [];
            container.annotationsByName = {};

            forEach(container.declarations || [container.declaration], declaration => {
                forEach(declaration.annotations, annotation => {

                    var list = container.annotationsByName[annotation.name];
                    if(!list) {
                        list = container.annotationsByName[annotation.name] = [];
                    }
                    list.push(annotation);
                    container.annotations.push(annotation);
                });
            });
        }

        if(name) {
            return container.annotationsByName[name] || [];
        }

        return container.annotations;
    }
}