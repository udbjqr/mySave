package com.tk.servlet;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.PermissionEnum;
import com.tk.common.util.Config;
import com.tk.common.util.FileUtil;
import com.tk.common.util.excel.ExcelLogs;
import com.tk.common.util.excel.ExcelUtil;
import com.tk.object.Employee;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * servlet 的基类.
 */
public abstract class BaseServlet extends HttpServlet {
	protected static Logger logger = LogManager.getLogger(BaseServlet.class.getName());

	protected Map<ControlType, PermissionEnum> handlePermission = new HashMap<>();
	protected PrintWriter writer;
	protected Employee employee;
	protected ControlType controlType;
	protected JSONObject dataJson;
	protected HttpSession session;
	protected HttpServletRequest request;
	protected HttpServletResponse response;

	@Override
	protected synchronized void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setHeader("content-type", "text/html;charset=UTF-8");
		this.request = request;
		this.response = response;
		setHandlePermission();

		logger.trace("客户端发起请求，请求对象：" + this.getClass().getSimpleName());
		//查看上传信息
		for (Enumeration<String> e = request.getParameterNames(); e.hasMoreElements(); ) {
			String name = e.nextElement();
			logger.trace("name:{} value:{}", name, request.getParameter(name));
		}

		session = request.getSession();

		employee = (Employee) session.getAttribute(Constant.sessionUserAttrib);
		writer = response.getWriter();
		//获得参数数据
		dataJson = getParam(request);

