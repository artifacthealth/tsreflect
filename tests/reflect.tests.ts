/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>


import chai = require("chai");
import assert = chai.assert;
import reflect = require("./tsreflect");
import helpers = require("./helpers");

describe('reflect', () => {

    describe('require', () => {

        it('correctly loads an external module using relative path', () => {

            assert.equal(helpers.requireFixture("simpleExternalModule").getName(), helpers.getRelativeExternalModuleName("simpleExternalModule"));
        });

        it('throws when ambient external module is not found', () => {

            assert.throws(() => {
                reflect.require("someUndefinedAmbientModule");
            }, Error, "Cannot find external module 'someUndefinedAmbientModule'.");
        });

        it('correctly loads an ambient external module ', () => {

            helpers.referenceFixture("ambientExternalModule");
            assert.equal(reflect.require("testAmbientExternalModule").getName(), "\"testAmbientExternalModule\"");
        });
    });

    describe('resolve', () => {

        it('correctly resolves name', () => {

            var moduleSymbol = helpers.requireFixture("simpleExternalModule");
            assert.equal(moduleSymbol.resolve("A").getDeclaredType().getFullName(), "A");
        });

        it('correctly resolves qualified name', () => {

            helpers.referenceFixture("internalModule");
            assert.equal(reflect.resolve("internalModule.B.c").getName(), "c");
        });

        it('throw when it cannot resolve name', () => {

            var moduleSymbol = helpers.requireFixture("simpleExternalModule");

            assert.throws(() => {
                moduleSymbol.resolve("C")
            }, Error, "Cannot find name 'C'.");
        });
    });
});
