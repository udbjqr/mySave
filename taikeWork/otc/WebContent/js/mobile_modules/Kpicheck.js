

var url = "/otcdyanmic/goods.do";
var currturl = window.location.href;  //获取当前url


var Kpicheck = React.createClass({
    getInitialState: function () {
        return {
            Y_login: true,  //是否登录
            isshow:"",
            referrer:topreurl("index.html"), //上一页
            Totalscore: "90"  //总得分呢
        };
    },
    componentDidMount: function () {

         
      
        
        var totalscore=$('.totalscore').html();
        var totalscoreR=$('.totalscoreR').html();
        
        $('#myStat4').circliful();
        $('#myStat1').circliful();
        
 
        
        $(window).resize(function () {

            $('.totalscore').html(totalscore);
            $('.totalscoreR').html(totalscoreR);
            $('#myStat4').circliful();
            $('#myStat1').circliful();
        });

    },
    toreferrer: function () {
        setTimeout(function () {
            var searchinfo = {
                'Kpishowtype': "Kpiinquire",
            }

            PubSub.publish('changtype', searchinfo);
            sessionStorage.setItem("Kpishowtype", "Kpiinquire");
        }, 320)

    },
    render: function () {
        var htmlval = "<div class='talscoretext'><h2>总得分</h2><font>" + this.state.Totalscore + "</font><em>分</em></div>";
        var htmlval1 = "<div class='talscoretext1'><font>75</font><em>分</em></div>";
        return (
            <div>
                <div className="profile white" id="pagenav">
                    <span className="toleft" onTouchEnd={this.toreferrer}> <a href={"javascript:void(0)"}></a></span>
                    KPI考核
                    {/*<span className="toregulate">校正</span>*/}
                </div>


              
                
                <div className="KpicheckCont">
                <div className="totalscore  white">

                    <div id="myStat4" data-dimension="14" data-text={htmlval} data-info="New Clients" data-width="4" data-fontsize="3" data-percent={this.state.Totalscore} data-fgcolor="#61a9dc" data-bgcolor="#eee"></div>
                </div>
                <div className="talscorelegend  white">
               <p>*销售总额分值占40%</p>
                <p>陈列面，陈列数，平均加价权、铺点数分值</p>
             </div>

             <div className="totalscoreList white" ref="totalscoreList" id="totalscoreList">
             <h2 className="customer_title">邦迪防水创口贴5片</h2>
             <div className="totalscoreCont">
             <div className="totalscoreL">
             <p><span className="talsname">陈列面</span><span className="talsaims">目标：<font>10</font></span ><span className="talsreal">实际：<font>5</font></span></p>
             <p><span className="talsname">陈列数</span><span className="talsaims">目标：<font>40</font></span ><span className="talsreal">实际：<font>35</font></span></p>
             <p><span className="talsname">总销售额</span><span className="talsaims">目标：<font>20,000</font></span ><span className="talsreal">实际：<font>15,000</font></span></p>
             <p><span className="talsname">平均加价权</span><span className="talsaims">目标：<font>15</font></span ><span className="talsreal">实际：<font>10</font></span></p>
             <p><span className="talsname">铺点数</span><span className="talsaims">目标：<font>400</font></span ><span className="talsreal">实际：<font>350</font></span></p>
             </div>
             <div className="totalscoreR">
             <div id="myStat1" data-dimension="6.5" data-text={htmlval1} data-info="New Clients" data-width="2" data-fontsize="1" data-percent="75" data-fgcolor="#09B23B" data-bgcolor="#eee"></div>
             </div>
             
             </div>
           </div>


            </div>
                
            </div>
        );
    }
});
module.exports = Kpicheck;





