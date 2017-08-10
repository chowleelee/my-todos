/**
 * Created by 15622 on 2017/8/8.
 */

var gulp = require('gulp');
var $ = require("gulp-load-plugins")();
var open = require("open");

//lib
gulp.task("lib", function(){
    gulp.src("bower_components/**/dist/*.js")
        .pipe(gulp.dest("build/lib/"))
        .pipe(gulp.dest("dev/lib/"));
});


//copy html
gulp.task("html", function(){
    gulp.src("src/**.html")
        .pipe(gulp.dest("build/"))
        .pipe($.minifyHtml())
        .pipe(gulp.dest("dev"))
        .pipe($.connect.reload());
});

//copy music
gulp.task("music", function(){
    gulp.src("src/music/*")
        .pipe(gulp.dest("build/music"))
        .pipe(gulp.dest("dev/music"))
        .pipe($.connect.reload());
});

//copy js
gulp.task("js", function(){
   gulp.src("src/js/*.js")
       .pipe($.concat("index.js"))
       .pipe(gulp.dest("build/js"))
       .pipe($.uglify())
       .pipe(gulp.dest("dev/js"))
       .pipe($.connect.reload());
});

//copy css
gulp.task("css", function(){
   gulp.src("src/css/*.css")
       .pipe(gulp.dest("build/css"))
       .pipe($.cssmin())
       .pipe(gulp.dest("dev/css"))
       .pipe($.connect.reload());
});

//copy images
gulp.task("img", function(){
   gulp.src("src/img/*")
       .pipe(gulp.dest("build/img"))
       .pipe($.imagemin())
       .pipe(gulp.dest("dev/img"))
       .pipe($.connect.reload());
});

//delete files
gulp.task("clean", function(){
    gulp.src(["dev/", "build/"])
        .pipe($.clean());
});

//all mission
gulp.task("build", ["html", "js", "css", "img", "lib", "music"]);

//auto refresh, auto open
gulp.task("server", function(){
    $.connect.server({
        root:"build/",
        port: 8000,
        livereload: true
    });

    open("http://localhost:8000");

    gulp.watch("src/*.html", ["html"]);
    gulp.watch("src/js/*.js", ["js"]);
    gulp.watch("src/css/*.css", ["css"]);
    gulp.watch("src/img/*", ["img"]);
});

//default mission
gulp.task("default", ["server"]);