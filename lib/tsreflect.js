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
        if (!map) {
            console.log('here;');
        }
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
/// <reference path="arrayUtil.ts"/>
var reflect;
(function (reflect) {
    (function (SymbolFlags) {
        SymbolFlags[SymbolFlags["Variable"] = 0x00000001] = "Variable";
        SymbolFlags[SymbolFlags["Property"] = 0x00000002] = "Property";
        SymbolFlags[SymbolFlags["EnumMember"] = 0x00000004] = "EnumMember";
        SymbolFlags[SymbolFlags["Function"] = 0x00000008] = "Function";
        SymbolFlags[SymbolFlags["Class"] = 0x00000010] = "Class";
        SymbolFlags[SymbolFlags["Interface"] = 0x00000020] = "Interface";
        SymbolFlags[SymbolFlags["Enum"] = 0x00000040] = "Enum";
        SymbolFlags[SymbolFlags["ValueModule"] = 0x00000080] = "ValueModule";
        SymbolFlags[SymbolFlags["NamespaceModule"] = 0x00000100] = "NamespaceModule";
        SymbolFlags[SymbolFlags["TypeLiteral"] = 0x00000200] = "TypeLiteral";
        SymbolFlags[SymbolFlags["ObjectLiteral"] = 0x00000400] = "ObjectLiteral";
        SymbolFlags[SymbolFlags["Method"] = 0x00000800] = "Method";
        SymbolFlags[SymbolFlags["Constructor"] = 0x00001000] = "Constructor";
        SymbolFlags[SymbolFlags["GetAccessor"] = 0x00002000] = "GetAccessor";
        SymbolFlags[SymbolFlags["SetAccessor"] = 0x00004000] = "SetAccessor";
        SymbolFlags[SymbolFlags["CallSignature"] = 0x00008000] = "CallSignature";
        SymbolFlags[SymbolFlags["ConstructSignature"] = 0x00010000] = "ConstructSignature";
        SymbolFlags[SymbolFlags["IndexSignature"] = 0x00020000] = "IndexSignature";
        SymbolFlags[SymbolFlags["TypeParameter"] = 0x00040000] = "TypeParameter";
        // Export markers (see comment in declareModuleMember in binder)
        SymbolFlags[SymbolFlags["ExportValue"] = 0x00080000] = "ExportValue";
        SymbolFlags[SymbolFlags["ExportType"] = 0x00100000] = "ExportType";
        SymbolFlags[SymbolFlags["ExportNamespace"] = 0x00200000] = "ExportNamespace";
        SymbolFlags[SymbolFlags["Import"] = 0x00400000] = "Import";
        SymbolFlags[SymbolFlags["Instantiated"] = 0x00800000] = "Instantiated";
        SymbolFlags[SymbolFlags["Merged"] = 0x01000000] = "Merged";
        SymbolFlags[SymbolFlags["Transient"] = 0x02000000] = "Transient";
        SymbolFlags[SymbolFlags["Prototype"] = 0x04000000] = "Prototype";
        SymbolFlags[SymbolFlags["Value"] = SymbolFlags.Variable | SymbolFlags.Property | SymbolFlags.EnumMember | SymbolFlags.Function | SymbolFlags.Class | SymbolFlags.Enum | SymbolFlags.ValueModule | SymbolFlags.Method | SymbolFlags.GetAccessor | SymbolFlags.SetAccessor] = "Value";
        SymbolFlags[SymbolFlags["Type"] = SymbolFlags.Class | SymbolFlags.Interface | SymbolFlags.Enum | SymbolFlags.TypeLiteral | SymbolFlags.ObjectLiteral | SymbolFlags.TypeParameter] = "Type";
        SymbolFlags[SymbolFlags["Namespace"] = SymbolFlags.ValueModule | SymbolFlags.NamespaceModule] = "Namespace";
        SymbolFlags[SymbolFlags["Module"] = SymbolFlags.ValueModule | SymbolFlags.NamespaceModule] = "Module";
        SymbolFlags[SymbolFlags["Accessor"] = SymbolFlags.GetAccessor | SymbolFlags.SetAccessor] = "Accessor";
        SymbolFlags[SymbolFlags["Signature"] = SymbolFlags.CallSignature | SymbolFlags.ConstructSignature | SymbolFlags.IndexSignature] = "Signature";
        SymbolFlags[SymbolFlags["ParameterExcludes"] = SymbolFlags.Value] = "ParameterExcludes";
        SymbolFlags[SymbolFlags["VariableExcludes"] = SymbolFlags.Value & ~SymbolFlags.Variable] = "VariableExcludes";
        SymbolFlags[SymbolFlags["PropertyExcludes"] = SymbolFlags.Value] = "PropertyExcludes";
        SymbolFlags[SymbolFlags["EnumMemberExcludes"] = SymbolFlags.Value] = "EnumMemberExcludes";
        SymbolFlags[SymbolFlags["FunctionExcludes"] = SymbolFlags.Value & ~(SymbolFlags.Function | SymbolFlags.ValueModule)] = "FunctionExcludes";
        SymbolFlags[SymbolFlags["ClassExcludes"] = (SymbolFlags.Value | SymbolFlags.Type) & ~SymbolFlags.ValueModule] = "ClassExcludes";
        SymbolFlags[SymbolFlags["InterfaceExcludes"] = SymbolFlags.Type & ~SymbolFlags.Interface] = "InterfaceExcludes";
        SymbolFlags[SymbolFlags["EnumExcludes"] = (SymbolFlags.Value | SymbolFlags.Type) & ~(SymbolFlags.Enum | SymbolFlags.ValueModule)] = "EnumExcludes";
        SymbolFlags[SymbolFlags["ValueModuleExcludes"] = SymbolFlags.Value & ~(SymbolFlags.Function | SymbolFlags.Class | SymbolFlags.Enum | SymbolFlags.ValueModule)] = "ValueModuleExcludes";
        SymbolFlags[SymbolFlags["NamespaceModuleExcludes"] = 0] = "NamespaceModuleExcludes";
        SymbolFlags[SymbolFlags["MethodExcludes"] = SymbolFlags.Value & ~SymbolFlags.Method] = "MethodExcludes";
        SymbolFlags[SymbolFlags["GetAccessorExcludes"] = SymbolFlags.Value & ~SymbolFlags.SetAccessor] = "GetAccessorExcludes";
        SymbolFlags[SymbolFlags["SetAccessorExcludes"] = SymbolFlags.Value & ~SymbolFlags.GetAccessor] = "SetAccessorExcludes";
        SymbolFlags[SymbolFlags["TypeParameterExcludes"] = SymbolFlags.Type & ~SymbolFlags.TypeParameter] = "TypeParameterExcludes";
        // Imports collide with all other imports with the same name.
        SymbolFlags[SymbolFlags["ImportExcludes"] = SymbolFlags.Import] = "ImportExcludes";
        SymbolFlags[SymbolFlags["ModuleMember"] = SymbolFlags.Variable | SymbolFlags.Function | SymbolFlags.Class | SymbolFlags.Interface | SymbolFlags.Enum | SymbolFlags.Module | SymbolFlags.Import] = "ModuleMember";
        SymbolFlags[SymbolFlags["ExportHasLocal"] = SymbolFlags.Function | SymbolFlags.Class | SymbolFlags.Enum | SymbolFlags.ValueModule] = "ExportHasLocal";
        SymbolFlags[SymbolFlags["HasLocals"] = SymbolFlags.Function | SymbolFlags.Module | SymbolFlags.Method | SymbolFlags.Constructor | SymbolFlags.Accessor | SymbolFlags.Signature] = "HasLocals";
        SymbolFlags[SymbolFlags["HasExports"] = SymbolFlags.Class | SymbolFlags.Enum | SymbolFlags.Module] = "HasExports";
        SymbolFlags[SymbolFlags["HasMembers"] = SymbolFlags.Class | SymbolFlags.Interface | SymbolFlags.TypeLiteral | SymbolFlags.ObjectLiteral] = "HasMembers";
        SymbolFlags[SymbolFlags["IsContainer"] = SymbolFlags.HasLocals | SymbolFlags.HasExports | SymbolFlags.HasMembers] = "IsContainer";
        SymbolFlags[SymbolFlags["PropertyOrAccessor"] = SymbolFlags.Property | SymbolFlags.Accessor] = "PropertyOrAccessor";
        SymbolFlags[SymbolFlags["Export"] = SymbolFlags.ExportNamespace | SymbolFlags.ExportType | SymbolFlags.ExportValue] = "Export";
    })(reflect.SymbolFlags || (reflect.SymbolFlags = {}));
    var SymbolFlags = reflect.SymbolFlags;
    (function (TypeFlags) {
        TypeFlags[TypeFlags["Any"] = 0x00000001] = "Any";
        TypeFlags[TypeFlags["String"] = 0x00000002] = "String";
        TypeFlags[TypeFlags["Number"] = 0x00000004] = "Number";
        TypeFlags[TypeFlags["Boolean"] = 0x00000008] = "Boolean";
        TypeFlags[TypeFlags["Void"] = 0x00000010] = "Void";
        TypeFlags[TypeFlags["Undefined"] = 0x00000020] = "Undefined";
        TypeFlags[TypeFlags["Null"] = 0x00000040] = "Null";
        TypeFlags[TypeFlags["Enum"] = 0x00000080] = "Enum";
        TypeFlags[TypeFlags["StringLiteral"] = 0x00000100] = "StringLiteral";
        TypeFlags[TypeFlags["TypeParameter"] = 0x00000200] = "TypeParameter";
        TypeFlags[TypeFlags["Class"] = 0x00000400] = "Class";
        TypeFlags[TypeFlags["Interface"] = 0x00000800] = "Interface";
        TypeFlags[TypeFlags["Reference"] = 0x00001000] = "Reference";
        TypeFlags[TypeFlags["Tuple"] = 0x00002000] = "Tuple";
        TypeFlags[TypeFlags["Anonymous"] = 0x00004000] = "Anonymous";
        TypeFlags[TypeFlags["FromSignature"] = 0x00008000] = "FromSignature";
        TypeFlags[TypeFlags["Intrinsic"] = TypeFlags.Any | TypeFlags.String | TypeFlags.Number | TypeFlags.Boolean | TypeFlags.Void | TypeFlags.Undefined | TypeFlags.Null] = "Intrinsic";
        TypeFlags[TypeFlags["StringLike"] = TypeFlags.String | TypeFlags.StringLiteral] = "StringLike";
        TypeFlags[TypeFlags["NumberLike"] = TypeFlags.Number | TypeFlags.Enum] = "NumberLike";
        TypeFlags[TypeFlags["ObjectType"] = TypeFlags.Class | TypeFlags.Interface | TypeFlags.Reference | TypeFlags.Tuple | TypeFlags.Anonymous] = "ObjectType";
    })(reflect.TypeFlags || (reflect.TypeFlags = {}));
    var TypeFlags = reflect.TypeFlags;
    (function (SignatureKind) {
        SignatureKind[SignatureKind["Call"] = 0] = "Call";
        SignatureKind[SignatureKind["Construct"] = 1] = "Construct";
    })(reflect.SignatureKind || (reflect.SignatureKind = {}));
    var SignatureKind = reflect.SignatureKind;
    (function (IndexKind) {
        IndexKind[IndexKind["String"] = 0] = "String";
        IndexKind[IndexKind["Number"] = 1] = "Number";
    })(reflect.IndexKind || (reflect.IndexKind = {}));
    var IndexKind = reflect.IndexKind;
})(reflect || (reflect = {}));
/// <reference path="types.ts"/>
var reflect;
(function (reflect) {
    (function (NodeKind) {
        NodeKind[NodeKind["SourceFile"] = 0] = "SourceFile";
        NodeKind[NodeKind["InterfaceDeclaration"] = 1] = "InterfaceDeclaration";
        NodeKind[NodeKind["ClassDeclaration"] = 2] = "ClassDeclaration";
        NodeKind[NodeKind["EnumDeclaration"] = 3] = "EnumDeclaration";
        NodeKind[NodeKind["ModuleDeclaration"] = 4] = "ModuleDeclaration";
        NodeKind[NodeKind["FunctionDeclaration"] = 5] = "FunctionDeclaration";
        NodeKind[NodeKind["VariableDeclaration"] = 6] = "VariableDeclaration";
        NodeKind[NodeKind["ImportDeclaration"] = 7] = "ImportDeclaration";
        NodeKind[NodeKind["EnumMember"] = 8] = "EnumMember";
        NodeKind[NodeKind["Index"] = 9] = "Index";
        NodeKind[NodeKind["Field"] = 10] = "Field";
        NodeKind[NodeKind["Method"] = 11] = "Method";
        NodeKind[NodeKind["Constructor"] = 12] = "Constructor";
        NodeKind[NodeKind["GetAccessor"] = 13] = "GetAccessor";
        NodeKind[NodeKind["SetAccessor"] = 14] = "SetAccessor";
        NodeKind[NodeKind["PropertySignature"] = 15] = "PropertySignature";
        NodeKind[NodeKind["ConstructSignature"] = 16] = "ConstructSignature";
        NodeKind[NodeKind["MethodSignature"] = 17] = "MethodSignature";
        NodeKind[NodeKind["IndexSignature"] = 18] = "IndexSignature";
        NodeKind[NodeKind["CallSignature"] = 19] = "CallSignature";
        NodeKind[NodeKind["FunctionType"] = 20] = "FunctionType";
        NodeKind[NodeKind["ArrayType"] = 21] = "ArrayType";
        NodeKind[NodeKind["ConstructorType"] = 22] = "ConstructorType";
        NodeKind[NodeKind["ObjectType"] = 23] = "ObjectType";
        NodeKind[NodeKind["TypeReference"] = 24] = "TypeReference";
        NodeKind[NodeKind["StringLiteral"] = 25] = "StringLiteral";
        NodeKind[NodeKind["TupleType"] = 26] = "TupleType";
        NodeKind[NodeKind["Parameter"] = 27] = "Parameter";
        NodeKind[NodeKind["TypeParameter"] = 28] = "TypeParameter";
    })(reflect.NodeKind || (reflect.NodeKind = {}));
    var NodeKind = reflect.NodeKind;
    (function (NodeFlags) {
        NodeFlags[NodeFlags["None"] = 0] = "None";
        NodeFlags[NodeFlags["Export"] = 0x00000001] = "Export";
        NodeFlags[NodeFlags["Ambient"] = 0x00000002] = "Ambient";
        NodeFlags[NodeFlags["QuestionMark"] = 0x00000004] = "QuestionMark";
        NodeFlags[NodeFlags["Rest"] = 0x00000008] = "Rest";
        NodeFlags[NodeFlags["Public"] = 0x00000010] = "Public";
        NodeFlags[NodeFlags["Private"] = 0x00000020] = "Private";
        NodeFlags[NodeFlags["Protected"] = 0x00000040] = "Protected";
        NodeFlags[NodeFlags["Static"] = 0x00000080] = "Static";
        NodeFlags[NodeFlags["MultiLine"] = 0x00000100] = "MultiLine";
        NodeFlags[NodeFlags["Synthetic"] = 0x00000200] = "Synthetic";
        NodeFlags[NodeFlags["ExternalModule"] = 0x00000400] = "ExternalModule";
        NodeFlags[NodeFlags["Modifier"] = NodeFlags.Export | NodeFlags.Ambient | NodeFlags.Public | NodeFlags.Private | NodeFlags.Protected | NodeFlags.Static] = "Modifier";
        NodeFlags[NodeFlags["AccessibilityModifier"] = NodeFlags.Public | NodeFlags.Private | NodeFlags.Protected] = "AccessibilityModifier";
    })(reflect.NodeFlags || (reflect.NodeFlags = {}));
    var NodeFlags = reflect.NodeFlags;
    (function (NodeCheckFlags) {
        NodeCheckFlags[NodeCheckFlags["TypeChecked"] = 0x00000001] = "TypeChecked";
        NodeCheckFlags[NodeCheckFlags["LexicalThis"] = 0x00000002] = "LexicalThis";
        NodeCheckFlags[NodeCheckFlags["CaptureThis"] = 0x00000004] = "CaptureThis";
        NodeCheckFlags[NodeCheckFlags["EmitExtends"] = 0x00000008] = "EmitExtends";
        NodeCheckFlags[NodeCheckFlags["SuperInstance"] = 0x00000010] = "SuperInstance";
        NodeCheckFlags[NodeCheckFlags["SuperStatic"] = 0x00000020] = "SuperStatic";
        NodeCheckFlags[NodeCheckFlags["ContextChecked"] = 0x00000040] = "ContextChecked";
    })(reflect.NodeCheckFlags || (reflect.NodeCheckFlags = {}));
    var NodeCheckFlags = reflect.NodeCheckFlags;
})(reflect || (reflect = {}));
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
/// <reference path="../typings/node.d.ts"/>
/// <reference path="pathUtil.ts"/>
/// <reference path="nodes.ts"/>
var reflect;
(function (reflect) {
    var options = {
        noLib: false,
        noResolve: false,
        charset: "utf8"
    };
    var files = [];
    var filesByName = {};
    var seenNoDefaultLib = options.noLib;
    var initializedGlobals = false;
    var flagMap = {
        "external": 1024 /* ExternalModule */,
        "export": 1 /* Export */,
        "private": 32 /* Private */,
        "static": 128 /* Static */,
        "optional": 4 /* QuestionMark */,
        "rest": 8 /* Rest */
    };
    var flags = Object.keys(flagMap);
    var fs = require("fs");
    function getLoadedSourceFile(filename) {
        // TODO: do I need to normalize this?
        filename = reflect.getCanonicalFileName(filename);
        return reflect.hasProperty(filesByName, filename) ? filesByName[filename] : undefined;
    }
    reflect.getLoadedSourceFile = getLoadedSourceFile;
    function processRootFile(filename) {
        var sourceFile = processSourceFile(filename, false);
        bindPendingFiles();
        return sourceFile;
    }
    reflect.processRootFile = processRootFile;
    function processExternalModule(moduleName, searchPath) {
        var isRelative = reflect.isExternalModuleNameRelative(moduleName);
        if (!isRelative) {
            var symbol = reflect.getSymbol(reflect.globals, '"' + moduleName + '"', 128 /* ValueModule */);
            if (symbol) {
                return reflect.getResolvedExportSymbol(symbol);
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
                return reflect.getResolvedExportSymbol(sourceFile.symbol);
            }
            reflect.addDiagnostic(new reflect.Diagnostic(undefined, reflect.Diagnostics.File_0_is_not_an_external_module, sourceFile.filename));
            return;
        }
        reflect.addDiagnostic(new reflect.Diagnostic(undefined, reflect.Diagnostics.Cannot_find_external_module_0, moduleName));
    }
    reflect.processExternalModule = processExternalModule;
    function bindPendingFiles() {
        if (!seenNoDefaultLib) {
            processSourceFile(reflect.normalizePath(getDefaultLibFilename()), true);
        }
        reflect.forEach(files, reflect.bindSourceFile);
        files = [];
        if (!initializedGlobals) {
            reflect.initializeGlobalTypes();
            initializedGlobals = true;
        }
    }
    // TODO: move to host
    // TODO: make configurable
    function getDefaultLibFilename() {
        return reflect.combinePaths(reflect.normalizePath(__dirname), "lib.core.d.json");
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
            reflect.addDiagnostic(new reflect.Diagnostic(refFile, diagnostic, filename));
        }
        return ret;
    }
    // Get source file from normalized filename
    function findSourceFile(filename, isDefaultLib, refFile) {
        var canonicalName = reflect.getCanonicalFileName(filename);
        if (reflect.hasProperty(filesByName, canonicalName)) {
            // We've already looked for this file, use cached result
            var file = filesByName[canonicalName];
            if (file && reflect.useCaseSensitiveFileNames && canonicalName !== file.filename) {
                reflect.addDiagnostic(new reflect.Diagnostic(refFile, reflect.Diagnostics.Filename_0_differs_from_already_included_filename_1_only_in_casing, filename, file.filename));
            }
        }
        else {
            try {
                var file = filesByName[canonicalName] = readSourceFile(filename);
            }
            catch (e) {
                reflect.addDiagnostic(new reflect.Diagnostic(refFile, reflect.Diagnostics.Cannot_read_file_0_Colon_1, filename, e.message));
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
    function readSourceFile(filename) {
        if (!fs.existsSync(filename)) {
            return undefined;
        }
        var text = fs.readFileSync(filename, options.charset);
        if (text) {
            if (!reflect.isRelativePath(filename)) {
                filename = "./" + filename;
            }
            return createSourceFile(filename, text);
        }
    }
    function processReferencedFiles(file, basePath) {
        reflect.forEach(file.references, function (filename) {
            processSourceFile(reflect.normalizePath(reflect.combinePaths(basePath, filename)), false, file);
        });
    }
    function processImportedModules(file, basePath) {
        reflect.forEach(file.declares, function (node) {
            if (node.kind === 7 /* ImportDeclaration */ && node.require) {
                var moduleName = node.require;
                if (moduleName) {
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
            }
            else if (node.kind === 4 /* ModuleDeclaration */ && (node.flags & 1024 /* ExternalModule */)) {
                // TypeScript 1.0 spec (April 2014): 12.1.6
                // An AmbientExternalModuleDeclaration declares an external module.
                // This type of declaration is permitted only in the global module.
                // The StringLiteral must specify a top - level external module name.
                // Relative external module names are not permitted
                reflect.forEachChild(node, function (node) {
                    if (node.kind === 7 /* ImportDeclaration */ && node.require) {
                        var moduleName = node.require;
                        if (moduleName) {
                            // TypeScript 1.0 spec (April 2014): 12.1.6
                            // An ExternalImportDeclaration in anAmbientExternalModuleDeclaration may reference other external modules
                            // only through top - level external module names. Relative external module names are not permitted.
                            var searchName = reflect.normalizePath(reflect.combinePaths(basePath, moduleName));
                            findSourceFile(searchName + ".d.json", false, file);
                        }
                    }
                });
            }
        });
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
                parameter.kind = 28 /* TypeParameter */;
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
            node.kind = 8 /* EnumMember */;
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
            node.kind = 27 /* Parameter */;
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
            node.kind = 9 /* Index */;
            scanFlags(node);
            scanParameterDeclaration(node.parameter);
            scanChildTypeNode(node, "returns");
        }
        function scanFieldDeclaration(node) {
            node.kind = 10 /* Field */;
            scanFlags(node);
            scanChildTypeNode(node, "type");
        }
        function scanMethodDeclaration(node) {
            scanCallSignature(node, 11 /* Method */);
        }
        function scanConstructorDeclaration(node) {
            scanCallSignature(node, 12 /* Constructor */);
        }
        function scanGetAccessorDeclaration(node) {
            node.kind = 13 /* GetAccessor */;
            scanFlags(node);
            scanChildTypeNode(node, "returns");
        }
        function scanSetAccessorDeclaration(node) {
            node.kind = 14 /* SetAccessor */;
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
            node.kind = 15 /* PropertySignature */;
            scanFlags(node);
            scanChildTypeNode(node, "type");
        }
        function scanConstructSignatureDeclaration(node) {
            scanCallSignature(node, 16 /* ConstructSignature */);
        }
        function scanMethodSignatureDeclaration(node) {
            scanCallSignature(node, 17 /* MethodSignature */);
        }
        function scanIndexSignatureDeclaration(node) {
            node.kind = 18 /* IndexSignature */;
            scanFlags(node);
            scanParameterDeclaration(node.parameter);
            scanChildTypeNode(node, "returns");
        }
        function scanCallSignatureDeclaration(node) {
            scanCallSignature(node, 19 /* CallSignature */);
        }
        function scanCallSignature(node, kind) {
            node.kind = kind;
            scanFlags(node);
            scanTypeParameterDeclarations(node.typeParameters);
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
            scanCallSignature(node, 20 /* FunctionType */);
        }
        function scanArrayTypeNode(node) {
            node.kind = 21 /* ArrayType */;
            scanChildTypeNode(node, "type");
        }
        function scanTupleTypeNode(node) {
            node.kind = 26 /* TupleType */;
            scanTypeNodes(node.types);
        }
        function scanConstructorTypeNode(node) {
            scanCallSignature(node, 22 /* ConstructorType */);
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
                kind: 24 /* TypeReference */,
                flags: 0 /* None */,
                type: typeName
            };
        }
        function createStringLiteralTypeNode(stringLiteral) {
            return {
                kind: 25 /* StringLiteral */,
                flags: 0 /* None */,
                text: stringLiteral.replace(/^"|"$/g, "")
            };
        }
        function scanTypeReferenceNode(node) {
            node.kind = 24 /* TypeReference */;
            node.flags = 0 /* None */;
        }
        function scanObjectTypeNode(node) {
            node.kind = 23 /* ObjectType */;
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
            reflect.addDiagnostic(new reflect.Diagnostic(undefined, reflect.Diagnostics.File_0_has_invalid_json_format_1, filename, e.message));
            return;
        }
        if (file) {
            file.filename = filename;
            scanSourceFile(file);
        }
        return file;
    }
})(reflect || (reflect = {}));
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
        Index_signatures_are_incompatible_Colon: { code: 2330, category: 1 /* Error */, key: "Index signatures are incompatible:" },
        Index_signature_is_missing_in_type_0: { code: 2329, category: 1 /* Error */, key: "Index signature is missing in type '{0}'." },
        Types_of_parameters_0_and_1_are_incompatible_Colon: { code: 2328, category: 1 /* Error */, key: "Types of parameters '{0}' and '{1}' are incompatible:" },
        Required_property_0_cannot_be_reimplemented_with_optional_property_in_1: { code: 2327, category: 1 /* Error */, key: "Required property '{0}' cannot be reimplemented with optional property in '{1}'." },
        Types_of_property_0_are_incompatible_Colon: { code: 2326, category: 1 /* Error */, key: "Types of property '{0}' are incompatible:" },
        Type_0_is_not_assignable_to_type_1_Colon: { code: 2322, category: 1 /* Error */, key: "Type '{0}' is not assignable to type '{1}':" },
        Type_0_is_not_assignable_to_type_1: { code: 2323, category: 1 /* Error */, key: "Type '{0}' is not assignable to type '{1}'." },
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
})(reflect || (reflect = {}));
/*! *****************************************************************************
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
var reflect;
(function (reflect) {
    function bindSourceFile(file) {
        var parent;
        var container;
        var lastContainer;
        if (!file.locals) {
            file.locals = {};
            container = file;
            bind(file);
        }
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
            return new reflect.SymbolImpl(flags, name);
        }
        function addDeclarationToSymbol(symbol, node, symbolKind) {
            symbol.flags |= symbolKind;
            if (!symbol.declarations)
                symbol.declarations = [];
            symbol.declarations.push(node);
            if (symbolKind & reflect.SymbolFlags.HasExports && !symbol.exports)
                symbol.exports = {};
            if (symbolKind & reflect.SymbolFlags.HasMembers && !symbol.members)
                symbol.members = {};
            node.symbol = symbol;
            if (symbolKind & reflect.SymbolFlags.Value && !symbol.valueDeclaration)
                symbol.valueDeclaration = node;
        }
        function getDeclarationName(node) {
            if (node.name) {
                if (node.kind === 4 /* ModuleDeclaration */ && node.flags & 1024 /* ExternalModule */) {
                    return '"' + node.name + '"';
                }
                return node.name;
            }
            switch (node.kind) {
                case 12 /* Constructor */:
                    return "__constructor";
                case 19 /* CallSignature */:
                    return "__call";
                case 16 /* ConstructSignature */:
                    return "__new";
                case 18 /* IndexSignature */:
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
                    reflect.addDiagnostic(new reflect.Diagnostic(file, reflect.Diagnostics.Duplicate_identifier_0, getDisplayName(node)));
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
                var prototypeSymbol = createSymbol(2 /* Property */ | 67108864 /* Prototype */, "prototype");
                if (reflect.hasProperty(symbol.exports, prototypeSymbol.name)) {
                    reflect.addDiagnostic(new reflect.Diagnostic(file, reflect.Diagnostics.Duplicate_identifier_0, prototypeSymbol.name));
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
            if (symbolKind & reflect.SymbolFlags.Value) {
                exportKind |= 524288 /* ExportValue */;
            }
            if (symbolKind & reflect.SymbolFlags.Type) {
                exportKind |= 1048576 /* ExportType */;
            }
            if (symbolKind & reflect.SymbolFlags.Namespace) {
                exportKind |= 2097152 /* ExportNamespace */;
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
        function bindChildren(node, symbolKind) {
            if (symbolKind & reflect.SymbolFlags.HasLocals) {
                node.locals = {};
            }
            var saveParent = parent;
            var saveContainer = container;
            parent = node;
            if (symbolKind & reflect.SymbolFlags.IsContainer) {
                container = node;
                // If container is not on container list, add it to the list
                if (lastContainer !== container && !container.nextContainer) {
                    if (lastContainer) {
                        lastContainer.nextContainer = container;
                    }
                    lastContainer = container;
                }
            }
            forEachChild(node, bind);
            container = saveContainer;
            parent = saveParent;
        }
        function bindDeclaration(node, symbolKind, symbolExcludes) {
            switch (container.kind) {
                case 4 /* ModuleDeclaration */:
                    declareModuleMember(node, symbolKind, symbolExcludes);
                    break;
                case 0 /* SourceFile */:
                    if (container.flags & 1024 /* ExternalModule */) {
                        declareModuleMember(node, symbolKind, symbolExcludes);
                        break;
                    }
                    else {
                        declareSymbol(reflect.globals, undefined, node, symbolKind, symbolExcludes);
                    }
                    break;
                case 19 /* CallSignature */:
                case 16 /* ConstructSignature */:
                case 18 /* IndexSignature */:
                case 11 /* Method */:
                case 12 /* Constructor */:
                case 13 /* GetAccessor */:
                case 14 /* SetAccessor */:
                case 5 /* FunctionDeclaration */:
                    declareSymbol(container.locals, undefined, node, symbolKind, symbolExcludes);
                    break;
                case 2 /* ClassDeclaration */:
                    if (node.flags & 128 /* Static */) {
                        declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                        break;
                    }
                case 23 /* ObjectType */:
                case 1 /* InterfaceDeclaration */:
                    declareSymbol(container.symbol.members, container.symbol, node, symbolKind, symbolExcludes);
                    break;
                case 3 /* EnumDeclaration */:
                    declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                    break;
            }
            bindChildren(node, symbolKind);
        }
        function bindConstructorDeclaration(node) {
            bindDeclaration(node, 4096 /* Constructor */, 0);
            reflect.forEach(node.parameters, function (p) {
                if (p.flags & (16 /* Public */ | 32 /* Private */ | 64 /* Protected */)) {
                    bindDeclaration(p, 2 /* Property */, reflect.SymbolFlags.PropertyExcludes);
                }
            });
        }
        function bindModuleDeclaration(node) {
            if (node.flags & 1024 /* ExternalModule */) {
                bindDeclaration(node, 128 /* ValueModule */, reflect.SymbolFlags.ValueModuleExcludes);
            }
            else if (isInstantiated(node)) {
                bindDeclaration(node, 128 /* ValueModule */, reflect.SymbolFlags.ValueModuleExcludes);
            }
            else {
                bindDeclaration(node, 256 /* NamespaceModule */, 0 /* NamespaceModuleExcludes */);
            }
        }
        function bindAnonymousDeclaration(node, symbolKind, name) {
            var symbol = createSymbol(symbolKind, name);
            addDeclarationToSymbol(symbol, node, symbolKind);
            bindChildren(node, symbolKind);
        }
        function bind(node) {
            node.parent = parent;
            switch (node.kind) {
                case 28 /* TypeParameter */:
                    bindDeclaration(node, 262144 /* TypeParameter */, reflect.SymbolFlags.TypeParameterExcludes);
                    break;
                case 27 /* Parameter */:
                    bindDeclaration(node, 1 /* Variable */, reflect.SymbolFlags.ParameterExcludes);
                    break;
                case 6 /* VariableDeclaration */:
                    bindDeclaration(node, 1 /* Variable */, reflect.SymbolFlags.VariableExcludes);
                    break;
                case 10 /* Field */:
                case 15 /* PropertySignature */:
                    bindDeclaration(node, 2 /* Property */, reflect.SymbolFlags.PropertyExcludes);
                    break;
                case 8 /* EnumMember */:
                    bindDeclaration(node, 4 /* EnumMember */, reflect.SymbolFlags.EnumMemberExcludes);
                    break;
                case 19 /* CallSignature */:
                    bindDeclaration(node, 32768 /* CallSignature */, 0);
                    break;
                case 11 /* Method */:
                case 17 /* MethodSignature */:
                    bindDeclaration(node, 2048 /* Method */, reflect.SymbolFlags.MethodExcludes);
                    break;
                case 16 /* ConstructSignature */:
                    bindDeclaration(node, 65536 /* ConstructSignature */, 0);
                    break;
                case 18 /* IndexSignature */:
                    bindDeclaration(node, 131072 /* IndexSignature */, 0);
                    break;
                case 5 /* FunctionDeclaration */:
                    bindDeclaration(node, 8 /* Function */, reflect.SymbolFlags.FunctionExcludes);
                    break;
                case 12 /* Constructor */:
                    bindConstructorDeclaration(node);
                    break;
                case 13 /* GetAccessor */:
                    bindDeclaration(node, 8192 /* GetAccessor */, reflect.SymbolFlags.GetAccessorExcludes);
                    break;
                case 14 /* SetAccessor */:
                    bindDeclaration(node, 16384 /* SetAccessor */, reflect.SymbolFlags.SetAccessorExcludes);
                    break;
                case 22 /* ConstructorType */:
                case 20 /* FunctionType */:
                case 21 /* ArrayType */:
                case 23 /* ObjectType */:
                    bindAnonymousDeclaration(node, 512 /* TypeLiteral */, "__type");
                    break;
                case 2 /* ClassDeclaration */:
                    bindDeclaration(node, 16 /* Class */, reflect.SymbolFlags.ClassExcludes);
                    break;
                case 1 /* InterfaceDeclaration */:
                    bindDeclaration(node, 32 /* Interface */, reflect.SymbolFlags.InterfaceExcludes);
                    break;
                case 3 /* EnumDeclaration */:
                    bindDeclaration(node, 64 /* Enum */, reflect.SymbolFlags.EnumExcludes);
                    break;
                case 4 /* ModuleDeclaration */:
                    bindModuleDeclaration(node);
                    break;
                case 7 /* ImportDeclaration */:
                    bindDeclaration(node, 4194304 /* Import */, reflect.SymbolFlags.ImportExcludes);
                    break;
                case 0 /* SourceFile */:
                    if (node.flags & 1024 /* ExternalModule */) {
                        bindAnonymousDeclaration(node, 128 /* ValueModule */, '"' + reflect.removeFileExtension(node.filename) + '"');
                        break;
                    }
                default:
                    var saveParent = parent;
                    parent = node;
                    forEachChild(node, bind);
                    parent = saveParent;
            }
        }
    }
    reflect.bindSourceFile = bindSourceFile;
    // Invokes a callback for each child of the given node. The 'cbNode' callback is invoked for all child nodes
    // stored in properties. If a 'cbNodes' callback is specified, it is invoked for embedded arrays; otherwise,
    // embedded arrays are flattened and the 'cbNode' callback is invoked for each element. If a callback returns
    // a truthy value, iteration stops and that value is returned. Otherwise, undefined is returned.
    function forEachChild(node, cbNode, cbNodes) {
        function child(node) {
            if (node)
                return cbNode(node);
        }
        function children(nodes) {
            if (nodes) {
                if (cbNodes)
                    return cbNodes(nodes);
                var result;
                for (var i = 0, len = nodes.length; i < len; i++) {
                    if (result = cbNode(nodes[i]))
                        break;
                }
                return result;
            }
        }
        if (!node)
            return;
        switch (node.kind) {
            case 0 /* SourceFile */:
                return children(node.declares);
            case 1 /* InterfaceDeclaration */:
                return children(node.typeParameters) || children(node.extends) || children(node.signatures);
            case 2 /* ClassDeclaration */:
                return children(node.typeParameters) || child(node.extends) || children(node.implements) || children(node.members);
            case 3 /* EnumDeclaration */:
                return children(node.members);
            case 4 /* ModuleDeclaration */:
                return children(node.declares);
            case 19 /* CallSignature */:
            case 16 /* ConstructSignature */:
            case 17 /* MethodSignature */:
            case 12 /* Constructor */:
            case 11 /* Method */:
            case 5 /* FunctionDeclaration */:
            case 22 /* ConstructorType */:
            case 20 /* FunctionType */:
                return children(node.typeParameters) || children(node.parameters) || child(node.returns);
            case 10 /* Field */:
            case 6 /* VariableDeclaration */:
            case 15 /* PropertySignature */:
                return child(node.type);
            case 9 /* Index */:
            case 13 /* GetAccessor */:
            case 14 /* SetAccessor */:
            case 18 /* IndexSignature */:
                return child(node.parameter) || child(node.returns);
            case 21 /* ArrayType */:
                return child(node.type);
            case 23 /* ObjectType */:
                return children(node.signatures);
            case 24 /* TypeReference */:
                return children(node.arguments);
            case 27 /* Parameter */:
                return child(node.type);
            case 28 /* TypeParameter */:
                return child(node.constraint);
        }
    }
    reflect.forEachChild = forEachChild;
})(reflect || (reflect = {}));
var reflect;
(function (reflect) {
    var TypeImpl = (function () {
        function TypeImpl(flags) {
            this.flags = flags;
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
            if (inherit) {
                reflect.forEach(this.baseTypes, function (baseType) {
                    annotations = (baseType.getAnnotations(name, inherit)).concat(annotations);
                });
            }
            return annotations;
        };
        TypeImpl.prototype.getFlags = function () {
            return this.flags;
        };
        TypeImpl.prototype.getProperties = function () {
            return reflect.getPropertiesOfType(this);
        };
        TypeImpl.prototype.getProperty = function (name) {
            return reflect.getPropertyOfType(this, name);
        };
        TypeImpl.prototype.getCallSignatures = function () {
            return reflect.getSignaturesOfType(this, 0 /* Call */);
        };
        TypeImpl.prototype.getConstructSignatures = function () {
            return reflect.getSignaturesOfType(this, 1 /* Construct */);
        };
        TypeImpl.prototype.getStringIndexType = function () {
            return reflect.getIndexTypeOfType(this, 0 /* String */);
        };
        TypeImpl.prototype.getNumberIndexType = function () {
            return reflect.getIndexTypeOfType(this, 1 /* Number */);
        };
        TypeImpl.prototype.isIdenticalTo = function (target, diagnostics) {
            return reflect.isTypeIdenticalTo(this, target, diagnostics);
        };
        TypeImpl.prototype.isSubtypeOf = function (target, diagnostics) {
            return reflect.isTypeSubtypeOf(this, target, diagnostics);
        };
        TypeImpl.prototype.isAssignableTo = function (target, diagnostics) {
            return reflect.isTypeAssignableTo(this, target, diagnostics);
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
        TypeImpl.prototype.isAnonymous = function () {
            return (this.flags & 16384 /* Anonymous */) !== 0;
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
            return (this.flags & reflect.TypeFlags.Intrinsic) !== 0;
        };
        TypeImpl.prototype.isObjectType = function () {
            return (this.flags & reflect.TypeFlags.ObjectType) !== 0;
        };
        return TypeImpl;
    })();
    reflect.TypeImpl = TypeImpl;
})(reflect || (reflect = {}));
var reflect;
(function (reflect) {
    var SymbolImpl = (function () {
        function SymbolImpl(flags, name) {
            this.flags = flags;
            this.name = name;
        }
        SymbolImpl.prototype.resolve = function (name, meaning) {
            if (meaning === void 0) { meaning = reflect.SymbolFlags.Namespace | reflect.SymbolFlags.Type | reflect.SymbolFlags.Value; }
            if (!name) {
                throw new Error("Missing required argument 'name'.");
            }
            if (!this.declarations || this.declarations.length == 0) {
                return undefined;
            }
            var ret = reflect.resolveEntityName(this.declarations[0], name, meaning);
            if (reflect.hasDiagnosticErrors) {
                reflect.throwDiagnosticError();
            }
            return ret;
        };
        SymbolImpl.prototype.getFullName = function () {
            return reflect.symbolToString(this);
        };
        SymbolImpl.prototype.getName = function () {
            return this.name;
        };
        SymbolImpl.prototype.getFlags = function () {
            return this.flags;
        };
        SymbolImpl.prototype.getDescription = function () {
            return reflect.forEach(this.declarations, function (x) { return x.description; });
        };
        // TODO: list all symbols in symbol? List all types in symbol? List all symbols with annotation?
        SymbolImpl.prototype.getAnnotations = function (name) {
            return getAnnotationsFromSymbolOrSignature(name, this);
        };
        SymbolImpl.prototype.getType = function () {
            // TODO:  return unknown type as undefined? or maybe this is better. We can still have a way to check for
            // unknown but code that wants to get properties of type or something can continue without a separate check.
            return reflect.getTypeOfSymbol(this);
        };
        SymbolImpl.prototype.getDeclaredType = function () {
            var ret = reflect.getDeclaredTypeOfSymbol(this);
            if (reflect.hasDiagnosticErrors) {
                reflect.throwDiagnosticError();
            }
            return ret;
        };
        SymbolImpl.prototype.isOptionalProperty = function () {
            // TODO: this can be simplified if we disallow constructor properties in JSON declaration
            //  class C {
            //      constructor(public x?) { }
            //  }
            //
            // x is an optional parameter, but it is a required property.
            return this.valueDeclaration && this.valueDeclaration.flags & 4 /* QuestionMark */ && this.valueDeclaration.kind !== 27 /* Parameter */;
        };
        SymbolImpl.prototype.isVariable = function () {
            return (this.flags & 1 /* Variable */) !== 0;
        };
        SymbolImpl.prototype.isFunction = function () {
            return (this.flags & 8 /* Function */) !== 0;
        };
        SymbolImpl.prototype.isClass = function () {
            return (this.flags & 16 /* Class */) !== 0;
        };
        SymbolImpl.prototype.isInterface = function () {
            return (this.flags & 32 /* Interface */) !== 0;
        };
        SymbolImpl.prototype.isEnum = function () {
            return (this.flags & 64 /* Enum */) !== 0;
        };
        SymbolImpl.prototype.isModule = function () {
            return (this.flags & reflect.SymbolFlags.Module) !== 0;
        };
        SymbolImpl.prototype.isImport = function () {
            return (this.flags & 4194304 /* Import */) !== 0;
        };
        SymbolImpl.prototype.isTypeParameter = function () {
            return (this.flags & 262144 /* TypeParameter */) !== 0;
        };
        SymbolImpl.prototype.isProperty = function () {
            return (this.flags & 2 /* Property */) !== 0;
        };
        SymbolImpl.prototype.isMethod = function () {
            return (this.flags & 2048 /* Method */) !== 0;
        };
        SymbolImpl.prototype.isAccessor = function () {
            return (this.flags & reflect.SymbolFlags.Accessor) !== 0;
        };
        SymbolImpl.prototype.isGetAccessor = function () {
            return (this.flags & 8192 /* GetAccessor */) !== 0;
        };
        SymbolImpl.prototype.isSetAccessor = function () {
            return (this.flags & 16384 /* SetAccessor */) !== 0;
        };
        SymbolImpl.prototype.isEnumMember = function () {
            return (this.flags & 4 /* EnumMember */) !== 0;
        };
        return SymbolImpl;
    })();
    reflect.SymbolImpl = SymbolImpl;
    function getAnnotationsFromSymbolOrSignature(name, container) {
        if (!container.annotations) {
            container.annotations = [];
            container.annotationsByName = {};
            reflect.forEach(container.declarations || [container.declaration], function (declaration) {
                reflect.forEach(declaration.annotations, function (annotation) {
                    var list = container.annotationsByName[annotation.name];
                    if (!list) {
                        list = container.annotationsByName[annotation.name] = [];
                    }
                    list.push(annotation);
                    container.annotations.push(annotation);
                });
            });
        }
        if (name) {
            return container.annotationsByName[name] || [];
        }
        return container.annotations;
    }
    reflect.getAnnotationsFromSymbolOrSignature = getAnnotationsFromSymbolOrSignature;
})(reflect || (reflect = {}));
var reflect;
(function (reflect) {
    var SignatureImpl = (function () {
        function SignatureImpl() {
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
            return reflect.getReturnTypeOfSignature(this);
        };
        SignatureImpl.prototype.getAnnotations = function (name) {
            return reflect.getAnnotationsFromSymbolOrSignature(name, this);
        };
        return SignatureImpl;
    })();
    reflect.SignatureImpl = SignatureImpl;
})(reflect || (reflect = {}));
/// <reference path="arrayUtil.ts"/>
/// <reference path="nodes.ts"/>
/// <reference path="diagnostics.ts"/>
/// <reference path="types.ts"/>
/// <reference path="typeImpl.ts"/>
/// <reference path="symbolImpl.ts"/>
/// <reference path="signatureImpl.ts"/>
var reflect;
(function (reflect) {
    var nextSymbolId = 1;
    var nextNodeId = 1;
    var typeCount = 0;
    var emptyArray = [];
    var emptySymbols = {};
    var unknownSymbol = createSymbol(2 /* Property */ | 33554432 /* Transient */, "unknown");
    var resolvingSymbol = createSymbol(33554432 /* Transient */, "__resolving__");
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
    reflect.globals = {};
    var globalArraySymbol;
    var globalObjectType;
    var globalFunctionType;
    var globalArrayType;
    var globalStringType;
    var globalNumberType;
    var globalBooleanType;
    var tupleTypes = {};
    var stringLiteralTypes = {};
    var symbolLinks = [];
    var nodeLinks = [];
    var CharacterCodes;
    (function (CharacterCodes) {
        CharacterCodes[CharacterCodes["_"] = 0x5F] = "_";
    })(CharacterCodes || (CharacterCodes = {}));
    function error(location, message, arg0, arg1, arg2) {
        reflect.addDiagnostic(new reflect.Diagnostic(getSourceFile(location), message, arg0, arg1, arg2));
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
        return new reflect.SymbolImpl(flags, name);
    }
    function getSymbolLinks(symbol) {
        if (symbol.flags & 33554432 /* Transient */)
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
    reflect.getSourceFile = getSourceFile;
    function isGlobalSourceFile(node) {
        return node.kind === 0 /* SourceFile */ && !isExternalModule(node);
    }
    function isExternalModule(file) {
        return (file.flags & 1024 /* ExternalModule */) !== 0;
    }
    function getSymbol(symbols, name, meaning) {
        if (meaning && reflect.hasProperty(symbols, name)) {
            var symbol = symbols[name];
            if (symbol.flags & meaning) {
                return symbol;
            }
            if (symbol.flags & 4194304 /* Import */) {
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
    reflect.getSymbol = getSymbol;
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
                    if (result = getSymbol(getSymbolOfNode(location).exports, name, meaning & reflect.SymbolFlags.ModuleMember)) {
                        return returnResolvedSymbol(result);
                    }
                    break;
                case 3 /* EnumDeclaration */:
                    if (result = getSymbol(getSymbolOfNode(location).exports, name, meaning & 4 /* EnumMember */)) {
                        return returnResolvedSymbol(result);
                    }
                    break;
                case 2 /* ClassDeclaration */:
                case 1 /* InterfaceDeclaration */:
                    if (result = getSymbol(getSymbolOfNode(location).members, name, meaning & reflect.SymbolFlags.Type)) {
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
        if (result = getSymbol(reflect.globals, name, meaning)) {
            return returnResolvedSymbol(result);
        }
        return returnResolvedSymbol(undefined);
    }
    function resolveImport(symbol) {
        var links = getSymbolLinks(symbol);
        if (!links.target) {
            links.target = resolvingSymbol;
            var node = getDeclarationOfKind(symbol, 7 /* ImportDeclaration */);
            var target = node.require ? resolveExternalModuleName(node, node.require) : resolveEntityName(node, node.value, reflect.SymbolFlags.Value | reflect.SymbolFlags.Type | reflect.SymbolFlags.Namespace);
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
            var namespace = resolveEntityName(location, name, reflect.SymbolFlags.Namespace);
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
    reflect.resolveEntityName = resolveEntityName;
    function isExternalModuleNameRelative(moduleName) {
        // TypeScript 1.0 spec (April 2014): 11.2.1
        // An external module name is "relative" if the first term is "." or "..".
        return moduleName.substr(0, 2) === "./" || moduleName.substr(0, 3) === "../" || moduleName.substr(0, 2) === ".\\" || moduleName.substr(0, 3) === "..\\";
    }
    reflect.isExternalModuleNameRelative = isExternalModuleNameRelative;
    function resolveExternalModuleName(location, moduleName) {
        if (!moduleName)
            return;
        var searchPath = reflect.getDirectoryPath(getSourceFile(location).filename);
        var isRelative = isExternalModuleNameRelative(moduleName);
        if (!isRelative) {
            var symbol = getSymbol(reflect.globals, '"' + moduleName + '"', 128 /* ValueModule */);
            if (symbol) {
                return getResolvedExportSymbol(symbol);
            }
        }
        while (true) {
            var filename = reflect.normalizePath(reflect.combinePaths(searchPath, moduleName));
            var sourceFile = reflect.getLoadedSourceFile(filename + ".d.json");
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
            if (symbol.flags & (reflect.SymbolFlags.Value | reflect.SymbolFlags.Type | reflect.SymbolFlags.Namespace)) {
                return symbol;
            }
            if (symbol.flags & 4194304 /* Import */) {
                return resolveImport(symbol);
            }
        }
        return moduleSymbol;
    }
    reflect.getResolvedExportSymbol = getResolvedExportSymbol;
    function getExportAssignmentSymbol(symbol) {
        var symbolLinks = getSymbolLinks(symbol);
        if (!symbolLinks.exportAssignSymbol) {
            var block = getBlockWithExportAssignment(symbol);
            if (block) {
                var meaning = reflect.SymbolFlags.Value | reflect.SymbolFlags.Type | reflect.SymbolFlags.Namespace;
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
        // If the symbol has the value flag, it is trivially a value.
        if (symbol.flags & reflect.SymbolFlags.Value) {
            return true;
        }
        // If it is an import, then it is a value if the symbol it resolves to is a value.
        if (symbol.flags & 4194304 /* Import */) {
            return (resolveImport(symbol).flags & reflect.SymbolFlags.Value) !== 0;
        }
        // If it is an instantiated symbol, then it is a value if the symbol it is an
        // instantiation of is a value.
        if (symbol.flags & 8388608 /* Instantiated */) {
            return (getSymbolLinks(symbol).target.flags & reflect.SymbolFlags.Value) !== 0;
        }
        return false;
    }
    function createType(flags) {
        var result = new reflect.TypeImpl(flags);
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
        return setObjectTypeMembers(createObjectType(16384 /* Anonymous */, symbol), members, callSignatures, constructSignatures, stringIndexType, numberIndexType);
    }
    function isOptionalProperty(propertySymbol) {
        //  class C {
        //      constructor(public x?) { }
        //  }
        //
        // x is an optional parameter, but it is a required property.
        return propertySymbol.valueDeclaration && propertySymbol.valueDeclaration.flags & 4 /* QuestionMark */ && propertySymbol.valueDeclaration.kind !== 27 /* Parameter */;
    }
    function getApparentType(type) {
        if (type.flags & 512 /* TypeParameter */) {
            do {
                type = getConstraintOfTypeParameter(type);
            } while (type && type.flags & 512 /* TypeParameter */);
            if (!type)
                type = emptyObjectType;
        }
        if (type.flags & reflect.TypeFlags.StringLike) {
            type = globalStringType;
        }
        else if (type.flags & reflect.TypeFlags.NumberLike) {
            type = globalNumberType;
        }
        else if (type.flags & 8 /* Boolean */) {
            type = globalBooleanType;
        }
        return type;
    }
    function getTypeOfPrototypeProperty(prototype) {
        // TypeScript 1.0 spec (April 2014): 8.4
        // Every class automatically contains a static property member named 'prototype',
        // the type of which is an instantiation of the class type with type Any supplied as a type argument for each type parameter.
        // It is an error to explicitly declare a static property member with the name 'prototype'.
        var classType = getDeclaredTypeOfSymbol(prototype.parent);
        return classType.typeParameters ? createTypeReference(classType, reflect.map(classType.typeParameters, function (_) { return anyType; })) : classType;
    }
    function getTypeOfVariableDeclaration(declaration) {
        // Use type from type annotation if one is present
        if (declaration.type) {
            return getTypeFromTypeNode(declaration.type);
        }
        if (declaration.kind === 27 /* Parameter */) {
            var func = declaration.parent;
            // For a parameter of a set accessor, use the type of the get accessor if one is present
            if (func.kind === 14 /* SetAccessor */) {
                var getter = getDeclarationOfKind(declaration.parent.symbol, 13 /* GetAccessor */);
                if (getter) {
                    return getReturnTypeOfSignature(getSignatureFromDeclaration(getter));
                }
            }
        }
        // Rest parameters default to type any[], other parameters default to type any
        var type = declaration.flags & 8 /* Rest */ ? createArrayType(anyType) : anyType;
        return type;
    }
    function getTypeOfVariableOrParameterOrProperty(symbol) {
        var links = getSymbolLinks(symbol);
        if (!links.type) {
            // Handle prototype property
            if (symbol.flags & 67108864 /* Prototype */) {
                return links.type = getTypeOfPrototypeProperty(symbol);
            }
            var declaration = symbol.valueDeclaration;
            // Handle variable, parameter or property
            links.type = resolvingType;
            var type = getTypeOfVariableDeclaration(declaration);
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
            if (accessor.kind === 13 /* GetAccessor */) {
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
            var getter = getDeclarationOfKind(symbol, 13 /* GetAccessor */);
            var setter = getDeclarationOfKind(symbol, 14 /* SetAccessor */);
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
            links.type = createObjectType(16384 /* Anonymous */, symbol);
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
        if (symbol.flags & (1 /* Variable */ | 2 /* Property */)) {
            return getTypeOfVariableOrParameterOrProperty(symbol);
        }
        if (symbol.flags & (8 /* Function */ | 2048 /* Method */ | 16 /* Class */ | 64 /* Enum */ | 128 /* ValueModule */)) {
            return getTypeOfFuncClassEnumModule(symbol);
        }
        if (symbol.flags & 4 /* EnumMember */) {
            return getTypeOfEnumMember(symbol);
        }
        if (symbol.flags & reflect.SymbolFlags.Accessor) {
            return getTypeOfAccessors(symbol);
        }
        if (symbol.flags & 4194304 /* Import */) {
            return getTypeOfImport(symbol);
        }
        if (symbol.flags & 8388608 /* Instantiated */) {
            return getTypeOfInstantiatedSymbol(symbol);
        }
        return unknownType;
    }
    reflect.getTypeOfSymbol = getTypeOfSymbol;
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
            if (declaration.extends) {
                var baseType = getTypeFromTypeReferenceNode(declaration.extends);
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
                        error(declaration.extends, reflect.Diagnostics.A_class_may_only_extend_another_class);
                    }
                }
            }
            type.declaredProperties = getNamedMembers(symbol.members);
            type.declaredCallSignatures = emptyArray;
            type.declaredConstructSignatures = emptyArray;
            type.declaredStringIndexType = getIndexTypeOfSymbol(symbol, 0 /* String */);
            type.declaredNumberIndexType = getIndexTypeOfSymbol(symbol, 1 /* Number */);
        }
        return links.declaredType;
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
                if (declaration.kind === 1 /* InterfaceDeclaration */ && declaration.extends) {
                    reflect.forEach(declaration.extends, function (node) {
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
            if (!getDeclarationOfKind(symbol, 28 /* TypeParameter */).constraint) {
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
        if (symbol.flags & 16 /* Class */) {
            return getDeclaredTypeOfClass(symbol);
        }
        if (symbol.flags & 32 /* Interface */) {
            return getDeclaredTypeOfInterface(symbol);
        }
        if (symbol.flags & 64 /* Enum */) {
            return getDeclaredTypeOfEnum(symbol);
        }
        if (symbol.flags & 262144 /* TypeParameter */) {
            return getDeclaredTypeOfTypeParameter(symbol);
        }
        if (symbol.flags & 4194304 /* Import */) {
            return getDeclaredTypeOfImport(symbol);
        }
        return unknownType;
    }
    reflect.getDeclaredTypeOfSymbol = getDeclaredTypeOfSymbol;
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
                addInheritedMembers(members, getPropertiesOfType(baseType));
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
            addInheritedMembers(members, getPropertiesOfType(instantiatedBaseType));
            callSignatures = reflect.concatenate(callSignatures, getSignaturesOfType(instantiatedBaseType, 0 /* Call */));
            constructSignatures = reflect.concatenate(constructSignatures, getSignaturesOfType(instantiatedBaseType, 1 /* Construct */));
            stringIndexType = stringIndexType || getIndexTypeOfType(instantiatedBaseType, 0 /* String */);
            numberIndexType = numberIndexType || getIndexTypeOfType(instantiatedBaseType, 1 /* Number */);
        });
        setObjectTypeMembers(type, members, callSignatures, constructSignatures, stringIndexType, numberIndexType);
    }
    function createSignature(declaration, typeParameters, parameters, resolvedReturnType, minArgumentCount, hasRestParameter, hasStringLiterals) {
        var sig = new reflect.SignatureImpl();
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
            var symbol = createSymbol(2 /* Property */ | 33554432 /* Transient */, "" + i);
            symbol.type = memberTypes[i];
            members[i] = symbol;
        }
        return members;
    }
    function resolveTupleTypeMembers(type) {
        var arrayType = resolveObjectTypeMembers(createArrayType(getBestCommonType(type.elementTypes)));
        var members = createTupleTypeMemberSymbols(type.elementTypes);
        addInheritedMembers(members, arrayType.properties);
        setObjectTypeMembers(type, members, arrayType.callSignatures, arrayType.constructSignatures, arrayType.stringIndexType, arrayType.numberIndexType);
    }
    function resolveAnonymousTypeMembers(type) {
        var symbol = type.symbol;
        if (symbol.flags & 512 /* TypeLiteral */) {
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
            if (symbol.flags & reflect.SymbolFlags.HasExports) {
                members = symbol.exports;
            }
            if (symbol.flags & (8 /* Function */ | 2048 /* Method */)) {
                callSignatures = getSignaturesOfSymbol(symbol);
            }
            if (symbol.flags & 16 /* Class */) {
                var classType = getDeclaredTypeOfClass(symbol);
                constructSignatures = getSignaturesOfSymbol(symbol.members["__constructor"]);
                if (!constructSignatures.length) {
                    constructSignatures = getDefaultConstructSignatures(classType);
                }
                if (classType.baseTypes.length) {
                    members = createSymbolTable(getNamedMembers(members));
                    addInheritedMembers(members, getPropertiesOfType(getTypeOfSymbol(classType.baseTypes[0].symbol)));
                }
            }
            var stringIndexType = undefined;
            var numberIndexType = (symbol.flags & 64 /* Enum */) ? stringType : undefined;
        }
        setObjectTypeMembers(type, members, callSignatures, constructSignatures, stringIndexType, numberIndexType);
    }
    function resolveObjectTypeMembers(type) {
        if (!type.members) {
            if (type.flags & (1024 /* Class */ | 2048 /* Interface */)) {
                resolveClassOrInterfaceMembers(type);
            }
            else if (type.flags & 16384 /* Anonymous */) {
                resolveAnonymousTypeMembers(type);
            }
            else if (type.flags & 8192 /* Tuple */) {
                resolveTupleTypeMembers(type);
            }
            else {
                resolveTypeReferenceMembers(type);
            }
        }
        return type;
    }
    function getPropertiesOfType(type) {
        if (type.flags & reflect.TypeFlags.ObjectType) {
            return resolveObjectTypeMembers(type).properties;
        }
        return emptyArray;
    }
    reflect.getPropertiesOfType = getPropertiesOfType;
    function getPropertyOfType(type, name) {
        if (type.flags & reflect.TypeFlags.ObjectType) {
            var resolved = resolveObjectTypeMembers(type);
            if (reflect.hasProperty(resolved.members, name)) {
                var symbol = resolved.members[name];
                if (symbolIsValue(symbol)) {
                    return symbol;
                }
            }
        }
    }
    reflect.getPropertyOfType = getPropertyOfType;
    function getPropertyOfApparentType(type, name) {
        if (type.flags & reflect.TypeFlags.ObjectType) {
            var resolved = resolveObjectTypeMembers(type);
            if (reflect.hasProperty(resolved.members, name)) {
                var symbol = resolved.members[name];
                if (symbolIsValue(symbol)) {
                    return symbol;
                }
            }
            if (resolved === anyFunctionType || resolved.callSignatures.length || resolved.constructSignatures.length) {
                var symbol = getPropertyOfType(globalFunctionType, name);
                if (symbol)
                    return symbol;
            }
            return getPropertyOfType(globalObjectType, name);
        }
    }
    function getSignaturesOfType(type, kind) {
        if (type.flags & reflect.TypeFlags.ObjectType) {
            var resolved = resolveObjectTypeMembers(type);
            return kind === 0 /* Call */ ? resolved.callSignatures : resolved.constructSignatures;
        }
        return emptyArray;
    }
    reflect.getSignaturesOfType = getSignaturesOfType;
    function getIndexTypeOfType(type, kind) {
        if (type.flags & reflect.TypeFlags.ObjectType) {
            var resolved = resolveObjectTypeMembers(type);
            return kind === 0 /* String */ ? resolved.stringIndexType : resolved.numberIndexType;
        }
    }
    reflect.getIndexTypeOfType = getIndexTypeOfType;
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
            var classType = declaration.kind === 12 /* Constructor */ ? getDeclaredTypeOfClass(declaration.parent.symbol) : undefined;
            var typeParameters = classType ? classType.typeParameters : declaration.typeParameters ? getTypeParametersFromDeclaration(declaration.typeParameters) : undefined;
            var parameters = [];
            var hasStringLiterals = false;
            var minArgumentCount = -1;
            for (var i = 0, n = declaration.parameters.length; i < n; i++) {
                var param = declaration.parameters[i];
                parameters.push(param.symbol);
                if (param.type && param.type.kind === 25 /* StringLiteral */) {
                    hasStringLiterals = true;
                }
                if (minArgumentCount < 0) {
                    if (param.flags & (4 /* QuestionMark */ | 8 /* Rest */)) {
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
                if (declaration.kind === 13 /* GetAccessor */) {
                    var setter = getDeclarationOfKind(declaration.symbol, 14 /* SetAccessor */);
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
        return s.parameters.length > 0 && (s.parameters[s.parameters.length - 1].flags & 8 /* Rest */) !== 0;
    }
    function getSignaturesOfSymbol(symbol) {
        if (!symbol)
            return emptyArray;
        var result = [];
        for (var i = 0, len = symbol.declarations.length; i < len; i++) {
            var node = symbol.declarations[i];
            switch (node.kind) {
                case 5 /* FunctionDeclaration */:
                case 11 /* Method */:
                case 12 /* Constructor */:
                case 19 /* CallSignature */:
                case 16 /* ConstructSignature */:
                case 18 /* IndexSignature */:
                case 13 /* GetAccessor */:
                case 14 /* SetAccessor */:
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
            if (signature.resolvedReturnType === resolvingType) {
                signature.resolvedReturnType = type;
            }
        }
        else if (signature.resolvedReturnType === resolvingType) {
            signature.resolvedReturnType = anyType;
        }
        return signature.resolvedReturnType;
    }
    reflect.getReturnTypeOfSignature = getReturnTypeOfSignature;
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
                    if (parameter && parameter.type && parameter.type.kind === 24 /* TypeReference */) {
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
                type.constraint = getTypeFromTypeNode(getDeclarationOfKind(type.symbol, 28 /* TypeParameter */).constraint);
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
                    var symbol = resolveEntityName(node, node.type, reflect.SymbolFlags.Type);
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
        return resolveName(undefined, name, reflect.SymbolFlags.Type);
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
    function getTypeFromTypeLiteralNode(node) {
        var links = getNodeLinks(node);
        if (!links.resolvedType) {
            // Deferred resolution of members is handled by resolveObjectTypeMembers
            links.resolvedType = createObjectType(16384 /* Anonymous */, node.symbol);
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
            case 25 /* StringLiteral */:
                return getTypeFromStringLiteral(node);
            case 24 /* TypeReference */:
                return getTypeFromTypeReferenceNode(node);
            case 21 /* ArrayType */:
                return getTypeFromArrayTypeNode(node);
            case 26 /* TupleType */:
                return getTypeFromTupleTypeNode(node);
            case 20 /* FunctionType */:
            case 22 /* ConstructorType */:
            case 23 /* ObjectType */:
                return getTypeFromTypeLiteralNode(node);
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
        if (symbol.flags & 8388608 /* Instantiated */) {
            var links = getSymbolLinks(symbol);
            // If symbol being instantiated is itself a instantiation, fetch the original target and combine the
            // type mappers. This ensures that original type identities are properly preserved and that aliases
            // always reference a non-aliases.
            symbol = links.target;
            mapper = combineTypeMappers(links.mapper, mapper);
        }
        // Keep the flags from the symbol we're instantiating.  Mark that is instantiated, and
        // also transient so that we can just store data on it directly.
        var result = createSymbol(8388608 /* Instantiated */ | 33554432 /* Transient */, symbol.name);
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
        var result = createObjectType(16384 /* Anonymous */, type.symbol);
        result.properties = instantiateList(getPropertiesOfType(type), mapper, instantiateSymbol);
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
            if (type.flags & 16384 /* Anonymous */) {
                return type.symbol && type.symbol.flags & (8 /* Function */ | 2048 /* Method */ | 512 /* TypeLiteral */ | 1024 /* ObjectLiteral */) ? instantiateAnonymousType(type, mapper) : type;
            }
            if (type.flags & 4096 /* Reference */) {
                return createTypeReference(type.target, instantiateList(type.typeArguments, mapper, instantiateType));
            }
            if (type.flags & 8192 /* Tuple */) {
                return createTupleType(instantiateList(type.elementTypes, mapper, instantiateType));
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
                if (!parentSymbol && reflect.forEach(symbol.declarations, function (declaration) { return (declaration.flags & 1024 /* ExternalModule */); })) {
                    return;
                }
                // if this is anonymous type break
                if (symbol.flags & 512 /* TypeLiteral */ || symbol.flags & 1024 /* ObjectLiteral */) {
                    return;
                }
                writeSymbolName(symbol);
            }
        }
        walkSymbol(symbol);
        return name;
    }
    reflect.symbolToString = symbolToString;
    // TYPE CHECKING
    var subtypeRelation = {};
    var assignableRelation = {};
    var identityRelation = {};
    function isTypeIdenticalTo(source, target, diagnostics) {
        return checkTypeRelatedTo(source, target, identityRelation, diagnostics);
    }
    reflect.isTypeIdenticalTo = isTypeIdenticalTo;
    function isTypeSubtypeOf(source, target, diagnostics) {
        return checkTypeRelatedTo(source, target, subtypeRelation, diagnostics);
    }
    reflect.isTypeSubtypeOf = isTypeSubtypeOf;
    function isTypeAssignableTo(source, target, diagnostics) {
        return checkTypeRelatedTo(source, target, assignableRelation, diagnostics);
    }
    reflect.isTypeAssignableTo = isTypeAssignableTo;
    function isPropertyIdenticalToRecursive(sourceProp, targetProp, reportErrors, relate) {
        if (!targetProp) {
            return false;
        }
        // Two members are considered identical when
        // - they are public properties with identical names, optionality, and types,
        // - they are private properties originating in the same declaration and having identical types
        var sourcePropIsPrivate = getDeclarationFlagsFromSymbol(sourceProp) & 32 /* Private */;
        var targetPropIsPrivate = getDeclarationFlagsFromSymbol(targetProp) & 32 /* Private */;
        if (sourcePropIsPrivate !== targetPropIsPrivate) {
            return false;
        }
        if (sourcePropIsPrivate) {
            return (getTargetSymbol(sourceProp).parent === getTargetSymbol(targetProp).parent) && relate(getTypeOfSymbol(sourceProp), getTypeOfSymbol(targetProp), reportErrors);
        }
        else {
            return isOptionalProperty(sourceProp) === isOptionalProperty(targetProp) && relate(getTypeOfSymbol(sourceProp), getTypeOfSymbol(targetProp), reportErrors);
        }
    }
    function getTargetSymbol(s) {
        // if symbol is instantiated it's flags are not copied from the 'target'
        // so we'll need to get back original 'target' symbol to work with correct set of flags
        return s.flags & 8388608 /* Instantiated */ ? getSymbolLinks(s).target : s;
    }
    function checkTypeRelatedTo(source, target, relation, diagnostics) {
        var errorInfo;
        var sourceStack;
        var targetStack;
        var expandingFlags;
        var depth = 0;
        var overflow = false;
        var result = isRelatedTo(source, target, true);
        if (overflow) {
            error(undefined, reflect.Diagnostics.Excessive_stack_depth_comparing_types_0_and_1, typeToString(source), typeToString(target));
        }
        else if (errorInfo && diagnostics) {
            // push all diagnostics in the chain into the diagnostics array
            var chain = errorInfo;
            while (chain) {
                diagnostics.push(chain.diagnostic);
                chain = chain.next;
            }
        }
        return result;
        function sourceTypeString() {
            return typeToString(source, "source");
        }
        function targetTypeString() {
            return typeToString(target, "target");
        }
        function reportError(message, arg0, arg1, arg2) {
            errorInfo = reflect.chainDiagnosticMessages(errorInfo, new reflect.Diagnostic(undefined, message, arg0, arg1, arg2));
        }
        function isRelatedTo(source, target, reportErrors) {
            if (relation === identityRelation) {
                // both types are the same - covers 'they are the same primitive type or both are Any' or the same type parameter cases
                if (source === target)
                    return true;
            }
            else {
                if (source === target)
                    return true;
                if (target.flags & 1 /* Any */)
                    return true;
                if (source === undefinedType)
                    return true;
                if (source === nullType && target !== undefinedType)
                    return true;
                if (source.flags & 128 /* Enum */ && target === numberType)
                    return true;
                if (source.flags & 256 /* StringLiteral */ && target === stringType)
                    return true;
                if (relation === assignableRelation) {
                    if (source.flags & 1 /* Any */)
                        return true;
                    if (source === numberType && target.flags & 128 /* Enum */)
                        return true;
                }
            }
            if (source.flags & 512 /* TypeParameter */ && target.flags & 512 /* TypeParameter */) {
                if (typeParameterRelatedTo(source, target, reportErrors)) {
                    return true;
                }
            }
            else {
                var saveErrorInfo = errorInfo;
                if (source.flags & 4096 /* Reference */ && target.flags & 4096 /* Reference */ && source.target === target.target) {
                    // We have type references to same target type, see if relationship holds for all type arguments
                    if (typesRelatedTo(source.typeArguments, target.typeArguments, reportErrors)) {
                        return true;
                    }
                }
                // Even if relationship doesn't hold for type arguments, it may hold in a structural comparison
                // Report structural errors only if we haven't reported any errors yet
                var reportStructuralErrors = reportErrors && errorInfo === saveErrorInfo;
                // identity relation does not use apparent type
                var sourceOrApparentType = relation === identityRelation ? source : getApparentType(source);
                if (sourceOrApparentType.flags & reflect.TypeFlags.ObjectType && target.flags & reflect.TypeFlags.ObjectType && objectTypeRelatedTo(sourceOrApparentType, target, reportStructuralErrors)) {
                    errorInfo = saveErrorInfo;
                    return true;
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
            return false;
        }
        function typesRelatedTo(sources, targets, reportErrors) {
            for (var i = 0, len = sources.length; i < len; i++) {
                if (!isRelatedTo(sources[i], targets[i], reportErrors))
                    return false;
            }
            return true;
        }
        function typeParameterRelatedTo(source, target, reportErrors) {
            if (relation === identityRelation) {
                if (source.symbol.name !== target.symbol.name) {
                    return false;
                }
                // covers case when both type parameters does not have constraint (both equal to noConstraintType)
                if (source.constraint === target.constraint) {
                    return true;
                }
                if (source.constraint === noConstraintType || target.constraint === noConstraintType) {
                    return false;
                }
                return isRelatedTo(source.constraint, target.constraint, reportErrors);
            }
            else {
                while (true) {
                    var constraint = getConstraintOfTypeParameter(source);
                    if (constraint === target)
                        return true;
                    if (!(constraint && constraint.flags & 512 /* TypeParameter */))
                        break;
                    source = constraint;
                }
                return false;
            }
        }
        // Determine if two object types are related by structure. First, check if the result is already available in the global cache.
        // Second, check if we have already started a comparison of the given two types in which case we assume the result to be true.
        // Third, check if both types are part of deeply nested chains of generic type instantiations and if so assume the types are
        // equal and infinitely expanding. Fourth, if we have reached a depth of 100 nested comparisons, assume we have runaway recursion
        // and issue an error. Otherwise, actually compare the structure of the two types.
        function objectTypeRelatedTo(source, target, reportErrors) {
            if (overflow)
                return false;
            var result;
            var id = source.id + "," + target.id;
            if ((result = relation[id]) !== undefined)
                return result;
            if (depth > 0) {
                for (var i = 0; i < depth; i++) {
                    if (source === sourceStack[i] && target === targetStack[i])
                        return true;
                }
                if (depth === 100) {
                    overflow = true;
                    return false;
                }
            }
            else {
                sourceStack = [];
                targetStack = [];
                expandingFlags = 0;
            }
            sourceStack[depth] = source;
            targetStack[depth] = target;
            depth++;
            var saveExpandingFlags = expandingFlags;
            if (!(expandingFlags & 1) && isDeeplyNestedGeneric(source, sourceStack))
                expandingFlags |= 1;
            if (!(expandingFlags & 2) && isDeeplyNestedGeneric(target, targetStack))
                expandingFlags |= 2;
            result = expandingFlags === 3 || propertiesRelatedTo(source, target, reportErrors) && signaturesRelatedTo(source, target, 0 /* Call */, reportErrors) && signaturesRelatedTo(source, target, 1 /* Construct */, reportErrors) && stringIndexTypesRelatedTo(source, target, reportErrors) && numberIndexTypesRelatedTo(source, target, reportErrors);
            expandingFlags = saveExpandingFlags;
            depth--;
            if (depth === 0) {
                relation[id] = result;
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
                return propertiesAreIdenticalTo(source, target, reportErrors);
            }
            else {
                return propertiesAreSubtypeOrAssignableTo(source, target, reportErrors);
            }
        }
        function propertiesAreIdenticalTo(source, target, reportErrors) {
            if (source === target) {
                return true;
            }
            var sourceProperties = getPropertiesOfType(source);
            var targetProperties = getPropertiesOfType(target);
            if (sourceProperties.length !== targetProperties.length) {
                return false;
            }
            for (var i = 0, len = sourceProperties.length; i < len; ++i) {
                var sourceProp = sourceProperties[i];
                var targetProp = getPropertyOfType(target, sourceProp.name);
                if (!isPropertyIdenticalToRecursive(sourceProp, targetProp, reportErrors, isRelatedTo)) {
                    return false;
                }
            }
            return true;
        }
        function propertiesAreSubtypeOrAssignableTo(source, target, reportErrors) {
            var properties = getPropertiesOfType(target);
            for (var i = 0; i < properties.length; i++) {
                var targetProp = properties[i];
                var sourceProp = getPropertyOfApparentType(source, targetProp.name);
                if (sourceProp !== targetProp) {
                    if (!sourceProp) {
                        if (!isOptionalProperty(targetProp)) {
                            if (reportErrors) {
                                reportError(reflect.Diagnostics.Property_0_is_missing_in_type_1, symbolToString(targetProp), sourceTypeString());
                            }
                            return false;
                        }
                    }
                    else if (!(targetProp.flags & 67108864 /* Prototype */)) {
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
                                return false;
                            }
                        }
                        else if (targetFlags & 64 /* Protected */) {
                            var sourceDeclaredInClass = sourceProp.parent && sourceProp.parent.flags & 16 /* Class */;
                            var sourceClass = sourceDeclaredInClass ? getDeclaredTypeOfSymbol(sourceProp.parent) : undefined;
                            var targetClass = getDeclaredTypeOfSymbol(targetProp.parent);
                            if (!sourceClass || !hasBaseType(sourceClass, targetClass)) {
                                if (reportErrors) {
                                    reportError(reflect.Diagnostics.Property_0_is_protected_but_type_1_is_not_a_class_derived_from_2, symbolToString(targetProp), typeToString(sourceClass || source, "source"), typeToString(targetClass, "target"));
                                }
                                return false;
                            }
                        }
                        else if (sourceFlags & 64 /* Protected */) {
                            if (reportErrors) {
                                reportError(reflect.Diagnostics.Property_0_is_protected_in_type_1_but_public_in_type_2, symbolToString(targetProp), sourceTypeString(), targetTypeString());
                            }
                            return false;
                        }
                        if (!isRelatedTo(getTypeOfSymbol(sourceProp), getTypeOfSymbol(targetProp), reportErrors)) {
                            if (reportErrors) {
                                reportError(reflect.Diagnostics.Types_of_property_0_are_incompatible_Colon, symbolToString(targetProp));
                            }
                            return false;
                        }
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
                            return false;
                        }
                    }
                }
            }
            return true;
        }
        function signaturesRelatedTo(source, target, kind, reportErrors) {
            if (relation === identityRelation) {
                return areSignaturesIdenticalTo(source, target, kind, reportErrors);
            }
            else {
                return areSignaturesSubtypeOrAssignableTo(source, target, kind, reportErrors);
            }
        }
        function areSignaturesIdenticalTo(source, target, kind, reportErrors) {
            var sourceSignatures = getSignaturesOfType(source, kind);
            var targetSignatures = getSignaturesOfType(target, kind);
            if (sourceSignatures.length !== targetSignatures.length) {
                return false;
            }
            for (var i = 0, len = sourceSignatures.length; i < len; ++i) {
                if (!isSignatureIdenticalTo(sourceSignatures[i], targetSignatures[i], reportErrors)) {
                    return false;
                }
            }
            return true;
        }
        function isSignatureIdenticalTo(source, target, reportErrors) {
            if (source === target) {
                return true;
            }
            if (source.hasRestParameter !== target.hasRestParameter) {
                return false;
            }
            if (source.parameters.length !== target.parameters.length) {
                return false;
            }
            if (source.minArgumentCount !== target.minArgumentCount) {
                return false;
            }
            if (source.typeParameters && target.typeParameters) {
                if (source.typeParameters.length !== target.typeParameters.length) {
                    return false;
                }
                for (var i = 0, len = source.typeParameters.length; i < len; ++i) {
                    if (!isRelatedTo(source.typeParameters[i], target.typeParameters[i], reportErrors)) {
                        return false;
                    }
                }
            }
            else if (source.typeParameters || source.typeParameters) {
                return false;
            }
            // Spec 1.0 Section 3.8.3 & 3.8.4:
            // M and N (the signatures) are instantiated using type Any as the type argument for all type parameters declared by M and N
            source = getErasedSignature(source);
            target = getErasedSignature(target);
            for (var i = 0, len = source.parameters.length; i < len; i++) {
                var s = source.hasRestParameter && i === len - 1 ? getRestTypeOfSignature(source) : getTypeOfSymbol(source.parameters[i]);
                var t = target.hasRestParameter && i === len - 1 ? getRestTypeOfSignature(target) : getTypeOfSymbol(target.parameters[i]);
                if (!isRelatedTo(s, t, reportErrors)) {
                    return false;
                }
            }
            var t = getReturnTypeOfSignature(target);
            var s = getReturnTypeOfSignature(source);
            return isRelatedTo(s, t, reportErrors);
        }
        function areSignaturesSubtypeOrAssignableTo(source, target, kind, reportErrors) {
            if (target === anyFunctionType || source === anyFunctionType)
                return true;
            var sourceSignatures = getSignaturesOfType(source, kind);
            var targetSignatures = getSignaturesOfType(target, kind);
            var saveErrorInfo = errorInfo;
            outer: for (var i = 0; i < targetSignatures.length; i++) {
                var t = targetSignatures[i];
                if (!t.hasStringLiterals || target.flags & 32768 /* FromSignature */) {
                    var localErrors = reportErrors;
                    for (var j = 0; j < sourceSignatures.length; j++) {
                        var s = sourceSignatures[j];
                        if (!s.hasStringLiterals || source.flags & 32768 /* FromSignature */) {
                            if (isSignatureSubtypeOrAssignableTo(s, t, localErrors)) {
                                errorInfo = saveErrorInfo;
                                continue outer;
                            }
                            // Only report errors from the first failure
                            localErrors = false;
                        }
                    }
                    return false;
                }
            }
            return true;
        }
        function isSignatureSubtypeOrAssignableTo(source, target, reportErrors) {
            if (source === target) {
                return true;
            }
            if (!target.hasRestParameter && source.minArgumentCount > target.parameters.length) {
                return false;
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
            for (var i = 0; i < checkCount; i++) {
                var s = i < sourceMax ? getTypeOfSymbol(source.parameters[i]) : getRestTypeOfSignature(source);
                var t = i < targetMax ? getTypeOfSymbol(target.parameters[i]) : getRestTypeOfSignature(target);
                var saveErrorInfo = errorInfo;
                if (!isRelatedTo(s, t, reportErrors)) {
                    if (!isRelatedTo(t, s, false)) {
                        if (reportErrors) {
                            reportError(reflect.Diagnostics.Types_of_parameters_0_and_1_are_incompatible_Colon, source.parameters[i < sourceMax ? i : sourceMax].name, target.parameters[i < targetMax ? i : targetMax].name);
                        }
                        return false;
                    }
                    errorInfo = saveErrorInfo;
                }
            }
            var t = getReturnTypeOfSignature(target);
            if (t === voidType)
                return true;
            var s = getReturnTypeOfSignature(source);
            return isRelatedTo(s, t, reportErrors);
        }
        function stringIndexTypesRelatedTo(source, target, reportErrors) {
            if (relation === identityRelation) {
                return areIndexTypesIdenticalTo(0 /* String */, source, target, reportErrors);
            }
            else {
                var targetType = getIndexTypeOfType(target, 0 /* String */);
                if (targetType) {
                    var sourceType = getIndexTypeOfType(source, 0 /* String */);
                    if (!sourceType) {
                        if (reportErrors) {
                            reportError(reflect.Diagnostics.Index_signature_is_missing_in_type_0, sourceTypeString());
                        }
                        return false;
                    }
                    if (!isRelatedTo(sourceType, targetType, reportErrors)) {
                        if (reportErrors) {
                            reportError(reflect.Diagnostics.Index_signatures_are_incompatible_Colon);
                        }
                        return false;
                    }
                }
                return true;
            }
        }
        function numberIndexTypesRelatedTo(source, target, reportErrors) {
            if (relation === identityRelation) {
                return areIndexTypesIdenticalTo(1 /* Number */, source, target, reportErrors);
            }
            else {
                var targetType = getIndexTypeOfType(target, 1 /* Number */);
                if (targetType) {
                    var sourceStringType = getIndexTypeOfType(source, 0 /* String */);
                    var sourceNumberType = getIndexTypeOfType(source, 1 /* Number */);
                    if (!(sourceStringType || sourceNumberType)) {
                        if (reportErrors) {
                            reportError(reflect.Diagnostics.Index_signature_is_missing_in_type_0, sourceTypeString());
                        }
                        return false;
                    }
                    if (sourceStringType && sourceNumberType) {
                        // If we know for sure we're testing both string and numeric index types then only report errors from the second one
                        var compatible = isRelatedTo(sourceStringType, targetType, false) || isRelatedTo(sourceNumberType, targetType, reportErrors);
                    }
                    else {
                        var compatible = isRelatedTo(sourceStringType || sourceNumberType, targetType, reportErrors);
                    }
                    if (!compatible) {
                        if (reportErrors) {
                            reportError(reflect.Diagnostics.Index_signatures_are_incompatible_Colon);
                        }
                        return false;
                    }
                }
                return true;
            }
        }
        function areIndexTypesIdenticalTo(indexKind, source, target, reportErrors) {
            var targetType = getIndexTypeOfType(target, indexKind);
            var sourceType = getIndexTypeOfType(source, indexKind);
            return (!sourceType && !targetType) || (sourceType && targetType && isRelatedTo(sourceType, targetType, reportErrors));
        }
    }
    function isSupertypeOfEach(candidate, types) {
        for (var i = 0, len = types.length; i < len; i++) {
            if (candidate !== types[i] && !isTypeSubtypeOf(types[i], candidate))
                return false;
        }
        return true;
    }
    function getBestCommonType(types, contextualType, candidatesOnly) {
        if (contextualType && isSupertypeOfEach(contextualType, types))
            return contextualType;
        return reflect.forEach(types, function (t) { return isSupertypeOfEach(t, types) ? t : undefined; }) || (candidatesOnly ? undefined : emptyObjectType);
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
        return s.flags & 67108864 /* Prototype */ ? 16 /* Public */ | 128 /* Static */ : s.valueDeclaration.flags;
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
    reflect.initializeGlobalTypes = initializeGlobalTypes;
})(reflect || (reflect = {}));
/// <reference path="../typings/node.d.ts"/>
/// <reference path="nodes.ts"/>
/// <reference path="loader.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="types.ts"/>
/// <reference path="checker.ts"/>
/// <reference path="pathUtil.ts"/>
var reflect;
(function (reflect) {
    reflect.hasDiagnosticErrors = false;
    var errors = [];
    exports.SymbolFlags = reflect.SymbolFlags;
    exports.TypeFlags = reflect.TypeFlags;
    function requireModule(moduleName) {
        if (!moduleName) {
            throw new Error("Missing required argument 'moduleName'.");
        }
        var ret = reflect.processExternalModule(moduleName, getBasePath());
        if (reflect.hasDiagnosticErrors) {
            throwDiagnosticError();
        }
        return ret;
    }
    exports.require = requireModule;
    function reference(filename) {
        if (!filename) {
            throw new Error("Missing required argument 'filename'.");
        }
        reflect.processRootFile(reflect.normalizePath(reflect.combinePaths(getBasePath(), filename)));
        if (reflect.hasDiagnosticErrors) {
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
    function resolve(name, meaning) {
        if (meaning === void 0) { meaning = reflect.SymbolFlags.Namespace | reflect.SymbolFlags.Type | reflect.SymbolFlags.Value; }
        if (!name) {
            throw new Error("Missing required argument 'name'.");
        }
        var ret = reflect.resolveEntityName(undefined, name, meaning);
        if (reflect.hasDiagnosticErrors) {
            throwDiagnosticError();
        }
        return ret;
    }
    exports.resolve = resolve;
    var cachedPrototypes = [];
    function createObject(classType) {
        var prototype = cachedPrototypes[classType.id];
        if (prototype) {
            return Object.create(prototype);
        }
        if (!(classType.flags & 1024 /* Class */)) {
            throw new Error("Argument 'classType' must be a class type.");
        }
        // find the external module containing this class
        var moduleSymbol = findContainingExternalModule(classType.symbol);
        if (!moduleSymbol) {
            throw new Error("Class must be contained in an external module.");
        }
        // load the javascript module
        var moduleName = moduleSymbol.name.replace(/^"|"$/g, "");
        if (reflect.isExternalModuleNameRelative(moduleName)) {
            var obj = module.require(reflect.absolutePath(moduleName));
        }
        else {
            var obj = module.require(moduleName);
        }
        // find the constructor based on the type name
        var name = reflect.symbolToString(classType.symbol, reflect.getResolvedExportSymbol(moduleSymbol));
        if (name) {
            var path = name.split('.');
            for (var i = 0, l = path.length; i < l; i++) {
                if (i != 0 || path[0] !== moduleSymbol.valueDeclaration.exportName) {
                    obj = obj[path[i]];
                }
                if (!obj) {
                    throw new Error("Could not find '" + name + "' in module '" + moduleName + "'.");
                }
            }
        }
        return Object.create(cachedPrototypes[classType.id] = obj.prototype);
    }
    exports.createObject = createObject;
    function findContainingExternalModule(symbol) {
        while (symbol) {
            if (symbol.valueDeclaration && symbol.valueDeclaration.flags & 1024 /* ExternalModule */) {
                return symbol;
            }
            symbol = symbol.parent;
        }
    }
    function getBasePath() {
        return reflect.getDirectoryPath(reflect.relativePath(module.parent.filename));
    }
    function addDiagnostic(diagnostic) {
        reflect.hasDiagnosticErrors = true;
        errors.push(diagnostic);
    }
    reflect.addDiagnostic = addDiagnostic;
    // TODO: error handling is a little funny when symbol is not found b/c it just returns an 'any' symbol and keeps on working
    // so on the first call you get an error but then there are not errors on subsequent calls
    function throwDiagnosticError() {
        if (reflect.hasDiagnosticErrors) {
            var diagnostics = getSortedDiagnostics();
            // clear errors
            reflect.hasDiagnosticErrors = false;
            errors = [];
            throw new Error(getDiagnosticErrorMessage(diagnostics));
        }
    }
    reflect.throwDiagnosticError = throwDiagnosticError;
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
    function getSortedDiagnostics() {
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
//# sourceMappingURL=tsreflect.js.map