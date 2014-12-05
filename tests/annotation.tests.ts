/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>

import chai = require("chai");
import assert = chai.assert;
import reflect = require("./tsreflect");
import helpers = require("./helpers");

describe('Annotation', () => {

    describe('getDeclarationFileName', () => {

        it('', () => {
            helpers.referenceFixture("classWithAnnotations");

            var nameSymbol = reflect.resolve("ClassWithAnnotations").getDeclaredType().getProperty("name");
            var annotation = nameSymbol.getAnnotations("defaultValue")[0];
            assert.equal(annotation.value, "The Class");
            assert.equal(annotation.getDeclarationFileName(), helpers.getRelativeFixturePath("classWithAnnotations.d.json"));
        });
    });
});