// pages/mine/mine.js
const http = require('../../utils/http.js');
const util = require('../../utils/util');
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: null
    },
	login: function () {
		/**
		 * 
		 */
		wx.login({
			success: res => {
				console.log('登录返回---',res);
				if (res.code) {
					http({
						method: 'GET',
						url: util.getUrl('/login_other',[{code: res.code}])
					})
					.then(data => {
						console.log('请求的数据---',data)
					})
				}
			}
		});
	},
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
	
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            userInfo: app.globalData.userInfo
        })
    },
})