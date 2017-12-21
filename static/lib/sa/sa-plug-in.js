/*
* @Author: Sanagi
* @Date:   2017-12-01 15:49:58
* @Last Modified by:   Marte
* @Last Modified time: 2017-12-18 10:50:33
*/

// 公共方法


//之所以要用个函数设置 css 而不是用 dom.styleText 是为了防止 style样式冲突或异常覆盖问题
//虽然没遇到过╮(╯_╰)╭
function setStyle($ele,list){
  if(!$ele || ! list) return ;
  for(var i=0;i<list.length;i++){
    var l = list[i].split(":");
    $ele.css(l[0],l[1]);
  }
}

//数字滚动插件 2.0
//可以个性化配置
 ;(function($){
  $.fn.numberScroll = function(){
  var opt = {
      _w:"20",
      _h:"54",
      _numList:[],
      _number:"",
      _elWidth:"",
      _hasDot:true,
      _style:["list-style:none",
          "overflow: hidden",
          "display:block",
          "width:20px",
          "height:54px",
          "line-height:52px",
          "font-size:36px",
          "position:absolute",
          "left:0px",
          "right:0px",
          "top:0px",
          "bottom:0px",
          "margin: auto",
          "padding:0",
          "font-family: 'Microsoft YaHei'",
          "text-align:center",
          "color:#ffd323",
          "opacity:1",
          "background-color:rgba(0,0,0,0.6)",
      ]},
      options = {};

  // 返回_exe 形成闭包
  //为了兼容多个样式，改用闭包
  return function(command,arg,config){
    var that = this,id = that.attr("id");
    var init = function(n){
      opts._number = n;
      opts._numList = n.toString().split("");
      var numLen = opts._numList.length;
      opts._numList = numFormat(n);
      _build();

    }
    //num format 加逗号
    function numFormat(n){
      var numList = n.toString().split(""),
          numLen = numList.length;
      for(var i=numLen-1;i>=0;i--){
        var c = i + 1;
        if(opts._hasDot && numLen > 3){
          //判断什么时候应该加逗号
          if(c == numLen % 3 || ((c-numLen %3) >0 && (c-numLen%3)%3 ==0 ) && c != numLen) {
            numList.splice(c,0,",");
          }
        }
      }
      return numList
    }

    //生成html
    var _build = function(){
      var liHtml = '<li class="num" style="left:{{l}}px;width:{{w}}px; height:1000%;position:absolute;">{{div}}</li>'
          .replace("{{w}}",opts._w),
        liDotHtml = '<li class="dot" style="left:{{l}}px;width:{{w}}px; height:100%;position:absolute;">&#44;</li>'
          .replace("{{w}}",opts._w),
         divHtml = '<div style="width:100%;height:10%">{{num}}</div>'
          .replace("{{w}}",opts._w).replace("{{h}}",opts._h);

      var li="",
          div="";

      var numLen = opts._numList.length;
      for(var j=0;j<10;j++){
            div += divHtml.replace("{{num}}",j)
      }
      for(var i=0;i<opts._numList.length;i++){
        if(opts._numList[i] === ","){
          li+= liDotHtml.replace("{{l}}",i*opts._w ).replace("{{w}}",opts._w);
        }
        else{
          li += liHtml.replace("{{l}}",i*opts._w).replace("{{w}}",opts._w).replace("{{div}}",div);
        }

      }
      that.html("");
      that.append(li);
      setStyle(that,opts._style);
      that.css({width:that.find(">li").length * opts._w + "px"})
      that.fadeIn(1000,function(){
        _move();
      });
    }

    //设置数字
    var setNum = function(num){
      var nList = numFormat(num);

      if(that.find(">li").length != nList.length){
        that.fadeOut(1000,function(){
            opts._numList = nList;
            init(num);
            _move();
        })
      }else{
        opts._numList = nList;
        _move();
      }
    }

    //移动
    var _move = function(speed){
      speed = speed || 1000
      for(var i=0;i<opts._numList.length;i++){
        var n = parseInt(opts._numList[i]);

        if(n == NaN) continue ;
        that.find(">li").eq(i).animate({"top":-n*opts._h +"px"},speed);
      }
    }


    //初始化该插件的配置（不同插件可存储不同配置）
    //_style 配置需要将新旧组合起来
    //id 用来标识插件的ID 和配置
    var id = that.attr("id");
    if(command == "init" || arguments.length ==0){
      var stylelist = config&&config._style?[].concat(opt._style,config._style):opt._style;
      //懒得修改opts
      opts = options[id] = $.extend({},opt,config,{_style:stylelist});
      num = parseInt(arg) || 0;
      init(num);
    }
    if(command == "set"){
      num = parseInt(arg) || 0;
      opts = options[id];
      setNum(num);
    }else{
      return ;
    }
    return that;
  }
}();
})($);

