const app = getApp();
const utils = require('../../../utils/util.js');
// 获取显示区域长宽
const device = wx.getSystemInfoSync()
const W = device.windowWidth
const H = device.windowHeight - 50

let cropper = require('../../../templates/cropper/cropper.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageSrc: null,
		imageAgin: false,
		cameraIsShow: true,
		turnCount: 0,
		cropperStyle: {
			width: null,
			height: null
		},
        // 学科选择是否显示
        subjectIsShow: false,
        // 学科
        subjectText: '数学',
		cnText: 'MATH',
        jiantouImg: '../../../images/camera/photo_icon_kmxz.png',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		wx.setStorage({
		 	key: 'subject',
		 	data: 'MATH'
		})
		wx.getStorage({
			key: 'bigImgBack',
			success: res => {
				if (res.data) {
					wx.setStorage({
						key: 'imageAgin',
						data: true
					});
				}
			}
		})
		if (options.pageState == 'back') {
			wx.setStorage({
				key: 'imageAgin',
				data: true
			});
		} else {
			wx.removeStorage({key: 'imageAgin'});
			// wx.removeStorage({key: 'firstImg'});
		}
		var that = this;
        // 初始化组件数据和绑定事件
        cropper.init.apply(that, [W, H]);
    },
	onHide: function () {
		this.setData({
			cameraIsShow: true
		});
	},
	/* 关闭相机 */ 
	toHome: function () {
		wx.navigateBack({
			delta: 1
		});
	},
	/**s
	 * 选择学科
	 */
	selectSubject: function () {
        const { subjectIsShow,cnText} = this.data;
		this.setData({
            subjectIsShow: !subjectIsShow,
            jiantouImg: subjectIsShow ? '../../../images/camera/photo_icon_kmxz.png' : '../../../images/camera/photo_icon_kmxz_pressed.png'
        });
	},
    /**
     * 点击切换学科
     */
    choiceSubject: function (e) {
        this.setData({
            subjectText: e.target.dataset.subjecttext,
			cnText: e.target.dataset.cntext
        })
		wx.setStorage({
			key: 'subject',
			data: e.target.dataset.cntext
		})
    },
    /*
    * 照相机拍照
    */
    takePhoto: function () {
		let that = this;
		wx.getSetting({
			success: (res) => {
				if (!res.authSetting['scope.camera']) {
					wx.authorize({
						scope: 'scope.camera',
						success: data => {
							// console.log('授权结果！',data)
						}
					})
				}
			
				const ctx = wx.createCameraContext();
				ctx.takePhoto({
					quality: 'high',
					success: data => {
						if (data.tempImagePath) {
							this.setData({
								imageSrc: data.tempImagePath,
								cameraIsShow: false
							});
							// console.log(this.data.cameraIsShow);
							that.startUpCropper(that,data.tempImagePath,'rectangle',that.data.imageAgin);
						}
					},
					fail: () => {
						
					}
				});
			
			}
		});
    },
    error: function (e) {
        // console.log(e.detail)
    },
    /*
    * 弹出裁剪插件
    */
	selectTap: function (e) {
        let that = this;
        let mode = e.currentTarget.dataset.mode;
		let { imageAgin } = this.data;
        wx.chooseImage({
            count: 1,
            // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
			sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
            success(res) {
                const tempFilePath = res.tempFilePaths[0]
                // console.log(tempFilePath)
				that.setData({
					cameraIsShow: false
				});
				that.startUpCropper(that,tempFilePath,mode,imageAgin);
			}
        })
    },
	/**
	 * 启动插件
	 */
	startUpCropper: function (that,tempFilePath,mode,imageAgin) {
		// 将选取图片传入cropper，并显示cropper
		// mode=rectangle 返回图片path
		// mode=quadrangle 返回4个点的坐标，并不返回图片。这个模式需要配合后台使用，用于perspective correction
		// let modes = ["rectangle", "quadrangle"]
		// let mode = modes[1]   //rectangle, quadrangle
		that.showCropper({
		    src: tempFilePath,
			imageAgin: imageAgin,// 是否是再拍一张
		    mode: mode,
		    sizeType: ['compressed'],   //'original'(default) | 'compressed'
		    maxLength: 1000, //默认2000，允许最大长宽，避免分辨率过大导致崩溃
		    callback: (res) => {
		        if (mode == 'rectangle') {
					utils.msgModel('插件启动中！');
					let url;
		            // console.log("crop callback:" + res)
					wx.getStorage({
						key: 'imageAgin',
						success: reso => {
							if (reso.data) {
								// 拍第二张照片时
								url = `../img_edit/img_edit?imageSrc=${res}&imageAgin=true`;
							} else {
								url = `../img_edit/img_edit?imageSrc=${res}`
							}
							wx.navigateTo({
								url: url,
								fail: function () {
									utils.msgModel('截图失败，请重新截取！');
								},
								success: function () {
							
								}
							});
						},
						fail: d => {
							wx.navigateTo({
								url: `../img_edit/img_edit?imageSrc=${res}`,
								fail: function () {
									utils.msgModel('截图失败，请重新截取！');
								},
								success: function () {
									utils.msgModel('奥哟要去裁剪喽！');

								}
							});
							console.log(d)
						}
					});
		        } else {
		            wx.showModal({
		                title: '',
		                content: JSON.stringify(res),
		            })
		        }
				that.hideCropper() //隐藏，我在项目里是点击完成就上传，所以如果回调是上传，那么隐藏掉就行了，不用previewImage
		    }
		})
		            
	}
 })