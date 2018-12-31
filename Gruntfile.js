'use strict';

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
    grunt.initConfig({
        // Task configuration.
        concat: {
          // options: {
          //   separator: ';'
          // },
          dist: {
            src: ['app/js/yolib.js', 'app/js/yoconfig.js', 'app/js/yodatepicker.js'],
            dest: 'app/js/built.js'
          }
        },

        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish'),
                ignores: 'app/js/*.min.js'
            },
            all: {
                src: ['Gruntfile.js',
                      'app/js/built.js'] // 'app/js/{,*/}*.js']
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

        // Copy files
        copy: {
            main: {
                files: [
                    {
                        src: 'app/js/built.js', dest: 'dist/yodatepicker.js'
                    },
                    {
                        src: 'app/js/yojax.js', dest: 'dist/yojax.js'
                    }
                ]
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
                    'karma'
                ]);
            }
        }
    );

    grunt.registerTask('build', 'runs uglify', function() {
        grunt.task.run([
            'concat',
            'copy:main',
            'uglify'
        ]);
    });
};
