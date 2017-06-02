import React from 'react'
import Modal from 'antd/lib/modal'               /*antd 弹窗组件*/
import message from 'antd/lib/message'           /*antd 提示组件*/
import Progress from 'antd/lib/progress';        /*antd 进度条*/
import Select from 'antd/lib/select';            /*select 框*/
const Option = Select.Option;


/*echarts 报表组件*/
import echarts from 'echarts/lib/echarts'        /*echarts 报表组件*/
import 'echarts/lib/chart/line';                 /*折线图*/
import 'echarts/lib/component/tooltip';          /*报表提示*/
import 'echarts/lib/component/title';            /*标题*/
import 'echarts/lib/component/legend';           /*图列*/
import 'echarts/lib/component/markPoint';        /*最大值，最小值*/
import 'echarts/lib/component/markLine';         /*平均值*/

import '../../less/home.less'


/*销售情况数据*/
var salesSituationOption = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['销售情况']
        },
        grid: {
            left: '0%',
            right: '1%',
            bottom: '1%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'销售情况',
                type:'line',
                stack: '总量',
                areaStyle: {normal: {}},
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                data:[2500,5000,10000,7500,6000,11500,16500,12000,12500,14000,15000,16000,25000],
                itemStyle: {
                    normal: {
                        color: '#ef67a7',
                    }
                }
            }
        ]
    };
/*份额情况数据*/
var shareSituationOption = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['份额情况']
        },
        grid: {
            left: '0%',
            right: '1%',
            bottom: '1%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'份额情况',
                type:'line',
                stack: '总量',
                areaStyle: {normal: {}},
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                data:[2500,5000,10000,7500,6000,11500,16500,12000,12500,14000,15000,16000,25000],
                itemStyle: {
                    normal: {
                        color: '#0dbfef',
                    }
                }
            }
        ]
    };
/*利润情况数据*/
var profitSituationOption = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['利润1','利润2','利润3']
        },
        grid: {
            left: '0%',
            right: '1%',
            bottom: '1%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['2004','2005','2006','2007','2008','2009','2010','2011','2012','2013','2014','2015','2016']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'利润3',
                type:'line',
                stack: '总量',
                areaStyle: {normal: {}},
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                data:[10000,7500,12500,14000,15000,6000,11500,16500,12000,2500,5000,16000,25000],
                itemStyle: {
                    normal: {
                        color: '#43d68f',
                    }
                }
            },
            {
                name:'利润2',
                type:'line',
                stack: '总量',
                areaStyle: {normal: {}},
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                data:[15000,16500,12000,16000,25000,2500,5000,10000,7500,6000,11500,12500,14000],
                itemStyle: {
                    normal: {
                        color: '#61c9c8',
                    }
                }
            },
            {
                name:'利润1',
                type:'line',
                stack: '总量',
                areaStyle: {normal: {}},
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                data:[11500,16500,16000,25000,12000,12500,2500,5000,10000,7500,6000,14000,15000],
                itemStyle: {
                    normal: {
                        color: '#a6eac1',
                    }
                }
            }
        ]
    };


