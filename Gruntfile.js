module.exports = function(grunt) {

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-typescript");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-mocha-test");

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
                src: ['tests/**/*.ts'],
                dest: 'build/'
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
                            'lib.d.json'
                        ],
                        dest: 'build/'
                    }
                ]
            },
            bin: {
                files: [
                    {
                        expand: true,
                        cwd: 'lib/',
                        src: [
                            'tsreflect-compiler.d.ts',
                            'lib.d.ts'
                        ],
                        dest: 'bin/'
                    }
                ]
            }
        },

        // Use built compiler to generated .d.json for lib.d.ts
        shell: {
            bin: {
                options: {
                    execOptions: {
                        cwd: 'bin/'
                    }
                },
                command: 'node tsreflect-compiler.js lib.d.ts'
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
    grunt.registerTask("tests", [ "typescript:tests", "mochaTest:tests" ]);
};