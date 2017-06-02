package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.persistence.AbstractPersistence;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 列表对象的Servlet基础类.
 * <p>
 * 最简单的列表对象从此对象继承
 */
public abstract class BaseListServlet<T extends AbstractPersistence> extends HttpServlet {
	private static Logger log = LogManager.getLogger(BaseListServlet.class.getName());

	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("content-type", "text/html;charset=UTF-8");

		int parentId = readIntFromPara("parentId", request, response.getWriter());
		if (parentId < 0) return;

		List<T> dataList;
		JSONArray dataArr = new JSONArray();
		try {
			if (parentId == 0) {
				dataList = getDataList();
			} else {
				dataList = getDataList(parentId);
			}

			dataArr.addAll(dataList.stream().map(this::addOneLine).collect(Collectors.toList()));

			response.getWriter().print(new SuccessJSON(setTitleName(), dataArr));
		} catch (Exception e) {
			log.error(setListErrorInfo(), e);

			response.getWriter().print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	/**
	 * 读指定参数对象的值.
	 *
	 * @param name    参数的名称
	 * @param request 输入对象
	 * @param writer  输出对象
	 * @return 0：未指定此参数，正数：实际得到的值，-1出现异常。
	 */
	private int readIntFromPara(String name, HttpServletRequest request, PrintWriter writer) {
		String paramMap = null;
		try {
			paramMap = request.getParameter("paramMap");


			JSONObject paramData = JSONObject.parseObject(paramMap);

			if (!paramMap.contains(name)) {
				log.trace("未上传{}参数，直接返回0值。", name);
				return 0;
			}

			return Integer.parseInt(paramData.get(name).toString());
		} catch (Exception e) {
			log.trace("", e);

			writer.print(ErrorCode.REQUEST_PARA_ERROR
							.setMessage("请求参数出现异常，上传的参数：" + paramMap).toString());
			return -1;
		}
	}

	protected String setTitleName() {
		return "list";
	}

	protected ErrorCode setListErrorInfo() {
		return ErrorCode.GET_LIST_INFO_ERROR;
	}

	protected abstract JSONObject addOneLine(T data);

	protected abstract List<T> getDataList();

	protected List<T> getDataList(int parentId) {
		if (parentId == 0) {
			return getDataList();
		}

		return null;
	}
}
