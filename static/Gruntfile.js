module.exports = function(grunt) {

    // Overmind project configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * clean - removes compiled and temp directories
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        clean: {
            dev: ['dist', 'temp']
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * sass - compile scss to css
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        sass: {
            // production css
            prod: {
                options: {
                    style: 'compressed',
                    quiet: true,

                    // import app styles
                    loadPath: [
                        'src/styles/',
                        'src/styles/vendor'
                    ]
                },
                files: {
                    'dist/styles/app.min.css': [
                        'src/styles/app.scss'
                    ],
                    'dist/styles/components.min.css': [
                        'src/styles/components.scss'
                    ],
                    'dist/styles/library.min.css': [
                        'src/styles/library.scss'
                    ],
                }
            },
            // dev css
            dev: {
                options: {
                    style: 'expanded',
                    debugInfo: true,
                    lineNumbers: true,
                    quiet: true,

                    // import app styles
                    loadPath: [
                        'src/styles/',
                        'src/styles/vendor'
                    ]
                },
                files: {
                    'dist/styles/app.css': [
                        'src/styles/app.scss'
                    ],
                    'dist/styles/components.css': [
                        'src/styles/components.scss'
                    ],
                    'dist/styles/library.css': [
                        'src/styles/library.scss'
                    ]
                }
            }
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * includereplace - translude partial .html files as single line string in directives .js files
        * requires custom include replace addition: includeContents = includeContents.replace(/(\r\n|\n|\r|\s\s\s\s)/gm,"");
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        includereplace: {
            dist: {
                options: {
                    // Global variables available in all files
                    globals: {
                        var1: 'one',
                        var2: 'two',
                        var3: 'three'
                    },
                    // Optional variable prefix & suffix, defaults as shown
                    prefix: '@@',
                    suffix: ''
                },
                // Files to perform replacements and includes with
                src: 'src/scripts/**/*.js',
                // Destinaion directory to copy files to
                dest: 'temp/'
            }
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * jshint - lint js
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        jshint: {
            all: {
                options: {

                    // environment
                    browser: true,

                    // enforce
                    latedef: 'nofunc',
                    quotmark: 'single',
                    eqnull: true,
                    forin: true,
                    bitwise: true,
                    noempty: true,
                    undef: true,
                    strict: true,
                    trailing: true,
                    maxparams: 10,
                    maxdepth: 4,
                    maxstatements: 75,
                    maxcomplexity: 15,

                    // global definitions
                    globals: {
                        jQuery: true,
                        angular: true,
                        $: true,

                        // libraries
                        qq: true,
                        moment: true,
                        Opentip: true,
                        AnimationFrame: true,
                        Modernizr: true,

                        // browser
                        log: true,
                        console: true,
                        confirm: true,
                        opera: true
                    },

                    // ignores
                    '-W069': true
                },
                src: [
                    'src/scripts/**/*.js'
                ]
            }
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * concat - jobs: overmind_lib, overmind_app
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        concat: {
            options: {
                separator: ';'
            },

            // angular_lib
            angular_lib: {
                src: [
                    'src/lib/angular/angular-route.js',
                    'src/lib/angular/angular-sanitize.js',
                    'src/lib/angular/angular-touch.js',
                    'src/lib/angular/angular-cookies.js',

                    'src/lib/angular/angular-resource.js',
                    'src/lib/angular/angular-animate.js'
                ],

                dest: 'dist/scripts/angular_lib.js'
            },

            // overmind_lib
            overmind_lib: {
                src: [
                    // utilities
                    'src/lib/sugar.min.js',                             // javascript utilities

                    // jquery plugins
                    'src/lib/jquery.mousewheel.js',                     // mousewheel support
                    'src/lib/canvas-to-blob.js',                        // canvas.toBlob polyfill
                    'src/lib/jquery.isotope.js',                        // isotope - dynamic layout

                    'src/lib/redactor.js',                              // redactor - html editor (textarea replacement)

                    'src/lib/perfect-scrollbar.js',                     // custom scrollbar

                    'src/lib/jquery.timeago.js',                        // relative and live time stamps
                    'src/lib/moment.min.js',                            // date library

                    // opentip
                    'src/lib/opentip/opentip.js',                       // tooltips
                    'src/lib/opentip/adapter.jquery.js'
                ],

                dest: 'dist/scripts/overmind_lib.js'
            },

            // overmind_app
            overmind_app: {
                src: [
                    'src/scripts/overmind.js',
                    'src/scripts/**/*.js'
                ],

                dest: 'dist/scripts/overmind_app.js'
            }
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * uglify - jobs: overmind_lib, overmind_app
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        uglify: {
            overmind_lib: {
              files: {
                'dist/scripts/overmind_lib.min.js': ['dist/scripts/overmind_lib.js']
              }
            },
            overmind_app: {
              files: {
                'dist/scripts/overmind_app.min.js': ['dist/scripts/overmind_app.js']
              }
            }
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * removeLogging - remove console.[info, log, ect..] statements
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        removelogging: {
            dist: {
                src: "dist/scripts/overmind_app.js",
                dest: "dist/scripts/overmind_app.js",

                options: {
                    // see below for options. this is optional.
                }
            }
        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * ftp-deploy - upload static assets to ftp
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        'ftp-deploy': {
          css: {
            auth: {
              host: 'codecollision.com',
              port: 21,
              authKey: 'key1'
            },
            src: 'dist/styles',
            dest: '/home/hexvector/webapps/overmind_static/styles/',
            exclusions: ['']
          },

          js: {
            auth: {
              host: 'codecollision.com',
              port: 21,
              authKey: 'key1'
            },
            src: 'dist/scripts/',
            dest: '/home/hexvector/webapps/overmind_static/scripts/',
            exclusions: ['']
          },

          partials: {
            auth: {
              host: 'codecollision.com',
              port: 21,
              authKey: 'key1'
            },
            src: 'src/partials/',
            dest: '/home/hexvector/webapps/overmind_static/partials/',
            exclusions: ['']
          }

        },

        /**~~~~~~~~~~~~~~~~~~~~~~~~~~~
        * watch - jobs: overmind_lib, overmind_app, less
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
        watch: {

            partials: {
                files: ['src/partials/**'],
                tasks: ['ftp-deploy:partials'],
                options: {
                  nospawn: false,
                  interrupt: true,
                  debounceDelay: 2000
                }
            },
            overmind_lib: {
                files: ['src/lib/**/*.js'],
                tasks: ['concat:overmind_lib', 'ftp-deploy:js'],
                options: {
                  nospawn: false,
                  interrupt: true,
                  debounceDelay: 2000
                }
            },
            overmind_app: {
                files: ['src/scripts/**/*.js', 'apps/**/scripts/**/*.js'],
                tasks: ['clean', 'concat:overmind_app', 'ftp-deploy:js'],
                options: {
                  nospawn: false,
                  interrupt: true,
                  debounceDelay: 2000
                }
            },
            sass: {
                files: ['src/styles/**/*.scss'],
                tasks: ['sass:dev', 'ftp-deploy:css'],
                options: {
                  nospawn: false,
                  interrupt: true,
                  debounceDelay: 2000
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-remove-logging');
    grunt.loadNpmTasks('grunt-ftp-deploy');
    grunt.loadNpmTasks('grunt-include-replace');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Default Development task
    grunt.registerTask('default', ['clean', 'concat', 'sass:dev', 'ftp-deploy']);

    // Production Task - copy partials, concat js, remove logging statements, minify scripts, compile scss
    grunt.registerTask('production', ['clean', 'jshint', 'concat', 'removelogging', 'uglify', 'sass:prod', 'ftp-deploy']);

};
