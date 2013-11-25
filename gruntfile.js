module.exports = function (grunt) {

    var config = {
        pkg:grunt.file.readJSON('package.json'),
        srcDir:'src',
        destDir:'dist',
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
                    'dist/css/output.css':['bootstrap.min.css','bootstrap-select.min.css']
                }
            },
            minify:{
                expand:true,
                cwd:'css/',
                src:['*.css', '!*.min.css'],
                dest:'<%= destDir %>/css/',
                ext:'.min.css'
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

    grunt.initConfig(config);

    grunt.registerTask('default', [ 'clean', 'uglify', 'cssmin:minify', 'cssmin:combine' ]);
};