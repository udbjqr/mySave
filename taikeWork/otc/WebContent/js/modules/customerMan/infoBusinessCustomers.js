import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import message from 'antd/lib/message';
import Alert from 'antd/lib/alert'





var object =new Object();

/*商业客户详情*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/chainCustomer.do') {
        var $this = this;
        $.ajax({
            type:"post",
            url:javaUrl,
            data:{paramMap:JSON.stringify(data)},
            dataType: "json",
            async:false,	//false 表示ajax执行完成之后在执行后面的代码
            success:function(data){
                if(!data.success){/*首先判断这个属性，错误在判断原因*/
                    switch(data.errorCode){
                        case  (1):
                            Modal.warning({title: '警告提示：',content:'获取当前登录用户信息失败，请重新登录！',onOk() {
                                window.location.href = 'login.html';
                            }});
                            break;
                        case  (2):
                            Modal.warning({title: '警告提示：',content: '此用户不存在或已禁用，请联系管理员！'});
                            break;
                        case  (3):
                            Modal.error({title: '错误提示：',content: '发生严重错误，请联系管理员！！'});
                            break;
                        case  (4):
                            Modal.error({title: '错误提示：',content: '发生严重错误，请联系管理员！！'});
                            break;
                        case  (5):
                            Modal.warning({title: '警告提示：',content: '当前用户没有此操作权限！'});
                            break;
                        case  (8):
                            Modal.warning({title: '警告提示：',content: '相关数据格式有误，请检查后重新填写！'});
                            break;
                        case  (9):
                            Modal.info({title: '提示：',content: '相关数据未填写完整，请检查！'});
                            break;
                        default:
                            Modal.warning({title: '警告提示：',content: data.msg});
                            break;
                    }
                }else{
                    callback.call($this,data);
                }
            },
            error(){
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }
        });
    },
    getInitialState:function(){
        return {
            showLine: 20,   /*显示行数*/
            dataLen: 0,     /*总数据条数*/
            contentObj:{},       /*信息内容初始对象*/
            regions:[],          /*地区数据*/
            dataTab:[],              /*表格数据*/
            personInChargeId:[],        /*负责代表*/
            coordinate:[]               /*经纬度数据*/
        }
    },//之前
    componentWillMount:function(){
        var strData = sessionStorage.getItem("TK_strData");
        var chainCustom_id = JSON.parse(strData).id;
        this.setState({chainCustom_id:chainCustom_id});
        /*进入时请求地区数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({regions:data.map.data});
        },'/otcdyanmic/areaDivision.do');

        /*请求代表数据*/
        this.ajaxFn({"controlType":"query","id":1},function (data) {
            this.setState({personInChargeId:data.map.list});
        },'/otcdyanmic/employee.do');


        /*请求商业客户详情*/
        this.ajaxFn({"controlType":"load","chain_id":chainCustom_id},function (data) {
            object = data.map.info;
            /*取坐标*/
            if(data.map.info.location){
                var arr = data.map.info.location.split(",");
            }
            this.setState({
                contentObj:data.map.info,
                coordinate:arr
            });


        });

    },
    componentDidMount(){
        /*初始化百度地图*/
        var $this = this;
        if($this.state.coordinate){
            var myGEO = new BMap.Geocoder();
            myGEO.getPoint("",
                function(point) {
                    var longitude = $this.state.coordinate ? $this.state.coordinate[0] :  115.89;
                    var latitude = $this.state.coordinate ? $this.state.coordinate[1] : 28.68;
                    var point = new BMap.Point(longitude,latitude); //定义一个中心点坐标
                    var map = new BMap.Map("baiduMap");
                    map.centerAndZoom(point, 18);
                    map.addControl(new BMap.NavigationControl());

                    var myMaker = new BMap.Marker(point);
                    var markerName = new BMap.Label("");
                    myMaker.setLabel(markerName);
                    map.addOverlay(myMaker);
                }
            );
        }
    },//按时间范围搜索，回调函数
    searchTime:function(sd,ed){
        this.ajaxFn({"controlType":"query","startDate":sd,"endDate":ed},function (data) {
            this.setState({
                dataTab:data.map.memberList,
                dataLen:data.map.count
            });
        })

    },//行数选中回调函数
    lineNumber:function (num) {
        this.ajaxFn({"controlType":"query","pageSize":num,"pageNumber":1},function (data) {
            this.setState({
                dataTab:data.map.memberList,
                showLine:num
            });
        });
    },/*跳页*/
    pageNumber(page){
        this.ajaxFn({"controlType":"query","pageSize":this.state.showLine,"pageNumber":page},function (data) {
            this.setState({dataTab:data.map.memberList});
        });
    },/*修改客户信息*/
    cleardisabled:function (e) {
        var strData = sessionStorage.getItem("TK_strData");
        var chainCustom_id = JSON.parse(strData).id;
        object.controlType = "update";
        object.id = chainCustom_id;
        this.ajaxFn(object,function (data) {
            object = {};
            message.success('修改成功');
            window.location.href = "index.html#/businessCustomers";
        });
    },//关键字搜索
    nameSearch:function () {
        var memberName = this.refs.memberName.value;
        this.ajaxFn({"controlType":"query","name":memberName,"pageSize":20,"pageNumber":1},function (data) {
            if(!data.map.data){
                messages.warning('没有相关的关键字');
            }
            this.setState({
                dataLen:data.map.count,
                dataTab:data.map.memberList
            });
        })
    },/*返回*/
    out:function () {
        window.location.href = "index.html#/businessCustomers";
    },/*清空坐标数据*/
    empty(){
        this.ajaxFn({"controlType":"updateLocation","chainCustom_id":this.state.chainCustom_id,"location":""},function(data){
            message.success('清空成功！');
        });
    },
    render:function(){
        return (
            <div>
                <div className="mb-title">商业客户修改</div>
                <div className="paragraph-tle mt20">
                    <span className="paragraph_left">客户信息</span>
                </div>
                <div className="row addinformation mt30">
                    <div className="col-lg-4 ">
                        <InputBox tle="客户ID" typeName="chain_id"  content={this.state.contentObj.chain_id} disabled="true"/>
                        <InputBox tle="客户名称" typeName="chain_name"  content={this.state.contentObj.china_customer_name} />
                        <SelectData tle="负责代表" options={this.state.personInChargeId} typeName="employee_id"  content={this.state.contentObj.employee_id}/>
                        <SelectData tle="区域" options={this.state.regions} typeName="area_id"  content={this.state.contentObj.area_id}/>
                        <SelectData tle="客户类型" options={[{"name":"连锁","id":"1"},{"name":"批发","id":"2"}]} typeName="custom_type"  content={this.state.contentObj.custom_type}/>
                    </div>
                </div>
                <div className="col-lg-11 col-lg-offset-1 mt50 form-inline">
                    <div className="form-group">
                        <button className="btn btn-c-o fl ml20" onClick={this.cleardisabled}>确定</button>
                        <button className="btn btn-c-t fl ml20" onClick={this.out}>返回</button>
                    </div>
                </div>


                <div className="paragraph-tle mt50">
                    <span className="paragraph_left">签到位置</span>
                    <button className="btn btn-c-o fr ml20 mr40" onClick={this.empty} style={{display:(this.state.coordinate ? "block":"none")}}>清空</button>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 mt50" style={{display:(this.state.coordinate ? "none":"block")}}>
                            <Alert
                                message="提示："
                                description="暂无签到信息"
                                type="warning"
                                showIcon
                              />
                        </div>
                        <div id="baiduMap" className="baiduMap"></div>

                    </div>
                </div>
            </div>
        );
    }
});










/*input 大组件 需传参数：组件标题，组件业务类型，组件错误返回值*/
var InputBox = React.createClass({
    getInitialState(){
        return{
            first:true,
        }
    },
    handleChange:function(e){
        object[this.props.typeName] = e.target.value;
        this.setState({first:false});
    },
    render:function () {
        if(this.state.first){
            object[this.props.typeName] = this.props.content;
        };
        return (
            <div className="form-group form-inline stars">
                <label className={this.props.lab}>{this.props.tle}</label>
                <input value={object[this.props.typeName]} className="form-div form-control" onChange={this.handleChange} disabled={this.props.disabled}/>
            </div>
        );

    }
});


/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    handleChange:function (e) {
        object[this.props.typeName] = e.target.value;
    },
    render:function(){
        const {content} = this.props;
        return (
            <div className="form-group form-inline stars">
                <label className={this.props.lab}>{this.props.tle}</label>
                <select defaultValue={content} className="form-control xz" onChange={this.handleChange} >
                    <option value="">--请选择--</option>
                    {this.props.options.map(function(data,i){
                        return <option value={data.id} key={i+"po"} >{data.name}</option>
                    })}
                </select>
            </div>
        );
    }
});
