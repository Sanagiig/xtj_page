(function(){
  var rowHtml = '<div id="row{{line}}" style="padding-bottom:20px;" class="row"></div>',
      chartsHtml = ' <div id="{{id}}" class="chart-bar  col-xs-5" style="min-width:300px;height:400px;"></div>';



  //一行显示多少个chart
  var oneLineChartLimit = 2,
      //数据获取的数量
      infoLoadedCount = 0,
      interv = null;

  // 散点图
  var option = {
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
        center: [104.114129, 37.550339],
        zoom: 5,
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
    var host = "http://120.79.24.113:9911"
    var localUrlList = {
      "box":"boxcharts.json",
      "app":"boxcharts.json"
    }

    var remoteUrlList = {
      "app":host + "/potr/getapplist/e4:95:6e:4f:e9:95/2017-12-11/2017-12-12",
      "box":host + "/potr/forbox/e4:95:6e:4f:e9:95/2017-12-11/2017-12-12",
      "ll":host + "/potr/getloc/{{mac}}/{{dataType}}/{{areaType}}/{{dateStart}}/{{dateEnd}}"
    }

    var m = "pro";

  //来源option
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
        barWidth : 20,
        barGap:5,
        data: []
    }]
};
  //当前的personOption
  var curPersonOrigOpt = $.extend(true,{},personOrigOption);
  //所有图表option
  var allChartsOption = {};



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
  function disposePersonLLResult(json,type){
    // var json = eval(json["loc"]),
    // r = [[
    //       //经纬度 + 值
    //       ]];

    // for(var i=0;i<json.length;i++){
    //   var j = json[i]
    //   r.push({name:"xx"+ i,value:[parseFloat(j.lng),parseFloat(j.lat),parseInt(j.count * 10000)]})
    // }

    // console.log(r);
    // return r;
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

        }
    }}
    var json = eval(json),
        r = [];
    for(var i=0;i<json.length;i++){
      var name = json[i].code;
      // if(name.indexOf("-") != -1) name = name.split("-")[1]
      r.push({
        name:name,
        value:parseFloat(json[i].count*100),
        itemStyle:data[type].itemStyle
      })
    }

    return r.reverse();
  }

  //请求 圆饼图的json，并将处理结果保存到 allChartsOption
  function requestCircleCharts(type){
    var url = remoteUrlList[type]
    if(url == '' || m == "test") url = localUrlList(type);

    $.getJSON(url,function(d){

      d = eval(d);
      var textStyle,title,datas,lineDom,chartDom,myChart,
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
        curOption = $.extend(true,{},option);


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
        console.log("local save !")
        localStorage.allChartsOption = JSON.stringify(allChartsOption);
    })
  }

  //使用curPersonOption 构建客群信息chart
  function buildPersonOrgHtml($container,opt){
    //查找经纬度 chartDom
    var chartDom = $("#person-chart").get(0);

    opt = opt || curPersonOrigOpt;
    if(chartDom.length == 0) chartDom = $("<div id='personLL' style='width:100%;height:100%;'></div>").get(0);
    chartDom.innerHtml = "";
    $container.append(chartDom);

    var myChart = echarts.init(chartDom);
    myChart.setOption(opt);
    //关闭加载动画
    $(".inner-animate-box").fadeOut(300);

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
        if(!$line) $line = $(rowHtml);
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

  function createLLChart($container,url,dataType){
      $container = $($container);
      var localTime = setTimeout(loadLocal,6000)
      $.getJSON(url,function(d){
        d = eval(d);
        console.log("createLLChart --->")
        console.log(d);
        var title,datas,lineDom,chartDom,myChart,
        success = d.data.success,
        errCode = d.data.errCode,
        errMsg = d.data.errMsg,
        result = d.data.result,
        curOption = curPersonOrigOpt;  //以curopt 为基准的目的是为了确认是否有对地图进行渲染操作

      console.log("createLLChart --->");
      console.log(errCode);
      console.log(success);
      console.log(errMsg);

      //处理result
      var mapData = disposePersonLLResult(result,"map"),
          barData = disposePersonLLResult(result,"bar");

      //设置option
      //地图只渲染一次
      if(curOption.series[0].data.length == 0) curOption.series[0].data = mapData ;
      curOption.series[1].data = barData ;
      curOption.yAxis[0].data = getValues(mapData,"name");
      curOption.legend.data = getValues(mapData,"name");

      //保存配置
      //用personChartOption_ + dataType 字符串表示客群来源数据
      localStorage["personChartOption_" + dataType] = JSON.stringify(curOption);
      //清除加载本地数据的计时器
      clearTimeout(localTime)
      buildPersonOrgHtml($container);
    })

    //如果超时则读取本地数据，然后再加载地图
    function loadLocal(){
      if(localStorage["personChartOption_" + dataType]){
        curPersonOrigOpt = $.parseJSON(localStorage["personChartOption_" + dataType]);
        console.log("personOrig 读取本地数据 >");
        buildPersonOrgHtml($container);
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
      console.log(cls.charts[i])
      var curOption = allChartsOption[cls.charts[i]];
      optionList.push(curOption);
    }

    buildChartHtml($container,optionList)
    chartClass[index].loaded = true;
  }

  function eventRegister(){
    //显示cantainer
    //并且加载chart class
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
      $(".nav-pills li").removeClass('active');
      $(this).addClass('active');
      if(index == 0)
        dataType = "p"
      else if(index == 1)
        dataType = "c"
      $(".inner-animate-box").show();
      createLLChart("#person-chart-continer",llUrlBuild(dataType),dataType);
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
      })
    }

    return function(){
      console.log("load..." + infoLoadedCount)
      console.log(count);
      count ++ ;
      if(infoLoadedCount == 2){
        success();
      }
      //等待循环次数，如果超出，则取本地数据
      if(count == 20 && localStorage.allChartsOption){
        allChartsOption = $.parseJSON(localStorage.allChartsOption);
        success();
      }
    }
    //allChartsOption 加载完成后，调出第一个选项
  }

  //构建客群信息请求的URL
  function llUrlBuild(type){
    var type = type || "p",
        urlMod = remoteUrlList['ll'],
        mac = "e4:95:6e:4f:e9:95",
        dateStart = "2017-12-11",
        dateEnd = "2017-12-12",
        dataType = '',
        areaType = '';

    if(type == "p"){
      dataType = '3',
      areaType = '1';
    }else if(type == "c"){
      dataType = '3',
      areaType = '2';
    }

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

