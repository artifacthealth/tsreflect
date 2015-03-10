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
var reflect;
(function (reflect) {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    function hasProperty(map, key) {
        return hasOwnProperty.call(map, key);
    }
    reflect.hasProperty = hasProperty;
    function getProperty(map, key) {
        return hasOwnProperty.call(map, key) ? map[key] : undefined;
    }
    reflect.getProperty = getProperty;
    function forEach(array, callback) {
        var result;
        if (array) {
            for (var i = 0, len = array.length; i < len; i++) {
                if (result = callback(array[i]))
                    break;
            }
        }
        return result;
    }
    reflect.forEach = forEach;
    function map(array, f) {
        var result;
        if (array) {
            result = [];
            var len = array.length;
            for (var i = 0; i < len; i++) {
                result.push(f(array[i]));
            }
        }
        return result;
    }
    reflect.map = map;
    function concatenate(array1, array2) {
        if (!array2 || !array2.length)
            return array1;
        if (!array1 || !array1.length)
            return array2;
        return array1.concat(array2);
    }
    reflect.concatenate = concatenate;
    function contains(array, value) {
        if (array) {
            var len = array.length;
            for (var i = 0; i < len; i++) {
                if (array[i] === value) {
                    return true;
                }
            }
        }
        return false;
    }
    reflect.contains = contains;
})(reflect || (reflect = {}));
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
/// <reference path="arrayUtil.ts"/>
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
/// <reference path="types.ts"/>
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
var reflect;
(function (reflect) {
    var path = require("path");
    var os = require("os");
    var platform = os.platform();
    // win32\win64 are case insensitive platforms, MacOS (darwin) by default is also case insensitive
    reflect.useCaseSensitiveFileNames = platform !== "win32" && platform !== "win64" && platform !== "darwin";
    function getCanonicalFileName(fileName) {
        // if underlying system can distinguish between two files whose names differs only in cases then file name already in canonical form.
        // otherwise use toLowerCase as a canonical form.
        return reflect.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
    }
    reflect.getCanonicalFileName = getCanonicalFileName;
    var supportedExtensions = [".d.json"];
    function removeFileExtension(path) {
        for (var i = 0; i < supportedExtensions.length; i++) {
            var ext = supportedExtensions[i];
            if (fileExtensionIs(path, ext)) {
                return path.substr(0, path.length - ext.length);
            }
        }
        return path;
    }
    reflect.removeFileExtension = removeFileExtension;
    function fileExtensionIs(path, extension) {
        var pathLen = path.length;
        var extLen = extension.length;
        return pathLen > extLen && path.substr(pathLen - extLen, extLen) === extension;
    }
    reflect.fileExtensionIs = fileExtensionIs;
    function hasExtension(filename) {
        return getBaseFilename(filename).indexOf(".") >= 0;
    }
    reflect.hasExtension = hasExtension;
    function isRelativePath(path) {
        return path.substr(0, 2) === "./" || path.substr(0, 3) === "../" || path.substr(0, 2) === ".\\" || path.substr(0, 3) === "..\\";
    }
    reflect.isRelativePath = isRelativePath;
    function isAbsolutePath(path) {
        return path.substr(0, 1) === "/" || path.substr(0, 1) === "\\";
    }
    reflect.isAbsolutePath = isAbsolutePath;
    function getBaseFilename(path) {
        var i = path.lastIndexOf(reflect.directorySeparator);
        return i < 0 ? path : path.substring(i + 1);
    }
    reflect.getBaseFilename = getBaseFilename;
    function combinePaths(path1, path2) {
        if (!(path1 && path1.length))
            return path2;
        if (!(path2 && path2.length))
            return path1;
        if (path2.charAt(0) === reflect.directorySeparator)
            return path2;
        if (path1.charAt(path1.length - 1) === reflect.directorySeparator)
            return path1 + path2;
        return path1 + reflect.directorySeparator + path2;
    }
    reflect.combinePaths = combinePaths;
    reflect.directorySeparator = "/";
    function getNormalizedParts(normalizedSlashedPath, rootLength) {
        var parts = normalizedSlashedPath.substr(rootLength).split(reflect.directorySeparator);
        var normalized = [];
        for (var i = 0; i < parts.length; i++) {
            var part = parts[i];
            if (part !== ".") {
                if (part === ".." && normalized.length > 0 && normalized[normalized.length - 1] !== "..") {
                    normalized.pop();
                }
                else {
                    normalized.push(part);
                }
            }
        }
        return normalized;
    }
    function normalizePath(path) {
        var path = normalizeSlashes(path);
        var rootLength = getRootLength(path);
        var normalized = getNormalizedParts(path, rootLength);
        return path.substr(0, rootLength) + normalized.join(reflect.directorySeparator);
    }
    reflect.normalizePath = normalizePath;
    function normalizeSlashes(path) {
        return path.replace(/\\/g, "/");
    }
    reflect.normalizeSlashes = normalizeSlashes;
    // Returns length of path root (i.e. length of "/", "x:/", "//server/share/")
    function getRootLength(path) {
        if (path.charCodeAt(0) === 47 /* slash */) {
            if (path.charCodeAt(1) !== 47 /* slash */)
                return 1;
            var p1 = path.indexOf("/", 2);
            if (p1 < 0)
                return 2;
            var p2 = path.indexOf("/", p1 + 1);
            if (p2 < 0)
                return p1 + 1;
            return p2 + 1;
        }
        if (path.charCodeAt(1) === 58 /* colon */) {
            if (path.charCodeAt(2) === 47 /* slash */)
                return 3;
            return 2;
        }
        return 0;
    }
    reflect.getRootLength = getRootLength;
    function getDirectoryPath(path) {
        return path.substr(0, Math.max(getRootLength(path), path.lastIndexOf(reflect.directorySeparator)));
    }
    reflect.getDirectoryPath = getDirectoryPath;
    function relativePath(to) {
        return path.relative(process.cwd(), to);
    }
    reflect.relativePath = relativePath;
    function absolutePath(relativePath) {
        return path.join(process.cwd(), relativePath);
    }
    reflect.absolutePath = absolutePath;
    var CharacterCodes;
    (function (CharacterCodes) {
        CharacterCodes[CharacterCodes["colon"] = 0x3A] = "colon";
        CharacterCodes[CharacterCodes["slash"] = 0x2F] = "slash"; // /
    })(CharacterCodes || (CharacterCodes = {}));
})(reflect || (reflect = {}));
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
/// <reference path="../typings/async.d.ts"/>
/// <reference path="pathUtil.ts"/>
/// <reference path="nodes.ts"/>
var reflect;
(function (reflect) {
    function createLoader() {
        var options = {
            noLib: false,
            noResolve: false,
            charset: "utf8"
        };
        var files = [];
        var filesByName = {};
        var seenNoDefaultLib = options.noLib;
        var initializedGlobals = false;
        var errors = [];
        var flagMap = {
            "external": 16384 /* ExternalModule */,
            "export": 1 /* Export */,
            "private": 32 /* Private */,
            "static": 128 /* Static */,
            "optional": 32768 /* QuestionMark */,
            "rest": 65536 /* Rest */
        };
        var flags = Object.keys(flagMap);
        var fs = require("fs");
        var async = require("async");
        var checker;
        var loader = {
            getLoadedSourceFile: getLoadedSourceFile,
            processRootFile: processRootFile,
            processRootFileAsync: processRootFileAsync,
            processExternalModule: processExternalModule,
            getTypeChecker: getTypeChecker,
            getErrors: getErrors
        };
        checker = reflect.createTypeChecker(loader);
        var bindSourceFile = reflect.createBinder(checker);
        return loader;
        function getTypeChecker() {
            return checker;
        }
        function getErrors() {
            return errors;
        }
        function getLoadedSourceFile(filename) {
            // TODO: do I need to normalize this?
            filename = reflect.getCanonicalFileName(filename);
            return reflect.hasProperty(filesByName, filename) ? filesByName[filename] : undefined;
        }
        function processRootFile(filename) {
            var sourceFile = processSourceFile(filename, false);
            bindPendingFiles();
            return sourceFile;
        }
        function processRootFileAsync(filename, callback) {
            processSourceFileAsync(filename, false, null, function (err, sourceFile) {
                if (err)
                    return callback(err, null);
                bindPendingFilesAsync(function (err) {
                    if (err)
                        return callback(err, null);
                    callback(null, sourceFile);
                });
            });
        }
        function processExternalModule(moduleName, searchPath) {
            var isRelative = checker.isExternalModuleNameRelative(moduleName);
            if (!isRelative) {
                var symbol = checker.getSymbol(checker.globals, '"' + moduleName + '"', 512 /* ValueModule */);
                if (symbol) {
                    return checker.getResolvedExportSymbol(symbol);
                }
            }
            while (true) {
                var filename = reflect.normalizePath(reflect.combinePaths(searchPath, moduleName));
                var sourceFile = findSourceFile(filename + ".d.json", false);
                if (sourceFile || isRelative)
                    break;
                var parentPath = reflect.getDirectoryPath(searchPath);
                if (parentPath === searchPath)
                    break;
                searchPath = parentPath;
            }
            if (sourceFile) {
                bindPendingFiles();
                if (sourceFile.symbol) {
                    return checker.getResolvedExportSymbol(sourceFile.symbol);
                }
                errors.push(new reflect.Diagnostic(undefined, reflect.Diagnostics.File_0_is_not_an_external_module, sourceFile.filename));
                return;
            }
            errors.push(new reflect.Diagnostic(undefined, reflect.Diagnostics.Cannot_find_external_module_0, moduleName));
        }
        function bindPendingFilesAsync(callback) {
            if (!seenNoDefaultLib) {
                processSourceFileAsync(reflect.normalizePath(getDefaultLibFilename()), true, null, function (err) {
                    if (err)
                        return callback(err);
                    processFiles();
                });
            }
            else {
                process.nextTick(processFiles);
            }
            function processFiles() {
                processBindFilesQueue();
                callback(errors.length > 0 ? reflect.createDiagnosticError(errors) : null);
            }
        }
        function bindPendingFiles() {
            if (!seenNoDefaultLib) {
                processSourceFile(reflect.normalizePath(getDefaultLibFilename()), true);
            }
            processBindFilesQueue();
        }
        function processBindFilesQueue() {
            reflect.forEach(files, function (file) {
                bindSourceFile(file);
                // propagate errors
                reflect.forEach(file.errors, function (error) { return errors.push(error); });
            });
            files = [];
            if (!initializedGlobals) {
                checker.initializeGlobalTypes();
                initializedGlobals = true;
            }
        }
        // TODO: move to host
        // TODO: make configurable
        function getDefaultLibFilename() {
            return reflect.combinePaths(reflect.normalizePath(__dirname), "lib.core.d.json");
        }
        function processSourceFileAsync(filename, isDefaultLib, refFile, callback) {
            var ret;
            var diagnostic;
            if (reflect.hasExtension(filename)) {
                if (!reflect.fileExtensionIs(filename, ".d.json")) {
                    process.nextTick(function () {
                        handleCallback(null, null, reflect.Diagnostics.File_0_must_have_extension_d_json);
                    });
                }
                else {
                    findSourceFileAsync(filename, isDefaultLib, refFile, handleCallback);
                }
            }
            else {
                filename += ".d.json";
                findSourceFileAsync(filename, isDefaultLib, refFile, handleCallback);
            }
            function handleCallback(err, file, diagnostic) {
                if (err)
                    return callback(err, null);
                if (!diagnostic && !file) {
                    diagnostic = reflect.Diagnostics.File_0_not_found;
                }
                if (diagnostic) {
                    errors.push(new reflect.Diagnostic(refFile, diagnostic, filename));
                    return callback(reflect.createDiagnosticError(errors), null);
                }
                callback(null, file);
            }
        }
        function processSourceFile(filename, isDefaultLib, refFile) {
            var ret;
            var diagnostic;
            if (reflect.hasExtension(filename)) {
                if (!reflect.fileExtensionIs(filename, ".d.json")) {
                    diagnostic = reflect.Diagnostics.File_0_must_have_extension_d_json;
                }
                else if (!(ret = findSourceFile(filename, isDefaultLib, refFile))) {
                    diagnostic = reflect.Diagnostics.File_0_not_found;
                }
            }
            else {
                if (!(ret = findSourceFile(filename + ".d.json", isDefaultLib, refFile))) {
                    diagnostic = reflect.Diagnostics.File_0_not_found;
                    filename += ".d.json";
                }
            }
            if (diagnostic) {
                errors.push(new reflect.Diagnostic(refFile, diagnostic, filename));
            }
            return ret;
        }
        function findSourceFileAsync(filename, isDefaultLib, refFile, callback) {
            if (!reflect.isRelativePath(filename) && !reflect.isAbsolutePath(filename)) {
                filename = "./" + filename;
            }
            var canonicalName = reflect.getCanonicalFileName(filename);
            if (reflect.hasProperty(filesByName, canonicalName)) {
                // We've already looked for this file, use cached result
                var file = filesByName[canonicalName];
                if (file && reflect.useCaseSensitiveFileNames && canonicalName !== file.filename) {
                    errors.push(new reflect.Diagnostic(refFile, reflect.Diagnostics.Filename_0_differs_from_already_included_filename_1_only_in_casing, filename, file.filename));
                    return callback(reflect.createDiagnosticError(errors), null);
                }
                process.nextTick(function () {
                    callback(null, file);
                });
                return;
            }
            // We haven't looked for this file, do so now and cache result
            readSourceFileAsync(filename, function (err, file) {
                if (err) {
                    errors.push(new reflect.Diagnostic(refFile, reflect.Diagnostics.Cannot_read_file_0_Colon_1, filename, err.message));
                    return callback(reflect.createDiagnosticError(errors), null);
                }
                filesByName[canonicalName] = file;
                if (!file) {
                    return callback(null, undefined);
                }
                seenNoDefaultLib = seenNoDefaultLib || file.noDefaultLib;
                if (options.noResolve) {
                    handleCallback(file);
                    return;
                }
                var basePath = reflect.getDirectoryPath(filename);
                processReferencedFilesAsync(file, basePath, function (err) {
                    if (err)
                        return callback(err, null);
                    processImportedModulesAsync(file, basePath, function (err) {
                        if (err)
                            return callback(err, null);
                        handleCallback(file);
                    });
                });
            });
            function handleCallback(file) {
                if (isDefaultLib) {
                    files.unshift(file);
                }
                else {
                    files.push(file);
                }
                callback(null, file);
            }
        }
        // Get source file from normalized filename
        function findSourceFile(filename, isDefaultLib, refFile) {
            if (!reflect.isRelativePath(filename) && !reflect.isAbsolutePath(filename)) {
                filename = "./" + filename;
            }
            var canonicalName = reflect.getCanonicalFileName(filename);
            if (reflect.hasProperty(filesByName, canonicalName)) {
                // We've already looked for this file, use cached result
                var file = filesByName[canonicalName];
                if (file && reflect.useCaseSensitiveFileNames && canonicalName !== file.filename) {
                    errors.push(new reflect.Diagnostic(refFile, reflect.Diagnostics.Filename_0_differs_from_already_included_filename_1_only_in_casing, filename, file.filename));
                }
            }
            else {
                try {
                    var file = filesByName[canonicalName] = readSourceFile(filename);
                }
                catch (e) {
                    errors.push(new reflect.Diagnostic(refFile, reflect.Diagnostics.Cannot_read_file_0_Colon_1, filename, e.message));
                }
                if (file) {
                    seenNoDefaultLib = seenNoDefaultLib || file.noDefaultLib;
                    if (!options.noResolve) {
                        var basePath = reflect.getDirectoryPath(filename);
                        processReferencedFiles(file, basePath);
                        processImportedModules(file, basePath);
                    }
                    if (isDefaultLib) {
                        files.unshift(file);
                    }
                    else {
                        files.push(file);
                    }
                }
            }
            return file;
        }
        function readSourceFileAsync(filename, callback) {
            fs.exists(filename, function (exists) {
                if (!exists)
                    return callback(null, undefined);
                fs.readFile(filename, options.charset, function (err, text) {
                    if (err)
                        return callback(err, null);
                    if (!text)
                        return callback(null, undefined);
                    var sourceFile = createSourceFile(filename, text);
                    if (errors.length > 0) {
                        return callback(reflect.createDiagnosticError(errors), null);
                    }
                    callback(null, sourceFile);
                });
            });
        }
        function readSourceFile(filename) {
            if (!fs.existsSync(filename)) {
                return undefined;
            }
            var text = fs.readFileSync(filename, options.charset);
            if (text) {
                return createSourceFile(filename, text);
            }
        }
        function processReferencedFilesAsync(file, basePath, callback) {
            async.each(file.references || [], function (filename, callback) {
                processSourceFileAsync(reflect.normalizePath(reflect.combinePaths(basePath, filename)), false, file, callback);
            }, callback);
        }
        function processReferencedFiles(file, basePath) {
            reflect.forEach(file.references, function (filename) {
                processSourceFile(reflect.normalizePath(reflect.combinePaths(basePath, filename)), false, file);
            });
        }
        function processImportedModulesAsync(file, basePath, callback) {
            async.each(getExternalImportDeclarations(file), function (node, callback) {
                if (node.parent !== file) {
                    // TypeScript 1.0 spec (April 2014): 12.1.6
                    // An ExternalImportDeclaration in anAmbientExternalModuleDeclaration may reference other external modules
                    // only through top - level external module names. Relative external module names are not permitted.
                    var searchName = reflect.normalizePath(reflect.combinePaths(basePath, node.require));
                    return findSourceFileAsync(searchName + ".d.json", false, file, callback);
                }
                searchForModule(basePath, node.require);
                function searchForModule(searchPath, moduleName) {
                    var searchName = reflect.normalizePath(reflect.combinePaths(searchPath, moduleName));
                    findSourceFileAsync(searchName + ".d.json", false, file, function (err, result) {
                        if (err)
                            return callback(err);
                        if (result) {
                            return callback();
                        }
                        var parentPath = reflect.getDirectoryPath(searchPath);
                        if (parentPath === searchPath) {
                            return callback();
                        }
                        searchPath = parentPath;
                        searchForModule(searchPath, moduleName);
                    });
                }
            }, callback);
        }
        function processImportedModules(file, basePath) {
            reflect.forEach(getExternalImportDeclarations(file), function (node) {
                if (node.parent === file) {
                    var moduleName = node.require;
                    var searchPath = basePath;
                    while (true) {
                        var searchName = reflect.normalizePath(reflect.combinePaths(searchPath, moduleName));
                        if (findSourceFile(searchName + ".d.json", false, file)) {
                            break;
                        }
                        var parentPath = reflect.getDirectoryPath(searchPath);
                        if (parentPath === searchPath) {
                            break;
                        }
                        searchPath = parentPath;
                    }
                }
                else {
                    // TypeScript 1.0 spec (April 2014): 12.1.6
                    // An ExternalImportDeclaration in anAmbientExternalModuleDeclaration may reference other external modules
                    // only through top - level external module names. Relative external module names are not permitted.
                    var searchName = reflect.normalizePath(reflect.combinePaths(basePath, node.require));
                    findSourceFile(searchName + ".d.json", false, file);
                }
            });
        }
        function getExternalImportDeclarations(file) {
            var nodes = [];
            reflect.forEach(file.declares, function (node) {
                if (node.kind === 7 /* ImportDeclaration */ && node.require) {
                    var moduleName = node.require;
                    if (moduleName) {
                        nodes.push(node);
                    }
                }
                else if (node.kind === 4 /* ModuleDeclaration */ && (node.flags & 16384 /* ExternalModule */)) {
                    // TypeScript 1.0 spec (April 2014): 12.1.6
                    // An AmbientExternalModuleDeclaration declares an external module.
                    // This type of declaration is permitted only in the global module.
                    // The StringLiteral must specify a top - level external module name.
                    // Relative external module names are not permitted
                    reflect.forEachChild(node, function (node) {
                        if (node.kind === 7 /* ImportDeclaration */ && node.require) {
                            var moduleName = node.require;
                            if (moduleName) {
                                nodes.push(node);
                            }
                        }
                    });
                }
            });
            return nodes;
        }
        function createSourceFile(filename, text) {
            function scanSourceFile(file) {
                file.kind = 0 /* SourceFile */;
                scanFlags(file);
                reflect.forEach(file.declares, scanModuleElementDeclaration);
            }
            function scanModuleElementDeclaration(node) {
                switch (node.kind) {
                    case "interface":
                        scanInterfaceDeclaration(node);
                        break;
                    case "class":
                        scanClassDeclaration(node);
                        break;
                    case "enum":
                        scanEnumDeclaration(node);
                        break;
                    case "module":
                        scanModuleDeclaration(node);
                        break;
                    case "function":
                        scanFunctionDeclaration(node);
                        break;
                    case "variable":
                        scanVariableDeclaration(node);
                        break;
                    case "import":
                        scanImportDeclaration(node);
                        break;
                    case "alias":
                        scanTypeAliasDeclaration(node);
                        break;
                }
            }
            function scanInterfaceDeclaration(node) {
                node.kind = 1 /* InterfaceDeclaration */;
                scanFlags(node);
                scanTypeParameterDeclarations(node.typeParameters);
                scanTypeReferenceNodes(node.extends);
                reflect.forEach(node.signatures, scanSignatureDeclaration);
            }
            function scanTypeParameterDeclarations(nodes) {
                if (!nodes)
                    return;
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var parameter = nodes[i];
                    parameter.kind = 30 /* TypeParameter */;
                    scanChildTypeNode(parameter, "constraint");
                }
            }
            function scanClassDeclaration(node) {
                node.kind = 2 /* ClassDeclaration */;
                scanFlags(node);
                scanTypeParameterDeclarations(node.typeParameters);
                scanChildTypeReferenceNode(node, "extends");
                scanTypeReferenceNodes(node.implements);
                reflect.forEach(node.members, scanClassMemberDeclaration);
            }
            function scanEnumDeclaration(node) {
                node.kind = 3 /* EnumDeclaration */;
                scanFlags(node);
                reflect.forEach(node.members, scanEnumMemberDeclaration);
            }
            function scanEnumMemberDeclaration(node) {
                node.kind = 9 /* EnumMember */;
                scanFlags(node);
            }
            function scanModuleDeclaration(node) {
                node.kind = 4 /* ModuleDeclaration */;
                scanFlags(node);
                reflect.forEach(node.declares, scanModuleElementDeclaration);
            }
            function scanFunctionDeclaration(node) {
                scanCallSignature(node, 5 /* FunctionDeclaration */);
            }
            function scanParameterDeclaration(node) {
                if (!node)
                    return;
                node.kind = 29 /* Parameter */;
                scanFlags(node);
                scanChildTypeNode(node, "type");
            }
            function scanVariableDeclaration(node) {
                node.kind = 6 /* VariableDeclaration */;
                scanFlags(node);
                scanChildTypeNode(node, "type");
            }
            function scanImportDeclaration(node) {
                node.kind = 7 /* ImportDeclaration */;
                scanFlags(node);
            }
            function scanTypeAliasDeclaration(node) {
                node.kind = 8 /* TypeAliasDeclaration */;
                scanFlags(node);
                scanChildTypeNode(node, "type");
            }
            function scanClassMemberDeclaration(node) {
                switch (node.kind) {
                    case "index":
                        scanIndexDeclaration(node);
                        break;
                    case "field":
                        scanFieldDeclaration(node);
                        break;
                    case "method":
                        scanMethodDeclaration(node);
                        break;
                    case "constructor":
                        scanConstructorDeclaration(node);
                        break;
                    case "get":
                        scanGetAccessorDeclaration(node);
                        break;
                    case "set":
                        scanSetAccessorDeclaration(node);
                        break;
                }
            }
            function scanIndexDeclaration(node) {
                node.kind = 10 /* Index */;
                scanFlags(node);
                scanParameterDeclaration(node.parameter);
                scanChildTypeNode(node, "returns");
            }
            function scanFieldDeclaration(node) {
                node.kind = 11 /* Field */;
                scanFlags(node);
                scanChildTypeNode(node, "type");
            }
            function scanMethodDeclaration(node) {
                scanCallSignature(node, 12 /* Method */);
            }
            function scanConstructorDeclaration(node) {
                scanCallSignature(node, 13 /* Constructor */);
            }
            function scanGetAccessorDeclaration(node) {
                node.kind = 14 /* GetAccessor */;
                scanFlags(node);
                scanChildTypeNode(node, "returns");
            }
            function scanSetAccessorDeclaration(node) {
                node.kind = 15 /* SetAccessor */;
                scanFlags(node);
                scanParameterDeclaration(node.parameter);
            }
            function scanSignatureDeclaration(node) {
                switch (node.kind) {
                    case "property":
                        scanPropertySignatureDeclaration(node);
                        break;
                    case "constructor":
                        scanConstructSignatureDeclaration(node);
                        break;
                    case "method":
                        scanMethodSignatureDeclaration(node);
                        break;
                    case "index":
                        scanIndexSignatureDeclaration(node);
                        break;
                    case "call":
                        scanCallSignatureDeclaration(node);
                        break;
                }
            }
            function scanPropertySignatureDeclaration(node) {
                node.kind = 16 /* PropertySignature */;
                scanFlags(node);
                scanChildTypeNode(node, "type");
            }
            function scanConstructSignatureDeclaration(node) {
                scanCallSignature(node, 17 /* ConstructSignature */);
            }
            function scanMethodSignatureDeclaration(node) {
                scanCallSignature(node, 18 /* MethodSignature */);
            }
            function scanIndexSignatureDeclaration(node) {
                node.kind = 19 /* IndexSignature */;
                scanFlags(node);
                scanParameterDeclaration(node.parameter);
                scanChildTypeNode(node, "returns");
            }
            function scanCallSignatureDeclaration(node) {
                scanCallSignature(node, 20 /* CallSignature */);
            }
            function scanCallSignature(node, kind) {
                node.kind = kind;
                scanFlags(node);
                scanTypeParameterDeclarations(node.typeParameters);
                if (node.parameters === undefined) {
                    node.parameters = [];
                }
                reflect.forEach(node.parameters, scanParameterDeclaration);
                scanChildTypeNode(node, "returns");
            }
            function scanChildTypeNode(node, typeNodeName) {
                var typeNode = node[typeNodeName];
                if (!typeNode)
                    return;
                if (typeof typeNode === "string") {
                    node[typeNodeName] = createTypeNodeFromString(typeNode);
                }
                else {
                    scanTypeNode(typeNode);
                }
            }
            function scanTypeNodes(nodes) {
                if (!nodes)
                    return;
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var typeNode = nodes[i];
                    if (typeof typeNode === "string") {
                        nodes.splice(i, 1, createTypeNodeFromString(typeNode));
                    }
                    else {
                        scanTypeNode(typeNode);
                    }
                }
            }
            function scanTypeNode(node) {
                switch (node.kind) {
                    case "function":
                        scanFunctionTypeNode(node);
                        break;
                    case "array":
                        scanArrayTypeNode(node);
                        break;
                    case "constructor":
                        scanConstructorTypeNode(node);
                        break;
                    case "reference":
                        scanTypeReferenceNode(node);
                        break;
                    case "object":
                        scanObjectTypeNode(node);
                        break;
                    case "tuple":
                        scanTupleTypeNode(node);
                        break;
                    case "union":
                        scanUnionTypeNode(node);
                        break;
                }
            }
            function createTypeNodeFromString(text) {
                if (isStringLiteral(text)) {
                    return createStringLiteralTypeNode(text);
                }
                return createTypeReferenceNode(text);
            }
            function isStringLiteral(text) {
                return /^"[^"]+"$/.test(text);
            }
            function scanFunctionTypeNode(node) {
                scanCallSignature(node, 21 /* FunctionType */);
            }
            function scanArrayTypeNode(node) {
                node.kind = 22 /* ArrayType */;
                scanChildTypeNode(node, "type");
            }
            function scanTupleTypeNode(node) {
                node.kind = 27 /* TupleType */;
                scanTypeNodes(node.types);
            }
            function scanUnionTypeNode(node) {
                node.kind = 28 /* UnionType */;
                scanTypeNodes(node.types);
            }
            function scanConstructorTypeNode(node) {
                scanCallSignature(node, 23 /* ConstructorType */);
            }
            function scanTypeReferenceNodes(nodes) {
                if (!nodes)
                    return;
                for (var i = 0, l = nodes.length; i < l; i++) {
                    var typeReferenceNode = nodes[i];
                    if (typeof typeReferenceNode === "string") {
                        nodes.splice(i, 1, createTypeReferenceNode(typeReferenceNode));
                    }
                    else {
                        scanTypeReferenceNode(typeReferenceNode);
                    }
                }
            }
            function scanChildTypeReferenceNode(node, typeReferenceNodeName) {
                var typeReferenceNode = node[typeReferenceNodeName];
                if (!typeReferenceNode)
                    return;
                if (typeof typeReferenceNode === "string") {
                    node[typeReferenceNodeName] = createTypeReferenceNode(typeReferenceNode);
                }
                else {
                    scanTypeReferenceNode(typeReferenceNode);
                }
            }
            function createTypeReferenceNode(typeName) {
                return {
                    kind: 25 /* TypeReference */,
                    flags: 0 /* None */,
                    type: typeName
                };
            }
            function createStringLiteralTypeNode(stringLiteral) {
                return {
                    kind: 26 /* StringLiteral */,
                    flags: 0 /* None */,
                    text: stringLiteral.replace(/^"|"$/g, "")
                };
            }
            function scanTypeReferenceNode(node) {
                node.kind = 25 /* TypeReference */;
                node.flags = 0 /* None */;
                scanTypeNodes(node.arguments);
            }
            function scanObjectTypeNode(node) {
                node.kind = 24 /* ObjectType */;
                reflect.forEach(node.signatures, scanSignatureDeclaration);
            }
            function scanFlags(node) {
                node.flags = 0 /* None */;
                for (var i = 0, l = flags.length; i < l; i++) {
                    var flag = flags[i];
                    if (node[flag]) {
                        node.flags |= flagMap[flag];
                        delete node[flag];
                    }
                }
            }
            // scan input
            var file;
            try {
                file = JSON.parse(text);
            }
            catch (e) {
                errors.push(new reflect.Diagnostic(undefined, reflect.Diagnostics.File_0_has_invalid_json_format_1, filename, e.message));
                return;
            }
            if (file) {
                file.filename = filename;
                file.errors = [];
                scanSourceFile(file);
            }
            return file;
        }
    }
    reflect.createLoader = createLoader;
})(reflect || (reflect = {}));
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
var reflect;
(function (reflect) {
    var Diagnostic = (function () {
        function Diagnostic(file, message) {
            var text = getLocaleSpecificMessage(message.key);
            if (arguments.length > 2) {
                text = formatStringFromArgs(text, arguments, 2);
            }
            if (file) {
                this.filename = file.filename;
            }
            this.messageText = text;
            this.category = message.category;
            this.code = message.code;
        }
        return Diagnostic;
    })();
    reflect.Diagnostic = Diagnostic;
    function chainDiagnosticMessages(details, diagnostic) {
        return {
            diagnostic: diagnostic,
            next: details
        };
    }
    reflect.chainDiagnosticMessages = chainDiagnosticMessages;
    (function (DiagnosticCategory) {
        DiagnosticCategory[DiagnosticCategory["Warning"] = 0] = "Warning";
        DiagnosticCategory[DiagnosticCategory["Error"] = 1] = "Error";
        DiagnosticCategory[DiagnosticCategory["Message"] = 2] = "Message";
    })(reflect.DiagnosticCategory || (reflect.DiagnosticCategory = {}));
    var DiagnosticCategory = reflect.DiagnosticCategory;
    reflect.Diagnostics = {
        Duplicate_identifier_0: { code: 2300, category: 1 /* Error */, key: "Duplicate identifier '{0}'." },
        File_0_not_found: { code: 6053, category: 1 /* Error */, key: "File '{0}' not found." },
        Filename_0_differs_from_already_included_filename_1_only_in_casing: { code: 1149, category: 1 /* Error */, key: "Filename '{0}' differs from already included filename '{1}' only in casing" },
        Cannot_read_file_0_Colon_1: { code: 5012, category: 1 /* Error */, key: "Cannot read file '{0}': {1}" },
        Circular_definition_of_import_alias_0: { code: 2303, category: 1 /* Error */, key: "Circular definition of import alias '{0}'." },
        Cannot_find_name_0: { code: 2304, category: 1 /* Error */, key: "Cannot find name '{0}'." },
        Module_0_has_no_exported_member_1: { code: 2305, category: 1 /* Error */, key: "Module '{0}' has no exported member '{1}'." },
        File_0_is_not_an_external_module: { code: 2306, category: 1 /* Error */, key: "File '{0}' is not an external module." },
        Cannot_find_external_module_0: { code: 2307, category: 1 /* Error */, key: "Cannot find external module '{0}'." },
        Generic_type_0_requires_1_type_argument_s: { code: 2314, category: 1 /* Error */, key: "Generic type '{0}' requires {1} type argument(s)." },
        Type_0_is_not_generic: { code: 2315, category: 1 /* Error */, key: "Type '{0}' is not generic." },
        Index_signatures_are_incompatible: { code: 2330, category: 1 /* Error */, key: "Index signatures are incompatible:" },
        Index_signature_is_missing_in_type_0: { code: 2329, category: 1 /* Error */, key: "Index signature is missing in type '{0}'." },
        Types_of_parameters_0_and_1_are_incompatible: { code: 2328, category: 1 /* Error */, key: "Types of parameters '{0}' and '{1}' are incompatible:" },
        Required_property_0_cannot_be_reimplemented_with_optional_property_in_1: { code: 2327, category: 1 /* Error */, key: "Required property '{0}' cannot be reimplemented with optional property in '{1}'." },
        Types_of_property_0_are_incompatible: { code: 2326, category: 1 /* Error */, key: "Types of property '{0}' are incompatible:" },
        Type_0_is_not_assignable_to_type_1: { code: 2322, category: 1 /* Error */, key: "Type '{0}' is not assignable to type '{1}':" },
        Type_0_is_not_assignable_to_type_1_Colon: { code: 2322, category: 1 /* Error */, key: "Type '{0}' is not assignable to type '{1}':" },
        Property_0_is_missing_in_type_1: { code: 2324, category: 1 /* Error */, key: "Property '{0}' is missing in type '{1}'." },
        Private_property_0_cannot_be_reimplemented: { code: 2325, category: 1 /* Error */, key: "Private property '{0}' cannot be reimplemented." },
        Excessive_stack_depth_comparing_types_0_and_1: { code: 2321, category: 1 /* Error */, key: "Excessive stack depth comparing types '{0}' and '{1}'." },
        Static_members_cannot_reference_class_type_parameters: { code: 2302, category: 1 /* Error */, key: "Static members cannot reference class type parameters." },
        Type_0_recursively_references_itself_as_a_base_type: { code: 2310, category: 1 /* Error */, key: "Type '{0}' recursively references itself as a base type." },
        A_class_may_only_extend_another_class: { code: 2311, category: 1 /* Error */, key: "A class may only extend another class." },
        An_interface_may_only_extend_a_class_or_another_interface: { code: 2312, category: 1 /* Error */, key: "An interface may only extend a class or another interface." },
        Types_have_separate_declarations_of_a_private_property_0: { code: 2442, category: 1 /* Error */, key: "Types have separate declarations of a private property '{0}'." },
        Property_0_is_private_in_type_1_but_not_in_type_2: { code: 2325, category: 1 /* Error */, key: "Property '{0}' is private in type '{1}' but not in type '{2}'." },
        Property_0_is_protected_but_type_1_is_not_a_class_derived_from_2: { code: 2443, category: 1 /* Error */, key: "Property '{0}' is protected but type '{1}' is not a class derived from '{2}'." },
        Property_0_is_protected_in_type_1_but_public_in_type_2: { code: 2444, category: 1 /* Error */, key: "Property '{0}' is protected in type '{1}' but public in type '{2}'." },
        Property_0_is_optional_in_type_1_but_required_in_type_2: { code: 2327, category: 1 /* Error */, key: "Property '{0}' is optional in type '{1}' but required in type '{2}'." },
        Type_alias_0_circularly_references_itself: { code: 2456, category: 1 /* Error */, key: "Type alias '{0}' circularly references itself." },
        // Custom Errors
        File_0_must_have_extension_d_json: { code: 10009, category: 1 /* Error */, key: "File '{0}' must have extension '.d.json'." },
        File_0_has_invalid_json_format_1: { code: 10010, category: 1 /* Error */, key: "File '{0}' has invalid JSON format: {1}" },
        Missing_required_argument_0: { code: 10011, category: 1 /* Error */, key: "Missing required argument '{0}'." }
    };
    var localizedDiagnosticMessages = undefined;
    function getLocaleSpecificMessage(message) {
        if (localizedDiagnosticMessages) {
            message = localizedDiagnosticMessages[message];
        }
        return message;
    }
    function formatStringFromArgs(text, args, baseIndex) {
        baseIndex = baseIndex || 0;
        return text.replace(/{(\d+)}/g, function (match, index) { return args[+index + baseIndex]; });
    }
    function throwDiagnosticError(errors) {
        if (errors.length > 0) {
            throw createDiagnosticError(errors);
        }
    }
    reflect.throwDiagnosticError = throwDiagnosticError;
    function createDiagnosticError(errors) {
        var diagnostics = getSortedDiagnostics(errors);
        var error = new Error(getDiagnosticErrorMessage(diagnostics));
        // clone errors
        error.diagnostics = [].concat(diagnostics);
        // clear errors
        errors.length = 0;
        return error;
    }
    reflect.createDiagnosticError = createDiagnosticError;
    function getDiagnosticErrorMessage(diagnostics) {
        var ret = "";
        reflect.forEach(diagnostics, function (diagnostic) {
            if (diagnostic.filename) {
                ret += diagnostic.filename + ": ";
            }
            ret += diagnostic.messageText + "\n";
        });
        return ret;
    }
    function getSortedDiagnostics(errors) {
        errors.sort(compareDiagnostics);
        errors = deduplicateSortedDiagnostics(errors);
        return errors;
    }
    function compareDiagnostics(d1, d2) {
        return compareValues(d1.filename, d2.filename) || compareValues(d1.code, d2.code) || compareValues(d1.messageText, d2.messageText) || 0;
    }
    function compareValues(a, b) {
        if (a === b)
            return 0;
        if (a === undefined)
            return -1;
        if (b === undefined)
            return 1;
        return a < b ? -1 : 1;
    }
    function deduplicateSortedDiagnostics(diagnostics) {
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
})(reflect || (reflect = {}));
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
var reflect;
(function (reflect) {
    var SymbolImpl = (function () {
        function SymbolImpl(checker, flags, name) {
            this.flags = flags;
            this.name = name;
            this._checker = checker;
        }
        SymbolImpl.prototype.resolve = function (name, meaning) {
            if (meaning === void 0) { meaning = 1536 /* Namespace */ | 3152352 /* Type */ | 107455 /* Value */; }
            if (!name) {
                throw new Error("Missing required argument 'name'.");
            }
            if (!this.declarations || this.declarations.length == 0) {
                return undefined;
            }
            var ret = this._checker.resolveEntityName(this.declarations[0], name, meaning);
            this._throwIfErrors();
            return ret;
        };
        SymbolImpl.prototype.getValue = function (obj) {
            if (!this.name || (this.flags & (4 /* Property */ | 3 /* Variable */ | 98304 /* Accessor */)) === 0) {
                throw new Error("Symbol must be a property, accessor, or variable.");
            }
            // Generate getters for VM optimization on first call to the getter. Verified that this improves performance
            // more than 3x for subsequent calls. We need to wait until the first call to generate the getter because
            // the 'flags' are not necessarily set in the constructor.
            // https://docs.google.com/document/d/10W46qDNO8Dl0Uye3QX0oUDPYAwaPl0qNy73TVLjd1WI/edit?pli=1#heading=h.rigwvvsmj92x
            this.getValue = (new Function("o", "return o['" + this.name + "']"));
            return obj[this.name];
        };
        SymbolImpl.prototype.setValue = function (obj, value) {
            if (!this.name || (this.flags & (4 /* Property */ | 3 /* Variable */ | 98304 /* Accessor */)) === 0) {
                throw new Error("Symbol must be a property, accessor, or variable.");
            }
            // See comment in getValue. Verified performance improvement for setting a value as well, but for
            // setting we got almost a 10x performance improvement.
            this.setValue = (new Function("o,v", "o['" + this.name + "'] = v"));
            obj[this.name] = value;
        };
        SymbolImpl.prototype.getFullName = function () {
            return this._checker.symbolToString(this);
        };
        SymbolImpl.prototype.getName = function () {
            return this.name;
        };
        SymbolImpl.prototype.getDescription = function () {
            var declarations = this.declarations;
            for (var i = 0, l = declarations.length; i < l; i++) {
                var declaration = declarations[i];
                var description = declaration.description;
                if (description) {
                    return description;
                }
            }
        };
        // TODO: list all symbols in symbol? List all types in symbol? List all symbols with annotation?
        SymbolImpl.prototype.getAnnotations = function (name) {
            return getAnnotationsFromSymbolOrSignature(this._checker, name, this);
        };
        SymbolImpl.prototype.hasAnnotation = function (name) {
            return hasAnnotation(this._checker, name, this);
        };
        SymbolImpl.prototype.getType = function () {
            // TODO:  return unknown type as undefined? or maybe this is better. We can still have a way to check for
            // unknown but code that wants to get properties of type or something can continue without a separate check.
            var ret = this._checker.getTypeOfSymbol(this);
            this._throwIfErrors();
            return ret;
        };
        SymbolImpl.prototype.getDeclaredType = function () {
            var ret = this._checker.getDeclaredTypeOfSymbol(this);
            this._throwIfErrors();
            return ret;
        };
        SymbolImpl.prototype.getExports = function () {
            var ret = this._checker.getExportedSymbols(this.exports, 107455 /* Value */ | 3152352 /* Type */ | 1536 /* Namespace */);
            this._throwIfErrors();
            return ret;
        };
        SymbolImpl.prototype.isOptionalProperty = function () {
            // TODO: this can be simplified if we disallow constructor properties in JSON declaration
            //  class C {
            //      constructor(public x?) { }
            //  }
            //
            // x is an optional parameter, but it is a required property.
            return this.valueDeclaration && this.valueDeclaration.flags & 32768 /* QuestionMark */ && this.valueDeclaration.kind !== 29 /* Parameter */;
        };
        SymbolImpl.prototype.isVariable = function () {
            return (this.flags & 3 /* Variable */) !== 0;
        };
        SymbolImpl.prototype.isFunction = function () {
            return (this.flags & 16 /* Function */) !== 0;
        };
        SymbolImpl.prototype.isClass = function () {
            return (this.flags & 32 /* Class */) !== 0;
        };
        SymbolImpl.prototype.isInterface = function () {
            return (this.flags & 64 /* Interface */) !== 0;
        };
        SymbolImpl.prototype.isEnum = function () {
            return (this.flags & 384 /* Enum */) !== 0;
        };
        SymbolImpl.prototype.isModule = function () {
            return (this.flags & 1536 /* Module */) !== 0;
        };
        SymbolImpl.prototype.isImport = function () {
            return (this.flags & 33554432 /* Import */) !== 0;
        };
        SymbolImpl.prototype.isTypeParameter = function () {
            return (this.flags & 1048576 /* TypeParameter */) !== 0;
        };
        SymbolImpl.prototype.isProperty = function () {
            return (this.flags & 4 /* Property */) !== 0;
        };
        SymbolImpl.prototype.isMethod = function () {
            return (this.flags & 8192 /* Method */) !== 0;
        };
        SymbolImpl.prototype.isAccessor = function () {
            return (this.flags & 98304 /* Accessor */) !== 0;
        };
        SymbolImpl.prototype.isGetAccessor = function () {
            return (this.flags & 32768 /* GetAccessor */) !== 0;
        };
        SymbolImpl.prototype.isSetAccessor = function () {
            return (this.flags & 65536 /* SetAccessor */) !== 0;
        };
        SymbolImpl.prototype.isEnumMember = function () {
            return (this.flags & 8 /* EnumMember */) !== 0;
        };
        SymbolImpl.prototype.isTypeAlias = function () {
            return (this.flags & 2097152 /* TypeAlias */) !== 0;
        };
        SymbolImpl.prototype._throwIfErrors = function () {
            var errors = this._checker.getErrors();
            reflect.throwDiagnosticError(errors);
        };
        return SymbolImpl;
    })();
    reflect.SymbolImpl = SymbolImpl;
    function hasAnnotation(checker, name, container) {
        if (!container.annotations) {
            getAnnotationsFromSymbolOrSignature(checker, name, container);
        }
        return container.annotationsByName[name] !== undefined;
    }
    reflect.hasAnnotation = hasAnnotation;
    function getAnnotationsFromSymbolOrSignature(checker, name, container) {
        if (!container.annotations) {
            container.annotations = [];
            container.annotationsByName = {};
            if (container.declarations) {
                var declarations = container.declarations;
            }
            else if (container.declaration) {
                var declarations = [container.declaration];
            }
            if (declarations) {
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
        if (name) {
            return container.annotationsByName[name] || [];
        }
        return container.annotations;
    }
    reflect.getAnnotationsFromSymbolOrSignature = getAnnotationsFromSymbolOrSignature;
    var AnnotationImpl = (function () {
        function AnnotationImpl(checker, annotation, declaration) {
            this.declaration = declaration;
            this._checker = checker;
            this.name = annotation.name;
            this.value = annotation.value;
        }
        AnnotationImpl.prototype.getDeclarationFileName = function () {
            return this._checker.getSourceFile(this.declaration).filename;
        };
        return AnnotationImpl;
    })();
    reflect.AnnotationImpl = AnnotationImpl;
})(reflect || (reflect = {}));
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
/// <reference path="nodes.ts"/>
/// <reference path="diagnostics.ts"/>
/// <reference path="symbolImpl.ts"/>
var reflect;
(function (reflect) {
    function createBinder(checker) {
        return function bindSourceFile(file) {
            var parent;
            var container;
            var blockScopeContainer;
            var lastContainer;
            if (!file.locals) {
                file.locals = {};
                container = blockScopeContainer = file;
                bind(file);
            }
            // Did not merge in getModuleInstanceState because we are not using the
            // node.symbol.constEnumOnlyModule flag.
            function isInstantiated(node) {
                // A module is uninstantiated if it contains only
                // 1. interface declarations
                if (node.kind === 1 /* InterfaceDeclaration */) {
                    return false;
                }
                else if (node.kind === 7 /* ImportDeclaration */ && !(node.flags & 1 /* Export */)) {
                    return false;
                }
                else if (node.kind === 4 /* ModuleDeclaration */ && !forEachChild(node, isInstantiated)) {
                    return false;
                }
                else {
                    return true;
                }
            }
            function createSymbol(flags, name) {
                return checker.createSymbol(flags, name);
            }
            function addDeclarationToSymbol(symbol, node, symbolKind) {
                symbol.flags |= symbolKind;
                if (!symbol.declarations)
                    symbol.declarations = [];
                symbol.declarations.push(node);
                if (symbolKind & 1952 /* HasExports */ && !symbol.exports)
                    symbol.exports = {};
                if (symbolKind & 6240 /* HasMembers */ && !symbol.members)
                    symbol.members = {};
                node.symbol = symbol;
                if (symbolKind & 107455 /* Value */ && !symbol.valueDeclaration)
                    symbol.valueDeclaration = node;
            }
            // Should not be called on a declaration with a computed property name.
            function getDeclarationName(node) {
                if (node.name) {
                    if (node.kind === 4 /* ModuleDeclaration */ && node.flags & 16384 /* ExternalModule */) {
                        return '"' + node.name + '"';
                    }
                    return node.name;
                }
                switch (node.kind) {
                    case 23 /* ConstructorType */:
                    case 13 /* Constructor */:
                        return "__constructor";
                    case 21 /* FunctionType */:
                    case 20 /* CallSignature */:
                        return "__call";
                    case 17 /* ConstructSignature */:
                        return "__new";
                    case 19 /* IndexSignature */:
                        return "__index";
                }
            }
            function getDisplayName(node) {
                return node.name ? node.name : getDeclarationName(node);
            }
            function declareSymbol(symbols, parent, node, includes, excludes) {
                var name = getDeclarationName(node);
                if (name !== undefined) {
                    var symbol = reflect.hasProperty(symbols, name) ? symbols[name] : (symbols[name] = createSymbol(0, name));
                    if (symbol.flags & excludes) {
                        file.errors.push(new reflect.Diagnostic(file, reflect.Diagnostics.Duplicate_identifier_0, getDisplayName(node)));
                        symbol = createSymbol(0, name);
                    }
                }
                else {
                    symbol = createSymbol(0, "__missing");
                }
                addDeclarationToSymbol(symbol, node, includes);
                symbol.parent = parent;
                if (node.kind === 2 /* ClassDeclaration */ && symbol.exports) {
                    // TypeScript 1.0 spec (April 2014): 8.4
                    // Every class automatically contains a static property member named 'prototype',
                    // the type of which is an instantiation of the class type with type Any supplied as a type argument for each type parameter.
                    // It is an error to explicitly declare a static property member with the name 'prototype'.
                    var prototypeSymbol = createSymbol(4 /* Property */ | 536870912 /* Prototype */, "prototype");
                    if (reflect.hasProperty(symbol.exports, prototypeSymbol.name)) {
                        file.errors.push(new reflect.Diagnostic(file, reflect.Diagnostics.Duplicate_identifier_0, prototypeSymbol.name));
                    }
                    symbol.exports[prototypeSymbol.name] = prototypeSymbol;
                    prototypeSymbol.parent = symbol;
                }
                return symbol;
            }
            function declareModuleMember(node, symbolKind, symbolExcludes) {
                // Exported module members are given 2 symbols: A local symbol that is classified with an ExportValue,
                // ExportType, or ExportContainer flag, and an associated export symbol with all the correct flags set
                // on it. There are 2 main reasons:
                //
                //   1. We treat locals and exports of the same name as mutually exclusive within a container.
                //      That means the binder will issue a Duplicate Identifier error if you mix locals and exports
                //      with the same name in the same container.
                //      TODO: Make this a more specific error and decouple it from the exclusion logic.
                //   2. When we checkIdentifier in the checker, we set its resolved symbol to the local symbol,
                //      but return the export symbol (by calling getExportSymbolOfValueSymbolIfExported). That way
                //      when the emitter comes back to it, it knows not to qualify the name if it was found in a containing scope.
                var exportKind = 0;
                if (symbolKind & 107455 /* Value */) {
                    exportKind |= 4194304 /* ExportValue */;
                }
                if (symbolKind & 3152352 /* Type */) {
                    exportKind |= 8388608 /* ExportType */;
                }
                if (symbolKind & 1536 /* Namespace */) {
                    exportKind |= 16777216 /* ExportNamespace */;
                }
                if (node.flags & 1 /* Export */ || node.kind !== 7 /* ImportDeclaration */) {
                    if (exportKind) {
                        var local = declareSymbol(container.locals, undefined, node, exportKind, symbolExcludes);
                        local.exportSymbol = declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                        node.localSymbol = local;
                    }
                    else {
                        declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                    }
                }
                else {
                    declareSymbol(container.locals, undefined, node, symbolKind, symbolExcludes);
                }
            }
            // All container nodes are kept on a linked list in declaration order. This list is used by the getLocalNameOfContainer function
            // in the type checker to validate that the local name used for a container is unique.
            function bindChildren(node, symbolKind, isBlockScopeContainer) {
                if (symbolKind & 1041936 /* HasLocals */) {
                    node.locals = {};
                }
                var saveParent = parent;
                var saveContainer = container;
                var savedBlockScopeContainer = blockScopeContainer;
                parent = node;
                if (symbolKind & 1048560 /* IsContainer */) {
                    container = node;
                    // If container is not on container list, add it to the list
                    if (lastContainer !== container && !container.nextContainer) {
                        if (lastContainer) {
                            lastContainer.nextContainer = container;
                        }
                        lastContainer = container;
                    }
                }
                if (isBlockScopeContainer) {
                    blockScopeContainer = node;
                }
                forEachChild(node, bind);
                container = saveContainer;
                parent = saveParent;
                blockScopeContainer = savedBlockScopeContainer;
            }
            function bindDeclaration(node, symbolKind, symbolExcludes, isBlockScopeContainer) {
                switch (container.kind) {
                    case 4 /* ModuleDeclaration */:
                        declareModuleMember(node, symbolKind, symbolExcludes);
                        break;
                    case 0 /* SourceFile */:
                        if (container.flags & 16384 /* ExternalModule */) {
                            declareModuleMember(node, symbolKind, symbolExcludes);
                            break;
                        }
                        else {
                            declareSymbol(checker.globals, undefined, node, symbolKind, symbolExcludes);
                        }
                        break;
                    case 21 /* FunctionType */:
                    case 23 /* ConstructorType */:
                    case 20 /* CallSignature */:
                    case 17 /* ConstructSignature */:
                    case 19 /* IndexSignature */:
                    case 12 /* Method */:
                    case 18 /* MethodSignature */:
                    case 13 /* Constructor */:
                    case 14 /* GetAccessor */:
                    case 15 /* SetAccessor */:
                    case 5 /* FunctionDeclaration */:
                        declareSymbol(container.locals, undefined, node, symbolKind, symbolExcludes);
                        break;
                    case 2 /* ClassDeclaration */:
                        if (node.flags & 128 /* Static */) {
                            declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                            break;
                        }
                    case 24 /* ObjectType */:
                    case 1 /* InterfaceDeclaration */:
                        declareSymbol(container.symbol.members, container.symbol, node, symbolKind, symbolExcludes);
                        break;
                    case 3 /* EnumDeclaration */:
                        declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                        break;
                }
                bindChildren(node, symbolKind, isBlockScopeContainer);
            }
            function bindConstructorDeclaration(node) {
                bindDeclaration(node, 16384 /* Constructor */, 0, true);
                reflect.forEach(node.parameters, function (p) {
                    if (p.flags & (16 /* Public */ | 32 /* Private */ | 64 /* Protected */)) {
                        bindDeclaration(p, 4 /* Property */, 107455 /* PropertyExcludes */, false);
                    }
                });
            }
            function bindModuleDeclaration(node) {
                if (node.flags & 16384 /* ExternalModule */) {
                    bindDeclaration(node, 512 /* ValueModule */, 106639 /* ValueModuleExcludes */, true);
                }
                else if (isInstantiated(node)) {
                    bindDeclaration(node, 512 /* ValueModule */, 106639 /* ValueModuleExcludes */, true);
                }
                else {
                    bindDeclaration(node, 1024 /* NamespaceModule */, 0 /* NamespaceModuleExcludes */, true);
                }
            }
            function bindFunctionOrConstructorType(node) {
                // For a given function symbol "<...>(...) => T" we want to generate a symbol identical
                // to the one we would get for: { <...>(...): T }
                //
                // We do that by making an anonymous type literal symbol, and then setting the function
                // symbol as its sole member. To the rest of the system, this symbol will be  indistinguishable
                // from an actual type literal symbol you would have gotten had you used the long form.
                var symbolKind = node.kind === 21 /* FunctionType */ ? 131072 /* CallSignature */ : 262144 /* ConstructSignature */;
                var symbol = createSymbol(symbolKind, getDeclarationName(node));
                addDeclarationToSymbol(symbol, node, symbolKind);
                bindChildren(node, symbolKind, false);
                var typeLiteralSymbol = createSymbol(2048 /* TypeLiteral */, "__type");
                addDeclarationToSymbol(typeLiteralSymbol, node, 2048 /* TypeLiteral */);
                typeLiteralSymbol.members = {};
                typeLiteralSymbol.members[node.kind === 21 /* FunctionType */ ? "__call" : "__new"] = symbol;
            }
            function bindAnonymousDeclaration(node, symbolKind, name, isBlockScopeContainer) {
                var symbol = createSymbol(symbolKind, name);
                addDeclarationToSymbol(symbol, node, symbolKind);
                bindChildren(node, symbolKind, isBlockScopeContainer);
            }
            function bindBlockScopedVariableDeclaration(node) {
                switch (blockScopeContainer.kind) {
                    case 4 /* ModuleDeclaration */:
                        declareModuleMember(node, 2 /* BlockScopedVariable */, 107455 /* BlockScopedVariableExcludes */);
                        break;
                    case 0 /* SourceFile */:
                        if (node.flags & 16384 /* ExternalModule */) {
                            declareModuleMember(node, 2 /* BlockScopedVariable */, 107455 /* BlockScopedVariableExcludes */);
                            break;
                        }
                    default:
                        if (!blockScopeContainer.locals) {
                            blockScopeContainer.locals = {};
                        }
                        declareSymbol(blockScopeContainer.locals, undefined, node, 2 /* BlockScopedVariable */, 107455 /* BlockScopedVariableExcludes */);
                }
                bindChildren(node, 2 /* BlockScopedVariable */, false);
            }
            function bind(node) {
                node.parent = parent;
                switch (node.kind) {
                    case 30 /* TypeParameter */:
                        bindDeclaration(node, 1048576 /* TypeParameter */, 2103776 /* TypeParameterExcludes */, false);
                        break;
                    case 29 /* Parameter */:
                        bindDeclaration(node, 1 /* FunctionScopedVariable */, 107455 /* ParameterExcludes */, false);
                        break;
                    case 6 /* VariableDeclaration */:
                        // TODO: variable declrations are not bound correctly. Has something to do with this blockscoped business
                        if (node.flags & 6144 /* BlockScoped */) {
                            bindBlockScopedVariableDeclaration(node);
                        }
                        else {
                            bindDeclaration(node, 1 /* FunctionScopedVariable */, 107454 /* FunctionScopedVariableExcludes */, false);
                        }
                        break;
                    case 11 /* Field */:
                    case 16 /* PropertySignature */:
                        bindDeclaration(node, 4 /* Property */, 107455 /* PropertyExcludes */, false);
                        break;
                    case 9 /* EnumMember */:
                        bindDeclaration(node, 8 /* EnumMember */, 107455 /* EnumMemberExcludes */, false);
                        break;
                    case 20 /* CallSignature */:
                        bindDeclaration(node, 131072 /* CallSignature */, 0, false);
                        break;
                    case 17 /* ConstructSignature */:
                        bindDeclaration(node, 262144 /* ConstructSignature */, 0, true);
                        break;
                    case 12 /* Method */:
                    case 18 /* MethodSignature */:
                        // If this is an ObjectLiteralExpression method, then it sits in the same space
                        // as other properties in the object literal.  So we use SymbolFlags.PropertyExcludes
                        // so that it will conflict with any other object literal members with the same
                        // name.
                        // TODO: Need to revisit this and make sure implementation of isObjectLiteralMethod is correct and that this is needed at all.
                        bindDeclaration(node, 8192 /* Method */, isObjectLiteralMethod(node) ? 107455 /* PropertyExcludes */ : 99263 /* MethodExcludes */, true);
                        break;
                    case 19 /* IndexSignature */:
                        bindDeclaration(node, 524288 /* IndexSignature */, 0, false);
                        break;
                    case 5 /* FunctionDeclaration */:
                        bindDeclaration(node, 16 /* Function */, 106927 /* FunctionExcludes */, true);
                        break;
                    case 13 /* Constructor */:
                        bindConstructorDeclaration(node);
                        break;
                    case 14 /* GetAccessor */:
                        bindDeclaration(node, 32768 /* GetAccessor */, 41919 /* GetAccessorExcludes */, true);
                        break;
                    case 15 /* SetAccessor */:
                        bindDeclaration(node, 65536 /* SetAccessor */, 74687 /* SetAccessorExcludes */, true);
                        break;
                    case 23 /* ConstructorType */:
                    case 21 /* FunctionType */:
                        bindFunctionOrConstructorType(node);
                        break;
                    case 22 /* ArrayType */:
                    case 24 /* ObjectType */:
                        bindAnonymousDeclaration(node, 2048 /* TypeLiteral */, "__type", false);
                        break;
                    case 2 /* ClassDeclaration */:
                        bindDeclaration(node, 32 /* Class */, 3258879 /* ClassExcludes */, false);
                        break;
                    case 1 /* InterfaceDeclaration */:
                        bindDeclaration(node, 64 /* Interface */, 3152288 /* InterfaceExcludes */, false);
                        break;
                    case 8 /* TypeAliasDeclaration */:
                        bindDeclaration(node, 2097152 /* TypeAlias */, 3152352 /* TypeAliasExcludes */, false);
                        break;
                    case 3 /* EnumDeclaration */:
                        if (isConst(node)) {
                            bindDeclaration(node, 128 /* ConstEnum */, 3259263 /* ConstEnumExcludes */, false);
                        }
                        else {
                            bindDeclaration(node, 256 /* RegularEnum */, 3258623 /* RegularEnumExcludes */, false);
                        }
                        break;
                    case 4 /* ModuleDeclaration */:
                        bindModuleDeclaration(node);
                        break;
                    case 7 /* ImportDeclaration */:
                        bindDeclaration(node, 33554432 /* Import */, 33554432 /* ImportExcludes */, false);
                        break;
                    case 0 /* SourceFile */:
                        if (node.flags & 16384 /* ExternalModule */) {
                            bindAnonymousDeclaration(node, 512 /* ValueModule */, '"' + reflect.removeFileExtension(node.filename) + '"', true);
                            break;
                        }
                    default:
                        var saveParent = parent;
                        parent = node;
                        forEachChild(node, bind);
                        parent = saveParent;
                }
            }
        };
        function isConstEnumDeclaration(node) {
            // TODO: we don't store whether or not it's a const enum but we need to revisit this because of the getEnumValue code
            return false;
        }
        function isConst(node) {
            // TODO: we don't store whether or not it's a const enum but we need to revisit this because of the getEnumValue code
            return false;
        }
        function isObjectLiteralMethod(node) {
            return node !== undefined && node.kind === 18 /* MethodSignature */ && node.parent.kind === 24 /* ObjectType */;
        }
    }
    reflect.createBinder = createBinder;
    // Invokes a callback for each child of the given node. The 'cbNode' callback is invoked for all child nodes
    // stored in properties. If a 'cbNodes' callback is specified, it is invoked for embedded arrays; otherwise,
    // embedded arrays are flattened and the 'cbNode' callback is invoked for each element. If a callback returns
    // a truthy value, iteration stops and that value is returned. Otherwise, undefined is returned.
    function forEachChild(node, cbNode, cbNodes) {
        function child(node) {
            if (node) {
                return cbNode(node);
            }
        }
        function children(nodes) {
            if (nodes) {
                if (cbNodes) {
                    return cbNodes(nodes);
                }
                for (var i = 0, len = nodes.length; i < len; i++) {
                    var result = cbNode(nodes[i]);
                    if (result) {
                        return result;
                    }
                }
                return undefined;
            }
        }
        if (!node) {
            return;
        }
        switch (node.kind) {
            case 0 /* SourceFile */:
                return children(node.declares);
            case 1 /* InterfaceDeclaration */:
                return children(node.typeParameters) || children(node.extends) || children(node.signatures);
            case 2 /* ClassDeclaration */:
                return children(node.typeParameters) || child(node.extends) || children(node.implements) || children(node.members);
            case 8 /* TypeAliasDeclaration */:
                return child(node.type);
            case 3 /* EnumDeclaration */:
                return children(node.members);
            case 4 /* ModuleDeclaration */:
                return children(node.declares);
            case 20 /* CallSignature */:
            case 17 /* ConstructSignature */:
            case 18 /* MethodSignature */:
            case 13 /* Constructor */:
            case 12 /* Method */:
            case 5 /* FunctionDeclaration */:
            case 23 /* ConstructorType */:
            case 21 /* FunctionType */:
                return children(node.typeParameters) || children(node.parameters) || child(node.returns);
            case 11 /* Field */:
            case 6 /* VariableDeclaration */:
            case 16 /* PropertySignature */:
                return child(node.type);
            case 10 /* Index */:
            case 14 /* GetAccessor */:
            case 15 /* SetAccessor */:
            case 19 /* IndexSignature */:
                return child(node.parameter) || child(node.returns);
            case 22 /* ArrayType */:
                return child(node.type);
            case 27 /* TupleType */:
                return children(node.types);
            case 28 /* UnionType */:
                return children(node.types);
            case 24 /* ObjectType */:
                return children(node.signatures);
            case 25 /* TypeReference */:
                return children(node.arguments);
            case 29 /* Parameter */:
                return child(node.type);
            case 30 /* TypeParameter */:
                return child(node.constraint);
        }
    }
    reflect.forEachChild = forEachChild;
})(reflect || (reflect = {}));
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
var reflect;
(function (reflect) {
    var TypeImpl = (function () {
        function TypeImpl(checker, flags) {
            this.flags = flags;
            this._checker = checker;
        }
        TypeImpl.prototype.getFullName = function () {
            if (this.symbol) {
                return this.symbol.getFullName();
            }
        };
        TypeImpl.prototype.getName = function () {
            if (this.symbol) {
                return this.symbol.getName();
            }
        };
        TypeImpl.prototype.getDescription = function () {
            if (this.symbol) {
                return this.symbol.getDescription();
            }
        };
        TypeImpl.prototype.getAnnotations = function (nameOrInherit, inherit) {
            if (!this.symbol) {
                return [];
            }
            if (typeof nameOrInherit === "string" || inherit !== undefined) {
                var name = nameOrInherit;
            }
            else {
                inherit = nameOrInherit;
            }
            var annotations = this.symbol.getAnnotations(name);
            // TODO: what about duplicates from inherited annotations? Should we only inherit from classes?
            if (inherit) {
                var baseTypes = this.baseTypes;
                for (var i = 0, l = baseTypes.length; i < l; i++) {
                    var baseType = baseTypes[i];
                    annotations = (baseType.getAnnotations(name, inherit)).concat(annotations);
                }
            }
            return annotations;
        };
        TypeImpl.prototype.hasAnnotation = function (name, inherit) {
            if (!this.symbol) {
                return false;
            }
            if (this.symbol.hasAnnotation(name)) {
                return true;
            }
            if (inherit) {
                var baseTypes = this.baseTypes;
                for (var i = 0, l = baseTypes.length; i < l; i++) {
                    if (baseTypes[i].hasAnnotation(name, inherit)) {
                        return true;
                    }
                }
            }
            return false;
        };
        TypeImpl.prototype.getProperties = function () {
            return this._checker.getPropertiesOfType(this);
        };
        TypeImpl.prototype.getProperty = function (name) {
            return this._checker.getPropertyOfType(this, name);
        };
        TypeImpl.prototype.getCallSignatures = function () {
            return this._checker.getSignaturesOfType(this, 0 /* Call */);
        };
        TypeImpl.prototype.getConstructSignatures = function () {
            return this._checker.getSignaturesOfType(this, 1 /* Construct */);
        };
        TypeImpl.prototype.getStringIndexType = function () {
            return this._checker.getIndexTypeOfType(this, 0 /* String */);
        };
        TypeImpl.prototype.getNumberIndexType = function () {
            return this._checker.getIndexTypeOfType(this, 1 /* Number */);
        };
        TypeImpl.prototype.isIdenticalTo = function (target, diagnostics) {
            return this._checker.isTypeIdenticalTo(this, target, diagnostics);
        };
        TypeImpl.prototype.isSubtypeOf = function (target, diagnostics) {
            return this._checker.isTypeSubtypeOf(this, target, diagnostics);
        };
        TypeImpl.prototype.isAssignableTo = function (target, diagnostics) {
            return this._checker.isTypeAssignableTo(this, target, diagnostics);
        };
        TypeImpl.prototype.hasBaseType = function (target) {
            // TODO: cache?
            return check(this);
            function check(type) {
                var type = type._getTargetType();
                return type === target || reflect.forEach(type.baseTypes, check);
            }
        };
        TypeImpl.prototype.getBaseTypes = function () {
            return this.baseTypes;
        };
        TypeImpl.prototype.getBaseType = function (name) {
            // TODO: cache?
            return check(this);
            function check(type) {
                var type = type._getTargetType();
                if (type.getName() == name) {
                    return type;
                }
                return reflect.forEach(type.baseTypes, check);
            }
        };
        TypeImpl.prototype._getTargetType = function () {
            return this.flags & 4096 /* Reference */ ? this.target : this;
        };
        TypeImpl.prototype.isSubclassOf = function (target) {
            if (target === this) {
                return false;
            }
            var baseClass = this._getTargetType();
            if ((baseClass.flags & 1024 /* Class */) === 0) {
                return false;
            }
            while (baseClass) {
                if (baseClass === target) {
                    return true;
                }
                baseClass = baseClass.getBaseClass();
            }
            return false;
        };
        TypeImpl.prototype.getBaseClass = function () {
            // note: does not check that the current type is a class. if the current type is an interface,
            // this could incorrectly return that it has a base class if the interface extends a class.
            if (this._baseClass !== undefined) {
                return this._baseClass;
            }
            var baseClass = null;
            var baseTypes = this.baseTypes;
            for (var i = 0, l = baseTypes.length; i < l; i++) {
                var candidate = baseTypes[i]._getTargetType();
                if (candidate.flags & 1024 /* Class */) {
                    baseClass = candidate;
                    break;
                }
            }
            return this._baseClass = baseClass;
        };
        TypeImpl.prototype.isClass = function () {
            return (this.flags & 1024 /* Class */) !== 0;
        };
        TypeImpl.prototype.isInterface = function () {
            return (this.flags & 2048 /* Interface */) !== 0;
        };
        TypeImpl.prototype.isTuple = function () {
            return (this.flags & 8192 /* Tuple */) !== 0;
        };
        TypeImpl.prototype.isUnion = function () {
            return (this.flags & 16384 /* Union */) !== 0;
        };
        TypeImpl.prototype.isAnonymous = function () {
            return (this.flags & 32768 /* Anonymous */) !== 0;
        };
        TypeImpl.prototype.isReference = function () {
            return (this.flags & 4096 /* Reference */) !== 0;
        };
        TypeImpl.prototype.isEnum = function () {
            return (this.flags & 128 /* Enum */) !== 0;
        };
        TypeImpl.prototype.isStringLiteral = function () {
            return (this.flags & 256 /* StringLiteral */) !== 0;
        };
        TypeImpl.prototype.isTypeParameter = function () {
            return (this.flags & 512 /* TypeParameter */) !== 0;
        };
        TypeImpl.prototype.isAny = function () {
            return (this.flags & 1 /* Any */) !== 0;
        };
        TypeImpl.prototype.isString = function () {
            return (this.flags & 2 /* String */) !== 0;
        };
        TypeImpl.prototype.isNumber = function () {
            return (this.flags & 4 /* Number */) !== 0;
        };
        TypeImpl.prototype.isBoolean = function () {
            return (this.flags & 8 /* Boolean */) !== 0;
        };
        TypeImpl.prototype.isVoid = function () {
            return (this.flags & 16 /* Void */) !== 0;
        };
        TypeImpl.prototype.isIntrinsic = function () {
            return (this.flags & 127 /* Intrinsic */) !== 0;
        };
        TypeImpl.prototype.isArray = function () {
            return this.hasBaseType(this._checker.getGlobalArrayType());
        };
        TypeImpl.prototype.isIndex = function () {
            return this._isIndex || (this._isIndex = !!(this.getStringIndexType() || this.getNumberIndexType()));
        };
        TypeImpl.prototype.isObjectType = function () {
            return (this.flags & 48128 /* ObjectType */) !== 0;
        };
        TypeImpl.prototype.getEnumValue = function (value, ignoreCase) {
            if (ignoreCase === void 0) { ignoreCase = false; }
            if (!this.isEnum()) {
                throw new Error("Type must be an Enum type.");
            }
            var enumMapping = this._getEnumMapping();
            if (!ignoreCase) {
                return enumMapping[value];
            }
            value = value.toLowerCase();
            for (var name in enumMapping) {
                if (enumMapping.hasOwnProperty(name) && isNaN(name)) {
                    if (name.toLowerCase() === value) {
                        return enumMapping[name];
                    }
                }
            }
        };
        // TODO: need to decide how to handle const enums
        TypeImpl.prototype.getEnumNames = function () {
            if (this._enumNames) {
                return this._enumNames;
            }
            if (!this.isEnum()) {
                throw new Error("Type must be an Enum type.");
            }
            var names = [];
            var enumMapping = this._getEnumMapping();
            for (var name in enumMapping) {
                if (enumMapping.hasOwnProperty(name) && isNaN(name)) {
                    names.push(name);
                }
            }
            return this._enumNames = names;
        };
        TypeImpl.prototype.getEnumName = function (value) {
            if (!this.isEnum()) {
                throw new Error("Type must be an Enum type.");
            }
            var enumMapping = this._getEnumMapping();
            return enumMapping[value];
        };
        TypeImpl.prototype._getEnumMapping = function () {
            if (this._enumMapping) {
                return this._enumMapping;
            }
            var exports = this.symbol.exports;
            // See if the implementation is available
            var enumImplementation = this._getImplementation();
            if (enumImplementation) {
                // check to make sure the implementation is valid
                var valid = true;
                for (var name in exports) {
                    if (enumImplementation[name] === undefined) {
                        valid = false;
                        break;
                    }
                }
                if (valid) {
                    return this._enumMapping = enumImplementation;
                }
            }
            // Can't find valid implementation. May be a const enum. Try to build the mapping from the declarations.
            var mapping = {};
            for (var name in exports) {
                var value = exports[name].valueDeclaration.value;
                if (value !== undefined) {
                    mapping[name] = value;
                    mapping[value] = name;
                }
            }
            return this._enumMapping = mapping;
        };
        TypeImpl.prototype.getElementType = function () {
            if (this._elementType !== undefined) {
                return this._elementType;
            }
            if (!this.isArray()) {
                throw new Error("Type must be an Array type");
            }
            var elementType = null;
            var globalArrayType = this._checker.getGlobalArrayType();
            var reference = getArrayReference(this);
            if (reference) {
                elementType = reference.typeArguments[0];
            }
            return this._elementType = elementType;
            function getArrayReference(type) {
                var target = type._getTargetType();
                if (target === globalArrayType) {
                    return type;
                }
                return reflect.forEach(target.baseTypes, getArrayReference);
            }
        };
        TypeImpl.prototype.getElementTypes = function () {
            if (this.isUnion()) {
                return this.types;
            }
            if (this.isTuple()) {
                return this.elementTypes;
            }
            throw new Error("Type must be a Union or Tuple type");
        };
        TypeImpl.prototype.createInstance = function (args) {
            var constructor = this._getImplementation();
            if (!constructor.prototype) {
                throw new Error("Constructor '" + this.getFullName() + "' does not have a prototype.");
            }
            var instance = Object.create(constructor.prototype);
            if (args) {
                constructor.apply(instance, args);
            }
            return instance;
        };
        TypeImpl.prototype.getConstructor = function () {
            if (!this.isClass()) {
                throw new Error("Type must be a Class type");
            }
            return this._getImplementation();
        };
        TypeImpl.prototype._getImplementation = function () {
            var obj = this._cachedImplementation;
            if (obj) {
                return obj;
            }
            // find the module containing this class
            var moduleSymbol = this._findContainingExternalModule();
            if (!moduleSymbol) {
                // class is in the global namespace
                var obj = global;
                var moduleName = "globals"; // for error reporting
                var name = this._checker.symbolToString(this.symbol);
            }
            else {
                // class is in an external module, load the javascript module
                var moduleName = moduleSymbol.name.replace(/^"|"$/g, "");
                if (this._checker.isExternalModuleNameRelative(moduleName)) {
                    var obj = module.require(reflect.absolutePath(moduleName));
                }
                else {
                    var obj = module.require(moduleName);
                }
                // find the name of the symbol in the module
                var name = this._checker.symbolToString(this.symbol, this._checker.getResolvedExportSymbol(moduleSymbol));
            }
            if (name) {
                var path = name.split('.');
                for (var i = 0, l = path.length; i < l; i++) {
                    obj = obj[path[i]];
                    if (!obj) {
                        throw new Error("Could not find '" + name + "' in module '" + moduleName + "'.");
                    }
                }
            }
            return this._cachedImplementation = obj;
        };
        TypeImpl.prototype._findContainingExternalModule = function () {
            var symbol = this.symbol;
            while (symbol) {
                if (symbol.valueDeclaration && symbol.valueDeclaration.flags & 16384 /* ExternalModule */) {
                    return symbol;
                }
                symbol = symbol.parent;
            }
        };
        return TypeImpl;
    })();
    reflect.TypeImpl = TypeImpl;
})(reflect || (reflect = {}));
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
var reflect;
(function (reflect) {
    var SignatureImpl = (function () {
        function SignatureImpl(checker) {
            this._checker = checker;
        }
        SignatureImpl.prototype.getDescription = function () {
            return this.declaration.description;
        };
        SignatureImpl.prototype.getParameters = function () {
            return this.parameters;
        };
        SignatureImpl.prototype.getParameter = function (name) {
            var _this = this;
            if (!this.parametersByName) {
                this.parametersByName = {};
                reflect.forEach(this.parameters, function (parameter) {
                    _this.parametersByName[parameter.name] = parameter;
                });
            }
            return this.parametersByName[name];
        };
        SignatureImpl.prototype.getReturnType = function () {
            return this._checker.getReturnTypeOfSignature(this);
        };
        SignatureImpl.prototype.getAnnotations = function (name) {
            return reflect.getAnnotationsFromSymbolOrSignature(this._checker, name, this);
        };
        SignatureImpl.prototype.hasAnnotation = function (name) {
            return reflect.hasAnnotation(this._checker, name, this);
        };
        return SignatureImpl;
    })();
    reflect.SignatureImpl = SignatureImpl;
})(reflect || (reflect = {}));
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
/// <reference path="arrayUtil.ts"/>
/// <reference path="nodes.ts"/>
/// <reference path="diagnostics.ts"/>
/// <reference path="types.ts"/>
/// <reference path="typeImpl.ts"/>
/// <reference path="signatureImpl.ts"/>
var reflect;
(function (reflect) {
    var CharacterCodes;
    (function (CharacterCodes) {
        CharacterCodes[CharacterCodes["_"] = 0x5F] = "_";
    })(CharacterCodes || (CharacterCodes = {}));
    var nextSymbolId = 1;
    var nextNodeId = 1;
    function createTypeChecker(loader) {
        var typeCount = 0;
        var emptyArray = [];
        var emptySymbols = {};
        var unknownSymbol = createSymbol(4 /* Property */ | 268435456 /* Transient */, "unknown");
        var resolvingSymbol = createSymbol(268435456 /* Transient */, "__resolving__");
        var anyType = createIntrinsicType(1 /* Any */, "any");
        var stringType = createIntrinsicType(2 /* String */, "string");
        var numberType = createIntrinsicType(4 /* Number */, "number");
        var booleanType = createIntrinsicType(8 /* Boolean */, "boolean");
        var voidType = createIntrinsicType(16 /* Void */, "void");
        var undefinedType = createIntrinsicType(32 /* Undefined */, "undefined");
        var nullType = createIntrinsicType(64 /* Null */, "null");
        var unknownType = createIntrinsicType(1 /* Any */, "unknown");
        var resolvingType = createIntrinsicType(1 /* Any */, "__resolving__");
        var emptyObjectType = createAnonymousType(undefined, emptySymbols, emptyArray, emptyArray, undefined, undefined);
        var anyFunctionType = createAnonymousType(undefined, emptySymbols, emptyArray, emptyArray, undefined, undefined);
        var noConstraintType = createAnonymousType(undefined, emptySymbols, emptyArray, emptyArray, undefined, undefined);
        var inferenceFailureType = createAnonymousType(undefined, emptySymbols, emptyArray, emptyArray, undefined, undefined);
        var anySignature = createSignature(undefined, undefined, emptyArray, anyType, 0, false, false);
        var unknownSignature = createSignature(undefined, undefined, emptyArray, unknownType, 0, false, false);
        var globals = {};
        var globalArraySymbol;
        var globalObjectType;
        var globalFunctionType;
        var globalArrayType;
        var globalStringType;
        var globalNumberType;
        var globalBooleanType;
        var tupleTypes = {};
        var unionTypes = {};
        var stringLiteralTypes = {};
        var symbolLinks = [];
        var nodeLinks = [];
        var errors = [];
        var checker = {
            getSourceFile: getSourceFile,
            getSymbol: getSymbol,
            getExportedSymbols: getExportedSymbols,
            resolveEntityName: resolveEntityName,
            isExternalModuleNameRelative: isExternalModuleNameRelative,
            getResolvedExportSymbol: getResolvedExportSymbol,
            getTypeOfSymbol: getTypeOfSymbol,
            getInterfaceBaseTypeNodes: getInterfaceBaseTypeNodes,
            getDeclaredTypeOfSymbol: getDeclaredTypeOfSymbol,
            getPropertiesOfType: getPropertiesOfType,
            getPropertyOfType: getPropertyOfType,
            getSignaturesOfType: getSignaturesOfType,
            getIndexTypeOfObjectOrUnionType: getIndexTypeOfObjectOrUnionType,
            getIndexTypeOfType: getIndexTypeOfType,
            getReturnTypeOfSignature: getReturnTypeOfSignature,
            symbolToString: symbolToString,
            isTypeIdenticalTo: isTypeIdenticalTo,
            isTypeSubtypeOf: isTypeSubtypeOf,
            isTypeAssignableTo: isTypeAssignableTo,
            initializeGlobalTypes: initializeGlobalTypes,
            createSymbol: createSymbol,
            getGlobalArrayType: getGlobalArrayType,
            getErrors: getErrors,
            globals: globals
        };
        return checker;
        function getGlobalArrayType() {
            return globalArrayType;
        }
        function getErrors() {
            return errors;
        }
        function error(location, message, arg0, arg1, arg2) {
            errors.push(new reflect.Diagnostic(getSourceFile(location), message, arg0, arg1, arg2));
        }
        function getDeclarationOfKind(symbol, kind) {
            var declarations = symbol.declarations;
            for (var i = 0; i < declarations.length; i++) {
                var declaration = declarations[i];
                if (declaration.kind === kind) {
                    return declaration;
                }
            }
            return undefined;
        }
        function createSymbol(flags, name) {
            return new reflect.SymbolImpl(checker, flags, name);
        }
        function getSymbolLinks(symbol) {
            if (symbol.flags & 268435456 /* Transient */)
                return symbol;
            if (!symbol.id)
                symbol.id = nextSymbolId++;
            return symbolLinks[symbol.id] || (symbolLinks[symbol.id] = {});
        }
        function getNodeLinks(node) {
            if (!node.id)
                node.id = nextNodeId++;
            return nodeLinks[node.id] || (nodeLinks[node.id] = {});
        }
        function getSourceFile(node) {
            return getAncestor(node, 0 /* SourceFile */);
        }
        function isGlobalSourceFile(node) {
            return node.kind === 0 /* SourceFile */ && !isExternalModule(node);
        }
        function isExternalModule(file) {
            return (file.flags & 16384 /* ExternalModule */) !== 0;
        }
        function getSymbol(symbols, name, meaning) {
            if (meaning && reflect.hasProperty(symbols, name)) {
                var symbol = symbols[name];
                if (symbol.flags & meaning) {
                    return symbol;
                }
                if (symbol.flags & 33554432 /* Import */) {
                    var target = resolveImport(symbol);
                    // unknown symbol will mean that there were reported error during import resolution
                    // treat it as positive answer to avoid cascading errors
                    if (target === unknownSymbol || target.flags & meaning) {
                        return symbol;
                    }
                }
            }
            // return undefined if we can't find a symbol.
        }
        function getExportedSymbols(symbols, flags) {
            var matches = [];
            for (var name in symbols) {
                if (symbols.hasOwnProperty(name)) {
                    var symbol = symbols[name];
                    if (symbol.flags & flags) {
                        matches.push(symbol);
                    }
                    else if (symbol.flags & 33554432 /* Import */) {
                        symbol = resolveImport(symbol);
                        // unknown symbol indicates there were reported errors during import resolution.
                        if (symbol !== unknownSymbol && symbol.flags & flags) {
                            matches.push(symbol);
                        }
                    }
                }
            }
            return matches;
        }
        function resolveName(location, name, meaning) {
            var errorLocation = location;
            var result;
            var lastLocation;
            function returnResolvedSymbol(s) {
                if (!s) {
                    error(errorLocation, reflect.Diagnostics.Cannot_find_name_0, name);
                }
                return s;
            }
            while (location) {
                // Locals of a source file are not in scope (because they get merged into the global symbol table)
                if (location.locals && !isGlobalSourceFile(location)) {
                    if (result = getSymbol(location.locals, name, meaning)) {
                        return returnResolvedSymbol(result);
                    }
                }
                switch (location.kind) {
                    case 0 /* SourceFile */:
                        if (!isExternalModule(location))
                            break;
                    case 4 /* ModuleDeclaration */:
                        if (result = getSymbol(getSymbolOfNode(location).exports, name, meaning & 35653619 /* ModuleMember */)) {
                            return returnResolvedSymbol(result);
                        }
                        break;
                    case 3 /* EnumDeclaration */:
                        if (result = getSymbol(getSymbolOfNode(location).exports, name, meaning & 8 /* EnumMember */)) {
                            return returnResolvedSymbol(result);
                        }
                        break;
                    case 2 /* ClassDeclaration */:
                    case 1 /* InterfaceDeclaration */:
                        if (result = getSymbol(getSymbolOfNode(location).members, name, meaning & 3152352 /* Type */)) {
                            if (lastLocation && lastLocation.flags & 128 /* Static */) {
                                // TypeScript 1.0 spec (April 2014): 3.4.1
                                // The scope of a type parameter extends over the entire declaration
                                // with which the type parameter list is associated, with the exception of static member declarations in classes.
                                error(errorLocation, reflect.Diagnostics.Static_members_cannot_reference_class_type_parameters);
                                return undefined;
                            }
                            else {
                                return returnResolvedSymbol(result);
                            }
                        }
                        break;
                }
                lastLocation = location;
                location = location.parent;
            }
            if (result = getSymbol(globals, name, meaning)) {
                return returnResolvedSymbol(result);
            }
            return returnResolvedSymbol(undefined);
        }
        function resolveImport(symbol) {
            var links = getSymbolLinks(symbol);
            if (!links.target) {
                links.target = resolvingSymbol;
                var node = getDeclarationOfKind(symbol, 7 /* ImportDeclaration */);
                var target = node.require ? resolveExternalModuleName(node, node.require) : resolveEntityName(node, node.value, 107455 /* Value */ | 3152352 /* Type */ | 1536 /* Namespace */);
                if (links.target === resolvingSymbol) {
                    links.target = target || unknownSymbol;
                }
                else {
                    error(node, reflect.Diagnostics.Circular_definition_of_import_alias_0, symbol.name);
                }
            }
            else if (links.target === resolvingSymbol) {
                links.target = unknownSymbol;
            }
            return links.target;
        }
        function resolveEntityName(location, name, meaning) {
            if (!name) {
                return;
            }
            if (typeof name === "string") {
                return resolveEntityName(location, name.split('.'), meaning);
            }
            if (name.length == 1) {
                var symbol = resolveName(location, name[0], meaning);
                if (!symbol) {
                    return;
                }
            }
            else {
                var rightName = name.pop();
                var namespace = resolveEntityName(location, name, 1536 /* Namespace */);
                if (!namespace || namespace === unknownSymbol)
                    return;
                var symbol = getSymbol(namespace.exports, rightName, meaning);
                if (!symbol) {
                    error(location, reflect.Diagnostics.Module_0_has_no_exported_member_1, symbolToString(namespace), rightName);
                    return;
                }
            }
            return symbol.flags & meaning ? symbol : resolveImport(symbol);
        }
        function getFullyQualifiedName(symbol) {
            return symbol.parent ? getFullyQualifiedName(symbol.parent) + "." + symbolToString(symbol) : symbolToString(symbol);
        }
        function isExternalModuleNameRelative(moduleName) {
            // TypeScript 1.0 spec (April 2014): 11.2.1
            // An external module name is "relative" if the first term is "." or "..".
            return moduleName.substr(0, 2) === "./" || moduleName.substr(0, 3) === "../" || moduleName.substr(0, 2) === ".\\" || moduleName.substr(0, 3) === "..\\";
        }
        function resolveExternalModuleName(location, moduleName) {
            if (!moduleName)
                return;
            var searchPath = reflect.getDirectoryPath(getSourceFile(location).filename);
            var isRelative = isExternalModuleNameRelative(moduleName);
            if (!isRelative) {
                var symbol = getSymbol(globals, '"' + moduleName + '"', 512 /* ValueModule */);
                if (symbol) {
                    return getResolvedExportSymbol(symbol);
                }
            }
            while (true) {
                var filename = reflect.normalizePath(reflect.combinePaths(searchPath, moduleName));
                var sourceFile = loader.getLoadedSourceFile(filename + ".d.json");
                if (sourceFile || isRelative)
                    break;
                var parentPath = reflect.getDirectoryPath(searchPath);
                if (parentPath === searchPath)
                    break;
                searchPath = parentPath;
            }
            if (sourceFile) {
                if (sourceFile.symbol) {
                    return getResolvedExportSymbol(sourceFile.symbol);
                }
                error(location, reflect.Diagnostics.File_0_is_not_an_external_module, sourceFile.filename);
                return;
            }
            error(location, reflect.Diagnostics.Cannot_find_external_module_0, moduleName);
        }
        function getResolvedExportSymbol(moduleSymbol) {
            var symbol = getExportAssignmentSymbol(moduleSymbol);
            if (symbol) {
                if (symbol.flags & (107455 /* Value */ | 3152352 /* Type */ | 1536 /* Namespace */)) {
                    return symbol;
                }
                if (symbol.flags & 33554432 /* Import */) {
                    return resolveImport(symbol);
                }
            }
            return moduleSymbol;
        }
        function getExportAssignmentSymbol(symbol) {
            var symbolLinks = getSymbolLinks(symbol);
            if (!symbolLinks.exportAssignSymbol) {
                var block = getBlockWithExportAssignment(symbol);
                if (block) {
                    var meaning = 107455 /* Value */ | 3152352 /* Type */ | 1536 /* Namespace */;
                    var exportSymbol = resolveName(block, block.exportName, meaning);
                }
                symbolLinks.exportAssignSymbol = exportSymbol || unknownSymbol;
            }
            return symbolLinks.exportAssignSymbol === unknownSymbol ? undefined : symbolLinks.exportAssignSymbol;
        }
        function getBlockWithExportAssignment(symbol) {
            for (var i = 0, l = symbol.declarations.length; i < l; i++) {
                var block = symbol.declarations[i];
                if (block.exportName) {
                    return block;
                }
            }
            // return undefined if not found
        }
        function getSymbolOfNode(node) {
            return node.symbol;
        }
        function getParentOfSymbol(symbol) {
            return symbol.parent;
        }
        function symbolIsValue(symbol) {
            // If it is an instantiated symbol, then it is a value if the symbol it is an
            // instantiation of is a value.
            if (symbol.flags & 67108864 /* Instantiated */) {
                return symbolIsValue(getSymbolLinks(symbol).target);
            }
            // If the symbol has the value flag, it is trivially a value.
            if (symbol.flags & 107455 /* Value */) {
                return true;
            }
            // If it is an import, then it is a value if the symbol it resolves to is a value.
            if (symbol.flags & 33554432 /* Import */) {
                return (resolveImport(symbol).flags & 107455 /* Value */) !== 0;
            }
            return false;
        }
        function createType(flags) {
            var result = new reflect.TypeImpl(checker, flags);
            result.id = typeCount++;
            return result;
        }
        function createIntrinsicType(kind, intrinsicName) {
            var type = createType(kind);
            type.intrinsicName = intrinsicName;
            return type;
        }
        function createObjectType(kind, symbol) {
            var type = createType(kind);
            type.symbol = symbol;
            return type;
        }
        // A reserved member name starts with two underscores followed by a non-underscore
        function isReservedMemberName(name) {
            return name.charCodeAt(0) === 95 /* _ */ && name.charCodeAt(1) === 95 /* _ */ && name.charCodeAt(2) !== 95 /* _ */;
        }
        function getNamedMembers(members) {
            var result;
            for (var id in members) {
                if (reflect.hasProperty(members, id)) {
                    if (!isReservedMemberName(id)) {
                        if (!result)
                            result = [];
                        var symbol = members[id];
                        if (symbolIsValue(symbol)) {
                            result.push(symbol);
                        }
                    }
                }
            }
            return result || emptyArray;
        }
        function setObjectTypeMembers(type, members, callSignatures, constructSignatures, stringIndexType, numberIndexType) {
            type.members = members;
            type.properties = getNamedMembers(members);
            type.callSignatures = callSignatures;
            type.constructSignatures = constructSignatures;
            if (stringIndexType)
                type.stringIndexType = stringIndexType;
            if (numberIndexType)
                type.numberIndexType = numberIndexType;
            return type;
        }
        function createAnonymousType(symbol, members, callSignatures, constructSignatures, stringIndexType, numberIndexType) {
            return setObjectTypeMembers(createObjectType(32768 /* Anonymous */, symbol), members, callSignatures, constructSignatures, stringIndexType, numberIndexType);
        }
        function isOptionalProperty(propertySymbol) {
            //  class C {
            //      constructor(public x?) { }
            //  }
            //
            // x is an optional parameter, but it is a required property.
            return propertySymbol.valueDeclaration && hasQuestionToken(propertySymbol.valueDeclaration) && propertySymbol.valueDeclaration.kind !== 29 /* Parameter */;
        }
        function hasDotDotDotToken(node) {
            return node && node.kind === 29 /* Parameter */ && (node.flags & 65536 /* Rest */) !== 0;
        }
        function hasQuestionToken(node) {
            if (node) {
                switch (node.kind) {
                    case 29 /* Parameter */:
                    case 18 /* MethodSignature */:
                    case 16 /* PropertySignature */:
                        return (node.flags & 32768 /* QuestionMark */) !== 0;
                }
            }
            return false;
        }
        function getTypeOfPrototypeProperty(prototype) {
            // TypeScript 1.0 spec (April 2014): 8.4
            // Every class automatically contains a static property member named 'prototype',
            // the type of which is an instantiation of the class type with type Any supplied as a type argument for each type parameter.
            // It is an error to explicitly declare a static property member with the name 'prototype'.
            var classType = getDeclaredTypeOfSymbol(prototype.parent);
            return classType.typeParameters ? createTypeReference(classType, reflect.map(classType.typeParameters, function (_) { return anyType; })) : classType;
        }
        function getTypeOfVariableOrParameterOrPropertyDeclaration(declaration) {
            // Use type from type annotation if one is present
            if (declaration.type) {
                return getTypeFromTypeNode(declaration.type);
            }
            if (declaration.kind === 29 /* Parameter */) {
                var func = declaration.parent;
                // For a parameter of a set accessor, use the type of the get accessor if one is present
                if (func.kind === 15 /* SetAccessor */) {
                    var getter = getDeclarationOfKind(declaration.parent.symbol, 14 /* GetAccessor */);
                    if (getter) {
                        return getReturnTypeOfSignature(getSignatureFromDeclaration(getter));
                    }
                }
            }
            // Rest parameters default to type any[], other parameters default to type any
            var type = hasDotDotDotToken(declaration) ? createArrayType(anyType) : anyType;
            return type;
        }
        function getTypeOfVariableOrParameterOrProperty(symbol) {
            var links = getSymbolLinks(symbol);
            if (!links.type) {
                // Handle prototype property
                if (symbol.flags & 536870912 /* Prototype */) {
                    return links.type = getTypeOfPrototypeProperty(symbol);
                }
                var declaration = symbol.valueDeclaration;
                // Handle variable, parameter or property
                links.type = resolvingType;
                var type = getTypeOfVariableOrParameterOrPropertyDeclaration(declaration);
                if (links.type === resolvingType) {
                    links.type = type;
                }
            }
            else if (links.type === resolvingType) {
                links.type = anyType;
            }
            return links.type;
        }
        function getSetAccessorTypeAnnotationNode(accessor) {
            return accessor && accessor.parameter && accessor.parameter.type;
        }
        function getAnnotatedAccessorType(accessor) {
            if (accessor) {
                if (accessor.kind === 14 /* GetAccessor */) {
                    var getter = accessor;
                    return getter.returns && getTypeFromTypeNode(getter.returns);
                }
                else {
                    var setter = accessor;
                    var setterTypeAnnotation = getSetAccessorTypeAnnotationNode(setter);
                    return setterTypeAnnotation && getTypeFromTypeNode(setterTypeAnnotation);
                }
            }
            return undefined;
        }
        function getTypeOfAccessors(symbol) {
            var links = getSymbolLinks(symbol);
            checkAndStoreTypeOfAccessors(symbol, links);
            return links.type;
        }
        function checkAndStoreTypeOfAccessors(symbol, links) {
            links = links || getSymbolLinks(symbol);
            if (!links.type) {
                links.type = resolvingType;
                var getter = getDeclarationOfKind(symbol, 14 /* GetAccessor */);
                var setter = getDeclarationOfKind(symbol, 15 /* SetAccessor */);
                var type;
                // First try to see if the user specified a return type on the get-accessor.
                var getterReturnType = getAnnotatedAccessorType(getter);
                if (getterReturnType) {
                    type = getterReturnType;
                }
                else {
                    // If the user didn't specify a return type, try to use the set-accessor's parameter type.
                    var setterParameterType = getAnnotatedAccessorType(setter);
                    if (setterParameterType) {
                        type = setterParameterType;
                    }
                    else {
                        type = anyType;
                    }
                }
                if (links.type === resolvingType) {
                    links.type = type;
                }
            }
            else if (links.type === resolvingType) {
                links.type = anyType;
            }
        }
        function getTypeOfFuncClassEnumModule(symbol) {
            var links = getSymbolLinks(symbol);
            if (!links.type) {
                links.type = createObjectType(32768 /* Anonymous */, symbol);
            }
            return links.type;
        }
        function getTypeOfEnumMember(symbol) {
            var links = getSymbolLinks(symbol);
            if (!links.type) {
                links.type = getDeclaredTypeOfEnum(getParentOfSymbol(symbol));
            }
            return links.type;
        }
        function getTypeOfImport(symbol) {
            var links = getSymbolLinks(symbol);
            if (!links.type) {
                links.type = getTypeOfSymbol(resolveImport(symbol));
            }
            return links.type;
        }
        function getTypeOfInstantiatedSymbol(symbol) {
            var links = getSymbolLinks(symbol);
            if (!links.type) {
                links.type = instantiateType(getTypeOfSymbol(links.target), links.mapper);
            }
            return links.type;
        }
        function getTypeOfSymbol(symbol) {
            if (symbol.flags & 67108864 /* Instantiated */) {
                return getTypeOfInstantiatedSymbol(symbol);
            }
            if (symbol.flags & (3 /* Variable */ | 4 /* Property */)) {
                return getTypeOfVariableOrParameterOrProperty(symbol);
            }
            if (symbol.flags & (16 /* Function */ | 8192 /* Method */ | 32 /* Class */ | 384 /* Enum */ | 512 /* ValueModule */)) {
                return getTypeOfFuncClassEnumModule(symbol);
            }
            if (symbol.flags & 8 /* EnumMember */) {
                return getTypeOfEnumMember(symbol);
            }
            if (symbol.flags & 98304 /* Accessor */) {
                return getTypeOfAccessors(symbol);
            }
            if (symbol.flags & 33554432 /* Import */) {
                return getTypeOfImport(symbol);
            }
            return unknownType;
        }
        function getTargetType(type) {
            return type.flags & 4096 /* Reference */ ? type.target : type;
        }
        function hasBaseType(type, checkBase) {
            return check(type);
            function check(type) {
                var target = getTargetType(type);
                return target === checkBase || reflect.forEach(target.baseTypes, check);
            }
        }
        // Return combined list of type parameters from all declarations of a class or interface. Elsewhere we check they're all
        // the same, but even if they're not we still need the complete list to ensure instantiations supply type arguments
        // for all type parameters.
        function getTypeParametersOfClassOrInterface(symbol) {
            var result;
            reflect.forEach(symbol.declarations, function (node) {
                if (node.kind === 1 /* InterfaceDeclaration */ || node.kind === 2 /* ClassDeclaration */) {
                    var declaration = node;
                    if (declaration.typeParameters && declaration.typeParameters.length) {
                        reflect.forEach(declaration.typeParameters, function (node) {
                            var tp = getDeclaredTypeOfTypeParameter(getSymbolOfNode(node));
                            if (!result) {
                                result = [tp];
                            }
                            else if (!reflect.contains(result, tp)) {
                                result.push(tp);
                            }
                        });
                    }
                }
            });
            return result;
        }
        function getDeclaredTypeOfClass(symbol) {
            var links = getSymbolLinks(symbol);
            if (!links.declaredType) {
                var type = links.declaredType = createObjectType(1024 /* Class */, symbol);
                var typeParameters = getTypeParametersOfClassOrInterface(symbol);
                if (typeParameters) {
                    type.flags |= 4096 /* Reference */;
                    type.typeParameters = typeParameters;
                    type.instantiations = {};
                    type.instantiations[getTypeListId(type.typeParameters)] = type;
                    type.target = type;
                    type.typeArguments = type.typeParameters;
                }
                type.baseTypes = [];
                var declaration = getDeclarationOfKind(symbol, 2 /* ClassDeclaration */);
                var baseTypeNode = getClassBaseTypeNode(declaration);
                if (baseTypeNode) {
                    var baseType = getTypeFromTypeReferenceNode(baseTypeNode);
                    if (baseType !== unknownType) {
                        if (getTargetType(baseType).flags & 1024 /* Class */) {
                            if (type !== baseType && !hasBaseType(baseType, type)) {
                                type.baseTypes.push(baseType);
                            }
                            else {
                                error(declaration, reflect.Diagnostics.Type_0_recursively_references_itself_as_a_base_type, typeToString(type));
                            }
                        }
                        else {
                            error(baseTypeNode, reflect.Diagnostics.A_class_may_only_extend_another_class);
                        }
                    }
                    // Add interfaces to baseTypes array. This is different than what TypeScript does but I want to be able to
                    // check for explicitly implemented interfaces.
                    reflect.forEach(declaration.implements, function (node) {
                        var baseType = getTypeFromTypeReferenceNode(node);
                        if (baseType !== unknownType) {
                            if (getTargetType(baseType).flags & (1024 /* Class */ | 2048 /* Interface */)) {
                                if (type !== baseType && !hasBaseType(baseType, type)) {
                                    type.baseTypes.push(baseType);
                                }
                                else {
                                    error(declaration, reflect.Diagnostics.Type_0_recursively_references_itself_as_a_base_type, typeToString(type));
                                }
                            }
                            else {
                                error(node, reflect.Diagnostics.An_interface_may_only_extend_a_class_or_another_interface);
                            }
                        }
                    });
                }
                type.declaredProperties = getNamedMembers(symbol.members);
                type.declaredCallSignatures = emptyArray;
                type.declaredConstructSignatures = emptyArray;
                type.declaredStringIndexType = getIndexTypeOfSymbol(symbol, 0 /* String */);
                type.declaredNumberIndexType = getIndexTypeOfSymbol(symbol, 1 /* Number */);
            }
            return links.declaredType;
        }
        function getClassBaseTypeNode(node) {
            return node.extends;
        }
        function getInterfaceBaseTypeNodes(node) {
            return node.extends;
        }
        function getDeclaredTypeOfInterface(symbol) {
            var links = getSymbolLinks(symbol);
            if (!links.declaredType) {
                var type = links.declaredType = createObjectType(2048 /* Interface */, symbol);
                var typeParameters = getTypeParametersOfClassOrInterface(symbol);
                if (typeParameters) {
                    type.flags |= 4096 /* Reference */;
                    type.typeParameters = typeParameters;
                    type.instantiations = {};
                    type.instantiations[getTypeListId(type.typeParameters)] = type;
                    type.target = type;
                    type.typeArguments = type.typeParameters;
                }
                type.baseTypes = [];
                reflect.forEach(symbol.declarations, function (declaration) {
                    if (declaration.kind === 1 /* InterfaceDeclaration */ && getInterfaceBaseTypeNodes(declaration)) {
                        reflect.forEach(getInterfaceBaseTypeNodes(declaration), function (node) {
                            var baseType = getTypeFromTypeReferenceNode(node);
                            if (baseType !== unknownType) {
                                if (getTargetType(baseType).flags & (1024 /* Class */ | 2048 /* Interface */)) {
                                    if (type !== baseType && !hasBaseType(baseType, type)) {
                                        type.baseTypes.push(baseType);
                                    }
                                    else {
                                        error(declaration, reflect.Diagnostics.Type_0_recursively_references_itself_as_a_base_type, typeToString(type));
                                    }
                                }
                                else {
                                    error(node, reflect.Diagnostics.An_interface_may_only_extend_a_class_or_another_interface);
                                }
                            }
                        });
                    }
                });
                type.declaredProperties = getNamedMembers(symbol.members);
                type.declaredCallSignatures = getSignaturesOfSymbol(symbol.members["__call"]);
                type.declaredConstructSignatures = getSignaturesOfSymbol(symbol.members["__new"]);
                type.declaredStringIndexType = getIndexTypeOfSymbol(symbol, 0 /* String */);
                type.declaredNumberIndexType = getIndexTypeOfSymbol(symbol, 1 /* Number */);
            }
            return links.declaredType;
        }
        function getDeclaredTypeOfTypeAlias(symbol) {
            var links = getSymbolLinks(symbol);
            if (!links.declaredType) {
                links.declaredType = resolvingType;
                var declaration = getDeclarationOfKind(symbol, 8 /* TypeAliasDeclaration */);
                var type = getTypeFromTypeNode(declaration.type);
                if (links.declaredType === resolvingType) {
                    links.declaredType = type;
                }
            }
            else if (links.declaredType === resolvingType) {
                links.declaredType = unknownType;
                var declaration = getDeclarationOfKind(symbol, 8 /* TypeAliasDeclaration */);
                error(declaration, reflect.Diagnostics.Type_alias_0_circularly_references_itself, symbolToString(symbol));
            }
            return links.declaredType;
        }
        function getDeclaredTypeOfEnum(symbol) {
            var links = getSymbolLinks(symbol);
            if (!links.declaredType) {
                var type = createType(128 /* Enum */);
                type.symbol = symbol;
                links.declaredType = type;
            }
            return links.declaredType;
        }
        function getDeclaredTypeOfTypeParameter(symbol) {
            var links = getSymbolLinks(symbol);
            if (!links.declaredType) {
                var type = createType(512 /* TypeParameter */);
                type.symbol = symbol;
                if (!getDeclarationOfKind(symbol, 30 /* TypeParameter */).constraint) {
                    type.constraint = noConstraintType;
                }
                links.declaredType = type;
            }
            return links.declaredType;
        }
        function getDeclaredTypeOfImport(symbol) {
            var links = getSymbolLinks(symbol);
            if (!links.declaredType) {
                links.declaredType = getDeclaredTypeOfSymbol(resolveImport(symbol));
            }
            return links.declaredType;
        }
        function getDeclaredTypeOfSymbol(symbol) {
            if (symbol.flags & 32 /* Class */) {
                return getDeclaredTypeOfClass(symbol);
            }
            if (symbol.flags & 64 /* Interface */) {
                return getDeclaredTypeOfInterface(symbol);
            }
            if (symbol.flags & 2097152 /* TypeAlias */) {
                return getDeclaredTypeOfTypeAlias(symbol);
            }
            if (symbol.flags & 384 /* Enum */) {
                return getDeclaredTypeOfEnum(symbol);
            }
            if (symbol.flags & 1048576 /* TypeParameter */) {
                return getDeclaredTypeOfTypeParameter(symbol);
            }
            if (symbol.flags & 33554432 /* Import */) {
                return getDeclaredTypeOfImport(symbol);
            }
            return unknownType;
        }
        function createSymbolTable(symbols) {
            var result = {};
            for (var i = 0; i < symbols.length; i++) {
                var symbol = symbols[i];
                result[symbol.name] = symbol;
            }
            return result;
        }
        function createInstantiatedSymbolTable(symbols, mapper) {
            var result = {};
            for (var i = 0; i < symbols.length; i++) {
                var symbol = symbols[i];
                result[symbol.name] = instantiateSymbol(symbol, mapper);
            }
            return result;
        }
        function addInheritedMembers(symbols, baseSymbols) {
            for (var i = 0; i < baseSymbols.length; i++) {
                var s = baseSymbols[i];
                if (!reflect.hasProperty(symbols, s.name)) {
                    symbols[s.name] = s;
                }
            }
        }
        function resolveClassOrInterfaceMembers(type) {
            var members = type.symbol.members;
            var callSignatures = type.declaredCallSignatures;
            var constructSignatures = type.declaredConstructSignatures;
            var stringIndexType = type.declaredStringIndexType;
            var numberIndexType = type.declaredNumberIndexType;
            if (type.baseTypes.length) {
                members = createSymbolTable(type.declaredProperties);
                reflect.forEach(type.baseTypes, function (baseType) {
                    addInheritedMembers(members, getPropertiesOfObjectType(baseType));
                    callSignatures = reflect.concatenate(callSignatures, getSignaturesOfType(baseType, 0 /* Call */));
                    constructSignatures = reflect.concatenate(constructSignatures, getSignaturesOfType(baseType, 1 /* Construct */));
                    stringIndexType = stringIndexType || getIndexTypeOfType(baseType, 0 /* String */);
                    numberIndexType = numberIndexType || getIndexTypeOfType(baseType, 1 /* Number */);
                });
            }
            setObjectTypeMembers(type, members, callSignatures, constructSignatures, stringIndexType, numberIndexType);
        }
        function resolveTypeReferenceMembers(type) {
            var target = type.target;
            var mapper = createTypeMapper(target.typeParameters, type.typeArguments);
            var members = createInstantiatedSymbolTable(target.declaredProperties, mapper);
            var callSignatures = instantiateList(target.declaredCallSignatures, mapper, instantiateSignature);
            var constructSignatures = instantiateList(target.declaredConstructSignatures, mapper, instantiateSignature);
            var stringIndexType = target.declaredStringIndexType ? instantiateType(target.declaredStringIndexType, mapper) : undefined;
            var numberIndexType = target.declaredNumberIndexType ? instantiateType(target.declaredNumberIndexType, mapper) : undefined;
            reflect.forEach(target.baseTypes, function (baseType) {
                var instantiatedBaseType = instantiateType(baseType, mapper);
                addInheritedMembers(members, getPropertiesOfObjectType(instantiatedBaseType));
                callSignatures = reflect.concatenate(callSignatures, getSignaturesOfType(instantiatedBaseType, 0 /* Call */));
                constructSignatures = reflect.concatenate(constructSignatures, getSignaturesOfType(instantiatedBaseType, 1 /* Construct */));
                stringIndexType = stringIndexType || getIndexTypeOfType(instantiatedBaseType, 0 /* String */);
                numberIndexType = numberIndexType || getIndexTypeOfType(instantiatedBaseType, 1 /* Number */);
            });
            setObjectTypeMembers(type, members, callSignatures, constructSignatures, stringIndexType, numberIndexType);
        }
        function createSignature(declaration, typeParameters, parameters, resolvedReturnType, minArgumentCount, hasRestParameter, hasStringLiterals) {
            var sig = new reflect.SignatureImpl(checker);
            sig.declaration = declaration;
            sig.typeParameters = typeParameters;
            sig.parameters = parameters;
            sig.resolvedReturnType = resolvedReturnType;
            sig.minArgumentCount = minArgumentCount;
            sig.hasRestParameter = hasRestParameter;
            sig.hasStringLiterals = hasStringLiterals;
            return sig;
        }
        function cloneSignature(sig) {
            return createSignature(sig.declaration, sig.typeParameters, sig.parameters, sig.resolvedReturnType, sig.minArgumentCount, sig.hasRestParameter, sig.hasStringLiterals);
        }
        function getDefaultConstructSignatures(classType) {
            if (classType.baseTypes.length) {
                var baseType = classType.baseTypes[0];
                var baseSignatures = getSignaturesOfType(getTypeOfSymbol(baseType.symbol), 1 /* Construct */);
                return reflect.map(baseSignatures, function (baseSignature) {
                    var signature = baseType.flags & 4096 /* Reference */ ? getSignatureInstantiation(baseSignature, baseType.typeArguments) : cloneSignature(baseSignature);
                    signature.typeParameters = classType.typeParameters;
                    signature.resolvedReturnType = classType;
                    return signature;
                });
            }
            return [createSignature(undefined, classType.typeParameters, emptyArray, classType, 0, false, false)];
        }
        function createTupleTypeMemberSymbols(memberTypes) {
            var members = {};
            for (var i = 0; i < memberTypes.length; i++) {
                var symbol = createSymbol(4 /* Property */ | 268435456 /* Transient */, "" + i);
                symbol.type = memberTypes[i];
                members[i] = symbol;
            }
            return members;
        }
        function resolveTupleTypeMembers(type) {
            var arrayType = resolveObjectOrUnionTypeMembers(createArrayType(getUnionType(type.elementTypes)));
            var members = createTupleTypeMemberSymbols(type.elementTypes);
            addInheritedMembers(members, arrayType.properties);
            setObjectTypeMembers(type, members, arrayType.callSignatures, arrayType.constructSignatures, arrayType.stringIndexType, arrayType.numberIndexType);
        }
        function signatureListsIdentical(s, t) {
            if (s.length !== t.length) {
                return false;
            }
            for (var i = 0; i < s.length; i++) {
                if (!compareSignatures(s[i], t[i], false, compareTypes)) {
                    return false;
                }
            }
            return true;
        }
        // If the lists of call or construct signatures in the given types are all identical except for return types,
        // and if none of the signatures are generic, return a list of signatures that has substitutes a union of the
        // return types of the corresponding signatures in each resulting signature.
        function getUnionSignatures(types, kind) {
            var signatureLists = reflect.map(types, function (t) { return getSignaturesOfType(t, kind); });
            var signatures = signatureLists[0];
            for (var i = 0; i < signatures.length; i++) {
                if (signatures[i].typeParameters) {
                    return emptyArray;
                }
            }
            for (var i = 1; i < signatureLists.length; i++) {
                if (!signatureListsIdentical(signatures, signatureLists[i])) {
                    return emptyArray;
                }
            }
            var result = reflect.map(signatures, cloneSignature);
            for (var i = 0; i < result.length; i++) {
                var s = result[i];
                // Clear resolved return type we possibly got from cloneSignature
                s.resolvedReturnType = undefined;
                s.unionSignatures = reflect.map(signatureLists, function (signatures) { return signatures[i]; });
            }
            return result;
        }
        function getUnionIndexType(types, kind) {
            var indexTypes = [];
            for (var i = 0; i < types.length; i++) {
                var indexType = getIndexTypeOfType(types[i], kind);
                if (!indexType) {
                    return undefined;
                }
                indexTypes.push(indexType);
            }
            return getUnionType(indexTypes);
        }
        function resolveUnionTypeMembers(type) {
            // The members and properties collections are empty for union types. To get all properties of a union
            // type use getPropertiesOfType (only the language service uses this).
            var callSignatures = getUnionSignatures(type.types, 0 /* Call */);
            var constructSignatures = getUnionSignatures(type.types, 1 /* Construct */);
            var stringIndexType = getUnionIndexType(type.types, 0 /* String */);
            var numberIndexType = getUnionIndexType(type.types, 1 /* Number */);
            setObjectTypeMembers(type, emptySymbols, callSignatures, constructSignatures, stringIndexType, numberIndexType);
        }
        function resolveAnonymousTypeMembers(type) {
            var symbol = type.symbol;
            if (symbol.flags & 2048 /* TypeLiteral */) {
                var members = symbol.members;
                var callSignatures = getSignaturesOfSymbol(members["__call"]);
                var constructSignatures = getSignaturesOfSymbol(members["__new"]);
                var stringIndexType = getIndexTypeOfSymbol(symbol, 0 /* String */);
                var numberIndexType = getIndexTypeOfSymbol(symbol, 1 /* Number */);
            }
            else {
                // Combinations of function, class, enum and module
                var members = emptySymbols;
                var callSignatures = emptyArray;
                var constructSignatures = emptyArray;
                if (symbol.flags & 1952 /* HasExports */) {
                    members = symbol.exports;
                }
                if (symbol.flags & (16 /* Function */ | 8192 /* Method */)) {
                    callSignatures = getSignaturesOfSymbol(symbol);
                }
                if (symbol.flags & 32 /* Class */) {
                    var classType = getDeclaredTypeOfClass(symbol);
                    constructSignatures = getSignaturesOfSymbol(symbol.members["__constructor"]);
                    if (!constructSignatures.length) {
                        constructSignatures = getDefaultConstructSignatures(classType);
                    }
                    if (classType.baseTypes.length) {
                        members = createSymbolTable(getNamedMembers(members));
                        addInheritedMembers(members, getPropertiesOfObjectType(getTypeOfSymbol(classType.baseTypes[0].symbol)));
                    }
                }
                var stringIndexType = undefined;
                var numberIndexType = (symbol.flags & 384 /* Enum */) ? stringType : undefined;
            }
            setObjectTypeMembers(type, members, callSignatures, constructSignatures, stringIndexType, numberIndexType);
        }
        function resolveObjectOrUnionTypeMembers(type) {
            if (!type.members) {
                if (type.flags & (1024 /* Class */ | 2048 /* Interface */)) {
                    resolveClassOrInterfaceMembers(type);
                }
                else if (type.flags & 32768 /* Anonymous */) {
                    resolveAnonymousTypeMembers(type);
                }
                else if (type.flags & 8192 /* Tuple */) {
                    resolveTupleTypeMembers(type);
                }
                else if (type.flags & 16384 /* Union */) {
                    resolveUnionTypeMembers(type);
                }
                else {
                    resolveTypeReferenceMembers(type);
                }
            }
            return type;
        }
        // Return properties of an object type or an empty array for other types
        function getPropertiesOfObjectType(type) {
            if (type.flags & 48128 /* ObjectType */) {
                return resolveObjectOrUnionTypeMembers(type).properties;
            }
            return emptyArray;
        }
        // If the given type is an object type and that type has a property by the given name, return
        // the symbol for that property. Otherwise return undefined.
        function getPropertyOfObjectType(type, name) {
            if (type.flags & 48128 /* ObjectType */) {
                var resolved = resolveObjectOrUnionTypeMembers(type);
                if (reflect.hasProperty(resolved.members, name)) {
                    var symbol = resolved.members[name];
                    if (symbolIsValue(symbol)) {
                        return symbol;
                    }
                }
            }
        }
        function getPropertiesOfUnionType(type) {
            var result = [];
            reflect.forEach(getPropertiesOfType(type.types[0]), function (prop) {
                var unionProp = getPropertyOfUnionType(type, prop.name);
                if (unionProp) {
                    result.push(unionProp);
                }
            });
            return result;
        }
        function getPropertiesOfType(type) {
            if (type.flags & 16384 /* Union */) {
                return getPropertiesOfUnionType(type);
            }
            return getPropertiesOfObjectType(getApparentType(type));
        }
        // For a type parameter, return the base constraint of the type parameter. For the string, number, and
        // boolean primitive types, return the corresponding object types.Otherwise return the type itself.
        // Note that the apparent type of a union type is the union type itself.
        function getApparentType(type) {
            if (type.flags & 512 /* TypeParameter */) {
                do {
                    type = getConstraintOfTypeParameter(type);
                } while (type && type.flags & 512 /* TypeParameter */);
                if (!type) {
                    type = emptyObjectType;
                }
            }
            if (type.flags & 258 /* StringLike */) {
                type = globalStringType;
            }
            else if (type.flags & 132 /* NumberLike */) {
                type = globalNumberType;
            }
            else if (type.flags & 8 /* Boolean */) {
                type = globalBooleanType;
            }
            return type;
        }
        function createUnionProperty(unionType, name) {
            var types = unionType.types;
            var props;
            for (var i = 0; i < types.length; i++) {
                var type = getApparentType(types[i]);
                if (type !== unknownType) {
                    var prop = getPropertyOfType(type, name);
                    if (!prop) {
                        return undefined;
                    }
                    if (!props) {
                        props = [prop];
                    }
                    else {
                        props.push(prop);
                    }
                }
            }
            var propTypes = [];
            var declarations = [];
            for (var i = 0; i < props.length; i++) {
                var prop = props[i];
                if (prop.declarations) {
                    declarations.push.apply(declarations, prop.declarations);
                }
                propTypes.push(getTypeOfSymbol(prop));
            }
            var result = createSymbol(4 /* Property */ | 268435456 /* Transient */ | 1073741824 /* UnionProperty */, name);
            result.unionType = unionType;
            result.declarations = declarations;
            result.type = getUnionType(propTypes);
            return result;
        }
        function getPropertyOfUnionType(type, name) {
            var properties = type.resolvedProperties || (type.resolvedProperties = {});
            if (reflect.hasProperty(properties, name)) {
                return properties[name];
            }
            var property = createUnionProperty(type, name);
            if (property) {
                properties[name] = property;
            }
            return property;
        }
        // Return the symbol for the property with the given name in the given type. Creates synthetic union properties when
        // necessary, maps primitive types and type parameters are to their apparent types, and augments with properties from
        // Object and Function as appropriate.
        function getPropertyOfType(type, name) {
            if (type.flags & 16384 /* Union */) {
                return getPropertyOfUnionType(type, name);
            }
            if (!(type.flags & 48128 /* ObjectType */)) {
                type = getApparentType(type);
                if (!(type.flags & 48128 /* ObjectType */)) {
                    return undefined;
                }
            }
            var resolved = resolveObjectOrUnionTypeMembers(type);
            if (reflect.hasProperty(resolved.members, name)) {
                var symbol = resolved.members[name];
                if (symbolIsValue(symbol)) {
                    return symbol;
                }
            }
            if (resolved === anyFunctionType || resolved.callSignatures.length || resolved.constructSignatures.length) {
                var symbol = getPropertyOfObjectType(globalFunctionType, name);
                if (symbol)
                    return symbol;
            }
            return getPropertyOfObjectType(globalObjectType, name);
        }
        function getSignaturesOfObjectOrUnionType(type, kind) {
            if (type.flags & (48128 /* ObjectType */ | 16384 /* Union */)) {
                var resolved = resolveObjectOrUnionTypeMembers(type);
                return kind === 0 /* Call */ ? resolved.callSignatures : resolved.constructSignatures;
            }
            return emptyArray;
        }
        // Return the signatures of the given kind in the given type. Creates synthetic union signatures when necessary and
        // maps primitive types and type parameters are to their apparent types.
        function getSignaturesOfType(type, kind) {
            return getSignaturesOfObjectOrUnionType(getApparentType(type), kind);
        }
        function getIndexTypeOfObjectOrUnionType(type, kind) {
            if (type.flags & (48128 /* ObjectType */ | 16384 /* Union */)) {
                var resolved = resolveObjectOrUnionTypeMembers(type);
                return kind === 0 /* String */ ? resolved.stringIndexType : resolved.numberIndexType;
            }
        }
        // Return the index type of the given kind in the given type. Creates synthetic union index types when necessary and
        // maps primitive types and type parameters are to their apparent types.
        function getIndexTypeOfType(type, kind) {
            return getIndexTypeOfObjectOrUnionType(getApparentType(type), kind);
        }
        // Return list of type parameters with duplicates removed (duplicate identifier errors are generated in the actual
        // type checking functions).
        function getTypeParametersFromDeclaration(typeParameterDeclarations) {
            var result = [];
            reflect.forEach(typeParameterDeclarations, function (node) {
                var tp = getDeclaredTypeOfTypeParameter(node.symbol);
                if (!reflect.contains(result, tp)) {
                    result.push(tp);
                }
            });
            return result;
        }
        function getSignatureFromDeclaration(declaration) {
            var links = getNodeLinks(declaration);
            if (!links.resolvedSignature) {
                var classType = declaration.kind === 13 /* Constructor */ ? getDeclaredTypeOfClass(declaration.parent.symbol) : undefined;
                var typeParameters = classType ? classType.typeParameters : declaration.typeParameters ? getTypeParametersFromDeclaration(declaration.typeParameters) : undefined;
                var parameters = [];
                var hasStringLiterals = false;
                var minArgumentCount = -1;
                for (var i = 0, n = declaration.parameters.length; i < n; i++) {
                    var param = declaration.parameters[i];
                    parameters.push(param.symbol);
                    if (param.type && param.type.kind === 26 /* StringLiteral */) {
                        hasStringLiterals = true;
                    }
                    if (minArgumentCount < 0) {
                        if (param.flags & (32768 /* QuestionMark */ | 65536 /* Rest */)) {
                            minArgumentCount = i;
                        }
                    }
                }
                if (minArgumentCount < 0) {
                    minArgumentCount = declaration.parameters.length;
                }
                var returnType;
                if (classType) {
                    returnType = classType;
                }
                else if (declaration.returns) {
                    returnType = getTypeFromTypeNode(declaration.returns);
                }
                else {
                    // TypeScript 1.0 spec (April 2014):
                    // If only one accessor includes a type annotation, the other behaves as if it had the same type annotation.
                    if (declaration.kind === 14 /* GetAccessor */) {
                        var setter = getDeclarationOfKind(declaration.symbol, 15 /* SetAccessor */);
                        returnType = getAnnotatedAccessorType(setter);
                    }
                    if (!returnType) {
                        returnType = anyType;
                    }
                }
                links.resolvedSignature = createSignature(declaration, typeParameters, parameters, returnType, minArgumentCount, hasRestParameters(declaration), hasStringLiterals);
            }
            return links.resolvedSignature;
        }
        function hasRestParameters(s) {
            return s.parameters.length > 0 && (s.parameters[s.parameters.length - 1].flags & 65536 /* Rest */) !== 0;
        }
        function getSignaturesOfSymbol(symbol) {
            if (!symbol)
                return emptyArray;
            var result = [];
            for (var i = 0, len = symbol.declarations.length; i < len; i++) {
                var node = symbol.declarations[i];
                switch (node.kind) {
                    case 21 /* FunctionType */:
                    case 23 /* ConstructorType */:
                    case 5 /* FunctionDeclaration */:
                    case 12 /* Method */:
                    case 18 /* MethodSignature */:
                    case 13 /* Constructor */:
                    case 20 /* CallSignature */:
                    case 17 /* ConstructSignature */:
                    case 19 /* IndexSignature */:
                    case 14 /* GetAccessor */:
                    case 15 /* SetAccessor */:
                        result.push(getSignatureFromDeclaration(node));
                }
            }
            return result;
        }
        function getReturnTypeOfSignature(signature) {
            if (!signature.resolvedReturnType) {
                signature.resolvedReturnType = resolvingType;
                if (signature.target) {
                    var type = instantiateType(getReturnTypeOfSignature(signature.target), signature.mapper);
                }
                else if (signature.unionSignatures) {
                    var type = getUnionType(reflect.map(signature.unionSignatures, getReturnTypeOfSignature));
                }
                if (signature.resolvedReturnType === resolvingType) {
                    signature.resolvedReturnType = type;
                }
            }
            else if (signature.resolvedReturnType === resolvingType) {
                signature.resolvedReturnType = anyType;
            }
            return signature.resolvedReturnType;
        }
        function getRestTypeOfSignature(signature) {
            if (signature.hasRestParameter) {
                var type = getTypeOfSymbol(signature.parameters[signature.parameters.length - 1]);
                if (type.flags & 4096 /* Reference */ && type.target === globalArrayType) {
                    return type.typeArguments[0];
                }
            }
            return anyType;
        }
        function getSignatureInstantiation(signature, typeArguments) {
            return instantiateSignature(signature, createTypeMapper(signature.typeParameters, typeArguments), true);
        }
        function getErasedSignature(signature) {
            if (!signature.typeParameters)
                return signature;
            if (!signature.erasedSignatureCache) {
                if (signature.target) {
                    signature.erasedSignatureCache = instantiateSignature(getErasedSignature(signature.target), signature.mapper);
                }
                else {
                    signature.erasedSignatureCache = instantiateSignature(signature, createTypeEraser(signature.typeParameters), true);
                }
            }
            return signature.erasedSignatureCache;
        }
        function getIndexSymbol(symbol) {
            return symbol.members["__index"];
        }
        function getIndexDeclarationOfSymbol(symbol, kind) {
            var typeName = kind === 1 /* Number */ ? "number" : "string";
            var indexSymbol = getIndexSymbol(symbol);
            if (indexSymbol) {
                var len = indexSymbol.declarations.length;
                for (var i = 0; i < len; i++) {
                    var node = indexSymbol.declarations[i];
                    if (node.parameter) {
                        var parameter = node.parameter;
                        if (parameter && parameter.type && parameter.type.kind === 25 /* TypeReference */) {
                            var reference = parameter.type;
                            if (reference.type === typeName) {
                                return node;
                            }
                        }
                    }
                }
            }
            return undefined;
        }
        function getIndexTypeOfSymbol(symbol, kind) {
            var declaration = getIndexDeclarationOfSymbol(symbol, kind);
            return declaration ? declaration.returns ? getTypeFromTypeNode(declaration.returns) : anyType : undefined;
        }
        function getConstraintOfTypeParameter(type) {
            if (!type.constraint) {
                if (type.target) {
                    var targetConstraint = getConstraintOfTypeParameter(type.target);
                    type.constraint = targetConstraint ? instantiateType(targetConstraint, type.mapper) : noConstraintType;
                }
                else {
                    type.constraint = getTypeFromTypeNode(getDeclarationOfKind(type.symbol, 30 /* TypeParameter */).constraint);
                }
            }
            return type.constraint === noConstraintType ? undefined : type.constraint;
        }
        function getTypeListId(types) {
            switch (types.length) {
                case 1:
                    return "" + types[0].id;
                case 2:
                    return types[0].id + "," + types[1].id;
                default:
                    var result = "";
                    for (var i = 0; i < types.length; i++) {
                        if (i > 0)
                            result += ",";
                        result += types[i].id;
                    }
                    return result;
            }
        }
        function createTypeReference(target, typeArguments) {
            var id = getTypeListId(typeArguments);
            var type = target.instantiations[id];
            if (!type) {
                type = target.instantiations[id] = createObjectType(4096 /* Reference */, target.symbol);
                type.target = target;
                type.typeArguments = typeArguments;
            }
            return type;
        }
        function getTypeFromTypeReferenceNode(node) {
            var links = getNodeLinks(node);
            if (!links.resolvedType) {
                switch (node.type) {
                    case 'any':
                        return anyType;
                    case 'string':
                        return stringType;
                    case 'number':
                        return numberType;
                    case 'boolean':
                        return booleanType;
                    case 'void':
                        return voidType;
                    default:
                        var symbol = resolveEntityName(node, node.type, 3152352 /* Type */);
                        if (symbol) {
                            var type = getDeclaredTypeOfSymbol(symbol);
                            if (type.flags & (1024 /* Class */ | 2048 /* Interface */) && type.flags & 4096 /* Reference */) {
                                var typeParameters = type.typeParameters;
                                if (node.arguments && node.arguments.length === typeParameters.length) {
                                    type = createTypeReference(type, reflect.map(node.arguments, function (t) { return getTypeFromTypeNode(t); }));
                                }
                                else {
                                    error(node, reflect.Diagnostics.Generic_type_0_requires_1_type_argument_s, symbol.name, typeParameters.length);
                                    type = undefined;
                                }
                            }
                            else {
                                if (node.arguments) {
                                    error(node, reflect.Diagnostics.Type_0_is_not_generic, symbol.name);
                                    type = undefined;
                                }
                            }
                        }
                        break;
                }
                links.resolvedType = type || unknownType;
            }
            return links.resolvedType;
        }
        function getTypeOfGlobalSymbol(symbol, arity) {
            if (!symbol) {
                return emptyObjectType;
            }
            return getDeclaredTypeOfSymbol(symbol);
        }
        function getGlobalSymbol(name) {
            return resolveName(undefined, name, 3152352 /* Type */);
        }
        function getGlobalType(name) {
            return getTypeOfGlobalSymbol(getGlobalSymbol(name), 0);
        }
        function createArrayType(elementType) {
            // globalArrayType will be undefined if we get here during creation of the Array type. This for example happens if
            // user code augments the Array type with call or construct signatures that have an array type as the return type.
            // We instead use globalArraySymbol to obtain the (not yet fully constructed) Array type.
            var arrayType = globalArrayType || getDeclaredTypeOfSymbol(globalArraySymbol);
            return arrayType !== emptyObjectType ? createTypeReference(arrayType, [elementType]) : emptyObjectType;
        }
        function getTypeFromArrayTypeNode(node) {
            var links = getNodeLinks(node);
            if (!links.resolvedType) {
                links.resolvedType = createArrayType(getTypeFromTypeNode(node.type));
            }
            return links.resolvedType;
        }
        function createTupleType(elementTypes) {
            var id = getTypeListId(elementTypes);
            var type = tupleTypes[id];
            if (!type) {
                type = tupleTypes[id] = createObjectType(8192 /* Tuple */);
                type.elementTypes = elementTypes;
            }
            return type;
        }
        function getTypeFromTupleTypeNode(node) {
            var links = getNodeLinks(node);
            if (!links.resolvedType) {
                links.resolvedType = createTupleType(reflect.map(node.types, getTypeFromTypeNode));
            }
            return links.resolvedType;
        }
        function addTypeToSortedSet(sortedSet, type) {
            if (type.flags & 16384 /* Union */) {
                addTypesToSortedSet(sortedSet, type.types);
            }
            else {
                var i = 0;
                var id = type.id;
                while (i < sortedSet.length && sortedSet[i].id < id) {
                    i++;
                }
                if (i === sortedSet.length || sortedSet[i].id !== id) {
                    sortedSet.splice(i, 0, type);
                }
            }
        }
        function addTypesToSortedSet(sortedTypes, types) {
            for (var i = 0, len = types.length; i < len; i++) {
                addTypeToSortedSet(sortedTypes, types[i]);
            }
        }
        function isSubtypeOfAny(candidate, types) {
            for (var i = 0, len = types.length; i < len; i++) {
                if (candidate !== types[i] && isTypeSubtypeOf(candidate, types[i])) {
                    return true;
                }
            }
            return false;
        }
        function removeSubtypes(types) {
            var i = types.length;
            while (i > 0) {
                i--;
                if (isSubtypeOfAny(types[i], types)) {
                    types.splice(i, 1);
                }
            }
        }
        function containsAnyType(types) {
            for (var i = 0; i < types.length; i++) {
                if (types[i].flags & 1 /* Any */) {
                    return true;
                }
            }
            return false;
        }
        function removeAllButLast(types, typeToRemove) {
            var i = types.length;
            while (i > 0 && types.length > 1) {
                i--;
                if (types[i] === typeToRemove) {
                    types.splice(i, 1);
                }
            }
        }
        function getUnionType(types, noSubtypeReduction) {
            if (types.length === 0) {
                return emptyObjectType;
            }
            var sortedTypes = [];
            addTypesToSortedSet(sortedTypes, types);
            if (noSubtypeReduction) {
                if (containsAnyType(sortedTypes)) {
                    return anyType;
                }
                removeAllButLast(sortedTypes, undefinedType);
                removeAllButLast(sortedTypes, nullType);
            }
            else {
                removeSubtypes(sortedTypes);
            }
            if (sortedTypes.length === 1) {
                return sortedTypes[0];
            }
            var id = getTypeListId(sortedTypes);
            var type = unionTypes[id];
            if (!type) {
                type = unionTypes[id] = createObjectType(16384 /* Union */);
                type.types = sortedTypes;
            }
            return type;
        }
        function getTypeFromUnionTypeNode(node) {
            var links = getNodeLinks(node);
            if (!links.resolvedType) {
                links.resolvedType = getUnionType(reflect.map(node.types, getTypeFromTypeNode), true);
            }
            return links.resolvedType;
        }
        function getTypeFromTypeLiteralOrFunctionOrConstructorTypeNode(node) {
            var links = getNodeLinks(node);
            if (!links.resolvedType) {
                // Deferred resolution of members is handled by resolveObjectTypeMembers
                links.resolvedType = createObjectType(32768 /* Anonymous */, node.symbol);
            }
            return links.resolvedType;
        }
        function getStringLiteralType(node) {
            if (reflect.hasProperty(stringLiteralTypes, node.text))
                return stringLiteralTypes[node.text];
            var type = stringLiteralTypes[node.text] = createType(256 /* StringLiteral */);
            type.text = node.text;
            return type;
        }
        function getTypeFromStringLiteral(node) {
            var links = getNodeLinks(node);
            if (!links.resolvedType) {
                links.resolvedType = getStringLiteralType(node);
            }
            return links.resolvedType;
        }
        function getTypeFromTypeNode(node) {
            switch (node.kind) {
                case 26 /* StringLiteral */:
                    return getTypeFromStringLiteral(node);
                case 25 /* TypeReference */:
                    return getTypeFromTypeReferenceNode(node);
                case 22 /* ArrayType */:
                    return getTypeFromArrayTypeNode(node);
                case 27 /* TupleType */:
                    return getTypeFromTupleTypeNode(node);
                case 28 /* UnionType */:
                    return getTypeFromUnionTypeNode(node);
                case 21 /* FunctionType */:
                case 23 /* ConstructorType */:
                case 24 /* ObjectType */:
                    return getTypeFromTypeLiteralOrFunctionOrConstructorTypeNode(node);
                default:
                    return unknownType;
            }
        }
        function instantiateList(items, mapper, instantiator) {
            if (items && items.length) {
                var result = [];
                for (var i = 0; i < items.length; i++) {
                    result.push(instantiator(items[i], mapper));
                }
                return result;
            }
            return items;
        }
        function createUnaryTypeMapper(source, target) {
            return function (t) { return t === source ? target : t; };
        }
        function createBinaryTypeMapper(source1, target1, source2, target2) {
            return function (t) { return t === source1 ? target1 : t === source2 ? target2 : t; };
        }
        function createTypeMapper(sources, targets) {
            switch (sources.length) {
                case 1:
                    return createUnaryTypeMapper(sources[0], targets[0]);
                case 2:
                    return createBinaryTypeMapper(sources[0], targets[0], sources[1], targets[1]);
            }
            return function (t) {
                for (var i = 0; i < sources.length; i++) {
                    if (t === sources[i])
                        return targets[i];
                }
                return t;
            };
        }
        function createUnaryTypeEraser(source) {
            return function (t) { return t === source ? anyType : t; };
        }
        function createBinaryTypeEraser(source1, source2) {
            return function (t) { return t === source1 || t === source2 ? anyType : t; };
        }
        function createTypeEraser(sources) {
            switch (sources.length) {
                case 1:
                    return createUnaryTypeEraser(sources[0]);
                case 2:
                    return createBinaryTypeEraser(sources[0], sources[1]);
            }
            return function (t) {
                for (var i = 0; i < sources.length; i++) {
                    if (t === sources[i])
                        return anyType;
                }
                return t;
            };
        }
        function identityMapper(type) {
            return type;
        }
        function combineTypeMappers(mapper1, mapper2) {
            return function (t) { return mapper2(mapper1(t)); };
        }
        function instantiateTypeParameter(typeParameter, mapper) {
            var result = createType(512 /* TypeParameter */);
            result.symbol = typeParameter.symbol;
            if (typeParameter.constraint) {
                result.constraint = instantiateType(typeParameter.constraint, mapper);
            }
            else {
                result.target = typeParameter;
                result.mapper = mapper;
            }
            return result;
        }
        function instantiateSignature(signature, mapper, eraseTypeParameters) {
            if (signature.typeParameters && !eraseTypeParameters) {
                var freshTypeParameters = instantiateList(signature.typeParameters, mapper, instantiateTypeParameter);
                mapper = combineTypeMappers(createTypeMapper(signature.typeParameters, freshTypeParameters), mapper);
            }
            var result = createSignature(signature.declaration, freshTypeParameters, instantiateList(signature.parameters, mapper, instantiateSymbol), signature.resolvedReturnType ? instantiateType(signature.resolvedReturnType, mapper) : undefined, signature.minArgumentCount, signature.hasRestParameter, signature.hasStringLiterals);
            result.target = signature;
            result.mapper = mapper;
            return result;
        }
        function instantiateSymbol(symbol, mapper) {
            if (symbol.flags & 67108864 /* Instantiated */) {
                var links = getSymbolLinks(symbol);
                // If symbol being instantiated is itself a instantiation, fetch the original target and combine the
                // type mappers. This ensures that original type identities are properly preserved and that aliases
                // always reference a non-aliases.
                symbol = links.target;
                mapper = combineTypeMappers(links.mapper, mapper);
            }
            // Keep the flags from the symbol we're instantiating.  Mark that is instantiated, and
            // also transient so that we can just store data on it directly.
            var result = createSymbol(67108864 /* Instantiated */ | 268435456 /* Transient */ | symbol.flags, symbol.name);
            result.declarations = symbol.declarations;
            result.parent = symbol.parent;
            result.target = symbol;
            result.mapper = mapper;
            if (symbol.valueDeclaration) {
                result.valueDeclaration = symbol.valueDeclaration;
            }
            return result;
        }
        function instantiateAnonymousType(type, mapper) {
            var result = createObjectType(32768 /* Anonymous */, type.symbol);
            result.properties = instantiateList(getPropertiesOfObjectType(type), mapper, instantiateSymbol);
            result.members = createSymbolTable(result.properties);
            result.callSignatures = instantiateList(getSignaturesOfType(type, 0 /* Call */), mapper, instantiateSignature);
            result.constructSignatures = instantiateList(getSignaturesOfType(type, 1 /* Construct */), mapper, instantiateSignature);
            var stringIndexType = getIndexTypeOfType(type, 0 /* String */);
            var numberIndexType = getIndexTypeOfType(type, 1 /* Number */);
            if (stringIndexType)
                result.stringIndexType = instantiateType(stringIndexType, mapper);
            if (numberIndexType)
                result.numberIndexType = instantiateType(numberIndexType, mapper);
            return result;
        }
        function instantiateType(type, mapper) {
            if (mapper !== identityMapper) {
                if (type.flags & 512 /* TypeParameter */) {
                    return mapper(type);
                }
                if (type.flags & 32768 /* Anonymous */) {
                    return type.symbol && type.symbol.flags & (16 /* Function */ | 8192 /* Method */ | 2048 /* TypeLiteral */ | 4096 /* ObjectLiteral */) ? instantiateAnonymousType(type, mapper) : type;
                }
                if (type.flags & 4096 /* Reference */) {
                    return createTypeReference(type.target, instantiateList(type.typeArguments, mapper, instantiateType));
                }
                if (type.flags & 8192 /* Tuple */) {
                    return createTupleType(instantiateList(type.elementTypes, mapper, instantiateType));
                }
                if (type.flags & 16384 /* Union */) {
                    return getUnionType(instantiateList(type.types, mapper, instantiateType), true);
                }
            }
            return type;
        }
        function typeToString(type, fallback) {
            if (type.symbol) {
                return symbolToString(type.symbol);
            }
            return fallback || "Anonymous";
        }
        function symbolToString(symbol, containingSymbol) {
            var name = "";
            var parentSymbol;
            function writeSymbolName(symbol) {
                if (parentSymbol) {
                    name += ".";
                }
                parentSymbol = symbol;
                if (symbol.declarations && symbol.declarations.length > 0) {
                    var declaration = symbol.declarations[0];
                    if (declaration.name) {
                        name += declaration.name;
                        return;
                    }
                }
                name += symbol.name;
            }
            function walkSymbol(symbol) {
                if (containingSymbol && containingSymbol == symbol) {
                    return;
                }
                if (symbol) {
                    // Go up and add our parent.
                    walkSymbol(symbol.parent);
                    if (!parentSymbol && reflect.forEach(symbol.declarations, function (declaration) { return (declaration.flags & 16384 /* ExternalModule */); })) {
                        return;
                    }
                    // if this is anonymous type break
                    if (symbol.flags & 2048 /* TypeLiteral */ || symbol.flags & 4096 /* ObjectLiteral */) {
                        return;
                    }
                    writeSymbolName(symbol);
                }
            }
            walkSymbol(symbol);
            return name;
        }
        // TYPE CHECKING
        var subtypeRelation = {};
        var assignableRelation = {};
        var identityRelation = {};
        function isTypeIdenticalTo(source, target, diagnostics) {
            return checkTypeRelatedTo(source, target, identityRelation, diagnostics);
        }
        function isTypeSubtypeOf(source, target, diagnostics) {
            return checkTypeRelatedTo(source, target, subtypeRelation, diagnostics);
        }
        function isTypeAssignableTo(source, target, diagnostics) {
            return checkTypeRelatedTo(source, target, assignableRelation, diagnostics);
        }
        function compareTypes(source, target) {
            return checkTypeRelatedTo(source, target, identityRelation, undefined) ? -1 /* True */ : 0 /* False */;
        }
        function getTargetSymbol(s) {
            // if symbol is instantiated it's flags are not copied from the 'target'
            // so we'll need to get back original 'target' symbol to work with correct set of flags
            return s.flags & 67108864 /* Instantiated */ ? getSymbolLinks(s).target : s;
        }
        function checkTypeRelatedTo(source, target, relation, diagnostics) {
            var errorInfo;
            var sourceStack;
            var targetStack;
            var maybeStack;
            var expandingFlags;
            var depth = 0;
            var overflow = false;
            var result = isRelatedTo(source, target, true);
            if (overflow) {
                error(undefined, reflect.Diagnostics.Excessive_stack_depth_comparing_types_0_and_1, sourceTypeString(), targetTypeString());
            }
            else if (errorInfo && diagnostics) {
                // push all diagnostics in the chain into the diagnostics array
                var chain = errorInfo;
                while (chain) {
                    diagnostics.push(chain.diagnostic);
                    chain = chain.next;
                }
            }
            return result !== 0 /* False */;
            function sourceTypeString() {
                return typeToString(source, "source");
            }
            function targetTypeString() {
                return typeToString(target, "target");
            }
            function reportError(message, arg0, arg1, arg2) {
                errorInfo = reflect.chainDiagnosticMessages(errorInfo, new reflect.Diagnostic(undefined, message, arg0, arg1, arg2));
            }
            // Compare two types and return
            // Ternary.True if they are related with no assumptions,
            // Ternary.Maybe if they are related with assumptions of other relationships, or
            // Ternary.False if they are not related.
            function isRelatedTo(source, target, reportErrors) {
                var result;
                if (relation === identityRelation) {
                    // both types are the same - covers 'they are the same primitive type or both are Any' or the same type parameter cases
                    if (source === target)
                        return -1 /* True */;
                }
                else {
                    if (source === target)
                        return -1 /* True */;
                    if (target.flags & 1 /* Any */)
                        return -1 /* True */;
                    if (source === undefinedType)
                        return -1 /* True */;
                    if (source === nullType && target !== undefinedType)
                        return -1 /* True */;
                    if (source.flags & 128 /* Enum */ && target === numberType)
                        return -1 /* True */;
                    if (source.flags & 256 /* StringLiteral */ && target === stringType)
                        return -1 /* True */;
                    if (relation === assignableRelation) {
                        if (source.flags & 1 /* Any */)
                            return -1 /* True */;
                        if (source === numberType && target.flags & 128 /* Enum */)
                            return -1 /* True */;
                    }
                }
                if (source.flags & 16384 /* Union */) {
                    if (result = unionTypeRelatedToType(source, target, reportErrors)) {
                        return result;
                    }
                }
                else if (target.flags & 16384 /* Union */) {
                    if (result = typeRelatedToUnionType(source, target, reportErrors)) {
                        return result;
                    }
                }
                else if (source.flags & 512 /* TypeParameter */ && target.flags & 512 /* TypeParameter */) {
                    if (result = typeParameterRelatedTo(source, target, reportErrors)) {
                        return result;
                    }
                }
                else {
                    var saveErrorInfo = errorInfo;
                    if (source.flags & 4096 /* Reference */ && target.flags & 4096 /* Reference */ && source.target === target.target) {
                        // We have type references to same target type, see if relationship holds for all type arguments
                        if (result = typesRelatedTo(source.typeArguments, target.typeArguments, reportErrors)) {
                            return result;
                        }
                    }
                    // Even if relationship doesn't hold for type arguments, it may hold in a structural comparison
                    // Report structural errors only if we haven't reported any errors yet
                    var reportStructuralErrors = reportErrors && errorInfo === saveErrorInfo;
                    // identity relation does not use apparent type
                    var sourceOrApparentType = relation === identityRelation ? source : getApparentType(source);
                    if (sourceOrApparentType.flags & 48128 /* ObjectType */ && target.flags & 48128 /* ObjectType */ && (result = objectTypeRelatedTo(sourceOrApparentType, target, reportStructuralErrors))) {
                        errorInfo = saveErrorInfo;
                        return result;
                    }
                }
                if (reportErrors) {
                    // The error should end in a period when this is the deepest error in the chain
                    // (when errorInfo is undefined). Otherwise, it has a colon before the nested
                    // error.
                    var chainedMessage = reflect.Diagnostics.Type_0_is_not_assignable_to_type_1_Colon;
                    var terminalMessage = reflect.Diagnostics.Type_0_is_not_assignable_to_type_1;
                    var diagnosticKey = errorInfo ? chainedMessage : terminalMessage;
                    reportError(diagnosticKey, sourceTypeString(), targetTypeString());
                }
                return 0 /* False */;
            }
            function typeRelatedToUnionType(source, target, reportErrors) {
                var targetTypes = target.types;
                for (var i = 0, len = targetTypes.length; i < len; i++) {
                    var related = isRelatedTo(source, targetTypes[i], reportErrors && i === len - 1);
                    if (related) {
                        return related;
                    }
                }
                return 0 /* False */;
            }
            function unionTypeRelatedToType(source, target, reportErrors) {
                var result = -1 /* True */;
                var sourceTypes = source.types;
                for (var i = 0, len = sourceTypes.length; i < len; i++) {
                    var related = isRelatedTo(sourceTypes[i], target, reportErrors);
                    if (!related) {
                        return 0 /* False */;
                    }
                    result &= related;
                }
                return result;
            }
            function typesRelatedTo(sources, targets, reportErrors) {
                var result = -1 /* True */;
                for (var i = 0, len = sources.length; i < len; i++) {
                    var related = isRelatedTo(sources[i], targets[i], reportErrors);
                    if (!related) {
                        return 0 /* False */;
                    }
                    result &= related;
                }
                return result;
            }
            function typeParameterRelatedTo(source, target, reportErrors) {
                if (relation === identityRelation) {
                    if (source.symbol.name !== target.symbol.name) {
                        return 0 /* False */;
                    }
                    // covers case when both type parameters does not have constraint (both equal to noConstraintType)
                    if (source.constraint === target.constraint) {
                        return -1 /* True */;
                    }
                    if (source.constraint === noConstraintType || target.constraint === noConstraintType) {
                        return 0 /* False */;
                    }
                    return isRelatedTo(source.constraint, target.constraint, reportErrors);
                }
                else {
                    while (true) {
                        var constraint = getConstraintOfTypeParameter(source);
                        if (constraint === target)
                            return -1 /* True */;
                        if (!(constraint && constraint.flags & 512 /* TypeParameter */))
                            break;
                        source = constraint;
                    }
                    return 0 /* False */;
                }
            }
            // Determine if two object types are related by structure. First, check if the result is already available in the global cache.
            // Second, check if we have already started a comparison of the given two types in which case we assume the result to be true.
            // Third, check if both types are part of deeply nested chains of generic type instantiations and if so assume the types are
            // equal and infinitely expanding. Fourth, if we have reached a depth of 100 nested comparisons, assume we have runaway recursion
            // and issue an error. Otherwise, actually compare the structure of the two types.
            function objectTypeRelatedTo(source, target, reportErrors) {
                if (overflow) {
                    return 0 /* False */;
                }
                var id = source.id + "," + target.id;
                var related = relation[id];
                if (related !== undefined) {
                    return related ? -1 /* True */ : 0 /* False */;
                }
                if (depth > 0) {
                    for (var i = 0; i < depth; i++) {
                        // If source and target are already being compared, consider them related with assumptions
                        if (maybeStack[i][id]) {
                            return 1 /* Maybe */;
                        }
                    }
                    if (depth === 100) {
                        overflow = true;
                        return 0 /* False */;
                    }
                }
                else {
                    sourceStack = [];
                    targetStack = [];
                    maybeStack = [];
                    expandingFlags = 0;
                }
                sourceStack[depth] = source;
                targetStack[depth] = target;
                maybeStack[depth] = {};
                maybeStack[depth][id] = true;
                depth++;
                var saveExpandingFlags = expandingFlags;
                if (!(expandingFlags & 1) && isDeeplyNestedGeneric(source, sourceStack))
                    expandingFlags |= 1;
                if (!(expandingFlags & 2) && isDeeplyNestedGeneric(target, targetStack))
                    expandingFlags |= 2;
                if (expandingFlags === 3) {
                    var result = 1 /* Maybe */;
                }
                else {
                    var result = propertiesRelatedTo(source, target, reportErrors);
                    if (result) {
                        result &= signaturesRelatedTo(source, target, 0 /* Call */, reportErrors);
                        if (result) {
                            result &= signaturesRelatedTo(source, target, 1 /* Construct */, reportErrors);
                            if (result) {
                                result &= stringIndexTypesRelatedTo(source, target, reportErrors);
                                if (result) {
                                    result &= numberIndexTypesRelatedTo(source, target, reportErrors);
                                }
                            }
                        }
                    }
                }
                expandingFlags = saveExpandingFlags;
                depth--;
                if (result) {
                    var maybeCache = maybeStack[depth];
                    // If result is definitely true, copy assumptions to global cache, else copy to next level up
                    var destinationCache = result === -1 /* True */ || depth === 0 ? relation : maybeStack[depth - 1];
                    for (var p in maybeCache) {
                        destinationCache[p] = maybeCache[p];
                    }
                }
                else {
                    // A false result goes straight into global cache (when something is false under assumptions it
                    // will also be false without assumptions)
                    relation[id] = false;
                }
                return result;
            }
            // Return true if the given type is part of a deeply nested chain of generic instantiations. We consider this to be the case
            // when structural type comparisons have been started for 10 or more instantiations of the same generic type. It is possible,
            // though highly unlikely, for this test to be true in a situation where a chain of instantiations is not infinitely expanding.
            // Effectively, we will generate a false positive when two types are structurally equal to at least 10 levels, but unequal at
            // some level beyond that.
            function isDeeplyNestedGeneric(type, stack) {
                if (type.flags & 4096 /* Reference */ && depth >= 10) {
                    var target = type.target;
                    var count = 0;
                    for (var i = 0; i < depth; i++) {
                        var t = stack[i];
                        if (t.flags & 4096 /* Reference */ && t.target === target) {
                            count++;
                            if (count >= 10)
                                return true;
                        }
                    }
                }
                return false;
            }
            function propertiesRelatedTo(source, target, reportErrors) {
                if (relation === identityRelation) {
                    return propertiesIdenticalTo(source, target);
                }
                var result = -1 /* True */;
                var properties = getPropertiesOfObjectType(target);
                for (var i = 0; i < properties.length; i++) {
                    var targetProp = properties[i];
                    var sourceProp = getPropertyOfType(source, targetProp.name);
                    if (sourceProp !== targetProp) {
                        if (!sourceProp) {
                            if (relation === subtypeRelation || !isOptionalProperty(targetProp)) {
                                if (reportErrors) {
                                    reportError(reflect.Diagnostics.Property_0_is_missing_in_type_1, symbolToString(targetProp), sourceTypeString());
                                }
                                return 0 /* False */;
                            }
                        }
                        else if (!(targetProp.flags & 536870912 /* Prototype */)) {
                            var sourceFlags = getDeclarationFlagsFromSymbol(sourceProp);
                            var targetFlags = getDeclarationFlagsFromSymbol(targetProp);
                            if (sourceFlags & 32 /* Private */ || targetFlags & 32 /* Private */) {
                                if (sourceProp.valueDeclaration !== targetProp.valueDeclaration) {
                                    if (reportErrors) {
                                        if (sourceFlags & 32 /* Private */ && targetFlags & 32 /* Private */) {
                                            reportError(reflect.Diagnostics.Types_have_separate_declarations_of_a_private_property_0, symbolToString(targetProp));
                                        }
                                        else {
                                            reportError(reflect.Diagnostics.Property_0_is_private_in_type_1_but_not_in_type_2, symbolToString(targetProp), sourceFlags & 32 /* Private */ ? sourceTypeString() : targetTypeString(), sourceFlags & 32 /* Private */ ? targetTypeString() : sourceTypeString());
                                        }
                                    }
                                    return 0 /* False */;
                                }
                            }
                            else if (targetFlags & 64 /* Protected */) {
                                var sourceDeclaredInClass = sourceProp.parent && sourceProp.parent.flags & 32 /* Class */;
                                var sourceClass = sourceDeclaredInClass ? getDeclaredTypeOfSymbol(sourceProp.parent) : undefined;
                                var targetClass = getDeclaredTypeOfSymbol(targetProp.parent);
                                if (!sourceClass || !hasBaseType(sourceClass, targetClass)) {
                                    if (reportErrors) {
                                        reportError(reflect.Diagnostics.Property_0_is_protected_but_type_1_is_not_a_class_derived_from_2, symbolToString(targetProp), typeToString(sourceClass || source, "source"), typeToString(targetClass, "target"));
                                    }
                                    return 0 /* False */;
                                }
                            }
                            else if (sourceFlags & 64 /* Protected */) {
                                if (reportErrors) {
                                    reportError(reflect.Diagnostics.Property_0_is_protected_in_type_1_but_public_in_type_2, symbolToString(targetProp), sourceTypeString(), targetTypeString());
                                }
                                return 0 /* False */;
                            }
                            var related = isRelatedTo(getTypeOfSymbol(sourceProp), getTypeOfSymbol(targetProp), reportErrors);
                            if (!related) {
                                if (reportErrors) {
                                    reportError(reflect.Diagnostics.Types_of_property_0_are_incompatible, symbolToString(targetProp));
                                }
                                return 0 /* False */;
                            }
                            result &= related;
                            if (isOptionalProperty(sourceProp) && !isOptionalProperty(targetProp)) {
                                // TypeScript 1.0 spec (April 2014): 3.8.3
                                // S is a subtype of a type T, and T is a supertype of S if ...
                                // S' and T are object types and, for each member M in T..
                                // M is a property and S' contains a property N where
                                // if M is a required property, N is also a required property
                                // (M - property in T)
                                // (N - property in S)
                                if (reportErrors) {
                                    reportError(reflect.Diagnostics.Property_0_is_optional_in_type_1_but_required_in_type_2, symbolToString(targetProp), sourceTypeString(), targetTypeString());
                                }
                                return 0 /* False */;
                            }
                        }
                    }
                }
                return result;
            }
            function propertiesIdenticalTo(source, target) {
                var sourceProperties = getPropertiesOfObjectType(source);
                var targetProperties = getPropertiesOfObjectType(target);
                if (sourceProperties.length !== targetProperties.length) {
                    return 0 /* False */;
                }
                var result = -1 /* True */;
                for (var i = 0, len = sourceProperties.length; i < len; ++i) {
                    var sourceProp = sourceProperties[i];
                    var targetProp = getPropertyOfObjectType(target, sourceProp.name);
                    if (!targetProp) {
                        return 0 /* False */;
                    }
                    var related = compareProperties(sourceProp, targetProp, isRelatedTo);
                    if (!related) {
                        return 0 /* False */;
                    }
                    result &= related;
                }
                return result;
            }
            function signaturesRelatedTo(source, target, kind, reportErrors) {
                if (relation === identityRelation) {
                    return signaturesIdenticalTo(source, target, kind);
                }
                if (target === anyFunctionType || source === anyFunctionType) {
                    return -1 /* True */;
                }
                var sourceSignatures = getSignaturesOfType(source, kind);
                var targetSignatures = getSignaturesOfType(target, kind);
                var result = -1 /* True */;
                var saveErrorInfo = errorInfo;
                outer: for (var i = 0; i < targetSignatures.length; i++) {
                    var t = targetSignatures[i];
                    if (!t.hasStringLiterals || target.flags & 65536 /* FromSignature */) {
                        var localErrors = reportErrors;
                        for (var j = 0; j < sourceSignatures.length; j++) {
                            var s = sourceSignatures[j];
                            if (!s.hasStringLiterals || source.flags & 65536 /* FromSignature */) {
                                var related = signatureRelatedTo(s, t, localErrors);
                                if (related) {
                                    result &= related;
                                    errorInfo = saveErrorInfo;
                                    continue outer;
                                }
                                // Only report errors from the first failure
                                localErrors = false;
                            }
                        }
                        return 0 /* False */;
                    }
                }
                return result;
            }
            function signatureRelatedTo(source, target, reportErrors) {
                if (source === target) {
                    return -1 /* True */;
                }
                if (!target.hasRestParameter && source.minArgumentCount > target.parameters.length) {
                    return 0 /* False */;
                }
                var sourceMax = source.parameters.length;
                var targetMax = target.parameters.length;
                var checkCount;
                if (source.hasRestParameter && target.hasRestParameter) {
                    checkCount = sourceMax > targetMax ? sourceMax : targetMax;
                    sourceMax--;
                    targetMax--;
                }
                else if (source.hasRestParameter) {
                    sourceMax--;
                    checkCount = targetMax;
                }
                else if (target.hasRestParameter) {
                    targetMax--;
                    checkCount = sourceMax;
                }
                else {
                    checkCount = sourceMax < targetMax ? sourceMax : targetMax;
                }
                // Spec 1.0 Section 3.8.3 & 3.8.4:
                // M and N (the signatures) are instantiated using type Any as the type argument for all type parameters declared by M and N
                source = getErasedSignature(source);
                target = getErasedSignature(target);
                var result = -1 /* True */;
                for (var i = 0; i < checkCount; i++) {
                    var s = i < sourceMax ? getTypeOfSymbol(source.parameters[i]) : getRestTypeOfSignature(source);
                    var t = i < targetMax ? getTypeOfSymbol(target.parameters[i]) : getRestTypeOfSignature(target);
                    var saveErrorInfo = errorInfo;
                    var related = isRelatedTo(s, t, reportErrors);
                    if (!related) {
                        related = isRelatedTo(t, s, false);
                        if (!related) {
                            if (reportErrors) {
                                reportError(reflect.Diagnostics.Types_of_parameters_0_and_1_are_incompatible, source.parameters[i < sourceMax ? i : sourceMax].name, target.parameters[i < targetMax ? i : targetMax].name);
                            }
                            return 0 /* False */;
                        }
                        errorInfo = saveErrorInfo;
                    }
                    result &= related;
                }
                var t = getReturnTypeOfSignature(target);
                if (t === voidType)
                    return result;
                var s = getReturnTypeOfSignature(source);
                return result & isRelatedTo(s, t, reportErrors);
            }
            function signaturesIdenticalTo(source, target, kind) {
                var sourceSignatures = getSignaturesOfType(source, kind);
                var targetSignatures = getSignaturesOfType(target, kind);
                if (sourceSignatures.length !== targetSignatures.length) {
                    return 0 /* False */;
                }
                var result = -1 /* True */;
                for (var i = 0, len = sourceSignatures.length; i < len; ++i) {
                    var related = compareSignatures(sourceSignatures[i], targetSignatures[i], true, isRelatedTo);
                    if (!related) {
                        return 0 /* False */;
                    }
                    result &= related;
                }
                return result;
            }
            function stringIndexTypesRelatedTo(source, target, reportErrors) {
                if (relation === identityRelation) {
                    return indexTypesIdenticalTo(0 /* String */, source, target);
                }
                var targetType = getIndexTypeOfType(target, 0 /* String */);
                if (targetType) {
                    var sourceType = getIndexTypeOfType(source, 0 /* String */);
                    if (!sourceType) {
                        if (reportErrors) {
                            reportError(reflect.Diagnostics.Index_signature_is_missing_in_type_0, sourceTypeString());
                        }
                        return 0 /* False */;
                    }
                    var related = isRelatedTo(sourceType, targetType, reportErrors);
                    if (!related) {
                        if (reportErrors) {
                            reportError(reflect.Diagnostics.Index_signatures_are_incompatible);
                        }
                        return 0 /* False */;
                    }
                    return related;
                }
                return -1 /* True */;
            }
            function numberIndexTypesRelatedTo(source, target, reportErrors) {
                if (relation === identityRelation) {
                    return indexTypesIdenticalTo(1 /* Number */, source, target);
                }
                var targetType = getIndexTypeOfType(target, 1 /* Number */);
                if (targetType) {
                    var sourceStringType = getIndexTypeOfType(source, 0 /* String */);
                    var sourceNumberType = getIndexTypeOfType(source, 1 /* Number */);
                    if (!(sourceStringType || sourceNumberType)) {
                        if (reportErrors) {
                            reportError(reflect.Diagnostics.Index_signature_is_missing_in_type_0, sourceTypeString());
                        }
                        return 0 /* False */;
                    }
                    if (sourceStringType && sourceNumberType) {
                        // If we know for sure we're testing both string and numeric index types then only report errors from the second one
                        var related = isRelatedTo(sourceStringType, targetType, false) || isRelatedTo(sourceNumberType, targetType, reportErrors);
                    }
                    else {
                        var related = isRelatedTo(sourceStringType || sourceNumberType, targetType, reportErrors);
                    }
                    if (!related) {
                        if (reportErrors) {
                            reportError(reflect.Diagnostics.Index_signatures_are_incompatible);
                        }
                        return 0 /* False */;
                    }
                    return related;
                }
                return -1 /* True */;
            }
            function indexTypesIdenticalTo(indexKind, source, target) {
                var targetType = getIndexTypeOfType(target, indexKind);
                var sourceType = getIndexTypeOfType(source, indexKind);
                if (!sourceType && !targetType) {
                    return -1 /* True */;
                }
                if (sourceType && targetType) {
                    return isRelatedTo(sourceType, targetType);
                }
                return 0 /* False */;
            }
        }
        function compareProperties(sourceProp, targetProp, compareTypes) {
            // Two members are considered identical when
            // - they are public properties with identical names, optionality, and types,
            // - they are private or protected properties originating in the same declaration and having identical types
            if (sourceProp === targetProp) {
                return -1 /* True */;
            }
            var sourcePropAccessibility = getDeclarationFlagsFromSymbol(sourceProp) & (32 /* Private */ | 64 /* Protected */);
            var targetPropAccessibility = getDeclarationFlagsFromSymbol(targetProp) & (32 /* Private */ | 64 /* Protected */);
            if (sourcePropAccessibility !== targetPropAccessibility) {
                return 0 /* False */;
            }
            if (sourcePropAccessibility) {
                if (getTargetSymbol(sourceProp) !== getTargetSymbol(targetProp)) {
                    return 0 /* False */;
                }
            }
            else {
                if (isOptionalProperty(sourceProp) !== isOptionalProperty(targetProp)) {
                    return 0 /* False */;
                }
            }
            return compareTypes(getTypeOfSymbol(sourceProp), getTypeOfSymbol(targetProp));
        }
        function compareSignatures(source, target, compareReturnTypes, compareTypes) {
            if (source === target) {
                return -1 /* True */;
            }
            if (source.parameters.length !== target.parameters.length || source.minArgumentCount !== target.minArgumentCount || source.hasRestParameter !== target.hasRestParameter) {
                return 0 /* False */;
            }
            var result = -1 /* True */;
            if (source.typeParameters && target.typeParameters) {
                if (source.typeParameters.length !== target.typeParameters.length) {
                    return 0 /* False */;
                }
                for (var i = 0, len = source.typeParameters.length; i < len; ++i) {
                    var related = compareTypes(source.typeParameters[i], target.typeParameters[i]);
                    if (!related) {
                        return 0 /* False */;
                    }
                    result &= related;
                }
            }
            else if (source.typeParameters || source.typeParameters) {
                return 0 /* False */;
            }
            // Spec 1.0 Section 3.8.3 & 3.8.4:
            // M and N (the signatures) are instantiated using type Any as the type argument for all type parameters declared by M and N
            source = getErasedSignature(source);
            target = getErasedSignature(target);
            for (var i = 0, len = source.parameters.length; i < len; i++) {
                var s = source.hasRestParameter && i === len - 1 ? getRestTypeOfSignature(source) : getTypeOfSymbol(source.parameters[i]);
                var t = target.hasRestParameter && i === len - 1 ? getRestTypeOfSignature(target) : getTypeOfSymbol(target.parameters[i]);
                var related = compareTypes(s, t);
                if (!related) {
                    return 0 /* False */;
                }
                result &= related;
            }
            if (compareReturnTypes) {
                result &= compareTypes(getReturnTypeOfSignature(source), getReturnTypeOfSignature(target));
            }
            return result;
        }
        function getAncestor(node, kind) {
            switch (kind) {
                case 2 /* ClassDeclaration */:
                    while (node) {
                        switch (node.kind) {
                            case 2 /* ClassDeclaration */:
                                return node;
                            case 3 /* EnumDeclaration */:
                            case 1 /* InterfaceDeclaration */:
                            case 4 /* ModuleDeclaration */:
                            case 7 /* ImportDeclaration */:
                                // early exit cases - declarations cannot be nested in classes
                                return undefined;
                            default:
                                node = node.parent;
                                continue;
                        }
                    }
                    break;
                default:
                    while (node) {
                        if (node.kind === kind) {
                            return node;
                        }
                        else {
                            node = node.parent;
                        }
                    }
                    break;
            }
            return undefined;
        }
        function getDeclarationFlagsFromSymbol(s) {
            return s.flags & 536870912 /* Prototype */ ? 16 /* Public */ | 128 /* Static */ : s.valueDeclaration.flags;
        }
        function initializeGlobalTypes() {
            // Initialize special symbols
            getSymbolLinks(unknownSymbol).type = unknownType;
            // Initialize special types
            globalArraySymbol = getGlobalSymbol("Array");
            globalArrayType = getTypeOfGlobalSymbol(globalArraySymbol, 1);
            globalObjectType = getGlobalType("Object");
            globalFunctionType = getGlobalType("Function");
            globalStringType = getGlobalType("String");
            globalNumberType = getGlobalType("Number");
            globalBooleanType = getGlobalType("Boolean");
        }
    }
    reflect.createTypeChecker = createTypeChecker;
})(reflect || (reflect = {}));
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
var reflect;
(function (reflect) {
    var path = require("path");
    var glob = require("glob");
    var async = require("async");
    function createContext() {
        var loader = reflect.createLoader();
        return {
            requireModule: requireModule,
            reference: reference,
            resolve: resolve,
            load: load
        };
        function requireModule(moduleName) {
            if (!moduleName) {
                throw new Error("Missing required argument 'moduleName'.");
            }
            var ret = loader.processExternalModule(moduleName, getBasePath());
            throwIfErrors();
            return ret;
        }
        function reference(filename) {
            if (!filename) {
                throw new Error("Missing required argument 'filename'.");
            }
            loader.processRootFile(reflect.normalizePath(reflect.combinePaths(getBasePath(), filename)));
            throwIfErrors();
        }
        function load(paths, callback) {
            var symbols = [];
            if (!Array.isArray(paths)) {
                paths = [paths];
            }
            async.each(paths, processPath, function (err) {
                if (err)
                    return callback(err, null);
                callback(null, symbols);
            });
            function processPath(filePath, callback) {
                var relativePath = path.relative(process.cwd(), filePath);
                glob(relativePath, function (err, matches) {
                    if (err)
                        return callback(err);
                    // If there were not any matches then filePath was probably a path to a single file
                    // without an extension. Pass in the original path and let processRootFileAsync figure
                    // it out.
                    if (!matches || matches.length == 0) {
                        matches = [relativePath];
                    }
                    async.each(matches, processFile, function (err) {
                        if (err)
                            return callback(err);
                        callback();
                    });
                });
            }
            function processFile(filePath, callback) {
                loader.processRootFileAsync(filePath, function (err, sourceFile) {
                    if (err)
                        return callback(err);
                    var symbol = sourceFile.symbol;
                    if (symbol) {
                        // external module
                        symbol = loader.getTypeChecker().getResolvedExportSymbol(sourceFile.symbol);
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
        function resolve(name, meaning) {
            if (meaning === void 0) { meaning = 1536 /* Namespace */ | 3152352 /* Type */ | 107455 /* Value */; }
            if (!name) {
                throw new Error("Missing required argument 'name'.");
            }
            var ret = loader.getTypeChecker().resolveEntityName(undefined, name, meaning);
            throwIfErrors();
            return ret;
        }
        function throwIfErrors() {
            var errors = loader.getErrors();
            if (errors.length == 0) {
                errors = loader.getTypeChecker().getErrors();
            }
            reflect.throwDiagnosticError(errors);
        }
    }
    reflect.createContext = createContext;
    function getBasePath() {
        return reflect.getDirectoryPath(reflect.relativePath(module.parent.filename));
    }
})(reflect || (reflect = {}));
/// <reference path="context.ts"/>
/// <reference path="types.ts"/>
var reflect;
(function (reflect) {
    var globalContext;
    function requireModule(moduleName) {
        return ensureGlobalContext().requireModule(moduleName);
    }
    function reference(filename) {
        return ensureGlobalContext().reference(filename);
    }
    function resolve(name, meaning) {
        return ensureGlobalContext().resolve(name, meaning);
    }
    function load(paths, callback) {
        return ensureGlobalContext().load(paths, callback);
    }
    function ensureGlobalContext() {
        if (!globalContext) {
            globalContext = reflect.createContext();
        }
        return globalContext;
    }
    exports.reference = reference;
    exports.load = load;
    exports.resolve = resolve;
    exports.require = requireModule;
    exports.createContext = reflect.createContext;
})(reflect || (reflect = {}));
//# sourceMappingURL=tsreflect.js.map