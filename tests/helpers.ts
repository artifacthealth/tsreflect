/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>

import path = require("path");
import reflect = require("./tsreflect");

var fixtureDir = "./fixtures/";

export function referenceFixture(filename: string): void {

    reflect.reference(fixtureDir + filename);
}

export function referenceFixtureInContext(context: reflect.ReflectContext, filename: string): void {

    context.reference(fixtureDir + filename);
}

export function getRelativeExternalModuleName(filename: string): string {

    return '"' + getRelativeFixturePath(filename) + '"';
}

export function getRelativeFixturePath(filename: string): string {

    return relativePath(getAbsolutePath(filename));
}

function getAbsolutePath(filename: string): string {
    return path.join(__dirname, fixtureDir, filename);
}

export function isRelativePath(path: string): boolean {
    return path.substr(0, 2) === "./" || path.substr(0, 3) === "../" || path.substr(0, 2) === ".\\" || path.substr(0, 3) === "..\\";
}

export function requireFixture(filename: string): reflect.Symbol {

    return reflect.require(fixtureDir + filename);
}

export function loadFixture(filePath: string, callback: (err: reflect.DiagnosticError, symbols: reflect.Symbol[]) => void): void;
export function loadFixture(filePaths: string[], callback: (err: reflect.DiagnosticError, symbols: reflect.Symbol[]) => void): void;
export function loadFixture(filePaths: any, callback?: (err: reflect.DiagnosticError, symbols: reflect.Symbol[]) => void): void {

    // path passed to load is relative to cwd
    if(Array.isArray(filePaths)) {
        filePaths = filePaths.map((x: string) => path.resolve(__dirname, fixtureDir, x));
    }
    else {
        filePaths = path.resolve(__dirname, fixtureDir, filePaths);
    }

    return reflect.load(filePaths, callback);
}

export function loadFixtureSync(filePath: string): reflect.Symbol[];
export function loadFixtureSync(filePaths: string[]): reflect.Symbol[];
export function loadFixtureSync(filePaths: any): reflect.Symbol[] {

    // path passed to load is relative to cwd
    if(Array.isArray(filePaths)) {
        filePaths = filePaths.map((x: string) => path.resolve(__dirname, fixtureDir, x));
    }
    else {
        filePaths = path.resolve(__dirname, fixtureDir, filePaths);
    }

    return reflect.loadSync(filePaths);
}


function relativePath(to: string): string {
    return path.relative(process.cwd(), to);
}