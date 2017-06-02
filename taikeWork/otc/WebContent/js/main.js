import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'

import '../css/utils/antd.css'
import { Sider } from './modules/sider.js';	/*菜单页面*/
import Home from './modules/home.js';	/*主页面*/
import DataDetails from './modules/dataDetails.js'  /*主页面数据详情*/
import SalesChart from './modules/staticalChart/salesChart.js' 	/*销售报表*/
import SalesInquiries from './modules/salesVolumeMan/salesInquiries.js'  /*销售查询】*/
import CustomerSaleQuery from './modules/salesVolumeMan/customerSaleQuery.js' 	/*客户销量查询*/
import IdMatchSetUp from './modules/salesVolumeMan/idMatchSetUp.js'				/*ID匹配设置*/
import SaleStore from './modules/salesVolumeMan/saleStore.js' 				/*-*/
import SaleProduct from './modules/salesVolumeMan/saleProduct.js' 				/*-*/
import ProductList from './modules/productMan/productList.js' /*产品列表页*/
import ModifyProduct from './modules/productMan/modifyProduct'  /*修改产品*/
import ProductDetails from './modules/productMan/productDetails.js' /*产品详情*/
import CostControls from './modules/productMan/costControls.js'	/*成本管理*/
import ModifyAdmini from './modules/productMan/modifyAdmini.js' /*成本修改*/
import DataManage from './modules/dataMan/dataManage'   /*资料管理*/
import PropagandaPpt from './modules/dataMan/propagandaPpt.js'  /*宣传PPT*/
import ImgManage from './modules/dataMan/imgManage.js'  /*图片管理*/
import VideoShare from './modules/dataMan/videoShare.js'    /*视屏共享*/
import ChainCustomers from './modules/customerMan/chainCustomers.js'    /*连锁客户管理*/
import AddChain from './modules/customerMan/addChain.js'                /*新增连锁客户*/
import CustomerDetails from './modules/customerMan/customerDetails'     /*连锁客户修改*/
import ChainCustomersInfo from './modules/customerMan/chainCustomersInfo.js'    /*连锁客户详情*/
import BusinessCustomers from './modules/customerMan/businessCustomers.js'/*商业客户管理*/
import AddBusinessCustomers from './modules/customerMan/addBusinessCustomers.js' /*新增商业客户*/
import InfoBusinessCustomers from './modules/customerMan/infoBusinessCustomers.js'/*商业客户修改*/
import SeeBusinessCustomers from './modules/customerMan/seeBusinessCustomers.js'    /*商业客户详情*/
import ExaminationDetails from './modules/assessmentMan/examinationDetails.js'      /*考核详情*/
import Store from './modules/assessmentMan/store.js'           /*拜访统计子页面 【门店】*/
import InventoryDetail from './modules/assessmentMan/inventoryDetail.js'    /*盘点明细*/
import ShelfDetails from './modules/assessmentMan/shelfDetails.js'          /*货架详情*/
import Product from './modules/assessmentMan/product.js'       /*拜访统计子页面 【产品】*/
import VisitPlan from './modules/assessmentMan/visitPlan.js'        /*拜访计划审核*/
import WorkJihua from './modules/assessmentMan/workJihua.js'        /*拜访工作计划*/
import Assessment from './modules/assessmentMan/assessment.js'      	/*【考核查询】*/
import ManagementPage from './modules/assessmentMan/managementPage.js' 				/*考核管理中转页*/
import AssessInfoMaintain from './modules/assessmentMan/assessInfoMaintain.js' 	 	/*维护考核详情*/
import AssessInfoEducate from './modules/assessmentMan/assessInfoEducate.js' 		/*教育考核详情*/
import AssessInfoEducateSales from './modules/assessmentMan/assessInfoEducateSales.js'  /*销量考核详情*/
import VisitStatistics from './modules/assessmentMan/visitStatistics.js'				/*【门店拜访统计中转页】*/
import RepresentativeQuery from './modules/assessmentMan/representativeQuery.js'		/*代表拜访查询*/
import ExaminationSetting from './modules/assessmentMan/examinationSetting.js'          /*考核设置*/
import ProductEvaluationSet from './modules/assessmentMan/productEvaluationSet.js'      /*过程考核设置*/
import ExamineOfPeople from './modules/assessmentMan/examineOfPeople.js'				/*人员考核设置*/
import StoreCheckSet from './modules/assessmentMan/storeCheckSet.js'                    /*教育考核设置*/
import TotalSalesVolume from './modules/assessmentMan/totalSalesVolume.js'              /*结果售额设置*/
import UserMan from './modules/systemMan/userMan.js'                /*用户管理*/
import NewAdministrator from './modules/systemMan/newAdministrator.js' /*新增用户*/
import AdminModify from './modules/systemMan/adminModify.js'            /*修改管理员信息*/
import AdminInfo from './modules/systemMan/adminInfo.js'             /*管理员信息详情*/
import RoleMan from './modules/systemMan/roleMan.js'                /*角色管理*/
import NewRole from './modules/systemMan/newRole.js'                /*新增角色*/
import ModifyRole from './modules/systemMan/modifyRole.js'          /*修改角色*/
import UserGroup from './modules/systemMan/userGroup.js'            /*用户组管理*/
import UserGroupMan from './modules/systemMan/userGroupMan.js'      /*新增用户组*/
import UserGroupModify from './modules/systemMan/userGroupModify.js'   /*修改用户组*/
import UserGroupDetails from './modules/systemMan/userGroupDetails.js' /*查看用户组*/
import SystemLog from './modules/systemMan/systemLog.js'        /*系统日志*/
import PersInfo from './modules/systemMan/persInfo.js'        /*个人信息*/
import EidtInfo from './modules/systemMan/eidtInfo.js'        /*修改信息*/
import ModifyPassword 　from './modules/systemMan/modifyPassword.js'/*修改密码*/
import Productinfo 　from './modules/assessmentMan/productinfo.js'/*产品门店详情*/
import Vipclientlist 　from './modules/vipclient/vipclientlist.js'/*vip客户管理*/
import Addvipclient 　from './modules/vipclient/addvipclient.js'/*新增vip客户*/
import Vipclientinfo 　from './modules/vipclient/vipclientinfo.js'/*vip客户详情*/
import Updatevipclient 　from './modules/vipclient/updatevipclient.js'/*vip客户详情*/


