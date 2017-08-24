//signin.js
var week,addr_str;
var util = require('../../utils/util.js');
Page({
    data:{
        // 时间选择
        time: false,
        time_idx: [0,0,0,0,0],
        Y: 2017,
        y_arr: [],
        mon_arr: [],
        day_arr: [],
        h_arr: [],
        minu_arr: [],
        time_str: '请选择选择预约时间',
        // 地址选择
        addr: false,
        index: [0,0,0],
        addr_str: '请填写物业地址',
        // 图片数量
        // img_num: 4,
        img_src: '',

        // 假数据格式
        p:[
            '北京市',
            '山西省',
            '新疆维吾尔自治区',
            '广东'
        ],
        c: [
            [
                '市辖区',
                '县区',
            ],
             [
                '太原市',
                '长治市',
                '大同市',
            ],
             [
                '乌鲁木齐市',
                '哈密市',
                '喀什',
            ],
             [
                '广州市',
                '湛江市',
                '深圳市',
            ]
        ],
        x: [
            [
                [
                    '朝阳区',
                    '东城区',
                ],
                [
                    '密云县',
                    '延庆县',
                ]
            ],
            [
                [
                    '交城县',
                    '清徐县',
                    '迎泽区',
                ],
                [
                    '长治县',
                    '武乡县',
                ],
                [
                    '矿区',
                    '新荣区',
                ],
            ],
            [
                [
                    '天山区',
                    '沙依巴克区',
                ],
                [
                    '哈密市区',
                    '哈密郊区',
                ],
                [
                    '疏勒县',
                    '疏附县',
                ],
            ],
            [
                [
                    '白云区',
                    '天河区',
                ],
                [
                    '坡头区',
                    '麻山区',
                ],
                [
                    '福田区',
                    '盐田区',
                ],
            ]
        ]
    },
    num: function (a,arr) {
        var str;
        for (var i = 0;i < a;i++) {
            i < 9 ? str = '0' + (i + 1)
                   :  str = String(i+1);
            arr.push(str);
        }
    },
    weekChose: function (num) {
        switch(num){
            case 0: week = "星期日";
            break;
            case 1: week = "星期一";
            break;
            case 2: week = "星期二";
            break;
            case 3: week = "星期三";
            break;
            case 4: week = "星期四";
            break;
            case 5: week = "星期五";
            break;
            default: week = "星期六";
            break;
        };

    },
    chosMon: function (j) {
        var self = this,
            str,
            y_arr = [],
            mon_arr = [],
            day_arr = [],
            h_arr = [],
            minu_arr = [],
            date = new Date();

        for (var i = 2017;i <= 2018;i++) {
            y_arr.push(i);
        };
        self.num(12,mon_arr);
        for (var i = 0;i < 24;i++) {
            i < 10 ? str = '0' + i
                   : str = String(i);
            h_arr.push(str);
        };
        // 分
        for (var i = 0;i <= 60;i++) {
            i < 10 ? str = '0' + i
                   : str = String(i);
            minu_arr.push(str);
        };
       switch (mon_arr[j]) {
            case '02': self.num(29,day_arr);
            break;
            case '04':
            case '06':
            case '09':
            case '10':  self.num(30,day_arr);
            break;
            default: self.num(31,day_arr);
            break;
        }
        self.setData({
            time: true,
            y_arr: y_arr,
            mon_arr: mon_arr,
            day_arr: day_arr,
            h_arr: h_arr,
            minu_arr: minu_arr,
            color_o: 'color: #ff6600',
        });
    },
    onLoad: function () {
        var self = this;
        // wx.getSavedFileList({
        //     success: function(res) {
        //         if (res.fileList.length > 0){
        //           wx.removeSavedFile({
        //             filePath: res.fileList[0].filePath,
        //             complete: function(res) {
        //               console.log('hhhhhhhhhhhhhhieeeeeeeefhddvnvnknfkj')
        //             }
        //           })
        //         }
        //       }
        // })
       
    },
    addrCommon: function () {
        var self = this,
            addr_arr = self.data.index;
            addr_str = self.data.p[addr_arr[0]] + '-' +
                       self.data.c[addr_arr[0]][addr_arr[1]] + '-' +
                       self.data.x[addr_arr[0]][addr_arr[1]][addr_arr[2]];
    },
    // 弹出
    addrPicker: function (e) {
        var self = this;
            self.addrCommon();
        self.setData({
            addr: true,
        })
    },
    // 取消
    addrPickerHide: function () {
        var self = this;
        self.setData({
            addr: false,
            color_hei: 'color:#9fa0a0',
            // color_hei: 'color:red',
            addr_str: '请填写物业地址'
        })
    },
    // 确定
    addrPickerS: function () {
        var self = this;
        self.addrCommon();
        self.setData({
            addr: false,
            color_hei: 'color:#333',
            addr_str: addr_str
        })
    },
    // 滚动时
    choseAddr: function (e) {
        var self = this,
            addr_arr = self.data.index;
        self.addrCommon();
        self.setData({
            index: e.detail.value,
            addr_str: addr_str
        })
    },
    choseTime: function (e) {
        var self = this,
            idx = e.detail.value,
            endstr = '';
        self.chosMon(e.detail.value[1]);
        var date2 = new Date(`
            ${self.data.y_arr[idx[0]]}/ 
            ${self.data.mon_arr[idx[1]]}/ 
            ${self.data.day_arr[idx[2]]}
        `);
        console.log(date2.getDay())
        self.weekChose(date2.getDay());
        endstr = self.data.y_arr[idx[0]] + '-' +
                 self.data.mon_arr[idx[1]] + '-' +
                 self.data.day_arr[idx[2]] + ' ' +
                 week + ' ' +
                 self.data.h_arr[idx[3]] + ':' +
                 self.data.minu_arr[idx[4]];
        self.setData({
            time_idx: idx,
            time_str: endstr
        });
    },
    timePicker: function () {
        // 弹出之后初始化结果框
        var self = this;
        self.chosMon(self.data.time_idx[1]);
        console.log(self.data.time_idx)
        var idx = self.data.time_idx,
            flag = [0,0,0,0,0],
            date3 = new Date(`
                            ${self.data.y_arr[idx[0]]}/ 
                            ${self.data.mon_arr[idx[1]]}/ 
                            ${self.data.day_arr[idx[2]]}
                        `)
                        .getDay();

        self.weekChose(date3);
        self.setData({
            time_str: self.data.y_arr[idx[0]] + '-' + 
                      self.data.mon_arr[idx[1]] + '-' + 
                      self.data.day_arr[idx[2]] + ' ' + 
                      week + ' ' +
                      self.data.h_arr[idx[3]] + ':' +
                      self.data.minu_arr[idx[4]]
        })
    },
    timeH: function () {
        var self = this;
        self.setData({
            time: false,
            time_str: '请选择选择预约时间',
            color_o: 'color: #9fa0a0'
        })
        console.log('h')
    },
    timeS: function () {
        var self = this;
        self.setData({
            time: false
        })
    },
    imgUpload: function () {
        var self = this;

        wx.chooseImage({
            count: 4,
            sizeType: 'original',//原图
            // sizeType: 'compressed',//压缩图
            success: function (res) {

                        console.log(res)
                wx.saveFile({
                    tempFilePath: res.tempFilePaths[0]
                })
                wx.getSavedFileList({
                    success: function(res){

                        console.log(res.fileList)
                        self.setData({
                            img_src: res.fileList[0].filePath
                        })
                    },
                    fail: function (){
                        console.log('f')
                    }
                })
            },
            fail: function (res) {
                console.log(res)
            }
        })
    },

})