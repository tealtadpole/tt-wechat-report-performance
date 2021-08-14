/* --------------------------------------------------------------------------------------
copyrighted by              : tealtadpole.me (2021)
original github repository  : https://github.com/tealtadpole/tt-wechat-report-performance 
website                     : tealtadpole.me
feel free to use it with leaving this note intact 
----------------------------------------------------------------------------------------- */

import perfConfig from './performanceConfig'
const config = require('../config')
const perfCurrentConfig = perfConfig.code[config.env]

const performanceObserverHandler = (entryList) => {
  const entries = entryList.getEntries()
  entries.forEach(entry => {
    const { duration, entryType, name, path } = entry
    switch (entryType){
      case 'navigation':
        if (name === 'appLaunch') {
          wx.reportPerformance(perfCurrentConfig.NAVIGATION_ONLAUNCH, duration, path)
        } else {
          wx.reportPerformance(perfCurrentConfig.NAVIGATION_NAVIGATE, duration, path)
        }
        break
      case 'render':
        wx.reportPerformance(perfCurrentConfig.RENDER, duration, path)
        break
      default: // script
      wx.reportPerformance(perfCurrentConfig.SCRIPT, duration)
        break
    }
    perfConfig.debug ? console.log('PERF debug:', duration, entryType, name, path) : '' ;
  })
}
const enablePerformanceMonitoring = (app) => {
  try {
    const performance = wx.getPerformance()
    const observer = performance.createObserver(performanceObserverHandler)
    observer.observe({ entryTypes: ['render', 'script', 'navigation'] })
    if (app) {
      app.globalData.performanceObserver = observer
    }
  } catch(e) { console.warn(`This client doesn't support performance monitoring`) }
}

const disablePerformanceMonitoring = (app) => {
  app?.globalData.performanceObserver?.disconnect()
}
const reportApiPerformance = ({ code, duration, url }) => {
  
  try {
    if (duration > 0) {
      const cleanUrl= url.indexOf ('?') > -1 ? url.substring(0, url.indexOf('?')) : url
      wx.reportPerformance(code, duration, perfConfig.cleanUrl ? cleanUrl : url)
    }
    perfConfig.debug ? console.log('PERF API debug:', duration, code, url) : '' ;
  } catch(e) { console.log('doesnt support wx.reportPerformance') }
}

module.exports = {
  performanceObserverHandler,
  enablePerformanceMonitoring,
  disablePerformanceMonitoring,
  reportApiPerformance
}