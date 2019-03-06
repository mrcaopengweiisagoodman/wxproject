/**
 * Path  : pages/utils/util
 * Author: jiuwanli666
 * Date  ：2019-03-04
 */
const config = require('./config.js');
/**
 * 空判断
 */
const isEmpty = obj => {
    if (typeof(obj) == "undefined" || (!obj && typeof(obj)!="undefined" && obj!=0)) {
        return true;
    }
    for (let i in obj){
        return false;
    }
    return true;
}
/**
 * 参数拼接
 * @param  [Array]  arr 参数集合  例子：[{a: 1, b: 2}] 或者 [{a: 1}, {b: 2}]
 * @return [String] 例子：'?a=1&b=2'
 */
const urlParamCombine = arr => {
    var param = "?";
    for (var key in arr) {
        if(typeof(arr[key]) == 'array' || typeof(arr[key]) == 'object') {
            for (var k in arr[key]) {
                param += (k + "=" + arr[key][k] + "&");
            }
        } else {
            param += (key + "=" + arr[key] + "&");
        }
    }
    return param.substr(0, param.length-1);
}
/**
 * 请求接口拼接（GET）
 * @param  [String] route  接口名称；例子：'/login_other'
 * @param  [Array]  params 参数（详情见urlParamCombine方法）
 * @return [String] 例子：'https://www.jiuwanli666.com/login_other?a=1&b=2'
 */
const getUrl = (route, params) => {
    var param = "";
    if (!isEmpty(params)) {
        param = urlParamCombine(params);
    }
    // return `https://${conf.baseDomain}/thirdparty/meizitu${route}${param}`;
    return `http://${config.baseDomain}${route}${param}`;
}








/*
 * 时间转换
 * @param  [Date对象] date 
 * @return [String]   例子：2019/02/27 16:38:07
 */
const formatTime = date => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const hour = date.getHours();
	const minute = date.getMinutes();
	const second = date.getSeconds();

	return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
}
/*
 * 数字处理
 * @param  [Number/String] n 需要处理的数字
 * @return [String] 例子：'05'
 */ 
const formatNumber = n => {
	n = n.toString();
	return n[1] ? n : '0' + n;
}
/**
 * 信息提示（简单样式）
 * @param [String] title 信息提示内容	
 * @param [String] icon  提示信息icon类型	
 * @param [Number] time  延时时间 	
 */
const msgModel = (title,icon,time) => {
	if (title) title = '请求错误！';
	if (icon)  icon = 'none';
	if (time)  time = 2000;
	return wx.showToast({
		title   : title,
		icon    : icon,
		duration: time
	});
}
module.exports = {
	
	isEmpty: isEmpty,
	urlParamCombine: urlParamCombine,
	getUrl: getUrl,
	
	
	
	
	
	formatTime  : formatTime,
	formatNumber: formatNumber,
	msgModel    : msgModel  
}