render((
    <Router history={hashHistory} >
        <Route path="/" component={Sider}>
            <IndexRoute component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/salesChart" component={SalesChart} />
            <Route path="/dataDetails" component={DataDetails} />
            <Route path="/productList" component={ProductList} />
            <Route path="/costControls" component={CostControls} />
            <Route path="/salesInquiries" component={SalesInquiries} />
            <Route path="/dataManage" component={DataManage} />
            <Route path="/imgManage" component={ImgManage} />
            <Route path="/videoShare" component={VideoShare} />
            <Route path="/chainCustomers" component={ChainCustomers} />
            <Route path="/businessCustomers" component={BusinessCustomers} />
            <Route path="/assessment" component={Assessment} />
            <Route path="/visitPlan" component={VisitPlan} />
            <Route path="/userMan" component={UserMan} />
            <Route path="/roleMan" component={RoleMan} />
            <Route path="/userGroup" component={UserGroup} />
            <Route path="/systemLog" component={SystemLog} />
            <Route path="/persInfo" component={PersInfo} />
            <Route path="/modifyPassword" component={ModifyPassword} />
            <Route path="/modifyProduct" component={ModifyProduct} />
            <Route path="/productDetails" component={ProductDetails} />
            <Route path="/modifyAdmini" component={ModifyAdmini} />
            <Route path="/addChain" component={AddChain} />
            <Route path="/customerDetails" component={CustomerDetails} />
            <Route path="/addBusinessCustomers" component={AddBusinessCustomers} />
            <Route path="/infoBusinessCustomers" component={InfoBusinessCustomers} />
            <Route path="/examinationDetails" component={ExaminationDetails} />
            <Route path="/workJihua" component={WorkJihua} />
            <Route path="/eidtInfo" component={EidtInfo} />
            <Route path="/newAdministrator" component={NewAdministrator} />
            <Route path="/userGroupMan" component={UserGroupMan} />
            <Route path="/userGroupModify" component={UserGroupModify} />
            <Route path="/userGroupDetails" component={UserGroupDetails} />
            <Route path="/adminInfo" component={AdminInfo} />
            <Route path="/adminModify" component={AdminModify} />
            <Route path="/newRole" component={NewRole} />
            <Route path="/modifyRole" component={ModifyRole} />
            <Route path="/shelfDetails" component={ShelfDetails} />
            <Route path="/chainCustomersInfo" component={ChainCustomersInfo} />
            <Route path="/seeBusinessCustomers" component={SeeBusinessCustomers} />
            <Route path='/propagandaPpt' component={PropagandaPpt} />
            <Route path='/customerSaleQuery' component={CustomerSaleQuery} />
            <Route path='/representativeQuery' component={RepresentativeQuery} />
            <Route path="/store" component={Store} />
            <Route path="/product" component={Product} />
            <Route path="/productinfo" component={Productinfo}/>
            <Route path="/inventoryDetail" component={InventoryDetail} />
            <Route path="/vipclientlist" component={Vipclientlist} />
            <Route path="/addvipclient" component={Addvipclient} />
            <Route path="/vipclientinfo" component={Vipclientinfo} />
            <Route path="/updatevipclient" component={Updatevipclient} />
            
                    <Route path="/examinationSetting" component={ExaminationSetting} >
                        <IndexRoute component={ProductEvaluationSet} />
                        <Route path='/examinationSetting/productEvaluationSet' component={ProductEvaluationSet} />
                        <Route path='/examinationSetting/examineOfPeople' component={ExamineOfPeople} />
                        <Route path='/examinationSetting/storeCheckSet' component={StoreCheckSet} />
                        <Route path='/examinationSetting/totalSalesVolume' component={TotalSalesVolume} />
                    </Route>

                    <Route path="/managementPage" component={ManagementPage} >
                        <IndexRoute component={AssessInfoMaintain} />
                        <Route path='/managementPage/assessInfoMaintain' component={AssessInfoMaintain} />
                        <Route path='/managementPage/assessInfoEducate' component={AssessInfoEducate} />
                        <Route path='/managementPage/assessInfoEducateSales' component={AssessInfoEducateSales} />
                    </Route>

                    <Route path="/visitStatistics" component={VisitStatistics} >
                        <IndexRoute component={Store} />
                        <Route path="/visitStatistics/store" component={Store} />
                        <Route path="/visitStatistics/product" component={Product} />
                        <Route path="/visitStatistics/inventoryDetail" component={InventoryDetail} />
                    </Route>

                    <Route path="/idMatchSetUp" component={IdMatchSetUp} >
                        <IndexRoute component={SaleStore} />
                        <Route path="/idMatchSetUp/saleStore" component={SaleStore} />
                        <Route path="/idMatchSetUp/saleProduct" component={SaleProduct} />
                    </Route>



                </Route>
    </Router>
            ),document.getElementById("app"));
