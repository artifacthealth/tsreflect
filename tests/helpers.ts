/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>

import path = require("path");
import reflect = require("./tsreflect");

var fixtureDir = "./fixtures/";

export function referenceFixture(filename: string): void {

    reflect.reference(fixtureDir + filename);
}

export function getRelativeExternalModuleName(filename: string): string {

    var filePath = relativePath(path.join(__dirname, fixtureDir, filename));
    if(!isRelativePath(filePath)) {
        filePath = "./" + filePath;
    }
    return '"' + filePath + '"';
}

export function isRelativePath(path: string): boolean {
    return path.substr(0, 2) === "./" || path.substr(0, 3) === "../" || path.substr(0, 2) === ".\\" || path.substr(0, 3) === "..\\";
}

export function requireFixture(filename: string): reflect.Symbol {

    return reflect.require(fixtureDir + filename);
}

function relativePath(to: string): string {
    return path.relative(process.cwd(), to);
}