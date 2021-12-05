// pages/datList/datList.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    SystemInfo:{},
    datList:[],
    is_select_all:false,
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
          pixelRatio: 750 / result.windowWidth,
        })
      },
    })
    var Info = JSON.parse(options.Info)
    wx.setNavigationBarTitle({
      title:Info.name
    })
    this.getDatList(Info.path)
  },

  change_selecte_state(e){
    var index = e.currentTarget.dataset.index
    var datList = this.data.datList
    datList[index].selected = !datList[index].selected
    this.setData({
      datList:datList
    })
  },

  select_all_btn(e){
    var datList = this.data.datList
    var is_select_all = this.data.is_select_all
    if(is_select_all){
      datList.forEach(element => {
        element.selected = false
      });
    }else{
      datList.forEach(element => {
        element.selected = true
      });
    }
    this.setData({
      datList:datList,
      is_select_all : !is_select_all
    })
  },


  getDatList(path){
    var that = this
    wx.showLoading({})
    const HOST = app.globalData.HOST
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
          var child = res.data.child
          child.forEach(element => {
            element['selected'] = false
          });
          that.setData({
            datList:child,
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

  deleteFilesBtn(e){
    var datList = this.data.datList
    var paths = []
    datList.forEach(element => {
      if(element.selected){
        paths.push(element.path)
      }
    });
    var that = this
    console.log(paths)
    //wx.showLoading({})
    const HOST = app.globalData.HOST
    console.log(HOST + '/filemanagement/deletefile')
    wx.showModal({
      content:'确定要删除文件吗？',
      success:res=>{
        if(res.confirm){
        wx.request({
          url: HOST + '/filemanagement/deletefile',
          method:"GET",
          header:{
            'content-type':'application/x-www-form-urlencoded'
          },data:{
            paths:JSON.stringify({paths:paths})
          },success:res=>{
            wx.hideLoading({})
            console.log(res)
            if(res.data.code == 1){
              var newdatList = []
              datList.forEach(element => {
                if(element.selected==false){
                  newdatList.push(element)
                }
              });
              that.setData({
                datList:newdatList,
                is_select_all:false
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