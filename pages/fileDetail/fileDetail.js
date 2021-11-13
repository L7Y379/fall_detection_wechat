// pages/fileDetail/fileDetail.js
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    contentList:[
    ],
    hiddenmodalput:true,
    newFileName:"",
    current_path:''
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
    console.log(Info)
    wx.setNavigationBarTitle({
      title:Info.name
    })
    this.getFileDetail(Info.path)
  },


  getFileDetail(path){
    var that = this
    const HOST = app.globalData.HOST
    wx.showLoading({})
    console.log(HOST + '/filemanagement/getfileinfo')
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
            contentList:res.data.child,
            current_path:res.data.current_path
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

  fileDetail(e){
    var fileInfo = this.data.contentList[e.currentTarget.dataset.index]
    if(fileInfo.folder_num){
      wx.navigateTo({
        url: '../fileDetail/fileDetail?Info=' + JSON.stringify(fileInfo)
      })
    }else{
      wx.navigateTo({
        url: '../datList/datList?Info=' + JSON.stringify(fileInfo)
      })
    }
  },

  deleteFile(e){
    var index = e.currentTarget.dataset.index
    var contentList = this.data.contentList
    var that = this
    wx.showModal({
      content:'确定要删除吗？',
      success:res=>{
        if(res.confirm){
          wx.showLoading({})
          const HOST = app.globalData.HOST
          console.log(HOST + '/filemanagement/deletedir')
        wx.request({
          url: HOST + '/filemanagement/deletedir',
          method:"GET",
          data:{
            path:contentList[index].path
          },header:{
            'content-type':'application/x-www-form-urlencoded'
          },success:res=>{
            wx.hideLoading({})
            console.log(res)
            if(res.data.code == 1){
              contentList.splice(index,1)
              that.setData({
                contentList:contentList
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
        }
      }
    })
  },

  add_content(e){
    this.setData({
      hiddenmodalput:false,
      newFileName:''
    })
  },

  filename_ipt_cancel(e){
    this.setData({
      hiddenmodalput:true,
      newFileName:''
    })
  },

  //提交创建文件
  filename_ipt_confirm(e){
    this.setData({
      hiddenmodalput:true
    })
    var that = this
    var newFileName = this.data.newFileName
    if(newFileName!=""){
      var path = that.data.current_path
      wx.showLoading({})
      const HOST = app.globalData.HOST
      console.log(HOST + '/filemanagement/createdir')
      wx.request({
        url: HOST + '/filemanagement/createdir',
        method:"GET",
        header:{
          'content-type':'application/x-www-form-urlencoded'
        },data:{
          parent_path:path,
          filename:newFileName
        },
        success:res=>{
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
    }else{
      wx.showToast({
        title: '请输入有效数据！',
        icon:'none'
      })
    }
  },
  filename_ipt(e){
    console.log(e.detail.value)
    this.setData({
      newFileName:e.detail.value
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