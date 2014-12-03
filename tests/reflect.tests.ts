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

    describe('loadDeclarationFile', () => {

        it('correctly loads an external module using path relative to cwd', (done) => {

            helpers.loadFixture("simpleExternalModule", (err, symbol) => {
                if(err) return done(err);

                assert.ok(symbol, "Expected loadFixture to return a symbol");
                assert.equal(symbol.getName(), helpers.getRelativeExternalModuleName("simpleExternalModule"));
                done();
            });
        });

        it('should return error in callback if file is not found', (done) => {

            helpers.loadFixture("someUnknownModule", (err, symbol) => {

                assert.ok(err);
                assert.equal(err.diagnostics[0].code, 6053);
                assert.notOk(symbol);

                done();
            });
        });

        it('should return error in callback if loaded duplicate symbol', (done) => {

            helpers.referenceFixture("simpleClass");

            helpers.loadFixture("simpleClassDuplicate", (err, symbol) => {

                assert.ok(err);
                assert.equal(err.diagnostics[0].code, 2300);
                assert.notOk(symbol);

                done();
            });
        });
    });

});
