const webpack = require('webpack');
const path = require('path');

module.exports = {
    entry: "./assets/src/main.ts",
    output: {
        path: path.resolve(__dirname, "assets/js/dist"),
        filename: "bundle.js"
    },
    resolve: {
        // Add '.ts' and '.tsx' as a resolvable extension.
        extensions: [".webpack.js", ".web.js", ".ts"],
        alias: {
            'rxjs': 'rxjs-es'
        }
    },
    module: {
        loaders: [
            // all files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'
            { 
                test: /\.tsx?$/, 
                loader: "ts-loader"
            }
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(
            /angular(\\|\/)core(\\|\/)@angular/,
            path.resolve(__dirname, 'assets/src/')
        )
    ]
}