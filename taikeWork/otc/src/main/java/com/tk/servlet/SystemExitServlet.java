package com.tk.servlet;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.tk.common.Constant;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

/**
 * 系统退出
 */
@WebServlet("/systemExit.do")
public class SystemExitServlet extends HttpServlet {

	protected static Logger logger = LogManager.getLogger(SystemExitServlet.class.getName());

	@Override
	protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setCharacterEncoding("UTF-8");
		resp.setContentType("text/html;charset=UTF-8");
		PrintWriter writer = resp.getWriter();
		logger.trace("退出系统初始...");
		String systemExit = req.getParameter("systemExit");
		if (StringUtils.isNotBlank(systemExit) && systemExit.equals("0")) {
			req.getSession().removeAttribute(Constant.sessionUserAttrib);
			writer.print(new SuccessJSON("msg", "已成功退出！"));
		} else {
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		}
		logger.trace("退出系统结束...");
	}

}
