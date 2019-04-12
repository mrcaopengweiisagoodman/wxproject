const app = getApp();
const utils = require('../../utils/util.js');
const http = require('../../utils/http.js');
const config = require('../../utils/config.js');
Page({
	data: {
		direction: '',
		// 顶部已经选择的标签
	/* 	selectLabels: [
			{labelName: '数学', labelId: 1},
			{labelName: '阅读理解', labelId: 2},
			{labelName: '语文', labelId: 3},
			{labelName: '英语', labelId: 4}
		], */
		selectLabels: [],
		// 当前用户所有的标签
		allLabels: [
			{labelName: '数学', labelId: 1},
			{labelName: '阅读理解', labelId: 2},
			{labelName: '语文', labelId: 3},
			{labelName: '英语', labelId: 4},
			{labelName: '科学', labelId: 5},
			{labelName: '化学', labelId: 6},
			{labelName: '我就是一个标签啊', labelId: 7}
		],
		inputVal: '',
		// 当前选中的标签
		labelActive: '',// string
	},
	onLoad: function (options) {
		let direction = options.direction;
		// 从缓存中中拿去已经添加的标签
		wx.getStorage({
			key: `selectLabels${direction}`,
			success: res => {
				if (res.data) {
					this.getLabels(options,res.data);
				}
			},
			fail: err => {
				// 获取到该用户保存的所有标签
				this.getLabels(options);
			}
		})
	},
	/**
	 * 获取当前用户所有标签
	 * @param direction 图片的那一面（back?face）
	 * @param selectLabels 已经选择了的标签
	 */
	getLabels: function (direction,selectLabels) {
		http({
			url: `${config.baseDomain}user/label/all`,
			header: {
				'authToken': app.globalData.authToken
			}
		}).then(res => {
			if (res.state == 'SUCCESS') {
				this.setData({
					allLabels: res.values.labels,
					direction: direction,
					selectLabels: selectLabels ? selectLabels : []
				})
				return
			}
			if (res.state == 999) {
				utils.msgModel('请先登录！');
				return
			}
			utils.msgModel('设置失败！');
		}).catch( err => {
			console.log(err)
		})
	},
	/**
	 * 在所有标签中选择
	 */
	setLabel: function (e) {
		let inx,
			item = e.target.dataset.param,
			{ selectLabels } = this.data;
		if (selectLabels.length > 50) {
			utils.msgModel('最多可以添加50个标签！','',500);
			return
		}
		for (let i = 0;i < selectLabels.length;i++) {
			if (selectLabels[i].labelId == item.labelId) {
				inx = i;
				this.setData({
					// labelActive: item.labelId
					labelActive: item.labelName,
				});
				utils.msgModel('该标签已被选用,无需再选！','',500);
				return
			}
		}
		inx == undefined ? selectLabels.push(item) : null;
		this.setData({
			// labelActive: item.labelId,
			labelActive: item.labelName,
			selectLabels: selectLabels
		});
	},
	/**
	 * 顶部标签，点击之后，从选中列表中清除
	 */
	deleteLabel: function (e) {
		let inx,
			item = e.target.dataset.param,
			{ selectLabels } = this.data;
		for (let i = 0;i < selectLabels.length;i++) {
			selectLabels[i].labelId == item.labelId ? inx = i : null;
		}
		if (inx > -0.9) {
			selectLabels.splice(inx,1);
		} else {
			return
		}
		this.setData({
			selectLabels: selectLabels,
			labelActive: ''
		})
	},
	/**
	 * 自定义新标签
	 */
	diyLabels: function (e) {
		let val = e.detail.value,
			{ selectLabels , allLabels} = this.data;
		if (!val) return;
		// 新增自定义标签
		wx.request({
			url: `${config.baseDomain}question/labels/add?labelName=${val}`,
			header: {
				'authToken': app.globalData.authToken
			},
			method: 'POST',
			success: res => {
				res = res.data;
				if (res.state == "SUCCESS") {
					selectLabels.push({labelName: val,labelId: res.values.labelId});
					allLabels.push({labelName: val,labelId: res.values.labelId});
					this.setData({
						labelActive: val,
						selectLabels: selectLabels,
						allLabels: allLabels,
						inputVal: ''
					});
					return
				}
				utils.msgModel('服务暂不可用！');
			}
		})
	},
	/**
	 * 提交标签管理
	 */
	labelSubmit: function () {
		let { selectLabels, direction} = this.data;
		wx.setStorage({
			key: `selectLabels${direction.direction}`,
			data: selectLabels.length > 5 ? selectLabels.splice(0,5) : selectLabels
		})
		// 标签修改后，返回编辑页面
		wx.navigateBack({
			delta: 1,
			success: res => {
			}
		})
	},
	/**
	 * 返回到图片编辑页面
	 */
	backImgEdit: function () {
		wx.navigateBack({
			delta: 1,
			success: function (res) {
			}
		})
	}
})