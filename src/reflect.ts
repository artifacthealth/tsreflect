/// <reference path="context.ts"/>
/// <reference path="types.ts"/>

module reflect {

    var globalContext: ReflectContext;

    function requireModule(moduleName: string): Symbol {
        return ensureGlobalContext().requireModule(moduleName);
    }

    function reference(filename: string): void {
        return ensureGlobalContext().reference(filename);
    }

    function resolve(name: string, meaning: SymbolFlags): Symbol {
        return ensureGlobalContext().resolve(name, meaning);
    }

    function load(paths: any, callback: (err: Error, symbols: Symbol[]) => void): void {
        return ensureGlobalContext().load(paths, callback);
    }

    function getSymbol(ctr: Constructor): SymbolImpl {
        return ensureGlobalContext().getSymbol(ctr);
    }

    function ensureGlobalContext(): ReflectContext {
        if(!globalContext) {
            globalContext = createContext();
        }
        return globalContext;
    }

    exports.reference = reference;
    exports.load = load;
    exports.resolve = resolve;
    exports.require = requireModule;
    exports.createContext = createContext;
    exports.getSymbol = getSymbol;
}



