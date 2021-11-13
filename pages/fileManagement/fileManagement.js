// pages/fileManagement/fileManagement.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput:true,
    newFileName:"",
    if_getFileInfo:false,
    myFileInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  fileDetail(e){
    var fileInfo = this.data.myFileInfo.dataset_list[e.currentTarget.dataset.index]
    console.log(fileInfo)
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

  modelList_btn(e){
    var fileInfo = this.data.myFileInfo.model_list[e.currentTarget.dataset.index]
    wx.navigateTo({
      url: '../modelList/modelList?Info=' + JSON.stringify(fileInfo)
    })
  },

  deleteFile(e){
    var contentType = e.currentTarget.dataset.contenttype
    var index = e.currentTarget.dataset.index
    var that = this
    if(contentType==0){
      var fileInfo = this.data.myFileInfo.dataset_list[index]
    }else{
      var fileInfo = this.data.myFileInfo.model_list[index]
    }
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
            path:fileInfo.path
          },header:{
            'content-type':'application/x-www-form-urlencoded'
          },success:res=>{
            wx.hideLoading({})
            console.log(res)
            var newInfo = that.data.myFileInfo
            if(res.data.code == 1){
              if(contentType==0){
                newInfo.dataset_list.splice(index,1)
              }else{
                newInfo.model_list.splice(index,1)
              }
              that.setData({
                myFileInfo:newInfo
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
      }}
    })
  },

  deleteFile2(e){
    var contentType = e.currentTarget.dataset.contenttype
    var index = e.currentTarget.dataset.index
    var that = this
    var paths = []
    if(contentType==0){
      var fileInfo = this.data.myFileInfo.dataset_list[index]
    }else{
      var fileInfo = this.data.myFileInfo.model_list[index]
    }
    paths.push(fileInfo.path)
    wx.showModal({
      content:'确定要删除吗？',
      success:res=>{
        if(res.confirm){
        wx.showLoading({})
        const HOST = app.globalData.HOST
        console.log(HOST + '/filemanagement/deletefile')
        wx.request({
          url: HOST + '/filemanagement/deletefile',
          method:"GET",
          data:{
            paths:JSON.stringify({paths:paths})
          },header:{
            'content-type':'application/x-www-form-urlencoded'
          },success:res=>{
            wx.hideLoading({})
            console.log(res)
            var newInfo = that.data.myFileInfo
            if(res.data.code == 1){
              if(contentType==0){
                newInfo.dataset_list.splice(index,1)
              }else{
                newInfo.model_list.splice(index,1)
              }
              that.setData({
                myFileInfo:newInfo
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
      }}
    })
  },

  add_content(e){
    this.setData({
      hiddenmodalput:false,
      newFileName:'',
      newfiletype:e.currentTarget.dataset.newfiletype
    })
  },
  filename_ipt_cancel(e){
    this.setData({
      hiddenmodalput:true,
      newFileName:''
    })
  },

  //提交文件夹创建请求
  filename_ipt_confirm(e){
    this.setData({
      hiddenmodalput:true
    })
    var that = this
    var newFileName = this.data.newFileName
    if(newFileName!=""){
      var newfiletype = this.data.newfiletype
      var path = ""
      if(newfiletype==0){
        path = this.data.myFileInfo.dataset_path
      }else{
        path = this.data.myFileInfo.model_path
      }
      wx.showLoading({})
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
            var newInfo = that.data.myFileInfo
            if(newfiletype==0){
              newInfo.dataset_list = res.data.child
            }else{
              newInfo.model_list = res.data.child
            }
            that.setData({
              myFileInfo:newInfo
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
    this.setData({
      newFileName:e.detail.value.replace(/\s*/g,"")
    })
  },

  getMyFileInfo(){
    wx.stopPullDownRefresh({})
    var that = this
    wx.showLoading({})
    const HOST = app.globalData.HOST
    console.log(HOST + '/getfiles')
    wx.request({
      url: HOST + '/getfiles',
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },success:res=>{
        wx.hideLoading({})
        console.log(res)
        if(res.data.code == 1){
          that.setData({
            myFileInfo:res.data,
            if_getFileInfo:true
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
    // var if_getFileInfo = this.data.if_getFileInfo
    // console.log(if_getFileInfo)
    // if(!if_getFileInfo){
      
    // }
    this.getMyFileInfo()
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
    this.getMyFileInfo()
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