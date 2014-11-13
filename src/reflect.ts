/// <reference path="../typings/node.d.ts"/>

/// <reference path="nodes.ts"/>
/// <reference path="loader.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="type.ts"/>
/// <reference path="checker.ts"/>

module reflect {

    exports.SymbolFlags = SymbolFlags;

    function require(moduleName:string):Symbol {

        if (!moduleName) {
            throw new Error("Missing required argument 'moduleName'.")
        }

        var isRelative = isExternalModuleNameRelative(moduleName);
        if (!isRelative) {
            var symbol = getSymbol(globals, '"' + moduleName + '"', SymbolFlags.ValueModule);
            if (symbol) {
                return getResolvedExportSymbol(symbol);
            }
        }

        var searchPath = getBasePath();
        while (true) {
            var filename = normalizePath(combinePaths(searchPath, moduleName));
            var sourceFile = processRootFile(filename + ".d.json");
            if (sourceFile || isRelative) break;
            var parentPath = getDirectoryPath(searchPath);
            if (parentPath === searchPath) break;
            searchPath = parentPath;
        }

        if (sourceFile) {
            if (sourceFile.symbol) {
                return getResolvedExportSymbol(sourceFile.symbol);
            }

            throw new Error("File '" + sourceFile.filename + "' is not an external module.");
        }

        throw new Error("Cannot find external module '" + moduleName + "'.");
    }
    exports.require = require;

    function reference(filename:string):void {

        if (!filename) {
            throw new Error("Missing required argument 'filename'.")
        }

        processRootFile(normalizePath(combinePaths(getBasePath(), filename)));
    }
    exports.reference = reference;

    /**
     * Finds a symbol for the given qualified name and meaning in the global scope.
     * @param name Qualified name
     * @param meaning Optional. Kind of symbol to retrieve. By default looks for namespace, type, or value symbols.
     * @returns The symbol.
     */
    function resolve(name:string, meaning:SymbolFlags = SymbolFlags.Namespace | SymbolFlags.Type | SymbolFlags.Value):Symbol {

        if (!name) {
            throw new Error("Missing required argument 'name'.")
        }

        return resolveEntityName(undefined, name, meaning);
    }
    exports.resolve = resolve;


    function getBasePath(): string {

        return getDirectoryPath(module.parent.filename);
    }
}



