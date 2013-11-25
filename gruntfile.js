module.exports = function (grunt) {

    var config = {
        pkg:grunt.file.readJSON('package.json'),
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
            dist:['dist']
        },
        cssmin:{
            combine:{
                files:{
                    'dist/css/output.css':['dist/css/elastichq.min.css', 'dist/css/pnotify.min.css']
                },
                options:{
                    banner:'<%= meta.banner %>'
                }
            },
            minify:{
                expand:true,
                cwd:'css/',
                src:['*.css', '!*.min.css'],
                dest:'<%= distDir %>/css/',
                ext:'.min.css',
                options:{
                    report:'min'
                }
            }
        },
        copy:{
            copycss:{
                cwd:'css/',
                expand:true,
                src:['**/*.min.css'],
                dest:'<%= distDir %>/css'
            }
        },
        uglify:{
            files:{
                src:['js/*.js', '!lib/*'], // source files mask
                //src: ['**/*.js', '!config.js', '!app/dashboards/*.js'],
                dest:'dist', // destination folder
                expand:true, // allow dynamic building
                flatten:true, // remove all unnecessary nesting
                ext:'.min.js'   // .js to .min.js
            },
            options:{
                quite:true,
                compress:true,
                preserveComments:false,
                banner:'<%= meta.banner %>'
            }
        },
        watch:{
            js:{ files:'js*//*.js', tasks:[ 'uglify' ] }
        }};

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.initConfig(config);

    grunt.registerTask('default', [ 'clean', 'uglify', 'copy:copycss', 'cssmin:minify', 'cssmin:combine' ]);

    // Concat and Minify the src directory into dist
    grunt.registerTask('build-dev',
        [
            'clean',
            'uglify',
            'cssmin:minify',
            'cssmin:combine' ]
    );
};