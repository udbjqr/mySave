package com.tk.servlet;

import com.tk.common.Constant;
import com.tk.common.result.ResultCode;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

/**
 * 系统退出
 */
@WebServlet("/loginOut.do")
public class LoginOutServlet extends HttpServlet {
	protected static Logger logger = LogManager.getLogger(LoginOutServlet.class.getName());

	@Override
	protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setCharacterEncoding("UTF-8");
		resp.setContentType("text/html;charset=UTF-8");
		PrintWriter writer = resp.getWriter();
		logger.trace("退出系统初始...");
		//获取前端微信code
		String systemExit;
		try {
			systemExit = req.getParameter("systemExit");
		} catch (Exception e) {
			logger.error("获取登出系统参数异常:{}!", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(systemExit)) {
			logger.info("获取登出系统参数缺失!");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		req.getSession().removeAttribute(Constant.sessionUserAttrib);
		writer.print(ResultCode.NORMAL);
		logger.trace("退出系统结束...");
	}

}
