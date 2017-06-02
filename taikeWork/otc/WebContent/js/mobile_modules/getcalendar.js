; !
    function (a) {
        
        a.Mycalendar = function (currYear,currmonth,currday) {

           // var currYear =parseInt((new Date()).getFullYear());
           // var currmonth =parseInt(addzerro((new Date()).getMonth() + 1));
            //var currday =parseInt(addzerro((new Date()).getDate()));
            
             if(currYear=="" || currYear==undefined || currYear==null){  
                currYear =parseInt((new Date()).getFullYear());
               }
                           
             if(currmonth=="" || currmonth==undefined || currmonth==null){  
               currmonth =addzerro((new Date()).getMonth() + 1);
               }
               else{
                 currmonth=addzerro(currmonth);
                 
               }
                    
             if(currday=="" || currday==undefined || currday==null){  
               currday =addzerro((new Date()).getDate());
               
               }
               else{
                    currday=addzerro(currday);
                    
               }
        
        
            
            
            //获取本月最后一天
            var LastDay = parseInt(getLastDay(currYear, currmonth))

            //alert(LastDay);
            //判断开始填充的框数量
            
            var calendar1 = ""
            calendar1 += ' <div className="white selectdate fn-hide">';
            calendar1 += '<input type="text" name="appDate" id="appDate" ref="appDate" placeholder="请选择日期" />';
            calendar1 += '</div>';
            calendar1 += '<div  class="client_month white margint_1r borderb_1r fn-hide1">';
            calendar1 += '<span class="monthico" id="parent"></span>';
            calendar1 += '<span class="curryear" ref="curryear"  data-year="' + currYear + '">' + parseInt(currYear) + '年</span>';
            calendar1 += '<span class="currmonth" ref="currmonth" data-month="' + currmonth + '">' + changecapital(parseInt(currmonth)) + '月</span>';
            calendar1 += '<span class="monthico" id="next" ></span>';
            calendar1 += '</div>';
            
             $(".calendar").html(calendar1);
              $("#appDate").val(currYear+"-"+currmonth+"-"+currday);

            var calendar = ""
              var showyears=parseInt($(".curryear").attr("data-year")); //当前年份
              var showmonths=parseInt($(".currmonth").attr("data-month")); //当前月份
               var currentweek=parseInt(getweek(currYear + "-" + currmonth+"-" +currday, 2)) //当前日期的星期数
             
             //通过当前日期获取当前日期所在列表的第一个日期
              var first_day=currday-currentweek;
              
              var getcurrentday=getfullday(currYear,currmonth,first_day);
              var getyear=getcurrentday.year;
              var getmonth=getcurrentday.month;
              var getday=getcurrentday.day;
            

            calendar += '<div class="calendarlist white">';
            calendar += '<div class="calendartitle white"><span>日</span><span>一</span><span>二</span><span>三</span><span>四</span><span>五</span><span>六</span></div>';
            calendar += '<div class="calendarcont white swiper-container">'
            calendar += '<div class="calendarmain swiper-wrapper">';
            calendar += '<div class="calendars swiper-slide">'
           // calendar += daylist(getparentyear,getparentmonth,getparentday);  //上一周
            calendar += '</div>'
            calendar += '<div class="calendars swiper-slide">'
            calendar += daylist(getyear,getmonth,getday,"current");
            calendar += '</div>'
            calendar += '<div class="calendars swiper-slide">'
           // calendar += daylist(getnextyear,getnextmonth,getnextday); //下一周
            calendar += '</div>'
             
            calendar += '</div>';
            calendar += '</div>';
            calendar += '</div>';
            $(".calendar").append(calendar);
             
             var  calendartitleW1=$(".calendartitle").width();
            //设置单个日期宽度
           setcalendarboxW();





             //获取上一周首天

             $(".calendarmain .calendars:eq(0)").html(daylist(getyear,getmonth,getday,"parent"));
          //设置单个日期宽度
           setcalendarboxW();

           //获取下一周首天
           $(".calendarmain .calendars:eq(2)").html(daylist(getyear,getmonth,getday,"next"));
            //设置单个日期宽度
           setcalendarboxW();
            
         
          




         //滑动拖拽
       var mySwiper = new Swiper('.swiper-container', {
        observer:true,
        preventLinksPropagation : false,
	   onInit: function(swiper){
        $(".calendarmain").css("transform"," translate3d(-"+calendartitleW1+"px, 0px, 0px)"); 
        swiper.activeIndex=1
      //Swiper初始化了
      //alert(swiper.activeIndex);提示Swiper的当前索引
     },
    
    onSlideChangeEnd: function(swiper){

        var years=parseInt($(".curryear").attr("data-year"));
        var months=parseInt($(".currmonth").attr("data-month"));
    //向右滑动
     if((swiper.touches.currentX - swiper.touches.startX) > 0){
         
        var year_first=parseInt($(".calendarmain .calendars:eq(0)").find("span:first").attr("data-year"));
        var month_first=parseInt($(".calendarmain .calendars:eq(0) ").find("span:first").attr("data-month"));
        var day_first=parseInt($(".calendarmain .calendars:eq(0)").find("span:first").html());
        var currentm_first=$(".calendarmain .calendars:eq(0)").find("span:first").attr("data-currentm")

       
        var isBegin=mySwiper.isBeginning
         if(isBegin==true){  //滑动到第一层
        //alert("最上方");
        
        $(".calendarmain .calendars:eq(2)").remove();
        $(".calendarmain").prepend('<div class="calendars swiper-slide"></div>');
        $(".calendarmain").css("transform"," translate3d(-"+calendartitleW1+"px, 0px, 0px)"); 
        swiper.activeIndex=1
        
         $(".calendarmain .calendars:eq(0)").html(daylist(year_first,month_first,day_first,"parent"));

         setcalendarboxW();
         
    

         }

         if(isBegin==false){
         //alert("不是最上方");
         }

          //设置上面年月日
          settime(1);
     } 
      //向右滑动结束
    

     //向左滑动
     if((swiper.touches.currentX - swiper.touches.startX) <0){
         
     var year4=parseInt($(".calendarmain .calendars:eq(2)").find("span:first").attr("data-year"));
     var month4=parseInt($(".calendarmain .calendars:eq(2)").find("span:first").attr("data-month"));
     var day4=parseInt($(".calendarmain .calendars:eq(2)").find("span:first").html());
      var currentweek=parseInt( getweek(year4 + "-" + month4+"-" +day4, 2))
      
       var isEnd=mySwiper.isEnd

        if(isEnd==true){
            //末尾
            $(".calendarmain .calendars:eq(0)").remove();
            $(".calendarmain").append('<div class="calendars swiper-slide"></div>'); 
            $(".calendarmain").css("transform"," translate3d(-"+calendartitleW1+"px, 0px, 0px)"); 
            swiper.activeIndex=1
          $(".calendarmain .calendars:eq(2)").html(daylist(year4,month4,day4,"next"));
          setcalendarboxW();
        }
       if(isEnd==false){
            //不是末尾
       }

         //设置上面年月日
         settime(1);
     } 
     
     //向左滑动结束

     
    }
  
    
       })

         
          //





            //点击上月
            $(".client_month").delegate('#parent', 'touchend', function () {
                var currYear = parseInt($(".curryear").attr("data-year"));
                var currmonth = parseInt($(".currmonth").attr("data-month"));
                var parentyear="";
                var parentmonth="";
                //alert(currmonth);
                if (currmonth == 1) {
                    $(".curryear").html(currYear - 1 + "年 ");
                    $(".currmonth").html(changecapital("12") + "月");
                    $(".curryear").attr("data-year", currYear - 1);
                    $(".currmonth").attr("data-month", 12);
                    
                  
                }
                else {
                    $(".curryear").html(currYear + "年 ");
                    $(".currmonth").html(changecapital(currmonth - 1) + "月");
                    $(".curryear").attr("data-year", currYear);
                    $(".currmonth").attr("data-month", currmonth - 1);
                      
                  
                    
                   
                }

               //设置列表
               var currYearnew = parseInt($(".curryear").attr("data-year"));
               var currmonthnew = parseInt($(".currmonth").attr("data-month"));
               var thistweek =parseInt( getweek(currYearnew+ "-" + currmonthnew + "-"+"01", 2)) //获取1号是星期几
                
                $(".calendarmain .calendars:eq(1)").html(daylist(currYearnew,currmonthnew,1-thistweek,"current"));
                
                var firstdays=parseInt($(".calendarmain .calendars:eq(1)").find("span:first").html());
                var firstmonth=parseInt($(".calendarmain .calendars:eq(1)").find("span:first").attr("data-month"));
                var firstyear=parseInt($(".calendarmain .calendars:eq(1)").find("span:first").attr("data-year"));

           
                  
                 $(".calendarmain .calendars:eq(0)").html(daylist(firstdays,firstmonth,firstyear,"parent"));
                 $(".calendarmain .calendars:eq(2)").html(daylist(firstdays,firstmonth,firstyear,"next"));
                $(".calendarmain").css("transform"," translate3d(-"+calendartitleW1+"px, 0px, 0px)"); 
                 mySwiper.activeIndex=1
                setcalendarboxW();
            });

            //点击下月
            $(".client_month").delegate('#next', 'touchend', function () {
                var currYear = parseInt($(".curryear").attr("data-year"));
                var currmonth =parseInt( $(".currmonth").attr("data-month"));
                //alert(currmonth);
                if (currmonth == 12) {
                    $(".curryear").html(parseInt(currYear) + 1 + "年 ");
                    $(".currmonth").html(changecapital("1") + "月");
                    $(".curryear").attr("data-year", parseInt(currYear) + 1);
                    $(".currmonth").attr("data-month", 1);
                     
                    var thistweek1 =parseInt( getweek(currYear + 1+ "-" + "1" + "-"+"01", 2))
                    var nextweekday1=1+(7-thistweek1);
                    $(".calendarmain .calendars:eq(0)").html(daylist(currYear,12,31,"parent"));
                    $(".calendarmain .calendars:eq(1)").html(daylist(currYear+ 1,1,1,"current"));
                    $(".calendarmain .calendars:eq(2)").html(daylist(currYear +1,1,nextweekday1,"next"));
                    $(".calendarmain").css("transform"," translate3d(-"+calendartitleW1+"px, 0px, 0px)"); 
                    mySwiper.activeIndex=1
                    
                    setcalendarboxW();
                }
                else {
                    $(".curryear").html(currYear + "年 ");
                    $(".currmonth").html(changecapital(parseInt(currmonth) + 1) + "月");
                    $(".curryear").attr("data-year", parseInt(currYear));
                    $(".currmonth").attr("data-month",  parseInt(currmonth) + 1);

                    var thistweek =parseInt(getweek(currYear+ "-"+ (currmonth+1) + "-"+"01", 2))
                    var nextweekday=1+(7-thistweek);
                    
                     $(".calendarmain .calendars:eq(0)").html(daylist(currYear,currmonth,31,"parent"));
                     $(".calendarmain .calendars:eq(1)").html(daylist(currYear,currmonth+1,1,"current"));
                     $(".calendarmain .calendars:eq(2)").html(daylist(currYear,currmonth+1,nextweekday,"next"));
                     $(".calendarmain").css("transform"," translate3d(-"+calendartitleW1+"px, 0px, 0px)"); 
                     mySwiper.activeIndex=1
                     setcalendarboxW();
                }

                     //设置列表
                    var currYearnew = parseInt($(".curryear").attr("data-year"));
                    var currmonthnew = parseInt($(".currmonth").attr("data-month"));
                    var thistweek =parseInt( getweek(currYearnew+ "-" + currmonthnew + "-"+"01", 2)) //获取1号是星期几
                    $(".calendarmain .calendars:eq(1)").html(daylist(currYearnew,currmonthnew,1-thistweek,"current"));
                     
                    var firstdays=parseInt($(".calendarmain .calendars:eq(1)").find("span:first").html());
                    var firstmonth=parseInt($(".calendarmain .calendars:eq(1)").find("span:first").attr("data-month"));
                    var firstyear=parseInt($(".calendarmain .calendars:eq(1)").find("span:first").attr("data-year"));

                      $(".calendarmain .calendars:eq(0)").html(daylist(firstyear,firstmonth,firstdays,"parent"));
                    
                     $(".calendarmain .calendars:eq(2)").html(daylist(firstyear,firstmonth,firstdays,"next"));

                    $(".calendarmain").css("transform"," translate3d(-"+calendartitleW1+"px, 0px, 0px)"); 
                     mySwiper.activeIndex=1
                     setcalendarboxW();
                      
            });

       

        }


       

    


//显示日期
 var daylist=function(year,month,day,type){
year=parseInt(year);
month=parseInt(month);
day=parseInt(day);

 var years1=parseInt($(".curryear").attr("data-year"));
 var months1=parseInt($(".currmonth").attr("data-month"));
dayslist="";

//当前星期
if(type=="current"){
 for(var i=0;i<=6;i++){ 
      var days=day+i;
    
    //获取列表
     var getdaylist=getfullday(year,month,days);
      var listyear=getdaylist.year;
      var listmonth=getdaylist.month;
      var listday=getdaylist.day;
      var currentdays=curretcss(listyear,listmonth,listday)
      if(listmonth!=months1){
      dayslist += '<span class="nocreentcolor '+currentdays+'" data-domonth='+months1+' data-currentm="0" data-year="'+listyear+'" data-month="'+listmonth+'">'+listday+'</span>';
      }
      if(listmonth ==months1){
      dayslist += '<span class="calendar '+currentdays+'" data-domonth='+months1+'  data-currentm="1"  data-year="'+listyear+'" data-month="'+listmonth+'">'+listday+'</span>';
      }
    }
return dayslist;
}

//当前星期结束


//上一星期
if(type=="parent"){
 
var daysnext=parseInt($(".calendarmain .calendars:eq(1) ").find("span:first").html());
var monthnext=parseInt($(".calendarmain .calendars:eq(1)").find("span:first").attr("data-month"));
var yearnext=parseInt($(".calendarmain .calendars:eq(1)").find("span:first").attr("data-year"));
var currentmnext=parseInt($(".calendarmain .calendars:eq(1)").find("span:first").attr("data-currentm"));

var dayslist="";   
var domonth="";
 if(currentmnext=="0"){
    domonth=monthnext;
    
   for(var i=0;i<=6;i++){ 
    var daynow=daysnext+i;  
      var getdaylist=getfullday(yearnext,monthnext,daynow);
      var listyear=parseInt(getdaylist.year);
      var listmonth=parseInt(getdaylist.month);
      var listday=parseInt(getdaylist.day);
      var currentdays=curretcss(listyear,listmonth,listday)
      if(listmonth==domonth){ 
      dayslist += '<span class="calendar '+currentdays+'" data-domonth='+domonth+'  data-currentm="1"  data-year="'+listyear+'" data-month="'+listmonth+'">'+listday+'</span>';
      }
      if(listmonth !=domonth){ 
     dayslist += '<span class="nocreentcolor '+currentdays+'" data-domonth='+domonth+'  data-currentm="0" data-year="'+listyear+'" data-month="'+listmonth+'">'+listday+'</span>';
      }
   }
return dayslist;
 }
 if(currentmnext!="0"){
      if(daysnext-1>0){
       domonth=monthnext;
      }
      if(daysnext-1==0){

      if(monthnext-1<=0){
      domonth="12";
      }
      if(monthnext-1>0){
       domonth=monthnext-1;  
      }
    
     }
      for(var i=0;i<=6;i++){ 
      var daynow=(daysnext-7)+i;  
      var getdaylist=getfullday(year,month,daynow);
      var listyear=parseInt(getdaylist.year);
      var listmonth=parseInt(getdaylist.month);
      var listday=parseInt(getdaylist.day);
      var currentdays=curretcss(listyear,listmonth,listday)
       if(listmonth==domonth){ 
      dayslist += '<span class="calendar '+currentdays+'" data-domonth='+domonth+'  data-currentm="1"  data-year="'+listyear+'" data-month="'+listmonth+'">'+listday+'</span>';
      }
      if(listmonth !=domonth){ 
     dayslist += '<span class="nocreentcolor '+currentdays+'" data-domonth='+domonth+' data-currentm="0" data-year="'+listyear+'" data-month="'+listmonth+'">'+listday+'</span>';
      }
      }
return dayslist;


 }




}
//上一星期结束

 //下一星期

 if(type=="next"){
var daysnext=parseInt($(".calendarmain .calendars:eq(1)").find("span:last").html());
var monthnext=parseInt($(".calendarmain .calendars:eq(1)").find("span:last").attr("data-month"));
var yearnext=parseInt($(".calendarmain .calendars:eq(1)").find("span:last").attr("data-year"));
var currentmnext=parseInt($(".calendarmain .calendars:eq(1)").find("span:last").attr("data-currentm"));
var dayfirst=parseInt($(".calendarmain .calendars:eq(1)").find("span:first").html());
var dayslist="";   
var domonth="";

if(currentmnext=="0"){
    domonth=monthnext;
     var daysfirst=parseInt($(".calendarmain .calendars:eq(1)").find("span:first").html());
     var monthfirst=parseInt($(".calendarmain .calendars:eq(1)").find("span:first").attr("data-month"));
      var yearfirst=parseInt($(".calendarmain .calendars:eq(1)").find("span:first").attr("data-year"));
     var currentmfirst=parseInt($(".calendarmain .calendars:eq(1)").find("span:first").attr("data-currentm"));
     
    for(var i=0;i<=6;i++){ 
    var daynow=daysfirst+i;  
      var getdaylist=getfullday(yearfirst,monthfirst,daynow);
      var listyear=parseInt(getdaylist.year);
      var listmonth=parseInt(getdaylist.month);
      var listday=parseInt(getdaylist.day);
      var currentdays=curretcss(listyear,listmonth,listday)
      if(listmonth==domonth){ 
      dayslist += '<span class="calendar '+currentdays+'" data-domonth='+domonth+'  data-currentm="1"  data-year="'+listyear+'" data-month="'+listmonth+'">'+listday+'</span>';
      }
      if(listmonth !=domonth){ 
     dayslist += '<span class="nocreentcolor '+currentdays+'" data-domonth='+domonth+'  data-currentm="0" data-year="'+listyear+'" data-month="'+listmonth+'">'+listday+'</span>';
      }
   }
return dayslist;
}
 //获取本月最后一天

 var LastDay = parseInt(getLastDay(yearnext, monthnext));
 
if(currentmnext!="0"){
    
      if(daysnext<LastDay){
       domonth=monthnext;
      }
      if(daysnext==LastDay){
      
        if(monthnext+1>12){
        domonth=1;
        }
         if(monthnext+1<=12){
            domonth=monthnext+1;
         }
      }

   for(var i=0;i<=6;i++){ 
      var daynow=(daysnext+1)+i;
      var getdaylist=getfullday(yearnext,monthnext,daynow);
      var listyear=parseInt(getdaylist.year);
      var listmonth=parseInt(getdaylist.month);
      var listday=parseInt(getdaylist.day);
      var currentdays=curretcss(listyear,listmonth,listday)
       if(listmonth==domonth){ 
      dayslist += '<span class="calendar '+currentdays+'" data-domonth='+domonth+'  data-currentm="1"  data-year="'+listyear+'" data-month="'+listmonth+'">'+listday+'</span>';
      }
      if(listmonth !=domonth){ 
     dayslist += '<span class="nocreentcolor '+currentdays+'" data-domonth='+domonth+' data-currentm="0" data-year="'+listyear+'" data-month="'+listmonth+'">'+listday+'</span>';
      }
      }
     return dayslist;

}




 }
 
 //下一星期结束

 }


//获取返回当前日期csss

var curretcss=function(year,month,day){
   var activedaytime=$("#appDate").val().split("-");
   var activeyear= parseInt(activedaytime[0]);
   var activemonth= parseInt(activedaytime[1]);
    var activeday= parseInt(activedaytime[2]);
   
    if(activeyear==year && activemonth==month && activeday==day){
  
    return "currentday";
    }
    else{
       
        return "";
    }
  
}




 //设置单个日期宽度
var setcalendarboxW=function(){
 var  calendartitleW=$(".calendartitle").width();
            var calendarboxW= calendartitleW/7;
            $(".calendarmain").css("width",parseInt(calendartitleW)*3+"px");
             $(".calendars").css("width",parseInt(calendartitleW)+"px");
            $(".calendartitle span").css("width",parseInt(calendarboxW)+"px");
            
            $(".calendars span").css("width",parseInt(calendarboxW)+"px");     
             $(".calendarmain").css("transform"," translate3d(-"+calendartitleW+"px, 0px, 0px)");      
}
  

/*


//根据特定年月获取日期


*/
getfullday=function(currentyear,currentmonth,day){

currentyear=parseInt(currentyear);
currentmonth=parseInt(currentmonth);
day=parseInt(day);


//获取本月最后一天
var LastDay = parseInt(getLastDay(currentyear, currentmonth))
//获取上月最后一天
var parentLastDay = parseInt(getLastDay(currentyear, currentmonth-1))

var dayinfo="";
if(day<1){

if(currentmonth==1){
    dayinfo={
    "year":currentyear-1,
    "month":"12",
    "day":parentLastDay+day
    }
    return dayinfo;
}

if(currentmonth!=1){
dayinfo={
    "year":currentyear,
    "month":currentmonth-1,
    "day":parentLastDay+day
    }
    return dayinfo;

}

}


if(day>LastDay){
if(currentmonth==12){
    dayinfo={
    "year":currentyear+1,
    "month":"1",
    "day":day-LastDay
    }
    return dayinfo;
}

if(currentmonth!=12){
dayinfo={
    "year":currentyear,
    "month":currentmonth+1,
    "day":day-LastDay
    }
    return dayinfo;
}

}


if(day>=1 && day<=LastDay){
dayinfo={
    "year":currentyear,
    "month":currentmonth,
    "day":day
    }
    return dayinfo;

}
}




 //设置上面年月日
//calendar
  function settime(z){
     var year2=parseInt($(".calendarmain .calendars:eq("+z+")").find("span:last").attr("data-year"));
     var month2=parseInt($(".calendarmain .calendars:eq("+z+")").find("span:last").attr("data-month"));
     var day2=parseInt($(".calendarmain .calendars:eq("+z+")").find("span:last").html());
     var currentm=$(".calendarmain .calendars:eq("+z+")").find("span:last").attr("data-currentm")
   
   var domonths=parseInt($(".calendarmain .calendars:eq("+z+")").find("span:last").attr("data-domonth"));
       
       $(".currmonth").html(changecapital(domonths)+"月") 
       $(".currmonth").attr("data-month",domonths)

    if(currentm=="0"){

     


    if(month2==1){
           $(".curryear").html(year2-1+"年");   
        
            $(".curryear").attr("data-year",year2-1)
           }
           else{
             $(".curryear").html(year2+"年");
              $(".curryear").attr("data-year",year2)      
          
           }

            }

if(currentm=="1"){
 $(".curryear").html(year2+"年");
 $(".curryear").attr("data-year",year2)      
 
}
 
  }
 //设置上面年月日结束



    } (window);    