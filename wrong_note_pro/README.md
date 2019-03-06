# wrong_note_pro
项目描述：
	拍照解题，帮助解题

一、小程序文档
```
1、API：https://developers.weixin.qq.com/miniprogram/dev/api
2、组件：https://developers.weixin.qq.com/miniprogram/dev/component
```

二、文件目录
```
————images
	|
	|————icons
————pages  页面
	|
	|————index 首页及其相关子页面
	|    |
	|	 |——camera 唤起相机，裁剪图片
	|    |——img_edit 编辑图片
	|
	|————mine 个人中心模块
	|
	|————review 复习模块
————templates 组件、插件
	|
	|————cropper 裁剪图片插件
	|————layer.wxml 遮罩层背景
————utils 公共函数文件
	|
	|————utils.js 公共方法
————app.js
	|————app逻辑
————app.json
	|————app文件配置
————app.wxss
	|————app样式
————project.config.json
	|————项目文件配置
```	
***
一个页面文件包含4个子文件：wxml、wxss、js、json；
各页面子文件的名称要页面文件名称保持一致；
***
