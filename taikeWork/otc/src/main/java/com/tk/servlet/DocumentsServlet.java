package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.PermissionEnum;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.Config;
import com.tk.common.util.DateUtil;
import com.tk.common.util.ImageUtil;
import com.tk.common.util.PageUtil;
import com.tk.object.*;
import com.tk.object.KPI.KPIEducateConfig;
import com.tk.object.KPI.KPIEducateConfigFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.annotation.WebServlet;
import java.io.File;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

@WebServlet("/documents.do")
public class DocumentsServlet extends BaseServlet {

	private Integer documentType;
	private String category;
	private Integer pageSize;
	private Integer pageNumber;
	private static Logger log = LogManager.getLogger(DocumentsServlet.class.getName());
	private static DocumentFactory documentFactory = DocumentFactory.getInstance();
	private static EducateFactory educateFactory = EducateFactory.getInstance();

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.add, PermissionEnum.DOCUMENT_ADD);
		handlePermission.put(ControlType.update, PermissionEnum.DOCUMENT_UPDATE);
		handlePermission.put(ControlType.delete, PermissionEnum.DOCUMENT_DELETE);
		handlePermission.put(ControlType.load, PermissionEnum.DOCUMENT_LOAD);
		handlePermission.put(ControlType.query, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
	}


	@Override
	protected boolean handleChilder() {
		switch (controlType) {
			case addEducate:
				addEducate();
				return true;
			case updateEducate:
				updateEducate();
				return true;
			case queryEducate:
				queryEducate();
				return true;
			default:
				return false;
		}
	}

	/***
	 * 查询教育列表
	 */
	private void queryEducate() {
		ResultSet rs = null;
		DBHelper dbHelper = DBHelperFactory.getDBHelper();
		log.trace("开始查询教育列表...");
		String startTime;
		String engTime;
		Integer documentId;
		String employeeIds;
		try {
			startTime = dataJson.getString("startDate");
			engTime = dataJson.getString("endDate");
			documentId = dataJson.getInteger("document_id");
			employeeIds = dataJson.getString("employee_ids");
		} catch (Exception e) {
			log.error("获取查找文档播放信息列表异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == documentId) {
			log.trace("获取文档ID失败:！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		Document document = documentFactory.getObject("id", documentId);
		String update_time = document.getToString("update_time");
		String document_name = document.getToString("document_name");
		String download_number = document.getToString("download_number");
		Employee uploadUser = EmployeeFactory.getInstance().getObject("id", document.get("upload_employee_id"));
		String uploadUserName = null == uploadUser ? "" : uploadUser.get("real_name");

		try {
			pageSize = Integer.parseInt(dataJson.get("pageSize").toString());
			pageNumber = Integer.parseInt(dataJson.get("pageNumber").toString());

			StringBuilder sql = new StringBuilder();
			sql.append(" SELECT d.real_name AS employeeName,");
			sql.append(" b.document_name, t.* FROM educate t LEFT JOIN documents b ON b.id = t.document_id ");
			sql.append(" LEFT JOIN employee d ON d.id = t.employee_id ");
			sql.append(" where t.flag =1 ");
			sql.append(" and t.document_id = " + documentId);
			if (StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(engTime)) {
				sql.append(" and t.play_start_time between ").append(dbHelper.getString(startTime))
								.append(" and ").append(dbHelper.getString(engTime));
			}
			if (StringUtils.isNotBlank(employeeIds)) {
				sql.append(" and t.employee_id in (").append(employeeIds).append(")");
			}
			sql.append(" order by t.play_start_time desc ");
			rs = dbHelper.select(sql.toString());
			List<Object> dataArry = new ArrayList<>();
			while (rs.next()) {
				JSONObject object = new JSONObject();
				String startDateStr = rs.getString("play_start_time");
				String endDateStr = rs.getString("play_end_time");
				int duration = DateUtil.getMinute(startDateStr, endDateStr);
				String employeeName = rs.getString("employeeName");
				object.put("startDateStr", startDateStr);
				object.put("endDateStr", endDateStr);
				object.put("employeeName", employeeName);
				object.put("duration", duration + " 分钟");
				dataArry.add(object);
			}
			SuccessJSON success = new SuccessJSON();
			success.put("update_time", update_time);
			success.put("document_name", document_name);
			success.put("upload_employee", uploadUserName);
			success.put("download_number", download_number);
			success.put("play_number", dataArry.size());
			List<Object> subList = PageUtil.getPageList(pageNumber, pageSize, dataArry);
			success.put("count", dataArry.size());
			success.put("data", subList);
			writer.print(success);
		} catch (Exception e) {
			log.error("出现异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		} finally {
			dbHelper.close(rs);
		}
		log.trace("查询教育列表结束...");
	}

	@Override
	protected void queryAll() {
		log.trace("根据文档数据类型获取文档列开始...");
		try {
			documentType = dataJson.getInteger("documentType");
		} catch (Exception e) {
			log.error("获取查找文档数据类型异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == documentType) {
			log.trace("获取查找文档数据类型失败:！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		JSONArray jsonArray = new JSONArray();
		List<Document> documentList;
		try {
			documentList = documentFactory.getObjectsForString(" where flag=" + documentType, employee);
			if (null != documentList && documentList.size() > 0) {
				for (Document document : documentList) {
					JSONObject object = new JSONObject();
					object.put("id", document.get("id"));
					object.put("name", document.get("document_name"));
					jsonArray.add(object);
				}
			}
			SuccessJSON success = new SuccessJSON();
			success.put("list", jsonArray);
			log.trace("根据文档数据类型获取文档列结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("根据文档数据类型获取文档列表异常:{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
			return;
		}
	}

	@Override
	protected void delete() {
		try {
			Integer id = Integer.valueOf(dataJson.get("id").toString());
			Document document = documentFactory.getObject("id", id);
			if (document == null) {
				writer.println(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}

			String path = document.get("url");
			String savePath = Config.getInstance().getProperty("fileUploadPath");
			savePath = savePath.replace("upload/", "");
			// 获取保存路径
			File f = new File(savePath + path);
			if (f.exists()) {
				f.delete();
			}

			String tumbnails_url = document.get("tumbnails_url");
			File f2 = new File(savePath + tumbnails_url);
			if (f2.exists()) {
				f2.delete();
			}

			document.delete();
			writer.println(new SuccessJSON("msg", "删除资料成功！"));
		} catch (Exception e) {
			log.error("删除资料失败！", e);
			writer.println(ErrorCode.REQUEST_PARA_ERROR);
		}
	}

	@Override
	protected void update() {
		try {
			Integer id = Integer.valueOf(dataJson.get("id").toString());
			String category = (String) dataJson.get("category");
			String documentName = (String) dataJson.get("documentName");
			Document document = documentFactory.getObject("id", id);

			if (StringUtils.isNotBlank(category)) {
				document.set("category", category);
			}

			if (StringUtils.isNotBlank(documentName)) {
				document.set("document_name", documentName);
			}

			document.flash();
			writer.println(new SuccessJSON("msg", "更新资料成功！"));
		} catch (Exception e) {
			log.error("删除资料失败！", e);
			writer.println(ErrorCode.REQUEST_PARA_ERROR);
		}
	}

	@Override
	protected void query() {
		try {
			documentType = Integer.parseInt(dataJson.get("documentType").toString());
			pageSize = Integer.parseInt(dataJson.get("pageSize").toString());
			pageNumber = Integer.parseInt(dataJson.get("pageNumber").toString());

			switch (documentType.intValue()) {
				// 图片资料
				case 2:
					loadImageInfo(documentType);
					break;
				// 一般资料
				case 1:
					loadInfoOrVideoInfo(documentType);
					break;
				// 视频资料
				case 3:
					loadInfoOrVideoInfo(documentType);
					break;
			}

		} catch (Exception e) {
			log.info("参数异常！", e);
			writer.println(ErrorCode.REQUEST_PARA_ERROR);
		}
	}

	private void loadImageInfo(int ifag) {
		try {
			DBHelper dbHelper = DBHelperFactory.getDBHelper();
			String name = dataJson.getString("name");
			category = dataJson.get("category").toString();
			String sql = " where flag =  " + ifag + " and category = " + dbHelper.getString(category);
			if (StringUtils.isNotBlank(name)) {
				sql += " and document_name like " + dbHelper.getString("%" + name + "%");
			}

			List<Document> documents = documentFactory.getObjectsForString(sql, employee);
			List<Document> subList = PageUtil.getPageList(pageNumber, pageSize, documents);

			List<JSONObject> list = new ArrayList<>();
			String configPath = Config.getInstance().getProperty("configPath");


			SuccessJSON success = new SuccessJSON();
			for (Document document : subList) {
				JSONObject object = new JSONObject();
				object.put("id", document.get("id"));
				object.put("url", configPath + document.get("url"));
				object.put("tumbnailsUrl", configPath + document.get("tumbnails_url"));
				object.put("documentName", document.get("document_name"));
				object.put("remark", document.get("remark"));
				object.put("category", document.get("category"));
				Object update_time = document.get("update_time");
				if (update_time != null) {
					object.put("updateTime", DateUtil.formatDate(update_time, Constant.DATEFORMAT));
				}

				Integer empId = document.get("upload_employee_id");
				Employee emp = EmployeeFactory.getInstance().getObject("id", empId);
				object.put("downloadNumber", document.get("download_number"));

				if (emp != null) {
					object.put("uploadEmployee", emp.get("real_name"));
				}

				list.add(object);
			}

			success.put("available", isHasDocumentUploadAuth() == true ? "true" : "false");
			success.put("count", documents.size());
			success.put("documentsList", list);
			writer.print(success);
		} catch (SQLException e) {
			log.error("sql语句异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	private void loadInfoOrVideoInfo(int ifag) {
		try {
			DBHelper dbHelper = DBHelperFactory.getDBHelper();
			String name = dataJson.getString("name");

			StringBuilder sql = new StringBuilder();

			sql.append(" where flag =  " + ifag);

			if (StringUtils.isNotBlank(name)) {
				sql.append(" and document_name like " + dbHelper.getString("%" + name + "%"));
			}

			List<Document> documents = documentFactory.getObjectsForString(sql.toString(), employee);

			List<Document> subList = PageUtil.getPageList(pageNumber, pageSize, documents);

			String path = request.getContextPath();
			String configPath = Config.getInstance().getProperty("configPath");


			List<JSONObject> list = new ArrayList<>();
			SuccessJSON success = new SuccessJSON();
			for (Document document : subList) {
				JSONObject object = new JSONObject();
				object.put("id", document.get("id"));
				if (ifag == 1) {
					//查询播放记录表，有无正在播放的记录
					List<Educate> educates = educateFactory.getObjectsForString(" where flag=0 and document_id= " + document.get("id"), null);
					if (null != educates && educates.size() > 0) {
						object.put("educate_id", educates.get(0).get("id"));
					}
					/**
					 * 根据当前用户循环文档是否为考核文档
					 */
					sql.setLength(0);
					try {
						sql.append(" where t.document_id =" + document.get("id"));
						Integer employeeId = employee.getId();
						if (employeeId != 0) {
							sql.append(" and t.employee_id =" + employee.getId());
						}
						List<KPIEducateConfig> assessList = KPIEducateConfigFactory.getInstance().getObjectsForString(sql.toString(), employee);
						if (null != assessList && assessList.size() > 0) {
							object.put("is_assess", "1");
						} else {
							object.put("is_assess", "0");
						}
					} catch (Exception e) {
						log.error("查询当前循环文件id为：" + document.get("id") + "是否为考核文件出现异常！", e);
					}
					object.put("url", configPath + document.get("url"));
					object.put("tumbnailsUrl", path + "/" + document.get("tumbnails_url"));
					object.put("downloadSize", document.get("document_size"));
				} else {
					object.put("url", document.get("url"));
					object.put("tumbnailsUrl", configPath + document.get("tumbnails_url"));
				}

				object.put("documentName", document.get("document_name"));
				object.put("remark", document.get("remark"));
				Object update_time = document.get("update_time");
				if (update_time != null) {
					object.put("updateTime", DateUtil.formatDate(update_time, Constant.DATEFORMAT));
				}

				Integer empId = document.get("upload_employee_id");
				Employee emp = null;
				if (empId != null) {
					emp = EmployeeFactory.getInstance().getObject("id", empId);
				}
				object.put("downloadNumber", document.get("download_number"));

				if (emp != null) {
					object.put("uploadEmployee", emp.get("real_name"));
				}

				list.add(object);
			}

			success.put("available", isHasDocumentUploadAuth() == true ? "true" : "false");
			success.put("count", documents.size());
			success.put("documentsList", list);
			writer.print(success);
		} catch (SQLException e) {
			log.error("sql语句异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	/***
	 * 是否具有上传文件权限
	 */
	private boolean isHasDocumentUploadAuth() {
		boolean ifag = false;
		try {
			if (employee.hasPermission(handlePermission.get(ControlType.add))) {
				ifag = true;
			}
		} catch (Exception e) {
			log.error("出现异常", e);
		}
		return ifag;
	}

	@Override
	protected void load() {
		try {
			Integer id = Integer.valueOf(dataJson.get("id").toString());
			Document document = documentFactory.getObject("id", id);
			JSONObject object = new JSONObject();
			object.put("url", document.get("url"));
			object.put("id", document.get("id"));
			object.put("tumbnailsUrl", document.get("tumbnails_url"));
			object.put("documentName", document.get("document_name"));
			object.put("remark", document.get("remark"));
			object.put("updateTime", document.get("update_time"));

			Integer empId = document.get("upload_employee_id");
			Employee emp = EmployeeFactory.getInstance().getObject("id", empId);
			object.put("downloadNumber", document.get("download_number"));

			if (emp != null) {
				object.put("uploadEmployee", emp.get("real_name"));
			}

			Integer download_number = (Integer) document.get("download_number");
			if (download_number != null) {
				document.set("download_number", download_number + 1);
			} else {
				document.set("download_number", 1);
			}
			document.flash();

			writer.println(new SuccessJSON("document", object));
		} catch (Exception e) {
			log.error("查询资料失败！", e);
			writer.println(ErrorCode.REQUEST_PARA_ERROR);
		}
	}

	/**
	 * 新增播放记录
	 */
	protected void addEducate() {
		Integer employeeId = employee.getId();
		Integer documentId;
		String playStartTime;
		try {
			documentId = dataJson.getInteger("document_id");
			playStartTime = dataJson.getString("play_start_time");
		} catch (Exception e) {
			log.error("获取PPT播放参数异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == documentId) {
			log.error("获取PPT播放参数失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//没有传开始时间，默认当前时间
		if (StringUtils.isEmpty(playStartTime)) {
			playStartTime = DateUtil.getTime();
		}
		try {
			Educate educate = educateFactory.getNewObject(employee);
			educate.set("document_id", documentId);
			educate.set("employee_id", employeeId);
			educate.set("play_start_time", DateUtil.stringToDate(playStartTime));
			educate.set("flag", 0);
			educate.flash();
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.error("新增记录PPT教育失败！");
			writer.print(ErrorCode.ADD_ERROR);
		}
	}

	/**
	 * 修改播放记录
	 */
	protected void updateEducate() {
		Integer educateId;
		String playEndTime;
		try {
			educateId = dataJson.getInteger("educate_id");
			playEndTime = dataJson.getString("play_end_time");
		} catch (Exception e) {
			log.error("获取修改PPT播放参数异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == educateId) {
			log.error("获取PPT播放参数失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//没有传开始时间，默认当前时间
		if (StringUtils.isEmpty(playEndTime)) {
			playEndTime = DateUtil.getTime();
		}
		Educate educate = educateFactory.getObject("id", educateId);
		if (null == educate) {
			log.trace("播放记录不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		try {
			educate.set("play_end_time", DateUtil.stringToDate(playEndTime));
			educate.set("flag", 1);
			educate.flash();
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.error("修改记录PPT教育失败！");
			writer.print(ErrorCode.UPDATE_ERROR);
		}
	}


	@Override
	protected void add() {
		List<String> fileTypeList = new ArrayList<>();
		Integer documentType = (Integer) dataJson.get("documentType");
		String filePath = (String) dataJson.get("filePath");
		if (documentType == 1) {// 一般资料
			fileTypeList.add("ppt");
			fileTypeList.add("pptx");
			fileTypeList.add("doc");
			fileTypeList.add("docx");
			fileTypeList.add("pdf");
			fileTypeList.add("xlsx");
			fileTypeList.add("xls");
			fileTypeList.add("html");
		} else if (documentType == 3 || documentType == 2) {// 视频资料
			fileTypeList.add("jpg");
			fileTypeList.add("jpeg");
			fileTypeList.add("bmp");
			fileTypeList.add("png");
			fileTypeList.add("gif");
		} else {
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}

		try {
			String fileName = dataJson.getString("fileName").toString();
			String type = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length());
			if (!fileTypeList.contains(type.toLowerCase())) {
				writer.print(ErrorCode.FILETYPE_ERROR);
				return;
			}

			if (documentType == 1) {// 一般资料
				Document document = documentFactory.getNewObject(employee);
				Map<String, String> imgUrl = new HashMap<>();
				imgUrl.put("excel", "documentTypeImage/excel/excel-0@2x.png");
				imgUrl.put("pdf", "documentTypeImage/pdf/pdf-0@2x.png");
				imgUrl.put("ppt", "documentTypeImage/ppt/ppt-0@2x.png");
				imgUrl.put("word", "documentTypeImage/word/word-0@2x.png");

				if (type.toLowerCase().equals("ppt") || type.toLowerCase().equals("pptx")) {
					document.set("tumbnails_url", imgUrl.get("ppt"));
				} else if (type.toLowerCase().equals("xlsx") || type.toLowerCase().equals("xls")) {
					document.set("tumbnails_url", imgUrl.get("excel"));
				} else if (type.toLowerCase().equals("doc") || type.toLowerCase().equals("docx")) {
					document.set("tumbnails_url", imgUrl.get("word"));
				} else if (type.toLowerCase().equals("pdf")) {
					document.set("tumbnails_url", imgUrl.get("pdf"));
				}

				document.set("url", filePath);
				document.set("document_name", fileName);
				document.set("document_size", request.getSession().getAttribute(filePath));
				request.getSession().removeAttribute(filePath);
				document.set("flag", documentType);
				document.set("upload_employee_id", employee.get("id"));
				document.set("update_time", new Date());
				document.set("download_number", 0);
				if (document.flash()) {
					writer.print(new SuccessJSON("msg", "添加资料成功！"));
				} else {
					writer.print(ErrorCode.ADD_ERROR);
				}

			} else if (documentType == 2) {// 图片资料
				String category = dataJson.get("category").toString();
				String savePath = Config.getInstance().getProperty("fileUploadPath");
				if (filePath.length() > 0 && fileName.length() > 0) {
					String[] split = filePath.split(",");
					String[] split2 = fileName.split(",");
					for (String name : split2) {
						type = name.substring(name.lastIndexOf(".") + 1, name.length());
						if (!fileTypeList.contains(type.toLowerCase())) {
							writer.print(ErrorCode.FILETYPE_ERROR);
							return;
						}
					}
					boolean ifag = true;
					for (int i = 0; i < split.length; i++) {
						savePath = savePath.replace("upload/", "");
						String thumbFileName = new ImageUtil().thumbnailImage(savePath + split[i], 150, 100);
						int index = split[i].lastIndexOf("/");
						String path = split[i].substring(0, index + 1);//取得路径目录
						String thumbFilePath = path + thumbFileName;
						Document document = documentFactory.getNewObject(employee);
						document.set("tumbnails_url", thumbFilePath);
						document.set("url", split[i]);
						document.set("document_name", split2[i]);
						document.set("category", category.trim());
						document.set("flag", documentType);
						document.set("upload_employee_id", employee.get("id"));
						document.set("update_time", new Date());
						document.set("download_number", 0);
						ifag = document.flash();
					}

					if (ifag) {
						writer.print(new SuccessJSON("msg", "添加资料成功！"));
					} else {
						writer.print(ErrorCode.ADD_ERROR);
					}
				} else {
					writer.print(ErrorCode.REQUEST_PARA_ERROR);
					return;
				}
			} else {// 视频资料
				String documentName = dataJson.get("documentName").toString();
				String url = dataJson.get("url").toString();
				Document document = documentFactory.getNewObject(employee);
				document.set("document_name", documentName);
				document.set("tumbnails_url", filePath);
				document.set("url", url);
				document.set("flag", documentType);
				document.set("upload_employee_id", employee.get("id"));
				document.set("update_time", new Date());
				document.set("download_number", 0);
				if (document.flash()) {
					writer.print(new SuccessJSON("msg", "添加资料成功！"));
				} else {
					writer.print(ErrorCode.ADD_ERROR);
				}
			}

		} catch (NullPointerException e) {
			log.error("参数异常！", e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		} catch (Exception e) {
			log.error("上传文件失败！", e);
			writer.print(ErrorCode.ADD_ERROR);
		}
	}

}
