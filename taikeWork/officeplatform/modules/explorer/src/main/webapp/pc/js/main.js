import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory , IndexRoute} from 'react-router'
import '../less/index.less'
import 'antd/dist/antd.css';
import NavigationMenu from './navigationMenu.js'		/*左侧边菜单*/
import FormSetting from './formSetting.js'				/*表单设置*/
import FunctionManagement from './functionManagement.js' 				/*功能管理*/
import ProcessPage from './processPage.js'				/*流程定义页面*/
import ProcessDeployment from './processDeployment.js' 	/*流程部署列表*/
import DataDictionary from './dataDictionary.js'		/*数据字典页面*/
import Todo from './todo.js'							/*代办事项*/
import PersonnelManagement from './personnelManagement.js'	/*人员管理*/
import TaskManagement from './taskManagement.js'			/*任务管理列表*/
import DepartmentManagement from './departmentManagement.js' 	/*部门管理列表*/
import RoleManagement from './roleManagement.js'				/*角色管理列表*/
import FillForm from './fillForm.js'				/*角色管理列表*/

render((
		<Router history={hashHistory} >
			<Route path="/" component={NavigationMenu}>
				<IndexRoute component={FunctionManagement} />
				<Route path="/formSetting" component={FormSetting} />
				<Route path="/functionManagement" component={FunctionManagement} />
				<Route path="/dataDictionary" component={DataDictionary} />
				<Route path="/processPage" component={ProcessPage} />
				<Route path="/processDeployment" component={ProcessDeployment} />
				<Route path="/personnelManagement" component={PersonnelManagement} />
				<Route path="/taskManagement" component={TaskManagement} />
				<Route path="/departmentManagement" component={DepartmentManagement} />
				<Route path="/roleManagement" component={RoleManagement} />
				<Route path="/todo" component={Todo} />
				<Route path="/fillForm" component={FillForm} />
			</Route>
		</Router>
	),document.getElementById("app"));