		handle();
	}

	/**
	 * 公用的校验值方法.
	 * <p>
	 * 不成功的情况需要写返回前台JSON对象.
	 *
	 * @return true成功.
	 */
	protected boolean checkPara() {
		return true;
	}

	protected void handle() {
		try {
			if (null == employee) {
				logger.trace("session 中无用户信息，跳转登录页面！");
				writer.print(ErrorCode.NOT_LOGIN);
				return;
			}

			//如果未传递参数
			if (null == dataJson) {
				logger.warn("获取前端数据失败！");
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}

			//操作类型
			String controlTypeString = dataJson.getString("controlType");
			if (StringUtils.isEmpty(controlTypeString)) {
				logger.warn("获取用户操作类型失败！");
				writer.print(ErrorCode.UNRECOGNIZED_USER_OPERATION_TYPE);
				return;
			}

			try {
				controlType = ControlType.valueOf(controlTypeString);
			} catch (IllegalArgumentException e) {
				logger.warn("未知的操作类型！");
				writer.print(ErrorCode.UNKNOWN_USER_OPERATION_TYPE);
				return;
			}

			if (!checkPara()) {
				return;
			}

		} catch (Exception e) {
			logger.error("调用servlet 发生异常 {}！", e);
			writer.print(ErrorCode.CALL_SERVLET_ERROR);
			return;
		}

		switch (controlType) {
			case add:
				if (employee.hasPermission(handlePermission.get(ControlType.add))) {
					add();
					break;
				} else {
					errorPermission(ControlType.add);
					return;
				}
			case delete:
				if (employee.hasPermission(handlePermission.get(ControlType.delete))) {
					delete();
					break;
				} else {
					errorPermission(ControlType.delete);
					return;
				}
			case update:
				if (employee.hasPermission(handlePermission.get(ControlType.update))) {
					update();
					break;
				} else {
					errorPermission(ControlType.update);
					return;
				}
			case query:
				if (employee.hasPermission(handlePermission.get(ControlType.query))) {
					query();
					break;
				} else {
					errorPermission(ControlType.query);
					return;
				}
			case queryAll:
				if (employee.hasPermission(handlePermission.get(ControlType.queryAll))) {
					queryAll();
					break;
				} else {
					errorPermission(ControlType.queryAll);
					return;
				}
			case load:
				if (employee.hasPermission(handlePermission.get(ControlType.load))) {
					load();
					break;
				} else {
					errorPermission(ControlType.load);
					return;
				}
			case fileImport:
				if (employee.hasPermission(handlePermission.get(ControlType.fileImport))) {
					fileImport(request);
					break;
				} else {
					errorPermission(ControlType.fileImport);
					return;
				}
			case fileExport:
				if (employee.hasPermission(handlePermission.get(ControlType.fileExport))) {
					fileUpload(request, response);
					break;
				} else {
					errorPermission(ControlType.fileExport);
					return;
				}
			default:
				if (!handleChilder()) {
					writer.print(ErrorCode.UNKNOWN_USER_OPERATION_TYPE);
				}
		}
	}

	/**
	 * 一个职责链,将handle()未处理的类型内子类处理.
	 * <p>
	 * 已知类型将在父类分配处理方式,传导至子类仅未知处理方式.
	 *
	 * @return true 子类成功处理, false 子类未知此处理格式.
	 */
	protected boolean handleChilder() {
		return false;
	}


	/**
	 * 设置相对应的操作权限.继承类必须实现此方法.
	 */
	protected abstract void setHandlePermission();

	protected void queryAll() {
	}

	protected void delete() {
	}

	protected void update() {
	}

	protected void query() {
	}

	protected void load() {
	}

	protected void add() {
	}

	protected void fileImport(HttpServletRequest request) {
		writer.print(ErrorCode.ERROR_CALL);
	}

	protected void fileUpload(HttpServletRequest request, HttpServletResponse response) {
		writer.print(ErrorCode.ERROR_CALL);
	}


	/**
	 * 参数接收
	 */
	private JSONObject getParam(HttpServletRequest request) {
		String paramMap = request.getParameter("paramMap");
		return JSONObject.parseObject(paramMap);
	}

	/**
	 * 返回权限错误
	 */
	protected void errorPermission(ControlType opeartEnum) {
		if (null != opeartEnum) {
			logger.error("当前用户没有此操作权限{}！", opeartEnum);
		}
		writer.print(ErrorCode.USER_NOT_HAS_PERMISSION);
	}

	/***
	 * 获取Excel文件数据
	 * @param request
	 * @return
	 * @throws Exception
	 */
	protected Collection<Map> getImportDataMap(HttpServletRequest request) throws Exception {
		String fileStr = dataJson.get("file").toString();
		String fileName = dataJson.getString("fileName").toString();
		String type = fileName.substring(fileName.indexOf(".") + 1, fileName.length());

		List<String> fileTypeList = new ArrayList<>();
		fileTypeList.add("xlsx");
		fileTypeList.add("xls");

		if (!fileTypeList.contains(type.toLowerCase())) {
			writer.print(ErrorCode.FILETYPE_ERROR);
			return null;
		}

		String newFileName = UUID.randomUUID().toString().replaceAll("-", "") + "." + type;
		//获取保存路径
		String savePath = Config.getInstance().getProperty("fileUploadPath") + newFileName;
		FileUtil.getFileByString(fileStr, savePath);


		File file = new File(savePath);
		ExcelLogs logs = new ExcelLogs();
		Collection<Map> importExcel = ExcelUtil.myImportExcel(Map.class, file, "yyyy/MM/dd HH:mm:ss", logs, 0);
		if (file != null && file.exists()) {
			file.delete();
		}
		return importExcel;
	}


	/***
	 * 验证导入数据是否为空
	 * @param title
	 * @return
	 */
	protected boolean vaditeImportNullDate(String title, Map map) {
		String index = (String) map.get(title + "index");
		if (StringUtils.isNotBlank(index)) {
			String[] split = index.split(",");
			if (split.length > 1) {
				String message = "第" + (Integer.valueOf(split[0]) + 1)
								+ "行第" + (Integer.valueOf(split[0]) + 1) + "列," + title + "不能为空";
				writer.print(ErrorCode.IMPORT_FILE_ERRROR.setMessage(message));//导入数据错误提示
				return false;
			}
		} else {
			String message = "您下载的导入模板错误，请重新下载对应的导入模板！";
			writer.print(ErrorCode.IMPORT_FILE_ERRROR.setMessage(message));//导入数据错误提示
			return false;
		}
		return true;
	}


	/***
	 * 获取导入错误消息
	 * @param errorCode 错误码 0：自定义错误内容 1：字符串转换为整数错误 2：字符串转换为小数错误 3：字符串转换为日期错误 4：id找不到记录错误
	 * @param title 标题
	 * @param value 内容
	 * @param map
	 */
	protected void getImportErrorMsg(int errorCode, String title, String value, Map map, String newMessage) {
		String index = "";
		String[] split = null;
		switch (errorCode) {
			case 0://自定义错误内容
				index = (String) map.get(title + "index");
				split = index.split(",");
				if (split.length > 1) {
					String message = "第" + (Integer.valueOf(split[0]) + 1) + "行第" + (Integer.valueOf(split[0]) + 1) + "列,"
									+ newMessage;
					writer.print(ErrorCode.IMPORT_FILE_ERRROR.setMessage(message));// 导入数据错误提示
					return;
				}
				break;
			case 1://字符串转换为整数错误
				index = (String) map.get(title + "index");
				split = index.split(",");
				if (split.length > 1) {
					String message = "第" + (Integer.valueOf(split[0]) + 1) + "行第" + (Integer.valueOf(split[0]) + 1) + "列,"
									+ title + "格式应该为整数,示例：26";
					writer.print(ErrorCode.IMPORT_FILE_ERRROR.setMessage(message));// 导入数据错误提示
				}
				break;
			case 2://字符串转换为小数错误
				index = (String) map.get(title + "index");
				split = index.split(",");
				if (split.length > 1) {
					String message = "第" + (Integer.valueOf(split[0]) + 1) + "行第" + (Integer.valueOf(split[0]) + 1) + "列,"
									+ title + "格式应该为小数,示例：1.65";
					writer.print(ErrorCode.IMPORT_FILE_ERRROR.setMessage(message));// 导入数据错误提示
				}
				break;
			case 3://字符串转换为日期错误
				index = (String) map.get(title + "index");
				split = index.split(",");
				if (split.length > 1) {
					String message = "第" + (Integer.valueOf(split[0]) + 1) + "行第" + (Integer.valueOf(split[0]) + 1) + "列,"
									+ title + "格式应该为yyyy-MM-dd hh:mm:ss的格式,示例：2016-10-13 18:30:44";
					writer.print(ErrorCode.IMPORT_FILE_ERRROR.setMessage(message));// 导入数据错误提示
					return;
				}
				break;
			case 4://id找不到记录错误
				index = (String) map.get(title + "index");
				split = index.split(",");
				if (split.length > 1) {
					String message = "第" + (Integer.valueOf(split[0]) + 1) + "行第" + (Integer.valueOf(split[0]) + 1) + "列,找不到"
									+ title + "为" + value + "的记录";
					writer.print(ErrorCode.IMPORT_FILE_ERRROR.setMessage(message));// 导入数据错误提示
					return;
				}
				break;
		}
	}

	/****
	 * 公用导出列表数据
	 * @param list 列表
	 */
	protected void exportListData(List<Map<String, Object>> list) {
		Set<String> keySet = list.get(0).keySet();
		String[] strArr = new String[keySet.size()];
		String[] array = keySet.toArray(strArr);

		// 获取保存路径
		String realPath = Config.getInstance().getProperty("fileUploadPath");
		String fileName = UUID.randomUUID().toString().replaceAll("-", "") + ".xls";
		String exportDirectory = Config.getInstance().getProperty("exportDirectory");
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String date = sdf.format(new Date());
		StringBuilder filePath = new StringBuilder();
		filePath.append(realPath).append(exportDirectory)
						.append(date).append("/");


		File f = new File(filePath.toString());
		if (!f.exists()) {// 如果目标文件所在的目录不存在，则创建父目录
			f.mkdirs();
		}

		f = new File(filePath.append(fileName).toString());
		OutputStream out = null;
		try {
			out = new FileOutputStream(f);
			ExcelUtil.exportExcel(array, list, out);
			out.close();

			String configPath = Config.getInstance().getProperty("configPath");
			;
			StringBuilder webFilePath = new StringBuilder();
			webFilePath.append(configPath).append("upload/")
							.append(exportDirectory).append(date)
							.append("/").append(fileName);
			SuccessJSON success = new SuccessJSON();
			success.put("msg", "导出文件成功！");
			success.put("filePath", webFilePath);
			writer.print(success);

		} catch (Exception e) {
			logger.error("文件导出失败！", e);
			writer.print(ErrorCode.EXPORT_FILE_FAIL);
		}
	}
}
