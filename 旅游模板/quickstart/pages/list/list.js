var Api = require('../../utils/api.js');
var app = getApp();
Page({
	data: {
		id:'',//大类ID
		img:'',//背景图
		categoryList:[],
	    // tab切换  
	    indicatorDots: false,
	    autoplay: false,
	    interval: 5000,
	    duration: 1000,
      num:2,
	},
  
   onLoad:function(options){
	  	this.setData({
	  		id		: options.id
	  	});
		var that = this;
    	var user = wx.getStorageSync('user');
    	
    	var url = Api.HOST + 'wechat.php?s=Home/product';
    	
    	var data = {};
    	data.cid = this.data.id;
    	
    	Api.fetchPost(url,data,(err, res) => {
	        that.setData({
	        	imgUrls		: res.carousel,
	        	categoryList: res.categoryList,
	        	linktel		: res.linktel,
	        	productList : res.productList
	        });      
    	}); 
	},
	

	swichNav: function (e) {
		var that = this;
    	var url = Api.HOST + 'wechat.php?s=Home/product';
    	
    	var data = {};
    	data.cid = this.data.id;
    	data.cid2 =  e.target.dataset.value;
    	
    	Api.fetchPost(url,data,(err, res) => {
	        that.setData({
	        	categoryList: res.categoryList,
	        	productList : res.productList
	        });      
    	}); 
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