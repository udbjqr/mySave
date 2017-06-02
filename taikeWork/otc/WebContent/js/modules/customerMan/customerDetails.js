import React from 'react'
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*//*下拉组件*/
import message from 'antd/lib/message';
import Alert from 'antd/lib/alert'




var object =new Object();

/*连锁客户详情*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/customer.do') {
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
            dataTab:[],             /*客户拜访列表*/
            showLine: 20,           /*显示行数*/
            dataLen: 0,             /*总数据条数*/
            contentObj:{},          /*信息内容初始对象*/
            regions:[],             /*地区数据*/
            attributesId:[],         /*属性数据*/
            employee:[],              /*负责人数据*/
            executiveDirector:[],     /*责任主管*/
            customerId:'',             /*当前数据ID*/
            areaManagerId:[],           /*区域经理*/
            chainCustomerId:[],          /*连锁客户*/
            coordinate:[],               /*签到坐标*/
            levelArr:[]                 /*类型数据*/
        }
    },//之前
    componentWillMount:function(){
        var strData = sessionStorage.getItem("TK_strData");
        var customerId = JSON.parse(strData).id;
        this.setState({customerId:customerId});

        /*进入时请求地区数据*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({regions:data.map.data});
        },'/otcdyanmic/areaDivision.do');

        /*连锁客户*/
        this.ajaxFn({"controlType":"queryAll"},function (data) {
            this.setState({chainCustomerId:data.map.list});
        },'/otcdyanmic/chainCustomer.do');

        /*代表*/
        this.ajaxFn({"controlType":"query","id":1},function (data) {
            this.setState({employee:data.map.list});
            /*主管*/
            this.ajaxFn({"controlType":"query","id":2},function (data) {
                this.setState({executiveDirector:data.map.list});
                /*区域经理*/
                this.ajaxFn({"controlType":"query","id":5},function (data) {
                    this.setState({areaManagerId:data.map.list});
                },'/otcdyanmic/employee.do');
            },'/otcdyanmic/employee.do');
        },'/otcdyanmic/employee.do');

        /*类型数据*/
        this.ajaxFn({"controlType":"queryAll"},function(data){
            this.setState({levelArr:data.map.data});
        },'/otcdyanmic/customerAttributes.do');


        /*进入时请求客户信息数据*/
        this.ajaxFn({"controlType":"load","id":customerId},function (data) {
            object = data.map.customer;
            /*取坐标*/
            if(data.map.customer.location){
                var arr = data.map.customer.location.split(",");
            }
            this.setState({
                    contentObj:data.map.customer,
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
    },/*返回*/
    out:function () {
        window.location.href = "index.html#/chainCustomers";
    },/*修改客户信息*/
    cleardisabled:function () {
        object.controlType = "update";
        object.id = this.state.customerId;
        this.ajaxFn(object,function (data) {
            object = {};
            message.success('修改成功');
            window.location.href = "index.html#/chainCustomers";
        });
    },/*清空坐标数据*/
    empty(){
        this.ajaxFn({"controlType":"updateLocation","custom_id":this.state.customerId,"location":""},function(data){
            message.success('清空成功！');
        });
    },
    render:function(){
        return (
            <div>
                <div className="mb-title">门店客户修改</div>
                <div className="paragraph-tle mt20">
                    <span className="paragraph_left">客户信息</span>
                </div>
                <div className="row addinformation mt30">
                    <div className="col-lg-8">
                        <RegionInput tle="客户名称" typeName="customerName" isStars="position_stars" content={this.state.contentObj.customerName} />
                    </div>
                </div>


                <div className="row addinformation mt30">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <SelectData tle="区域经理" options={this.state.areaManagerId} typeName="areaManagerId"  content={this.state.contentObj.areaManagerId}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <SelectData tle="区域" options={this.state.regions} typeName="areaId"  content={this.state.contentObj.areaId} />
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <SelectData tle="商业客户" options={this.state.chainCustomerId} typeName="chainCustomerId"  content={this.state.contentObj.chainCustomerId}/>
                    </div>
                </div>

                <div className="row addinformation mt30">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <SelectData tle="主管" options={this.state.executiveDirector} typeName="personInChargeId"  content={this.state.contentObj.personInChargeId}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <SelectData tle="代表" options={this.state.employee} typeName="employeeId"  content={this.state.contentObj.employeeId}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <SelectData tle="门店类型" options={this.state.levelArr} typeName="attributes_id"  content={this.state.contentObj.attributes_id}/>
                    </div>
                </div>

                <div className="row addinformation mt30">
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <InputBox tle="门店联系人电话" typeName="buyerPhone"  content={this.state.contentObj.buyerPhone}/>
                    </div>
                    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4">
                        <InputBox tle="门店联系人" typeName="buyer"  content={this.state.contentObj.buyer}/>
                    </div>
                </div>

                <div className="row addinformation mt30">
                    <div className="col-lg-8">
                        <RegionInput tle="地址" typeName="address" content={this.state.contentObj.address}  />
                    </div>
                </div>

                <div className="row mt50">
                    <div className="col-lg-11 col-lg-offset-1 form-inline">
                        <div className="form-group">
                            <button className="btn btn-c-o fl ml20" onClick={this.cleardisabled}>确定</button>
                            <button className="btn btn-c-t fl ml20" onClick={this.out}>返回</button>
                        </div>
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
        }
        return (
            <div className="form-group">
                <div className="col-lg-4">
                    <label>{this.props.tle}</label>
                </div>
                <div className={"col-lg-8 "+(this.props.isStars ? this.props.isStars : "")}>
                    <input type="text" value={object[this.props.typeName]} className="form-control h28" onChange={this.handleChange} />
                </div>
            </div>
        );
    }
});



/*加大表单输入框*/
var RegionInput = React.createClass({
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
        }
        return (
            <div className="form-group">
                <div className="col-lg-2">
                    <label>{this.props.tle}</label>
                </div>
                <div className={"col-lg-10 "+(this.props.isStars ? this.props.isStars : "")}>
                    <input type="text" value={object[this.props.typeName]}  className="form-control h28" onChange={this.handleChange}/>
                </div>
            </div>
        );
    }
});





/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    handleChange:function (e) {
        if(e.target.value != 0){
            object[this.props.typeName] = e.target.value;
        }
    },
    render:function(){
        const {content} = this.props;
        return (
            <div className="form-group">
                <div className="col-lg-4">
                    <label>{this.props.tle}</label>
                </div>
                <div className={"col-lg-8 "+(this.props.isStars ? this.props.isStars : "")}>
                    <select className="form-control xzSelect" defaultValue={content} onChange={(this.props.event ? this.props.event : this.handleChange)} >
                        <option value="0">--请选择--</option>
                        {this.props.options.map(function(data,i){
                            return <option value={data.id} key={i+"po"} >{data.name}</option>
                        })}
                    </select>
                </div>
            </div>
        );
    }
});
