const webpack = require('webpack');
const OpenBrowserPlugin = require('open-browser-webpack-plugin')

const config = {
    entry: {
        app:__dirname + '/src/main.js'
    },
    output: {
        path: __dirname + '/dist',
        filename: '[name].js'
    },

    devServer: {
        contentBase: './',          //本地服务器所加载的页面所在的目录
        inline: true,               //设置为true，当源文件改变时会自动刷新页面
        port: 8081,                 //设置默认监听端口，如果省略，默认为8080
        historyApiFallback: true,   //在开发单页应用时非常有用，它依赖于HTML5 history API，如果设置为true，所有的跳转将指向index.html
        colors: true,               //设置为true，使终端输出的文件为彩色的
        hot: false,                 //是否热部署
        quiet: false                //让dev server处于静默的状态启动
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
        new OpenBrowserPlugin({ url: 'http://localhost:8081' }),
        new webpack.NoErrorsPlugin(),                       //允许错误不打断程序
    ]
};

module.exports = config;
