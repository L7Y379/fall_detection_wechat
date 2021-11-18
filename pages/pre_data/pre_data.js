// pages/modelTrain/modelTrain.js
const app = getApp()

var intt;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    safeArea:{},
    storagePath:{
      name:"点击选择",
      path:''
    },
    SystemInfo:{},
    //pixelRatio:1,
    model_name:"",
    dirname:"",
    type: 0,
    array: [],
    array1:[],
    treeData:{text: "data_dir", path: "data_model_dir/data_dir"},
    console_msg:[],
    tip:'',
    tip2:'',
    len_now:0,
    len_all:0,
    dirPath_pre:'',
    data_path:"",
    minute: 0,
    second: 0
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
          safeArea:result.safeArea,
          pixelRatio: 750 / result.windowWidth,
          screenHeight:result.screenHeight,
          windowHeight:result.windowHeight,
          //treeData: app.globalData.treeData.nodes[1]
        })
      }
    })
    app.globalData.train_data_list = []

    //接收服务器消息
    app.globalData.localSocket.onMessage(function(res) {
      // console.log('收到服务器内容', res)
      res = JSON.parse(res.data)
      console.log(res)
      if(res.pre_down==1){
        // var console_msg = that.data.console_msg
        // console_msg.push(res.msg)
        clearInterval(intt);
        intt=null
        that.setData({
          // console_msg:console_msg,
          // progress:res.progress,
          // itemNum:res.item_num
          tip:"数据已预处理完成,"+"处理后数据保存在文件夹"+res.dirPath_pre+"中"
        })
      }
      if(res.pre_down==0){
        that.setData({
          len_all:res.len_all,
          len_now:res.len_now,
          dirPath_pre:res.dirPath_pre,
          data_path:res.data_path,
          tip:"数据正在预处理,"+"处理后数据保存在文件夹"+res.dirPath_pre+"中"
        })
      }
    })
  },
  //停止
  Reset: function () {
    var that = this
    clearInterval(intt);
    that.setData({
      minute: 0,
      second: 0,
    })
  },
  timer: function () {
    var that = this;
    that.setData({
      second: that.data.second + 1
    })
    if (that.data.second >= 60) {
      that.setData({
        second: 0,
        minute: that.data.minute + 1
      })
    }

  },
  bindPickerChange: function (e) {
    this.setData({
      type: e.detail.value
    })
  },
  model_name_ipt(e){
    this.setData({
      model_name:e.detail.value.replace(/\s*/g,"")
    })
  },
  dirname_ipt(e){
    this.setData({
      dirname:e.detail.value.replace(/\s*/g,"")
    })
  },
  train_data_ratio_ipt(e){
    this.setData({
      train_data_ratio:e.detail.value.replace(/\s*/g,"")
    })
  },

  train_data_classNum_ipt(e){
    this.setData({
      classNum:e.detail.value.replace(/\s*/g,"")
    })
  },

  getFileTree(){
    var that = this
    const HOST=app.globalData.HOST
    console.log(HOST + '/filemanagement/tree')
    wx.request({
      timeout:5000,
      url: HOST + '/filemanagement/tree',
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },success:res=>{
        //wx.hideLoading({})
        console.log(res)
        if(res.data.code == 1){
          // that.globalData.treeData=res.data.data_dir
          // that.globalData.ModeltreeList = res.data.data_model
          //that.data.treeData=res.data.data_dir
          this.data.array1=res.data.data_root
          //this.data.array1.push(555)
          this.setData({
            array:this.data.array1,
          })
          console.log(this.data.array)
          console.log(this.data.array1)
        }else{

        }
      },fail(e){

      }
    })
  },

  getstates(){
    wx.stopPullDownRefresh({})
    const HOST = app.globalData.HOST
    console.log(HOST + '/getstates')
    wx.request({
      timeout:5000,
      url: HOST + '/getstates',
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },success:res=>{
        //wx.hideLoading({})
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
        //wx.hideLoading({})
        wx.showToast({
          title: '获取状态码失败！',
          icon:'none'
        })
      }
    })
  },
  startpre_btn(e){
    var that = this
    var type = this.data.type
    var dirname=this.data.array[type]

    wx.showModal({
      content:'确定要预处理文件夹'+dirname+'的数据吗',
      success:res=>{
        if(res.confirm){
        var data_list = app.globalData.train_data_list
        const HOST = app.globalData.HOST
        
        console.log(HOST + '/pre_data')
        wx.request({
          url: HOST + '/pre_data',
          method:"GET",
          header:{
            'content-type':'application/x-www-form-urlencoded'
          },data:{
            data_path:dirname
          },success:res=>{
            
            console.log(res)
            that.setData({
              tip:res.data.msg
            })
            if(res.data.code==1){
              clearInterval(intt);
              //时间重置
              that.setData({
                hour: 0,
                minute: 0,
                second: 0,
                millisecond: 0,
              })
              intt = setInterval(function () { that.timer() }, 1000);
              that.setData({
                tip2:"处理后的数据保存在文件夹"+dirname+"_pre"+"中"
              })
            }
          },fail(e){
            clearInterval(intt);
            that.setData({
              
              tip:'预处理操作失败！'
            })
          }
        })
      }
    }
    })
  },
  tapItem: function (e) {
    console.log('index接收到的path: ' + e.detail.path);
    console.log(e.detail.name)
    this.setData({
      storagePath:e.detail,
      showMask:false
    })
  },

  stopTrain_btn(e){
    var that =this
    clearInterval(intt);
    const HOST = app.globalData.HOST
    console.log(HOST + '/train_stop')
    wx.request({
      url: HOST + '/train_stop',
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },success:res=>{
        console.log(res)
        if(res.data.code==1){
          that.setData({
            tip:res.data.msg
          })
        }else{
          that.setData({
            tip:res.data.msg
          })
        }
      },fail(e){
        that.setData({
          tip:'结束操作失败！'
        })
      }
    })
  },


  showMaskBtn(e){
    this.setData({
      showMask:true
    })
    console.log(this.data.treeData)

    //this.getFileTree()
  },
  hiddenMaskBtn(e){
    this.setData({
      showMask:false
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
    this.getFileTree()
    this.getstates()
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