//app.js
App({
    onLaunch: function () {
        // 展示本地存储能力
        this.getUserInfo();
        // 登录
        /* wx.login({
			success: res => {
				// 发送 res.code 到后台换取 openId, sessionKey, unionId
			}
        }) */
        // 获取用户信息
       /* wx.getSetting({
			success: res => {
				if (res.authSetting['scope.userInfo']) {
				// 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
				wx.getUserInfo({
					success: res => {
					// 可以将 res 发送给后台解码出 unionId
					this.globalData.userInfo = res.userInfo
					// 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
					// 所以此处加入 callback 以防止这种情况
					if (this.userInfoReadyCallback) {
						this.userInfoReadyCallback(res)
					}
					}
				})
				}
			}
        }) */
    },
    getUserInfo: function () {
        // 微信登录，获取到code值，通过code向后台换取 openId，sessionKey， unionId
        wx.login({
            success: (res) => {
                if (res.code) {
                    // console.log(res.code);
                }
            }
        });
        // 拿到权限，获取用户信息
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userInfo'] === true) {
                    wx.getUserInfo({
                        success: (data) => {
                            this.globalData.userInfo = data.userInfo;
                        }
                    })  
                }
                // 地理位置
                wx.getLocation({
                    type: 'gcj02',
                    success: res => {
                    }
                })
            }
        })
    },
    globalData: {
        userInfo: null
    },
  
})