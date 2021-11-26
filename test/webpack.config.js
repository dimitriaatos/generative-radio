const path = require('path')

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	// watch: true,
	entry: path.resolve(__dirname, './index.js'),
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, './dist'),
	},
	module: { 
		rules: [
			{
				test: /\.(tsx?|js)$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			}
		]
	},
	resolve: {
		extensions: ['.js', '.ts']
	},
}
