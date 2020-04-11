var path = require('path');
var webpack = require('webpack');
module.exports = {
    entry: './server.js',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist/'),
        filename: 'serverApp.js'
    }
};