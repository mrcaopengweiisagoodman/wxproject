'use strict';
var HOST = 'https://jidi.ejucheng.net/jidi/';

// get请求方法
function fetchGet(url, callback) {
	// return callback(null, top250)
	wx.request({
		url: url,
		header: { 'Content-Type': 'application/json' },
		success (res) {
			console.log(res)
			callback(null, res.data)
		},
		fail (e) {
			console.error(e)
			callback(e)
		}
	})
}

// post请求方法
function fetchPost(url, data, callback) {
	wx.request({
		method: 'POST',
		url: url,
		data: data,
		header: {'content-type': 'application/x-www-form-urlencoded'},
		success (res) {
			callback(null, res.data)
		},
		fail (e) {
			console.error(e)
			callback(e)
		}
	})
}

module.exports = {
  // API 接口
  HOST:HOST,
  // METHOD 方法
  fetchGet: fetchGet,
  fetchPost: fetchPost
}
