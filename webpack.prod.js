const webpack = require('webpack');
const path = require('path');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */


/*
 * We've enabled ExtractTextPlugin for you. This allows your app to
 * use css modules that will be moved into a separate CSS file instead of inside
 * one of your module entries!
 *
 * https://github.com/webpack-contrib/extract-text-webpack-plugin
 *
 */

module.exports = {
    entry: './ui/src/app.module.js',
    output: {
        filename: '[name].[hash].js',
        sourceMapFilename: '[name].[hash].js.map',
        // chunkFilename: '[name].[hash].bundle.js',
        path: path.resolve(__dirname, 'elastichq/static'),
        publicPath: '/static/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ng-annotate-loader'
                },{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }]
            },
            {
                test: /\.html$/,
                use: ['ng-cache-loader?prefix=[dir]/[dir]']
            },
            {
                test:/\.(s*)css$/, 
                use: ExtractTextPlugin.extract({ 
                        fallback:'style-loader',
                        use:['css-loader','sass-loader'],
                    })
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: { name: 'images/[name].[ext]', limit: 1}
                }]
            },
            {
                test: /\.(woff|svg|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: { name: 'fonts/[name].[ext]' }
                }]
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        new CleanObsoleteChunks({
            verbose: true,
            deep: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'commons'
        }),
        new HtmlWebpackPlugin({
            template: "./ui/index.ejs",
            filename: "../templates/index.html",
            showErrors: true,
            title: "ElasticHQ",
            path: path.resolve(__dirname, "elastichq/templates"),
            hash: true,
            chunks: ['commons', 'main']
        }),
        new webpack.SourceMapDevToolPlugin({
            test: [/\.js$/],
            filename: "[name].[hash].js.map",
        }),
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: {
                output: {
                    comments: false,
                    beautify: false
                },
                compress: {
                    warnings: true,
                },
            }
        }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /de|en/),
        new ExtractTextPlugin({filename:'app.bundle.css'}),
        // new BundleAnalyzerPlugin(),   // Use for profiling builds if need be
    ]
};
