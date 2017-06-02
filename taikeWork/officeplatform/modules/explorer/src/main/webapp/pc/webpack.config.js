var path = require('path');
var glob = require('glob');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');

//webpack --config 文件名.js -w        /*执行另一个配置文件*/
var config = {
	entry: {
		index: './js/main.js',
		login: './js/login.js'
	},
	output: {
		path: './build/',
		filename: 'js/[name].[chunkhash].js',
		chunkFilename: '[id].[chunkhash].js'
	},
	module: {
		loaders: [
			// { test: /\.css$/, loader: 'style-loader!css-loader' },
			{test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
			{test: /\.less$/, exclude: /node_modules/, loader: 'style-loader!css-loader!less-loader'},
			{test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react'},
			{test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
			{// 如果要加载jQuery插件,解析路径&参数
				test: "./js/utils/jquery/*.js$",
				loader: "'imports?jQuery=jquery,$=jquery,this=>window"
			}
		]
	},
	plugins: [
		new CleanPlugin(['./build/*']),
		new CopyWebpackPlugin([
			{from: './images', to: 'images'},
			{from: './less', to: 'less'},
			{from: './editor', to: 'editor'}
		]),
		// 公共CSS名字和路径
		new ExtractTextPlugin("css/[name].[chunkhash].css"),
		// 把公共文件提取出来
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function (module, count) {
				// any required modules inside node_modules are extracted to vendor
				return (
					module.resource &&
					/\.js$/.test(module.resource) &&
					module.resource.indexOf(
						path.join(__dirname, './node_modules')
					) === 0
				)
			}
		}),
		// new webpack.optimize.UglifyJsPlugin({
		// 	compress: {
		// 		warnings: false
		// 	}
		// }),
		new webpack.ProvidePlugin({// 全局依赖jQuery,不需要import了
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery"
		})
	]
};

module.exports = config;

var pages = Object.keys(getEntry('./*.html'));
//生成HTML模板
pages.forEach(function (pathname) {
	var conf = {
		filename: pathname + '.html', //生成的html存放路径,相对于path
		template: './' + pathname + '.html', //html模板路径
		inject: true, //允许插件修改哪些内容,包括head与body
		hash: false, //是否添加hash值
		minify: { //压缩HTML文件
			removeComments: true,//移除HTML中的注释
			collapseWhitespace: true //删除空白符与换行符
		},
		chunksSortMode: 'dependency',
		chunks: [pathname,"vendor"]
	};

	config.plugins.push(new HtmlWebpackPlugin(conf));
});

//按文件名来获取入口文件(即需要生成的模板文件数量)
function getEntry(globPath) {
	var files = glob.sync(globPath);
	var entries = {},
		entry, dirname, basename, pathname, extname;
	for (var i = 0; i < files.length; i++) {
		entry = files[i];
		dirname = path.dirname(entry);
		extname = path.extname(entry);
		basename = path.basename(entry, extname);
		pathname = path.join(dirname, basename);
		entries[pathname] = entry;
	}
	return entries;
}