//滚动广告栏
;(function($){
  $.fn.sa_carousel = function(){
    var style = [
          "width:100%",
          "height:100%",
          "overflow:hidden",
          "position:relative",
        ],
        item_style = [
          "position:absolute",
          "height:100%",
        ],
        item_inner_style = [
          "position:relative",
          "padding-left:10px",
          "padding-right:10px",
          "margin:0 auto",
          "height:100%",
          "float:left",
        ],


        styleList = {},
        item_StyleList = {},
        item_InnerStyleList = {},
        innerLimit = {},
        w = {},     //各个 carousel box 的宽度
        index = {}, // carousel 标识
        intervalTime = {},
        direct = {},  //移动方向
        interv = {}; //自动翻滚的计时器

    //html 样式
    var carHtml = '<div class="sa-carousel"></div>',
        carItemHtml = '<div class="sa-carousel-item"></div>',
        carItemInnerHtml = '<div class="sa-carousel-item-inner"></div>';

    //插件主函数
    function main(command,args){
      var that = this,
          id = that.attr("id");

      w[id] = that.width();
      innerLimit[id] = 3;

      function init(option){
        var $carousel = $(carHtml);

        console.log($carousel);
        if(!id && id!=0) {
          console.log("sa-carousel id 不存在")
          return ;
        }
        styleList[id]  = [].concat(style);
        item_StyleList[id] = [].concat(item_style);
        item_InnerStyleList[id] = [].concat(item_inner_style);
        index[id] = 0;
        intervalTime[id] = 6000;
        direct[id] = "left";


        if(option){
          for(key in option){
            if("style" == key){
              $(styleList[id],option.style);
            }
            else if("item_style" == key){
              $(item_StyleList,option["item_style"]);
            }
            else if("item_inner_style" == key){
              $(item_InnerStyleList[id],option["item_inner_style"]);
            }
            //调用编译器，查看key 是否属于可用参数
            else if(eval(key) != "undefined"){
              eval(key)[id] = option[key];
            }else{
              console.log("sa-carousel 未能识别参数> "+key);
            }
          }
        }

        that.html(" ");
        setStyle($carousel,styleList[id])
        that.append($carousel);
        interv[id] = setInterval(autoMove,intervalTime[id])
      }

      //移动，并清除空inner
      function autoMove(){
        clearEmptyInner() //每次移动先把空的 inner 清除
        var $item = $(".sa-carousel-item"),
              $itemInner = $item.find(".sa-carousel-item-inner")
          //只有当内容大于一页的时候才翻转
          if($itemInner.length > innerLimit[id]){
            //往左边移动，并且判断是否到达边界
            //如果到达边界则会跳转到另一边
            if(direct[id] == "left"){
              index[id]++;
              if(index[id] >= Math.ceil($itemInner.length /innerLimit[id]) ){
                index[id] = 0;
              }
            }else if(direct[id] == "right"){
              index[id]--;
              if(index[id] < 0){
                index[id] = $item.length - 1;
              }
            }
            $item.animate({"left":-index[id] *w[id] + "px"})
          }
      }

      //清除空的 inner
      //清除空 inner 的同时会重新定位到 left:0px;
      //这是为了防止删除多个inner 时 ，卡住
      function clearEmptyInner(){
        $inners = that.find(".sa-carousel-item-inner");
        for(var i=0;i<$inners.length;i++){
          if($inners.eq(i).find(">*").length == 0){
            $inners.eq(i).remove();
            that.find(".sa-carousel-item").css("left","0px");
          }
        }
      }

      //添加 元素，并给元素套上 inner标签
      function add($el,i){
        var $carousel = that.find(".sa-carousel"),
            $item = $carousel.find(".sa-carousel-item"),
            $inner = $(carItemInnerHtml);

        if($carousel.length < 1) return ;
        //取得i对应的item
        if($item.length == 0){
          $item = $(carItemHtml);
          setStyle($item,item_StyleList[id]);
          $carousel.append($item);
        }


        $inner.append($el);
        $item.append($inner);
        setStyle($inner,item_InnerStyleList[id]);

        $inner.css("width",w[id] / innerLimit[id]);
        $item.css("width",that.find(".sa-carousel-item-inner").length*w[id]);
      }

      function remove(i){
        that.find(".sa-carousel-item-inner").eq(i).remove();
      }

    if(command == "add" ){
        add(args);
      }else if(command == "remove"){
        remove(args);
      }else if(command == "init"){
        init();
      }
      return that;
    }

    return main;
  }();
})($);

