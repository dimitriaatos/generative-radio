const path = require('path')

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	watch: true,
	devServer: {
		contentBase: path.join(__dirname, './../'),
		compress: true,
		port: 9000,
		open: true,
	},
	entry: path.resolve(__dirname, './index.js'),
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, './dist'),
	},
	module: { 
		rules: []
	},
	resolve: {
		extensions: ['.js']
	},
}
