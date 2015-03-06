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

    export function createContext(): ReflectContext {

        var loader = createLoader();

        return {
            requireModule,
            reference,
            resolve,
            load
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

        function load(path: string, callback: (err: Error, symbols: Symbol[]) => void): void;
        function load(paths: string[], callback: (err: Error, symbols: Symbol[]) => void): void;
        function load(paths: any, callback: (err: Error, symbols: Symbol[]) => void): void {

            var symbols: Symbol[] = [];

            if(!Array.isArray(paths)) {
                paths = [paths];
            }

            async.each(paths, processPath, (err: Error) => {
                if (err) return callback(err, null);
                callback(null, symbols);
            });

            function processPath(filePath: string, callback: (err?: Error) => void): void {

                var relativePath = path.relative(process.cwd(), filePath);

                glob(relativePath, (err: Error, matches: string[]) => {
                    if(err) return callback(err);

                    // If there were not any matches then filePath was probably a path to a single file
                    // without an extension. Pass in the original path and let processRootFileAsync figure
                    // it out.
                    if(!matches || matches.length == 0) {
                        matches = [relativePath];
                    }

                    async.each(matches, processFile, (err: Error) => {
                        if (err) return callback(err);
                        callback();
                    });
                });
            }

            function processFile(filePath: string, callback: (err?: Error) => void): void {

                loader.processRootFileAsync(filePath, (err, sourceFile) => {
                    if(err) return callback(err);

                    var symbol = sourceFile.symbol;
                    if (symbol) {
                        // external module
                        symbol = loader.getTypeChecker().getResolvedExportSymbol(sourceFile.symbol);
                        symbols.push(symbol);
                    }
                    else {
                        // internal module - add symbols for all declarations at top level of source file
                        var declares = sourceFile.declares;
                        if(declares) {
                            for(var i = 0, l = declares.length; i < l; i++) {
                                var declaration = declares[i];
                                if(declaration.symbol) {
                                    symbols.push(declaration.symbol);
                                }
                            }
                        }
                    }

                    callback();
                });
            }
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

}
