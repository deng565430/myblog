const express = require('express');
var router = express.Router();
var User = require('../models/User');

//统一返回格式
let responseDate;

router.use((req, res, next) => {
	responseDate = {
		code: 0,
		message: null
	};
	next();
})

//用户注册
//注册逻辑 
//1、用户名不能为空 2、密码不能为空 3、两次密码输入必须一致
// 需要操作 。1、用户名是否已经被注册  (数据库查询)
router.post('/user/register', (req, res, next) => {
	//console.log(req.body);
	var username = req.body.username;
	var password = req.body.password;
	var repassword = req.body.repassword;

	//用户名是否为空
	if(username == '' ) {
		responseDate.code = 1;
		responseDate.message = '用户名不能为空';
		res.json(responseDate);
		return;
	}
	//密码不能为空
	if(password == '' ) {
		responseDate.code = 1;
		responseDate.message = '密码不能为空';
		res.json(responseDate);
		return;
	}
	//两次输入的密码不一致
	if(password != repassword) {
		responseDate.code = 3;
		responseDate.message = '两次密码输入不一致';
		res.json(responseDate);
		return;
	}

	//用户名是否已经被注册了， 如果数据库中已经存在和我们注册的用户名同名的数据，表示该用户名被注册
	User.findOne({
		username: username
	}).then(function(userInfo) {
		console.log(userInfo)
		if(userInfo) {
			//表示数据库中有该记录
			responseDate.code = 4;
			responseDate.message = '用户名已经被注册了';
			res.json(responseDate);
			return;
		}
		//保存用户注册信息到数据库中
		let user = new User({
			username: username,
			password: password,
		});
		return user.save();
	}).then((newUserInfo) => {
		responseDate.message = '注册成功';
		res.json(responseDate);
	});

	
})

//登陆
router.post('/user/login', (req, res, next) => {
	var username = req.body.username;
	var password = req.body.password;

	if(username == '' || password == '') {
		responseDate.code = 1;
		responseDate.message = '用户名或密码不能为空';
		res.json(responseDate);
		return;
	}
	//查询数据库中相同用户名和密码的记录是否存在 如果存在则登陆成功
	User.findOne({
		username: username,
		password: password,
	}).then((userInfo) => {
		if(!userInfo) {
			responseDate.code = 2;
			responseDate.message = '用户名或密码错误';
			res.json(responseDate);
			return;
		}
		//用户名和密码是正确的
		responseDate.message = '登陆成功';
		responseDate.userInfo = {
			_id: userInfo._id,
			username: userInfo.username
		}
		//存储cookies信息
		req.cookies.set('userInfo', JSON.stringify({
			_id: userInfo._id,
			username: userInfo.username
		}));
		res.json(responseDate);
		return;
		
	})
	

})

//退出
router.get('/user/logout', (req, res) => {
	req.cookies.set('userInfo', null);
	res.json(responseDate);
})

module.exports = router;
