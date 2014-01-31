module.exports = function(grunt) {
    
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    


    grunt.initConfig({

         meta: {
          banner: 
            '/**\n' +
            ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
            ' * <%= pkg.homepage %>\n' +
            ' *\n' +
            ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n'
        },

        pkg: grunt.file.readJSON("package.json"),

       

        clean : ['dist/**/*'],

        concat : {
            options: {
                  banner: '<%= meta.banner %>',
                  nonull: true,
                },
            dist: {
                
                src: ['src/**/*.js'],
                dest: 'dist/thaana.angular.js'
                
            }
        },


        uglify : {
            dist : {
                options: {
                  banner: '<%= meta.banner %>'
                },

                files : {
                    'dist/thaana.angular.min.js' : 'src/thaana.angular.js'
                }
            }
        },


        karma: {
            unit: {
                configFile: 'karma.conf.js',
                background: true,
                browsers: ['Chrome']
            },

            continious: {
                configFile: 'karma.conf.js',
                singleRun: true,
                browsers: ['PhantomJS']
            }
        },

        watch: {
            karma: {
                files: [
                    'bower_components/angular/angular.js',
                    'bower_components/angular-mocks/angular-mocks.js',
                    'src/thaana.angular.js',
                    'test/unit/**/*.spec.js'
                ],
                tasks: ['karma:unit:run']
            }
        },


    });




    grunt.registerTask('testmode', ['build','karma:unit', 'watch:karma']);

    grunt.registerTask('testci', ['karma:continious', 'watch']);

    grunt.registerTask('build', ['karma:unit', 'clean', 'concat:dist', 'uglify:dist']);

};