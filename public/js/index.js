$(function(){
	$('#btn').on('click',function() {
		//ajax提交请求
		$.ajax({
			url:'/api/user/register',
			type:'post',
			data:{
				username: $('#username').val(),
				password: $('#password').val(),
				repassword: $('#repassword').val(),
				isAdmin: {
					type:true,
					default: false
				}
			},
			dataType: 'json',
			success: function(result) {
				$('#userInfo').html(result.message);

			}
		})
	})



	//登陆
	$('#btn1').on('click', function() {
		$.ajax({
			url:'/api/user/login',
			type:'post',
			data:{
				username: $('#username1').val(),
				password: $('#password1').val()
			},
			dataType: 'json',
			success: function(result) {
				window.location.reload();
			}
		})	
		
	})
//退出
	$('#logout').on('click', function() {
		$.ajax({
			url:'/api/user/logout',
			type:'get',
			success: function(result) {
				if(!result.code) {
					window.location.reload();
				}
			}
		})
	})
})