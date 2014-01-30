module.exports = function(grunt) {
	
	grunt.initConfig({

		karma: {
			unit: {
				configFile: 'karma.conf.js',
				background: true,
				browsers: ['PhantomJS']
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
		}
	});


	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-karma');

	grunt.registerTask('testmode', ['karma:unit', 'watch:karma']);

	grunt.registerTask('testci', ['karma:continious', 'watch']);

};