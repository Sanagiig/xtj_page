(function(){
  var rowHtml = '<div id="row{{line}}" style="padding-bottom:20px;" class="row"></div>',
      chartsHtml = ' <div id="{{id}}" class="chart-bar  col-xs-5" style="min-width:300px;height:400px;"></div>';



  //一行显示多少个chart
  var oneLineChartLimit = 2,
      //数据获取的数量
      infoLoadedCount = 0,
      interv = null,
      personChart = null; //客群来源chart实例

  var host = "http://120.79.24.113:9911"
  // var host = "http://192.168.0.110:8081"
  var localUrlList = {
    "box":"boxcharts.json",
    "app":"boxcharts.json"
  }

    // 热地图


    //地图选项
    var mapOption  = {
      backgroundColor: '#404a59',
      title: {
        text: '客群经纬度信息',
        left: 'center',
        textStyle: {
          color: '#fff'
        }
      },
      tooltip : {
        trigger: 'item'
      },
      bmap: {
        center: [116.407635,39.912917],
        zoom: 10,
        roam: true,
        mapStyle: {
          styleJson: [
          {
            "featureType": "water",
            "elementType": "all",
            "stylers": {
              "color": "#044161"
            }
          },
          {
            "featureType": "land",
            "elementType": "all",
            "stylers": {
              "color": "#004981"
            }
          },
          {
            "featureType": "boundary",
            "elementType": "geometry",
            "stylers": {
              "color": "#064f85"
            }
          },
          {
            "featureType": "railway",
            "elementType": "all",
            "stylers": {
              "visibility": "off"
            }
          },
          {
            "featureType": "highway",
            "elementType": "geometry",
            "stylers": {
              "color": "#004981"
            }
          },
          {
            "featureType": "highway",
            "elementType": "geometry.fill",
            "stylers": {
              "color": "#005b96",
              "lightness": 1
            }
          },
          {
            "featureType": "highway",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          },
          {
            "featureType": "arterial",
            "elementType": "geometry",
            "stylers": {
              "color": "#004981"
            }
          },
          {
            "featureType": "arterial",
            "elementType": "geometry.fill",
            "stylers": {
              "color": "#00508b"
            }
          },
          {
            "featureType": "poi",
            "elementType": "all",
            "stylers": {
              "visibility": "off"
            }
          },
          {
            "featureType": "green",
            "elementType": "all",
            "stylers": {
              "color": "#056197",
              "visibility": "off"
            }
          },
          {
            "featureType": "subway",
            "elementType": "all",
            "stylers": {
              "visibility": "off"
            }
          },
          {
            "featureType": "manmade",
            "elementType": "all",
            "stylers": {
              "visibility": "off"
            }
          },
          {
            "featureType": "local",
            "elementType": "all",
            "stylers": {
              "visibility": "off"
            }
          },
          {
            "featureType": "arterial",
            "elementType": "labels",
            "stylers": {
              "visibility": "off"
            }
          },
          {
            "featureType": "boundary",
            "elementType": "geometry.fill",
            "stylers": {
              "color": "#029fd4"
            }
          },
          {
            "featureType": "building",
            "elementType": "all",
            "stylers": {
              "color": "#1a5787"
            }
          },
          {
            "featureType": "label",
            "elementType": "all",
            "stylers": {
              "visibility": "off"
            }
          }
          ]
        }
      },
      series : [
      {
        name: '客群信息',
        type: 'effectScatter',
        coordinateSystem: 'bmap',
        data: [],
        label: {
          normal: {
            formatter: '{b}',
            position: 'right',
            show: false
          },
          emphasis: {
            show: true
          }
        },
        symbolSize: function (val) {
          return val[2] / 10;
        },
        itemStyle: {
          normal: {
            color: '#ddb926'
          }
        }
      },
      {
        type: 'custom',
        coordinateSystem: 'bmap',
        itemStyle: {
          normal: {
            opacity: 0.5
          }
        },
        animation: false,
        silent: true,
        data: [0],
        z: -10
      }
      ]
    };

    var remoteUrlList = {
      "app":host + "/potr/getapplist/e4:95:6e:4f:e9:95/2017-12-11/2017-12-12",
      "box":host + "/potr/forbox/e4:95:6e:4f:e9:95/2017-12-11/2017-12-12",
      "ll":host + "/potr/getloc/{{mac}}/{{dataType}}/{{areaType}}/{{dateStart}}/{{dateEnd}}"
    }

    var m = "pro";
  //饼图option 模板
  var chartOption = {
    title : {
      text: "title",
      subtext: '纯属虚构',
      x:'center',
    },
    tooltip : {
      trigger: 'item',
      formatter: "{a} <br/>{b} : {c} ({d}%)"
    },
    legend: {
        // orient: 'vertical',
        // left: 'left',
        type: 'scroll',
        orient: 'vertical',

        top: 20,
        left: 'right',
        data: [],
        textStyle:{
          color:"white",
        }
      },
      series : [
      {

        name: '访问来源',
        type: 'pie',
        // radius: ['0%', '50%'],
        center: ['50%', '60%'],
        data:[],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
      ]
    };
  //省，市来源option
  var personOrigOption = {
    textStyle:{
      color:"white",
    },
    title: [{
        text: '客群统计',
        left: 'center',
        textStyle: {
            color: '#ffd323',
            fontSize: 16
        }
    },{
        text: '地区' ,
        right: 120,
        top: 40,
        width: 100,
        textStyle: {
            color: 'white',
            fontSize: 16
        }
    }],
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: [],
        selectedMode: 'single',
        textStyle: {
                fontWeight: 'normal',
                color: '#ffd323'
            },
    },
    visualMap: {
        min: 0,
        max: 100,
        left: 'left',
        top: 'bottom',
        text: ['多', '少'],
        calculable: true,
        colorLightness: [0.2, 100],
        color: ['#c05050','#e5cf0d','#5ab1ef'],
        dimension: 0,
        show:false
    },
    grid: {
        right: 40,
        top: 100,
        bottom: 40,
        width: '30%'
    },
    xAxis: [{
        position: 'top',
        type: 'value',
        boundaryGap: false,
        splitLine: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
    }],
    yAxis: [{
        type: 'category',
        data: [],
        axisTick: {
            alignWithLabel: true
        },
        textStyle:{
          color:"#ffd323",
        },
        axisLine:{
                    lineStyle:{
                        color:'#ffd323',
                        width:1
                    }
                },
    }],
    series: [{
        z: 1,
        roam:false,
        name: '省级(百分比)',
        type: 'map',
        mapType: 'china',
        left: '10',
        right: '50%',
        top: 100,
        bottom: "35%",
        zoom: 1,
        layoutSize:"50",
        label: {
            normal: {
                show: false
            },
            emphasis: {
                show: false
            }
        },
        "itemStyle": {
                "normal": {
                    "borderWidth": 1,
                    areaColor: '#031525',
                    borderColor: '#3B5077',
                    shadowColor: 'rgba(63, 218, 255, 0.5)',
                    "label": {
                        "show": true
                    }
                }
              },
        //roam: true,
        data: []
    },{
        name: '省级',
        z: 2,
        type: 'bar',
        label: {
            normal: {
                show: false,
            },
            emphasis: {
                show: true,
            }
        },
        itemStyle: {
            emphasis: {
                color: "orange"
            }
        },
        barMaxWidth : 20,
        barMinWidth : 5,
        data: []
    }]
};
  //地区，办公区来源option
  var personHeatOption = {
    animation:true,
    textStyle:{
      color:"white",
    },
    title: [{
        text: '客群统计',
        left: 'center',
        textStyle: {
            color: '#ffd323',
            fontSize: 16
        }
    },{
        text: '区域' ,
        right: 120,
        top: 40,
        width: 100,
        textStyle: {
            color: 'white',
            fontSize: 16
        }
    }],
    tooltip: {
        trigger: 'item'
    },
    legend: {
        orient: 'vertical',
        left: 'left',
        data: [],
        selectedMode: 'single',
        textStyle: {
                fontWeight: 'normal',
                color: '#ffd323'
            },
    },
    grid: {
        right: 40,
        top: 100,
        bottom: 40,
        width: '30%'
    },
    xAxis: [{
        position: 'top',
        type: 'value',
        boundaryGap: false,
        splitLine: {
            show: false
        },
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
    }],
    yAxis: [{
        type: 'category',
        data: [],
        axisTick: {
            alignWithLabel: true
        },
        textStyle:{
          color:"#ffd323",
        },
        axisLine:{
                    lineStyle:{
                        color:'#ffd323',
                        width:1
                    }
                },
    }],
    bmap:{
      center: [116.407635,39.912917],
      zoom: 5,
      roam: true,
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
    visualMap: {
      show: false,
      top: 'top',
      min: 0,
      max: 20,
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
      pointSize: 5,
      blurSize: 1
    },
    {
        name: '省级',
        z: 2,
        type: 'bar',
        label: {
            normal: {
                show: false,
            },
            emphasis: {
                show: true,
            }
        },
        itemStyle: {
            emphasis: {
                color: "orange"
            }
        },
        barMaxWidth : 20,
        barMinWidth : 5,
        data: []
    }
    ]
  };
  //当前的personOption
  var curPersonOrigOpt = $.extend(true,{},personOrigOption),
      curPersonHeatOpt = $.extend(true,{},personHeatOption);

  //所有图表option
  var allChartsOption = {};

  // var personChartOption_p =  $.extend(true,{},personOrigOption),
  //     personChartOption_c =  $.extend(true,{},personOrigOption),
  //     personChartOption_a =  $.extend(true,{},personOrigOption),
  //     personChartOption_o =  $.extend(true,{},personOrigOption),
  //     personChartOption_f =  $.extend(true,{},personOrigOption);

  var all = ["Android操作系统", "人群偏好", "Android分辨率", "职业", "网络", "手机价位", "Android型号", "有无小孩", "收入", "性别", "学历", "品牌", "运营商", "车产", "年龄", "通讯社交", "系统工具", "旅游出行", "生活休闲", "网上购物", "新闻阅读", "影音播放", "办公商务", "摄影图像", "金融理财", "网络游戏", "休闲益智", "other", "考试学习", "扑克棋牌", "手机美化", "健康运动", "辅助工具", "育儿亲子"]

  var chartClass = [
          {name:"生活版块",charts:["网上购物","运营商","手机价位","旅游出行"],loaded:false},
          {name:"人群属性",charts:["性别","年龄","有无小孩","学历"],loaded:false},
          {name:"人群倾向",charts:["职业","车产","人群偏好","健康运动"],loaded:false}
        ]

  // //获取json name
  function getValues(list,key){
    var names = [];
        key = key || "name"
    for(var i=0;i<list.length;i++){
      names.push(list[i][key].toString())
    }
    return names;
  }

  //获取到的数据重新排序
  function listSort(list,type,key){
    type = type || "des";
    key = "count"

    for(var i=0;i<list.length;i++){
      for(var j=i;j<list.length;j++)
        if(type == "des" && list[i][key] < list[j][key]){
          var tmp = list[i][key];
          list[i][key] = list[j][key];
          list[j][key] = tmp;
        }else if(type =="asc" && list[i][key] > list[j][key]){
          var tmp = list[i][key];
          list[i][key] = list[j][key];
          list[j][key] = tmp;
        }
    }
    return list;
  }

  //显示modal
  function showModal(){
    $("#myModal").modal("show");
  }

  //获取当前active nav 对应的搜索类型
  function getActiveType(){
    var dataType='p';
    if($(".nav-pills li").eq(1).hasClass("active"))
      dataType = "c";
    else if($(".nav-pills li").eq(2).hasClass("active"))
      dataType = "a";
    else if($(".nav-pills li").eq(3).hasClass("active"))
      dataType = "o";
    else if($(".nav-pills li").eq(4).hasClass("active"))
      dataType = "f";

    return dataType;
  }

  //刷新图表
  function refreshChart(){
    dataType = getActiveType();
    createPersonChart("#person-chart",llUrlBuild(dataType),dataType);
  }

  //整理 获取的applist json
  //chartTypeList[0]chart 对应的数据放在chartDataList[0]
  function disposeAppJsonDataResult(json){
    var r ={
            ct:[],
            cd:[[{
              name:"",
              value:0,
            }]],
          }
    json = $.parseJSON(json);

    for(var i=0;i<json.length;i++){
      //当前循环
      var cj = json[i],
          cname = cj.appCategoryName, //获取的chart 名称
          //如果不存在则新增图表类型
          tIndex = r.ct.indexOf(cname);

          if(tIndex == -1){
            tIndex = r.ct.length;
            r.ct.push(cname);
            r.cd.push([]);
          }

      //添加对应的 图表块名，和value
      r.cd[tIndex].push({name:cj.name,value:cj.activeRatio})
    }
    return r;
  }

  //处理 box 的json.result.data
  function disposeBoxJsonDataResult(json){
    var r ={
      ct:[],
      cd:[
      // [{
      //   name:"",
      //   value:0,
      // }]
      ],
    }
    var index = 0;
    //根据json result datas 的条数为基准循环
    for(var name in json){
      var obj = json[name];
      r.ct.push(obj.title);
      r.cd.push([]);
      for(var i=0;i<obj.datas.length;i++){
        var name = obj.datas[i].key,
        value = obj.datas[i].value;
        r.cd[index].push({name:name,value:value});
      }
      index ++ ;
    }
    return r;
  }

  //处理人群经纬度信息
  function disposePersonChartsResult(json,type){
    //bar 与map 图表类型的配置
      var data = {
        map:{"itemStyle":{
              "normal":{
                  "color":"white",
                  "label":{
                      "show": true,
                      "textStyle": {
                          "color": "white",
                          "fontSize": 12
                      }
                  }
              }
          }},
        bar:{"itemStyle": {
              "normal": {
                  "color": "white",
                  "label": {
                      "show": false,
                      "textStyle": {
                          "color": "white",
                          "fontSize": 12
                      }
                  }
              },
          },
        },
        areabar:{"itemStyle": {
          "normal": {
            "color": "white",
            "label": {
                "show": false,
                "textStyle": {
                    "color": "white",
                    "fontSize": 12
                }
              }
            },
        }
      }
  };
    var json = eval(json),
        r = [];

    if(type == "bar" || type =="map" || type == "areabar"){
      for(var i=0;i<json.length;i++){
        //拆分json
        //在请求省或者市数据时，code表示名字，在请求住户区，或者办公区时，name表示名字
        //︿(￣︶￣)︿
        var name = type=="bar" || type=="map"? json[i].code:json[i].name;
        r.push({
          name:name,
          value:parseFloat(json[i].count*100),
          itemStyle:data[type].itemStyle
        })
      }
      r = (listSort(r)).slice(0,20).reverse();
    }

    else if (type == "heatmap"){
      for(var i=0;i<json.length;i++){
        var lng = json[i].lng,
            lat = json[i].lat,
            count = json[i].count;
        r.push([lng,lat,count*100])
      }
    }

    return r;
  }

  //请求 圆饼图的json，并将处理结果保存到 allChartsOption
  function requestCircleCharts(type){
    var url = remoteUrlList[type]
    if(url == '' || m == "test") url = localUrlList(type);

    $.getJSON(url,function(d){

      d = eval(d);
      var textStyle,title,datas,lineDom,chartDom,mychart,curOption,
          success = d.data.success,
          errCode = d.data.errCode,
          errMsg = d.data.errMsg,
          result = d.data.result;

      //count 用于计算图表的个数，判断是否换行
      console.log(`createCircleCharts type[${type}] --->`)
      console.log("success :" + success);
      console.log("errCode :" + errCode);
      console.log("errMsg :" + errMsg);

      if(typeof type != "string"){
        var fname = arguments.callee.toString();
        console.log(`${fname}> 只能接受字符串类型的"type"`)
        return ;
      }

      //对json 进行格式化处理
      //返回 r =  {ct:[title列表] ,cd[[title列表对应的数据] ,]}
      if(type.indexOf("app") != -1)
        result = disposeAppJsonDataResult(result);
      else if(type.indexOf("box") != -1)
        result = disposeBoxJsonDataResult(result);
      else{
        var fname = arguments.callee.toString();
        console.log(`${fname}> 未能识别参数 "type" ${type}`)
      }
      //将格式化后的json 作为图表的option
      for(var i=0;i<result.ct.length;i++){
        //需要每次都初始化一份当前配置
        curOption = $.extend(true,{},chartOption);


        //chart 数据信息
        textStyle = {
          color:"#ffd323",
        }
        title = {text:result.ct[i],x:"center",textStyle:textStyle};
        datas = result.cd[i];


        //根据json 配置当前图表
        curOption.title = title;
        curOption.series[0].name = result.ct[i];
        curOption.legend.data = getValues(datas,"name"); //扇区名称
        curOption.series[0].data = datas;

        //将生成的所有option 记录到 allChartsOption
        allChartsOption[result.ct[i]] = curOption;
      }

      //更新获取的数据量
      // if(localStorage.allChartsOption)
      // var allOpt =
      infoLoadedCount++ ;
      //加载完成后，在本地存储一份
      if(infoLoadedCount == 2)
        localStorage.allChartsOption = JSON.stringify(allChartsOption);
    })
  }

  //使用curPersonOption 构建客群信息chart
  function buildPersonOrgHtml($container,opt){
    var $chart = $("<div id='personLL' style='width:100%;height:100%;'></div>"),
        chartDom = $chart.get(0);

    //清空容器是为了清除热地图
    $container.html(" ");
    opt = opt || curPersonOrigOpt;

    $container.append($chart);
    personChart = echarts.init(chartDom);
    personChart.setOption(opt);
    // personChart.setOption(opt,true);
    //关闭加载动画
    $(".inner-animate-box").fadeOut(300);
    //清除百度LOGO
    var clear = setTimeout(function(){
      $("div.BMap_cpyCtrl.BMap_noprint.anchorBL").remove();
      $("div.anchorBL").remove();
    },500)
  }

  //使用optionlist 在页面上构建chart
  function buildChartHtml($container,optionList){
    var $line = null;

    $container.html(" ");
    for(var i=0;i<optionList.length;i++){
      var id = $(".chart-bar").length,
          $chart = $(chartsHtml.replace("{{id}}", "circleChart"+id)),
          chart = null;

      if(i%oneLineChartLimit == 0){
        if(!$line) $line = $(rowHtml.replace("{{line}}",parseInt(i/oneLineChartLimit)));
        $line = $(rowHtml.replace("{{line}}",parseInt(i/oneLineChartLimit)))
        $container.append($line);
      }

      $line.append($chart);
      chart = echarts.init($chart.get(0));
      chart.setOption(optionList[i]);
    }
    //完成循环后添加最后一行
    $container.append($line);
  }

  //获取person orig 的数据
  function createPersonChart($container,url,dataType){
    var localTime = setTimeout(loadLocal,6000)
      $container = $($container);
      //加载动画显示
      $(".inner-animate-box").show();
      $.getJSON(url,function(d){
        d = eval(d);
        var title,datas,lineDom,chartDom,myChart,
        success = d.data.success,
        errCode = d.data.errCode,
        errMsg = d.data.errMsg,
        result = d.data.result,
        curOption,mapData,barData;


      console.log("createPersonChart --->");
      console.log(errCode);
      console.log(success);
      console.log(errMsg);
      console.log(result)
      //处理result

      if(errCode != 200)
        return;

      //如果是省市区域则隐藏热地图
      if(dataType == 'p' || dataType == 'c'){
        curOption = curPersonOrigOpt;
        //如果查看市的信息，则不改变地图信息（用省的地图）
        mapData = dataType=="p"?disposePersonChartsResult(result,"map"):curPersonOrigOpt.series[0].data,
        barData = disposePersonChartsResult(result,"bar");
      }
      else if(dataType == 'a' || dataType =='o' || dataType == 'f'){
        curOption = curPersonHeatOpt;
        mapData = disposePersonChartsResult(result.loc,"heatmap"),
        barData = disposePersonChartsResult(result.area,"areabar");
      }

      //更新地图 || 热地图 ,图表信息
      curOption.series[0].data = mapData ;
      curOption.series[1].data = barData ;
      curOption.yAxis[0].data = getValues(barData,"name");
      curOption.legend.data = getValues(barData,"name");

      console.log("cur opt --->")
      console.log(dataType);
      console.log(barData);
      console.log(curOption)
      //保存配置
      //用personChartOption_ + dataType 字符串表示客群来源数据
      localStorage["personChartOption_" + dataType] = JSON.stringify(curOption);
      buildPersonOrgHtml($container,curOption);

      //清除加载本地数据的计时器
      clearTimeout(localTime)
    })

    //如果超时则读取本地数据，然后再加载地图
    function loadLocal(){
      if(localStorage["personChartOption_" + dataType]){
        var curOption = $.parseJSON(localStorage["personChartOption_" + dataType]);
        console.log("personOrig 读取本地数据 >");
        buildPersonOrgHtml($container,curOption);
        clearTimeout(localTime);
      }
    }
  }

  //加载分类后的chart
  function loadChartClass(index){
    if(chartClass[index].loaded) return ;

    var $container = $(".container").eq(index);
        cls = chartClass[index];
        optionList = [];

    for(var i=0;i<cls.charts.length;i++){
      var curOption = allChartsOption[cls.charts[i]];
      optionList.push(curOption);
    }

    buildChartHtml($container,optionList)
    chartClass[index].loaded = true;
  }

  function eventRegister(){
    //显示cantainer
    //并且加载chart class
    $(document).ready(function(){
      $('#daterange').daterangepicker({
        opens: "center",
        startDate:"2017-12-11",
        endDate:"2017-12-12",
        ranges: {
          '今天': [moment(), moment()],
          '昨天': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
          '最近一周': [moment().subtract(6, 'days'), moment()],
          '最近30天': [moment().subtract(29, 'days'), moment()],
          '本月': [moment().startOf('month'), moment().endOf('month')],
          '上个月': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
        },
        locale:{
        format: 'YYYY-MM-DD',
        applyLabel: '确认',
        cancelLabel: '取消',
        fromLabel: '从',
        toLabel: '到',
        weekLabel: 'W',
        daysOfWeek:["日","一","二","三","四","五","六"],
        monthNames: ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],
        customRangeLabel: '自选时间段'
      }
    },
      function(start, end, label){
        //选择日期后，触发更改person 图表方法
        refreshChart();
    })

    $("#myTab").dblclick(function(){
        //for test
    })

    $(".tab-self >li").click(function(){
      var i = $(this).index();
      if($(this).hasClass('active')) return ;

      $(".tab-self >li").removeClass('active')
      $(this).addClass('active')

      $('.container-self').css("display","none");
      $('.container-self').eq(i).css("display","block");

      if(i == 3){
        if(!$(".nav-pills li").hasClass('active'))
          $(".nav-pills li").eq(0).trigger("click");
      }else{
        loadChartClass(i);
      }
    });

    //客群统计类型切换
    //传入数据类型，用以读取或记录相应的表
    $(".nav-pills li").click(function(){
      var index = $(this).index(),
          dataType = "";

      if($(this).hasClass('active')) return ;
      //showmodal的nav
      if(index ==5){
        showModal();
        return;
      }

      $(".nav-pills li").removeClass('active');
      $(this).addClass('active');

      dataType = getActiveType();
      createPersonChart("#person-chart",llUrlBuild(dataType),dataType);
    })

    //modal 的确定按钮，触发刷新
    $("#sure-btn").click(function(){
        refreshChart();
    })


    //清除所有 active （enable 选择禁用 btn)
    $("#filter-reset").click(function(){
      $(".btn-group >label.btn-primary").removeClass("active");
      $(".enable-filter-group >label.btn-primary").eq(1).addClass("active");
    })

    $("#heat-link").tooltip();
  })
}

  //用于检测数据加载状态，关闭加载动画
  //触发第一次菜单点击
  function sync(){
    var count =0;
    var success = function(){
      $('.cloth').fadeOut(500,function(){
          $('.cloth').remove();
          $("#myTab li").eq(0).trigger('click');
          clearInterval(interv);
          console.log("success")
      })
    }

    return function(){
      console.log("infoCount..." + infoLoadedCount)
      console.log(count);

      count ++ ;
      if(infoLoadedCount == 2){
        success();
      }
      //等待循环次数，如果超出，则取本地数据
      if(count >= 20 && localStorage.allChartsOption){
        allChartsOption = $.parseJSON(localStorage.allChartsOption);
        success();
      }
    }
    //allChartsOption 加载完成后，调出第一个选项
  }

  //构建客群信息请求的URL
  function llUrlBuild(type){
    console.log(type)
    var type = type || "p",
        urlMod = remoteUrlList['ll'],
        mac = "e4:95:6e:4f:e9:95",
        dateStart = "2017-12-11",
        dateEnd = "2017-12-12",
        dataType = '',
        areaType = '',
        dateRangeV = $("#daterange").val().split(" - ");

    //扩展的查询字符串
    var sexQeury = "",
        ageQeury = "",
        incomeQeury = "",
        eduQuery = "",
        hadChildQuery = "",
        queryList = [] ;

    //时间范围
    if(dateRangeV.length == 2){
      dateStart = dateRangeV[0];
      dateEnd = dateRangeV[1];
    }

    if(type == "p"){
      dataType = '3',
      areaType = '1';
    }else if(type == "c"){
      dataType = '3',
      areaType = '2';
    }else if(type == "a"){
      //居住区域
      dataType = '1';
      areaType = '1';
    }else if(type == "o"){
      //办公区域
      dataType = '1';
      areaType = '0';
    }else if(type == "f"){
      dataType = '1';
      areaType = '3'
    }

    //查询参数
    //只有启用为active 才启用
    if($(".enable-filter-group >label.active").index(".enable-filter-group >label.btn-primary") == 0){

      //查看当前选中的active 的index
      var sexi = $(".sex-group > label.active").index(".sex-group >label.btn-primary") ,
          agei = $(".age-group > label.active").index(".age-group >label.btn-primary"),
          incomei = $(".income-group > label.active").index(".income-group >label.btn-primary") ,
          edui = $(".edu-group > label.active").index(".edu-group >label.btn-primary"),
          hadChildi = $(".had-child-group > label.active").index(".had-child-group >label.btn-primary");

      //性别筛选
      if(sexi != -1){
        sexQeury = "gender=";

        if(sexi == 0)
          sexQeury += "0";
        else if(sexi == 1)
          sexQeury += "1";
        queryList.push(sexQeury);
      }

      //年龄筛选
      if(agei != -1){
        ageQeury = "agebin="

        if(agei ==0)
          ageQeury += "9";
        else if(agei ==1)
          ageQeury += "8";
        else if(agei ==2)
          ageQeury += "7";
        else if(agei == 3)
          ageQeury += "6";
        else if(agei == 4)
          ageQeury += "5";
        queryList.push(ageQeury);
      }

      //收入筛选
      if(incomei != -1){
        incomeQeury = "income="

        if(incomei ==0)
          incomeQeury += "2";
        else if(incomei ==1)
          incomeQeury += "1";
        else if(incomei ==2)
          incomeQeury += "0";
        queryList.push(incomeQeury);
      }

      //文化程度筛选
      if(edui != -1){
        eduQuery = "edu=";

        if(edui ==0)
          eduQuery += "0";
        else if(edui == 1)
          eduQuery += "1";
        else if(edui == 2)
          eduQuery += "2";
        else if(edui == 3)
          eduQuery += "3";
        else if(edui == 4)
          eduQuery += "4";
        else if(edui == 5)
          eduQuery += "5";
        queryList.push(eduQuery);
      }

      //有无小孩筛选
      if(hadChildi != -1){
        hadChildQuery = "kids=";

        if(hadChildi == 0)
          hadChildQuery += "1";
        else if(hadChildi ==1)
          hadChildQuery += "0";
        queryList.push(hadChildQuery);
      }
    }

    //如果有扩展查询，则添加到url上
    if(queryList.length > 0)
      urlMod = urlMod + "?" + queryList.join("&");

    console.log(" tmp urlMod")
    console.log(urlMod);
    return urlMod.replace("{{mac}}",mac)
                 .replace("{{dataType}}",dataType)
                 .replace("{{areaType}}",areaType)
                 .replace("{{dateStart}}",dateStart)
                 .replace("{{dateEnd}}",dateEnd);
  }

  function init(){
    interv = setInterval(sync(),500)
    requestCircleCharts("app");
    requestCircleCharts("box");
    eventRegister();
  }
  init();
// createLLChart("#person-map-box");
})()
