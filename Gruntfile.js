module.exports = function(grunt){

	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
		jquery: {
		  dev: {
			options: {
			  prefix: "jquery-",
			  minify: true
			},
			output: "../resource/js",
			versions: {
				"2.1.1" : []
			}
		  }
		},
		less: {
		  development: {
			
		  },
		  production: {
			options: {
			  paths: ["../resource/less"],
//			  compress: true,
//			  yuicompress: true,
//			  optimization: 2,
//			  cleancss: true
			},
			files: {
			  "assets/css/style.css": "../resource/less/style.less",
			}
		  }
		},
//		copy: {
//		  main: {
//			expand: false,
//			src: 'Assets/js/custom.js',
//			dest: 'HTML/assets/js/custom.js',
//		  },
//		},
		uglify: {
		  js: {
			files: { 
				'assets/js/lib.js': [
					'../resource/js/jquery-2.1.1.js',
					'../resource/js/easing.js.min.js',
					'../resource/js/owl.carousel.min.js',
					'../resource/js/jquery.sticky.js',
					'../resource/js/customHead.js'
				]
			}
		  }
		},
		backup: {
			your_target: {
			  src: '../resource/less',
			  dest: 'Backup'
			},
		},
		watch: {
			css: {
				files: ['../resource/less/*.less'],
				tasks: ['less'],
				options: {
					spawn: false,
				},
			},
			scripts: {
				files: ['assets/js/custom.js'],
				//tasks: ['copy'],
				options: {
					spawn: false,
				},
			},
			html: {
				files: ['*.html'],
				//tasks: ['copy'],
				options: {
					spawn: false,
				},
			},
			options: {
				livereload:true
			},
		}
	})
	grunt.loadNpmTasks('grunt-jquery-builder');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
//	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-backup');
	
	grunt.registerTask('default', ['watch']);
	//grunt.registerTask('compile', ['jquery', 'uglify', 'less', 'copy', 'backup']);
	grunt.registerTask('compile', ['jquery', 'uglify', 'less', 'backup']);

}


