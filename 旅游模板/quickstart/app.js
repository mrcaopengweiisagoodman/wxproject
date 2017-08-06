//app.js
App({
	globalData:{  
        appid:'wxc3188737b6302c3a',//appid需自己提供，此处的appid我随机编写  
        secret:'1c1429a7ba84338c13a3332ee4fa9f77',//secret需自己提供，此处的secret我随机编写 
        openid:'',
        userInfo:null
    },
    
    onLaunch: function(){  
        var that = this  
        var user = wx.getStorageSync('user') || {};    
        var userInfo = wx.getStorageSync('userInfo') || {};
        if(!user.openid || (user.expires_in) < (Date.parse(new Date())/1000 + 600)){
        	
        	wx.login({    
        		success:function(res){       
        			if(res.code){
        				var d = that.globalData;//这里存储了appid、secret、token串    
        				var l = 'https://api.weixin.qq.com/sns/jscode2session?appid='+d.appid+'&secret='+d.secret+'&js_code='+res.code+'&grant_type=authorization_code';    
        				wx.request({    
        					url: l,    
        					data: {},    
        					method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT    
        					// header: {}, // 设置请求的 header    
        					success: function(res){
        						var obj = {};  
        						obj.openid = res.data.openid;    
        						obj.expires_in = Date.parse(new Date())/1000 + res.data.expires_in;
        						
        						wx.setStorageSync('user', obj);//存储openid
        					}
	                   });
	               }else{
	                   console.log('获取用户登录态失败！' + res.errMsg)  
	               }            
        		}
        	});   
        }  
    },

    getUserInfo:function(cb){
	    var that = this
	    if(this.globalData.userInfo){
	    	typeof cb == "function" && cb(this.globalData.userInfo)
	    }else{
	    	//调用登录接口
	    	wx.login({
	    		success: function () {
	    			wx.getUserInfo({
	    				success: function (res) {
	    					that.globalData.userInfo = res.userInfo
	    					typeof cb == "function" && cb(that.globalData.userInfo)
	    					wx.setStorageSync('userInfo', res.userInfo);
	    				}
	    			})
	    		}
	    	})
	    }
    },
})