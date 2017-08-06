var Api = require('../../utils/api.js');
var app = getApp();
Page({
	data:{
	    imgUrls:[],//轮播
	    linktel:'',//联系我们
	    //全
	    quan_indicatorDots: false,
	    quan_autoplay: true,
	    quan_interval: 2000,
	    quan_duration: 600,
	    quan_circular:true,
	    //下部
	    indicatorDots: true,
	    autoplay: false,
	    interval: 5000,
	    duration: 500
  	},
  	
    onLoad:function(options){
		// 页面初始化 options为页面跳转所带来的参数
		var that = this;
		
	    app.getUserInfo(function(userInfo){
	    	var user = wx.getStorageSync('user');
	    	var url = Api.HOST + 'wechat.php?s=Home/index';
	    	
	    	var data = {};
	    	data.nickname = userInfo.nickName;
	    	data.headimgurl = userInfo.avatarUrl;
	    	data.openid = user.openid;
		    
	    	Api.fetchPost(url,data,(err, res) => {
          console.log(res);
		        that.setData({
		        	imgUrls		: res.carousel,
		        	categoryList: res.categoryList,
		        	linktel		: res.linktel
		        });
	    	});
	    })
	},
	
	linktel:function(){
		wx.makePhoneCall({
        	phoneNumber: this.data.linktel
        })
	},
  
})