module.exports = function(grunt) {
	grunt.initConfig({
		less: {
			development: {
				files: {
					'src/css/style.css': 'src/css/style.less'
				}
			}
		},
		cssmin: {
			target: {
				files: [{
					expand: true,
					cwd: 'src/css',
					src: ['style.css'],
					dest: 'dist/css',
					ext: '.min.css'
				}]
			}
		},
		browserify: {
			dist: {
				files: {
					'src/js/module.js': ['src/js/index.js']
				}
			}
		},
		uglify: {
			target: {
				files: {
					'dist/js/output.min.js': ['src/js/module.js']
				}
			}
		},
		serve: {
			options: {
				port: 9000
			}
		}
	});
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-serve');
	
	grunt.task.registerTask('build', ['less','cssmin','browserify','uglify', 'serve']);
};