import React from 'react'
import MemberTabel from  '../react-utils/table.js'  /*表格组件*/
import Modal from 'antd/lib/modal'                  /*antd 弹窗组件*/
import Pagination from 'antd/lib/pagination';                  /*antd 分页组件*/
import Dropdown from 'antd/lib/dropdown'
import Button from 'antd/lib/button'
import Menu from 'antd/lib/menu'
import Icon from 'antd/lib/icon'
import Select from 'antd/lib/select';                      /*antd select*/
import message from 'antd/lib/message'              /*antd 提示组件*/
const Option = Select.Option;
import Loading from '../react-utils/loading'         /*加载中组件*/
import '../../../less/tablePage.less'

/*成本管理页面*/
export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/visitStat.do') {
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
                $("#loading").addClass("none");
            },
            error(){
                $("#loading").addClass("none");
                Modal.error({title: '错误提示：',content: '出现系统异常，请联系管理员！！'});
            }
        });
    },
    getInitialState:function(){
        var backname = sessionStorage.getItem("back_page");
        return {
            dataTab : [],    /*表格数据初始值*/
            showLine:20,	/*表格显示行数*/
            dataLen:0,		/*表格数据条数*/
            pageNum:1,      /*默认选中页码*/
            products:[],      /*产品集合*/
            customName:'',       /*门店名称*/
            dataId:'',           /*当前数据的ID*/
            backname:backname,     //返回页面 门店 or 代表
            queryStockList:backname=="代表"?"queryStockListByEmployee":"queryStockList", //判断门店接口还是代表接口
            goodsidval:""
        };
    },	/*进入时初始化*/
    componentWillMount:function(){
        var strData = sessionStorage.getItem("TK_strData");
        var Id = JSON.parse(strData).visits_id ? JSON.parse(strData).visits_id : JSON.parse(strData).id;

        this.setState({dataId:Id});
        this.ajaxFn({"controlType":this.state.queryStockList,"visits_id":Id},function (data) {
            this.setState({
                customName:data.map.customName,
                dataTab:data.map.list,
                dataLen:data.map.count
            });
        });

        /*获取产品数据*/
        this.ajaxFn({"controlType":"assessGoods"},function (data) {
            this.setState({products:data.map.list});
        },'/otcdyanmic/goods.do');

    },/*跳页*/
    pageNumber(page){
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":this.state.queryStockList,"pageSize":this.state.showLine,"pageNumber":page,"visits_id":this.state.dataId},function (data) {
            this.setState({dataTab:data.map.list,pageNum:page});
        });
    },//行数选中回调函数
    lineNumber:function (obj) {
        var num = obj.key * 1;
        $("#loading").removeClass("none");
        this.ajaxFn({"controlType":this.state.queryStockList,"pageSize":num,"pageNumber":this.state.pageNum,"visits_id":this.state.dataId},function (data) {
            this.setState({
                showLine:num,
                dataTab:data.map.list
            });
        });
    },/*选择产品*/
    optionProducts(key,valueArr){
       if(Array.isArray(valueArr) && valueArr.length != 0){
            var valArr = [];
            valueArr.forEach(function(data){
                valArr.push(data.split(";")[1]);
            });
            this.setState({[key]:valArr.toString()});
        }else{
            this.setState({[key]:""});
        }
       // this.setState({
           // goodsidval:value,
        //})
    },/*条件搜索*/
    termSearch(){
      $("#loading").removeClass("none");
        this.ajaxFn({"controlType":this.state.queryStockList,"visits_id":this.state.dataId,"goods_id":this.state.goodsidval,"pageSize":this.state.showLine,"pageNumber":1},function (data) {
            data.map.count == "0" ? message.warning("暂无数据！") : message.success("加载完成！");
            this.setState({
                dataTab:data.map.list,
                dataLen:data.map.count,
                pageNum:1
            });
        });
    },/*返回*/
    out(){
        var outurl=this.state.backname=="门店"?"store":"representativeQuery"
        window.location.href = 'index.html#/'+outurl;
    },/*导出*/
    export(){
        this.ajaxFn({"controlType": "fileExport","selectType":"productDetail","visits_id":this.state.dataId}, function (data) {
            if(data.map.filePath){
                message.success(data.map.msg);
                window.location.href = data.map.filePath;
            }else{
                message.warning(data.map.msg);
            }
        });
    },/*查看货架详情*/
    see(e){
        var strData= $(e.currentTarget).attr("value");
        sessionStorage.setItem("TK_strData",strData);
        sessionStorage.setItem("back_page",this.state.backname);
    },
    render:function(){
        return (
            <div>
            	<div className="mb-title border0"><i style={{cursor:"pointer"}} onClick={this.out}>{this.state.backname}</i> <i style={{"fontFamily":"新宋体"}}>&gt;&gt;</i> {this.state.customName}</div>
        	<div className="operation" id="operation">
            	    <Dropdown
        		overlay={(
	            	    <Menu onClick={this.lineNumber}>
		                <Menu.Item key="10">10</Menu.Item>
		                <Menu.Item key="20">20</Menu.Item>
		                <Menu.Item key="50">50</Menu.Item>
		                <Menu.Item key="100">100</Menu.Item>
		            </Menu>)}
	    	    >
        	<Button type="ghost" style={{height:"34px"}}>
        	    {this.state.showLine} <Icon type="circle-o-down" />
            	</Button>
            </Dropdown>
            <MultiSelect tle="考核产品" placeholder="请选择考核产品" options={this.state.products} typeName="goodsidval" names="goodsName" Ids="goodsId"  todata="specification" even={this.optionProducts} divStyle={{width:"420px",minWidth:"100px",marginLeft:"20px"}} selectStyle={{ "width": "340px" }}  />
           {/* <SelectData tle="考核产品" options={this.state.products} typeName="supplierId" selectStyle={{"width":340}}  even={this.optionProducts} />*/}
            <button type="button" className="btn btn-o" onClick={this.termSearch}>搜索</button>
            <button type="button" className="btn btn-search" onClick={this.export}>导出</button>
            <button type="button" className="btn btn-o" onClick={this.out}>返回</button>
           
        </div>
        <MemberTabel
            dataTable={this.state.dataTab}
            titleName={["checkbox","ID号","品名","规格","供应商","来源","批次","进货","陈列面","陈列数","标签价","加权价","本次库存","操作"]}
            dataKey={["goods_id","goodName","specification","supplierName","purchaseSource","batchNumber","purchaseNumber","displaySurface","displayNumber","tagPrice","weightedPrice","realStock"]}
            controlArr={[{conId:3,conUrl: "shelfDetails",callback:this.see,conClass:"cleflo",title:"查看盘点明细"}]}
        />

        <div className="mem-footer row">
            <div className="col-md-1">共<span>{this.state.dataLen}</span>条</div>
            <div className="col-md-11">
                <Pagination className="antd-page" showQuickJumper current={this.state.pageNum} total={this.state.dataLen} pageSize={this.state.showLine} onChange={this.pageNumber}  />
            </div>
        </div>

        <Loading loading={this.state.loading} />
        </div>
        );
    }
});

