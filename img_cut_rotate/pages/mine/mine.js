const app = getApp();
const utils = require('../../utils/util.js');
const config = require('../../utils/config.js');
const http = require('../../utils/http.js');
Page({
	data: {
		headImg: '../../images/challenge/zhanji_img_tx.png', 
		avatar: '', //头像
		nickname: '获取昵称', //昵称
		userOtherMsg: {
			days: 0,
			questionCount: 0,
			sloveCount: 0
		},
			// 是否选择年级
		gradeIsChoice: false,
		// 获取学段数据（小学、中学等）
		// gradeData: [],
		gradeData: [],
		gradeDataId: null,
		// 学段响应的年级
		// gradeStepData: []
		gradeStepData: [],
		gradeStepDataId: null,
		xueqi: 'LAST',
		hasUserInfo: false, //是否有用户信息
		
		
		canIUse: wx.canIUse('button.open-type.getUserInfo'),
		showInfo: true, //是否显示用户信息
		showlogin: true ,//显示登录
		showModal: false,//是否显示遮罩层
		currentTab: 0, //弹出框tab切换id
	},
	onLoad: function () {
		let userInfo = app.globalData.userInfo;
		wx.getStorage({
			key: 'hasUserInfo',
			success: res => {
				this.setData({
					headImg: userInfo.avatarUrl,
					nickname: userInfo.nickName,
					hasUserInfo: true
				})
				this.userInfoFn();
			}
		})
		/* if (userInfo && this.data.hasUserInfo) {
			this.setData({
				headImg: userInfo.avatarUrl,
				nickname: userInfo.nickName
			})
		} */
	},
	toHistotyachivement : function () {
		if (this.data.hasUserInfo == false) {
			utils.msgModel('请先登录！');
			return
		}
		const { headImg, nickname } = this.data;
		wx.navigateTo({
			url: `./historical_achievements/index?headImg=${headImg}&nickname=${nickname}`
		})
	},
  // 点击编辑年级
	editGrape: function () {
		var that = this;
		this.setData({
			showModal: !that.data.showModal
		})
	},
  // 弹出框tab切换
	swichNav: function (e) {
		var that = this;
		if (this.data.currentTab === e.currentTarget.dataset.current) {
			return false;
		} else {
			that.setData({
				currentTab: e.currentTarget.dataset.current,
			})
		}
	},
	userInfoFn: function (res) {
		if (res) {
			res = res.detail.userInfo;
		}
		wx.request({
			url: `${config.baseDomain}user/info/get`,
			header: {
				'authToken': app.globalData.authToken
			},
			success: data => {
				if (data.data.state != 'SUCCESS') {
					utils.msgModel('获取用户信息失败！');
					return
				}
				wx.setStorage({
					key: 'hasUserInfo',
					data: true
				})
				this.setData({
					hasUserInfo: true,
					headImg: res ? res.avatarUrl : this.data.headImg,
					nickname: res ? res.nickName : this.data.nickname,
					userOtherMsg: {
						days: data.data.values.days,
						questionCount: data.data.values.questionCount,
						sloveCount: data.data.values.sloveCount
					},
				})
			}
		})
	},
	modifyGrade: function () {
		if (this.data.hasUserInfo == false) {
			utils.msgModel('请先登录！');
			return
		}
		this.getPeriod();
		this.setData({
			gradeIsChoice: true
		})
	},
	/**
	 * 获取学段
	 */
	getPeriod: function () {
		http({
			url: `${config.baseDomain}period/all`,
		})
		.then(data => {
			if (data.state == "SUCCESS") {
				this.setData({
					gradeData: data,
					gradeDataId: data.values.gradeList[0].periodId
				});
				this.getGrade(data.values.gradeList[0].periodId);
			}
		})
	},
	/**
	 * 获取年级
	 * @param param 学段id；若有学段id说明是在tab切换
	 */
	getGrade: function (param) {
		http({
			url: `${config.baseDomain}period/grade/${param}`,
		})
		.then(data => {
			if (data.state == "SUCCESS") {
				this.setData({
					gradeStepData: data,
					gradeStepDataId: data.values.grades[0].periodGradeId,
				})
			}
		})
	},
	/**
	 * 选择学段（小学、中学）
	 */
	selectGrage: function (e) {
		let gradeDataId = e.currentTarget.dataset.gradedataid;
		this.setData({
			gradeDataId: gradeDataId
		});
		wx.removeStorage({
			key: 'gradeIsChoice',
			success: () => {
				console.log('溢出chenggong')
				
			},
			fail: () => {
				console.log('溢出失败')
			},
		})
		this.getGrade(gradeDataId);
	},
	/**
	 * 选择年级（一年级、二年级）
	 */
	selectGrageStep: function (e) {
		let periodgradeid = e.currentTarget.dataset.periodgradeid;
		this.setData({
			gradeStepDataId: periodgradeid
		});
	},
	/**
	 * 选择学期
	 */
	selectXueqi: function (e) {
		let xueqi = e.currentTarget.dataset.xueqi;
		this.setData({
			xueqi: xueqi
		});
	},
	/**
	 * 提交已经选择的年级
	 * （修改年级的时候重新设置）
	 */
	selectedGrade: function () {
		let _this = this,
			{gradeStepDataId ,xueqi } = this.data;
		wx.setStorage({
			key: 'gradeIsChoice',
			data: false,
			success: (res) => {
				
				wx.request({
					url: config.baseDomain + 'user/update',
					header: {
						'authToken': app.globalData.authToken
					},
					method: 'POST',
					data: JSON.stringify({
						gradeId: gradeStepDataId,
						term: xueqi
					}),
					success: res => {
						if (res.data.state == 'SUCCESS') {
							utils.msgModel('设置成功！');
							_this.setData({
								gradeIsChoice: false
							});
							return
						}
						if (res.data.status == 999) {
							utils.msgModel(res.data.message);
							return
						}
						utils.msgModel(res.data.values.msg);
					},
					fail: () => {
						utils.msgModel('设置出错请关闭小程序重新进入！');
					}
				})
			},
			fail: (res) => {
			}
		})
	},
	
	
	removeS: function () {
		wx.removeStorage({
			key: 'gradeIsChoice',
			success: () => {
				utils.msgModel('移除缓存成功！');
			},
			fail: () => {
				utils.msgModel('移除缓存失败！');
			}
		})
	}
})