package com.tk.servlet;

/**
 * 操作类型.对应前端上传的controltype字段值.
 */
public enum ControlType {
	add,
	delete,
	update,
	load,
	disable,//停用
	stockInit,
	checkSignOut,//判断签出时是否有未盘点的考核产品
	checkSign,//判断是否已签到
	sign,//签到
	auditList,
	audit,
	query,
	queryPlanStore,//手机端获取门店跟商业客户
	submit,
	queryAll,
	updateLocation,//更新坐标（清空或设置坐标）
	updateLeave,//修改计划状态为请假或正常
	queryMyPlan,//获得我的拜访计划
	queryGoodsInfo,//查询产品信息按关键字查询
	appraisal,//考核
	reset,//清空计划
	resetPwd,//重置密码
	resetUserInfo,//清空用户信息
	visitHistory,
	queryEmployeeStat,//代表拜访统计列表
	queryStockList,//产品考核列表（门店拜访统计查询）
	loadChainStock,//商业门店考核备注（门店拜访统计查询）
	loadStockInfo,//产品考核明细（门店拜访统计查询）
	queryStockListByEmployee,//产品考核列表（代表拜访统计查询）
	loadChainStockByEmployee,//商业门店考核备注（代表拜访统计查询）
	loadStockInfoByEmployee,//产品考核明细（代表拜访统计查询）
	assessGoods,//所有考核产品
	apprisalGoods,//考核产品列表
	uploadImg,//上传图片
	fileImport,//导入
	fileExport, //导出
	getGoodsInFo,//微信查询产品信息
	getCustomerInfo,//微信查询门店客户
	addRemark,//商业客户拜访新增备注
	loadRemark,//商业客户拜访加载备注
	addEducate,//新增PPT播放教育
	updateEducate,//修改PPT播放记录
	queryAllGoods,//查询所有产品列表
	getJsapiTicket,//获得ticket
	queryNotCofigCustomer,//查询门店销售设置没有配置的门店
	queryNotCofigGoods,//查询门店销售设置没有配置的产品
	againComputeKPI,//申请重新计算KPI
	educateKPIScoreDetail,//教育考核详情
	goodsSaleScoreDetail,//销量考核详情
	customerSaleScoreDetail,//维护考核详情
	exportKPIScoreDetail,//导出KPI得分详情
	isShowVisitPlanAuditMenu,//微信端是否有计划审核权限
	queryGoodsByPermission,//查询产品按权限
	querySupplierByPermission,//查询供应商按权限
	goodsStatisticsDetail,//查询产品拜访统计详情
	fileExportGoodsStatisticsDetail,//导出产品统计详情
	queryCustomerStatList,//门店拜访统计
	queryGoodsStatList,//产品拜访统计
	queryEducate,//查询播放记录
	addLeaveContext,//添加请假内容
	addMarkContext,//添加标记内容
	queryUserTree,//查询人员树
	
	/*首页*/
	getMenus,//获得菜单
	stat,//获得统计信息
	saleDynamic,//销售动态
	appraisalStat,//考核统计
	queryGoodsBySuperId,//产品搜索按供应商Id

}
