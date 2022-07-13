const path = require('path');
const nodeExternals = require('webpack-node-externals');
const { NODE_ENV = 'production', } = process.env;

module.exports = {
    entry: './src/index.ts',
    mode: NODE_ENV,
    target: 'node',
    watch: true, /* wenn false, dann kehrt webpack zurueck. Ansonsten wartet es */
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js'
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: ['node_modules']
    }
}