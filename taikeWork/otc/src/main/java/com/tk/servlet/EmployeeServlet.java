package com.tk.servlet;

import java.io.File;
import java.io.IOException;
import java.nio.channels.FileLockInterruptionException;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSONArray;
import com.tk.common.Constant;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.*;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.common.persistence.WriteValueException;
import com.tk.object.AreaDivision;
import com.tk.object.AreaDivisionFactory;
import com.tk.object.Customer;
import com.tk.object.CustomerFactory;
import com.tk.object.Department;
import com.tk.object.DepartmentFactory;
import com.tk.object.Employee;
import com.tk.object.EmployeeFactory;
import com.tk.object.RoleGroup;
import com.tk.object.RoleGroupFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

/**
 * 员工
 */
@WebServlet("/employee.do")
@MultipartConfig//标识Servlet支持文件上传
public class EmployeeServlet extends BaseServlet {

	private static Logger log = LogManager.getLogger(EmployeeServlet.class.getName());
	private static EmployeeFactory employeeFactory = EmployeeFactory.getInstance();
	//获得查询工厂类
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();

	@Override
	protected boolean checkPara() {

		return true;
	}


	@Override
	protected boolean handleChilder() {
		switch (controlType) {
			case getJsapiTicket:
				getJsapiTicket();
				return true;
			default:
				return false;
		}
	}

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.update, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.load, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.query, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
	}

	/**
	 * 根据月份查询员工以及提交的的计划数（已审核，待审核）
	 */
	@Override
	protected void queryAll() {
		log.trace("查询所有计划审核列表的代表以及审核条数初始...");
		ResultSet rs = null;
		StringBuilder sql = new StringBuilder();
		//计划时间
		String startTime;
		String endTime;
		try {
			startTime = dataJson.getString("startTime");
			endTime = dataJson.getString("endTime");
		} catch (Exception e) {
			log.error("获取查询参数异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		try {
			//查询员工的已上传的拜访计划
			sql.append("SELECT e.id,isnull(p1.unaudit, 0) unaudit,isnull(p2.audit, 0) audit, e.real_name FROM employee e  ");
			sql.append(" LEFT JOIN (SELECT employee_id, count(*) AS unaudit FROM customer_visits_plan ");
			sql.append(" WHERE 1=1 ");
			//如果审核开始时间跟结束时间未传，默认查询当月
			if (StringUtils.isEmpty(startTime) && StringUtils.isEmpty(endTime)) {
				sql.append(" and convert(char(7) ,plan_in_time , 120)= '" + DateUtil.getTime("yyyy-MM") + "' ");
			}
			if (StringUtils.isNotEmpty(startTime)) {
				sql.append(" and convert(char(10) ,plan_in_time , 120) >= '" + startTime + "'");
			}
			if (StringUtils.isNotEmpty(endTime)) {
				sql.append(" and convert(char(10) ,plan_in_time , 120) <= '" + endTime + "'");
			}
			sql.append(" AND flag IN (3, 4)  GROUP BY employee_id) p1 ON e.id = p1.employee_id LEFT JOIN ");
			sql.append(" (SELECT employee_id,count(*) AS audit FROM customer_visits_plan ");
			sql.append(" WHERE 1=1 ");
			//如果审核开始时间跟结束时间未传，默认查询当月
			if (StringUtils.isEmpty(startTime) && StringUtils.isEmpty(endTime)) {
				sql.append(" and convert(char(7) ,plan_in_time , 120)= '" + DateUtil.getTime("yyyy-MM") + "' ");
			}
			if (StringUtils.isNotEmpty(startTime)) {
				sql.append(" and convert(char(10) ,plan_in_time , 120) >= '" + startTime + "'");
			}
			if (StringUtils.isNotEmpty(endTime)) {
				sql.append(" and convert(char(10) ,plan_in_time , 120) <= '" + endTime + "'");
			}
			sql.append("  AND flag = 1 GROUP BY employee_id) p2 ON e.id = p2.employee_id ");
			sql.append(" WHERE e.flag = 1 and e.real_name is not null and e.real_name!='' AND e.employee_type = 1 ORDER BY unaudit DESC,real_name ");
			JSONArray jsonArray = new JSONArray();
			rs = dbHelper.select(sql.toString());
			while (rs.next()) {
				JSONObject obj = new JSONObject();
				obj.put("id", rs.getObject("id"));
				obj.put("name", rs.getObject("real_name"));
				obj.put("unaudit", rs.getObject("unaudit"));
				obj.put("audit", rs.getObject("audit"));
				jsonArray.add(obj);
			}
			log.trace("查询所有计划审核列表的代表以及审核条数结束...");
			writer.println(new SuccessJSON("list", jsonArray));
		} catch (Exception e) {
			log.error("查询所有计划审核列表的代表以及审核条数异常：{}！", e);
			writer.println(ErrorCode.GET_LIST_INFO_ERROR);
		} finally {
			log.trace("Employee模块关闭dbHelper查询链接...");
			dbHelper.close(rs);
		}
	}

	@Override
	protected void delete() {

	}


	@Override
	protected void update() {
		log.trace("开始修改个人资料");
		Integer id = Integer.valueOf(employee.get("id").toString());
		String realName = dataJson.getString("realName");
		String mobile = dataJson.getString("mobile");
		String oldPassword = (String) dataJson.get("oldPassword");
		String newPassword1 = (String) dataJson.get("newPassword1");
		String newPassword2 = (String) dataJson.get("newPassword2");
		String email = (String) dataJson.get("email");
		String weixinName = (String) dataJson.get("weixinName");

		List<String> fileTypeList = new ArrayList<>();
		fileTypeList.add("jpg");
		fileTypeList.add("jpeg");
		fileTypeList.add("bmp");
		fileTypeList.add("png");
		fileTypeList.add("gif");

		String fileName = dataJson.getString("fileName");
		String headPortrait = dataJson.getString("headPortrait");

		String filePath = "";
		if (StringUtils.isNotBlank(fileName) && StringUtils.isNotBlank(headPortrait)) {
			String type = fileName.substring(fileName.indexOf(".") + 1, fileName.length());

			if (!fileTypeList.contains(type.toLowerCase())) {
				writer.print(ErrorCode.FILETYPE_ERROR);
				return;
			}

			String newFileName = UUID.randomUUID().toString().replaceAll("-", "") + "." + type;
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
			String date = sdf.format(new Date());
			String headImageDirectory = Config.getInstance().getProperty("headImageDirectory");
			String uploadDir = Config.getInstance().getProperty("fileUploadPath") + headImageDirectory;
			String dirPath = uploadDir + date;
			File f = new File(dirPath);
			if (!f.exists()) {
				f.mkdirs();
			}


			filePath = "upload/" + headImageDirectory + date + "/" + newFileName;
			//获取保存路径
			String savePath = uploadDir + date + "/" + newFileName;

			try {
				FileUtil.getFileByString(headPortrait, savePath);
			} catch (Exception e) {
				log.error("上传头像失败！", e);
			}
		}

		Employee em = employeeFactory.getObject("id", id);
		try {
			String msg = "修改个人资料成功！";
			if (StringUtils.isNotBlank(oldPassword)) {
				if (StringUtils.isBlank(newPassword1) || StringUtils.isBlank(newPassword2)) {
					//请输入新密码
					writer.print(ErrorCode.REQUEST_PARA_ERROR);
					return;
				} else if (!em.getToString("password").equals(oldPassword)) {
					//原密码输入有误！
					writer.print(ErrorCode.OLD_PASSWORD_ERROR);
					return;
				} else if (!newPassword1.equals(newPassword2)) {
					//前后密码不一致
					writer.print(ErrorCode.NEW_PASSWORD_ERROR);
					return;
				} else {
					em.set("password", newPassword1);
					msg = "修改密码成功！";
				}
			}

			if (realName != null && !realName.equals("")) {
				em.set("real_name", realName);
			}
			if (mobile != null && !mobile.equals("")) {
				em.set("mobile", mobile);
			}

			if (StringUtils.isNotBlank(email)) {
				em.set("email", email);
			}

			if (StringUtils.isNotBlank(weixinName)) {
				em.set("weixin_name", weixinName);
			}

			if (StringUtils.isNotBlank(filePath)) {
				String oldHeadPortrait = em.get("head_portrait");
				if (StringUtils.isNotBlank(oldHeadPortrait)) {
					String savePath = request.getServletContext().getRealPath("/" + oldHeadPortrait);
					File file = new File(savePath);
					if (file.exists()) {
						file.delete();
					}
				}
				em.set("head_portrait", filePath);
			}

			em.flash();
			writer.print(new SuccessJSON("msg", msg));
			if ("修改密码成功！".equals(msg)) {
				request.getSession().removeAttribute(Constant.sessionUserAttrib);
			}
			log.trace("修改个人资料结束");
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.UPDATE_ERROR);
		}

	}


	/***
	 * 查询所有负责人获取责任主管
	 */
	@Override
	protected void query() {
		try {
			String employee_type = dataJson.get("id").toString();
			String sql = " where flag = 1 and real_name!='' and real_name is not null and employee_type =  " + employee_type;

			List<Employee> empList = employeeFactory.getObjectsForString(sql, employee);
			List<JSONObject> list = new ArrayList<>();
			for (Employee employee : empList) {
				JSONObject obj = new JSONObject();
				obj.put("id", employee.get("id"));
				obj.put("name", employee.get("real_name"));
				list.add(obj);
			}

			writer.println(new SuccessJSON("list", list));
		} catch (SQLException e) {
			e.printStackTrace();
			writer.println(ErrorCode.GET_LIST_INFO_ERROR);
		} catch (NullPointerException e) {
			log.error("参数异常！", e);
			writer.println(ErrorCode.REQUEST_PARA_ERROR);
		}
	}

	@Override
	protected void load() {
		Integer id = employee.get("id");
		Employee employee = employeeFactory.getObject("id", id);
		JSONObject object = new JSONObject();
		object.put("realName", employee.get("real_name"));
		object.put("departmentId", employee.get("department_id"));
		Department dept = DepartmentFactory.getInstance().getObject("id", employee.get("department_id"));
		if (dept != null) {
			object.put("depName", dept.get("dept_name"));
		}
		object.put("mobile", employee.get("mobile"));
		object.put("loginName", employee.get("login_name"));
		AreaDivision division = AreaDivisionFactory.getInstance().getObject("id", employee.get("id"));
		if (division != null) {
			object.put("areaName", division.get("area_name"));//员工地区
		}
		RoleGroup roleGroup = RoleGroupFactory.getInstance().getObject("id", employee.get("role_group_id"));
		if (roleGroup != null) {
			object.put("groupName", roleGroup.get("group_name"));//角色
		}

		String configPath = Config.getInstance().getProperty("configPath");
		String webFilePath = "";
		if (employee.get("head_portrait") != null) {
			webFilePath = configPath + employee.get("head_portrait");
		}
		object.put("headPortrait", webFilePath);//头像
		object.put("position", employee.get("position"));//职位
		object.put("email", employee.get("email"));
		object.put("userId", employee.get("weixin_id"));//绑定的微信Id
		object.put("lastLoginTime", DateUtil.formatDate(employee.get("lastlogin_time"), Constant.DATEFORMAT));
		object.put("createTime", DateUtil.formatDate(employee.get("create_time"), Constant.DATEFORMAT));

		String weixin_name = (String) employee.get("weixin_name");
		if (weixin_name != null) {
			object.put("weixinName", weixin_name);
		} else {
			object.put("weixinName", "");
		}

		writer.print(new SuccessJSON("employee", object));
	}

	@Override
	protected void add() {

	}

	/**
	 * 获得 jsapi_ticket
	 */
	protected void getJsapiTicket() {
		String ticket = WeixinUtils.getJsapiTicketBySession(session);
		writer.print(new SuccessJSON("ticket", ticket));
	}
}