/*select 组件，参数：标题，option数组对象*/
var SelectData = React.createClass({
    handleChange:function (value) {
        this.props.even(this.props.typeName,value);
    },
    render:function(){
        return (
            <div className="form-group form-inline nav-newadd pl15">
            <label>{this.props.tle}</label>
        <Select
        showSearch
        size="large"
        style={this.props.selectStyle}
        placeholder="请选择"
        optionFilterProp="children"
        onChange={this.handleChange}
        >
        <Option value="">全部</Option>
            {this.props.options.map(function (data,i) {
                return <Option key={i+"and_option"} value={""+data.goodsId} title={data.goodsName+" — "+data.specification}>{data.goodsName+" — "+data.specification}</Option>
            })}
        </Select>
        </div>
        );
    }
});
/*select 多选组件，参数：标题，option数组对象*/
/*
typeName: 下拉选择获取的数据集的状态名
className：最外层div的className
divStyle :最外层div的Style
tle:左边label的值，可以为空，为空时不显示label
placeholder：输入框的默认提示
selectStyle：下拉框的Style
todata：除id和name之外要显示的其他字段名
options：ajax数据
key：联动时被联动下拉设置的对应的key
*/
var MultiSelect = React.createClass({
    handleChange:function (value) {
        this.props.even(this.props.typeName,value);
    },/*去除""或undefind null*/
    isnull:function(str) {
     if (str == null || str == undefined || str == "undefined") {
        return "";
    }
    else {
       return str;
    }
    },
    render:function(){
        var $this=this;
       
        return (
            <div className={"suppliers form-inline "+this.isnull(this.props.className)} style={this.props.divStyle}>
              
               {this.isnull(this.props.tle)==""?"":<label style={{"padding":"0 5px",marginRight:"5px",width:"auto"}}>{this.props.tle}</label>} 
                <Select
                    multiple
                    size="large"
                    placeholder={this.isnull(this.props.placeholder)==""?"请选择":this.props.placeholder}
                    style={this.props.selectStyle}
                    searchPlaceholder="标签模式"
                    onChange={this.handleChange}
                    key={this.isnull(this.props.keyval)}
                >
                    {this.props.options.map(function (data,i) {
                        var todata=$this.isnull($this.props.todata)==""?"":"/"+data[$this.props.todata];
                         var name=$this.isnull($this.props.names)==""?data["name"]:data[$this.props.names];
                         var id=$this.isnull($this.props.Ids)==""?data["id"]:data[$this.props.Ids];
                         var showdate="";
                          if($this.props.typeName=="goodsidval"){
                           showdate=id+"/"+name+todata;
                          }else{
                           showdate=name+todata;
                          }
                         
                        return <Option key={name+";"+id} title={showdate} >{showdate}</Option>

                       //  var todata=$this.isnull($this.props.todata)==""?"":"—"+data[$this.props.todata];
                       // return <Option key={data.goodsName+";"+data.goodsId} title={data.goodsName+todata} >{data.goodsName+todata}</Option>
                    })}
                </Select>
            </div>
        );
    }
});