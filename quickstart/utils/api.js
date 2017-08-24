'use strict';
var HOST = 'https://youzhuang.ejucheng.net/youzhuang/';

// get请求方法
function fetchGet(url, callback) {
  // return callback(null, top250)
  wx.request({
    url: url,
    header: { 'Content-Type': 'application/json' },
    success(res) {
      console.log(res)
      callback(null, res.data)
    },
    fail(e) {
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
    header: { 'content-type': 'application/x-www-form-urlencoded' },
    success(res) {
      callback(null, res.data)
    },
    fail(e) {
      console.error(e)
      callback(e)
    }
  })
}

function alert(msg, callback) {
  wx.showModal({
    content: msg,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        if (callback) {
          callback(res.data)
        }
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  });
}


function call(linktel) {
  wx.makePhoneCall({
    phoneNumber: linktel
  })
}

function openlocation(lat, lng) {
  wx.openLocation({
    latitude: lat,
    longitude: lng,
    scale: 28
  })
}

module.exports = {
  HOST: HOST,
  fetchGet: fetchGet,	//get方法
  fetchPost: fetchPost,	//post方法
  alert: alert,		//alert方法
  call: call,		//一键拨号
  openlocation: openlocation	//导航
}
