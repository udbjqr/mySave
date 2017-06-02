package com.tk.servlet;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.result.ResultCode;
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

@WebServlet("/wechatBind.do")
public class WechatBindServelt extends HttpServlet {
	protected JSONObject dataJson;
	//员工工厂类
	private static EmployeeFactory employeeFactory = EmployeeFactory.getInstance();
	protected static Logger logger = LogManager.getLogger(WechatBindServelt.class.getName());

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
		String realName;
		String loginName;
		String password;
		String weixinId;
		try {
			loginName = dataJson.getString("loginName");
			password = dataJson.getString("passWord");
			realName = dataJson.getString("realName");
			weixinId = dataJson.getString("weixin_id");
		} catch (Exception e) {
			logger.error("获取微信绑定参数异常:{}！", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}

		//非空判断
		if (StringUtils.isEmpty(loginName) || StringUtils.isEmpty(password) || StringUtils.isEmpty(realName) || StringUtils.isEmpty(weixinId)) {
			logger.info("微信绑定参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		//根据openId 判断此微信是否已经绑定过
		Employee employeeTmp = employeeFactory.getObject("weixin_id", weixinId);
		//若已经绑定过
		if (employeeTmp != null) {
			logger.info("微信id:{},已绑定其他用户！", weixinId);
			writer.print(ResultCode.WECHAT_AREADY_BIND);
			return;
		}
		//否则查询用户信息是否正确
		employeeTmp = employeeFactory.getObject("login_name", loginName);
		if (null == employeeTmp || (int) employeeTmp.get("flag") == 0) {
			logger.info("绑定微信失败，登录名:{}的用户不存在或已被禁用！", loginName);
			writer.print(ResultCode.USER_NOT_EXIST_OR_DISABLE);
			return;
		}
		if (!employeeTmp.login(password)) {
			logger.info("绑定微信失败，密码错误！");
			writer.print(ResultCode.ACCOUNT_PASSWORD_DOES_NOT_MATCH);
			return;
		}
		//判断用户是否已经绑定过微信
		String weixinIdTmp = employeeTmp.get("weixin_id");
		if (StringUtils.isNotEmpty(weixinIdTmp)) {
			logger.info("绑定微信失败，用户:{} 已绑定其他微信 ！", loginName);
			writer.print(ResultCode.USER_ALREADY_BIND);
			return;
		}

		//绑定动作
		try {
			employeeTmp.set("weixin_id", weixinId);
			employeeTmp.set("real_name", realName);
			Boolean bl = employeeTmp.flush();
			if (bl) {
				session.setAttribute(Constant.sessionUserAttrib, employeeTmp);
				writer.print(ResultCode.NORMAL);
			} else {
				writer.print(ResultCode.WECHAT_BIND_ERROR);
			}
		} catch (Exception e) {
			logger.error("绑定微信发生异常! {}", e);
			writer.print(ResultCode.WECHAT_BIND_ERROR);
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