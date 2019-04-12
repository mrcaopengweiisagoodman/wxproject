//index.js
//获取应用实例
const app = getApp();
const utils = require('./../../utils/util.js');
const http = require('./../../utils/http.js');
const config = require('./../../utils/config.js');

// 测试json
const grade = require('./../../json/grade.js');
const gradeStep = require('./../../json/gradeStep.js');


Page({
    data: {
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
		// 底部tabbar
		pathStr: 'index',
		// 轮播当前图片
		Images: [
            '../../images/home/banner2.jpg',
            '../../images/home/banner1.jpg',
            '../../images/home/banner3.jpg'
        ],
		swiperIndex: 1,
		// 学科导航
		subjectNavBg: [
			{	
				name: '美景',
				egName: '',
				subject: '',
				bg: '../../images/home/img_chinese2.png',
				math: '../../images/home/img_math2.png',
				english: '../../images/home/img_english2.png'
			},{	
				name: '美人',
				egName: '',
				subject: '',
				bg: '../../images/home/img_math2.png',
			},{	
				name: '豪车',
				egName: '',
				subject: '',
				bg: '../../images/home/img_english2.png',
			}
		],
		sub: [],
		// 拍照按钮
		takePhotoBtn: 'btn_paizhao1',
		// 是否选择年级
		gradeIsChoice: false,
		// 获取学段数据（小学、中学等）
		gradeData: [],
		gradeDataId: '',
	/* 	gradeData: grade.grade,
		gradeDataId: grade.grade.values.gradeList[0].periodId, */
		// 学段响应的年级
		gradeStepData: [],
		gradeStepDataId: '',
		/* gradeStepData: gradeStep.gradeStep,
		gradeStepDataId: gradeStep.gradeStep.values.grades[0].periodGradeId, */
		xueqi: 'LAST',
		
    },
	// 轮播滑动时，获取当前的轮播id
	swiperChange: function (e) {
		const that = this;
		that.setData({
			swiperIndex: e.detail.current,
		});
	},
    /**
	 * 去拍照，按钮显示闪烁效果
	 */
	goTakePhoto: function () {
		let _this = this;
		console.log(getCurrentPages()[0].route)
		this.setData({
			takePhotoBtn: 'btn_paizhao2'
		});
		let timer = setTimeout(() => {
			wx.navigateTo({
				url: '/pages/index/camera/camera',
			});
			this.setData({
				takePhotoBtn: 'btn_paizhao1'
			});
			clearTimeout(timer);
		},1000);
	},
    onLoad: function () { 
		let _this = this;
		wx.removeStorage({key: 'rotateSize'});
		wx.removeStorage({key: 'rotateSize'});
		wx.removeStorage({key: 'selectLabelsBack'});
		wx.removeStorage({key: 'selectLabelsFace'});
		wx.removeStorage({key: 'reTakeOri'});
		wx.removeStorage({key: 'bigImgBack'});
		// 判断是否已经选择了年级、学期
		wx.getStorage({
			key: 'gradeIsChoice',
			success: (res) => {
				_this.setData({
					gradeIsChoice: res.data
				})
			},
			fail: (res) => {
				// utils.msgModel('获取缓存失败');
				_this.getPeriod();
			}
		})
    },
    layerClick: () => {
        console.log('layer-click');
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
				this.getGrade(data.values.gradeList[0].periodId,data);
			}
		})
	},
	/**
	 * 获取年级
	 * @param param 学段id；若有学段id说明是在tab切换
	 */
	getGrade: function (param,periodData) {
		http({
			url: `${config.baseDomain}period/grade/${param}`,
		})
		.then(data => {
			if (data.state == "SUCCESS") {
				if (periodData) {
					this.setData({
						gradeData: periodData,
						gradeDataId: periodData.values.gradeList[0].periodId,
						gradeStepData: data,
						gradeStepDataId: data.values.grades[0].periodGradeId,
						gradeIsChoice: true
					})
					return
				}
				this.setData({
					gradeStepData: data,
					gradeStepDataId: data.values.grades[0].periodGradeId,
					gradeIsChoice: true
				})
			}
		})
	},
    /**
     * 客服回话
     */
	contactCallBack: (e) => {
		
		console.log('回话回调！',e);
	},
    /**
     * 自定义底部tabbar切换
     */
	tabChange: function (e) {
        const { pathStr } = this.data,
            navigatePath = e.currentTarget.dataset.pathstr;
        if (navigatePath != pathStr && app.subPages().indexOf(pathStr) != -1) {
            wx.navigateTo({
                url: `/pages/${navigatePath}/${navigatePath}`,
                fail: function () {
                    utils.msgModel('页面跳转失败！');
                }
            })
        }
	},
	/**
	 * 选择学段（小学、中学）
	 */
	selectGrage: function (e) {
		let gradeDataId = e.currentTarget.dataset.gradedataid;
		this.setData({
			gradeDataId: gradeDataId
		});
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
	}
})
