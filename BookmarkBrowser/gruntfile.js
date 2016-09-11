var pkgJson = require('./package.json');

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        // Concat the specified files into mb-core.js
        concat: {
            bmb_core : {
                src: ['scripts/bmb/**/*.js'],
                dest: 'scripts/bmb-core.js'
            }
        },
        // Minify the combined JS file
        uglify: {
            options: {
                // Banner for inserting at the top of the result
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy hh:") %> */\n',
                sourceMap: true,
                sourceMapName: 'scripts/sourceMap.map'
            },
            bmb_core: {
                src: [
                    'Scripts/bmb-core.js'
                ],
                dest: 'Scripts/bmb-core.min.js'
            }
        },
        cachebreaker: {
            bmb_core: {
                options: {
                    match: ['scripts/bmb-core.min.js'],
                    replacement: function (){
                        return pkgJson.version;
                    }
                },
                files: {
                    src: ['index.html']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-cache-breaker');

    var target = grunt.option('target') || 'debug';

    if (target === "debug") {
        grunt.registerTask('default', ['concat:bmb_core', 'uglify:bmb_core']);
    }
    else {
        grunt.registerTask('default', ['concat:bmb_core', 'uglify:bmb_core', 'cachebreaker:bmb_core']);
    }
}
