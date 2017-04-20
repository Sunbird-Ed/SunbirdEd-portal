module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        nodeunit: {
            all: ['tests/**/Test*.js', 'models/tests/**/*.js'],
            options: {
                reporter: 'junit',
                reporterOptions: {
                    output: 'outputdir'
                }
            }
        },
        compress: {
            main: {
                options: {
                    mode: 'gzip'
                },
                files: [
                    // Each of the files in the src/ folder will be output to
                    // the dist/ folder each with the extension .gz.js
                    {
                        expand: true,
                        src: ['public/js/**/*.js'],
                        dest: '',
                        ext: '.js.gz',
                        extDot: 'last'
                    }, {
                        expand: true,
                        src: ['public/quiz/**/*.js'],
                        dest: '',
                        ext: '.js.gz',
                        extDot: 'last'
                    }, {
                        expand: true,
                        src: ['public/css/**/*.css'],
                        dest: '',
                        ext: '.css.gz',
                        extDot: 'last'
                    }, {
                        expand: true,
                        src: ['public/quiz/style/**/*.css'],
                        dest: '',
                        ext: '.css.gz',
                        extDot: 'last'
                    },
                ]
            }
        },
        rm: {
            options: {
                "dir": "",
                "patterns": ["public/js/**/*.js", "public/quiz/**/*.js", "public/css/**/*.css"]
            }
        },
        copy: {
            dev: {
                files: [{src: ['conf/appConfig_dev.json'], dest: 'conf/appConfig.json'}]
            },
            qa: {
                files: [{src: ['conf/appConfig_qa.json'], dest: 'conf/appConfig.json'}]
            },
            prod: {
                files: [{src: ['conf/appConfig_prod.json'], dest: 'conf/appConfig.json'}]
            },
            uat: {
                files: [{src: ['conf/appConfig_uat.json'], dest: 'conf/appConfig.json'}]
            },
            demo: {
                files: [{src: ['conf/appConfig_demo.json'], dest: 'conf/appConfig.json'},
                        {src: ['views/web/homepage_MaGE.ejs'], dest: 'views/web/homepage.ejs'},
                        {src: ['views/includes/footer_MaGE.ejs'], dest: 'views/includes/footer.ejs'},
                        {src: ['views/includes/publicFooter_MaGE.ejs'], dest: 'views/includes/publicFooter.ejs'},
                        {src: ['public/img/partner_logo_blank.jpg'], dest: 'public/img/partner_logo.jpg'}]
            }
        },
        'string-replace': {
            inline: {
                files: {
                  './app.js': './app.js'
                },
                options: {
                    replacements: [{
                        pattern: '// app.use(staticGzip(/(\\.js|\\.css)$/));',
                        replacement: 'app.use(staticGzip(/(\\.js|\\.css)$/));'
                    }]
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-nodeunit');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-remove-patterns');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-string-replace');

    grunt.registerTask('test', ['compress', 'rm']);

    //grunt.registerTask('default', ['compress','rm']);
    // SV - Older css/js files can still remain. not required to be deleted.
    grunt.registerTask('default', ['compress']);
};
