const webpack = require('webpack');
const path = require('path');

const CleanObsoleteChunks = require('webpack-clean-obsolete-chunks');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

/*
 * We've enabled UglifyJSPlugin for you! This minifies your app
 * in order to load faster and run less javascript.
 *
 * https://github.com/webpack-contrib/uglifyjs-webpack-plugin
 *
 */

const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

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
        path: path.resolve(__dirname, 'ui/dist')
    },
    devServer: {
        contentBase: './ui',
        stats: 'minimal',
        proxy: {
            '/api/*': {
                target: 'http://localhost:5000',
                secure: false
            }
        },
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Credentials': 'true'
        }
    },
    devtool: 'cheap-module-eval-source-map',
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
            // {
            //     test: /\.scss$/,
            //     use: [
            //         {
            //             loader: 'style-loader'
            //         },
            //         {
            //             loader: 'css-loader', options: {
            //                 sourceMap: true
            //             }
            //         },
            //         {
            //             loader: 'sass-loader', options: {
            //                 sourceMap: true
            //             }
            //         }
            //     ]
            // },
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader',
            //         'css-loader'
            //     ]
            // },
            {
                test: /\.(png|jpg|gif)$/,
                use: [{
                    loader: 'url-loader',
                    options: { name: 'images/[name].[ext]' }
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
        // new CleanObsoleteChunks({
        //     verbose: true,
        //     deep: true
        // }),
        new HtmlWebpackPlugin({
            template: "./ui/index.ejs",
            filename: "index.html",
            showErrors: true,
            title: "Webpack App",
            path: path.join(__dirname, "ui/dist"),
            hash: true
        }),
        // new UglifyJSPlugin({sourceMap: true}),
        new ExtractTextPlugin({filename:'app.bundle.css'}),
    ]
};
