package com.tk.servlet;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.util.Config;
import com.tk.common.util.WeixinUtils;
import com.tk.object.Employee;
import com.tk.object.EmployeeFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;
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
 * 微信用户登录操作.
 */
@WebServlet("/userLogin.do")
public class UserLoginServlet extends HttpServlet {
	protected JSONObject dataJson;
	//员工工厂类
	private static EmployeeFactory employeeFactory = EmployeeFactory.getInstance();
	protected static Logger logger = LogManager.getLogger(wechatBindServelt.class.getName());

	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
		HttpSession session = request.getSession();
		PrintWriter writer = response.getWriter();

		//获得参数数据
		dataJson = getParam(request);

		logger.trace("客户端发起请求，请求对象：" + this.getClass().getSimpleName());
		//查看上传信息

		for (Enumeration<String> e = request.getParameterNames(); e.hasMoreElements(); ) {
			String name = e.nextElement();
			logger.trace("name:{} value:{}", name, request.getParameter(name));
		}

		//FIXME 这里是测试时使用，正式需要去除
		if (Config.getInstance().getProperty("test").equals("true") && dataJson.containsKey("type") && dataJson.get("type").equals("test")) {
			session.removeAttribute(Constant.sessionUserAttrib);
			Employee employee = employeeFactory.getObject("login_name", dataJson.get("login_name"));
			session.setAttribute(Constant.sessionUserAttrib, employee);
			SuccessJSON success = new SuccessJSON();
			success.put("mname", employee.get("real_name"));
			success.put("openId", employee.get("weixin_id"));
			logger.info("用户微信登录成功！");
			writer.print(success);
			return;
		}

		//获取前端微信code
		String weChatCode;
		try {
			weChatCode = dataJson.getString("code");
		} catch (Exception e) {
			logger.error("获取微信用户异常:{}!", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (StringUtils.isEmpty(weChatCode)) {
			logger.info("获取微信用户信息缺失!");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//获取当前微信用户的openId
		String userId = WeixinUtils.getUserId(null, weChatCode, session);
		if (StringUtils.isEmpty(userId)) {
			logger.info("获取微信用户 userId 失败!");
			writer.print(ErrorCode.CAN_NOT_FIND_OPENID);
			return;
		}
		//执行登录操作
		try {
			Employee employee = employeeFactory.getObject("weixin_id", userId);
			if (null == employee) {
				logger.info("当前微信帐号未绑定用户，跳转到绑定用户页面!");
				ErrorCode.WEIXIN_NUMBER_NO_BIND.clearAdditionalMessage().addAdditionalMessage("openId", userId);
				writer.print(ErrorCode.WEIXIN_NUMBER_NO_BIND.toStringWithAdditional());
				return;
			}
			Integer flag = employee.get("flag");
			//判断是否停用
			if (0 == flag) {
				logger.info("当前用户已停用！!");
				writer.print(ErrorCode.USER_DISABLE);
				return;
			}
			session.setAttribute(Constant.sessionUserAttrib, employee);
			SuccessJSON success = new SuccessJSON();
			success.put("mname", employee.get("real_name"));
			success.put("openId", userId);
			logger.info("用户微信登录成功！");
			writer.print(success);
		} catch (Exception e) {
			logger.error("登录异常：{}", e);
			writer.print(ErrorCode.LOGIN_ERROR);
		}
	}

	/**
	 * 参数接收
	 */
	private JSONObject getParam(HttpServletRequest request) {
		String paramMap = request.getParameter("paramMap");
		return JSONObject.parseObject(paramMap);
	}

}
