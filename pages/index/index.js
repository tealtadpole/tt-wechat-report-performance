// index.js
const app = getApp()

Page({
  data: {
    mockUserData: {},
    hasMockUserData: false,
  },
  onLoad() {
    this.getMockUserData()  
  },
  async getMockUserData(e) {
    const mockUserData = await app.request({
      url: 'https://randomuser.me/api'
    })
    if (mockUserData) {
      this.setData({ 
        mockUserData,
        hasMockUserData: true
      })
    }
  },
})
