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
});

