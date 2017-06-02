package com.tk.servlet;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.ControlType;
import com.tk.common.PermissionEnum;
import com.tk.common.persistence.User;
import com.tk.common.result.ResultCode;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

/**
 * servlet 的主入口.
 */
public abstract class BaseServlet extends HttpServlet {
	protected static Logger logger = LogManager.getLogger(BaseServlet.class.getName());
	protected Map<ControlType, PermissionEnum> handlePermission = new HashMap<>();

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
		//获得操作类型
		ControlType controlType;

		try {
			//检查用户是否登录
			User employee = (User) request.getSession().getAttribute(Constant.sessionUserAttrib);
			//获得参数数据
			JSONObject dataJson = getParam(request);
			if (null == employee) {
				logger.trace("session 中无用户信息，跳转登录页面！");
				writer.print(ResultCode.NOT_LOGIN);
				return;
			}

			//如果未传递参数
			if (null == dataJson) {
				logger.warn("获取前端数据失败！");
				writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
				return;
			}

			//获得请求设备类型
//			getDeviceType(request);

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
				//设置进 request
				request.setAttribute("controlType", controlType);
			} catch (IllegalArgumentException e) {
				logger.warn("未知的操作类型！");
				writer.print(ResultCode.UNKNOWN_USER_OPERATION_TYPE);
				return;
			}
			//根据操作类型执行子类操作
			switch (controlType) {
				case add:
					if (true /*employee.hasPermission(handlePermission.get(ControlType.add))*/) {
						add(request, writer);
						break;
					} else {
						errorPermission(ControlType.add, writer);
						return;
					}
				case delete:
					if (true/*employee.hasPermission(handlePermission.get(ControlType.delete))*/) {
						delete(request, writer);
						break;
					} else {
						errorPermission(ControlType.delete, writer);
						return;
					}
				case update:
					if (true/*employee.hasPermission(handlePermission.get(ControlType.update))*/) {
						update(request, writer);
						break;
					} else {
						errorPermission(ControlType.update, writer);
						return;
					}
				case query:
					if (true/*employee.hasPermission(handlePermission.get(ControlType.query))*/) {
						query(request, writer);
						break;
					} else {
						errorPermission(ControlType.query, writer);
						return;
					}
				case queryAll:
					if (true/*employee.hasPermission(handlePermission.get(ControlType.queryAll))*/) {
						queryAll(request, writer);
						break;
					} else {
						errorPermission(ControlType.queryAll, writer);
						return;
					}
				case load:
					if (true /*employee.hasPermission(handlePermission.get(ControlType.load))*/) {
						load(request, writer);
						break;
					} else {
						errorPermission(ControlType.load, writer);
						return;
					}

				default:
					if (!handleChilder(request, writer, response)) {
						writer.print(ResultCode.UNKNOWN_USER_OPERATION_TYPE);
					}
			}
		} catch (Exception e) {
			logger.error("调用servlet 发生异常 {}！", e);
			writer.print(ResultCode.CALL_SERVLET_ERROR);
			return;
		}
	}


	protected void queryAll(HttpServletRequest request, PrintWriter writer) {
	}

	protected void query(HttpServletRequest request, PrintWriter writer) {
	}

	protected void load(HttpServletRequest request, PrintWriter writer) {
	}

	protected void add(HttpServletRequest request, PrintWriter writer) {
	}

	protected void update(HttpServletRequest request, PrintWriter writer) {
	}

	protected void delete(HttpServletRequest request, PrintWriter writer) {
	}

	protected void importFile(HttpServletRequest request, PrintWriter writer, HttpServletResponse response) {
	}

	protected void exportFile(HttpServletRequest request, PrintWriter writer, HttpServletResponse response) {
	}

	/**
	 * 一个职责链,将handle()未处理的类型内子类处理.
	 * <p>
	 * 已知类型将在父类分配处理方式,传导至子类仅未知处理方式.
	 *
	 * @return true 子类成功处理, false 子类未知此处理格式.
	 */
	protected boolean handleChilder(HttpServletRequest request, PrintWriter writer, HttpServletResponse response) {
		return false;
	}

	/**
	 * 参数接收
	 */
	public JSONObject getParam(HttpServletRequest request) {
		String paramMap = request.getParameter("paramMap");
		logger.info("接收从前台传入的数据：" + paramMap);
		return JSONObject.parseObject(paramMap);
	}

	/**
	 * 获取访问类型（mobl:手机端，comp:PC端）
	 */
	private void getDeviceType(HttpServletRequest request) {
		/*if (HttpRequestDeviceUtils.isMobileDevice(request)) {
			dataJson.put("deviceType", "mobl");
		} else {
			dataJson.put("deviceType", "comp");
		}*/
	}

	/**
	 * 返回权限错误
	 */
	protected void errorPermission(ControlType opeartEnum, PrintWriter writer) {
		if (null != opeartEnum) {
			logger.error("当前用户没有此操作权限{}！", opeartEnum);
		}
		writer.print(ResultCode.USER_NOT_HAS_PERMISSION);
	}
}