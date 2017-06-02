package com.tk.common;

/**
 * 操作类型.对应前端上传的controltype字段值.
 */
public enum ControlType {

	//功能类型模块
	add,
	update,
	load,
	delete,
	query,
	queryAll,
	export,
	getHandles,
	mangerLogin,//后台登录
	wechatLogin,//微信登录
	deploy,//部署流程
	viewProcessPicture,//查询流程图片
	deleteProcess,//删除流程
	bindHandle,//功能绑定操作
	loadStencilset,
	queryProcess,//获取已部署流程列表
	startProcess,//启动一个流程
	claimTask,//认领任务
	suspend,//暂停流程
	activate, //激活流程
	queryDateType, //获取数据源
	queryFlowField, //获取流程条件判断字段
	queryHandelsByModuleId,//根据功能Id获取操作列表
	queryWaitTask, //获得待办任务列表
	entrustTask, //委托他人代办
	resetPwd, //重置密码
	getSingleFloorByTree,//根据部门父节点获取单层子节点（包括子部门和角色）
	getAllDeptByTree,//获得部门树
	getRoleByDeptId, //根据部门ID获取角色
	getEmployeeIdListByDeptIdAndRoleId, //根据部门id和角色id获取所属人员id组
	checkRoleExistOnDept, //查询部门对应角色是否已存在
	getUserByDeptAndrole,//根据部门和角色获取所属人员信息
	getEmployeeByDeptAndrole, //根据部门和角色获取所属人员id集合
	updateDeptLinkRole, //更新部门对应角色信息
	updateDeptAndRolelinkEmployee,//更新部门角色所属人员
	loadObjectByExpression,//根据表达式获取对象信息（部门，人员，角色）用于流程创建操作人回填
	historyTask,//查询历史任务
	sponsorByMeTask,//查询我发起的任务
	setAssigenee,//设置候选人

}

