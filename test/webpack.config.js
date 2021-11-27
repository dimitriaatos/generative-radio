const path = require('path')

module.exports = {
	mode: 'development',
	devtool: 'source-map',
	entry: path.resolve(__dirname, './index.ts'),
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, './dist'),
	},
	module: {
		rules: [
			{
				test: /\.(ts|js)$/,
				use: [{
					loader: 'ts-loader',
					options: {
						configFile: path.resolve(__dirname, './tsconfig.json')
					}
				}],
				exclude: /node_modules/,
			}
		]
	},
	resolve: {
		extensions: ['.js', '.ts']
	},
}
