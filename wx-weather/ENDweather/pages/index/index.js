//tianqi.js
//获取应用实例
var utils = require( '../../utils/util.js' )
var app = getApp()
var that
var city = ''
var startAds = ''
var endAds = ''
Page( {
    data: {
        y_city: " ",
        rs: [],
        rs_tj: [],
        rs_tj_jq: []
    },
    //事件处理函数
    bindViewTap: function() {
        // wx.navigateTo保留当前页面，并调到新的页面
        wx.navigateTo( {
            url: '../logs/logs'
        })
    },
    bindblurKey: function( e ) {
        switch( e.currentTarget.id ) {
            case 'tjId':
                city = e.detail.value               
                break
            default:
                break
        }
        //收起键盘
        wx.hideKeyboard()
    },
    findTj: function( event ) {
        var getRsUrl = 'http://api.map.baidu.com/telematics/v3/weather?location=' + city + '&output=json&ak=422ebb878de3dbdea9a248045d2620dc'
        wx.request( {
            url: getRsUrl,
            data: {},
            success: function( rs ) {
                var _tmpRs = []
                var _tmpTjRs = []
                var _html = ''
                if( typeof ( rs.data.results ) !== 'undefined' ) {
                    var d = rs.data.results[ 0 ].index
                    var _tj = rs.data.results[ 0 ].weather_data
                    for( var oo in _tj ) {
                        if( typeof ( _tj[ oo ].date ) == 'undefined' ) {
                            break;
                        }
                        var _tmpStr = '{"date":"' + _tj[ oo ].date + '","dayPictureUrl":"' + _tj[ oo ].dayPictureUrl + '","nightPictureUrl":"' + _tj[ oo ].nightPictureUrl + '","weather":"' + _tj[ oo ].weather + '","wind":"' + _tj[ oo ].wind + '","temperature":"' + _tj[ oo ].temperature + '"}'
                        _tmpTjRs[ oo ] = JSON.parse(_tmpStr)
                    }
                    console.log( _tmpTjRs )
                    that.setData( { rs_tj: _tmpTjRs })
                    that.setData({ rs_tj_jq: _tmpTjRs.slice(1,4) })

                    for( var o in d ) {
                        _html = '【' + ( parseInt( o ) + 1 ) + '、 ' + d[ o ].title + ' ' + d[ o ].zs + ' ' + d[ o ].tipt + ' ' + d[ o ].des + '】' + "\n\r"
                        _tmpRs[ o ] = _html
                    }
                    that.setData( { rs: _tmpRs })
                } else {
                    that.setData( { ads_rs: '未查询到结果' })
                }
                
            
            },
            fail: function( rs ) {

            }
        })

    },
    callbackLocation: function( rs ) {
        this.setData( { ads_location: "\n\r坐标：" + rs.latitude + ' ' + rs.longitude })
        wx.request( {
            url: 'http://api.map.baidu.com/geocoder/v2/?output=json&ak=422ebb878de3dbdea9a248045d2620dc&location=' + rs.latitude + ',' + rs.longitude,
            data: {},
            success: function( rs ) {
                console.log( rs )
                that.setData( { ads_location_name: rs.data.result.addressComponent.city })
                city = rs.data.result.addressComponent.city;
                that.findTj( '' );
                console.log(city) 
                  that.setData({ y_city: city });
            },
            fail: function( rs ) {

            }
        })
    },
    onLoad: function() {
        that = this
        utils.getLoc( this.callbackLocation )
    }

})

