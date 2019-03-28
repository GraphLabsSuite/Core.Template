const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'development',
    entry: "./src/index.ts",
    output: {
        filename: "bundle.js",
        library: 'graphlabs.core.template',
        libraryTarget: 'umd',
        path: __dirname + "/dist"
    },
    devtool: "source-map",

    resolve: {
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: '/node_modules',
                loader: "source-map-loader"
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test:/\.(svg|eot|woff2|woff|ttf)$/,
                loader: 'file-loader',
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "[name].css",
        })
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.(css|scss)$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
};