module.exports = function(grunt) {
	grunt.initConfig({
		browserify: {
			dist: {
				files: {
					'src/js/module.js': ['src/js/script.js']
				}
			}
		},
		serve: {
			options: {
				port: 9000
			}
		},
		uglify: {
			target: {
				files: {
					'dist/js/output.min.js': ['src/js/module.js']
				}
			}
		}
	});
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-serve');
	
	grunt.task.registerTask('build', ['browserify','uglify', 'serve']);
};