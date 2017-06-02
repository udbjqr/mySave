package com.tk.servlet;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.object.CustomerFactory;
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

@WebServlet("/wechatBind.do")
public class wechatBindServelt extends HttpServlet {
	protected JSONObject dataJson;
	//员工工厂类
	private static EmployeeFactory employeeFactory = EmployeeFactory.getInstance();
	protected static Logger logger = LogManager.getLogger(wechatBindServelt.class.getName());

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
		HttpSession session = request.getSession();
		PrintWriter writer = response.getWriter();
		//获得参数数据
		dataJson = getParam(request);

		//获取到绑定的数据
		String weixinName;
		String realName;
		String loginName;
		String password;
		String openId;
		try {
			loginName = dataJson.getString("loginName");
			password = dataJson.getString("passWord");
			weixinName = dataJson.getString("weixinName");
			realName = dataJson.getString("realName");
			openId = dataJson.getString("openId");
		} catch (Exception e) {
			logger.error("获取微信绑定参数异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}

		//非空判断
		if (StringUtils.isEmpty(loginName) || StringUtils.isEmpty(password) || StringUtils.isEmpty(realName) || StringUtils.isEmpty(openId)) {
			logger.info("微信绑定参数缺失！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//根据openId 判断此微信是否已经绑定过
		Employee employeeTmp = employeeFactory.getObject("weixin_id", openId);
		//若已经绑定过
		if (employeeTmp != null) {
			logger.info("微信id:{},已绑定其他用户！", openId);
			writer.print(ErrorCode.WECHAT_ALREADY_BIND);
			return;
		}
		//否则查询用户信息是否正确
		employeeTmp = employeeFactory.getObject("login_name", loginName);
		if (null == employeeTmp) {
			logger.info("绑定微信失败，用户:{} 不存在！", loginName);
			writer.print(ErrorCode.ACCOUNT_PASSWORD_DOES_NOT_MATCH);
			return;
		}
		if (!employeeTmp.login(password)) {
			logger.info("绑定微信失败，密码错误！");
			writer.print(ErrorCode.ACCOUNT_PASSWORD_DOES_NOT_MATCH);
			return;
		}
		//判断用户是否已经绑定过微信
		String weixinId = employeeTmp.get("weixin_id");
		if (StringUtils.isNotEmpty(weixinId)) {
			logger.info("绑定微信失败，用户:{} 已绑定其他微信 ！", loginName);
			writer.print(ErrorCode.USER_ALREADY_BIND);
			return;
		}
		//TODO 获取微信头像

		//绑定动作
		try {
			employeeTmp.set("weixin_id", openId);
			employeeTmp.set("real_name", realName);
			employeeTmp.set("weixin_name", weixinName);
			Boolean bl = employeeTmp.flash();
			if (bl){
				session.setAttribute(Constant.sessionUserAttrib, employeeTmp);
				writer.print(new SuccessJSON());
			}else{
				writer.print(ErrorCode.WECHAT_BIND_ERROR);
			}
		} catch (Exception e) {
			logger.error("绑定微信发生异常! {}", e);
			writer.print(ErrorCode.WECHAT_BIND_ERROR);
			return;
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
