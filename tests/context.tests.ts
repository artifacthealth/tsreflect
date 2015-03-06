/// <reference path="../typings/node.d.ts"/>
/// <reference path="../typings/mocha.d.ts"/>
/// <reference path="../typings/chai.d.ts"/>
/// <reference path="../typings/weak.d.ts"/>


import chai = require("chai");
import assert = chai.assert;
import reflect = require("./tsreflect");
import helpers = require("./helpers");
import weak = require("weak");

describe('context', () => {

    describe('reference', () => {

        it('loads internal module within the context, separate from the global context', () => {

            var context = reflect.createContext();
            helpers.referenceFixtureInContext(context, "onlyLoadedInContext");

            // is able to fine symbol within context
            var nameSymbol = context.resolve("OnlyLoadedInContext").getDeclaredType().getProperty("name");
            assert.equal(nameSymbol.getAnnotations("defaultValue")[0].value, "The Class");

            // but can't find symbol in global context
            assert.throws(() => {
                var name = reflect.resolve("OnlyLoadedInContext");
            }, Error, "Cannot find name 'OnlyLoadedInContext'.");
        });
    });
});
