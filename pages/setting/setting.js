const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    server_ip:"192.168.1.117",
    server_port:"8888",
    Rx_ip:"211.83.111.213",
    Rx_port:"6662",
    Rx_username:"rtlab420",
    Rx_password:"root",
    Tx_antenna_num:3,
    Rx_antenna_num:3,
    frequency:100,
    setting_info:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    wx.getStorage({
      key:'setting_info',
      success:res=>{
        console.log(res.data)
        that.setData({
          setting_info:res.data,
          server_ip:res.data['server_ip'],
          server_port:res.data['server_port'],
          Rx_ip:res.data['Rx_ip'],
          Rx_port:res.data['Rx_port'],
          Rx_username:res.data['Rx_username'],
          Rx_password:res.data['Rx_password'],
          Tx_antenna_num:res.data['Tx_antenna_num'],
          Rx_antenna_num:res.data['Rx_antenna_num'],
          frequency:res.data['frequency']
        })
      }
    })
  },

  server_ip_ipt(e){
    this.setData({
      server_ip:e.detail.value
    })
    var setting_info = this.data.setting_info
    setting_info['server_ip'] = e.detail.value
    wx.setStorage({
      key:'setting_info',
      data: setting_info
    })
  },
  server_port_ipt(e){
    this.setData({
      server_port:e.detail.value
    })
    var setting_info = this.data.setting_info
    setting_info['server_port'] = e.detail.value
    wx.setStorage({
      key:'setting_info',
      data: setting_info
    })
  },
  Rx_ip_ipt(e){
    this.setData({
      Rx_ip:e.detail.value
    })
    var setting_info = this.data.setting_info
    setting_info['Rx_ip'] = e.detail.value
    wx.setStorage({
      key:'setting_info',
      data: setting_info
    })
  },
  Rx_port_ipt(e){
    this.setData({
      Rx_port:e.detail.value
    })
    var setting_info = this.data.setting_info
    setting_info['Rx_port'] = e.detail.value
    wx.setStorage({
      key:'setting_info',
      data: setting_info
    })
  },
  Rx_username_ipt(e){
    this.setData({
      Rx_username:e.detail.value
    })
    var setting_info = this.data.setting_info
    setting_info['Rx_username'] = e.detail.value
    wx.setStorage({
      key:'setting_info',
      data: setting_info
    })
  },
  Rx_password_ipt(e){
    this.setData({
      Rx_password:e.detail.value
    })
    var setting_info = this.data.setting_info
    setting_info['Rx_password'] = e.detail.value
    wx.setStorage({
      key:'setting_info',
      data: setting_info
    })
  },
  Tx_antenna_num_ipt(e){
    this.setData({
      Tx_antenna_num:e.detail.value
    })
    var setting_info = this.data.setting_info
    setting_info['Tx_antenna_num'] = e.detail.value
    wx.setStorage({
      key:'setting_info',
      data: setting_info
    })
  },
  Rx_antenna_num_ipt(e){
    this.setData({
      Rx_antenna_num:e.detail.value
    })
    var setting_info = this.data.setting_info
    setting_info['Rx_antenna_num'] = e.detail.value
    wx.setStorage({
      key:'setting_info',
      data: setting_info
    })
  },
  frequency_ipt(e){
    this.setData({
      frequency:e.detail.value
    })
    var setting_info = this.data.setting_info
    setting_info['frequency'] = e.detail.value
    wx.setStorage({
      key:'setting_info',
      data: setting_info
    })
  },

  btn_connect(e){
    
    var setting_info = this.data.setting_info
    var server_ip = setting_info['server_ip']
    var server_port =  setting_info['server_port']
    var Rx_ip =  setting_info['Rx_ip']
    var Rx_port =  setting_info['Rx_port']
    var Rx_username =  setting_info['Rx_username']
    var Rx_password =  setting_info['Rx_password']
    var Tx_antenna_num =  setting_info['Tx_antenna_num']
    var Rx_antenna_num =  setting_info['Rx_antenna_num']
    var frequency = setting_info['frequency']
    var ServerHost = "http://" + server_ip + ":" + server_port
    app.globalData.HOST = ServerHost
    console.log(ServerHost)
    console.log(app.globalData.HOST)
    wx.showToast({
      title: '已保存修改！',
      icon:'none'
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