'use strict';

/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
    grunt.initConfig({
        // Task configuration.
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: {
                src: ['Gruntfile.js',
                      'app/js/{,*/}*.js']
            }
        },

        // minify
        uglify: {
            my_target: {
                files: {
                   'app/js/yodatepicker.min.js': ['app/js/yodatepicker.js']
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
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-uglify');

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
            'uglify'
        ]);
    });
};
