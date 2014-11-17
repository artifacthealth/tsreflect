/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>

import path = require("path");
import reflect = require("./tsreflect");

var fixtureDir = "../tests/fixtures/json/";

export function referenceFixture(filename: string): void {

    reflect.reference(fixtureDir + filename);
}

export function getRelativeExternalModuleName(filename: string): string {

    return '"' + relativePath(path.join(__dirname, fixtureDir, filename)) + '"';
}

export function requireFixture(filename: string): reflect.Symbol {

    return reflect.require(fixtureDir + filename);
}

function relativePath(to: string): string {
    return path.relative(process.cwd(), to);
}