/*
* @Author: Marte
* @Date:   2017-12-02 17:05:44
* @Last Modified by:   Marte
* @Last Modified time: 2017-12-18 17:13:46
*/
(function(){

  var m = "pro",
      myChart = {}, //热地图chart
      sceneChart = {},  //场景chart
      orgChart = {},    //orgchart 对象
      hotPoints =[],
      boxPoints =[],
      bmap =null,
      ws = null;
      stompClient = null, //websocket
      markerList = [], //bmap地图上的标记
      // host = "http://120.25.135.87";
      host = "http://120.79.24.113:9911";

  //top 通知栏的移动
  //热地图构建
  var topInfoInterv,
      heatmapInterv,
      boxInterv,
      showAlertTimeo,
      bmapCenter = [113.104286,23.019903];

  //热地图初始设置
  var option = {
    animation:true,
    bmap:{
      center: bmapCenter,
      zoom: 17,
      roam: false,
      mapStyle:{
        styleJson: [{
                    'featureType': 'land', //调整土地颜色
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#081734'
                    }
                }, {
                    'featureType': 'building', //调整建筑物颜色
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#04406F',

                    }
                }, {
                    'featureType': 'building', //调整建筑物标签是否可视
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'highway', //调整高速道路颜色
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#015B99'
                    }
                }, {
                    'featureType': 'highway', //调整高速名字是否可视
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'arterial', //调整一些干道颜色
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#003051'
                    }
                }, {
                    'featureType': 'arterial',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'green',
                    'elementType': 'geometry',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'water',
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#044161',

                    }
                }, {
                    'featureType': 'subway', //调整地铁颜色
                    'elementType': 'geometry.stroke',
                    'stylers': {
                        'color': '#003051'
                    }
                }, {
                    'featureType': 'subway',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'railway',
                    'elementType': 'geometry',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'railway',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'all', //调整所有的标签的边缘颜色
                    'elementType': 'labels.text.stroke',
                    'stylers': {
                        'color': '#313131',
                        visibility:"off"
                    }
                }, {
                    'featureType': 'all', //调整所有标签的填充颜色
                    'elementType': 'labels.text.fill',
                    'stylers': {
                        'color': '#FFFFFF',
                        visibility:"off"
                    }
                }, {
                    'featureType': 'manmade',
                    'elementType': 'geometry',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'manmade',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'local',
                    'elementType': 'geometry',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'local',
                    'elementType': 'labels',
                    'stylers': {
                        'visibility': 'off'
                    }
                }, {
                    'featureType': 'subway',
                    'elementType': 'geometry',
                    'stylers': {
                        'lightness': -65
                    }
                }, {
                    'featureType': 'railway',
                    'elementType': 'all',
                    'stylers': {
                        'lightness': -40
                    }
                }, {
                    'featureType': 'boundary',
                    'elementType': 'geometry',
                    'stylers': {
                        'color': '#8b8787',
                        'weight': '1',
                        'lightness': -29,
                    }
                },{"featureType": "poilabel",
                    "elementType": "all",
                    "stylers": {
                          "color": "#000000ff",
                          "visibility": "off"
                    }}]
      }
    },
    tooltip : {
      trigger: 'item'
    },
    visualMap: {
      show: false,
      top: 'top',
      min: 0,
      max: 10,
      seriesIndex: 0,
      calculable: true,
      inRange: {
        color: ['lightgreen', 'green','green', 'yellow', 'red']
      }
    },
    series: [
    {
      type:'heatmap',
      coordinateSystem: 'bmap',
      data: [],
      pointSize: 3,
      blurSize: 3
    },
    {
      name:"南面2楼外墙上",
      type:'effectScatter',
      showEffectOn: 'emphasis',
      rippleEffect: {
        brushType: 'stroke'
      },
      symbolSize: function (val) {
        return val[2] / 10;
      },
      itemStyle: {
        normal: {
          color: 'white',
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      label:{
        normal: {
          formatter: '{b}',
          position: 'right',
          show: true
        }
      },

      coordinateSystem: 'bmap',
      data: [{name:"中心电房",value:[113.104286,23.019903,100]}],
      zlevel: 1
    },
    {
      name: '告警区域',
      type: 'effectScatter',
      coordinateSystem: 'bmap',
      data: [],
      symbolSize: function (val) {
        return val[2] / 10;
      },

      rippleEffect: {
        brushType: 'stroke'
      },
      label:{
        normal: {
          formatter: '{b}',
          position: 'right',
          show: true
        }
      },
      itemStyle: {
        normal: {
          color: 'red',
          shadowBlur: 10,
          shadowColor: '#333'
        }
      },
      zlevel: 1
    }
    ]
  };

  //当前热地图设置
  var curHeatOption = $.extend(true,{},option);

  //图表设置模板
  var optionMod = {
    animation:true,

    title: {
      text: '区域人数统计',
      top:"10",
      left:"10",
      textStyle: {
                fontWeight: 'normal',              //标题颜色
                color: '#ffd323'
            },
    },
    tooltip: {
      trigger:'axis',
    },
    legend: {
      data:[],
      bottom:10,
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        dataView: {readOnly: false},
        magicType: {type: ['line', 'bar']},
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis:  {
      type: 'category',
      boundaryGap: false,
      data: [],
      axisLine:{
                lineStyle:{
                    color:'#ffd323',
                    width:2
                }
            },
    },
    textStyle:{
          // color:"yellow",
          // show:false,
          // nameTextStyle:{
          //   color:"green",
          // }
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            formatter: '{value} 人'
          },
          axisLine:{
                    lineStyle:{
                        color:'#ffd323',
                        width:2
                    }
                },

        },
        series: [
        {
          name:'最大人数',
          type:'line',
          data:[],
          markPoint: {
            data: [
            {type: 'max', name: '最大值'},
            ]
          },
                // markLine: {
                //     data: [
                //         {type: 'average', name: '平均值'}
                //     ]
                // },
              },
              ]
            };

  //仪表盘设置模板
  var dashBoardOption = {

    tooltip : {
        formatter: "{a} <br/>{c} {b}"
    },
    series : [
        {
            name:'百分比',
            type:'gauge',
            min:0,
            max:100,
            splitNumber:10,
            radius: '90%',
            axisLine: {            // 坐标轴线
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: [[0.2, 'lime'],[0.4,"green"],[0.6,"green"],[0.8,"yellow"],[1,'red']],
                    width: 1,
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 1
                }
            },
            axisLabel: {            // 坐标轴小标记
                textStyle: {       // 属性lineStyle控制线条样式
                    fontWeight: 'bolder',
                    color: '#fff',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 1
                }
            },
            axisTick: {            // 坐标轴小标记
                length :10,        // 属性length控制线长
                lineStyle: {       // 属性lineStyle控制线条样式
                    color: 'auto',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            splitLine: {           // 分隔线
                length :10,         // 属性length控制线长
                lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
                    width:3,
                    color: '#fff',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            pointer: {           // 分隔线
                shadowColor : '#fff', //默认透明
                shadowBlur: 5
            },
            title : {
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
                    fontWeight: 'bolder',
                    fontSize: 12,
                    fontStyle: 'italic',
                    color: '#fff',
                    shadowColor : '#fff', //默认透明
                    shadowBlur: 10
                }
            },
            detail : {
                // backgroundColor: 'rgba(30,144,255,0.8)',
                // borderWidth: 1,
                borderColor: '#fff',
                shadowColor : '#fff', //默认透明
                shadowBlur: 5,
                offsetCenter: [0, '90%'],       // x, y，单位px
                textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE

                    fontWeight: 'bolder',
                    color: '#ffd323',
                    fontSize:26,
                }
            },
            data:[{value: 100, name: '人数百分比'}]
        }
    ]
};

  //区域ID 与经纬度的映射
  // var areaMapped = [
  //   {id:0,name:"test",ll:[113.133189,23.055251],show:false},
  //   {id:1,name:"区域1",ll:[113.133189,23.025251],show:false},
  //   {id:2,name:"区域2",ll:[113.129686,23.021925],show:false},
  //   {id:3,name:"区域3",ll:[113.129578,23.024985],show:false},
  //   {id:4,name:"区域4",ll:[113.128392,23.024968],show:false},
  //   {id:5,name:"区域5",ll:[113.126704,23.024985],show:false},
  //   {id:6,name:"区域6",ll:[113.12408,23.024918],show:false},
  //   {id:7,name:"区域7",ll:[113.123074,23.024269],show:false},
  //   {id:8,name:"区域8",ll:[113.122625,23.023222],show:false},
  //   {id:9,name:"区域9",ll:[113.121817,23.022606],show:false},
  //   {id:10,name:"区域10",ll:[113.121781,23.025666],show:false},
  // ];

  var areaMapped = [
    {id:0,name:"center",ll:bmapCenter,show:false},
    {id:1,name:"泡泡池广场",ll:[113.104312,23.109978],show:false},
    {id:2,name:"季华路沿线",ll:[113.104268,23.017995],show:false},
    {id:3,name:"东北门出口区",ll:[113.105772,23.020074],show:false},
    {id:4,name:"北门出口区",ll:[113.103598,23.020747],show:false},
    {id:5,name:"西北区",ll:[113.102237,23.020602],show:false},
  ]

  //用于记录告警的信息，可查询某个区域何时告警
  //告警信息的格式
  // alertRecod[0] = {
  //   info:{
  //     name:"test",
  //     value:[113.508142,23.589836,200]
  //   },
  //   show:false, //是否在地图显示该点
  //   log:["xxxx年xx月xx日 区域test人数达到100%!"]
  // };
  var alertRecord = [];
  updateAlertRecord();

  //根据areaMapped更新AlertRecord
  function updateAlertRecord(){
    areaMapped.forEach(function(item,i){
    if(!alertRecord[i])
      alertRecord[i] = {
        id:i,
        info:{
          name:item.name,
          value:[item.ll[0],item.ll[1],200]
        },
        show:item.show,
        log:[]
      };
    })
  }

  //生成随机点，测试用
  function randomPoints(p){
    var pp =[],
    x,y;
    for(var i=0;i<20000;i++){
      var f = i%2 == 0?-1:1;
      x=p[0] + Math.random()/10*f;
      y=p[1] + Math.random()/10*f;
      pp.push([x,y])
    }
    return pp;
  }

  //获取实时人流信息
  // function getRealData(){
  //   var url = "/data/init"
  //   if(m !="test") url = "http://120.79.24.113:8081/data/init";
  //   $.getJSON(url,function (d){
  //     var code = d["code"] || "error !!!!",
  //     msg = d["msg"];
  //     data = d["data"];
  //     console.log("real-----------------")
  //     console.log("code: "+code);
  //     console.log("msg :" +msg);
  //     if(code == 200)
  //       setRealInfo(data);
  //   })
  // }

  //更新实时人流信息
  function setRealInfo(list){
    //参数列表
    var cNameList = ["onlineUserCount","last5minCount","maxCount"];

    for(var i=0;i<cNameList.length;i++){
      //判断是否是三个参数值
      if(list[cNameList[i]]){
        var name = cNameList[i],
            num = list[name].count,
            el = $("#"+name);
        if(num == 0) return ;
        //如果是top count 则需要更新最高峰
        if(name == "maxCount"){
          num = list[name].count;
          $("#top-value").text(list[name].createTime)
          localStorage.maxCountCreateTime = list[name].createTime;
        }
        //将数据存储到浏览器
        localStorage[name] = num;
        el.numberScroll("set",num);
      }
    }
  }

  //获取场景数据
  //取消，改用goEasy
  function getSceneData(opt){
    var url = "scene.json";

    if(m !="test") url = host + "/data/scene_statistics";
    $.getJSON(url,function (d){
      var code = d["code"],
      msg = d["msg"],
      data = d["data"];
      console.log("scene ----------------")
      console.log("code: "+code);
      console.log("msg :" +msg);
      if(code == 200)
        setSceneChart(data);
    })
  }

  //将场景数据在图表上展示
  function setSceneChart(json){
    var opt = $.extend(true,{},optionMod);
    //记录
    localStorage.sceneJson = JSON.stringify(json);

    for(var i=0;i<json.length;i++){
      var id = json[i].sceneId,
          name = json[i].sceneName,
          list = json[i].list,  //数据内容
          countList = [],       //某个数值列表
          createTimeList = [],  //某个场景的时间线
          serie = $.extend(true,{},optionMod.series[0]);  //series 模板

      //折线名称
      opt.series[i] =  serie;
      opt.series[i].name = name;
      opt.title.text = "区域人数统计"
      opt.legend.data.push(name);
      for(var j=0;j<list.length;j++){
        countList.push(list[j].count);
        createTimeList.push(list[j].createTime);
        opt.series[i].data = countList;
      }
    }
    //地图的时间轴，根据最后一个数据为准
    opt.xAxis.data = createTimeList;
    sceneChart.setOption(opt);
  }

  //获取场景数据
  //取消，改用goEasy
  function getOrgData(){
    var url = "agency.json";
    if(m !="test") url = host + "/data/org_statistics";
    $.getJSON(url,function (d){
      var code = d["code"] || "error !!!!",
      msg = d["msg"];
      data = d["data"];
      console.log("org -------------------")
      console.log("code: "+code);
      console.log("msg :" +msg);
      console.log("get org");
      if(code == 200)
        setOrgChart(data);
    })
  }

  //将机构数据在图表上展示
  function setOrgChart(json){
    var opt = $.extend(true,{},optionMod);
    var countList = [],
        createTimeList = [],
        serie = $.extend(true,{},optionMod.series[0]);  //series 模板
        opt.legend.data.push("机构")
        opt.title.text = "总人数统计";
        opt.series[0] =  serie;
        opt.series[0].name = "机构" ;

    localStorage.orgJson = JSON.stringify(json);
        for(var i=0;i<json.length;i++){
          countList.push(json[i].count);
          createTimeList.push(json[i].createTime);
        }
        opt.xAxis.data = createTimeList;
        opt.series[0].data = countList;
        orgChart.setOption(opt);
  }

  //设置仪表盘
  function setDashBoardChart(areaInfo){
    var opt = $.extend(true,{},dashBoardOption),
        id = areaInfo.id,
        chartDom = $(".dashboard-chart-box").get(id-1),
        chart = echarts.init(chartDom),
        detailColor = "lightgreen"; // 详细数值颜色

    //改变detail 颜色
    if(areaInfo.value >= 80)
      detailColor = "red";
    else if(areaInfo.value >=60)
      detailColor = "yellow";
    else if(areaInfo.value >= 20)
      detailColor = "green";

    opt.series[0].detail.textStyle.color = detailColor;
    opt.series[0].data = {name:areaInfo.name ,value:areaInfo.value}
    chart.setOption(opt);
  }

  //添加警告消息
  function addAlertMsg(id,msg){
    var itemHtml = '<div class="item active"></div>',
        alertHtml = '<div id="alert-{{id}}"class="alert alert-self alert-danger">\
                      <a href="#" class="close" data-dismiss="alert">\
                        &times;\
                      </a>\
                      <strong>警告！</strong>{{msg}}\
                    </div>'.replace("{{id}}",id).replace("{{msg}}",msg);

    var $carousel = $(".carousel-self"),
        alert = $('#alert-' + id);

    //如果alert 存在则先删除
    //然后新增alert
    //在注册事件
    if(alert.length > 0 && id !=0){
      var parent = alert.parent()

      alert.remove();
      alert = $(alertHtml);
      parent.append(alert);
    }else{
      alert = $(alertHtml);
      $carousel.sa_carousel("add",alert);
    }

    //为alert 添加关闭事件
    //关闭盒子离线提示，或区域告警提示
    alert.bind("close.bs.alert",function(){
      //如果关闭的是区域告警提示，则清除该区域地图上的红点
      var id = parseInt($(this).attr("id").split("-")[1]);

      //判断是否故障区域
      if(id <1000){
        alertRecord[id].show = false;
        displayAllAlertPoints();
      }
    })
  }

  //设置告警区域的点(只是定位到该点)
  //取消的功能
  function setAreaAlert(id,PointsInfo){
    // var center = bmap.getCenter(),
    //     center = [center.lng,center.lat];
    // //     zoom = bmap.getZoom();

    // // curHeatOption.bmap.zoom = 19;
    // curHeatOption.bmap.center = PointsInfo.value.slice(0,2);
    // myChart.setOption(curHeatOption);
  }

  //显示所有应该显示的点(alertRecord.show == true)
  function displayAllAlertPoints(){
    var list = [];
    for(var i=0;i<alertRecord.length;i++){
      if(alertRecord[i].show)
        list.push(alertRecord[i].info);
    }
    curHeatOption.series[2].data = list;
    myChart.setOption(curHeatOption);
  }

  //展示modal
  function showAlertModal(config){
    var title =  config.title || "log"
        content = config.content || "告警日志";

    $("#alertModal h4").html(title);
    $("#alertModal .modal-body").html(content);
    $("#alertModal").modal("show");
  }
  //处理场景容量的消息
  //    通过更新alertRecord 可以决定是否显示该点
  //一般使用websocket获取
  function disposeSceneCapInfo(data){
    //id 打算用于标记alert的点，当告警消除时，同时清除告警点
    var id = parseInt(data.sceneId)>10?10:parseInt(data.sceneId) ,
        userCount = data.userCount,
        ratio = data.ratio,
        percent = data.percent,
        name = id<areaMapped.length && id >0 ?areaMapped[id].name: "",
        msg =  `${name}人数已经达到${userCount}人。`,
        alertLimit = 0.8  //告警阈值
        dashInfo = {id:id,name:name,value:parseFloat(percent)}; //设置仪表盘的信息



    //如果判断ID是否有记录(存在areaMapped中)
    if(name == "") return ;
    if(!localStorage.dashValueList) localStorage.dashValueList = "[]"
    var dashValueList = $.parseJSON(localStorage.dashValueList);

    //存储当前场景容量信息
    dashValueList[id] = dashInfo;
    localStorage.dashValueList = JSON.stringify(dashValueList);

    //设置仪表盘展示数据
    setDashBoardChart(dashInfo);

    //告警阈值
    if(ratio < alertLimit) return ;

    if(id <= alertRecord.length){
      pointsInfo = alertRecord[id].info;
      //存储记录
      //限制最多只能存储10条
      if(alertRecord[id].log.length == 10){
        alertRecord[id].log.shift();
      }

      alertRecord[id].log.push(getDate().join(" ") + $(".date-now").html() +" >" +msg);
      //页面显示告警消息
      addAlertMsg(id,msg)
      //如果区域点没显示，则显示
      if(!alertRecord[id].show){
        alertRecord[id].show = true;
        displayAllAlertPoints();
      }
      // //如果告警的点没有在地图上展示，则会定位到该点并展示
      // if(!alertRecord[id].show){
      //   alertRecord[id].show = true;
      //   setAreaAlert(id,pointsInfo)
      //   clearTimeout(showAlertTimeo);
      //   showAlertTimeo = setTimeout(function(){
      //     displayAllAlertPoints();
      //   },500);
      // }
    }
  }

  //处理热地图信息
  function disposeHeatMapInfo(points){
    intelDrawHeatMapPoints(points);
  }

  //获取所有盒子的信息
  //并将其转换为绘图信息呈现在bmap上
  //没有用到
  function getBoxesInfo(){
    var url = "./box.json",
    PointInfo = [],
    Points = [];

    if(m != "test") url = '/boxlist'
      $.getJSON(url,function(data){
        if(data.code != 200){
          console.log("code err")
          return ;
        }else{
          var list = data.data
          for(var i=0;i<list.length;i++){
            PointInfo.push(list[i]);
          }
        }
        boxPoints = buildBoxPoints(PointInfo);
        intelDrawBoxPoints(boxPoints);
      });
  }

  //用xy数据生成盒子points
  //与热地图坐标点不同，它会多一个value 表示点的大小
  //测试用
  function buildBoxPoints(data){
    var list = [];
    var pointSize = 150;

    for(var i =0;i<data.length;i++){
      var d = data[i]
      if(d.lat && d.lng){
        var lat = parseFloat(d.lat),
        lng = parseFloat(d.lng);
        list.push({name:d.name,value:[lng,lat,pointSize]})
      }
    }
    return list
  }

  //绘制盒子的点
  //没有用到
  function drawBoxPoints(points){
    var points = points || boxPoints;
    curOption.series[1].data
    option.series[1].data = option.series[1].data.concat(points);
    myChart.setOption(option);
  }

  //智能绘制点位
  //并没有用
  function intelDrawBoxPoints(points){
    var points = points || boxPoints ,
    len = points.length,
    limit = 1000;
    clearInterval(boxInterv)
    //如果大于限制，则使用智能分区画点
    if(false){
      var start = 0,
      step = parseInt(len /10 ) || 1,
      end = step;

      boxInterv = setInterval(function(){
        drawBoxPoints(points.slice(start,end));
        //判断每次需要绘制的范围
        if(end == len) clearInterval(boxInterv);
        if(end + step > len){
          start = end;
          end = len;
        }else{
          start = end;
          end += step;
        }
      },50)
    }else{
      drawBoxPoints(points);
    }
  }

  // //获取 热地图坐标列表
  // function getHeatMapPoints(){
  //   var url = "./box.json",
  //   PointInfo = [],
  //   Points = [];

  //   if(m != "test") url = './box.json'
  //     $.getJSON(url,function(data){

  //       var p = [113.103399,23.020271]
  //       hotPoints = randomPoints(p);
  //       if(false && data.code != 200){
  //         console.log("code err")
  //         return ;
  //       }else{
  //         intelDrawHeatMapPoints(hotPoints);
  //       }
  //     });
  // }

  //绘制热地图红点
  function drawHeatMapPoints(points){
    var points = points || hotPoints,
        centerP = bmap.getCenter(),
        centerP = [centerP.lng,centerP.lat],
        zoom = bmap.getZoom();

    //判断是否为经纬度坐标
    if(!points || points.length == 0 || points[0].length <2)return;
    //判断是否是完整的热地图坐标，如果不是则在后面加1
    if(points[0].length <3){
      for(var i=0;i<points.length;i++){
        points[i].push(1);
      }
    }
    //存储到浏览器
    localStorage.heatMapPoints = JSON.stringify(points);


    curHeatOption.bmap.center = centerP;
    curHeatOption.bmap.zoom = zoom;
    curHeatOption.series[0].data = points;
    myChart.setOption(curHeatOption);
  }

  //智能绘制热地图红点
  //并没有用
  function intelDrawHeatMapPoints(points){
    len = points.length,
    limit = 30000;
    clearInterval(heatmapInterv)
    //如果大于限制，则使用智能分区画点
    if(false){
      var start = 0,
      step = parseInt(len /10 ),
      end = step;

      heatmapInterv = setInterval(function(){
        drawHeatMapPoints(points.slice(start,end));
        //判断每次需要绘制的范围
        if(end == len) clearInterval(heatmapInterv);
        if(end + step > len){
          start = end;
          end = len;
        }else{
          start = end;
          end += step;
        }
      },50)
    }else{
      drawHeatMapPoints(points);
    }
  }

  //返回中文格式时间
  function getDate(){
    var monthDay = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    weekDay = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var tt = Date().split(" "),
        d = new Date(),
        year = tt[3] + "年",
        day = tt[2] + "日",
        month = monthDay[d.getMonth()],
        week = weekDay[d.getDay()];
    return  [year,month,day,week]
  }

  //更新元素的日期、星期、月份
  function refreshDate(){
    var dt = getDate();
    thtml = `<h5>${dt[0]}</h5><h5> ${dt[1]} ${dt[2]}</h5><h4>${dt[3]}</h4>`;

    $(".date-now").attr("title",thtml);
    $(".date-now").tooltip("destroy");
    $(".date-now").tooltip({html:true});
  }

  //右上角时间计算
  function dateRun(){
    refreshDate();
    //每秒都会更新
    var dateNowInterv = setInterval(function(){
      var tt = Date().split(" "),
      time = tt[4];
      //整点更新日期
      if(time == "00:00:00") refreshDate();
      $(".date-now").html(time);
    },1000)
  }

  //自动请求，更新数据
  function autoRequest(){
    $.ajaxSetup({crossDomain: true, xhrFields: {withCredentials: true}});
    var requestInterv = 30000;

    request();
    //定时轮询
    var realT = setInterval(request,requestInterv)

    //分时段获取数据
    function request(){
      var ot = setTimeout(function(){
        getOrgData();
      },4000),
      st = setTimeout(function(){
        getSceneData();
      },2000);
    }
  }

  //初始化热地图
  //并且将echart 里面的 bmap 对象取出
  function initheatmap(myChart,hotPoints,boxPoints){

    myChart.setOption(curHeatOption)

    var ecModel = myChart._model;
    ecModel.eachComponent('bmap', function (bmapModel) {
      if(bmap == null){
       bmap = bmapModel.__bmap;
     }
     // 设置为不可缩放状态
     bmap.disableScrollWheelZoom();
   });
  }

  //加载热地图
  function loadHeatMap(){
    var dom = document.getElementById("heatmap");
    myChart =  echarts.init(dom,"shine");
    initheatmap(myChart,hotPoints,boxPoints);
  }

  //加载图表
  function loadChart(){
    sceneChart = echarts.init(document.getElementById("sceneChart"));
    orgChart = echarts.init(document.getElementById("orgChart"));

    sceneChart.setOption(optionMod);
    optionMod.title.text = "总人数统计"
    orgChart.setOption(optionMod);
  }


  //事件注册
  function eventRegister(){
    var orgBoxBgc = $(".org-box").css("background-color"),
    sceneBoxBgc = $(".scene-box").css("background-color");

    bmap.addEventListener("zoomend",function(e){
      // bmap.disableScrollWheelZoom();
      // myChart.clear();
    })

    bmap.addEventListener("click",function(){
      // console.log("alert record ------")
      // console.log(alertRecord);
      // setAreaAlert(0,alertRecord[0].info);
      // var center =bmap.getCenter();
      // console.log("地图中心点变更为："+ center.lng +", "+ center.lat);
    })

    // bmap.addEventListener("dragend", function(){
    //   var center =bmap.getCenter();
    //   console.log("地图中心点变更为："+ center.lng +", "+ center.lat);
    // });

    //热地图chart 点击事件
    //显示区域告警日志
    myChart.on("click",function(p){
      console.log("mychart click -----")
      var title = p.name,
          id = 0,
          content ="";
          console.log(p);
      //查找对应的地区名
      for(var i =1;i<areaMapped.length;i++)
        if(areaMapped[i].name == title) break;

      id = i ;
      if(!id || id<0 && id>alertRecord.length) return ;
      content = alertRecord[id].log.reverse().join("<br>");
      showAlertModal({title:title,content:content})
    })

    //dashboard 显示操作
    $(".hide-dashboard-btn").click(function(){
      var _this = this,
          dsBar = $(".dashboard-charts-bar"),
          w = dsBar.width();

      dsBar.animate({"left":(-w-2) +"px"},300,"linear",function(){
        $(_this).hide(300,function(){
          $(".show-dashboard-btn").fadeIn(300);
        });
      })
    })
    //dashboard 隐藏操作
    $(".show-dashboard-btn").click(function(){
      var _this = this,
          dsBar = $(".dashboard-charts-bar");
      dsBar.animate({"left":"0px"},300,"linear")
      $(_this).hide(300,function(){
          $(".hide-dashboard-btn").fadeIn(300);
        });
    })

    //展示板块
    $(".show-real-info").click(function(){
      $(".left-display-box>.data-block").fadeIn(300);
    })
    $(".show-chart").click(function(){
      $(".scene-box").fadeIn(300);
      $(".org-box").fadeIn(300);
    })

    //orgchart mouseenter && out
    // $(".org-box").mouseenter(function(e){
    //   $(".org-box").css({"background-color":"white"})
    // })
    // $(".org-box").mouseleave(function(e){
    //   $(".org-box").css({"background-color":orgBoxBgc})
    // })

    //scenechart mouseenter && out
    // $(".scene-box").mouseenter(function(e){
    //   $(".scene-box").css({"background-color":"white"})
    // })

    // $(".scene-box").mouseleave(function(e){
    //   $(".scene-box").css({"background-color":sceneBoxBgc})
    // })

    $(".navbar-brand").click(function(){
      console.log("nav ---------->")
      console.log(localStorage.sceneCapValue)
      // $("#maxCount").numberScroll("set",666)
    })

    //隐藏展示栏
    $(".hide-btn").click(function(){
      $(this).parent().fadeOut(300);
    })
    //隐藏所有
    $(".hide-all").click(function(){
      $(".org-box").fadeOut(300);
      $(".scene-box").fadeOut(300);
      $(".left-display-box>.data-block").fadeOut(300);
    })
  }

  //开启websocket
  // function openWebSocket(){
  //   stompClient = new SockJS("http://120.79.24.113:9911/socket-server")
  //   stompClient = Stomp.over(stompClient);
  //   stompClient.connect({},function(frame){
  //     console.log("成功连接webSocket");
  //     //注册坚挺
  //     stompClient.subscribe("/topic/data/1",function(res){
  //       console.log("websocket-----res------");
  //       var result = JSON.parse(res.body);
  //       console.log(result.type + "------------");
  //       console.log(result.code);
  //       console.log(result.msg);
  //       if(result.type == "sceneCapacity")
  //         disposeSceneCapInfo(result.data);
  //       else if(result.type == "hot"){
  //         disposeHeatMapInfo(result.data.location);
  //       }
  //     })
  //   })
  // }


  //创建goEasy
  //并监听
  function createGoEasy(){
    var goEasy = new GoEasy({appkey: 'BC-482710bf7914482a8e8ebee6842fe33d'}),
        pCount = 0,     //当前热地图发送的次数
        pLimit = 14, //热地图 数据的数量
        hotTempPoints =[];


    goEasy.subscribe({
      channel: '/topic/data/1',
      onMessage: function(message){
        message = $.parseJSON(message.content)
        var cd = message.code,
            msg = message.msg,
            type = message.type,
            data = eval(message.data);

        console.log("goEasy ------");
        console.log("type >" +type);
        console.log("code >" +cd);
        console.log(msg);

        if(type == "maxCount" ||type == "onlineUserCount" ||type == "last5minCount"){
          var c = message.data.count || 0,
              ct = message.data.createTime || "",
              r = {};
          console.log("count >",data.count)
          r[type] = {count:c,createTime:ct};

          //设置实时数据信息
          setRealInfo(r);
        }else if(type == "boxOffline"){
          var name = data.boxName,
              mac = data.mac,
              id = Date.now(),//随机的名字，用来区分alert
              info = name +'盒子已离线。';
          addAlertMsg(id,info);
        }else if(type == "hot"){
          pCount ++;
          hotTempPoints = hotTempPoints.concat(data.location);
          if( pCount % pLimit ==0){
            pCount = 0;
            hotPoints = hotTempPoints;
            hotTempPoints = [];
            //存储
            disposeHeatMapInfo(hotPoints);
          }
        }else if(type == "sceneCapacity"){
          console.log(data);
          disposeSceneCapInfo(data);

        }else{
          return ;
        }
    }
  })
  }

  //运行动态更新的功能
  function allRun(){
    //初始化数值
    var uc = localStorage.onlineUserCount || 0,
        l5 = localStorage.last5minCount || 0,
        mc = localStorage.maxCount || 0,
        topTime = localStorage.maxCountCreateTime || "",
        dashValueList = [];


    $("#info-carousel").sa_carousel("init");
    $("#onlineUserCount").numberScroll("init",uc);
    $("#last5minCount").numberScroll("init",l5);
    $("#maxCount").numberScroll("init",mc);
    $("#top-value").text(topTime);

    //判断，如果10秒没有拿到scene 图表数据则使用旧数据
    var sceneTimeout = setTimeout(function(){
      var o = sceneChart.getOption();
      if(o.legend[0].data.length == 0 && localStorage.sceneJson)
        setSceneChart($.parseJSON(localStorage.sceneJson));
    },10000);

    //orgChart同上
    var orgTimeout = setTimeout(function(){
      var o = orgChart.getOption();
      if(o.legend[0].data.length == 0 && localStorage.orgJson)
        setOrgChart($.parseJSON(localStorage.orgJson));
    },10000);

    //自动画本地存储的热地图
    var heatTimeout = setTimeout(function(){
      if(localStorage.heatMapPoints)
        drawHeatMapPoints($.parseJSON(localStorage.heatMapPoints));
    },3000);


    //自动读取本地存储的仪表盘数值
    var dsTimeout = setTimeout(function(){
      //如果本地有数据，则使用浏览器数据
      if(localStorage.dashValueList) {
        dashValueList = $.parseJSON(localStorage.dashValueList)
      }

      //处理浏览器的dashvalue
      if(dashValueList.length >0){
        //循环area 数组，如果
        for(var i=1;i<areaMapped.length;i++){
          //判断，如果local 保存有部分数据，则优先使用local数据
          //一般来说，如果通过数据生成的话，最少都有个value为0的数据。
          if(dashValueList[i])
            setDashBoardChart(dashValueList[i]);
          else{
            setDashBoardChart({id:i,name:areaMapped[i].name,value:0});
          }
        }
      }else{
        //0数据，则生成数据
        for(var i=1;i<areaMapped.length;i++){
          setDashBoardChart({id:i,name:areaMapped[i].name,value:0});
        }
      }

    },4000);
    dateRun();
    autoRequest();
  }

  function init(){
    loadHeatMap();
    loadChart();
    eventRegister();
    allRun();
    createGoEasy();
    $(".scene-box ").hide();
    $(".org-box ").hide();

    var clear = setTimeout(function(){
      $("div.BMap_cpyCtrl.BMap_noprint.anchorBL").remove();
      $("div.anchorBL").remove();
    },200)

  }

  init();
})()
