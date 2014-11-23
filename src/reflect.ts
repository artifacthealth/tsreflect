/// <reference path="../typings/node.d.ts"/>

/// <reference path="nodes.ts"/>
/// <reference path="loader.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="types.ts"/>
/// <reference path="checker.ts"/>
/// <reference path="pathUtil.ts"/>

module reflect {

    export var hasDiagnosticErrors = false;
    var errors: Diagnostic[] = [];

    exports.SymbolFlags = SymbolFlags;
    exports.TypeFlags = TypeFlags;

    function requireModule(moduleName: string): Symbol {

        if (!moduleName) {
            throw new Error("Missing required argument 'moduleName'.");
        }

        var ret = processExternalModule(moduleName, getBasePath());
        if(hasDiagnosticErrors) {
            throwDiagnosticError();
        }
        return ret;
    }
    exports.require = requireModule;

    function reference(filename: string): void {

        if (!filename) {
            throw new Error("Missing required argument 'filename'.")
        }

        processRootFile(normalizePath(combinePaths(getBasePath(), filename)));
        if(hasDiagnosticErrors) {
            throwDiagnosticError();
        }
    }
    exports.reference = reference;

    /**
     * Finds a symbol for the given qualified name and meaning in the global scope.
     * @param name Qualified name
     * @param meaning Optional. Kind of symbol to retrieve. By default looks for namespace, type, or value symbols.
     * @returns The symbol.
     */
    function resolve(name: string, meaning: SymbolFlags = SymbolFlags.Namespace | SymbolFlags.Type | SymbolFlags.Value): Symbol {

        if (!name) {
            throw new Error("Missing required argument 'name'.")
        }

        var ret = resolveEntityName(undefined, name, meaning);
        if(hasDiagnosticErrors) {
            throwDiagnosticError();
        }
        return ret;
    }
    exports.resolve = resolve;

    function createObject(classType: TypeImpl): any {

        var obj = getImplementationOfType(classType);

        if(!obj.prototype) {
            throw new Error("Constructor '" + classType.getFullName() + "' does not have a prototype.");
        }

        return Object.create(obj.prototype);
    }
    exports.createObject = createObject;


    var cachedImplementation: any[] = [];

    export function getImplementationOfType(classType: Type): any {

        var obj = cachedImplementation[classType.id];
        if(obj) {
            return obj;
        }

        // find the module containing this class
        var moduleSymbol = findContainingExternalModule(classType.symbol);
        if(!moduleSymbol) {
            // class is in the global namespace
            var obj = global;
            var moduleName = "globals"; // for error reporting
            var name = symbolToString(classType.symbol);
        }
        else {
            // class is in an external module, load the javascript module
            var moduleName = moduleSymbol.name.replace(/^"|"$/g, "");
            if (isExternalModuleNameRelative(moduleName)) {
                var obj = module.require(absolutePath(moduleName));
            }
            else {
                var obj = module.require(moduleName);
            }

            // find the name of the symbol in the module
            var name = symbolToString(classType.symbol, getResolvedExportSymbol(moduleSymbol));
        }
        if(name) {
            var path = name.split('.');
            for (var i = 0, l = path.length; i < l; i++) {
                obj = obj[path[i]];
                if (!obj) {
                    throw new Error("Could not find '" + name + "' in module '" + moduleName + "'.");
                }
            }
        }

        return cachedImplementation[classType.id] = obj;
    }

    function findContainingExternalModule(symbol: Symbol): Symbol {

        while(symbol) {
            if(symbol.valueDeclaration && symbol.valueDeclaration.flags & NodeFlags.ExternalModule) {
                return symbol;
            }
            symbol = symbol.parent;
        }
    }

    function getBasePath(): string {

        return getDirectoryPath(relativePath(module.parent.filename));
    }

    export function addDiagnostic(diagnostic: Diagnostic): void {

        hasDiagnosticErrors = true;
        errors.push(diagnostic);
    }

    // TODO: error handling is a little funny when symbol is not found b/c it just returns an 'any' symbol and keeps on working
    // so on the first call you get an error but then there are not errors on subsequent calls

    export function throwDiagnosticError(): void {

        if(hasDiagnosticErrors) {
            var diagnostics = getSortedDiagnostics();

            // clear errors
            hasDiagnosticErrors = false;
            errors = [];

            throw new Error(getDiagnosticErrorMessage(diagnostics));
        }
    }

    function getDiagnosticErrorMessage(diagnostics: Diagnostic[]): string {

        var ret = "";

        forEach(diagnostics, diagnostic => {

            if(diagnostic.filename) {
                ret += diagnostic.filename + ": ";
            }

            ret += diagnostic.messageText + "\n";

        });

        return ret;
    }

    function getSortedDiagnostics(): Diagnostic[] {

        errors.sort(compareDiagnostics);
        errors = deduplicateSortedDiagnostics(errors);

        return errors;
    }

    function compareDiagnostics(d1: Diagnostic, d2: Diagnostic): number {
        return compareValues(d1.filename, d2.filename) ||
            compareValues(d1.code, d2.code) ||
            compareValues(d1.messageText, d2.messageText) ||
            0;
    }

    function compareValues<T>(a: T, b: T): number {
        if (a === b) return 0;
        if (a === undefined) return -1;
        if (b === undefined) return 1;
        return a < b ? -1 : 1;
    }

    function deduplicateSortedDiagnostics(diagnostics: Diagnostic[]): Diagnostic[] {
        if (diagnostics.length < 2) {
            return diagnostics;
        }

        var newDiagnostics = [diagnostics[0]];
        var previousDiagnostic = diagnostics[0];
        for (var i = 1; i < diagnostics.length; i++) {
            var currentDiagnostic = diagnostics[i];
            var isDupe = compareDiagnostics(currentDiagnostic, previousDiagnostic) === 0;
            if (!isDupe) {
                newDiagnostics.push(currentDiagnostic);
                previousDiagnostic = currentDiagnostic;
            }
        }

        return newDiagnostics;
    }
}



