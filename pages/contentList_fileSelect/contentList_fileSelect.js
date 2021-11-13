// pages/fileDetail/fileDetail.js
const app = getApp()
const HOST = app.globalData.HOST
Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentList:{},
    childContent_isData:true
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
    var Info = JSON.parse(options.Info)
    console.log()
    if(Info.first_enter==1){
      this.getMyFileInfo()
      wx.setNavigationBarTitle({
        title:"Dataset"
      })
    }else{
      wx.setNavigationBarTitle({
        title:Info.name
      })
      this.getFileDetail(Info.path)
    }
  },

  fileDetail(e){
    var dataset_list = this.data.contentList
    var index = e.currentTarget.dataset.index
    if(dataset_list[index].folder_num==0){
      wx.navigateTo({
        url: '../fileSelect/fileSelect?Info=' + JSON.stringify(dataset_list[index])
      })
    }else{
      wx.navigateTo({
        url: '../contentList_fileSelect/contentList_fileSelect?Info=' + JSON.stringify(dataset_list[index])
      })
    }
  },

  getMyFileInfo(){
    var that = this
    wx.showLoading({})
    wx.request({
      url: HOST + '/filemanagement/myfiles',
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },success:res=>{
        wx.hideLoading({})
        console.log(res)
        if(res.data.code == 1){
          that.setData({
            contentList:res.data.dataset_list,
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


  getFileDetail(path){
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
            contentList:res.data.child
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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