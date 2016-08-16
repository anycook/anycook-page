// Generated on 2014-01-24 using generator-webapp 0.4.7
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // Configurable paths
            app: 'app',
            dist: 'dist',
            assetDomain: 'https://s3-eu-west-1.amazonaws.com/anycook.de/'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            sass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                tasks: ['sass', 'autoprefixer']
            },
            // compass: {
            //     files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
            //     tasks: ['compass:server', 'autoprefixer']
            // },
            styles: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/{,*/}*.html',
                    '.tmp/styles/{,*/}*.css',
                    '<%= yeoman.app %>/img/{,*/}*.{gif,jpeg,jpg,png,svg,webp}',
                    '<%= yeoman.app %>/templates/{,*/}*.erb'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // Change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    open: true,
                    base: '<%= yeoman.dist %>',
                    livereload: false
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*'
            ]
        },

        bower: {
            install: {
                options: {
                    copy: false
                }
            }
        },

        sass : {
            options: {
                sourceMap: true,
                includePaths: [
                    '<%= yeoman.app %>/bower_components/compass-mixins/lib'
                ]
            },
            '.tmp/styles/style.css': '<%= yeoman.app %>/styles/style.scss'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/styles/',
                    src: '{,*/}*.css',
                    dest: '.tmp/styles/'
                }]
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{gif,jpeg,jpg,png,webp}',
                        '<%= yeoman.dist %>/styles/fonts/{,*/}*.*'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: '<%= yeoman.app %>/index.html'
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
        },

        // replace script domain
        'string-replace': {
            files: {
                src: '<%= yeoman.dist %>/index.html',
                dest: '<%= yeoman.dist %>/index.html'
            },
            options : {
                replacements: [{
                    pattern: /<base href="(\/)">/ig,
                    replacement: '<base href="<%= yeoman.assetDomain %>">'
                }/*,
                {
                    pattern: /<img(.*)src="\/(.*)"/ig,
                    replacement: '<img$1src="<%= yeoman.assetDomain %>/$2"'
                },
                {
                    pattern: /<script(.*)src="(.*)"/ig,
                    replacement: '<script$1src="<%= yeoman.assetDomain %>/$2"'
                },
                {
                    pattern: /<link(.*)href="(.*)"/ig,
                    replacement: '<link$1href="<%= yeoman.assetDomain %>/$2"'
                }*/]
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: [
                        'img/{,*/}*.{gif,jpeg,jpg,png}',
                        'icons/{,*/}*.{gif,jpeg,jpg,png}'
                    ],
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/images'
                }]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseBooleanAttributes: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true,
                    removeCommentsFromCDATA: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.dist %>',
                    src: '{,*/}*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        //cssmin: {
        //    dist: {
        //        files: {
        //            '<%= yeoman.dist %>/styles/style.css':
        //                '.tmp/styles/{,*/}*.css'
        //        }
        //    }
        //},
        // uglify: {
        //     dist: {
        //         files: {
        //             '<%= yeoman.dist %>/scripts/scripts.js': [
        //                 '<%= yeoman.dist %>/scripts/scripts.js'
        //             ]
        //         }
        //     }
        // },
        // concat: {
        //     dist: {}
        // },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        'images/{,*/}*.webp',
                        '{,*/}*.html',
                        'styles/fonts/{,*/}*.*',
                        'xml/template.xml',
                        'sounds/*.mp3'
                    ]
                }]
            },
            styles: {
                expand: true,
                dot: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '{,*/}*.css'
            },
            credentials : {
                src: 'anycook-credentials.json',
                dest: '<%= yeoman.dist %>/anycook-credentials.json'
            }
        },



        // Run some tasks in parallel to speed up build process
        concurrent: {
            server: [
                // 'compass:server',
                'sass',
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'sass',
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },
        requirejs: {
            dist: {
                options: {
                    baseUrl        : '<%= yeoman.app %>/scripts/',
                    name           : 'main',
                    mainConfigFile : '<%= yeoman.app %>/scripts/main.js',
                    out            : '.tmp/concat/scripts/main.js',
                    paths : {
                        'FB' : 'empty:'
                    },
                    stubModules: ['text', 'tpl'],
                    removeCombined: true
                }
            }
        }
    });


    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        grunt.task.run([
            'clean:server',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'bower',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'requirejs:dist',
        'cssmin',
        'uglify',
        'copy:dist',
        'copy:credentials',
        //'modernizr',
        'rev',
        'usemin',
        'string-replace',
        'htmlmin',
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'build'
    ]);
};
