package com.tk.common;

/**
 * 权限的列表对象，每一个对应一个权限值
 */
public enum PermissionEnum {
	NOT_USE_PERMISSION(0, "无需要权限"),

	//模;
	_QUERY(101, "管理-列表"),
	_ADD(102, "管理-新增"),
	_UPDATE(103, "管理-修改"),
	_LOAD(104, "管理-读取"),
	_DEL(105, "管理-删除"),
	_IMPORT(106, "管理-导入"),
	_EXPORT(107, "管理-导出"),

	//销售统计
	STAT_QUERY(73, "统计报表-列表"),

	//南华销售查询
	NH_SALE_QUERY(74,"销售查询-列表"),
	NH_SALE_EXPORT(75,"销售查询-导出"),

	//门店客户销售查询
	CUSTOM_SAIL_QUERY(85,"门店销量查询-列表"),
	CUSTOM_SAIL_IMPORT(86,"门店销量查询-导入"),
	CUSTOM_SAIL_UPLOAD(87,"门店销量查询-导出"),

	//ID匹配设置
	ID_MATCH_CONFIG_QUERY(88,"ID匹配-列表"),
	ID_MATCH_CONFIG_ADD(89,"ID匹配-新增"),
	ID_MATCH_CONFIG_UPDATE(90,"ID匹配-修改"),
	ID_MATCH_CONFIG_DELETE(91,"ID匹配-删除"),


	//产品管理
	GOODS_QUERY(70, "产品列表-列表"),
	GOODS_ADD(1, "产品管理-新增"),
	GOODS_UPDATE(2, "产品管理-修改"),
	GOODS_LOAD(3, "产品管理-查看"),
	GOODS_EXPORT(56, "产品管理-导出"),

	//成本管理
	COST_QUERY(71, "成本管理-列表"),
	COST_LOAD(62, "成本管理-查看"),
	COST_UPDATE(4, "成本管理-修改"),
	COST_EXPORT(5, "成本管理-导出"),

	//销售管理
	SALE_QUERY(72, "销售查询-列表"),
	SALE_EXPORT(6, "销售管理-导出"),

	//资料管理
//	DOCUMENT_QUERY(73, "资料管理-列表"),
	DOCUMENT_ADD(7, "资料管理-上传"),
	DOCUMENT_UPDATE(55, "资料管理-编辑"),
	//DOCUMENT_DOWNLOAD(8, "资料管理-下载"),
	DOCUMENT_DELETE(9, "资料管理-删除"),
	DOCUMENT_LOAD(10, "资料管理-下载"),

	//图片管理
//	IMAGE_QUERY(74, "图片管理-列表"),
//	IMAGE_ADD(11, "图片管理-上传"),
//	IMAGE_DOWNLOAD(12, "图片管理-下载"),
//	IMAGE_DELETE(13, "图片管理-删除"),
//	IMAGE_LOAD(14, "图片管理-查看"),

	//视频管理
//	VIDEO_QUERY(75, "视频共享-列表"),
//	VIDEO_ADD(15, "视频共享-上传"),
//	VIDEO_UPDATE(16, "视频共享-修改图片"),
//	VIDEO_DELETE(17, "视频共享-删除"),
//	VIDEO_LOAD(63, "视频共享-查看"),

	//客户
	CUSTOM_QUERY(76, "客户管理-列表"),
	CUSTOM_ADD(18, "客户-新增"),
	CUSTOM_LOAD(19, "客户-查看"),
	CUSTOM_UPDATE(20, "客户-修改"),
	CUSTOM_DISABLE(69, "客户-禁用"),
	CUSTOM_IMPORT(21, "客户-导入"),
	CUSTOM_EXPORT(22, "客户-导出"),

	//商业客户
	CHAIN_CUSTOM_QUERY(77, "商业客户-列表"),
	CHAIN_CUSTOM_ADD(23, "商业客户-新增"),
	//	CUSTOM_LOAD(24, "商业客户-查看"),
	CHAIN_CUSTOM_UPDATE(25, "商业客户-修改"),
	CHAIN_CUSTOM_DISABLE(68, "商业客户-停用"),
//	CUSTOM_IMPORT(26, "商业客户-导入"),
//	CUSTOM_EXPORT(27, "商业客户-导出"),

