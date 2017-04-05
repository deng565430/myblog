const express = require('express');
let router = express.Router();
let User = require('../models/User')

router.use((req, res, next) => {
	if(!req.userInfo.isAdmin) {
		res.send('对不起，只有管理员才可以进入后台管理');
		return;
	}
	next()
})
/*首页*/
router.get('/', (req, res, next) => {
	res.render('admin/index', {
		userInfo: req.userInfo
	});
});

/*用户管理*/
router.get('/user', (req, res, next) => {
/*从数据库中读取所有的用户数据*/
	User.find().then((users) => {
		res.render('admin/user_index', {
			userInfo: req.userInfo,
			users: users
		})
	});


})

module.exports = router;
