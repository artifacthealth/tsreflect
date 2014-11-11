/// <reference path="../typings/node.d.ts"/>

/// <reference path="declaration.ts"/>
/// <reference path="loader.ts"/>
/// <reference path="binder.ts"/>
/// <reference path="builder.ts"/>
/// <reference path="type.ts"/>

module reflect {

    var start = process.hrtime();
    var files = processRootFile("tests/tsreflect.d.json");
    forEach(files, bindSourceFile);
    forEach(files, buildTypes)
    var elapsed = process.hrtime(start);
    console.log("Completed without errors in " + elapsed[0] + "s, " + (elapsed[1] / 1000000).toFixed(3) + "ms");
}
