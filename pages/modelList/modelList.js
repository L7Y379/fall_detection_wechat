// pages/modelList/modelList.js
const app = getApp()
const HOST = app.globalData.HOST

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modelList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: (result) => {
        that.setData({
          SystemInfo:result,
          pixelRatio: 750 / result.windowWidth
        })
      },
    })
    console.log(Info)
    var Info = JSON.parse(options.Info)
    wx.setNavigationBarTitle({
      title:Info.name
    })
    this.getModelList(Info.path)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  deleteModel(e){
    wx.showModal({
      content:'确定要删除吗？',
      success:res=>{
        if(res.confirm){
          wx.showToast({
            title: '删除成功！',
            icon:'none'
          })
        }
      }
    })
  },

  getModelList(path){
    var that = this
    wx.showLoading({})
    wx.request({
      url: HOST + '/filemanagement/getfileinfo',
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },data:{
        path:path
      },success:res=>{
        wx.hideLoading({})
        console.log(res)
        if(res.data.code == 1){
          that.setData({
            modelList:res.data.child
          })
        }else{
          wx.showToast({
            title: '发生未知错误！',
            icon:'none'
          })
        }
      },fail(e){
        wx.hideLoading({})
        wx.showToast({
          title: '发生未知错误！',
          icon:'none'
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})