/**
 * Path  : pages/utils/util.js
 * Author: jiuwanli666
 * Date  : 2019-03-04
 */
/**
 * @options 详见wx.request()参数
 */
module.exports = (options) => {
    return new Promise((resolve,reject) => {
        options = Object.assign(options, {
            success(res) {
                if (res.statusCode === 200) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            },
            fail: reject,
        });
        wx.request(options);
    });
};
