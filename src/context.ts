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

/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/glob.d.ts"/>

/// <reference path="nodes.ts"/>
/// <reference path="loader.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="types.ts"/>
/// <reference path="checker.ts"/>
/// <reference path="pathUtil.ts"/>

module reflect {

    var path = require("path");
    var glob = require("glob");
    var async = require("async");
    var fs = require("fs");

    export function createContext(): ReflectContext {

        var loader = createLoader();
        var checker = loader.getTypeChecker();

        return {
            requireModule,
            reference,
            resolve,
            load,
            loadSync,
            getSymbol
        }

        function requireModule(moduleName: string): Symbol {

            if (!moduleName) {
                throw new Error("Missing required argument 'moduleName'.");
            }

            var ret = loader.processExternalModule(moduleName, getBasePath());
            throwIfErrors();
            return ret;
        }

        function reference(filename: string): void {

            if (!filename) {
                throw new Error("Missing required argument 'filename'.")
            }

            loader.processRootFile(normalizePath(combinePaths(getBasePath(), filename)));
            throwIfErrors();
        }

        function load(callback: (err: Error, symbols: Symbol[]) => void): void;
        function load(path: string, callback: (err: Error, symbols: Symbol[]) => void): void;
        function load(paths: string[], callback: (err: Error, symbols: Symbol[]) => void): void;
        function load(paths: any, callback?: (err?: Error, symbols?: Symbol[]) => void): void {

            if(typeof paths === "function") {
                callback = paths;
                paths = findAllModulePaths();
                // TODO: skip glob search?
            }
            else if (!Array.isArray(paths)) {
                paths = [paths];
            }

            var symbols: Symbol[] = [];
            async.eachSeries(paths, processPath, (err: Error) => {
                if (err) return callback(err, null);
                callback(null, symbols);
            });

            function processPath(filePath: string, callback: (err?: Error) => void): void {

                var relativePath = path.relative(process.cwd(), filePath);
                glob(relativePath, (err: Error, matches: string[]) => {
                    if (err) return callback(err);

                    // If there were not any matches then filePath was probably a path to a single file
                    // without an extension. Pass in the original path and let processRootFileAsync figure
                    // it out.
                    if (!matches || matches.length == 0) {
                        matches = [relativePath];
                    }

                    async.eachSeries(matches, processFile, (err: Error) => {
                        if (err) return callback(err);
                        callback();
                    });
                });
            }

            function processFile(filePath: string, callback: (err?: Error) => void): void {

                loader.processRootFileAsync(filePath, (err, sourceFile) => {
                    if (err) return callback(err);
                    getSymbolsFromSourceFile(sourceFile, symbols);
                    callback();
                });
            }
        }

        function loadSync(): Symbol[];
        function loadSync(path: string): Symbol[];
        function loadSync(paths: string[]): Symbol[];
        function loadSync(paths?: any): Symbol[] {

            if(paths === undefined) {
                paths = findAllModulePaths();
                // TODO: skip glob search?
            }
            else if (!Array.isArray(paths)) {
                paths = [paths];
            }

            var symbols: Symbol[] = [];
            forEach(paths, processPath);
            throwIfErrors();
            return symbols;

            function processPath(filePath: string): void {

                var relativePath = path.relative(process.cwd(), filePath);
                var matches = glob.sync(relativePath);
                if (!matches || matches.length == 0) {
                    matches = [relativePath];
                }

                forEach(matches, processFile);
            }

            function processFile(filePath: string): void {
                getSymbolsFromSourceFile(loader.processRootFile(filePath), symbols);
            }
        }

        function getSymbolsFromSourceFile(sourceFile: SourceFile, symbols: Symbol[]): Symbol[] {

            if(!sourceFile) return;

            var symbol = sourceFile.symbol;
            if (symbol) {
                // external module
                symbol = checker.getResolvedExportSymbol(sourceFile.symbol);
                symbols.push(symbol);
            }
            else {
                // internal module - add symbols for all declarations at top level of source file
                var declares = sourceFile.declares;
                if (declares) {
                    for (var i = 0, l = declares.length; i < l; i++) {
                        var declaration = declares[i];
                        if (declaration.symbol) {
                            symbols.push(declaration.symbol);
                        }
                    }
                }
            }
            return symbols;
        }

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

            var ret = loader.getTypeChecker().resolveEntityName(undefined, name, meaning);
            throwIfErrors();
            return ret;
        }

        /**
         * Searches all loaded symbol information in the current context for the given constructor and returns the
         * symbol if found. Note this does not work for global symbols.
         * @param ctr The constructor to search for.
         */
        function getSymbol(ctr: Constructor): SymbolImpl {

            // check all loaded files for the constructor
            var files = loader.getFiles();
            for (var i = 0; i < files.length; i++) {
                var file = files[i];

                // only check external modules. we won't be able to load the constructor for internal modules anyways
                var symbol = file.symbol;
                if (symbol) {
                    // external module
                    var match = checkSymbolForConstructor(checker.getResolvedExportSymbol(symbol), ctr);
                    if(match) return match;
                }
            }
        }

        function checkSymbolForConstructor(symbol: Symbol, ctr: Constructor): SymbolImpl {

            if(symbol.name === ctr.name && (symbol.flags & SymbolFlags.Class) != 0) {

                var declaredType = <TypeImpl>checker.getDeclaredTypeOfSymbol(symbol);
                if (declaredType.getConstructor() === ctr) {
                    return <SymbolImpl>symbol;
                }
            }

            var match = checkSymbolTableForConstructor(symbol.exports, ctr);
            if (match) return match;
        }

        function checkSymbolTableForConstructor(table: SymbolTable, ctr: Constructor): SymbolImpl {

            for (var name in table) {
                if (table.hasOwnProperty(name)) {

                    var match = checkSymbolForConstructor(table[name], ctr);
                    if(match) return match;
                }
            }
        }

        function findAllModulePaths(): string[] {

            var filenames: string[] = [];
            findDescendantModulePaths(findTopModule(), filenames);
            return filenames;
        }

        function findDescendantModulePaths(node: Module, filenames: string[]): void {

            var filename = removeFileExtension(node.filename, ".js") + ".d.json";
            if(fs.existsSync(filename)) {
                filenames.push(filename);
            }

            for(var i = 0; i < node.children.length; i++) {
                findDescendantModulePaths(node.children[i], filenames);
            }
        }

        function findTopModule(): Module {

            var parent: Module = module,
                top: Module;

            while(parent) {
                top = parent;
                parent = parent.parent;
            }
            return top;
        }

        function throwIfErrors(): void {
            var errors = loader.getErrors();
            if(errors.length == 0) {
                errors = loader.getTypeChecker().getErrors();
            }
            throwDiagnosticError(errors);
        }

    }

    function getBasePath(): string {

        return getDirectoryPath(relativePath(module.parent.filename));
    }

    interface Module {
        exports: any;
        id: string;
        filename: string;
        loaded: boolean;
        parent: Module;
        children: Module[];
    }
}

