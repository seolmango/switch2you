const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebpackObfuscator = require('webpack-obfuscator');
const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    plugins: [
        new WebpackObfuscator ({
            rotateUnicodeArray: true,
            debugProtection: true,
            disableConsoleOutput: true,
            numbersToExpressions: true,
            selfDefending: true,
        }, [path.resolve(__dirname, 'src', 'index.js')]),
        new HtmlWebpackPlugin({
            title: "swITch",
            minify: {
                collapseWhitespace: true
            },
            hash: true,
            template: './src/index.html'
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: 'static'}
            ]
        })
    ]
}