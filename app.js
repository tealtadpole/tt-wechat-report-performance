// load the performance utils
const perf = require('./utils/performance')
const perfConfig = require('./utils/performanceConfig')
const config = require('./config')

App({
  onShow() {
    // enable performance monitoring in the App.onShow( ) function
    perf.enablePerformanceMonitoring(this)
  },
  onHide() {
    // disable performance monitoring in the App.onHide( ) function
    perf.disablePerformanceMonitoring(this)
  },

  onLaunch() {
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
  },
  request({
    url,
    method = 'GET',
    data = null
  }) {
    return new Promise((resolve, reject) => {
      const timeBeforeApiCall = Date.now()
      wx.request({
        url,
        method,
        data,
        success: (res) => resolve(res.data),
        fail: (err) => reject(err),
        complete: () => {
          const timeAfterApiCall = Date.now()
          const duration = timeAfterApiCall - timeBeforeApiCall
          perf.reportApiPerformance({
            code: perfConfig.code[config.env].NETWORK_APICALL,
            duration,
            url
          })
        }
      })
    })
  },
  globalData: {
    userInfo: null,
    performanceObserver: null
  }
})
