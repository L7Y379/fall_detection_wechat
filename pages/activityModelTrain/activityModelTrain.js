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
    pixelRatio:1,
    model_name:"",
    model_name2:"",
    dirname:"",
    treeData:{},
    type: 0,
    len_dir:0,
    epoch:0,
    epochs:0,
    acc:0,
    model_path:"",
    dirName:"",
    array: [],
    array1:[],
    console_msg:[],
    tip:'',
    tip1:'',
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
          // treeData: app.globalData.treeData.nodes[1]
        })
      }
    })
    app.globalData.train_data_list = []

    //接收服务器消息
    app.globalData.localSocket.onMessage(function(res) {
      // console.log('收到服务器内容', res)
      res = JSON.parse(res.data)
      console.log(res)
      if(res.code==2 && res.train_down==0){
        that.setData({
          len_dir:res.len_dir,
          epoch:res.epoch,
          epochs:res.epochs,
          acc:res.acc,
          model_name2:res.model_name,
          dirName:res.dirName,
          tip1:"正在训练中,"+"训练文件夹："+res.dirName+"保存模型名："+res.model_name
        })
      }
      if(res.code==2 && res.train_down==1 && res.model_on==1){
        clearInterval(intt);
        intt=null
        that.setData({
          len_dir:res.len_dir,
          epoch:res.epoch,
          epochs:res.epochs,
          acc:res.acc,
          model_name2:res.model_name,
          dirName:res.dirName,
          tip1:"已停止训练，模型保存成功。"+"训练文件夹："+res.dirName+"保存模型名："+res.model_name
        })
      }
      if(res.code==2 && res.train_down==1 && res.model_on==0){
        clearInterval(intt);
        intt=null
        that.setData({
          len_dir:res.len_dir,
          epoch:res.epoch,
          epochs:res.epochs,
          acc:res.acc,
          model_name2:res.model_name,
          dirName:res.dirName,
          tip1:"已停止训练，模型保存失败"
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

  startTrain_btn(e){
    var that = this
    var model_name = this.data.model_name
    var type = this.data.type
    var dirname=this.data.array[type]
    if(model_name.length==0 || dirname.length == 0){
      wx.showToast({
        title: '请输入有效数据！',
        icon:'none'
      })
      return
    }
    // if(dirname.conta == 0){
    //   wx.showToast({
    //     title: '请输入有效数据！',
    //     icon:'none'
    //   })
    //   return
    // }
    // if(dirname.indexOf("pre")<0){

    //   wx.showToast({
    //     title: '请输入正确文件夹名！',
    //     icon:'none'
    //   })
    //   return
    
    // }
    wx.showModal({
      content:'确定要训练文件夹'+dirname+'的数据吗?'+"模型名保存为"+model_name,
      success:res=>{
        if(res.confirm){
        var data_list = app.globalData.train_data_list
        const HOST = app.globalData.HOST
        console.log(HOST + '/train')
        wx.request({
          url: HOST + '/train',
          method:"GET",
          header:{
            'content-type':'application/x-www-form-urlencoded'
          },data:{
            model_name:model_name,
            dirname:dirname
          },success:res=>{
            console.log(res)
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
                tip:res.data.msg
              })
            }else{
              that.setData({
                tip:res.data.msg
              })
            }

          },fail(e){
            that.setData({
              tip:'开始训练操作失败！'
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
    wx.showModal({
      content:'确定要停止训练吗？必要的训练时间能使模型更稳定',
      success:res=>{
        if(res.confirm){
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
                tip:res.data.msg,
                tip1:"训练文件夹："+this.data.dirName+"模型名："+this.data.model_name2
              })
            }else{
              that.setData({
                tip:res.data.msg,
                tip1:""
              })
            }
          },fail(e){
            that.setData({
              tip:'结束操作失败！'
            })
          }
        })
        }
      }
    })
  },


  showMaskBtn(e){
    this.setData({
      showMask:true
    })
  },
  hiddenMaskBtn(e){
    this.setData({
      showMask:false
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      type: e.detail.value
    })
  },

  getFileTree(){
    var that = this
    const HOST=app.globalData.HOST
    console.log(HOST + '/filemanagement/tree')
    wx.request({
      url: HOST + '/filemanagement/tree',
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },success:res=>{
        wx.hideLoading({})
        console.log(res)
        if(res.data.code == 1){
          // that.globalData.treeData=res.data.data_dir
          // that.globalData.ModeltreeList = res.data.data_model
          //that.data.treeData=res.data.data_dir
          this.data.array1=res.data.data_pre
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