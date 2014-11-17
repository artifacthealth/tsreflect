/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>

import chai = require("chai");
import assert = chai.assert;
import reflect = require("./tsreflect");
import helpers = require("./helpers");

describe('Signature', () => {

    describe('getAnnotations', () => {

        it('returns a list of annotations matching name', () => {

            helpers.referenceFixture("interfaceWithSignatures");

            var signature = reflect.resolve("InterfaceWithSignatures").getDeclaredType().getCallSignatures()[0];
            assert.equal(signature.getAnnotations("someAnnotation")[0].name, "someAnnotation");
        });

        it('returns an empty array if no match is found for name', () => {

            helpers.referenceFixture("interfaceWithSignatures");

            var signature = reflect.resolve("InterfaceWithSignatures").getDeclaredType().getCallSignatures()[0];
            var annotations = signature.getAnnotations("someUnknownAnnotation");
            assert.lengthOf(annotations, 0);
        });

        it('returns a list of all annotations on the symbol when name is not given', () => {

            helpers.referenceFixture("interfaceWithSignatures");

            var signature = reflect.resolve("InterfaceWithSignatures").getDeclaredType().getCallSignatures()[0];
            var annotations = signature.getAnnotations();
            assert.lengthOf(annotations, 1);
        });
    });

    describe('getDescription', () => {

        it('returns description of signature', () => {

            helpers.referenceFixture("interfaceWithSignatures");

            var signature = reflect.resolve("InterfaceWithSignatures").getDeclaredType().getCallSignatures()[0];
            assert.equal(signature.getDescription(), "Call signature");
        });
    });

    describe('getReturnType', () => {

        it('returns return type of signature', () => {

            helpers.referenceFixture("interfaceWithSignatures");

            var signature = reflect.resolve("InterfaceWithSignatures").getDeclaredType().getCallSignatures()[0];
            assert.ok(signature.getReturnType().isNumber(), "Expected return type to be number");
        });
    })
});
