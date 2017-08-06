var Api = require('../../utils/api.js');
var app = getApp();
Page({
	data:{
		id:'',//产品ID
		product:[],
		showList:[],
		zanwu:0,
		headimgurl:[],
		
	    indicatorDots: true,
	    indicatorDotss: false,
	    autoplay: false,
	    interval: 5000,
	    duration: 1000,
	    circular:true,
	    state1:1,
	    state2: 1,
	    state3: 1,
	    img1: 0,
	    img2: 0,
	    img3: 0,
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
  	
		var url = Api.HOST + 'wechat.php?s=Home/detail';
  	
		var data = {};
		data.pid = this.data.id;
  	
		Api.fetchPost(url,data,(err, res) => {
	        that.setData({
	        	product		: res.product,
	        	showList	: res.showList,
	        	reviewList	: res.reviewList,	   
	        	zanwu		: res.zanwu
	        });
		}); 
	},
	
	review:function(){
		var that = this;
		var url = Api.HOST + 'wechat.php?s=Home/review';
	  	
		var user = wx.getStorageSync('user');
		var data = {};
		data.pid = this.data.id;
    	data.openid = user.openid;
    	data.content = this.data.content;
    	
		Api.fetchPost(url,data,(err, res) => {
			if(res.ret == 2){
				wx.navigateTo({
	   			 	url: '/pages/login/login?id='+this.data.id,
				})
			}else if(res.ret == 0){
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
				});
				return false;
			}else if(res.ret == 1){
				wx.showModal({
					content: res.msg,
					showCancel:false,
					success: function(res) {
						if(res.confirm){
							wx.redirectTo({
				   			 	url: '/pages/detail/detail?id='+that.data.id,
							})
						}else if(res.cancel) {
							console.log('用户点击取消')
						}
					}
				});
				
			}
	        
		}); 
	},
	
	content:function(e){
		this.data.content = e.detail.value;
	},
	
	openLocation: function (e) {
		var value = e.detail.value
		wx.openLocation({
			longitude: Number(value.longitude),
			latitude: Number(value.latitude),
			name: value.name,
			address: value.address
    	})
	},
	
  	call:function(e){
  		wx.makePhoneCall({
  			phoneNumber: this.data.product.linktel //仅为示例，并非真实的电话号码
  		})
  	},
  	
  down: function (e) {
    var subeq = e.currentTarget.dataset.subeq;
    var subid = e.currentTarget.id;
    if (subeq == 1){
      this.setData({
        state1: !this.data.state1,
        img1: !this.data.img1
      })
    }
    if (subeq == 2) {
      this.setData({
        state2: !this.data.state2,
        img2: !this.data.img2
      })
    }
    if (subeq == 3) {
      this.setData({
        state3: !this.data.state3,
        img3: !this.data.img3
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