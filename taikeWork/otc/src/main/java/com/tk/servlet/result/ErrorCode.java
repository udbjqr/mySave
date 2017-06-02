package com.tk.servlet.result;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * 错误码
 */
public enum ErrorCode {
	/*--------------系统基础异常------------------*/
	UNKNOWN_ERROE(0, "未知异常."),
	NOT_LOGIN(1, "获取当前操作用户信息失败，请重新登录！"),
	ACCOUNT_PASSWORD_DOES_NOT_MATCH(2, "账号或密码错误."),
	SESSION_HAS_USER_LOGIN(3, "已经有用户登录,请先退出！"),
	CALL_SERVLET_ERROR(4, "调用servlet 发生异常！"),
	UNKNOWN_USER_OPERATION_TYPE(5, "未知的请求类型参数."),
	UNRECOGNIZED_USER_OPERATION_TYPE(6, "未识别的用户操作类型！"),
	USER_NOT_HAS_PERMISSION(7, "当前用户没有此操作权限！"),
	REQUEST_PARA_ERROR(8, "请求参数出现异常！"),
	GET_FONT_END_INFO_ERROR(9, "获取前端数据失败！"),
	ERROR_CALL(10, "错误的调用！"),
	LOGIN_ERROR(11, "登录发生异常！"),
	USER_DISABLE(12, "当前用户已停用！"),
	GET_USER_TYPE_FAIL(13, "获取当前用户类型失败！"),

	/*--------------操作异常------------------*/

	//常用异常从101开始
	GET_LIST_INFO_ERROR(100, "获得列表信息失败！"),
	ADD_ERROR(101, "新增发生异常！"),
	UPDATE_ERROR(102, "修改发生异常！"),
	DELETE_ERROR(103, "删除发生异常！"),
	LOAD_ERROR(104, "查看发生异常！"),
	AUDIR_ERROR(105, "审核发生异常！"),
	IMPORT_FILE_FAIL(106, "文件导入异常！"),
	EXPORT_FILE_FAIL(107, "文件导出异常！"),
	FILEUPLOAD_FAIL(108, "文件上传失败！"),
	FILETYPE_ERROR(109, "不支持上传的文件类型！"),
	IMPORT_FILE_ERRROR(110, "文件导入错误提示！"),
	GET_FILE_STREAM_FAIL(111, "获取文件流信息失败！"),
	GET_FILE_STREAM_ERROR(112, "获取文件流信息异常！"),
	FILEUPLOAD_FIEL_TOO_BiG(113, "上传的文件过大！"),

	//特定异常从150开始
	OBJECT_NOT_EXIST(150, "相关信息不存在！"),
	USER_ALREADY_BIND(151, "此用户已经绑定过其他微信！"),
	WEIXIN_NUMBER_NO_BIND(152, "此微信号未绑定！"),
	WEIXIN_NUMBER_ALREADY_BIND(153, "此微信号已经绑定,不能再绑定！"),
	OLD_PASSWORD_ERROR(154, "原密码输入有误！"),
	NEW_PASSWORD_ERROR(155, "前后密码不一致！"),
	SIGN_ERROR(156, "签到发生异常！"),
	UN_SIGN(157, "未签到不能考核商品！"),
	OUT_OF_SIGN_PLACE(158, "超出了可签到距离！"),
	TOO_MANEY_RESULT_ERROR(159, "多条记录异常！"),
	RECODE_AlREADY_EXIST(160, "记录已存在！"),
	RECODE_EXIST_ONE_OR_MANY(161, "存在一条或多条相同记录！"),
	UN_AUDIT_NO_HANDLE(162, "未通过审核不能操作！"),
	UN_REJECT_NO_HANDLE(163, "非“驳回”或“未提交”状态不能操作！"),
	CAN_NOT_ADD(164, "已存在审核通过计划，不能再次新增！"),
	GOODSID_NOT_EXISTS(165, "该产品信息找不到！"),
	GOODSID_IS_ADD(166, "该产品已经添加，请勿重复添加！"),
	LOGIN_NAME_EXIST(167, "登录名名已存在！"),
	REAL_NAME_EXIST(168, "真实姓名已存在！"),
	CAN_NOT_FIND_OPENID(169, "查询用户OpenId失败！"),
	WECHAT_ALREADY_BIND(170, "此微信号已经绑定其他用户！"),
	WECHAT_BIND_ERROR(171, "绑定微信发生异常！"),
	EXIST_UNSIGN_OUT_PLAN(172, "存在未签出的拜访计划！"),
	GOODS_FLAG_IS_0(173, "产品已经停用！"),
	VALIDTE_CODE_IS_BANK(173, "验证码不能为空！"),
	VALIDTE_CODE_ERROR(174, "验证码错误！"),
	CUSTOM_NAME_EXIST(175, "门店名已存在！"),
	CUSTOM_FLAG_IS_0(176, "门店已经停用"),
	CHAIN_CUSTON_EXIST(177, "存在重复英克系统ID的的商业客户！"),
	UNKNOWN_CUSTOMER_TYPE(178, "未知的客户类型！"),
	TARGET_GOODS_ID_IS_USE(179,"该客户产品ID已经被使用!"),
	TIME_OUT_NO_HANDLE(180, "已超过标记时间,不能标记！"),
	HAVE_MARK_NO_HANDLE(180, "已标记,不能再次标记！");

	private static final Logger logger = LogManager.getLogger("ServletReturnError");
	private int code;
	private String message;
	private String additionalMessage = "";


	ErrorCode(int code, String message) {
		this.code = code;
		this.message = message;
	}

	public ErrorCode setMessage(String message) {
		this.message = message;
		return this;
	}

	public ErrorCode addAdditionalMessage(String name, String value) {
		this.additionalMessage += ",\"" + name + "\":\"" + value + "\"";

		return this;
	}

	public ErrorCode setAddErrorCode(String additionalMessage) {
		this.additionalMessage = additionalMessage;
		return this;
	}

	@Override
	public String toString() {
		String result = "{\"success\":false,\"errorCode\":" + code + ",\"msg\":\"" + message + "\"}";
		logger.trace("向前台返回错误信息:" + result);
		return result;
	}

	public String toStringWithAdditional() {
		String result = "{\"success\":false,\"errorCode\":" + code + ",\"msg\":\"" + message + "\"" + additionalMessage + "}";
		logger.trace("向前台返回错误信息:" + result);
		return result;
	}

	public ErrorCode clearAdditionalMessage() {
		this.additionalMessage = "";
		return this;
	}
}
