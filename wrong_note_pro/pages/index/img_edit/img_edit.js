/**
 * Path  ：pages/index/img_edit/img_edit
 * Author: jiuwanli666
 * Date  : 2019-02-28
 */
const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const system = device.system;
let height = device.windowHeight * 0.9;
Page({
    /**
     * 页面的初始数据
     */
    data: {
		testWidth: null,
		// 背景图片路径
        imageSrc: null,
		imageInfo: {
			width: 0,
			height: 0,
		},
		// 是否是橡皮擦状态
		isClear: false,
		// 画笔颜色
		penColor: '#22afaf',
		// 画笔宽度
		lineWidth: 5,
		curContexts: [],
		// 第几次画图
		pathCount: 0,
		contextCount: 0,
		turnCount: 0,
        turnNum: 0, 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		wx.getImageInfo({
			src: options.imageSrc,
			success: res => {
				// 图片比例（根据截取框的w/h=2/1）
				let w , h;
				res.width > width ? w = width : w = res.width;
				h = res.width * 0.5;
				
				this.setData({
					imageSrc: options.imageSrc,
					imageInfo: {
						width: parseInt(w),
						height: parseInt(h),
					},
				});
				this.drawImg(true,options.imageSrc,parseInt(w),parseInt(h));
			}
		});
    },
	/**
	 * 把图片绘制到canvas上
	 * @param [Boolean] isOnload 是否是在刚加载阶段，
	 * @param [String]  imageSrc 背景图片的路径
	 * @param [Number]  width    图片在canvas上的宽度
	 * @param [Number]  height   图片在canvas上的高度
	 */
	drawImg: function (isOnload,imageSrc, w , h) {
		console.log('图片w-h',w,h);
		const ctx = wx.createCanvasContext('canvasIn', this);
		w ? ctx.drawImage(imageSrc, 0, 0,w,h) : ctx.drawImage(imageSrc, 0, 0);
		// ctx.drawImage(imageSrc, 0, 0,w,h);
		ctx.draw();
		if (isOnload) this.context = ctx;
	},
	/**
	 * 选择画笔
	 * @param e.target.id  画笔粗细程度：5为最细，10为中细，15为最粗；
	 */ 
	setLineWidth: function (e) {
		const lineWidth = e.target.dataset.param;
		console.log("lineWidth:" + lineWidth);
		this.setData ({
			isClear: false,
			lineWidth: lineWidth,
		});
	},
	/**
	 * 选择颜色
	 */
	colorSelect: function (e) {
		const penColor = e.target.dataset.param;
		console.log("penColor:" + penColor);
		this.setData({
			isClear: false,
			penColor: penColor,
		});
	},
	touchStart: function (e) {
		 //得到触摸点的坐标
		this.startX = e.changedTouches[0].x
		this.startY = e.changedTouches[0].y
		// this.context = wx.createCanvasContext("canvasIn", this);
		let arr = new Array();
		this.data.curContexts[this.data.pathCount] = arr;
		this.setData({
			curContexts: this.data.curContexts,
			contextCount: 0,
		})
		if (this.data.isClear) { //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
			this.context.setStrokeStyle('#ffffff') //设置线条样式 此处设置为画布的背景颜色  橡皮擦原理就是：利用擦过的地方被填充为画布的背景颜色一致 从而达到橡皮擦的效果
			this.context.setLineCap('round') //设置线条端点的样式
			this.context.setLineJoin('round') //设置两线相交处的样式
			this.context.setLineWidth(20) //设置线条宽度
			this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
			this.context.beginPath() //开始一个路径
			this.context.arc(this.startX, this.startY, 5, 0, 2 * Math.PI, true);  //添加一个弧形路径到当前路径，顺时针绘制  这里总共画了360度  也就是一个圆形
			this.context.fill();  //对当前路径进行填充
			this.context.restore();  //恢复之前保存过的坐标轴的缩放、旋转、平移信息
		} else {
			// 设置画笔颜色
			this.context.setStrokeStyle(this.data.penColor);
			// 设置线条宽度
			this.context.setLineWidth(this.data.lineWidth);
			this.context.setLineCap('round') // 让线条圆润
			this.context.beginPath()
		}
	},
	 /**
	 * 手指触摸后移动
	 */
	touchMove: function (e) {
		var startX1 = e.changedTouches[0].x
		var startY1 = e.changedTouches[0].y

		if (this.data.isClear) { //判断是否启用的橡皮擦功能  ture表示清除  false表示画画
			this.context.save();  //保存当前坐标轴的缩放、旋转、平移信息
			this.context.moveTo(this.startX, this.startY);  //把路径移动到画布中的指定点，但不创建线条
			this.context.lineTo(startX1, startY1);  //添加一个新点，然后在画布中创建从该点到最后指定点的线条
			this.context.stroke();  //对当前路径进行描边
			this.context.restore();  //恢复之前保存过的坐标轴的缩放、旋转、平移信息

			this.startX = startX1;
			this.startY = startY1;
		} else {
			this.context.moveTo(this.startX, this.startY)
			this.context.lineTo(startX1, startY1)
			this.context.stroke()

			this.startX = startX1;
			this.startY = startY1;
		}

		//只是一个记录方法调用的容器，用于生成记录绘制行为的actions数组。context跟<canvas/>不存在对应关系，一个context生成画布的绘制动作数组可以应用于多个<canvas/>
		var actions = this.context.getActions();
		this.data.curContexts[this.data.pathCount][this.data.contextCount] = actions;
		this.setData ({
			curContexts: this.data.curContexts
		})
		wx.drawCanvas({
			canvasId: 'canvasIn',
			reserve: true,
			actions: actions // 获取绘图动作数组
		});
		this.data.contextCount++;
	
		console.log(this.data.curContexts)
		console.log(this.data.pathCount)
		console.log(this.data.contextCount)
		
	},
	/**
	 * 触摸结束
	 */
	touchEnd: function (e) {
		this.touchMove(e);
		this.setData({
			pathCount: (this.data.pathCount + 1),
			contextCount: 0
		});
	},
	/**
	 * 橡皮擦
	 */
	clearCanvas: function (e) {
		console.log("clearCanvas");
		this.setData({
			isClear: true,
			pathCount: 0
		});
		this.context.clearRect(0,0,750, 1280);
		this.context.drawImage(this.data.imageSrc, 0, 0);
		this.context.draw();
	},
	/**
	 * 撤销
	 */
	recoverCanvas: function (e) {
		this.context.clearRect(0,0,750, 1280);
		this.context.drawImage(this.data.imageSrc, 0, 0);
		this.context.draw();
		if (this.data.pathCount > 0) {
			for (var i = 0; i < this.data.pathCount - 1; i++) {
			  for (var j = 0; j < this.data.curContexts[i].length; j++) {
				wx.drawCanvas({
					canvasId: 'canvasIn',
					reserve: true,
					actions: this.data.curContexts[i][j] // 获取绘图动作数组
				});
			  }
			}

			var pathCount = this.data.pathCount - 1;
			this.data.curContexts[pathCount] = null;
			this.setData({
				pathCount: pathCount,
				contextCount: 0,
			});
		}
	},
	/**
	 * 旋转图片
	 */
	// 注：css实现
	/* turnCanvas: function () {
		let { turnCount } = this.data;
		turnCount++;
		this.setData({
			turnCount: turnCount > 4 ? 1 : turnCount
		});
		wx.canvasToTempFilePath({
			canvasId: 'canvasIn',
			success: function (res) {
				var tempFilePath = res.tempFilePath;
				console.log(tempFilePath)
				// 在这里可以进行 wx.uploadFile()操作，将图片传到服务端
				
			},
			fail: function (res) {
				console.log(res);
			}
		});
	}, */
	
	turnCanvas: function () {
        let yuandian ,yuandian1, yuandian2, w1,h1;
        let { turnNum , imageInfo} = this.data;
		turnNum++;
        if (turnNum > 3) turnNum = 0;
		yuandian = [
			[0,0],
			[imageInfo.height,0],
			[imageInfo.height,imageInfo.width],
			[0,imageInfo.width]
		];
		// 旋转原点配置
		/* if (turnNum === 1) {
		    yuandian1 = imageInfo.height;
		    yuandian2 = 0;
		} else if (turnNum === 2) {
		    yuandian1 = imageInfo.height;
		    yuandian2 = imageInfo.width;
		} else if (turnNum === 3) {
		    yuandian1 = 0;
		    yuandian2 = imageInfo.width;
		} else if (turnNum === 0) {
		    yuandian1 = 0;
		    yuandian2 = 0;
		} */
		w1 = imageInfo.height;
		h1 = imageInfo.width;
		this.setData({
			turnNum: turnNum,
			imageInfo: {
				width: w1,
				height: h1,
			}
		})
        console.log(turnNum,w1,h1);

		var canvas = wx.createContext();
		// 确定旋转原点
        canvas.translate(yuandian[turnNum][0], yuandian[turnNum][1]);
		// 旋转度数
		canvas.rotate(turnNum * 90 * Math.PI / 180);
		canvas.drawImage(this.data.imageSrc, 0, 0);
		wx.drawCanvas({
			canvasId: 'canvasIn',
			actions: canvas.getActions()
		})
		canvas.draw(false, wx.canvasToTempFilePath({
			canvasId: 'canvasIn',
			success: function (res) {
				var tempFilePath = res.tempFilePath;
				console.log('图片路径---',tempFilePath)
				// wx.uploadFile()将图片传到服务端
			},
			fail: function (res) {
				console.log(res);
			}
		}));
	}
})