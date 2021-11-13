// pages/datList/datList.js
const app = getApp()
const HOST = app.globalData.HOST
Page({

  /**
   * 页面的初始数据
   */
  data: {
    SystemInfo:{},
    datList:[],
    is_select_all:false,
    current_path:'',
    join_data_type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var Info = JSON.parse(options.Info)
    console.log(Info)
    wx.setNavigationBarTitle({
      title: Info.name,
    })
    wx.getSystemInfo({
      success: (result) => {
        that.setData({
          SystemInfo:result,
          pixelRatio: 750 / result.windowWidth,
          join_data_type:app.globalData.join_data_type
        })
      },
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

  add_to_train_btn(e){
    var datList = this.data.datList
    var selectDatList = []
    var contentName = this.data.current_path
    datList.forEach(element => {
      if(element.selected){
        selectDatList.push(element.name)
      }
    });
    var train_data_list = app.globalData.join_data_type==0?app.globalData.train_data_list:app.globalData.test_data_list
    var check_exist = false
    train_data_list.forEach(element => {
      if(element.name==contentName){
        element.data = selectDatList
        check_exist = true
      }
    });
    if(!check_exist){
      train_data_list.push({
        name:contentName,
        data:selectDatList
      })
    }
    if(app.globalData.join_data_type==0){
      app.globalData.train_data_list = train_data_list
    }else{
      app.globalData.test_data_list = train_data_list
    }
    console.log(app.globalData.train_data_list)
    wx.showToast({
      title: '加入成功！',
      icon:'none'
    })
  },


  getDatList(path){
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
          var child = res.data.child
          child.forEach(element => {
            element['selected'] = false
          });
          var train_data_list = app.globalData.join_data_type==0?app.globalData.train_data_list:app.globalData.test_data_list
          train_data_list.forEach(element => {
            if(element.name==path){
              element.data.forEach(element1 => {
                child.forEach(element2 => {
                  if(element1 == element2.name){
                    element2.selected = true
                  }
                });
              });
            }
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