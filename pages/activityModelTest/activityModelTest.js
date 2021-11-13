// pages/activityModelTest/activityModelTest.js
import * as echarts from '../../ec-canvas/echarts';
const app = getApp()

var chart
var intt;
var i=1;


function initChart(canvas, width, height, dpr) {
  console.log(width, height)
  chart = echarts.init(canvas, null, {
   width: width,
   height: height,
   devicePixelRatio: dpr // new
 });
 canvas.setChart(chart);

 var option = {
   tooltip: {
     show: true,
     trigger: 'axis'
   },
   xAxis: {
     type: 'category',
     boundaryGap: false,
     data: [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,222,223,224,225,226,227,228,229,230,231,232,233,234,235,236,237,238,239,240,241,242,243,244,245,246,247,248,249,250,251,252,253,254,255,256,257,258,259,260,261,262,263,264,265,266,267,268,269,270,271,272,273,274,275,276,277,278,279,280,281,282,283,284,285,286,287,288,289,290,291,292,293,294,295,296,297,298,299,300,301,302,303,304,305,306,307,308,309,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346,347,348,349,350,351,352,353,354,355,356,357,358,359,360,361,362,363,364,365,366,367,368,369,370,371,372,373,374,375,376,377,378,379,380,381,382,383,384,385,386,387,388,389,390,391,392,393,394,395,396,397,398,399
     ],
    //  show: false
   },
   yAxis: {
     x: 'center',
     type: 'value',
     splitLine: {
       lineStyle: {
         type: 'dashed'
       }
     }
     // show: false
   },
   series: [{
     type: 'line',
     symbol:'none',
     smooth: true,
     data:[]
   }]
 };
 chart.setOption(option);
 return chart;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ModelPath:{
      name:"点击选择",
      path:''
    },
    mode_index:0,
    time_num:0,
    tip:'',
    tip_2:'',
    tip1:'',
    tip2:'',
    tip3:'',
    tip4:'',
    tip5:'',
    tip6:'',
    //tip_str=['','','','','',''],
    //tip_str[5]="",
    minute: 0,
    second: 0,
    minute_2: 0,
    second_2: 0,
    ec: {
      onInit: initChart
    },
    ec1: {
      onInit: initChart
    },
    graph_index:0,
    current_chart:'amplitude',
    treeData:{},
    classNum:0
  },

  echartInit (e) {
    console.log(e)
    initChart(e.detail.canvas, e.detail.width, e.detail.height);
  },
  change_garph(e){
    var all_words = ['amplitude', 'phase']
    this.setData({
      graph_index:parseInt(e.currentTarget.dataset.graph_index),
      current_chart:all_words[e.currentTarget.dataset.graph_index]
    })
  },

  classNum_ipt(e){
    this.setData({
      classNum:e.detail.value.replace(/\s*/g,"")
    })
  },

  fileSelect_btn(e){
    app.globalData.join_data_type = 1
    wx.navigateTo({
      url: '../contentList_fileSelect/contentList_fileSelect?Info=' + JSON.stringify({first_enter:1}),
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

  timer_2: function () {
    var that = this;
    that.setData({
      second_2: that.data.second_2 + 1
    })
    if (that.data.second_2 >= 60) {
      that.setData({
        second_2: 0,
        minute_2: that.data.minute_2 + 1
      })
    }

  },
  change_mode(e){
    this.setData({
      mode_index:e.currentTarget.dataset.mode_index
    })
  },
  startTest_btn(e){
    var isconnected = app.globalData.isconnected
    console.log(isconnected)
    if(isconnected){
    }else{   
      setTimeout(() => {
        wx.switchTab({
          url: '../home/home',
        })
      }, 1500);
      wx.showToast({
        title: '请先连接接收器！',
        icon:'none'
      })
      return
    }
    wx.showModal({
      content:'确定要开启实时监测吗',
      success:res=>{
        if(res.confirm){
        var that = this
        that.setData({
          tip:"正在开启实时检测"
        })
        const HOST = app.globalData.HOST
        console.log(HOST + "/fall_detect")
        wx.request({
          timeout:50000,
          url: HOST + "/fall_detect",
          method:"GET",
          header:{
            'content-type':'application/x-www-form-urlencoded'
          },success:res=>{
            clearInterval(intt);
            intt=null;
            //时间重置
            that.setData({
              hour: 0,
              minute: 0,
              second: 0,
              millisecond: 0,
            })
            intt = setInterval(function () { that.timer() }, 1000);
            console.log(res)
            that.setData({
              tip:res.data.msg
            })
          },fail(e){
            clearInterval(intt);
            intt=null;
            console.log(e)
            that.setData({
              tip:'操作失败！'
            })
          }
        })
        }
      }
    })
  },

  startTest_2_btn(e){
    var isconnected = app.globalData.isconnected
    console.log(isconnected)
    if(isconnected){
    }else{   
      setTimeout(() => {
        wx.switchTab({
          url: '../home/home',
        })
      }, 1500);
      wx.showToast({
        title: '请先连接接收器！',
        icon:'none'
      })
      return
    }
    var that = this
    that.setData({
      tip_2:"正在采集检测数据"
    })
    clearInterval(intt);
    intt=null;
    //时间重置
    that.setData({
      minute_2: 0,
      second_2: 0,
    })
    intt = setInterval(function () { that.timer_2() }, 1000);
    const HOST = app.globalData.HOST
    console.log(HOST + "/fall_detect_2")
    wx.request({
      timeout:50000,
      url: HOST + "/fall_detect_2",
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },success:res=>{
        clearInterval(intt);
        intt=null;
        console.log(res)
        that.setData({
          tip_2:res.data.msg
        })
      },fail(e){
        clearInterval(intt);
        intt=null;
        console.log(e)
        that.setData({
          tip_2:'操作失败！'
        })
      }
    })
  },

  stopTest_btn(e){
    wx.showModal({
      content:'确定要关闭实时监测吗',
      success:res=>{
        if(res.confirm){
        var that =this
        clearInterval(intt);
        intt=null
        const HOST = app.globalData.HOST
        console.log(HOST + '/fall_detect_stop')
        wx.request({
          url: HOST + '/fall_detect_stop',
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
        }
      }
    })
  },
  


  startCollect:function(e){
    var that = this
    var modelPath = this.data.ModelPath
    if(modelPath.path.length == 0){
      wx.showToast({
        title: '请选择模型！',
        icon:'none'
      })
      return 
    }
    wx.request({
      url: HOST + "/activity/realtimetest",
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },data:{
        model_path:modelPath.path
      },success:res=>{
        console.log(res)
        that.setData({
          tip:res.data.msg
        })
      },fail(e){
        console.log(e)
        that.setData({
          tip:'开始操作失败！'
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
  /**
   * 生命周期函数--监听页面加载
   */
  

  onLoad: function (options) {
    var that = this
    console.log(1)
    wx.getSystemInfo({
      success: (result) => {
        const tabbarHeight = ( result.screenHeight - result.windowHeight - result.statusBarHeight )
        this.setData({
          SystemInfo:result,
          tabbarHeight:tabbarHeight
        })
      },
    })
    this.setData({
      treeData:app.globalData.ModeltreeList
    })
    console.log(2)
    //接收服务器消息
    app.globalData.localSocket.onMessage(function(res) {
      //console.log(3)
      // console.log('收到服务器内容', res)
      res = JSON.parse(res.data)
      console.log(res)
      if(res.code==1 && res.realtime==1){
        that.setData({
          tip:"已经开启监测",
          tip1:that.data.tip2,
          tip2:that.data.tip3,
          tip3:that.data.tip4,
          tip4:that.data.tip5,
          tip5:that.data.tip6,
          tip6:res.time[0]+"年"+res.time[1]+"月"+res.time[2]+"日"+res.time[3]+"点"+res.time[4]+"分"+res.time[5]+"秒"+res.predict
        })
        // var chart = that.selectComponent('#mychart-dom-bar').chart
        // var option = chart.getOption()
        // option.series[0]={
        //   type: 'line',
        //   symbol:'none',
        //   smooth: true,
        //   data:res.data.amplitude
        // }
        // chart.setOption(option)

        // var chart1 = that.selectComponent('#mychart-dom-bar1').chart
        // var option1 = chart1.getOption()
        // option1.series[0]={
        //   type: 'scatter',
        //   symbolSize:4,
        //   data:res.data.phase
        // }
        // chart1.setOption(option1)
        
        
      }else{
        // if(i==1){
        //   that.setData({
        //     tip1:res.time+res.predict
        //   })
        //   i=i+1
        // }
        // if(i==2){
        //   that.setData({
        //     tip2:res.time+res.predict
        //   })
        //   i=i+1
        // }
        // if(i==3){
        //   that.setData({
        //     tip3:res.time+res.predict
        //   })
        //   i=i+1
        // }
        // if(i==4){
        //   that.setData({
        //     tip4:res.time+res.predict
        //   })
        //   i=i+1
        // }
        // if(i==5){
        //   that.setData({
        //     tip5:res.time+res.predict
        //   })
        //   i=i+1
        // }
        // if(i==6){
        //   that.setData({
        //     tip6:res.time+res.predict
        //   })
        //   i=1
        // }
      }
      // if(res.code==1 && res.type==5){
      //   that.setData({
      //     tip:"准确率:" + res.acc
      //   })
      // }
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