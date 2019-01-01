'use strict';

/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        // Task configuration.

        babel: {
            options: {
              sourceMap: false,
              sourceType: 'script'
              //presets: ['@babel/preset-env']
            },
            dist: {
              files: {
                'app/js/yojax.js': 'app/es6/yojax.es6',
                'app/js/yolib.js': 'app/es6/yolib.es6',
                'app/js/yoconfig.js': 'app/es6/yoconfig.es6',
                'app/js/yodatepicker.js': 'app/es6/yodatepicker.es6'
              }
            }
        },

        concat: {
          options: {
            banner: "'use strict';\n"
            //separator: ';'
          },
          dist: {
            src: ['app/js/yolib.js', 'app/js/yoconfig.js', 'app/js/yodatepicker.js'],
            dest: 'dist/yodatepicker.js'
          }
        },

        // Copy files
        copy: {
            dist: {
                files: [
                    { src: 'app/js/yojax.js', dest: 'dist/yojax.js' },
                    { src: 'app/js/dom_layout.js', dest: 'dist/dom_layout.js' }
                ]
            }
        },

        // minify
        uglify: {
            my_target: {
                files: {
                   'dist/yodatepicker.min.js': ['dist/yodatepicker.js'],
                   'dist/yojax.min.js': ['dist/yojax.js']
                }
            }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                ignores: 'app/js/*.min.js'
            },
            all: {
                src: [ 'Gruntfile.js',
                       'app/js/*.js',
                       'dist/yodatepicker.js' ] // 'app/js/{,*/}*.js'
            }
        },

        // Test settings
        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },

        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            jsTest: {
                files: ['test/unit/*.js'],
                tasks: ['jshint:all', 'karma']
            }
        },

        shell: {
            output_code_coverage: {
                command: 'cat test/coverage/text.txt',
                options: {
                    stderr: false
                }
            },
            output_code_coverage_summary: {
                command: 'cat test/coverage/text-summary.txt',
                options: {
                    stderr: false
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks('grunt-shell');

    // Default task.
    grunt.registerTask('default', ['jshint']);

    grunt.registerTask('test', 'runs jshint and karma',
        function(test) {
            if(test === 'unit') {
                grunt.task.run([
                    'karma'
                ]);
            } else {
                grunt.task.run([
                    'jshint:all',
                    'karma',
                    'shell:output_code_coverage',
                    'shell:output_code_coverage_summary'
                ]);
            }
        }
    );

    grunt.registerTask('transpile', 'transpile es6 => js', function() {
        grunt.task.run([ 'babel' ]);
    });

    grunt.registerTask('build', 'concat -> babel -> uglify', function() {
        grunt.task.run([
            'babel',
            'concat',
            'copy:dist',
            'uglify'
        ]);
    });
};
