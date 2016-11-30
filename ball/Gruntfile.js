module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Minifies JS Files
        uglify: {
            options: {
                banner: '/* Ball is Life: A Basketball Video Site by Al Gilardi */'
            },
            dist: {
                files: {
                    'dist/app.js':'src/app.js',
                    'dist/routes/index.js':'src/routes/index.js',
                    'dist/routes/users.js':'src/routes/users.js',
                    'dist/bin/www':'src/bin/www',
                    'dist/models/clip.js':'src/models/clip.js',
                    'dist/models/comment.js':'src/models/comment.js',
                    'dist/models/user.js':'src/models/user.js',
                    'dist/public/javascripts/team.js':'src/public/javascripts/team.js',
                    'dist/config/passport.js':'src/config/passport.js',
                    'dist/config/db.js':'src/config/db.js'
                }
            },
        },

        // Minifies HBS Files
        htmlmin: {
        dist: {
            options: {
                collapseWhitespace: true
            },
            files: {
                'dist/views/404.hbs':'src/views/404.hbs',
                'dist/views/clipnotfound.hbs':'src/views/clipnotfound.hbs',
                'dist/views/clippage.hbs':'src/views/clippage.hbs',
                'dist/views/error.hbs':'src/views/error.hbs',
                'dist/views/index.hbs':'src/views/index.hbs',
                'dist/views/layout.hbs':'src/views/layout.hbs',
                'dist/views/login.hbs':'src/views/login.hbs',
                'dist/views/signup.hbs':'src/views/signup.hbs',
                'dist/views/stats.hbs':'src/views/stats.hbs',
                'dist/views/submit.hbs':'src/views/submit.hbs',
                'dist/views/usernotfound.hbs':'src/views/usernotfound.hbs',
                'dist/views/userpage.hbs':'src/views/userpage.hbs'
                }
            }
        },

        // Compiles SASS
        sass: {
            dist: {
                files: {
                    'src/public/stylesheets/style.css':'src/public/stylesheets/style.scss',
                    'dist/public/stylesheets/style.css':'src/public/stylesheets/style.scss'
                }
            }
        },

        // Minifies Pics
        imagemin: {
            dist: {
                files: {
                    'dist/public/images/blake.gif':'src/public/images/blake.gif',
                    'dist/public/images/docface.gif':'src/public/images/docface.gif',
                    'dist/public/images/docface2.gif':'src/public/images/docface2.gif',
                    'dist/public/images/jrsmith.gif':'src/public/images/jrsmith.gif',
                    'dist/public/images/lance.gif':'src/public/images/lance.gif',
                    'dist/public/images/lebron.gif':'src/public/images/lebron.gif',
                    'dist/public/images/lebron2.gif':'src/public/images/lebron2.gif',
                    'dist/public/images/riley.gif':'src/public/images/riley.gif',
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask('default', ['uglify', 'htmlmin', 'sass', 'imagemin']);
    grunt.registerTask('s', ['sass']);
};
