module.exports = function (grunt) {

    var config = {
        pkg:grunt.file.readJSON('package.json'),
        jsDir:'js',
        cssDir:'css',
        distDir:'dist',
        tempDir:'tmp',
        meta:{
            banner:'/*! \n' +
                '* <%= pkg.name %>\n' +
                '* Version: <%= pkg.version %>\n' +
                '* Build Date: <%= grunt.template.today("mm-dd-yyyy") %>\n' +
                '* Home: <%= pkg.homepage %>\n' +
                '* Copyright: (c) <%= grunt.template.today("yyyy") %>, <%= pkg.author.name %>\n' +
                '* License: <%= pkg.license %> \n*/\n\n'
        },
        clean:{
            dist:['dist'],
            cssAll:["<%= cssDir %>/all.min.css"],
            jsAll:["<%= jsDir %>/all.min.js"],
            temp:["<%= tempDir %>"]
        },
        cssmin:{
            combine:{
                files:{
                    'dist/css/output.css':['dist/css/*.min.css', 'dist/css/pnotify.min.css']
                },
                options:{
                    banner:'<%= meta.banner %>'
                }
            },
            minify:{
                expand:true,
                cwd:"<%= tempDir %>",
                src:['*.css'], // , '!*.min.css'],
                dest:'<%= cssDir %>',
                ext:'.min.css',
                options:{
                    keepSpecialComments:0,
                    report:'min',
                    banner:'<%= meta.banner %>'
                }
            }
        },
        copy:{
            copycss:{
                cwd:'css/',
                expand:true,
                src:['***/*//*.min.css'],
                dest:'<%= tmp %>/css'
            }
        },
        uglify:{
            files:{
                src:[
                    //'js*//*.js',
                    //'js/model/util/ModelUtil.js' ,
                    "<%= tempDir %>/all.js"//,
                    //'!lib*//*'
                ],
                dest:"<%= jsDir %>", // destination folder
                expand:true, // allow dynamic building
                flatten:true, // remove all unnecessary nesting
                ext:'.min.js'   // .js to .min.js
            },
            options:{
                quite:true,
                compress:true,
                report:'min',
                //mangle:false,
                preserveComments:false,
                banner:'<%= meta.banner %>'
            }
        },
        concat:{
            css:{
                src:[
                    'css//*.css'
                ],
                dest:'<%= tempDir %>/all.css'
            },
            js:{
                options:{
                    stripBanners:true
                },
                src:[
                    'js/template*//*.js',
                    'js/model//*//*.js',
                    'js/model//index//action//*.js',
                    'js/collection/*/*.js',
                    'js/view*//*.js',
                    'js/view*//*//*.js',
                    'js/view*//index//action//*.js',
                    'js/view*//mapping//action//*.js',
                    'js/route*//*.js',
                    'js/util*//*.js' ,
                    '!js/util/constants.js',
                    '!js/model/util/ModelUtil.js',
                    '!js/lib*//*'
                ],
                dest:'<%= tempDir %>/all.js'
            }
        },
        targethtml:{
            dist:{
                files:{
                    'index.html':'tpl/index.html'
                }
            },
            dev:{
                files:{
                    'index.html':'tpl/index.html'
                }
            }
        },
        jshint:{
            files:{
                src:['Gruntfile.js', '<%= jsDir %>/**/*.js']
            },
            options:{
                jshintrc:'.jshintrc',
                ignores:['<%= jsDir %>/lib/**', '<%= jsDir %>/all.min.js']
            }
        }
        /*,
         watch:{
         js:{ files:'js*//**//*.js', tasks:[ 'uglify' ] }
         }*/};

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-targethtml');

    grunt.initConfig(config);

    // grunt.registerTask('default', [ 'clean', 'concat', 'cssmin:minify', 'uglify']);
    grunt.registerTask('default', [ 'clean', 'jshint']);

    grunt.registerTask('dist', [ 'clean', 'concat:css', 'cssmin:minify', 'concat:js', 'uglify', 'targethtml:dist']);

    grunt.registerTask('dev', [ 'clean:temp', 'targethtml:dev']);

    // Concat and Minify the src directory into dist
    /*    grunt.registerTask('build-dev',
     [
     'clean',
     'uglify',
     'cssmin:minify',
     'cssmin:combine' ]
     );*/
};