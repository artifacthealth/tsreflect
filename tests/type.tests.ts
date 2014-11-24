/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>

import chai = require("chai");
import assert = chai.assert;
import reflect = require("./tsreflect");
import helpers = require("./helpers");

describe('Type', () => {

    describe('getFullName', () => {

        it('returns fully qualified name', () => {

            helpers.referenceFixture("internalModule");
            var type = reflect.resolve("internalModule.B.C").getDeclaredType();
            assert.equal(type.getFullName(), "internalModule.B.C");
        });
    });

    describe('getName', () => {

        it('returns symbol name', () => {

            helpers.referenceFixture("internalModule");
            var type = reflect.resolve("internalModule.B.C").getDeclaredType();
            assert.equal(type.getName(), "C");
        });
    });

    describe('getAnnotations', () => {

        it('should not include annotations from base types when inherit is not specified', () => {

            helpers.referenceFixture("interfaceExtendsInterface");

            var type = reflect.resolve("InterfaceExtendsInterface3").getType();
            var type = reflect.resolve("InterfaceExtendsInterface3").getDeclaredType();

            // annotation 'first' is specified on base type and snould not be included
            var annotations = type.getAnnotations("first");
            assert.isArray(annotations);
            assert.equal(annotations.length, 0);

            // annotation 'third' is specified on InterfaceExtendsInterface3 and should be included
            var annotations = type.getAnnotations("third");
            assert.isArray(annotations);
            assert.equal(annotations.length, 1);
            assert.equal(annotations[0].name, "third");

            var annotations = type.getAnnotations();
            assert.isArray(annotations);
            assert.equal(annotations.length, 1);
            assert.equal(annotations[0].name, "third");
        });

        it('returns a list of all annotations on the symbol when name is not given and should not included annotations form base types', () => {

            helpers.referenceFixture("interfaceExtendsInterface");

            var type = reflect.resolve("InterfaceExtendsInterface3").getDeclaredType();

            var annotations = type.getAnnotations();
            assert.isArray(annotations);
            assert.equal(annotations.length, 1);
            assert.equal(annotations[0].name, "third");
        });

        it('includes annotations from base types when inherit argument is true and returns them in inheritance order', () => {

            helpers.referenceFixture("interfaceExtendsInterface");

            var annotations = reflect.resolve("InterfaceExtendsInterface3").getDeclaredType().getAnnotations(true);
            assert.isArray(annotations);
            assert.equal(annotations.length, 3);

            assert.equal(annotations[0].name, "first");
            assert.equal(annotations[1].name, "second");
            assert.equal(annotations[2].name, "third");
        });

        it('includes annotations from base types when inherit argument is true even when name is specified', () => {

            helpers.referenceFixture("interfaceExtendsInterface");

            var annotations = reflect.resolve("InterfaceExtendsInterface3").getDeclaredType().getAnnotations("first", true);
            assert.isArray(annotations);
            assert.equal(annotations.length, 1);

            assert.equal(annotations[0].name, "first");
        });
    });

    describe('getProperties', () => {

        it('returns properties for module\'s anonymous type', () => {

            helpers.referenceFixture("moduleWithVariables");

            var properties = reflect.resolve("moduleWithVariables").getType().getProperties();
            var type = properties[2].getType();
            assert.equal(properties[0].getName(), "a");
            assert.equal(properties[1].getName(), "b");
            assert.equal(properties[2].getName(), "c");
        });

        it('returns accessors as properties on class', () => {

            helpers.referenceFixture("classWithAccessors");

            var properties = reflect.resolve("ClassWithAccessors").getDeclaredType().getProperties();
            assert.equal(properties[0].getName(), "a");
            assert.equal(properties[1].getName(), "b");
            assert.equal(properties[2].getName(), "c");
        });

        it('returns empty array for type that does not have any properties', () => {

            helpers.referenceFixture("interfaceWithoutProperties");

            var properties = reflect.resolve("InterfaceWithoutProperties").getDeclaredType().getProperties();
            assert.isArray(properties);
            assert.equal(properties.length, 0);
        });

        it.skip('needs tests for private members', () => {

            helpers.referenceFixture("classWithPrivateMembers");

            var declaredType = reflect.resolve("ClassWithPrivateMembers").getDeclaredType();
            assert.ok(true);
        });
    });

    describe('getCallSignatures', () => {

        it('returns an array of call signatures', () => {

            helpers.referenceFixture("interfaceWithSignatures");

            var signatures = reflect.resolve("InterfaceWithSignatures").getDeclaredType().getCallSignatures();
            assert.isArray(signatures);
            assert.lengthOf(signatures, 1);
            assert.ok(signatures[0].getReturnType().isNumber());
        });

        it('returns an empty array if type does not have any call signatures', () => {

            helpers.referenceFixture("classWithPrivateMembers");

            var signatures = reflect.resolve("ClassWithPrivateMembers").getDeclaredType().getCallSignatures();
            assert.lengthOf(signatures, 0);
        });
    });

    describe('getEnumName', () => {

        it('returns the name of the enum constant for the given value', () => {

            var enumType = helpers.requireFixture("enumInExternalModule").getDeclaredType();
            assert.equal(enumType.getEnumName(1), "value2");
        });
    });

    describe('getEnumValue', () => {

        it('returns the value of the given enum constant name', () => {

            var enumType = helpers.requireFixture("enumInExternalModule").getDeclaredType();
            assert.equal(enumType.getEnumValue("value3"), 2);
        });

        it('should ignore case when ignoreCase parameter is true', () => {

            var enumType = helpers.requireFixture("enumInExternalModule").getDeclaredType();

            assert.isUndefined(enumType.getEnumValue("VALUE3"), "should not have found VALUE3");
            assert.equal(enumType.getEnumValue("VALUE3", true), 2);
        });
    });

    describe('hasBaseType', () => {

        it('should return true for generic interface as base type of concrete of interface', () => {

            helpers.referenceFixture("arrayAsGeneric");

            var type = reflect.resolve("ArrayAsGeneric").getDeclaredType();
            assert.ok(type.hasBaseType(reflect.resolve("Array").getDeclaredType()));
        });
    });

    describe('isSubclassOf', () => {

        var fixture = helpers.requireFixture("classInheritance");
        var classA = fixture.resolve("ClassA").getDeclaredType();
        var classB = fixture.resolve("ClassB").getDeclaredType();
        var classC = fixture.resolve("ClassC").getDeclaredType();
        var genericA = fixture.resolve("GenericA").getDeclaredType();
        var genericB = fixture.resolve("GenericB").getDeclaredType();
        var concreteB = fixture.resolve("ConcreteB").getDeclaredType();
        var referenceB = fixture.resolve("ReferenceB").getType();

        it('should return true if target is a direct base class', () => {
            assert.ok(classB.isSubclassOf(classA));
        });

        it('should return true if target is an ancestor', () => {
            assert.ok(classC.isSubclassOf(classA));
        });

        it('should return false if target is not a base class', () => {
           assert.notOk(classC.isSubclassOf(genericB));
        });

        it('should return true if target is open generic base class of open generic', () => {
            assert.ok(genericB.isSubclassOf(genericA));
            assert.notOk(genericA.isSubclassOf(genericB));
        });

        it('should return true if target is open generic base class of concrete generic base class', () => {
            assert.ok(concreteB.isSubclassOf(genericB));
            assert.notOk(genericB.isSubclassOf(concreteB));
        });

        it('should return true if target is open generic ancestor of concrete generic base class', () => {
            assert.ok(concreteB.isSubclassOf(genericA));
            assert.notOk(genericA.isSubclassOf(concreteB));
        });

        it('should return true if target is open generic base class of concrete generic reference ', () => {
            assert.ok(referenceB.isSubclassOf(genericB));
        });
    });
});


/*
 export class ClassA {

 }

 export class ClassB extends ClassA {

 }

 export class ClassC extends ClassB {

 }

 export class GenericA<T> {

 }

 export class GenericB<T> extends GenericA<T> {

 }

 export class ConcreteB extends GenericB<string> {

 }
 */