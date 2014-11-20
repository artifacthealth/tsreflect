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

    describe('createObject', () => {

        it('creates object with prototype matching declared class type', () => {

            var moduleSymbol = helpers.requireFixture("classExportedInExternalModule");
            var testClassType = moduleSymbol.resolve("TestClass").getDeclaredType();

            var obj = reflect.createObject(testClassType);
            assert.equal(3, obj.add(1,2));
        });

        it('creates object for class exported as export assignment', () => {

            var moduleSymbol = helpers.requireFixture("classAsExportAssignment");
            var testClassType = moduleSymbol.getDeclaredType();

            var obj = reflect.createObject(testClassType);
            assert.equal(3, obj.add(1,2));
        });

        it('creates object for class in nested internal module exported as export assignment', () => {

            var moduleSymbol = helpers.requireFixture("classInInternalModuleAsExportAssignment");
            var testClassType = moduleSymbol.getDeclaredType();

            var obj = reflect.createObject(testClassType);
            assert.equal(3, obj.add(1,2));
        });

        it('creates object for class in nested internal module where internal module is exported as export assignment', () => {

            var moduleSymbol = helpers.requireFixture("classInExportedInternalModule");
            var testClassType = moduleSymbol.resolve("B.TestClass").getDeclaredType();

            var obj = reflect.createObject(testClassType);
            assert.equal(3, obj.add(1,2));
        });

        it('creates object for class in ambient external module', () => {

            reflect.reference("../typings/node.d.json");

            var bufferType = reflect.require("cluster").resolve("Worker").getDeclaredType();
            var obj = reflect.createObject(bufferType);
            assert.ok(obj.kill);
        });
    });
});
