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

    describe('load', () => {

        it('correctly loads an external module using path relative to cwd', (done) => {

            helpers.loadFixture("simpleExternalModule", (err, symbols) => {
                if(err) return done(err);

                assert.lengthOf(symbols, 1, "Expected load to return a symbol");
                assert.equal(symbols[0].getName(), helpers.getRelativeExternalModuleName("simpleExternalModule"));
                done();
            });
        });

        it('should return error in callback if file is not found', (done) => {

            helpers.loadFixture("someUnknownModule", (err, symbols) => {

                assert.ok(err);
                assert.equal(err.diagnostics[0].code, 6053);
                assert.equal(symbols, null);

                done();
            });
        });

        it('should return error in callback if loaded duplicate symbol', (done) => {

            helpers.referenceFixture("simpleClass");

            helpers.loadFixture("simpleClassDuplicate", (err, symbols) => {

                assert.ok(err);
                assert.equal(err.diagnostics[0].code, 2300);
                assert.equal(symbols, null);

                done();
            });
        });

        it('can load multiple declaration files based on wildcard search', (done) => {

            helpers.loadFixture("someDirectory/*.d.json", (err, symbols) => {
                if(err) return done(err);

                assert.lengthOf(symbols, 3);

                var names = symbols.map(x => x.getName());
                assert.include(names, "ClassA");
                assert.include(names, "ClassB");
                assert.include(names, "ClassC");

                done();
            });
        });

        it('can load multiple declaration files when passed an array of files', (done) => {

            helpers.loadFixture(["someDirectory/classA", "someDirectory/classB"], (err, symbols) => {
                if(err) return done(err);

                assert.lengthOf(symbols, 2);

                var names = symbols.map(x => x.getName());
                assert.include(names, "ClassA");
                assert.include(names, "ClassB");

                done();
            });
        });
    });

});
