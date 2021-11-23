const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
// const interactjsDevTools = require('interactjs/dev-tools');

const isDev = process.env.NODE_ENV === 'development' ? true : false;
const isProd = !isDev;

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all',
        },
    };

    if (isProd) {
        config.minimizer = [new OptimizeCssAssetsWebpackPlugin(), new TerserWebpackPlugin()];
    }
};

babelOptimization = () => {
    let pluginArray = ['@babel/plugin-transform-runtime'];
    if (isProd) {
        pluginArray.push('@interactjs/dev-tools/babel-plugin-prod');
    }
    return pluginArray;
};

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        background: '@/back/start.js',
        content: '@/front/content.js',
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: ['.js', '.json', '.png', '.css'],
        alias: {
            '@front': path.resolve(__dirname, 'src/front'),
            '@': path.resolve(__dirname, 'src'),
        },
    },
    optimization: optimization(),
    devtool: isDev ? 'source-map' : false,
    plugins: [
        new HTMLWebpackPlugin({
            inject: 'body',
            chunks: '',
            filename: 'interface.html',
            template: './front/html/interface.html',
            minify: isProd,
        }),
        new ChromeExtensionReloader({
            port: 9090,
            reloadPage: true,
            manifest: path.resolve(__dirname, 'dist/manifest.json'),
            entries: {
                contentScript: 'content',
                background: 'background',
            },
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'src/icons'),
                    to: path.resolve(__dirname, 'dist/icons'),
                },
                {
                    from: path.resolve(__dirname, 'src/_locales'),
                    to: path.resolve(__dirname, 'dist/_locales'),
                },
                {
                    from: path.resolve(__dirname, 'src/manifest.json'),
                    to: path.resolve(__dirname, 'dist/manifest.json'),
                },
            ],
        }),
        // new MiniCssExtractPlugin({
        //     filename: '[name].css',
        // }),
    ],
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    {
                        loader: 'style-loader',
                        options: {
                            insert: 'body',
                        },
                    },
                    'css-loader',
                ],
            },
            {
                test: /\.(eot|png|svg|[ot]tf|woff2?)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'url-loader',
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        sourceType: 'unambiguous',
                        presets: ['@babel/preset-env'],
                        plugins: babelOptimization(),
                    },
                },
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
        ],
    },
};
