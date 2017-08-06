var Api = require('../../utils/api.js');
var app = getApp();
Page({
	data: {
		productshow:[],
	    indicatorDots: true,
	    indicatorDotss: false,
	    autoplay: false,
	    interval: 5000,
	    duration: 1000,
	    circular: true,
	    state1: 1,
	    state2: 1,
	    img1: 0,
	    img2: 0,
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
	
		var url = Api.HOST + 'wechat.php?s=Home/subdetail';
	
		var data = {};
		data.sid = this.data.id;
	
		Api.fetchPost(url,data,(err, res) => {
	        that.setData({
	        	productshow	: res.productshow,
	        });
		}); 
	},
  openLocation: function (e) {
    console.log(e)
    var value = e.detail.value
    console.log(value)
    wx.openLocation({
      longitude: Number(value.longitude),
      latitude: Number(value.latitude),
      name: value.name,
      address: value.address
    })
  },
  call: function (e) {
    wx.makePhoneCall({
      phoneNumber: '0577-63385743' //仅为示例，并非真实的电话号码
    })
  },
  down: function (e) {
    var subeq = e.currentTarget.dataset.subeq;
    var subid = e.currentTarget.id;
    if (subeq == 1) {
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


  }
})