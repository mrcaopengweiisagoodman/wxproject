var Api = require('../../utils/api.js');
var app = getApp();
Page({
	data:{
		img:'',
		second:60,
		selected:true,
		selected1:false,
		mobilephone:'',
		code:'',
		checkmobilephone:'',
		checkcode:'',
	},

	onLoad:function(options){
		this.setData({
	  		id		: options.id
	  	});
		
		var that = this;	
		var url = Api.HOST + 'wechat.php?s=Home/login';
		var data = {};
    	
		Api.fetchPost(url,data,(err, res) => {
		    that.setData({
		        img		: res.img,
		    });   
    	});
	},
	
	//手机号
	bindChange1:function(e){
		this.data.mobilephone = e.detail.value;
	},
	
	//验证码
	bindChange2:function(e){
		this.data.code = e.detail.value;
	},
	
	//获取验证码
	getcode:function(e){
		var that=this;
		
		var url = Api.HOST + 'wechat.php?s=Home/createsms';
		
		var data = {};
    	data.mobilephone = this.data.mobilephone;
    	
    	Api.fetchPost(url,data,(err, res) => {
    		if(res.ret == 1){
				that.setData({
					selected		: false,
					selected1		: true,
					checkmobilephone: res.checkinfo.mobilephone,
					checkcode		: res.checkinfo.checkcode,
				});
				countdown(that);   
	    	}else{
	    		wx.showModal({
					content: res.msg,
					showCancel:false,
					success: function(res) {
						if(res.confirm){
							console.log('用户点击确定')
						}else if(res.cancel) {
							console.log('用户点击取消')
						}
					}
				})   		
	    	}
    	});
	},
	
	bind:function(){
		var that = this;
		
		if(this.data.checkmobilephone != this.data.mobilephone){
			wx.showModal({
				content: '请输入正确的手机号码!',
				showCancel:false,
				success: function(res) {
					if (res.confirm) {
						console.log('用户点击确定')
					} else if (res.cancel) {
						console.log('用户点击取消')
					}
				} 
			});
			return false;
		}
		
		if(this.data.checkcode != this.data.code){
			wx.showModal({			
				content: '请输入正确的验证码',
				showCancel:false,
				success: function(res) {
					if (res.confirm) {
					console.log('用户点击确定')
					} else if (res.cancel) {
					console.log('用户点击取消')
					}
				}
			});
			return false;
		}
		
		var url = Api.HOST + 'wechat.php?s=Home/bind';
		
		var data = {};
		var user = wx.getStorageSync('user');
    	data.mobilephone = this.data.mobilephone;
    	data.openid = user.openid;
    	
    	if(!data.mobilephone){
			wx.showModal({			
				content: '请输入手机号',
				showCancel:false,
				success: function(res) {
					if (res.confirm) {
					console.log('用户点击确定')
					} else if (res.cancel) {
					console.log('用户点击取消')
					}
				}
			});
			return false;
		}
    	Api.fetchPost(url,data,(err, res) => {
    		if(res.ret == 1){
				wx.redirectTo({
					url: '/pages/detail/detail?id='+this.data.id,
	    		}) 
	    		
	    	}else{
	    		wx.showModal({
					content: res.msg,
					showCancel:false,
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定')
						}else if(res.cancel) {
							console.log('用户点击取消')
						}
					}
				});
	    		
	    		wx.redirectTo({
					url: '/pages/detail/detail?id='+this.data.id,
	    		}) 
	    	}
    	});
	},
})


//验证码倒数
function countdown(thatt) {
    var second = thatt.data.second;
    if (second == 0) {
        // console.log("Time Out...");
        thatt.setData({
            selected:true,
            selected1:false,
            second:60,
        });
		return;
        
    }
    var time = setTimeout(function () {
            thatt.setData({
                second: second - 1
            });
            countdown(thatt);
        }
        , 1000)
}


