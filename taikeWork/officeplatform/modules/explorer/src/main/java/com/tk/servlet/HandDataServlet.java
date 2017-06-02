package com.tk.servlet;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.ControlType;
import com.tk.common.persistence.User;
import com.tk.common.result.ResultCode;
import com.tk.objects.handle.HandleData;
import com.tk.objects.handle.HandleDataFactory;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;

/**
 * 操作管理
 */
@WebServlet("/operat.do")
public class HandDataServlet extends BaseServlet {
	// 获取到功能信息工厂类
	private static HandleDataFactory handleDataFactory = HandleDataFactory.getInstance();

	private static Logger log = LogManager.getLogger(HandDataServlet.class.getName());

	/**
	 * servlet 初始化的时候设置权限
	 *
	 * @throws ServletException
	 */
	@Override
	public void init() throws ServletException {
//		handlePermission.put(ControlType.add, PermissionEnum.GOODS_ADD);
	}

	@Override
	protected boolean handleChilder(HttpServletRequest request, PrintWriter writer, HttpServletResponse response) {
		//获得操作类型
		ControlType controlType = (ControlType) request.getAttribute("controlType");
		if (null == controlType) {
			return false;
		}
		switch (controlType) {
			case add:
//				add();
				return true;
			default:
				return false;
		}
	}

	//添加功能
	@Override
	protected void add(HttpServletRequest request, PrintWriter writer) {
		log.trace("新增操作对象信息初始...");
		User employee = (User) request.getSession().getAttribute(Constant.sessionUserAttrib);
		JSONObject dataJson = getParam(request);
		//功能名称
		String viewName;
		//类名称
		String className;
		//提示
		String promit;
		//是否默认
		Integer isDefault;
		try {
			viewName = dataJson.getString("view_name");
			className = dataJson.getString("class_name");
			promit = dataJson.getString("promit");
			isDefault = dataJson.getInteger("is_default");
		} catch (Exception e) {
			log.error("获取新增操作信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(viewName) || StringUtils.isEmpty(className) || null == isDefault) {
			log.trace("获取新增操作信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		try {
			HandleData data = handleDataFactory.getNewObject(employee);
			data.set("view_name", viewName);
			data.set("class_name", className);
			data.set("promit", promit);
			data.set("is_default", isDefault);
			data.set("flag", 1);
			data.flush();
			log.trace("新增操作信息结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("新增操作信息发生异常，异常描述:{}", e);
			writer.print(ResultCode.ADD_ERROR);
		}
	}

	@Override
	protected void update(HttpServletRequest request, PrintWriter writer) {
		log.trace("修改操作信息初始...");
		JSONObject dataJson = getParam(request);
		Integer handId;
		//功能名称
		String viewName;
		String className;
		String promit;
		Integer isDefault;
		try {
			handId = dataJson.getInteger("hand_id");
			viewName = dataJson.getString("view_name");
			className = dataJson.getString("class_name");
			promit = dataJson.getString("promit");
			isDefault = dataJson.getInteger("is_default");
		} catch (Exception e) {
			log.error("获取新增操作信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == handId || StringUtils.isEmpty(viewName) || StringUtils.isEmpty(className) || null == isDefault) {
			log.trace("获取新增操作信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		HandleData data = handleDataFactory.getObject("id", handId);
		if (null == data) {
			log.trace("操作ID为{} 的信息未找到！", handId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		try {
			data.set("view_name", viewName);
			data.set("class_name", className);
			data.set("is_default", isDefault);
			data.set("promit", promit);
			data.flush();
			log.trace("修改操作信息结束...");
		} catch (Exception e) {
			log.error("修改操作信息发生异常，异常描述:{}", e);
			writer.print(ResultCode.UPDATE_ERROR);
		}
	}

	@Override
	protected void load(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询操作信息初始...");
		JSONObject dataJson = getParam(request);
		Integer handId;
		try {
			handId = dataJson.getInteger("hand_id");
		} catch (Exception e) {
			log.error("获取查询操作信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == handId) {
			log.trace("获取查询操作信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		HandleData data = handleDataFactory.getObject("id", handId);
		if (null == data) {
			log.trace("操作ID为{} 的信息未找到！", handId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		//返回数据
		JSONObject json = new JSONObject();
		json.put("hand_id", data.get("hand_id"));
		json.put("view_name", data.get("view_name"));
		json.put("class_name", data.get("class_name"));
		json.put("is_default", data.get("is_default"));
		json.put("promit", data.get("promit"));
		log.trace("查询操作信息结束...");
		writer.print(new ResultCode(json));
		return;
	}
}
