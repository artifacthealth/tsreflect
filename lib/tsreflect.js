/*! *****************************************************************************
 Copyright (c) 2014 Artifact Health, LLC. All rights reserved.

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 ***************************************************************************** */

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var reflect;
(function (reflect) {
    var Signature = (function () {
        function Signature() {
        }
        return Signature;
    })();
    reflect.Signature = Signature;

    (function (SignatureKind) {
        SignatureKind[SignatureKind["Call"] = 0] = "Call";
        SignatureKind[SignatureKind["Construct"] = 1] = "Construct";
        SignatureKind[SignatureKind["Index"] = 2] = "Index";
        SignatureKind[SignatureKind["Method"] = 3] = "Method";
        SignatureKind[SignatureKind["Property"] = 4] = "Property";
    })(reflect.SignatureKind || (reflect.SignatureKind = {}));
    var SignatureKind = reflect.SignatureKind;

    var CallSignature = (function (_super) {
        __extends(CallSignature, _super);
        function CallSignature() {
            _super.apply(this, arguments);
        }
        return CallSignature;
    })(Signature);
    reflect.CallSignature = CallSignature;

    var PropertySignature = (function (_super) {
        __extends(PropertySignature, _super);
        function PropertySignature() {
            _super.apply(this, arguments);
        }
        return PropertySignature;
    })(Signature);
    reflect.PropertySignature = PropertySignature;

    var Parameter = (function () {
        function Parameter() {
        }
        return Parameter;
    })();
    reflect.Parameter = Parameter;

    (function (ParameterFlags) {
        ParameterFlags[ParameterFlags["None"] = 0] = "None";
        ParameterFlags[ParameterFlags["Optional"] = 1] = "Optional";
        ParameterFlags[ParameterFlags["Rest"] = 2] = "Rest";
    })(reflect.ParameterFlags || (reflect.ParameterFlags = {}));
    var ParameterFlags = reflect.ParameterFlags;
})(reflect || (reflect = {}));
var reflect;
(function (reflect) {
    var Type = (function () {
        function Type() {
        }
        return Type;
    })();
    reflect.Type = Type;

    var ObjectType = (function (_super) {
        __extends(ObjectType, _super);
        function ObjectType() {
            _super.apply(this, arguments);
        }
        return ObjectType;
    })(Type);
    reflect.ObjectType = ObjectType;

    var InterfaceType = (function (_super) {
        __extends(InterfaceType, _super);
        function InterfaceType() {
            _super.apply(this, arguments);
        }
        return InterfaceType;
    })(ObjectType);
    reflect.InterfaceType = InterfaceType;

    var GenericType = (function (_super) {
        __extends(GenericType, _super);
        function GenericType() {
            _super.apply(this, arguments);
        }
        return GenericType;
    })(InterfaceType);
    reflect.GenericType = GenericType;

    (function (TypeFlags) {
        TypeFlags[TypeFlags["Any"] = 0] = "Any";
        TypeFlags[TypeFlags["String"] = 1] = "String";
        TypeFlags[TypeFlags["Number"] = 2] = "Number";
        TypeFlags[TypeFlags["Boolean"] = 3] = "Boolean";
        TypeFlags[TypeFlags["Void"] = 4] = "Void";
        TypeFlags[TypeFlags["Enum"] = 5] = "Enum";
        TypeFlags[TypeFlags["TypeParameter"] = 6] = "TypeParameter";
        TypeFlags[TypeFlags["Class"] = 7] = "Class";
        TypeFlags[TypeFlags["Interface"] = 8] = "Interface";
        TypeFlags[TypeFlags["Reference"] = 9] = "Reference";
    })(reflect.TypeFlags || (reflect.TypeFlags = {}));
    var TypeFlags = reflect.TypeFlags;

    var TypeParameter = (function (_super) {
        __extends(TypeParameter, _super);
        function TypeParameter() {
            _super.apply(this, arguments);
        }
        return TypeParameter;
    })(Type);
    reflect.TypeParameter = TypeParameter;
})(reflect || (reflect = {}));
var reflect;
(function (reflect) {
    var Symbol = (function () {
        function Symbol(flags, name) {
            this.flags = flags;
            this.name = name;
        }
        return Symbol;
    })();
    reflect.Symbol = Symbol;

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
})(reflect || (reflect = {}));
var reflect;
(function (reflect) {
    (function (NodeKind) {
        NodeKind[NodeKind["SourceFile"] = 0] = "SourceFile";

        NodeKind[NodeKind["Interface"] = 1] = "Interface";
        NodeKind[NodeKind["Class"] = 2] = "Class";
        NodeKind[NodeKind["Enum"] = 3] = "Enum";
        NodeKind[NodeKind["Module"] = 4] = "Module";
        NodeKind[NodeKind["Function"] = 5] = "Function";
        NodeKind[NodeKind["Variable"] = 6] = "Variable";
        NodeKind[NodeKind["Import"] = 7] = "Import";

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

        NodeKind[NodeKind["Parameter"] = 25] = "Parameter";
        NodeKind[NodeKind["TypeParameter"] = 26] = "TypeParameter";
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
        NodeFlags[NodeFlags["Static"] = 0x00000040] = "Static";
        NodeFlags[NodeFlags["MultiLine"] = 0x00000080] = "MultiLine";
        NodeFlags[NodeFlags["Synthetic"] = 0x00000100] = "Synthetic";
        NodeFlags[NodeFlags["DeclarationFile"] = 0x00000200] = "DeclarationFile";
        NodeFlags[NodeFlags["ExternalModule"] = 0x00000400] = "ExternalModule";

        NodeFlags[NodeFlags["Modifier"] = NodeFlags.Export | NodeFlags.Ambient | NodeFlags.Public | NodeFlags.Private | NodeFlags.Static] = "Modifier";
    })(reflect.NodeFlags || (reflect.NodeFlags = {}));
    var NodeFlags = reflect.NodeFlags;
})(reflect || (reflect = {}));
var reflect;
(function (reflect) {
    var Diagnostic = (function () {
        function Diagnostic(file, message) {
            var text = getLocaleSpecificMessage(message.key);

            if (arguments.length > 4) {
                text = formatStringFromArgs(text, arguments, 4);
            }

            this.file = file;
            this.messageText = text;
            this.category = message.category;
            this.code = message.code;
        }
        return Diagnostic;
    })();
    reflect.Diagnostic = Diagnostic;

    (function (DiagnosticCategory) {
        DiagnosticCategory[DiagnosticCategory["Warning"] = 0] = "Warning";
        DiagnosticCategory[DiagnosticCategory["Error"] = 1] = "Error";
        DiagnosticCategory[DiagnosticCategory["Message"] = 2] = "Message";
    })(reflect.DiagnosticCategory || (reflect.DiagnosticCategory = {}));
    var DiagnosticCategory = reflect.DiagnosticCategory;

    reflect.Diagnostics = {
        Duplicate_identifier_0: { code: 1000, category: 1 /* Error */, key: "Duplicate identifier '{0}'." },
        File_0_not_found: { code: 1001, category: 1 /* Error */, key: "File '{0}' not found." },
        File_0_must_have_extension_d_json: { code: 1002, category: 1 /* Error */, key: "File '{0}' must have extension '.d.json'." },
        Filename_0_differs_from_already_included_filename_1_only_in_casing: { code: 1003, category: 1 /* Error */, key: "Filename '{0}' differs from already included filename '{1}' only in casing" },
        Cannot_read_file_0_Colon_1: { code: 1003, category: 1 /* Error */, key: "Cannot read file '{0}': {1}" }
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

        return text.replace(/{(\d+)}/g, function (match, index) {
            return args[+index + baseIndex];
        });
    }
})(reflect || (reflect = {}));
var reflect;
(function (reflect) {
    var os = require("os");
    var platform = os.platform();

    reflect.useCaseSensitiveFileNames = platform !== "win32" && platform !== "win64" && platform !== "darwin";

    function getCanonicalFileName(fileName) {
        return reflect.useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
    }
    reflect.getCanonicalFileName = getCanonicalFileName;

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
                } else {
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

    var CharacterCodes;
    (function (CharacterCodes) {
        CharacterCodes[CharacterCodes["colon"] = 0x3A] = "colon";
        CharacterCodes[CharacterCodes["slash"] = 0x2F] = "slash";
    })(CharacterCodes || (CharacterCodes = {}));
})(reflect || (reflect = {}));
var reflect;
(function (reflect) {
    var options = {
        noLib: false,
        noResolve: false,
        charset: "utf8"
    };

    var files = [];
    var filesByName = {};
    var errors = [];
    var seenNoDefaultLib = options.noLib;

    var fs = require("fs");

    function processRootFile(filename, isDefaultLib) {
        if (typeof isDefaultLib === "undefined") { isDefaultLib = false; }
        processSourceFile(reflect.normalizePath(filename), isDefaultLib);
        return files;
    }
    reflect.processRootFile = processRootFile;

    function processSourceFile(filename, isDefaultLib, refFile) {
        var ret;
        var diagnostic;
        if (reflect.hasExtension(filename)) {
            if (!reflect.fileExtensionIs(filename, ".d.json")) {
                diagnostic = reflect.Diagnostics.File_0_must_have_extension_d_json;
            } else if (!(ret = findSourceFile(filename, isDefaultLib, refFile))) {
                diagnostic = reflect.Diagnostics.File_0_not_found;
            }
        } else {
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

    function getSourceFile(filename, onError) {
        try  {
            var text = fs.readFileSync(filename, options.charset);
        } catch (e) {
            if (onError) {
                onError(e.message);
            }
            text = "";
        }
        return text ? createSourceFile(filename, text) : undefined;
    }

    function findSourceFile(filename, isDefaultLib, refFile, refStart, refLength) {
        var canonicalName = reflect.getCanonicalFileName(filename);
        if (reflect.hasProperty(filesByName, canonicalName)) {
            var file = filesByName[canonicalName];
            if (file && reflect.useCaseSensitiveFileNames && canonicalName !== file.filename) {
                errors.push(new reflect.Diagnostic(refFile, reflect.Diagnostics.Filename_0_differs_from_already_included_filename_1_only_in_casing, filename, file.filename));
            }
        } else {
            var file = filesByName[canonicalName] = getSourceFile(filename, function (hostErrorMessage) {
                errors.push(new reflect.Diagnostic(refFile, reflect.Diagnostics.Cannot_read_file_0_Colon_1, filename, hostErrorMessage));
            });
            if (file) {
                seenNoDefaultLib = seenNoDefaultLib || file.hasNoDefaultLib;
                if (!options.noResolve) {
                    var basePath = reflect.getDirectoryPath(filename);
                    processReferencedFiles(file, basePath);
                    processImportedModules(file, basePath);
                }
                if (isDefaultLib) {
                    files.unshift(file);
                } else {
                    files.push(file);
                }
                reflect.forEach(file.errors, function (e) {
                    errors.push(e);
                });
            }
        }
        return file;
    }

    function processReferencedFiles(file, basePath) {
        reflect.forEach(file.references, function (filename) {
            processSourceFile(reflect.normalizePath(reflect.combinePaths(basePath, filename)), false, file);
        });
    }

    function processImportedModules(file, basePath) {
        reflect.forEach(file.declares, function (node) {
            if (node.kind === 7 /* Import */ && node.require) {
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
            } else if (node.kind === 4 /* Module */ && (node.flags & 1024 /* ExternalModule */)) {
                reflect.forEachChild(node, function (node) {
                    if (node.kind === 7 /* Import */ && node.require) {
                        var moduleName = node.require;
                        if (moduleName) {
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
                case DeclarationKind.Interface:
                    scanInterfaceDeclaration(node);
                    break;
                case DeclarationKind.Class:
                    scanClassDeclaration(node);
                    break;
                case DeclarationKind.Enum:
                    scanEnumDeclaration(node);
                    break;
                case DeclarationKind.Module:
                    scanModuleDeclaration(node);
                    break;
                case DeclarationKind.Function:
                    scanFunctionDeclaration(node);
                    break;
                case DeclarationKind.Variable:
                    scanVariableDeclaration(node);
                    break;
                case DeclarationKind.Import:
                    scanImportDeclaration(node);
                    break;
            }
        }

        function scanInterfaceDeclaration(node) {
            node.kind = 1 /* Interface */;
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
                parameter.kind = 26 /* TypeParameter */;
                scanChildTypeNode(parameter, "constraint");
            }
        }

        function scanClassDeclaration(node) {
            node.kind = 2 /* Class */;
            scanFlags(node);
            scanTypeParameterDeclarations(node.typeParameters);
            scanChildTypeReferenceNode(node, "extends");
            scanTypeReferenceNodes(node.implements);
            reflect.forEach(node.members, scanClassMemberDeclaration);
        }

        function scanEnumDeclaration(node) {
            node.kind = 3 /* Enum */;
            scanFlags(node);
            reflect.forEach(node.members, scanEnumMemberDeclaration);
        }

        function scanEnumMemberDeclaration(node) {
            node.kind = 8 /* EnumMember */;
            scanFlags(node);
        }

        function scanModuleDeclaration(node) {
            node.kind = 4 /* Module */;
            scanFlags(node);
            reflect.forEach(file.declares, scanModuleElementDeclaration);
        }

        function scanFunctionDeclaration(node) {
            node.kind = 5 /* Function */;
            scanCallSignatureDeclaration(node);
        }

        function scanParameterDeclaration(node) {
            if (!node)
                return;

            node.kind = 25 /* Parameter */;
            scanFlags(node);
            scanChildTypeNode(node, "type");
        }

        function scanVariableDeclaration(node) {
            node.kind = 6 /* Variable */;
            scanFlags(node);
            scanChildTypeNode(node, "type");
        }

        function scanImportDeclaration(node) {
            node.kind = 7 /* Import */;
            scanFlags(node);
        }

        function scanClassMemberDeclaration(node) {
            switch (node.kind) {
                case DeclarationKind.Index:
                    scanIndexDeclaration(node);
                    break;
                case DeclarationKind.Field:
                    scanFieldDeclaration(node);
                    break;
                case DeclarationKind.Method:
                    scanMethodDeclaration(node);
                    break;
                case DeclarationKind.Constructor:
                    scanConstructorDeclaration(node);
                    break;
                case DeclarationKind.GetAccessor:
                    scanGetAccessorDeclaration(node);
                    break;
                case DeclarationKind.SetAccessor:
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
                case DeclarationKind.PropertySignature:
                    scanPropertySignatureDeclaration(node);
                    break;
                case DeclarationKind.ConstructSignature:
                    scanConstructSignatureDeclaration(node);
                    break;
                case DeclarationKind.MethodSignature:
                    scanMethodSignatureDeclaration(node);
                    break;
                case DeclarationKind.IndexSignature:
                    scanIndexSignatureDeclaration(node);
                    break;
                case DeclarationKind.CallSignature:
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
                node[typeNodeName] = createTypeReferenceNode(typeNode);
            } else {
                switch (typeNode.kind) {
                    case DeclarationKind.FunctionType:
                        scanFunctionTypeNode(typeNode);
                        break;
                    case DeclarationKind.ArrayType:
                        scanArrayTypeNode(typeNode);
                        break;
                    case DeclarationKind.ConstructorType:
                        scanConstructorTypeNode(typeNode);
                        break;
                    case DeclarationKind.TypeReference:
                        scanTypeReferenceNode(typeNode);
                        break;
                    case DeclarationKind.ObjectType:
                        scanObjectTypeNode(typeNode);
                        break;
                }
            }
        }

        function scanFunctionTypeNode(node) {
            scanCallSignature(node, 20 /* FunctionType */);
        }

        function scanArrayTypeNode(node) {
            node.kind = 21 /* ArrayType */;
            scanChildTypeNode(node, "type");
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
                } else {
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
            } else {
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

        var file;

        try  {
            file = JSON.parse(text);
        } catch (e) {
        }

        if (file) {
            file.filename = filename;
            scanSourceFile(file);
        }

        return file;
    }

    var flagMap = {
        "external": 1024 /* ExternalModule */,
        "export": 1 /* Export */,
        "private": 32 /* Private */,
        "static": 64 /* Static */,
        "optional": 4 /* QuestionMark */,
        "rest": 8 /* Rest */
    };

    var flags = Object.keys(flagMap);

    var DeclarationKind;
    (function (DeclarationKind) {
        DeclarationKind.Interface = "interface";
        DeclarationKind.Class = "class";
        DeclarationKind.Enum = "enum";
        DeclarationKind.Module = "module";
        DeclarationKind.Function = "function";
        DeclarationKind.Variable = "variable";
        DeclarationKind.Import = "import";
        DeclarationKind.Index = "index";
        DeclarationKind.Field = "field";
        DeclarationKind.Method = "method";
        DeclarationKind.Constructor = "constructor";
        DeclarationKind.GetAccessor = "get";
        DeclarationKind.SetAccessor = "set";
        DeclarationKind.PropertySignature = "property";
        DeclarationKind.ConstructSignature = "constructor";
        DeclarationKind.MethodSignature = "method";
        DeclarationKind.IndexSignature = "index";
        DeclarationKind.CallSignature = "call";
        DeclarationKind.FunctionType = "function";
        DeclarationKind.ArrayType = "array";
        DeclarationKind.ConstructorType = "constructor";
        DeclarationKind.TypeReference = "reference";
        DeclarationKind.ObjectType = "object";
    })(DeclarationKind || (DeclarationKind = {}));
})(reflect || (reflect = {}));
var reflect;
(function (reflect) {
    function isInstantiated(node) {
        if (node.kind === 1 /* Interface */) {
            return false;
        } else if (node.kind === 7 /* Import */ && !(node.flags & 1 /* Export */)) {
            return false;
        } else if (node.kind === 4 /* Module */ && !forEachChild(node, isInstantiated)) {
            return false;
        } else {
            return true;
        }
    }
    reflect.isInstantiated = isInstantiated;

    function bindSourceFile(file) {
        var parent;
        var container;
        var lastContainer;

        if (!file.locals) {
            file.locals = {};
            container = file;
            bind(file);
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
                if (node.kind === 4 /* Module */ && node.flags & 1024 /* ExternalModule */) {
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
                var symbol = reflect.hasProperty(symbols, name) ? symbols[name] : (symbols[name] = new reflect.Symbol(0, name));
                if (symbol.flags & excludes) {
                    file.errors.push(new reflect.Diagnostic(file, reflect.Diagnostics.Duplicate_identifier_0, getDisplayName(node)));
                    symbol = new reflect.Symbol(0, name);
                }
            } else {
                symbol = new reflect.Symbol(0, "__missing");
            }
            addDeclarationToSymbol(symbol, node, includes);
            symbol.parent = parent;

            if (node.kind === 2 /* Class */ && symbol.exports) {
                var prototypeSymbol = new reflect.Symbol(2 /* Property */ | 67108864 /* Prototype */, "prototype");
                if (reflect.hasProperty(symbol.exports, prototypeSymbol.name)) {
                    file.errors.push(new reflect.Diagnostic(file, reflect.Diagnostics.Duplicate_identifier_0, prototypeSymbol.name));
                }
                symbol.exports[prototypeSymbol.name] = prototypeSymbol;
                prototypeSymbol.parent = symbol;
            }

            return symbol;
        }

        function isAmbientContext(node) {
            while (node) {
                if (node.flags & 2 /* Ambient */)
                    return true;
                node = node.parent;
            }
            return false;
        }

        function declareModuleMember(node, symbolKind, symbolExcludes) {
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
            if (node.flags & 1 /* Export */ || (node.kind !== 7 /* Import */ && isAmbientContext(container))) {
                if (exportKind) {
                    var local = declareSymbol(container.locals, undefined, node, exportKind, symbolExcludes);
                    local.exportSymbol = declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                    node.localSymbol = local;
                } else {
                    declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                }
            } else {
                declareSymbol(container.locals, undefined, node, symbolKind, symbolExcludes);
            }
        }

        function bindChildren(node, symbolKind) {
            if (symbolKind & reflect.SymbolFlags.HasLocals) {
                node.locals = {};
            }
            var saveParent = parent;
            var saveContainer = container;
            parent = node;
            if (symbolKind & reflect.SymbolFlags.IsContainer) {
                container = node;

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
                case 4 /* Module */:
                    declareModuleMember(node, symbolKind, symbolExcludes);
                    break;
                case 0 /* SourceFile */:
                    if (container.flags & 1024 /* ExternalModule */) {
                        declareModuleMember(node, symbolKind, symbolExcludes);
                        break;
                    }
                case 19 /* CallSignature */:
                case 16 /* ConstructSignature */:
                case 18 /* IndexSignature */:
                case 11 /* Method */:
                case 12 /* Constructor */:
                case 13 /* GetAccessor */:
                case 14 /* SetAccessor */:
                case 5 /* Function */:
                    declareSymbol(container.locals, undefined, node, symbolKind, symbolExcludes);
                    break;
                case 2 /* Class */:
                    if (node.flags & 64 /* Static */) {
                        declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                        break;
                    }
                case 1 /* Interface */:
                    declareSymbol(container.symbol.members, container.symbol, node, symbolKind, symbolExcludes);
                    break;
                case 3 /* Enum */:
                    declareSymbol(container.symbol.exports, container.symbol, node, symbolKind, symbolExcludes);
                    break;
            }
            bindChildren(node, symbolKind);
        }

        function bindConstructorDeclaration(node) {
            bindDeclaration(node, 4096 /* Constructor */, 0);
            reflect.forEach(node.parameters, function (p) {
                if (p.flags & (16 /* Public */ | 32 /* Private */)) {
                    bindDeclaration(p, 2 /* Property */, reflect.SymbolFlags.PropertyExcludes);
                }
            });
        }

        function bindModuleDeclaration(node) {
            if (node.flags & 1024 /* ExternalModule */) {
                bindDeclaration(node, 128 /* ValueModule */, reflect.SymbolFlags.ValueModuleExcludes);
            } else if (isInstantiated(node)) {
                bindDeclaration(node, 128 /* ValueModule */, reflect.SymbolFlags.ValueModuleExcludes);
            } else {
                bindDeclaration(node, 256 /* NamespaceModule */, 0 /* NamespaceModuleExcludes */);
            }
        }

        function bindAnonymousDeclaration(node, symbolKind, name) {
            var symbol = new reflect.Symbol(symbolKind, name);
            addDeclarationToSymbol(symbol, node, symbolKind);
            bindChildren(node, symbolKind);
        }

        function bind(node) {
            node.parent = parent;
            switch (node.kind) {
                case 26 /* TypeParameter */:
                    bindDeclaration(node, 262144 /* TypeParameter */, reflect.SymbolFlags.TypeParameterExcludes);
                    break;
                case 25 /* Parameter */:
                    bindDeclaration(node, 1 /* Variable */, reflect.SymbolFlags.ParameterExcludes);
                    break;
                case 6 /* Variable */:
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
                case 5 /* Function */:
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
                case 2 /* Class */:
                    bindDeclaration(node, 16 /* Class */, reflect.SymbolFlags.ClassExcludes);
                    break;
                case 1 /* Interface */:
                    bindDeclaration(node, 32 /* Interface */, reflect.SymbolFlags.InterfaceExcludes);
                    break;
                case 3 /* Enum */:
                    bindDeclaration(node, 64 /* Enum */, reflect.SymbolFlags.EnumExcludes);
                    break;
                case 4 /* Module */:
                    bindModuleDeclaration(node);
                    break;
                case 7 /* Import */:
                    bindDeclaration(node, 4194304 /* Import */, reflect.SymbolFlags.ImportExcludes);
                    break;
                case 0 /* SourceFile */:
                    if (node.flags & 1024 /* ExternalModule */) {
                        bindAnonymousDeclaration(node, 128 /* ValueModule */, '"' + getModuleNameFromFilename(node.filename) + '"');
                        break;
                    }
                default:
                    var saveParent = parent;
                    parent = node;
                    forEachChild(node, bind);
                    parent = saveParent;
            }
        }

        var moduleExtensions = [".d.ts", ".ts", ".js"];

        function getModuleNameFromFilename(filename) {
            for (var i = 0; i < moduleExtensions.length; i++) {
                var ext = moduleExtensions[i];
                var len = filename.length - ext.length;
                if (len > 0 && filename.substr(len) === ext)
                    return filename.substr(0, len);
            }
            return filename;
        }
    }
    reflect.bindSourceFile = bindSourceFile;

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
            case 1 /* Interface */:
                return children(node.typeParameters) || children(node.extends) || children(node.signatures);
            case 2 /* Class */:
                return children(node.typeParameters) || child(node.extends) || children(node.implements) || children(node.members);
            case 3 /* Enum */:
                return children(node.members);
            case 4 /* Module */:
                return children(node.declares);
            case 19 /* CallSignature */:
            case 16 /* ConstructSignature */:
            case 17 /* MethodSignature */:
            case 12 /* Constructor */:
            case 11 /* Method */:
            case 5 /* Function */:
            case 22 /* ConstructorType */:
            case 20 /* FunctionType */:
                return children(node.typeParameters) || children(node.parameters) || child(node.returns);
            case 10 /* Field */:
            case 6 /* Variable */:
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
            case 25 /* Parameter */:
                return child(node.type);
            case 26 /* TypeParameter */:
                return child(node.constraint);
        }
    }
    reflect.forEachChild = forEachChild;
})(reflect || (reflect = {}));
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

    var start = process.hrtime();
    var files = reflect.processRootFile("build/tsreflect.d.json");

    var elapsed = process.hrtime(start);
    console.log("Completed without errors in " + elapsed[0] + "s, " + (elapsed[1] / 1000000).toFixed(3) + "ms");
})(reflect || (reflect = {}));
//# sourceMappingURL=tsreflect.js.map
