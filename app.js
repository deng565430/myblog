//应用程序的启动（入口）文件
//加载express模块
const express = require('express');
//加载模板处理模块
const swig = require('swig');
//加载数据库模块
var mongoose = require('mongoose');
//加载body-parser 用来处理post 提交过来的数据
const bodyParser = require('body-parser');
//加载cookis模块
var Cookies = require('cookies');
//创建app应用
let app = express();

var User = require('./models/User');

//设置静态文件托管
//当用户访问的url以/public开始。 那么返回对应__dirname + '/public'下的静态文件
app.use('/public', express.static(__dirname + '/public'));

//配置应用模板
//定义当前应用使用的模板引擎
//第一个参数： 模板引擎的名称，同事也说模板文件的后缀， 第二个参数表示解析模板内容的方法
app.engine('html', swig.renderFile);
//设置模板文件存放的目录 ，第一个参数必须是views  第二个参数是目录
app.set('views', './views');
//注册所使用的模板引擎，第一个参数必须是view engine , 第二个参数和app.engine方法中定义的模板引擎的名称第一个参数是一致的
app.set('view engine', 'html');
//开发过程中，需要取消模板缓存
swig.setDefaults({cache: false});

//bodyparser设置
app.use( bodyParser.urlencoded({extended: true}));

//设置cookie
app.use(function(req, res, next) {
	req.cookies = new Cookies(req, res);
	
	//解析登陆用户的cookie信息
	req.userInfo = {};
	if(req.cookies.get('userInfo')) {
		try {
			req.userInfo = JSON.parse(req.cookies.get('userInfo'));
			//获取当前登陆用户的类型 是否是管理员
			User.findById(req.userInfo._id).then((userInfo) => {
				req.userInfo.isAdmin = Boolean(userInfo.isAdmin);
				next();
			})
		}catch(e){
			next();
		}
	} else{
		next();
	}
	//console.log(typeof req.cookies.get('userInfo'))
	
})

//根据需要划分不同的模块
app.use('/admin', require('./routers/admin'));
app.use('/api', require('./routers/api'));
app.use('/', require('./routers/main'));

//监听http请求
mongoose.connect('mongodb://localhost:27017/blog', (err) => {
	if(err) {
		console.log('数据库连接失败');
	} else {
		console.log('数据库连接成功');
		app.listen(8081);
	}
})

