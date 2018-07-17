const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry: {
        'react-map-editor': './src/index.tsx',
        'example': './src/example.tsx'
    } ,
    output: {
        path: path.resolve(__dirname, 'umd'),
        filename: '[name].js',
        library: 'ReactMapEditor',
        libraryTarget: 'umd'
    },
    module: {
        rules: [{
            test: /\.(j|t)sx?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }]
    },
    plugins: [
        new HtmlWebpackPlugin()
      ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
    },
    devtool: 'source-map',
    devServer: {
        contentBase: path.resolve(__dirname, 'public'),
    }
}