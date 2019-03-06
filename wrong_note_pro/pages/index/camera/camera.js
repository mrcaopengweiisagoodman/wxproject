let isTake = false;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageSrc: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    /*
    * 照相机拍照
    */
    takePhoto() {
        const ctx = wx.createCameraContext();
        ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                if (res.tempImagePath) {
                    this.setData({
                        imageSrc: res.tempImagePath,
                    });

                }
            }
        })
    },
    error(e) {
        console.log(e.detail)
    },
    /*
    * 上传图片
    */
    handleTap() {
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                this.setData({
                    imageSrc: tempFilePaths[0]
                })
            }
        })
    },
    /*
    * 裁剪图片
    */
    cropperDone(e) {
        const { src, cropperData } = e.detail;
		wx.navigateTo({
			url: `../img_edit/img_edit?imageSrc=${src}`,
			success: () => {
				console.log('要去预览图片了');
			}
		})
       /* wx.previewImage({
            current: '', // 当前显示图片的http链接
            urls: [src], // 需要预览的图片http链接列表
        }) */
        /* this.setData({
            imageSrc: [src]
            // http://tmp/wx29dbb4426e5230f4.o6zAJs6sUVQmhKLvStq1_iKhFv7s.xl7SnZb4SG9Q2c2220dc5a8d0f8ab66f159516a45cc5.jpg

        });
		isTake = true; */
    },
    cropperCancel() {
        console.log('cancel');
    },
})