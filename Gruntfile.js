module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-tsreflect");

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            build: {
                src: [
                    "build/"
                ]
            },
            lib: {
                src: [
                    "lib/tsreflect.js"
                ]
            }
        },

        typescript: {
            build: {
                options: {
                    target: "es3",
                    sourceMap: true,
                    declaration: false,
                    noImplicitAny: true
                },
                src: ['src/reflect.ts'],
                dest: 'build/tsreflect.js'
            },
            tests: {
                options: {
                    target: "es3",
                    module: "commonjs",
                    sourceMap: true,
                    noImplicitAny: true,
                    basePath: 'tests/'
                },
                src: [
                    'tests/*.ts'
                ],
                dest: 'build/'
            },
            fixtures: {
                options: {
                    target: "es5",
                    module: "commonjs",
                    noImplicitAny: true,
                    basePath: 'tests/fixtures/'
                },
                src: [
                    "tests/fixtures/*.ts"
                ],
                dest: "tests/fixtures/compiled/"
            }
        },

        concat: {
            lib: {
                options: {
                    banner: grunt.file.read("COPYRIGHT.txt")
                },
                src: [
                    'build/tsreflect.js'
                ],
                dest: 'lib/tsreflect.js'
            }
        },

        copy: {
            build: {
                files: [
                    {
                        expand: true,
                        cwd: 'lib/',
                        src: [
                            'lib.d.json',
                            'lib.core.d.json'
                        ],
                        dest: 'build/'
                    }
                ]
            }
        },

        watch: {
            typescript: {
                files: [
                    "src/**/*.ts",
                    "typings/**/*.ts"
                ],
                tasks: [ "typescript:build" ]
            }
        },

        tsreflect: {
            tests: {
                options: {
                    noLib: false,
                    accessors: true,
                    annotations: true,
                    typePrivates: true
                },
                src: [
                    "tests/fixtures/**/*.ts"
                ],
                dest: "tests/fixtures/compiled/"
            }
        },

        mochaTest: {
            tests: {
                options: {
                    reporter: 'spec'
                },
                src: ['build/**/*.tests.js']
            }
        }
    });

    // Default task(s).
    grunt.registerTask("default", [ "build", "lib", "tests" ]);
    grunt.registerTask("build", [ "clean:build", "typescript:build", "copy:build" ]);
    grunt.registerTask("lib", [ "clean:lib", "concat:lib" ]);
    grunt.registerTask("tests", [ "typescript:tests", "typescript:fixtures", "tsreflect:tests", "mochaTest:tests" ]);
};