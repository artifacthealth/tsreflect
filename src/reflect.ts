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

    function loadSync(paths?: any): Symbol[] {
        return ensureGlobalContext().loadSync(paths);
    }

    function getSymbol(ctr: Constructor): Symbol {
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
    exports.loadSync = loadSync;
    exports.resolve = resolve;
    exports.require = requireModule;
    exports.createContext = createContext;
    exports.getSymbol = getSymbol;
}



