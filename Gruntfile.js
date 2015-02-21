module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			all: ['Gruntfile.js','develop/scripts']
		},
		connect: {
			sever: {
				options : {
					port: 3000,
					base: 'exports'
				}
			}
		},
		jade: {
			compile: {
				options: {
					pretty: true
				},
				files: [{
					expand: true,
					cwd: 'develop',
					src: '*.jade',
					dest: 'exports',
					ext: '.html'
				}]
			}
		},
		stylus : {
			compile: {
				files: [{
					expand: true,
					cwd: 'develop/styl',
					src: 'style.styl',
					dest: 'exports/css',
					ext: '.css'
				}]
			}
		},
		browserify: {
			app: {
				files: {
					'exports/scripts/code.js' : ['develop/scripts/code.js']
				},
				options : {
					transform : ['debowerify']
				}
			}
		},
		clean: {
			build: ['exports']
		},
		copy: {
			images: {
				expand: true,
				cwd: 'develop/img',
				src: '*',
				dest: 'exports/img'
			},
			media: {
				expand: true,
				cwd: 'develop/media',
				src: '*',
				dest: 'exports/media'
			},
			font: {
				expand: true,
				cwd: 'develop/fonts',
				src: '*',
				dest: 'exports/fonts'
			}
		},
		watch: {
			js: {
				files: 'develop/scripts/*.js',
				tasks: 'browserify'
			},
			css: {
				files: 'develop/styl/*.styl',
				tasks: 'stylus'
			},
			html: {
				files: 'develop/*.jade',
				tasks: 'jade'
			},
			allFiles : {
				files: ['exports/scripts/*.js', 'exports/styles/*.css','exports/*.html'],
				options: {
					livereload: true
				}
			}
		},
		open: {
			dev : {
		      path: 'http://0.0.0.0:3000',
		      app: 'Google Chrome'
		    }
		}
	});

	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-contrib-stylus');
	grunt.loadNpmTasks('grunt-browserify');

	grunt.registerTask('default',function (param){
		if (param) {
			console.log(param);
		}
		grunt.task.run (['jshint', 'clean', 'browserify','copy', 'jade', 'stylus', 'connect','open:dev','watch']);
	});
};