	//考核管理
	APPRAISAL_QUERY(78, "考核管理-列表"),
	APPRAISAL_EXPORT(28, "考核管理-导出"),


	//拜访计划审核
	PLAN_AUDIT_QUERY(79, "工作计划审核-列表"),
	PLAN_AUDIT(29, "工作计划审核-审核"),
	PLAN_AUDIT_MODIFY(30, "工作计划审核-修改请假"),
	PLAN_AUDIT_EXPORT(31, "工作计划审核-导出"),

	//拜访计划列表
	VISIT_PLAN_QUERY(80, "拜访计划-列表"),
	VISIT_PLAN_UPDATE(32, "拜访计划-修改"),
	VISIT_PLAN_ADD(65, "拜访计划-新增"),
	VISIT_PLAN_DELETE(66, "拜访计划-删除"),
	VISIT_PLAN_LOAD(58, "拜访计划-查看"),
	VISIT_PLAN_RESERT(64, "拜访计划-清空数据"),
	VISIT_PLAN_SUBMIT(59, "拜访计划-提交"),
	VISIT_PLAN_IMPORT(33, "拜访计划-导入"),
	VISIT_PLAN__EXPORT(34, "拜访计划-导出"),

	//拜访统计
	CUSTOMER_VISIT_STAT_QUERY(81, "门店拜访统计-列表"),
	EMPLOYEE_VISIT_STAT_QUERY(92, "代表拜访统计-列表"),
	GOODS_VISIT_STAT_QUERY(93, "产品拜访统计-列表"),
	GOODS_VISIT_STAT_LOAD(94, "产品拜访统计-详情"),
	GOODS_VISIT_STAT_EXPORT(95, "产品拜访统计详情导出"),
	VISIT_STAT_LOAD(60, "门店拜访统计-查看"),
	EMPLOYEE_VISIT_STAT_LOAD(96, "代表拜访统计-查看"),
	VISIT_STAT_IMPORT(35, "门店拜访统计-导入"),
	VISIT_STAT_EXPORT(36, "门店拜访统计-导出"),
	
	

	//用户管理
	USER_QUERY(82, "用户管理-列表"),
	USER_ADD(37, "用户管理-新增"),
	USER_UPDATE(38, "用户管理-修改"),
	USER_LOAD(39, "用户管理-查看"),
	USER_RESETPWD(40, "用户管理-重置密码"),
	USER_RESETINFO(57, "用户管理-清空信息"),
	USER_IMPORT(41, "用户管理-导入"),
	USER_EXPORT(42, "用户管理-导出"),

	//用户管理
	ROLE_QUERY(83, "角色管理-列表"),
	ROLE_ADD(43, "角色管理-新增"),
	ROLE_UPDATE(44, "角色管理-修改"),
	ROLE_LOAD(45, "角色管理-查看"),

	//部门管理
	DEPTMENT_QUERY(84, "用户组管理-列表"),
	DEPTMENT_ADD(47, "用户组管理-新增"),
	DEPTMENT_UPDATE(48, "用户组管理-修改"),
	DEPTMENT_LOAD(49, "用户组管理-查看"),

	//考核设置管理
	APPRAISAL_CONFIG_QUERY(50, "考核设置-列表"),
	APPRAISAL_CONFIG_ADD(51, "考核设置-新增"),
	APPRAISAL_CONFIG_LOAD(61, "考核设置-查看"),
	APPRAISAL_CONFIG_UPDATE(52, "考核设置-修改"),
	APPRAISAL_CONFIG_DELETE(67, "考核设置-删除"),
	APPRAISAL_CONFIG_IMPORT(53, "考核设置-导入"),
	APPRAISAL_CONFIG_EXPORT(54, "考核设置-导出");


	private final int code;
	private final String name;

	PermissionEnum(int code, String name) {
		this.code = code;
		this.name = name;
	}

	public String getHandleName() {
		return name;
	}

	public int getCode() {
		return code;
	}
}
