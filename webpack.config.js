const path = require('path');

module.exports = {
    entry: './out/app.js',
    output: {
        path: path.resolve(__dirname, 'out/dist'),
        filename: 'app_bundle.js'
    },
    mode: 'development'
}