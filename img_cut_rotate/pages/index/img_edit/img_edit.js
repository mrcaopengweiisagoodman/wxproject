/**
 * Path  ：pages/index/img_edit/img_edit
 * Author: jiuwanli666
 * Date  : 2019-02-28
 */
const utils = require('../../../utils/util.js');
const device = wx.getSystemInfoSync();
const width = device.windowWidth;
const system = device.system;
let height = device.windowHeight * 0.9;
const config = require('../../../utils/config.js');


Page({
    /**
     * 页面的初始数据
     */
    data: {
		// 编辑了图片---正面
        imageSrc: null,
		// 裁剪图片（原图）---背面
		imageEditSrc: '',
		// 所有图片路径的集合，长度最大4，最小2
		allImageSrc: [],
		// 上面图片所对应
		allImageInfo: [],
		// 若有第二张时，第一张原图的临时文件
		firstImg: {
			src: '',
			w: '',
			h: ''
		},
		inputVal: '',
		// image
		imageInfo: {
			width: 0,
			height: 0,
		},
		pageState: 'imageShow',
		// 是否是橡皮擦状态
		isClear: false,
		// 画笔颜色
		penColor: '#FFFFFF',
		// 画笔宽度
		lineWidth: 10,
		curContexts: [],
		// 第几次画图
		pathCount: 0,
		contextCount: 0,
		turnCount: 0,
		testSrc: '',
		// 保存图片时，展示容器于可视区域的比例
		bili: 0.7,
		// 展示所有图片时，显示对应的
		imageCurrent: 0,
		imageAgin: false,
		// 用于获取错题详情（第一张图片）
		questionId: 0,
		// 画布大小
		canvasInfo: {
			width: 0,
			height: 0
		},
		// saveImgBtnName: [],
		authToken: '',
		// 背面标签
		selectLabelsBack: [],
		// 正面标签
		selectLabelsFace: [],
		selectLabelsIds: '',
		// 已经上传的图片数量
		uploadNum: {
			b: null,
			f: 'file_front'
		},
		// 所选学科
		subject: '',
		  // 学科选择是否显示
		subjectIsShow: false,
		// 学科
		subjectText: '数学',
		cnText: 'MATH',
		jiantouImg: '../../../images/camera/photo_icon_kmxz.png',
		isGoIndex: false,
		reTakeOri: false,
		btnArr: false,
		turnCount: 0
    },
	onShow: function () {
		let selectLabelsBack = [],
			selectLabelsFace = [],
			{ selectLabelsIds } = this.data;
		wx.getStorage({
			key: 'selectLabelsBack',
			success: res => {
				if (res.data) {
					for (let ele of res.data) {
						selectLabelsFace.push(ele.labelId);
					}
					console.log(selectLabelsFace)
					this.setData({
						selectLabelsBack: res.data,
						selectLabelsIds: selectLabelsFace.join(',')
					})
				}
			}
		})
		wx.getStorage({
			key: 'selectLabelsFace',
			success: res => {
				if (res.data) {
					this.setData({
						selectLabelsFace: res.data
					})
				}
			}
		})
	},
	/**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
		let firstImgInfo = {};
		let authToken = '';
		let _this = this;
		wx.getStorage({
			key: 'authToken',
			success: res => {
				this.setData({
					authToken: res.data
				})
			}
		});
		wx.getStorage({
			key: 'reTakeOri',
			success: res => {
				this.setData({
					reTakeOri: true
				})
			}
		})
		wx.getStorage({
			key: 'subject',
			success: res => {
				let obj = {
					'CHINESE': '语文',
					'MATH': '数学',
					'ENGLISH': '英语'
				};
				this.setData({
					subject: res.data,
					cnText: res.data,
					subjectText: obj[res.data]
				})
			}
		})
		let allImageSrc , allImageInfo;
		
		if (options.imageAgin) {
			wx.getStorage({
				key: 'firstImg',
				success: res => {
					this.setData({
						imageAgin: options.imageAgin,
						firstImg: res.data
					})
				}
			})
			wx.removeStorage({
				key: 'imageAgin'
			});
		} 
		utils.getStorage({
			key: 'rotateSize'
		}).then( res => {
			let data = JSON.parse(res);
			// 图片等比例缩放
			let w ,h;
			let imgScale = utils.imgScale(width*0.9,height * 0.7,data.w,data.h);
			w = imgScale.w;
			h = imgScale.h;
			this.setData({
				imageSrc: options.imageSrc,
				imageInfo: {
					width: w,
					height: h,
				},
				imageEditSrc: options.imageSrc
			});
			
			const ctx = wx.createCanvasContext('canvasIn', this);
			if (options.imageAgin) {
				let { firstImg , imageInfo} = this.data;
				let img_h1 ,img_h2 ,img_w1, img_w2,
					firstImgW = firstImg.w,
					firstImgH = firstImg.h;
				// 第一张图片（左上角）等比大小
				let firstImgScale = utils.imgScale(70,100 * 0.7,firstImg.w,firstImg.h);
				firstImgW = firstImgScale.w;
				firstImgH = firstImgScale.h; 
				// canvas大小处理（保证canvas中间没有大片白色，且两张图片显示为等比例大小大小）
				let canvasW = firstImg.w > w ? firstImg.w : w,// 两张图片拼接原始大小
					canvasH = firstImg.h + h,
					ratio_can = canvasW / canvasH,
					ratio_img1 = firstImg.w / firstImg.h,// 第一张图片宽高比
					ratio_img2 = imageInfo.width / imageInfo.height,
					ratio_h1 = firstImg.h / canvasH,// 第一张图片高度占两张图总高的比例
					ratio_h2 = imageInfo.height / canvasH;
					
					img_h1 = firstImg.h;
					img_h2 = imageInfo.height;
					img_w1 = firstImg.w;
					img_w2 = imageInfo.width;
					
					if (canvasH > height * 0.7) {
						canvasH = height * 0.7;
						canvasW = canvasH * ratio_can;
						img_h1 = canvasH * ratio_h1;
						img_h2 = canvasH * ratio_h2;
						img_w1 = img_h1 * ratio_img1;
						img_w2 = img_h2 * ratio_img2;
					}
					if (canvasW > width) {
						canvasW = width;
						canvasH = canvasW / ratio_can;
						img_h1 = canvasH * ratio_h1;
						img_h2 = canvasH * ratio_h2;
						img_w1 = img_h1 * ratio_img1;
						img_w2 = img_h2 * ratio_img2;
					}
				/* this.drawFirstImg(ctx,this.data.firstImg.src,0,0,canvasW,canvasH);
				ctx.drawImage(options.imageSrc, 0, canvasH,w,h); */
				_this.setData({
					firstImg: {
						src: firstImg.src,
						w: firstImgW,
						h: firstImgH,
					},
					canvasInfo: {
						width: canvasW,
						height: canvasH,
					}
				});
				this.drawFirstImg(ctx,this.data.firstImg.src,0,0,img_w1,img_h1);
				ctx.drawImage(options.imageSrc, 0, img_h1,img_w2,img_h2);
				ctx.draw(false,function(){
					// 导出原图（背面---拼接之后）
					wx.canvasToTempFilePath({
						fileType: 'jpg',
						quality: 1,
						canvasId: 'canvasIn',
						success(canvas) {
							// console.log('***********---',canvas.tempFilePath)
							_this.setData({
								imageSrc: canvas.tempFilePath,
								imageEditSrc: canvas.tempFilePath,
								canvasInfo: {
									width: canvasW,
									height: canvasH
								}
							});
							
						}
					})
				});
				this.context = ctx;
				this.saveCanvas(canvasW,canvasH);
				return
			} 
			wx.setStorage({
				key: 'firstImg',
				data: {
					src: options.imageSrc,
					w: w,
					h: h
				}
			});
			
			ctx.drawImage(options.imageSrc, 0, 0,w,h);
			ctx.draw();
			this.context = ctx;		
		});		
    },
	/**
	 * 
	 * 画第一张图片（存储在本地缓存）
	 * @param x 第二张图片的高
	 */
	drawFirstImg: function (ctx,path,x,y,w,h) {
		// path = 'https://avatar.csdnimg.cn/9/A/E/1_hushilin001.jpg';
		ctx.drawImage(path,x ,y , w, h);
        ctx.save();
        ctx.restore();
        ctx.stroke();
	},
	/**
	 * 再拍一张（返回camera页面）
	 */
	reCamera: function () {
		if (this.data.pageState == 'allImageShow') {
			this.setData({
				imageAgin: false,
				imageSrc: ''
			})
			wx.setStorage({
				key: 'reTakeOri',
				data: true
			})
		} 
		// let pageLength = getCurrentPages().length;
		wx.navigateBack({
			delta: 1
		})
	},
	/**
	 * 重拍，返回到camera页面
	 */
	backCamera: function (e) {
		// 返回camera界面之后，识别参数，对重拍图片路径进行存储
		wx.navigateTo({
			url: '/pages/index/camera/camera?pageState=back',
			success: res => {
			},
			fail: res => {
			
			}
		});
	},
	bigImgBack: function () {
		wx.setStorage({
			key: 'bigImgBack',
			data: true
		})
		wx.navigateBack({
			delta: 1
		})
	},
	/**
	 * 编辑图片（更改页面状态：图片展示 / 图片编辑）
	 */
	goEdit: function (e) {
		let { imageInfo, canvasInfo } = this.data;
		// console.log('状态---',this.data.reTakeOri,e.target.dataset.pagestate)
		
		if (e.target.dataset.pagestate == 'imageEdit' && this.data.reTakeOri) {
			let w ,h;
			let pageState = e.target.dataset.pagestate;
			let imgScale = utils.imgScale(width,height * 0.95,canvasInfo.width,canvasInfo.height);
			w = imgScale.w;
			h = imgScale.h;
			
			this.saveCanvas(w,h,true);
			this.setData({
				pageState: 'allImageShow',
				// imageAgin: false,
				cavasInfo: {
					width: w,
					height: h
				},
			});
			return
		}
		// 在编辑完图片后存图片大小
		if (e.target.dataset.pagestate == 'imageEdit' && this.data.imageAgin) {
			let w ,h;
			let pageState = e.target.dataset.pagestate;
			let imgScale = utils.imgScale(width,height * 0.95,canvasInfo.width,canvasInfo.height);
			w = imgScale.w;
			h = imgScale.h;
			
			this.saveCanvas(w,h,true);
			this.setData({
				pageState: this.data.reTakeOri ? 'allImageShow' : pageState,
				// imageAgin: false,
				cavasInfo: {
					width: w,
					height: h
				},
			});
			return
		}
		if (e.target.dataset.pagestate == 'imageSave') {
			let w ,h;
			let imgScale = utils.imgScale(width*0.9,height * 0.9,imageInfo.width,imageInfo.height);
			w = imgScale.w;
			h = imgScale.h;
			this.setData({
				imageInfo: {
					width: w,
					height: h
				},
				pageState: e.target.dataset.pagestate
			});
			this.saveCanvas(w,h);
			
			return
		} 
		if (e.target.dataset.pagestate == 'allImageShow') {
			this.allImageShowFn(e.target.dataset.pagestate);
			return
		}
		this.setData({
			pageState: e.target.dataset.pagestate,
			imageAgin: false
		});
	},
	/**
	 * 所有图片展示区---页面状态为allImageShow
	 */
	allImageShowFn: function (pagestate) {
		let _this = this;
		wx.getStorage({
			key: 'subject',
			success: res => {
				this.setData({
					pageState: pagestate,
					subject: res.data
				})
			}
		});
	},
	/**
	 * 正背面展示---切换左右图片
	 */
	clickChange:function(e){
        this.setData({
            imageCurrent: this.data.imageCurrent ? 0 : 1
        })
    },
	/**
	 * 滑块滑动
	 */
	slideChange: function (e) {
        this.setData({
            imageCurrent: e.detail.current
        });
    },
	/**
	 * 获得备注信息
	 */
	getInput: function (e) {
		let val =  e.detail.value;
		this.setData({
			inputVal: val
		})
	},	
	/**
	 * 选择画笔
	 * @param e.target.id  画笔粗细程度：5为最细，10为中细，15为最粗；
	 */ 
	setLineWidth: function (e) {
		const lineWidth = e.currentTarget.dataset.param;
		// console.log("lineWidth:" + lineWidth);
		this.setData ({
			isClear: false,
			lineWidth: lineWidth
		});
	},
	/**
	 * 选择颜色
	 */
	colorSelect: function (e) {
		const penColor = e.target.dataset.param;
		// console.log("penColor:" + penColor);
		this.setData({
			isClear: false,
			penColor: penColor,
		});
	},
	touchStart: function (e) {
		 //得到触摸点的坐标
		this.startX = e.changedTouches[0].x;
		this.startY = e.changedTouches[0].y;
		// console.log('开始点---',this.startX,this.startY)
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
		var startX1 = e.changedTouches[0].x;
		var startY1 = e.changedTouches[0].y;
		// console.log('一动点---',this.startX1,this.startY1)
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
		const { width , height} = this.data.imageInfo;
		this.setData({
			// isClear: true,// 擦出图片
			pathCount: 0
		});
		this.context.clearRect(0,0,750, 1280);
		this.context.drawImage(this.data.imageSrc, 0, 0,width,height);
		this.context.draw();
	},
	/**
	 * 撤销
	 */
	recoverCanvas: function (e) {
		const { imageAgin ,canvasInfo ,imageInfo,imageSrc} = this.data;
		if (!this.data.pathCount) {
			return
		}
		this.context.clearRect(0,0,750, 1280);
		imageAgin ? this.context.drawImage(imageSrc, 0, 0,canvasInfo.width,canvasInfo.height) 
				  : this.context.drawImage(imageSrc, 0, 0,imageInfo.width,imageInfo.height);
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
	 * 保存涂鸦到到本地
	 * @param flag 是否保存拼接的原图
	 */
	saveCanvas: function (w,h,flag) {
		let _this = this,
			storage;
		wx.canvasToTempFilePath({
			fileType: 'jpg',
			quality: 1,
			canvasId: 'canvasIn',
			success(res) {
				console.log('导出图片成功---',res.tempFilePath)
				_this.setData({
					imageSrc: res.tempFilePath,
				});
				if (flag) {
					wx.setStorage({
						key: 'firstImg',
						data: {
							src: res.tempFilePath,
							w: w,
							h: h
						}
					})
				}
			}
		})
	},
	/**
	 * 上传原图、涂鸦到服务器
	 */
	uploadCanvas: function (e) {
		let _this = this,
			name = e.currentTarget.dataset.name,
			imageSrc = e.currentTarget.dataset.imagesrc,
			{ authToken,inputVal ,uploadNum ,subject,selectLabelsIds,isGoIndex,reTakeOri} = this.data;
		utils.msgModel('上传中','loading');
		// let subject = 'MATH';
		this.setData({
			btnArr: false
		})
		wx.uploadFile({
			url: `${config.baseDomain}question/save?remark=${inputVal}&subject=${subject}&selectLabelsIds=${selectLabelsIds}`, 
			filePath: imageSrc,
			header: {
				'content-type': 'multipart/form-data',
				'authToken': authToken
			},	
			name: name,
			success: res => {
				res = JSON.parse(res.data);
				// console.log(name);
				if (res.state == 999) {
					utils.msgModel('请确认用户已经登录！');
					return
				}
				if (res.state == 'SUCCESS') {
					if (name == 'file_front') {
						this.setData({
							uploadNum: {
								f: null,
								b: 'file_back'
							},
							selectLabelsIds: '',
							isGoIndex: true,
							btnArr: false

						});
					} /* else {
						this.setData({
							uploadNum: {
								b: name,
								// f: uploadNum.f
								f: null
							}
						});
					} */
					if (this.data.uploadNum.b == 'file_back' && isGoIndex || this.data.uploadNum.b == null && reTakeOri) {
						this.setData({
							reTakeOri: false
						})
						let timer = setTimeout(function () {
							wx.navigateBack({
								delta: getCurrentPages().length
							})
							clearTimeout(timer);
						},2000);
					}
					utils.msgModel('图片上传成功！');
					return
				}
				utils.msgModel('图片上传失败！');
			},
			fail (err) {
				utils.msgModel('图片上传失败！');
			}
		})
	},
	/**
	 * 标签管理页面
	 */
	adminLabels: function (e) {
		// 区别是背面还是正面
		let direction = e.currentTarget.dataset.direction;
		wx.navigateTo({
			url: `/pages/labels/labels?direction=${direction}`,
			fail: () => {
				utils.msgModel('标签管理页打开失败！');
			}
		})
		
	},
	/**
	 * 把图片画到canvas，并旋转canvas（勿删功能）
	 * @param [Boolean] isOnload 是否是在刚加载阶段，
	 * @param [String]  imageSrc 背景图片的路径
	 * @param [Number]  width    图片在canvas上的宽度
	 * @param [Number]  height   图片在canvas上的高度
	 * @param [Number]  turnNum  图片旋转的次数（1：90度；2:180；0：原位置）
	 */
	drawImg: function (isOnload,imageSrc, w , h,turnNum) {
		const ctx = wx.createCanvasContext('canvasIn', this);
		let yuandian ,yuandian1, yuandian2, w1,h1;
		let {imageInfo,testSrc} = this.data;
		// 旋转原点配置
		yuandian = [
			[0,0],
			[imageInfo.height,0],
			[imageInfo.width,imageInfo.height],
			[0,imageInfo.width]
		];
		if (turnNum % 2 == 0) {
			w1 = imageInfo.width;
			h1 = imageInfo.height;
		} else {
			w1 = imageInfo.height;
			h1 = imageInfo.width;
		}
		this.setData({
			turnNum: turnNum,
			imageInfo: {
				width: w1,
				height: h1,
			}
		})
		
		ctx.translate(yuandian[turnNum][0], yuandian[turnNum][1]);
		// 旋转度数
		ctx.rotate(turnNum * 90 * Math.PI / 180);
		// ctx.drawImage(imageSrc, 0, 0,w,h);
		ctx.drawImage(imageSrc, 0, 0,w,h);
	
		let _this = this;
		let timer = setTimeout(function(){
			ctx.draw(false, wx.canvasToTempFilePath({
				x: w1 / 2,
				y: h1 / 2,
				width: w1,
				height: h1,
				destWidth: w1,
				destHeight: h1,
				canvasId: 'canvasIn',
				success: function (res) {
					var tempFilePath = res.tempFilePath;
					// wx.uploadFile()将图片传到服务端
					_this.setData({
						testSrc: tempFilePath
					})
				},
				fail: function (res) {
					console.log(res);
				}
			}));
			// clearTimeout(timer);
		},1000);
		// ctx.draw();
		if (isOnload) this.context = ctx;
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
			cnText: e.target.dataset.cntext,
			subject: e.target.dataset.cntext
	    })
		wx.setStorage({
			key: 'subject',	
			data: e.target.dataset.cntext
		})
	},
	/**
	 * 点击图片查看地图
	 */
	browseImg: function (e) {
		console.log(e.currentTarget.dataset.src);
		this.setData({
			btnArr: !this.data.btnArr
		});
	},
	/**
	 * 旋转图片
	 */
	turnImg: function () {
		let { turnCount } = this.data;
		turnCount++;
		if (turnCount > 4) {
			turnCount = 0;
		}
		this.setData({
			turnCount: turnCount
		})
	},
	bigImgHide: function () {
		this.setData({
			btnArr: !this.data.btnArr
		})
	}
})