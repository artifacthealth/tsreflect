/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>

import chai = require("chai");
import assert = chai.assert;
import reflect = require("./tsreflect");
import helpers = require("./helpers");
import classExportedInExternalModule = require("./fixtures/classExportedInExternalModule");

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

    describe('hasAnnotation', () => {

        it('should return true if annotation is defined on base type and insert argument is true', () => {

            helpers.referenceFixture("interfaceExtendsInterface");
            assert.isTrue(reflect.resolve("InterfaceExtendsInterface3").getDeclaredType().hasAnnotation("first", true));
        });

        it('should return false if annotation is defined on base type and insert argument is false', () => {

            helpers.referenceFixture("interfaceExtendsInterface");
            assert.isFalse(reflect.resolve("InterfaceExtendsInterface3").getDeclaredType().hasAnnotation("first"));
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

        it('returns properties that all types have in common for union types', () => {

            var fixture = helpers.requireFixture("unionOfInterfaces");
            var type = fixture.resolve("C").getDeclaredType();
            var properties = type.getProperties();
            assert.lengthOf(properties, 1);
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

        it('returns signature for interface method', () => {

            var type = helpers.requireFixture("interfaceWithMethod").getDeclaredType();
            var symbol = type.getProperty("b");
            var methodType = symbol.getType();
            var signatures = methodType.getCallSignatures();
            assert.isTrue(signatures.length > 0);
            assert.isTrue(signatures[0].getParameter("a") !== undefined);
        });

        it('returns signature for interface method that has empty parameter list', () => {

            var type = helpers.requireFixture("interfaceWithMethod").getDeclaredType();
            var symbol = type.getProperty("c");
            var methodType = symbol.getType();
            var signatures = methodType.getCallSignatures();
            assert.isTrue(signatures.length > 0);
            assert.lengthOf(signatures[0].getParameters(), 0)
        });
    });

    describe('getEnumName', () => {

        it('returns the name of the enum constant for the given value', () => {

            var enumType = helpers.requireFixture("enumInExternalModule").getDeclaredType();
            assert.equal(enumType.getEnumName(1), "value2");
        });

        it('returns the name of the enum constant for the given value for a const enum', () => {

            var enumType = helpers.requireFixture("enumConst").getDeclaredType();
            assert.equal(enumType.getEnumName(1), "value1");
        });
    });

    describe('getEnumNames', () => {

        it('returns all named enum values', () => {

            var enumType = helpers.requireFixture("enumInExternalModule").getDeclaredType();
            var names = enumType.getEnumNames();
            assert.isArray(names);
            assert.lengthOf(names, 3);
            assert.equal(names[0], "value1");
            assert.equal(names[1], "value2");
            assert.equal(names[2], "value3");
        });

        it('returns all named enum values for a const enum', () => {

            var enumType = helpers.requireFixture("enumConst").getDeclaredType();
            var names = enumType.getEnumNames();
            assert.isArray(names);
            assert.lengthOf(names, 5);
            assert.equal(names[0], "value1");
            assert.equal(names[1], "value2");
            assert.equal(names[2], "value3");
            assert.equal(names[3], "value4");
            assert.equal(names[4], "all");
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

        it('returns the value of the given enum constant name for a const enum', () => {

            var enumType = helpers.requireFixture("enumConst").getDeclaredType();
            assert.equal(enumType.getEnumValue("value3"), 4);
        });

        it('should ignore case when ignoreCase parameter is true for a const enum', () => {

            var enumType = helpers.requireFixture("enumConst").getDeclaredType();

            assert.isUndefined(enumType.getEnumValue("VALUE3"), "should not have found VALUE3");
            assert.equal(enumType.getEnumValue("VALUE3", true), 4);
        });
    });

    describe('hasBaseType', () => {

        it('should return true for generic interface as base type of concrete of interface', () => {

            var fixture = helpers.requireFixture("arrayAsGeneric");

            var type = fixture.resolve("ArrayAsGeneric").getDeclaredType();
            assert.ok(type.hasBaseType(reflect.resolve("Array").getDeclaredType()));
        });
    });

    describe('hasInterface', () => {

        it('should return true for class that implements interface', () => {

            var fixture = helpers.requireFixture("classInheritance");
            var InterfaceA = fixture.resolve("InterfaceA").getDeclaredType();
            var ClassC = fixture.resolve("ClassC").getDeclaredType();

            assert.isTrue(ClassC.hasInterface(InterfaceA));
        });
    });

    describe("getInterface", () => {

        it('returns the base interface type for a class if a match is found for the name', () => {

            var fixture = helpers.requireFixture("classInheritance");
            var InterfaceA = fixture.resolve("InterfaceA").getDeclaredType();
            var ClassC = fixture.resolve("ClassC").getDeclaredType();

            assert.equal(ClassC.getInterface("InterfaceA"), InterfaceA, "Unable to find base type 'InterfaceA'");
        });

        it('returns the base interface type for a class if a match is found for the name even if class does not have base class', () => {

            var fixture = helpers.requireFixture("classInheritance");
            var InterfaceA = fixture.resolve("InterfaceA").getDeclaredType();
            var ClassD = fixture.resolve("ClassD").getDeclaredType();

            assert.equal(ClassD.getInterface("InterfaceA"), InterfaceA, "Unable to find base type 'InterfaceA'");
        });
    });

    describe('isIndex', () => {

        it('returns true if type has a string index', () => {

            var fixture = helpers.requireFixture("index");
            assert.isTrue(fixture.resolve("StringIndex").getDeclaredType().isIndex());
        });

        it('returns true if type has a number index', () => {

            var fixture = helpers.requireFixture("index");
            assert.isTrue(fixture.resolve("NumberIndex").getDeclaredType().isIndex());
        });

        it('returns false if type has neither a string nor number index', () => {

            var fixture = helpers.requireFixture("index");
            assert.isFalse(fixture.resolve("NoIndex").getDeclaredType().isIndex());
        });

    });

    describe('isUnion', () => {

        it('returns true when type is a union type', () => {

            var fixture = helpers.requireFixture("unionOnClassProperties");
            var type = fixture.getDeclaredType();
            assert.isTrue(type.getProperty("a").getType().isUnion());
            assert.isTrue(type.getProperty("b").getType().isUnion());
            assert.isFalse(type.getProperty("c").getType().isUnion());
        });
    });

    describe('isArray', () => {

        it('returns true when type is an array', () => {

            var fixture = helpers.requireFixture("arrayAsGeneric");
            assert.ok(fixture.resolve("stringArray").getType().isArray());
        });

        it('returns true when type has base type Array', () => {

            var fixture = helpers.requireFixture("arrayAsGeneric");
            assert.ok(fixture.resolve("ArrayAsGeneric").getDeclaredType().isArray());
        });

        it('otherwise, returns false', () => {

            var fixture = helpers.requireFixture("arrayAsGeneric");
            assert.notOk(reflect.resolve("String").getType().isArray());
        });
    });

    describe('getElementType', () => {

        it('returns element type of array when type is an array', () => {

            var fixture = helpers.requireFixture("arrayAsGeneric");
            assert.ok(fixture.resolve("stringArray").getType().getElementType().isString());
        });

        it('returns type argument of generic array base type', () => {

            var fixture = helpers.requireFixture("arrayAsGeneric");
            assert.ok(fixture.resolve("ArrayAsGeneric").getDeclaredType().getElementType().isNumber());
        });

        it('otherwise, returns false', () => {

            var fixture = helpers.requireFixture("arrayAsGeneric");
            assert.notOk(reflect.resolve("String").getType().isArray());
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

    describe('getConstructor', () => {

        it('returns the constructor for the specified class', () => {

            var moduleSymbol = helpers.requireFixture("classExportedInExternalModule");
            var testClassType = moduleSymbol.resolve("TestClass").getDeclaredType();

            var ctr = testClassType.getConstructor();
            assert.equal(ctr, classExportedInExternalModule.TestClass);
        });
    });

    describe('createInstance', () => {

        it('creates object with prototype and constructor matching declared class type', () => {

            var moduleSymbol = helpers.requireFixture("classExportedInExternalModule");
            var testClassType = moduleSymbol.resolve("TestClass").getDeclaredType();

            var obj = testClassType.createInstance();
            assert.equal(3, obj.add(1,2));
            assert.equal(obj.constructor, classExportedInExternalModule.TestClass);
        });

        it('creates object for class exported as export assignment', () => {

            var moduleSymbol = helpers.requireFixture("classAsExportAssignment");
            var testClassType = moduleSymbol.getDeclaredType();

            var obj = testClassType.createInstance();
            assert.equal(3, obj.add(1,2));
        });

        it('creates object for class in nested internal module exported as export assignment', () => {

            var moduleSymbol = helpers.requireFixture("classInInternalModuleAsExportAssignment");
            var testClassType = moduleSymbol.getDeclaredType();

            var obj = testClassType.createInstance();
            assert.equal(3, obj.add(1,2));
        });

        it('creates object for class in nested internal module where internal module is exported as export assignment', () => {

            var moduleSymbol = helpers.requireFixture("classInExportedInternalModule");
            var testClassType = moduleSymbol.resolve("B.TestClass").getDeclaredType();

            var obj = testClassType.createInstance();
            assert.equal(3, obj.add(1,2));
        });

        it('creates object for class in ambient external module', () => {

            reflect.reference("../typings/node.d.json");

            var bufferType = reflect.require("cluster").resolve("Worker").getDeclaredType();
            var obj = bufferType.createInstance();
            assert.ok(obj.kill);
        });

        it('creates object for global class', () => {

            var dateType = reflect.resolve("Date").getDeclaredType();
            var obj = dateType.createInstance();
            assert.ok(obj.getHours);
        });

        it('does not call the constructor if no arguments are provided', () => {

            var type = helpers.requireFixture("classWithConstructor").getDeclaredType();
            var obj = type.createInstance();
            assert.isUndefined(obj.constructorCalled);
        });

        it('calls constructor with empty array when empty array is passed to createInstance', () => {

            var type = helpers.requireFixture("classWithConstructor").getDeclaredType();
            var obj = type.createInstance([]);
            assert.isTrue(obj.constructorCalled);
        });

        it('calls constructor with arguments in array passed to createInstance', () => {

            var type = helpers.requireFixture("classWithConstructor").getDeclaredType();
            var obj = type.createInstance([1, "two"]);
            assert.lengthOf(obj.argumentsPassed, 2);
            assert.equal(obj.argumentsPassed[0], 1);
            assert.equal(obj.argumentsPassed[1], "two");
        });
    });

    describe("getBaseClass", () => {

        it('returns the base type that is a class', () => {

            var fixture = helpers.requireFixture("classInheritance");
            var classA = fixture.resolve("ClassA").getDeclaredType();

            assert.equal(fixture.resolve("ClassB").getDeclaredType().getBaseClass(), classA);
        });

        it('returns null if type does not have a base class', () => {

            var fixture = helpers.requireFixture("classInheritance");

            assert.equal(fixture.resolve("ClassA").getDeclaredType().getBaseClass(), null);
        });

    });

    describe("getBaseType", () => {

        it('returns undefined if a base type with the given name cannot be found', () => {

            var fixture = helpers.requireFixture("classInheritance");
            assert.isUndefined(fixture.resolve("ClassA").getDeclaredType().getBaseType("blah"));
        });

        it('returns the base class type if a match is found for the name', () => {

            var fixture = helpers.requireFixture("classInheritance");
            var ClassA = fixture.resolve("ClassA").getDeclaredType();
            var ClassC = fixture.resolve("ClassC").getDeclaredType();

            assert.equal(ClassC.getBaseType("ClassA"), ClassA, "Unable to find base type 'ClassA'");
        });

    });
});
