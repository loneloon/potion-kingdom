const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')

require('dotenv').config({ path: './.env' }); 

module.exports = {
    mode: 'development',
    entry: './src/index.tsx',
    devtool: 'inline-source-map',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: 'bundle.js'
    },
    devtool: 'inline-source-map',
    devServer: {
        static: './dist',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.less$/i,
                use: [
                    { loader: "style-loader" },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true,
                            modules: true
                        }
                    },
                    { loader: "less-loader" }
                ],
            },
            {
                test: /\.(jpg|png|svg|gif|wav|ogg|mp3)$/,
                type: 'asset/resource',
              },
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/assets/templates/index.html'
        }),
        new webpack.DefinePlugin({
            'process.env.SCREEN_HEIGHT_IN_CELLS': JSON.stringify(process.env.SCREEN_HEIGHT_IN_CELLS),
            'process.env.SCREEN_WIDTH_IN_CELLS': JSON.stringify(process.env.SCREEN_WIDTH_IN_CELLS),
            'process.env.STARTER_BALANCE': JSON.stringify(process.env.STARTER_BALANCE),
            'process.env.DEFAULT_SPIN_COST': JSON.stringify(process.env.DEFAULT_SPIN_COST),
            'process.env.DEFAULT_CURRENCY': JSON.stringify(process.env.DEFAULT_CURRENCY),
            'process.env.GAME_PROVIDER_API_URL': JSON.stringify(process.env.GAME_PROVIDER_API_URL)
          }),
    ]
}
