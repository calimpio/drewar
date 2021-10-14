var path = require('path');

require('dotenv').config({ path: path.join(__dirname, '/src/.env') })
const views = "/view"
module.exports = {
    entry: [      
        'babel-polyfill',
        path.join(__dirname, views+'/index.tsx')
    ],   
    
    mode: process.env.PROFILE,
    output: {
        path: path.join(__dirname, '/src/public/dist/'),
        publicPath: 'http://localhost:8081/public/dist/',
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],         
    },
    module: {
        rules: [            
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
        ]
    },
    
}