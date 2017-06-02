import React from 'react'
import Modal from 'antd/lib/modal'               /*antd 弹窗组件*/
import message from 'antd/lib/message'           /*antd 提示组件*/
import Progress from 'antd/lib/progress';        /*antd 进度条*/
import Select from 'antd/lib/select';            /*select 框*/
const Option = Select.Option;
import Tabs from 'antd/lib/tabs';                /*tabs 选项卡*/
const TabPane = Tabs.TabPane;

/*echarts 报表组件*/
import echarts from 'echarts/lib/echarts'        /*echarts 报表组件*/
import 'echarts/lib/chart/bar';                  /*柱状图*/
import 'echarts/lib/chart/line';                 /*折线图*/
import 'echarts/lib/chart/pie';                 /*饼图*/
import 'echarts/lib/component/tooltip';          /*报表提示*/
import 'echarts/lib/component/toolbox';          /*报表工具*/
import 'echarts/lib/component/title';            /*标题*/
import 'echarts/lib/component/legend';           /*图列*/
import 'echarts/lib/component/markPoint';        /*最大值，最小值*/
import 'echarts/lib/component/markLine';         /*平均值*/

import '../../less/home.less'


/*厂牌占比数据*/
var labelPie = {
        title : {
            text: '厂牌占比',
            x:'left'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable : true,
        series : [
            {
                name:'厂牌占比',
                type:'pie',
                radius : [50, 130],
                roseType : 'area',
                data:[
                    {value:15, name:'雅培',itemStyle: {normal: {color: '#f6ce86'}}},
                    {value:15, name:'舒邦',itemStyle: {normal: {color: '#f5c45e'}}},
                    {value:15, name:'希克劳',itemStyle: {normal: {color: '#f08c2c'}}},
                    {value:15, name:'赛诺菲',itemStyle: {normal: {color: '#d84754'}}},
                    {value:15, name:'阿斯利康',itemStyle: {normal: {color: '#841b3c'}}},
                    {value:15, name:'惠氏',itemStyle: {normal: {color: '#15507c'}}},
                    {value:15, name:'诺和诺德',itemStyle: {normal: {color: '#2faad3'}}},
                    {value:15, name:'邦迪',itemStyle: {normal: {color: '#64c4d0'}}},
                    {value:15, name:'拜尔',itemStyle: {normal: {color: '#70c4ad'}}}
                ]
            }
        ]
    };



/*区域占比数据*/
var regionBar = {
      title : {
          text: '区域占比',
          x:'left'
      },
      tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis : [
          {
              type : 'category',
              data : ['南昌','上饶','九江','吉安','抚州','赣州','樟树','萍乡','宜春','景德镇']
          }
      ],
      yAxis : [
          {
            name : '百分比（%）',
            type: 'value',
            axisLabel: {
                formatter: '{value} %'
            }
          }
      ],
      series : [
          {
              name:'区域占比',
              type:'bar',
              barWidth: '55%',
              data:[30,60,78,68,40,63,22,61,55,88],
              itemStyle: {
                  normal: {
                      color: '#2eaebb',
                  }
              }
          }
      ]
  };

/*单品销售数据*/
var saleBar = {
      title : {
          text: '单品销售额',
          x:'left'
      },
      tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'line'        // 默认为直线，可选为：'line' | 'shadow'
          }
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis : [
          {
              type : 'category',
              data : ['白加黑','邦迪冰雪奇缘','瑞格列奈片','雅培杜密克','舒邦','希刻劳干混','百忧解胶囊28粒','善存','乐沙定']
          }
      ],
      yAxis : [
          {
            type: 'value'
          }
      ],
      series : [
          {
              name:'单品销售额',
              type:'bar',
              barWidth: '30%',
              data:[24000,27000,18000,12000,28000,22000,25000,15000,27500],
              itemStyle: {
                  normal: {
                      color: '#ec9260  ',
                  }
              }
          }
      ]
  };


/*产品占比*/
var productPie = {
        title : {
            text: '产品占比',
            x:'left'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable : true,
        series : [
            {
                name:'产品占比',
                type:'pie',
                radius : [50, 130],
                roseType : 'area',
                data:[
                    {value:15, name:'白加黑',itemStyle: {normal: {color: '#fcf0da'}}},
                    {value:15, name:'沙芬糖浆',itemStyle: {normal: {color: '#fdedd3'}}},
                    {value:15, name:'拜阿司匹林',itemStyle: {normal: {color: '#fbdcbf'}}},
                    {value:15, name:'力度伸',itemStyle: {normal: {color: '#f2c8ca'}}},
                    {value:15, name:'散利痛',itemStyle: {normal: {color: '#dabac5'}}},
                    {value:15, name:'散利痛',itemStyle: {normal: {color: '#b8cad8'}}},
                    {value:15, name:'力度伸',itemStyle: {normal: {color: '#b7dbe7'}}},
                    {value:15, name:'凯妮汀',itemStyle: {normal: {color: '#64c4d0'}}},
                    {value:15, name:'美克',itemStyle: {normal: {color: '#d4ede7'}}}
                ]
            }
        ]
    };

/*产品区域占比*/
var  drugRegionBar = {
      title : {
          text: '区域占比-凯妮汀',
          x:'left'
      },
      tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
              type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
      },
      grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
      },
      xAxis : [
          {
              type : 'category',
              data : ['南昌','上饶','九江','吉安','抚州','赣州','樟树','萍乡','宜春','景德镇']
          }
      ],
      yAxis : [
          {
            name : '百分比（%）',
            type: 'value',
            axisLabel: {
                formatter: '{value} %'
            }
          }
      ],
      series : [
          {
              name:'区域占比',
              type:'bar',
              barWidth: '55%',
              data:[30,60,78,68,40,63,22,61,55,88],
              itemStyle: {
                  normal: {
                      color: '#2eaebb',
                  }
              }
          }
      ]
  };
