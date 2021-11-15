// app.js
App({
  onLaunch() {
    if(wx.getStorageSync('setting_info')==""){
      var setting_info = {
        //'server_ip':"192.168.1.117",
        'server_ip':"192.168.31.173",
        'server_port':8888,
        'Rx_ip': "211.83.111.213",
        'Rx_port':6662,
        'Rx_username':"rtlab420",
        'Rx_password':"root",
        'Tx_antenna_num':31,
        'Rx_antenna_num':3,
        'frequency':100,
        'frequenc':101
      }
      wx.setStorageSync('setting_info', setting_info)
    }
    //console.log(1)
    this.initSocket();
    //this.getFileTree()

    //this.getSocket();
  },
  globalData: {
    isconnected:false,
    HOST:'http://192.168.1.117:8888/',
    //HOST:'http://192.168.31.173:8888/',
    train_data_list:[],
    test_data_list:[],
    join_data_type:0,//加入训练还是测试，0是训练，1是测试
    localSocket: {},
    callback: function() {},
    treeData:{},
    ModeltreeList:{}
  },


  initSocket() {
    let that = this
    that.globalData.localSocket = wx.connectSocket({
      url: 'ws://127.0.0.1:8887',
    })
    that.globalData.localSocket.onOpen(function(res) {
      console.log('WebSocket连接已打开！readyState=' + that.globalData.localSocket.readyState)
      console.log(res)
    })
    that.globalData.localSocket.onError(function(res) {
      console.log('readyState=' + that.globalData.localSocket.readyState)
    })
    that.globalData.localSocket.onClose(function(res) {
      console.log('WebSocket连接已关闭！readyState=' + that.globalData.localSocket.readyState)
      that.initSocket()
    })
    //console.log(2)
    that.globalData.localSocket.onMessage(function(res) {
      //console.log(res)
      //console.log(1)
      that.globalData.callback(res)
    })
    //console.log(3)
  },
  //统一发送消息，可以在其他页面调用此方法发送消息
  sendSocketMessage: function(msg) {
    let that = this
    return new Promise((resolve, reject) => {
      if (this.globalData.localSocket.readyState === 1) {
        console.log('发送消息', msg)
        this.globalData.localSocket.send({
          data: msg,
          success: function(res) {
            resolve(res)
          },
          fail: function(e) {
            reject(e)
          }
        })
      } else {
        console.log('已断开')
      }
    })
  },


  getFileTree(){
    var that = this
    console.log(that.globalData.HOST + '/filemanagement/tree')
    wx.request({
      url: that.globalData.HOST + '/filemanagement/tree',
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },success:res=>{
        wx.hideLoading({})
        console.log(res)
        if(res.data.code == 1){
          that.globalData.treeData=res.data.data_dir
          that.globalData.ModeltreeList = res.data.data_model
        }else{

        }
      },fail(e){

      }
    })
  },

  fomatFloat(value, n) {
    var f = Math.round(value*Math.pow(10,n))/Math.pow(10,n);
    var s = f.toString();
    var rs = s.indexOf('.');   
    if (rs < 0) {     
        s += '.';   
    } 
    for(var i = s.length - s.indexOf('.'); i <= n; i++){
      s += "0";
    }
    return s;
  }

})
