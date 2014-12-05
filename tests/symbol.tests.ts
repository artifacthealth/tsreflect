/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>


import chai = require("chai");
import assert = chai.assert;
import reflect = require("./tsreflect");
import helpers = require("./helpers");

describe('Symbol', () => {

    describe('getFlags', () => {

        it('correctly returns SymbolFlags for accessors', () => {

            helpers.referenceFixture("classWithAccessors");
            var properties = reflect.resolve("ClassWithAccessors").getDeclaredType().getProperties();
            assert.ok(properties[0].getFlags() & reflect.SymbolFlags.GetAccessor, "GetAccessor flag should be set for property 'a");
            assert.notOk(properties[0].getFlags() & reflect.SymbolFlags.SetAccessor, "SetAccessor flag should not be set for property 'a");
            assert.ok(properties[1].getFlags() & reflect.SymbolFlags.GetAccessor, "GetAccessor flag should be set for property 'b");
            assert.ok(properties[1].getFlags() & reflect.SymbolFlags.SetAccessor, "SetAccessor flag should be set for property 'b");
            assert.ok(properties[2].getFlags() & reflect.SymbolFlags.SetAccessor, "SetAccessor flag should be set for property 'c");
            assert.notOk(properties[2].getFlags() & reflect.SymbolFlags.GetAccessor, "GetAccessor flag should not be set for property 'c");
        });
    });

    describe('resolve', () => {

        it('correctly resolves name relative to symbol', () => {

            helpers.referenceFixture("internalModule");
            var symbol = reflect.resolve("internalModule");
            assert.equal(symbol.resolve("B.c").getName(), "c");
        });

        it('finds type parameter on function', () => {

            helpers.referenceFixture("functionWithTypeParameters");
            var symbol = reflect.resolve("functionWithTypeParameters");
            assert.equal(symbol.resolve("T").getName(), "T");
            assert.equal(symbol.resolve("V").getName(), "V");
        });

        it('finds parameter with type of type parameter on function', () => {

            helpers.referenceFixture("functionWithTypeParameters");
            var functionSymbol = reflect.resolve("functionWithTypeParameters");
            var parameterSymbol = functionSymbol.resolve("a");
            assert.equal(parameterSymbol.getName(), "a");
            assert.equal(parameterSymbol.getType().getName(), "T");
        });
    });

    describe('getType', () => {

        it('returns anonymous type containing enum members when called on enum symbol', () => {

            helpers.referenceFixture("enum");

            var enumSymbol = reflect.resolve("Enum");
            var type = enumSymbol.getType();

            assert.ok(type.isAnonymous(), "Type of enum symbol should be anonymous");

            var properties = type.getProperties();
            assert.equal(properties[0].getName(), "value1");
            assert.equal(properties[1].getName(), "value2");
            assert.equal(properties[2].getName(), "value3");
        });

        it('return tuple type when called on symbol with tuple type annotation', () => {

            helpers.referenceFixture("simpleTuple");

            var type = reflect.resolve("SimpleTuple").getType();
            assert.ok(type.isTuple());
            assert.ok(type.getProperty("0").getType().isString());
            assert.ok(type.getProperty("1").getType().isNumber());
        });
    });

    describe('getValue', () => {

        it('returns the value of the property represented by the symbol for the given object', () => {

            var type = helpers.requireFixture("classExportedInExternalModule").resolve("TestClass").getDeclaredType();
            var instance = type.createObject();

            instance.a = 10;

            // first call to getValue generates the optimized getValue
            assert.equal(type.getProperty("a").getValue(instance), 10);

            // make sure it still works on the second call
            assert.equal(type.getProperty("a").getValue(instance), 10);
        });

        it('should generate a new implementation of getValue after first call', () => {

            var type = helpers.requireFixture("classExportedInExternalModule").resolve("TestClass").getDeclaredType();

            var symbol = type.getProperty("b");
            var saved = symbol.getValue;

            symbol.getValue({});
            assert.notEqual(symbol.getValue, saved);
        });
    });

    describe('setValue', () => {

        it('sets the value of the property represented by the symbol for the given object', () => {

            var type = helpers.requireFixture("classExportedInExternalModule").resolve("TestClass").getDeclaredType();
            var instance = type.createObject();

            // first call to getValue generates the optimized getValue
            type.getProperty("a").setValue(instance, 10)
            assert.equal(instance.a, 10);

            // make sure it still works on the second call
            type.getProperty("a").setValue(instance, 15)
            assert.equal(instance.a, 15);
        });


        it('should generate a new implementation of setValue after first call', () => {

            var type = helpers.requireFixture("classExportedInExternalModule").resolve("TestClass").getDeclaredType();

            var symbol = type.getProperty("b");
            var saved = symbol.setValue;

            symbol.setValue({}, 1);
            assert.notEqual(symbol.setValue, saved);
        });
    });

    describe('getAnnotations', () => {

        it('returns a list of annotations matching name', () => {

            helpers.referenceFixture("classWithAnnotations");

            var nameSymbol = reflect.resolve("ClassWithAnnotations").getDeclaredType().getProperty("name");
            assert.equal(nameSymbol.getAnnotations("defaultValue")[0].value, "The Class");
        });

        it('returns an empty array if no match is found for name', () => {

            helpers.referenceFixture("classWithAnnotations");

            var nameSymbol = reflect.resolve("ClassWithAnnotations").getDeclaredType().getProperty("name");
            var annotations = nameSymbol.getAnnotations("Some random name");
            assert.isArray(annotations)
            assert.equal(annotations.length, 0);
        });

        it('returns a list of all annotations on the symbol when name is not given', () => {

            helpers.referenceFixture("classWithAnnotations");

            var nameSymbol = reflect.resolve("ClassWithAnnotations").getDeclaredType().getProperty("name");
            var annotations = nameSymbol.getAnnotations();
            assert.isArray(annotations)
            assert.equal(annotations.length, 2);
            assert.equal(annotations[0].name, "defaultValue");
            assert.equal(annotations[1].name, "includeInExport");
        });

        it('includes annotations from all declarations of the symbol', () => {

            helpers.referenceFixture("interfaceWithAnnotations");

            var annotations = reflect.resolve("InterfaceWithAnnotations").getAnnotations();
            assert.isArray(annotations)
            assert.equal(annotations.length, 2);
            assert.equal(annotations[0].name, "first");
            assert.equal(annotations[1].name, "second");
        });
    });

    describe('hasAnnotation', () => {

        it('returns true if symbol has the specified annotation', () => {

            helpers.referenceFixture("classWithAnnotations");

            var nameSymbol = reflect.resolve("ClassWithAnnotations").getDeclaredType().getProperty("name");
            assert.isTrue(nameSymbol.hasAnnotation("defaultValue"));
        });

        it('returns false if symbol does not have the specified annotation', () => {

            helpers.referenceFixture("classWithAnnotations");

            var nameSymbol = reflect.resolve("ClassWithAnnotations").getDeclaredType().getProperty("name");
            assert.isFalse(nameSymbol.hasAnnotation("someUndefinedAnnotation"));
        });

        it('returns false if symbol does not have any annotations', () => {

            var symbol = helpers.requireFixture("classWithConstructor").getDeclaredType().getProperty("constructorCalled");
            assert.isFalse(symbol.hasAnnotation("someUndefinedAnnotation"));
        });
    });

    describe('getExports', () => {

        it('returns all exported symbols in current symbol if flags are not specified', () => {

            helpers.referenceFixture("moduleWithVariables");

            var symbols = reflect.resolve("moduleWithVariables").getExports();
            assert.isArray(symbols);
            assert.lengthOf(symbols, 3);
        });

        it('returns exported symbols in current symbol matching specified flags', () => {

            helpers.referenceFixture("moduleWithVariables");

            var symbols = reflect.resolve("moduleWithVariables").getExports(reflect.SymbolFlags.Variable);
            assert.isArray(symbols);
            assert.lengthOf(symbols, 2);
        });


        it('correctly resolves imported module members', () => {

            helpers.referenceFixture("moduleWithImportedVariable");

            var symbols = reflect.resolve("moduleWithImportedVariable").getExports(reflect.SymbolFlags.Variable);
            assert.isArray(symbols);
            assert.lengthOf(symbols, 1);
        });
    });

});

