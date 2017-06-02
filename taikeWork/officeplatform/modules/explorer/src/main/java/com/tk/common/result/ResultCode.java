package com.tk.common.result;

import com.tk.common.util.ObjectUtil;
import org.apache.commons.lang.ObjectUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * 返回结果
 */
public final class ResultCode {
	public static final ResultCode NORMAL = new ResultCode(0, "正常结束");
	/*--------------系统基础异常------------------*/
	public static final ResultCode UNKNOWN_ERROE = new ResultCode(9999, "未知异常.", false);
	public static final ResultCode NOT_LOGIN = new ResultCode(1, "获取当前操作用户信息失败，请重新登录！", false);
	public static final ResultCode CALL_SERVLET_ERROR = new ResultCode(4, "调用servlet 发生异常！", false);
	public static final ResultCode UNKNOWN_USER_OPERATION_TYPE = new ResultCode(5, "未知的请求类型参数.", false);
	public static final ResultCode UNRECOGNIZED_USER_OPERATION_TYPE = new ResultCode(6, "未识别的用户操作类型！", false);
	public static final ResultCode USER_NOT_HAS_PERMISSION = new ResultCode(7, "当前用户没有此操作权限！", false);
	public static final ResultCode MISS_FRONT_PARAM = new ResultCode(8, "获取前端数据失败！请检查paramMap参数是否存在。", false);
	public static final ResultCode GET_FRONT_END_INFO_ERROR = new ResultCode(9, "获取前端数据异常！请检查paramMap参数格式是否正确。", false);
	public static final ResultCode OBJECT_NOT_FOUND = new ResultCode(10, "数据未找到或不存在！", false);
	public static final ResultCode UNKNOWN_DATA_SOURCE_TYPE = new ResultCode(11, "未知的数据类型.", false);
	public static final ResultCode OBJECT_AREADY_EXIST = new ResultCode(12, "相关数据已存在！", false);

	/*--------------登录异常------------------*/
	public static final ResultCode USER_NAME_EXIST = new ResultCode(30, "用户名已存在！", false);
	public static final ResultCode REAL_NAME_EXIST = new ResultCode(31, "用户真实姓名已存在！", false);
	public static final ResultCode VALIDTE_CODE_IS_BANK = new ResultCode(32, "验证码为空！", false);
	public static final ResultCode VALIDTE_CODE_ERROR = new ResultCode(33, "验证码错误！", false);
	public static final ResultCode ACCOUNT_PASSWORD_DOES_NOT_MATCH = new ResultCode(34, "用户名或密码不匹配！", false);
	public static final ResultCode SESSION_USER_EXIST = new ResultCode(35, "session存在已登录的用户！", false);
	public static final ResultCode USER_DISABLE = new ResultCode(36, "用户已停用或已删除！", false);
	public static final ResultCode LOGIN_ERROR = new ResultCode(37, "登录发生异常！", false);
	public static final ResultCode GET_WECHAT_USERID_ERROR = new ResultCode(38, "获取当前用户微信id异常！", false);
	public static final ResultCode WECHAT_AREADY_BIND = new ResultCode(39, "此微信号已绑定其他用户！", false);
	public static final ResultCode USER_NOT_EXIST_OR_DISABLE = new ResultCode(40, "用户不存在或已被禁用！", false);
	public static final ResultCode USER_ALREADY_BIND = new ResultCode(41, "用户已绑定过其他微信！", false);
	public static final ResultCode WECHAT_BIND_ERROR = new ResultCode(42, "绑定微信发生失败！", false);

	/*--------------操作异常------------------*/
	public static final ResultCode ADD_ERROR = new ResultCode(50, "新增数据发生异常！", false);
	public static final ResultCode UPDATE_ERROR = new ResultCode(51, "修改数据发生异常！", false);
	public static final ResultCode DELETE_ERROR = new ResultCode(52, "删除数据发生异常！", false);
	public static final ResultCode QUERY_ERROR = new ResultCode(53, "查询列表发生异常！", false);
	public static final ResultCode LOAD_ERROR = new ResultCode(54, "查询明细发生异常！", false);
	public static final ResultCode IMPORT_ERROR = new ResultCode(55, "导入文件发生异常！", false);
	public static final ResultCode EXPORT_ERROR = new ResultCode(56, "导出文件发生异常！", false);
	public static final ResultCode RESET_ERROR = new ResultCode(57, "重置信息发生异常！", false);

	/*--------------流程异常------------------*/
	public static final ResultCode NOT_FOUND_TASK = new ResultCode(101, "未找到需要的任务，或者任务已经结束。", false);
	public static final ResultCode TASK_NOT_FOUND_HANDLE = new ResultCode(102, "指定任务未包含操作，请检查流程定义。", false);
	public static final ResultCode NOT_FOUND_MODULE = new ResultCode(103, "未找到指定的功能模块，或者功能模块为空。", false);
	public static final ResultCode CAN_NOT_SET_ASSIGNEE = new ResultCode(104, "未找到相关人员信息，请确认您配置的人员是否有效。", false);

	/*--------------其他异常------------------*/
	public static final ResultCode OBJECT_CAN_NOT_DELETE = new ResultCode(150, "删除操作被拒绝，您可能没有权限或要删除的不是最末节点。", false);

	private static final Logger logger = LogManager.getLogger(ResultCode.class.getName());

	private int code;
	private boolean success;
	private String message;
	private String additionalMessage = "";
	private Object jsonObject = null;

	public ResultCode(int code, String message) {
		this(code, message, true);
	}


	public ResultCode(int code, String message, Boolean success) {
		this.code = code;
		this.message = message;
		this.success = success;
	}

	public ResultCode(Boolean success, Object object) {
		this(0, "", success);
		this.addAdditionalMessage("values", object == null ? "" : object.toString());
	}

	public ResultCode(Object jsonObject) {
		this.jsonObject = jsonObject;
	}

	public boolean isSuccess() {
		return success;
	}

	public ResultCode addAdditionalMessage(String name, String value) {

		this.additionalMessage += ",\"" + name + "\":" + (StringUtils.isEmpty(value) ? "\"\"" : value);

		return this;
	}

	public ResultCode setAdditionalMessage(String additionalMessage) {
		this.additionalMessage = additionalMessage;
		return this;
	}

	@Override
	public String toString() {
		if (jsonObject != null) {
			String result = jsonObject.toString();
			logger.trace("向前台返回信息:" + result);
			return result;
		} else {
			String result = "{\"success\":" + success + ",\"code\":" + code + ",\"msg\":\"" + message + "\"" + additionalMessage + "}";
			logger.trace("向前台返回信息:" + result);
			return result;
		}
	}

	public int getCode() {
		return code;
	}
}