/*单品销售额数据*/
var singleProductSales = {
        title : {
            text: '单品销售额-凯妮汀',
            x:'left'
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['凯妮汀']
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
                data : ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月',"12月"]
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
                markPoint: {
                    data: [
                        {type: 'max', name: '最大值'},
                        {type: 'min', name: '最小值'}
                    ]
                },
                data:[2500,5000,10000,7500,6000,11500,16500,12000,12500,14000,16000,25000],
                itemStyle: {
                    normal: {
                        color: '#64c5ce',
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
    componentDidMount(){
        /*厂牌占比*/
        var labelPieObj = echarts.init(document.getElementById('labelPie'));
        labelPieObj.setOption(labelPie);
        /*区域占比*/
        var regionBarObj = echarts.init(document.getElementById('regionBar'));
        regionBarObj.setOption(regionBar);
        /*单品销售图表*/
        var saleBarObj = echarts.init(document.getElementById('saleBar'));
        saleBarObj.setOption(saleBar);
        /*产品占比*/
        var productPieObj = echarts.init(document.getElementById('productPie'));
        productPieObj.setOption(productPie);
        /*药品区域占比*/
        var drugRegionBarObj = echarts.init(document.getElementById('drugRegionBar'));
        drugRegionBarObj.setOption(drugRegionBar);
        /*单品销售额*/
        var singleProductSalesObj = echarts.init(document.getElementById('singleProductSales'));
        singleProductSalesObj.setOption(singleProductSales);

        /*给tabs 添加样式*/
        $(".ant-tabs-tab-active .ant-tabs-tab-inner").addClass("antd-drugs-tabs");
        $(".ant-tabs-bar").addClass("antd-tabs-boder");
    },
    getInitialState(){
        return {

        }
    },/*区域占比 - 时间选择*/
    timeSelect(){

    },/*药品品牌选择*/
    drugSelection(key){
        $(".ant-tabs-tab-inner").removeClass("antd-drugs-tabs");
        setTimeout(function(){
            $(".ant-tabs-tab-active .ant-tabs-tab-inner").addClass("antd-drugs-tabs");
        },100)


    },
    render(){
        return (
            <div className="home-body">
                <div className="row chart-body">
                    <div className="col-md-12 chart-head">
                        <div className="col-md-6">
                            <span className="chart-title">份额详情</span>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group fr mem-search mt6">
                                <span className="glyphicon glyphicon-search fl" onClick={this.nameSearch}></span>
                                <input type="text" className="fr" placeholder="搜索关键字" ref="memberName" />
                            </div>
                        </div>
                    </div>
                    <div className="row charts-box">
                        <div className="col-md-6">
						                  <div className="labelPie" id="labelPie"></div>
                        </div>
                        <div className="col-md-6">
                              <div className="col-xs-12 col-sm-12 col-md-6 col-md-offset-6 mt10">
                                  <Select className="fl" onChange={this.timeSelect} defaultValue="1" style={{width:120}}>
                                      <Option key="1">年</Option>
                                      <Option key="2">月</Option>
                                  </Select>
                                  <Select className="fl ml20" onChange={this.timeSelect} defaultValue="1" style={{width:120}}>
                                      <Option key="1">2016</Option>
                                      <Option key="2">2015</Option>
                                  </Select>
                              </div>
                              <div className="col-md-12">
                                  <div className="regionBar" id="regionBar"></div>
                              </div>
                        </div>
                    </div>
                    <div className="col-md-12 charts-box">
                        <div className="saleBar" id="saleBar"></div>
                    </div>
                    <div className="col-md-12 mt30">
                        <Tabs defaultActiveKey="1" onChange={this.drugSelection}>
                          <TabPane tab="拜尔" key="1"></TabPane>
                          <TabPane tab="邦迪" key="2"></TabPane>
                          <TabPane tab="诺和诺德" key="3"></TabPane>
                          <TabPane tab="雅培" key="4"></TabPane>
                          <TabPane tab="舒邦" key="5"></TabPane>
                          <TabPane tab="希克劳" key="6"></TabPane>
                          <TabPane tab="赛诺菲" key="7"></TabPane>
                          <TabPane tab="阿斯利康" key="8"></TabPane>
                          <TabPane tab="惠氏" key="9"></TabPane>
                        </Tabs>
                    </div>
                    <div className="col-md-12">
                        <div className="col-md-6">
                              <div className="labelPie" id="productPie"></div>
                        </div>
                        <div className="col-md-6">
                              <div className="col-xs-12 col-sm-12 col-md-6 col-md-offset-6 mt10">
                                  <Select className="fl" onChange={this.timeSelect} defaultValue="1" style={{width:120}}>
                                      <Option key="1">年</Option>
                                      <Option key="2">月</Option>
                                  </Select>
                                  <Select className="fl ml20" onChange={this.timeSelect} defaultValue="1" style={{width:120}}>
                                      <Option key="1">2016</Option>
                                      <Option key="2">2015</Option>
                                  </Select>
                              </div>
                              <div className="col-md-12">
                                  <div className="regionBar" id="drugRegionBar"></div>
                              </div>
                        </div>
                    </div>
                    <div className="col-md-12 mt20 pb20">
                        <div className="singleProductSales" id="singleProductSales"></div>
                    </div>

                </div>
            </div>
        );
    }
});
