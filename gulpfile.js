
var gulp = require('gulp');

/**
 * gulp build webpack and babel
 */

var gutil = require('gulp-util'); 
var webpack = require('webpack');
var WebpackDevServer = require("webpack-dev-server");
var less = require('gulp-less');
var path = require('path');

var vue = require('vue-loader')
var ExtractTextPlugin = require("extract-text-webpack-plugin");

gulp.task('js:webpack',function(callback){
    webpack({
        watch: true,
        entry:[
            'whatwg-fetch',
            './src/main.js'
        ],
        output:{
            path:'./public/',
            //是用来告诉 Webpack 的插件在生产环境下如何更新 CSS HTML 中的文件 URL的
            publicPath:'./',
            filename:'bundle.js'
        },
        resolve: {
            alias: { src: path.join(__dirname, 'src') },
            extensions: ['', '.js', '.jsx']
        },
        devtool: 'source-map',
        module:{
            loaders:[
                {
                    test: /\.js$/,
                    exclude:'./node_modules/',
                    loader: 'babel'
                },
                { 
                    test: /\.vue$/,
                    exclude: './node_modules/',
                    loader: 'vue'
                },
                { 
                    test: /\.css$/, 
                    loader: "style-loader!css-loader"
                },
                {
                    test: /\.(png|jpg)$/,
                    loader: 'url',
                    query: {
                      limit: 10000,
                      name: '[name].[ext]?[hash:10]'
                    }
                },
                {
                    test   : /\.woff|\.woff2|\.svg|.eot|\.ttf/,
                    loader : 'url?prefix=font/&limit=10000'
                }
            ]
        },
        externals: {
            'vue': 'Vue',
            'vue-router':'VueRouter'
        },
        vue: {
            loaders: {
              css: ExtractTextPlugin.extract("css"),
              // you can also include <style lang="less"> or other langauges
              less: ExtractTextPlugin.extract("css!less")
            }
        },
        plugins: [
            new ExtractTextPlugin('css/index.css'), // 输出到 output path 下的 app.css 文件
            //new webpack.optimize.UglifyJsPlugin({
              //compress: {
              //  warnings: false,
             // },
            //}),
            //new webpack.optimize.OccurenceOrderPlugin(),
            //new webpack.HotModuleReplacementPlugin(), //热加载
        ]
    }, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString({
            // output options
            chunks: false,
            children: false,
            hash: true
        }));
        callback();
    });
});

/**
 * 将src/assets中的静态文件拷贝到public目录下
 */
gulp.task('copy', function() {
    return gulp.src(['./src/assets/**'], {
        base: './src/assets'
    }).pipe(gulp.dest('./public'));
});

gulp.task('less', function () {
  return gulp.src('./src/less/common.less')
    .pipe(less())
    .pipe(gulp.dest('./public/css'));
});

/**
 * 监听代码
 */
gulp.task('watch', function() {
    //gulp.watch(['src/**'], ['js:webpack']);
    gulp.watch(['src/less/*.less'], ['less']);
});

gulp.task('default',['js:webpack', 'watch', 'copy', 'less']);