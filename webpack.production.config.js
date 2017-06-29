const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
var TransferWebpackPlugin = require('transfer-webpack-plugin');
var path = require('path')


const config = {

    entry: {
        app: __dirname + '/src/main.js',
    },

    output: {
        path: __dirname + '/dist',
        filename: '[name].min.js',
        // publicPath:'./'                // 打包好的js如果放置在cdn,将本项设置为cdn路径即可，打包出的html自动生成 cdn路径+[name].min.js的script标签     
    },

    module: {
        loaders: [
            {
                test: /\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel'
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env':{
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            },                         //生产环境
        }),
        new CleanWebpackPlugin(['dist'], {
            "root": __dirname,
            verbose: true,
            dry: false
        }),
        new webpack.optimize.UglifyJsPlugin({               //压缩JS代码
            compress: {
                warnings: false                             //不显示warning
            }
        }),
        new HtmlWebpackPlugin({                         //生成模板文件
            template: __dirname + "/index.tpl.html",
            filename: 'index.html',
        }),
        new TransferWebpackPlugin([
          {from:'assets/img',to:'assets/img'},
          {from:'js',to:'js'}
        ]),

    ]
};

module.exports = config;