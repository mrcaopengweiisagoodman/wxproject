var Api = require('../../utils/api.js');
var imageUtil = require('../../utils/util.js'); 
var app = getApp();
Page({
	data: {
		trimList:[],
		imgpath:[],
	    // tab切换  
	    currentTab: 0,
	    indicatorDots: false,
	    autoplay: false,
	    interval: 5000,
	    duration: 1000,
      imagewidth: 0,//缩放后的宽 
      imageheight: 0,//缩放后的高 
	},
	
	onLoad:function(options){
		var that = this;
	  	this.setData({
	  		id		: options.id
	  	});
	  	app.getUserInfo(function(userInfo){
			that.setData({
				headimgurl : userInfo.avatarUrl
		  	});
		});
	
		var url = Api.HOST + 'wechat.php?s=Home/time';
	
		var data = {};
		data.sid = this.data.id;
	
		Api.fetchPost(url,data,(err, res) => {
	        that.setData({
	        	trimList	: res.trimList,
	        	imgpath 	: res.imgpath
	        });
		}); 
	},
  imageLoad: function (e) {
    var imageSize = imageUtil.imageUtil(e)
    this.setData({
      imagewidth: imageSize.imageWidth,
      imageheight: imageSize.imageHeight
    })
  },
	swichNav: function (e) {
		var that = this;
    	var url = Api.HOST + 'wechat.php?s=Home/time';
    	
    	var data = {};
    	data.tid =  e.target.dataset.value;
    	
    	Api.fetchPost(url,data,(err, res) => {
	        that.setData({
	        	trimList	: res.trimList,
	        	imgpath 	: res.imgpath
	        });      
    	}); 
    	
	    var that = this;
	    var value = parseInt(e.currentTarget.dataset.value);
	    
	    if (this.data.currentTab === e.target.dataset.current) {
	      return false;
	    } else {
	      that.setData({
	        currentTab: e.target.dataset.current
	
	      })
	    }
	},
	scrollToTop: function (e) {
	    this.setAction({
	      scrollTop: 0
	    })
	},
	tap: function (e) {
	    for (var i = 0; i < order.length; ++i) {
	      if (order[i] === this.data.toView) {
	        this.setData({
	          toView: order[i + 1],
	          scrollTop: (i + 1) * 200
	        })
	        break
	      }
	    }
	},
	tapMove: function (e) {
	    this.setData({
	      scrollTop: this.data.scrollTop + 10
	    })
	}
})  