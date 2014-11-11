/// <reference path="../typings/node.d.ts"/>

/// <reference path="declaration.ts"/>
/// <reference path="loader.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="type.ts"/>
/// <reference path="checker.ts"/>

module reflect {

    var start = process.hrtime();
    var files = processRootFile("tests/tsreflect.d.json");
    // TODO: load lib
    forEach(files, bindSourceFile);
    initializeGlobalTypes();

    var GenericType = getDeclaredTypeOfSymbol(resolveEntityName(undefined, "reflect.GenericType", SymbolFlags.Type));
    var Type = getDeclaredTypeOfSymbol(resolveEntityName(undefined, "reflect.Type", SymbolFlags.Type));

    console.log(isTypeAssignableTo(Type, GenericType));
    console.log(isTypeAssignableTo(GenericType, Type));

    printTypeErrors();

    var elapsed = process.hrtime(start);
    console.log("Completed without errors in " + elapsed[0] + "s, " + (elapsed[1] / 1000000).toFixed(3) + "ms");
}
