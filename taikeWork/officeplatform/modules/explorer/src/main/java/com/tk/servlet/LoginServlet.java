package com.tk.servlet;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.ControlType;
import com.tk.common.persistence.User;
import com.tk.common.result.ResultCode;
import com.tk.common.util.WeixinUtils;
import com.tk.objects.identity.Employee;
import com.tk.objects.identity.EmployeeFactory;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;


/**
 * 后台用户登录操作.
 */
@WebServlet("/userLogin.do")
public class LoginServlet extends HttpServlet {
	protected static Logger logger = LogManager.getLogger(LoginServlet.class.getName());
	//获取带员工工厂类
	private static EmployeeFactory employeeFactory = EmployeeFactory.getInstance();

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("content-type", "text/html;charset=UTF-8");

		//		setHandlePermission();

		logger.trace("客户端发起请求，请求对象：" + this.getClass().getSimpleName());
		//查看上传信息
		for (Enumeration<String> e = request.getParameterNames(); e.hasMoreElements(); ) {
			String name = e.nextElement();
			logger.trace("name:{} value:{}", name, request.getParameter(name));
		}
		//获得输出对象
		PrintWriter writer = response.getWriter();
		//获得参数数据
		JSONObject dataJson = getParam(request);
		//如果未传递参数
		if (null == dataJson) {
			logger.warn("获取前端数据失败！");
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		//获得操作类型
		ControlType controlType;

		//操作类型
		String controlTypeString = dataJson.getString("controlType");
		if (StringUtils.isEmpty(controlTypeString)) {
			logger.warn("获取用户操作类型失败！");
			writer.print(ResultCode.UNRECOGNIZED_USER_OPERATION_TYPE);
			return;
		}

		//转义操作类型
		try {
			controlType = ControlType.valueOf(controlTypeString);
		} catch (IllegalArgumentException e) {
			logger.warn("未知的操作类型！");
			writer.print(ResultCode.UNKNOWN_USER_OPERATION_TYPE);
			return;
		}

		switch (controlType) {
			case mangerLogin:
				mangerLogin(request, writer, dataJson);
				break;
			case wechatLogin:
				wechatLogin(request, writer, dataJson);
				break;
			default:
				break;
		}


	}

	/**
	 * 后台登录
	 *
	 * @param request
	 * @param writer
	 */
	private void mangerLogin(HttpServletRequest request, PrintWriter writer, JSONObject dataJson) {
		HttpSession session = request.getSession();
		String name, password, validateCode;
		try {
			name = dataJson.get("loginName").toString();
			password = dataJson.get("passWord").toString();
			/*validateCode = dataJson.get("validateCode").toString();
			String validateCodeValue = (String) request.getSession().getAttribute(Constants.KAPTCHA_SESSION_KEY);

			if (StringUtils.isBlank(validateCode)) {
				writer.print(ResultCode.VALIDTE_CODE_IS_BANK);
				return;
			} else if (StringUtils.isBlank(validateCodeValue) || !validateCodeValue.equalsIgnoreCase(validateCode)) {
				writer.print(ResultCode.VALIDTE_CODE_ERROR);
				return;
			}*/
			//检查用户是否登录
			User employee = (User) session.getAttribute(Constant.sessionUserAttrib);
			if (employee != null) {
				logger.warn("已经有用户登录,请先退出!");
				writer.print(ResultCode.SESSION_USER_EXIST);
				return;
			}

			employee = employeeFactory.getObject("login_name", name);
			if (employee == null || !employee.login(password)) {
				logger.info("用户名或密码错!");
				writer.print(ResultCode.ACCOUNT_PASSWORD_DOES_NOT_MATCH);
				return;
			}

			Integer flag = employee.get("flag");
			//判断是否停用
			if (0 == flag) {
				logger.info("当前用户已停用！!");
				writer.print(ResultCode.USER_DISABLE);
				return;
			}

			session.setAttribute(Constant.sessionUserAttrib, employee);

			//返回数据
			JSONObject object = new JSONObject();
			object.put("employeeId", employee.get("id"));
			object.put("realName", employee.get("real_name"));
			writer.print(new ResultCode(true, object));
		} catch (Exception e) {
			logger.error("登录发生发生异常 {}！", e);
			writer.print(ResultCode.LOGIN_ERROR);
		}
	}

	/**
	 * 微信登录
	 *
	 * @param request
	 * @param writer
	 */
	private void wechatLogin(HttpServletRequest request, PrintWriter writer, JSONObject dataJson) {
		HttpSession session = request.getSession();
		//获取前端微信code
		String weChatCode;
		try {
			weChatCode = dataJson.getString("code");
		} catch (Exception e) {
			logger.error("获取微信用户异常:{}!", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(weChatCode)) {
			logger.info("获取微信用户信息缺失!");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		//获取当前用户对应的的winxinId
		String winxinId = WeixinUtils.getUserId(null, weChatCode, session);
		if (StringUtils.isEmpty(winxinId)) {
			logger.info("获取当前用户winxinId 失败!");
			writer.print(ResultCode.GET_WECHAT_USERID_ERROR);
			return;
		}
		JSONObject rsObject = new JSONObject();
		//执行登录操作
		try {
			Employee employee = employeeFactory.getObject("weixin_id", winxinId);
			if (null == employee) {
				logger.info("当前微信帐号未绑定用户，跳转到绑定用户页面!");
				rsObject.put("message", "未绑定微信，跳转绑定微信页面。");
				rsObject.put("winxin_id", winxinId);
				writer.print(new ResultCode(false, rsObject));
				return;
			}
			Integer flag = employee.get("flag");
			//判断是否停用
			if (flag <= 0) {
				logger.info("当前用户已停用或已删除！");
				writer.print(ResultCode.USER_DISABLE);
				return;
			}
			session.setAttribute(Constant.sessionUserAttrib, employee);
			rsObject.put("mname", employee.get("real_name"));
			rsObject.put("wexin_id", winxinId);
			logger.info("用户微信登录成功！");
			writer.print(new ResultCode(true, rsObject));
		} catch (Exception e) {
			logger.error("登录异常：{}", e);
			writer.print(ResultCode.LOGIN_ERROR);
		}
	}

	/**
	 * 参数接收
	 */
	public JSONObject getParam(HttpServletRequest request) {
		String paramMap = request.getParameter("paramMap");
		return JSONObject.parseObject(paramMap);
	}
}