export default React.createClass({
    //ajax 封装
    ajaxFn:function (data,callback,javaUrl = '/otcdyanmic/homePage.do') {
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
                                window.location.href = 'login.html';
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
    getInitialState(){
        return {
            dataObj:{}          /*产品，客户，销售额数据*/
        };
    },
    componentDidMount(){
        /*销售情况走势图*/
        var salesSituation = echarts.init(document.getElementById('salesSituation'));
        salesSituation.setOption(salesSituationOption);
        /*份额情况*/
        var shareSituation = echarts.init(document.getElementById('shareSituation'));
        shareSituation.setOption(shareSituationOption);
        /*利润情况*/
        var profitSituation = echarts.init(document.getElementById('profitSituation'));
        profitSituation.setOption(profitSituationOption);

        /*进入时*/
        this.ajaxFn({"controlType":"stat"},function(data){
            this.setState({dataObj:data.map});
        })


    },/*销售情况季度选择*/
    salesQuarter(){

    },
    render(){
        return (
            <div className="home-body">
                <div className="row mt30">
                    <div className="col-md-4">
                        <a href="#productList">
                            <div className="show-box-one">
                                <div className="show-data">
                                    <span>产品总数</span>
                                    <h2>{this.state.dataObj.goodCount}</h2>
                                </div>
                                <div className="show-icon">
                                    <div className="show-background"></div>
                                    <img src="images/home/home-icon-1.png" alt=""/>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-4">
                        <a href="#chainCustomers">
                            <div className="show-box-two">
                                <div className="show-data">
                                    <span>客户总数</span>
                                    <h2>{this.state.dataObj.customerCount}</h2>
                                </div>
                                <div className="show-icon">
                                    <div className="show-background"></div>
                                    <img src="images/home/home-icon-3.png" alt=""/>
                                </div>
                            </div>
                        </a>
                    </div>
                    <div className="col-md-4">
                        <a href="#salesInquiries">
                            <div className="show-box-three">
                                <div className="show-data">
                                    <span>销售额</span>
                                    <h2>{this.state.dataObj.saleCount}</h2>
                                </div>
                                <div className="show-icon">
                                    <div className="show-background"></div>
                                    <img src="images/home/home-icon-2.png" alt=""/>
                                </div>
                            </div>
                        </a>
                    </div>
                </div>
                <div className="row chart-body">
                    <div className="col-md-12 chart-head">
                        <div className="col-md-6">
                            <span className="chart-title">客户销售动态</span>
                        </div>
                        <div className="col-md-6">
                        </div>
                    </div>
                    <div className="col-md-12 mt20">
                        <div className="col-md-6">
                            <a href="#dataDetails"><span className="small-title">销售情况</span></a>
                        </div>
                        <div className="col-md-1 col-md-offset-5">
                            <Select className="fr mt10" onChange={this.salesQuarter} defaultValue="1" style={{width:120}}>
                                <Option key="1">一季度</Option>
                                <Option key="2">二季度</Option>
                            </Select>
                        </div>
                    </div>
                    <div className="col-md-12 charts-box">
                        <div className="salesSituation" id="salesSituation"></div>
                    </div>
                    <div className="col-md-12 mt20">
                        <div className="col-md-6">
                            <span className="small-title">份额情况</span>
                        </div>
                        <div className="col-md-1 col-md-offset-5">
                            <Select className="fr mt10" onChange={this.salesQuarter} defaultValue="1" style={{width:120}}>
                                <Option key="1">一季度</Option>
                                <Option key="2">二季度</Option>
                            </Select>
                        </div>
                    </div>
                    <div className="col-md-12 charts-box">
                        <div className="salesSituation" id="shareSituation"></div>
                    </div>
                    <div className="col-md-12 mt20">
                        <div className="col-md-6">
                            <span className="small-title">利润情况</span>
                        </div>
                        <div className="col-md-1 col-md-offset-5">
                            <Select className="fr mt10" onChange={this.salesQuarter} defaultValue="1" style={{width:120}}>
                                <Option key="1">一季度</Option>
                                <Option key="2">二季度</Option>
                            </Select>
                        </div>
                    </div>
                    <div className="col-md-12 charts-box">
                        <div className="salesSituation" id="profitSituation"></div>
                    </div>
                </div>

                <div className="row chart-body">
                    <div className="col-md-12 chart-head">
                        <div className="col-md-6">
                            <span className="chart-title">考核统计</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="col-xs-12 col-sm-12 col-md-12 mt10">
                            <Select onChange={this.salesQuarter} defaultValue="1" style={{width:120}}>
                                <Option key="1">一季度</Option>
                                <Option key="2">二季度</Option>
                            </Select>
                        </div>
                        <div className="col-xs-12 col-sm-12 col-md-12 mt10 text-center">
                            <p className="kpi-text">{(new Date().getMonth()+1)+'月 KPI总得分（100%）'}</p>
                        </div>
                        <div className="col-md-12">
                            <div className="kpi-box">
                                <Progress type="circle" width={300} percent={100} format={percent => percent+'%' } />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="autoBox">
                                    <p className="text-center f16 mb10 ell">邦迪防水创口贴5片</p>
                                    <Progress type="circle" width={210} percent={75} format={percent => (<i className="iColorOrange">{percent+'分'}</i>)} />
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="autoBox">
                                    <p className="text-center f16 mb10 ell">注射用青霉素钠</p>
                                    <Progress type="circle" width={210} percent={75} format={percent => (<i className="iColorOrange">{percent+'分'}</i>)} />
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="autoBox">
                                    <p className="text-center f16 mb10 ell">精蛋白生物合成人胰岛素注射液</p>
                                    <Progress type="circle" width={210} percent={75} format={percent => (<i className="iColorOrange">{percent+'分'}</i>)} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


















            </div>
        );
    }
});
