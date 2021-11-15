const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    link_msg:"连接接收器",
    modelTrain:"",
    fall_detect:"",
    pre_data:"",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  breathTest_btn(e){
    var isconnected = app.globalData.isconnected
    isconnected = true
    if(isconnected){
      wx.navigateTo({
        url: '../breathTest/breath_test',
      })
    }else{
      wx.showToast({
        title: '请先连接服务器！',
        icon:'none'
      })
      setTimeout(() => {
        wx.switchTab({
          url: '../setting/setting',
        })
      }, 1500);
    }
  },

  pre_data_btn(e){
    wx.navigateTo({
      url: '../pre_data/pre_data',
    })
  },
  activity_data_collect(e){
    wx.navigateTo({
      url: '../activityDataCollect/activityDataCollect',
    })
  },
  activity_model_train(e){
    wx.navigateTo({
      url: '../activityModelTrain/activityModelTrain',
    })
  },

  activity_model_test(e){
    wx.navigateTo({
      url: '../activityModelTest/activityModelTest',
    })
  },
  btn_connect(e){
    wx.showLoading({
      title: '正在连接',
    })
    const HOST = app.globalData.HOST
    console.log(HOST + '/connect_rx')
    wx.request({
      url: HOST + '/connect_rx',
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },success:res=>{
        console.log(res)
        wx.hideLoading({})
        if(res.data.code == 1){
          var that = this
          that.setData({
            link_msg:"连接接收器"
          })
          app.globalData.isconnected = true
          wx.showToast({
            title: '连接成功！',
            icon:'none'
          })
        }else{
          app.globalData.isconnected = false
          wx.showToast({
            title: '连接失败！',
            icon:'none'
          })
        }
      },fail(e){
        wx.hideLoading({})
        app.globalData.isconnected = false
        wx.showToast({
          title: '连接失败！',
          icon:'none'
        })
      }
    })
  },

  getstates(){
    wx.stopPullDownRefresh({})
    const HOST = app.globalData.HOST
    console.log(HOST + '/getstates')
    wx.request({
      url: HOST + '/getstates',
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },success:res=>{
        wx.hideLoading({})
        console.log(res)
        if(res.data.code == 1){
          if(res.data.modelTrain==2){
            wx.showToast({
              title: '有模型训练正在进行中，请勿进行其他操作',
              icon:'none'
            })
          }
          if(res.data.fall_detect==2){
            wx.showToast({
              title: '有实时监测进行中，请勿进行其他操作',
              icon:'none'
            })
          }
          if(res.data.pre_data==2){
            wx.showToast({
              title: '有数据预处理正在进行中，请勿进行其他操作',
              icon:'none'
            })
          }
        }else{
          wx.showToast({
            title: '获取状态码失败！',
            icon:'none'
          })
        }
      },fail(e){
        wx.hideLoading({})
        wx.showToast({
          title: '获取状态码失败！',
          icon:'none'
        })
      }
    })
  },

  getSocket(){
    wx.stopPullDownRefresh({})
    var that = this
    //wx.showLoading({})
    const HOST = app.globalData.HOST
    console.log(HOST + '/get_socket')
    wx.request({
      url: HOST + '/get_socket',
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },success:res=>{
        wx.hideLoading({})
        console.log(res)
      },fail(e){
        wx.hideLoading({})
        wx.showToast({
          title: 'socket未连接！',
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
    const readyState=app.globalData.localSocket.readyState
    //console.log(readyState)
    if(readyState!=1){
      this.getSocket();
    }
    this.getstates();
    
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