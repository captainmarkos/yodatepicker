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
        nodeunit: {
            files: ['test/**/*_test.js']
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
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'nodeunit']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');

    // Default task.
    grunt.registerTask('default', ['jshint', 'nodeunit']);

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
};
