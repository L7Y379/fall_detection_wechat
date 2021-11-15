// index.js
// 获取应用实例
import * as echarts from '../../ec-canvas/echarts';
const app = getApp()
var chart

var intt;
function initChart(canvas, width, height, dpr) {
  console.log(width, height)
  chart = echarts.init(canvas, null, {
   width: width,
   height: height,
   devicePixelRatio: dpr // new
 });
 canvas.setChart(chart);

 var option = {
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
  data: {
    storagePath:{
      name:"点击选择",
      path:''
    },
    type: 0,
    array: ['跌倒动作', '非跌倒动作'],
    array1:['跌倒动作', '非跌倒动作'],
    SystemInfo:{},
    refreshIndex:true,
    filename:'',
    path:'',
    tip:'',

    minute: 0,
    second: 0,
    ec: {
      onInit: initChart
    },
    ec1: {
      onInit: initChart
    },
    showMask:false,
    graph_index:0,
    current_chart:'amplitude'
  },
  onLoad() {
    var that = this
    wx.getSystemInfo({
      success: (result) => {
        const tabbarHeight = ( result.screenHeight - result.windowHeight - result.statusBarHeight )
        this.setData({
          SystemInfo:result,
          tabbarHeight:tabbarHeight,
          //treeData: app.globalData.treeData.nodes[0],
        })
      },
    })
    
    //接收服务器消息
    app.globalData.localSocket.onMessage(function(res) {
      // console.log('收到服务器内容', res)
      res = JSON.parse(res.data)
      console.log(res)
      if(res.code==1){
        console.log("ssssssssasf")
        var chart = that.selectComponent('#mychart-dom-bar').chart
        var option = chart.getOption()
        option.series[0]={
          type: 'line',
          symbol:'none',
          smooth: true,
          data:res.data.amplitude
        }
        chart.setOption(option)

        var chart1 = that.selectComponent('#mychart-dom-bar1').chart
        var option1 = chart1.getOption()
        option1.series[0]={
          type: 'scatter',
          symbolSize:4,
          data:res.data.phase
        }
        chart1.setOption(option1)

        that.setData({
          time_num:app.fomatFloat(res.time,1)
        })
      }else{
        // wx.showToast({
        //   title: '发送未知错误！',
        //   icon:'none'
        // })
      }
    })
  },

  bindPickerChange: function (e) {
    this.setData({
      type: e.detail.value
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

  echartInit (e) {
    console.log(e)
    initChart(e.detail.canvas, e.detail.width, e.detail.height);
  },

  showMaskBtn(e){
    this.setData({
      showMask:true
    })
    // this.getFileTree()
  },
  hiddenMaskBtn(e){
    this.setData({
      showMask:false
    })
  },

  change_garph(e){
    var all_words = ['amplitude', 'phase']
    this.setData({
      graph_index:parseInt(e.currentTarget.dataset.graph_index),
      current_chart:all_words[e.currentTarget.dataset.graph_index]
    })
  },

  tapItem: function (e) {
    this.setData({
      storagePath:e.detail,
      showMask:false
    })
  },

  changeSwitch1:function(e){
    this.setData({
      refreshIndex:e.detail.value
    })
  },

  startCollect:function(e){
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
    this.data.num=0
    var filename = this.data.filename
    var path = this.data.path
    var type = this.data.type
    console.log(filename, path,type)
    if(path.length==0||filename.length==0){
      wx.showToast({    
        title: '请输入有效数据！',
        icon:'none'
      })
      return
    }
    // if(type!=0&&type!=1){
    //   wx.showToast({    
    //     title: '请输入正确数据类型!(0或1)',
    //     icon:'none'
    //   })
    //   return
    // }
    console.log("开始采集")
    var that = this
    const HOST = app.globalData.HOST
    console.log(HOST + '/collect_data')
    wx.request({
      url: HOST + '/collect_data',
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },data:{
        filename:filename,
        path:path,
        label:type
      },success:res=>{     
        console.log(res)
        if(res.data.code == 1){
          clearInterval(intt);
          //时间重置
          that.setData({
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


        setTimeout(() => {
          this.stopCollect(e)
        }, 30000);




      },fail(e){
        console.log(e)
        that.setData({
          tip:'开始操作失败！'
        })
      }
    })
  },

  stopCollect:function(e){
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
    var refreshIndex = this.data.refreshIndex
    var that = this
    clearInterval(intt);
    console.log("结束采集")
    const HOST = app.globalData.HOST
    console.log(HOST + '/stop_collect')
    wx.request({
      url: HOST + '/stop_collect',
      method:"GET",
      header:{
        'content-type':'application/x-www-form-urlencoded'
      },success:res=>{
        console.log(res)
        if(res.data.code == 1){
          that.setData({
            tip:res.data.msg
          })

        }else{
          that.setData({
            tip:'结束操作失败！'
          })
        }
      },fail(e){
        that.setData({
          tip:'结束操作失败！'
        })
      }
    })
    if(refreshIndex){
      var Index = parseInt(this.data.Index) + 1
      this.setData({
        Index:Index,
      })
    }
    
  },
  iptname:function(e){
    this.data.filename = e.detail.value.replace(/\s*/g,"")
  },
  iptIndex:function(e){
    this.data.path = e.detail.value.replace(/\s*/g,"")
  },
  ipttype:function(e){
    this.data.type = e.detail.value.replace(/\s*/g,"")
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
  onShow: function () {
    this.getstates()
  },
  onUnload:function(e){
    // wx.request({
    //   url: app.globalData.HOST + '/api/HomeApi/Disconnect',
    //   method:"GET",
    //   header:{
    //     'content-type':'application/x-www-form-urlencoded'
    //   },success:res=>{
    //     console.log(res)
    //   }
    // })
  }
})

