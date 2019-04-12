//app.js
const utils = require('./utils/util.js');
const http = require('./utils/http.js');
const config = require('./utils/config.js');
App({
	onLaunch: function() {
		// 微信登录，获取到code值，通过code向后台换取 openId，sessionKey， unionId
		wx.login({
			success: res => {
				console.log('用户登录')
				if (res.code) {
					// 拿到权限，获取用户信息
					wx.getSetting({
						success: (res) => {
							console.log(res)
							if (res.authSetting['scope.userInfo'] == true) {
								wx.getUserInfo({
									success: data => {
										this.globalData.userInfo = JSON.parse(data.rawData);
									}
								})
							}
							// 地理位置
							wx.getLocation({
								type: 'gcj02',
								success: res => {}
							})
						}
					})
				}
			}
		});
	},
	getUserInfo: function() {
		// 拿到权限，获取用户信息
		wx.getSetting({
			success: (res) => {
				console.log(res)
				if (res.authSetting['scope.userInfo'] == true) {
					wx.getUserInfo({
						success: data => {
							this.globalData.userInfo = JSON.parse(data.rawData);
						}
					})
				}
				// 地理位置
				wx.getLocation({
					type: 'gcj02',
					success: res => {}
				})
			}
		})
	},
	globalData: {
		userInfo: null,
		// 旋转次数,在裁剪之后进行相应的旋转已达到目标效果
		turnCount: 0,
		// 机型信息
		systemInfo: function () {
			const device = wx.getSystemInfoSync();
			const width = device.windowWidth;
			return {
				width: width
			}
		},
		authToken: ''
	},
    /**
     * 所有子页面的名称
     */
    subPages: function () {
        return ['index','mine'];
    },
})
