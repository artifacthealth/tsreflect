/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>


import chai = require("chai");
import assert = chai.assert;
import reflect = require("./tsreflect");
import helpers = require("./helpers");

import TestClass = require("./fixtures/classAsExportAssignment");
import classInExportedInternalModule = require("./fixtures/classInExportedInternalModule");

describe('reflect', () => {


    describe('getSymbol', () => {

        it('returns the symbol for the specified constructor for an external module where class is the export assignment', () => {

           var symbol = helpers.requireFixture("classAsExportAssignment");
           assert.equal(reflect.getSymbol(TestClass), symbol);
        });

        it('returns the symbol for the specified constructor for an external module where class is exported in a nested module', () => {

            var symbol = helpers.requireFixture("classInExportedInternalModule").resolve("B.TestClass")
            assert.equal(reflect.getSymbol(classInExportedInternalModule.B.TestClass), symbol);
        });

        it.skip('returns the symbol for the specified constructor for a global symbol', () => {

            assert.equal(reflect.getSymbol(Error), reflect.resolve("Error"));
        });
    });

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

        it('can find intrinsic types', () => {

            assert.equal(reflect.resolve("string").getName(), "string");
        });
    });

    describe('load', () => {

        it('correctly loads an external module using path relative to cwd', (done) => {

            helpers.loadFixture("simpleExternalModule", (err, symbols) => {
                if(err) return done(err);

                assert.lengthOf(symbols, 1, "Expected load to return a symbol");
                done();
            });
        });

        it('correctly loads an ambient external module', (done) => {

            helpers.loadFixture("ambientExternalModuleForLoad", (err, symbols) => {
                if(err) return done(err);

                assert.lengthOf(symbols, 1, "Expected load to return a symbol");
                var symbol = reflect.resolve("\"testAmbientExternalModuleForLoad\"");
                assert.isTrue(symbol !== undefined);
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

        it('loads the declaration files for all required modules if path is not specified', (done) => {

            reflect.load((err, symbols) => {
                if (err) return done(err);

                assert.isTrue(symbols.length > 0);
                done();
            });
        });
    });

    describe('loadSync', () => {

        it('correctly loads an external module using path relative to cwd', () => {

            var symbols = helpers.loadFixtureSync("simpleExternalModule");
            assert.lengthOf(symbols, 1, "Expected load to return a symbol");
        });

        it('correctly loads an ambient external module', () => {

            var symbols = helpers.loadFixtureSync("ambientExternalModuleForLoad");

            assert.lengthOf(symbols, 1, "Expected load to return a symbol");
            var symbol = reflect.resolve("\"testAmbientExternalModuleForLoad\"");
            assert.isTrue(symbol !== undefined);
        });

        it('should throw error if file is not found', () => {

            var symbols: reflect.Symbol[];
            assert.throw(() => {
                symbols = helpers.loadFixtureSync("someUnknownModule");
            }, Error);

            assert.equal(symbols, null);
        });

        it('should throw error if loaded duplicate symbol', () => {

            helpers.referenceFixture("simpleClass");

            var symbols: reflect.Symbol[];
            assert.throw(() => {
                symbols = helpers.loadFixtureSync("simpleClassDuplicate2");
            }, Error);

            assert.equal(symbols, null);
        });

        it('can load multiple declaration files based on wildcard search', () => {

            var symbols = helpers.loadFixtureSync("someDirectory/*.d.json");

            assert.lengthOf(symbols, 3);

            var names = symbols.map(x => x.getName());
            assert.include(names, "ClassA");
            assert.include(names, "ClassB");
            assert.include(names, "ClassC");
        });

        it('can load multiple declaration files when passed an array of files', () => {

            var symbols = helpers.loadFixtureSync(["someDirectory/classA", "someDirectory/classB"]);

            assert.lengthOf(symbols, 2);

            var names = symbols.map(x => x.getName());
            assert.include(names, "ClassA");
            assert.include(names, "ClassB");
        });

        it('loads the declaration files for all required modules if path is not specified', () => {

            var symbols = reflect.loadSync();
            assert.isTrue(symbols.length > 0);
        });
    });

});
