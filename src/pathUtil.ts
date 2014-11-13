module reflect {

    var os = require("os");
    var platform: string = os.platform();
    // win32\win64 are case insensitive platforms, MacOS (darwin) by default is also case insensitive
    export var useCaseSensitiveFileNames = platform !== "win32" && platform !== "win64" && platform !== "darwin";

    export function getCanonicalFileName(fileName: string):string {
        // if underlying system can distinguish between two files whose names differs only in cases then file name already in canonical form.
        // otherwise use toLowerCase as a canonical form.
        return useCaseSensitiveFileNames ? fileName : fileName.toLowerCase();
    }

    var supportedExtensions = [".d.json"];

    export function removeFileExtension(path: string): string {
        for (var i = 0; i < supportedExtensions.length; i++) {
            var ext = supportedExtensions[i];

            if (fileExtensionIs(path, ext)) {
                return path.substr(0, path.length - ext.length);
            }
        }

        return path;
    }

    export function fileExtensionIs(path: string, extension: string): boolean {
        var pathLen = path.length;
        var extLen = extension.length;
        return pathLen > extLen && path.substr(pathLen - extLen, extLen) === extension;
    }

    export function hasExtension(filename: string): boolean {
        return getBaseFilename(filename).indexOf(".") >= 0;
    }

    export function getBaseFilename(path: string) {
        var i = path.lastIndexOf(directorySeparator);
        return i < 0 ? path : path.substring(i + 1);
    }

    export function combinePaths(path1: string, path2: string) {
        if (!(path1 && path1.length)) return path2;
        if (!(path2 && path2.length)) return path1;
        if (path2.charAt(0) === directorySeparator) return path2;
        if (path1.charAt(path1.length - 1) === directorySeparator) return path1 + path2;
        return path1 + directorySeparator + path2;
    }

    export var directorySeparator = "/";
    function getNormalizedParts(normalizedSlashedPath: string, rootLength: number) {
        var parts = normalizedSlashedPath.substr(rootLength).split(directorySeparator);
        var normalized: string[] = [];
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

    export function normalizePath(path: string): string {
        var path = normalizeSlashes(path);
        var rootLength = getRootLength(path);
        var normalized = getNormalizedParts(path, rootLength);
        return path.substr(0, rootLength) + normalized.join(directorySeparator);
    }

    export function normalizeSlashes(path: string): string {
        return path.replace(/\\/g, "/");
    }

    // Returns length of path root (i.e. length of "/", "x:/", "//server/share/")
    export function getRootLength(path: string): number {
        if (path.charCodeAt(0) === CharacterCodes.slash) {
            if (path.charCodeAt(1) !== CharacterCodes.slash) return 1;
            var p1 = path.indexOf("/", 2);
            if (p1 < 0) return 2;
            var p2 = path.indexOf("/", p1 + 1);
            if (p2 < 0) return p1 + 1;
            return p2 + 1;
        }
        if (path.charCodeAt(1) === CharacterCodes.colon) {
            if (path.charCodeAt(2) === CharacterCodes.slash) return 3;
            return 2;
        }
        return 0;
    }

    export function getDirectoryPath(path: string) {
        return path.substr(0, Math.max(getRootLength(path), path.lastIndexOf(directorySeparator)));
    }

    enum CharacterCodes {

        colon = 0x3A,                 // :
        slash = 0x2F                  // /
    }
}