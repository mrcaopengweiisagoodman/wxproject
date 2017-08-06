var Api = require('../../utils/api.js');
var app = getApp();
Page({
	data:{
	    tourist:'',
  	},
  	
  	onLoad:function(options){
		// 页面初始化 options为页面跳转所带来的参数
		var that = this;
		
	   
    	var user = wx.getStorageSync('user');
    	
    	var url = Api.HOST + 'wechat.php?s=Home/help';
    	
    	var data = {};
	    
    	Api.fetchPost(url,data,(err, res) => {
    		
	        that.setData({
	        	tourist		: res.tourist,
	        });
    	});
	    
	},
})