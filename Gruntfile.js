'use strict';

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodemon: {
            dev: {
                script: 'server/server.js',
                options: {
                    args: [],
                    ignore: ['*.html', 'public/system/**', 'public/auth/**', 'test/coverage/**', 'node_modules/**'],
                    ext: 'js,html,css',
                    nodeArgs: [],
                    delayTime: 1,
                    env: {
                        PORT: require('./server/config/config').port
                    },
                    cwd: __dirname
                }
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: 'server/server.js',
                timeout: 1350
            },
            src: ['test/mocha/**/*.js']
        }
    });
    require('load-grunt-tasks')(grunt);
    grunt.registerTask('default', ['nodemon']);
    grunt.registerTask('test', 'run mocha tests and set env variables', ['mochaTest']);
};
