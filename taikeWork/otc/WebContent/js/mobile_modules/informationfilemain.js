import React from 'react'
import { render } from 'react-dom'
import Userlist from '../../js/mobile_modules/islogin.js'
import zepto from '../../js/mobile/dev/zepto/zepto.min.js'
import fontsize from '../../js/mobile/fontsize.js'
import layer from '../../js/mobile/layer/layer.js'

var url = "/otcdyanmic/documents.do";
var isplayNum=0;
var Informationfile = React.createClass({
    getInitialState: function () {
        return {
            Y_login: true,  //是否登录
            isclick: true,
            referrer: topreurl("index.html"), //上一页
            value: isnull(this.props.value),
            isload: false,
            moreload: false,
            page: "",
            isnextpage: "",
            json: [],
            showtype: 1,
            playbegintime: "",
            playendtime: "",
            Columns: isnull(geturl('Columns'))
        };
    },
    componentDidMount: function () {
        var $this = this;
        if (this.state.Columns != "informationfile") {  //搜索不显示初始值
            this.getinfo(1, 1, this.state.value);
            setTimeout(function () {
                if ($this.state.isload == true && $this.state.moreload == false) {
                    $this.refs.flielist.innerHTML = loading;
                }
            }, 500);
        }





        $("#flielist").delegate('#loadmore', 'click', function () {

            $this.setState({
                moreload: true,
            });


            setTimeout(function () {

                if ($this.state.moreload == true && $this.state.isload == false) {
                    $("#loadmore").html(loadingmore);
                    //$this.refs.loadmore.innerHTML = loadingmore;
                }
            }, 500);

            $this.loadmore();
        });

        //接收搜索数据
        this.pubsub_token = PubSub.subscribe('changsearch', function (topic, newItem) {
            this.setState({
                value: newItem.searchname,
            });
            this.onSubmit();
        }.bind(this));
        //接收搜索数据   
    },
    //清除接收搜索数据
    componentWillUnmount: function () {
        PubSub.unsubscribe(this.pubsub_token);
    },

    //搜索
    onSubmit: function () {
        var $this = this;
        var searchname = this.state.value;

        layer.open({
            content: "搜索中",
            shade: false,
            skin: 'msg',
            className: 'tip',
        });

        //设置是搜索还是查询
        if (searchname == "") {
            this.setState({
                showtype: 1,
                json: [],
            });
        }
        else {
            this.setState({
                showtype: 2,
                json: [],
            });
        }
        //设置是搜索还是查询结束




        setTimeout(function () {
            if ($this.state.isclick) {
                $this.setState({  //禁止点击
                    isclick: false,
                })
                $this.getinfo(2, 1, searchname);
            }

        }, 1000);
    },
    //showtype  1 显示信息   2 搜索信息
    loadmore: function () {
        var currentpage = parseInt(this.state.page) + 1
        console.log("当前页" + currentpage)

        this.getinfo(1, currentpage, this.state.value);
    },

    getinfo: function (showtype, currentpage, name) {
        var object = new Object();
        object.openId = OpenID;
        object.controlType = "query";
        object.category = "";
        object.documentType = "1";
        object.pageSize = pagesize;
        object.pageNumber = currentpage;
        object.name = name;
        $.ajax({
            url: url,
            data: { paramMap: JSON.stringify(object) },
            type: "post",
            dataType: "json",
            success: function (data) {
                if (this.isMounted()) {
                    if (data != "" && data != null && data != undefined) {

                        //获取文件信息成功
                        if (data.success == true) {
                            if (showtype == 2) {
                                layer.closeAll();
                                $("input").blur();
                            }
                            console.log("获取文件成功")
                            isplayNum=0;

                            var flielist = "";
                            var flieCount = data.count //文件数
                            if (data.map.documentsList != "" && data.map.documentsList != null && data.map.documentsList != undefined) {
                                var count = data.map.count //总数
                                //判断是否分页
                                var pageinfo = pagey(pagesize, count, currentpage);
                                var pagecont = pageinfo["pagecont"]; //页数
                                var ispage = pageinfo["ispage"]; //是否有下一页
                                //判断是否分页结束
                                this.setState({
                                    isload: false,
                                    moreload: false,
                                    page: currentpage,
                                    json: data.map.documentsList,
                                    isclick: true
                                });

                                var filedata = data.map.documentsList;


                                //this.refs.flielist.innerHTML = flielist;
                                //判断加载更多内容
                                var loadmore = ''

                                if (ispage == "true") {

                                    loadmore = '<p ref="loadmore" class="loadmore" id="loadmore">加载更多</p>';
                                }
                                else {
                                    if (currentpage == 1) {
                                        loadmore = '';
                                    }
                                    else {
                                        loadmore = '<p ref="loadmore" class="loadmore" id="nomore">没有更多了</p>';
                                    }

                                }
                                //判断加载更多内容结束

                                //加载内容

                                if (currentpage == 1) {
                                    // $("#flielist").html(flielist + loadmore);   //首次直接覆盖
                                }
                                else {
                                    $(".loadmore").remove();
                                    // $("#flielist").append(flielist + loadmore);
                                }
                                //加载内容结束  

                            }
                            else {
                                this.setState({
                                    isload: false,
                                    moreload: false,
                                    isclick: true
                                });
                                if (showtype == 1) {

                                    this.refs.flielist.innerHTML = "<P class='nodata'>没有找到数据</p>"
                                }
                                if (showtype == 2) {

                                    $("input").blur();
                                    this.refs.flielist.innerHTML = "<P class='nodata'>没有找到你要搜索的记录</p>"
                                }
                                layer.closeAll();
                                $("#filelist").removeClass("bordert_1r")
                            }

                        }
                        //获取文件失败
                        if (data.success == false) {
                            //未登录
                            layer.closeAll();
                            if (data.errorCode == "1") {
                                var dodatate = generateMixed(6)
                                window.location.href = wxurl(dodatate);
                            }
                            //未登录结束
                            if (this.state.moreload == true) {

                                $("#loadmore").html("加载失败，点击重新加载");
                            }
                            else {
                                if (data.errorCode == "7") {
                                    this.refs.flielist.innerHTML = Datafaile("当前用户没有此操作权限！");
                                }
                                else {
                                    this.refs.flielist.innerHTML = Datafailed;
                                }
                            }
                            $("#filelist").removeClass("bordert_1r")
                            console.log("获取文件失败")
                            this.setState({
                                isload: false,
                                moreload: false,
                                isclick: true
                            });
                        }
                    }

                } // this.isMounted() End
            }.bind(this),
            error: function () {

                if (this.isMounted()) {
                    layer.closeAll();
                    if (this.state.moreload == true) {

                        $("#loadmore").html("加载失败，点击重新加载");
                    }
                    else {
                        this.refs.flielist.innerHTML = Datafailed1;
                    }
                    $("#filelist").removeClass("bordert_1r")
                    console.log("获取文件失败：网络错误")
                    this.setState({
                        isload: false,
                        moreload: false,
                        isclick: true
                    });
                }
            }.bind(this)
        });
    },

    //点击播放停止
    isplay: function (event) {
        var $this = this
        event.preventDefault();
        var playtype = event.currentTarget.dataset.playtype;
        var id = event.currentTarget.dataset.id;
        var planflies=event.currentTarget.dataset.link;
        var fileid = event.currentTarget.dataset.id; 
        var educateId = event.currentTarget.dataset.educateid;
        console.log("educateid:"+educateId+"--isplayNum:"+isplayNum)
        if (playtype == "toplay") {
            if(isplayNum==0){
                layer.open({
                  content: "是否确认开始演示",
                  btn: ['确认', '取消'],
                  yes: function (index) {
                    layer.close(index);
                    console.log(fileid);
                    $this.playajax(1,$this,fileid,planflies,educateId); //点击播放信息
                  }.bind(this)
                });
            }else{
                layer.open({
                  shade: true,
                  content:"你还有文件正在播放，请先停止再播放",
                  skin: 'msg',
                  className: 'tip',
                  time: 2 //3秒后自动关闭
                });
            }
        }
        if (playtype == "tostop"){
            layer.open({
                content: "是否确认停止演示",
                btn: ['确认', '取消'],
                yes: function (index){
                layer.close(index);
                  console.log(fileid);
                  $this.playajax(2,$this,fileid,planflies,educateId); //点击停止播放
                }.bind(this)
            });
        }
    },/* 播放停止ajax   str  1:播放  0：停止*/
    playajax:function(str,This,fileid,planflies,educateId){
      str=isnull(str)==""?1:str;
      if (This.state.isclick){
        This.setState({  //禁止点击
          isload: true,
          isclick: false,
         })
        var controlType=str==1?"addEducate":"updateEducate";
        var timeStype=str==1?"play_start_time":"play_end_time"
        var tipText=str==1?"播放成功正在为你跳转文件":"停止播放成功";
         
        str==0?ajaxdong("正在停止播放...", This):"";
       
        var object = new Object();
        object.controlType = controlType;
        str==1?object.document_id = fileid:object.educate_id = educateId;
        object[timeStype] = getNowFormatDate(); //播放结束时间
        var referrer = This.state.referrer;
        var showbox = This.refs.content;
        ajaxFn(object, This, function (data) {
          layer.open({
            shade: true,
            content: tipText,
            skin: 'msg',
            className: 'tip',
            time: 2 //3秒后自动关闭
          });
          setTimeout(function(){
            isplayNum=str==1?0:isplayNum;
            str==1?window.location.href=planflies:This.getinfo(This.state.showtype, 1, This.state.value);    
            This.setState({
              isload: false,
              isclick: true,
            });
            },2000)
            
        }, "/otcdyanmic/documents.do", showbox, referrer)
      }
    },
    render: function () {
        var $this = this;
        var topmain_show = function () {
            return (
                <div className="profile white" id="pagenav">
                    <span className="toleft"> <a href={$this.state.referrer}></a></span>
                    资料文件
                    <span className="search_ico"><a href={"search.html?Columns=informationfile"}></a></span>
                </div>
            )
        }
        var topmain = this.state.Columns == "informationfile" ? "" : topmain_show();


        return (
            <div>
                {topmain}
                <div ref="content">
                    <div className="profile margint_1r " id="flielist" ref="flielist">
                        {
                          
                           
                            this.state.json.map(function (obj, i) {
                            isplayNum=isnull(obj.educate_id)==""?isplayNum:isplayNum+1;
                            var isPlaying=isnull(obj.educate_id)==""?false:true;
                            var playtypeText=isPlaying?"停止播放":"开始播放";
                            var playtypeState=isPlaying?"tostop":"toplay";
                            var playClass=isPlaying?"tostop":"toplay";
                                return (
                            <dl className="white infofile filelists" key={i}>
                               <div className={"isplay "+playClass} id={"files"+obj.id}  data-link={isnull(obj.url)} data-id={obj.id} data-educateId={isnull(obj.educate_id)} data-playtype={playtypeState} ref="isplay"  onTouchEnd={$this.isplay}>{playtypeText}</div>
                               <a href="javascript:void(0)" download={isnull(obj.url)} className="profile_pading">
                                   <dt className="infovideoimg">
                                       <img src={isnullimg(obj.tumbnailsUrl)} />
                                    </dt>
                                    <dd className="infofilert">
                                        <h2>{isnull(obj.documentName)}</h2>
                                        <em className="fileTime">上传时间：{dateformdate(obj.updateTime, 2)}</em>
                                    </dd>
                                </a>
                            </dl>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        );
    }
});


module.exports = Informationfile;







