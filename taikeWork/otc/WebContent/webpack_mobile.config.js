var webpack = require('webpack');

//将你的样式提取到单独的css文件里，如果没有它的话，webpack会将css打包到js当中
//var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    addclient:'./js/mobile_modules/addclient.js',
    addcustomer:['./js/mobile_modules/addcustomer.js'],
    avatar:'./js/mobile_modules/avatar.js',
    BusinessCustomers:'./js/mobile_modules/BusinessCustomers.js',
    client:'./js/mobile_modules/client.js',
    corditem:'./js/mobile_modules/corditem.js',
    CustomerDetails:'./js/mobile_modules/CustomerDetails.js',
    getcode:'./js/mobile_modules/getcode.js',                //用户登录页面
    historyrecord:'./js/mobile_modules/historyrecord.js',
    index:['./js/mobile_modules/index.js'],
    infomationedit:'./js/mobile_modules/infomationedit.js',
    informationfile:'./js/mobile_modules/informationfile.js',
    Kpiinquire:'./js/mobile_modules/Kpiinquire.js',
    login:'./js/mobile_modules/login.js',
    mark:'./js/mobile_modules/mark.js',
    myinformation:'./js/mobile_modules/myinformation.js',
    Photoshare:'./js/mobile_modules/Photoshare.js',
    Planreview:'./js/mobile_modules/Planreview.js',
    product:'./js/mobile_modules/product.js',
    productarticle:'./js/mobile_modules/productarticle.js',
    productDetail:'./js/mobile_modules/productDetail.js',
    purchase:'./js/mobile_modules/purchase.js',
    remark:'./js/mobile_modules/remark.js',
    sale:'./js/mobile_modules/sale.js',
    search:'./js/mobile_modules/search.js',
    signin:['./js/mobile_modules/signin.js'],
    stock:'./js/mobile_modules/stock.js',
    Storelocation:'./js/mobile_modules/Storelocation.js',
    testlogin:'./js/mobile_modules/testlogin.js',
    testproducts:'./js/mobile_modules/testproducts.js',
    Videoshare:'./js/mobile_modules/Videoshare.js',
    signin1:['./js/mobile_modules/signin1.js'],
    vipclienList:['./js/mobile_modules/vipclienList.js'],
    vipclientInfo:['./js/mobile_modules/vipclientInfo'],
    addvipclien:['./js/mobile_modules/addvipclien.js'],
  },
  output: {
    filename: './js/mobile/[name].js',
    publicPath: '/'
  },
  externals:{
  	'react':'React',
		"react-dom": "ReactDOM"
	},
  module: {
    loaders: [
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.less$/, exclude: /node_modules/,loader: 'style-loader!css-loader!less-loader' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader?presets[]=es2015&presets[]=react'},
			{// 如果要加载jQuery插件,解析路径&参数
				test : "./js/utils/jquery/*.js$",
				loader : "'imports?jQuery=jquery,$=jquery,this=>window"
			}
    ]
  },
  plugins : [ new webpack.ProvidePlugin({// 全局依赖jQuery,不需要import了
    React: "React",
	  ReactDOM:"React-DOM",
		$ : "jquery",
		jQuery : "jquery",
		"window.jQuery" : "jquery"
	}) ]
  ["antd", {
      style: 'css',  // 'less',
      libraryName: 'antd-mobile',
    }]
}
