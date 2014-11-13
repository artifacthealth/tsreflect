import reflect = require("./tsreflect");

reflect.reference("../tests/fixtures/reflect.d.json");
var processRootFile = reflect.resolve("reflect.resolveEntityName");

var type = processRootFile.getDeclaredType();

console.log(processRootFile.name);