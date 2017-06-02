package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.PermissionEnum;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.DateUtil;
import com.tk.common.util.PageUtil;
import com.tk.object.Department;
import com.tk.object.DepartmentFactory;
import com.tk.object.Employee;
import com.tk.object.EmployeeFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.annotation.WebServlet;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 用户组管理操作.
 */
@WebServlet("/department.do")
public class DepartmentServlet extends BaseServlet {
	private static Logger log = LogManager.getLogger(DepartmentServlet.class.getName());
	// 获取到员工工厂类
	private static EmployeeFactory employeeFactory = EmployeeFactory.getInstance();
	// 获取到用户组工厂类
	private static DepartmentFactory departmentFactory = DepartmentFactory.getInstance();
	//获得查询工厂类
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();
	private Integer pageSize;
	private Integer pageNumber;

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.add, PermissionEnum.DEPTMENT_ADD);
		handlePermission.put(ControlType.update, PermissionEnum.DEPTMENT_UPDATE);
		handlePermission.put(ControlType.load, PermissionEnum.DEPTMENT_QUERY);
		handlePermission.put(ControlType.query, PermissionEnum.DEPTMENT_QUERY);
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
	}

	@Override
	protected boolean handleChilder() {
		return false;
	}

	/**
	 * 查询所有
	 */
	@Override
	protected void queryAll() {
		log.trace("查询所有的部门初始...");
		List<Department> departmentList;
		JSONArray jsonArray = new JSONArray();
		String sql = " where dept_name is not null";
		try {
			departmentList = departmentFactory.getObjectsForString(sql, null);
			if (null != departmentList && departmentList.size() > 0) {
				for (Department department : departmentList) {
					JSONObject object = new JSONObject();
					object.put("id", department.get("id"));
					object.put("name", department.get("dept_name"));
					jsonArray.add(object);
				}
			}
			SuccessJSON success = new SuccessJSON();
			success.put("list", jsonArray);
			log.trace("查询所有的部门结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("查询所有的部门发生异常:{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	@Override
	protected void delete() {

	}

	@Override
	protected void update() {
		log.trace("修改部门信息初始...");
		//接收数据
		String deptName;
		Integer deptId;
		String remark;
		Integer administratorId;
//		Integer parentDept;
		String usersStr;
		String[] users = null;
		try {
			deptName = dataJson.getString("dept_name");
			remark = dataJson.getString("remark");
			administratorId = dataJson.getInteger("administrator_id");
			deptId = dataJson.getInteger("deptId");
//			parentDept = dataJson.getInteger("parent_id");
			usersStr = dataJson.getString("userIdStr");
		} catch (Exception e) {
			log.error("获取修改部门信息参数异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (StringUtils.isEmpty(deptName) || null == administratorId || null == deptId) {
			log.trace("获取修改部门信息参数失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//获得分配的部门成员
		if (StringUtils.isNotEmpty(usersStr)) {
			users = usersStr.split(",");
		}
		StringBuilder userStr = new StringBuilder();
		userStr.append(" ( ");
		userStr.append(administratorId);
		if (null != users) {
			for (String id : users) {
				userStr.append(",");
				userStr.append(id);
			}
		}
		userStr.append(" )");
		Department department = departmentFactory.getObject("id", deptId);
		if (null == department) {
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		try {
			department.set("dept_name", deptName);
//			department.set("parent_id", parentDept);
			department.set("remark", remark);
			department.set("administrator_id", administratorId);
			department.flash();
			//更新用户组
			updateUserDeptMent(userStr.toString(), deptId);
			log.trace("修改部门信息结束...");
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.error("修改部门信息发生异常：{}！", e);
			writer.print(ErrorCode.UPDATE_ERROR);
		}
	}

	@Override
	protected void query() {
		log.trace("获取部门列表初始...");
		String starTime;
		String endTime;
		//部门名称
		String deptName;
		try {
			starTime = dataJson.getString("starTime");
			endTime = dataJson.getString("endTime");
			//部门名称
			deptName = dataJson.getString("deptName");
		} catch (Exception e) {
			log.error("获取查询列表参数异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		pageSize = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
		pageNumber = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));
		try {
			//根据条件查询用户信息
			StringBuilder sql = new StringBuilder();
			sql.append(" WHERE 1=1 ");
			if (StringUtils.isNotEmpty(starTime)) {
				sql.append(" and t.create_time>='" + starTime + "'");
			}
			if (StringUtils.isNotEmpty(endTime)) {
				sql.append(" and t.create_time<='" + endTime + "'");
			}
			if (StringUtils.isNotEmpty(deptName)) {
				sql.append(" and t.dept_name like " + dbHelper.getString("%" + deptName + "%"));
			}
			List<Department> list = null;
			JSONArray jsonArray = new JSONArray();
			//获得所有的数据
			list = departmentFactory.getObjectsForString(sql.toString(), employee);
			if (null != list && list.size() > 0) {
				List<Department> subList = PageUtil.getPageList(pageNumber, pageSize, list);
				for (Department department : subList) {
					Employee admin = employeeFactory.getObject("id", department.get("administrator_id"));
					JSONObject object = new JSONObject();
					object.put("deptId", department.get("id"));
					object.put("dept_name", department.get("dept_name"));
					object.put("remark", department.get("remark"));
					object.put("administrator_id", department.get("administrator_id"));
					object.put("adminName", admin == null ? "" : admin.get("real_name"));
					object.put("create_time", DateUtil.formatDate(department.get("create_time"), Constant.DATEFORMAT));

					jsonArray.add(object);
				}
			}
			SuccessJSON success = new SuccessJSON();
			success.put("list", jsonArray);
			success.put("count", list == null ? 0 : list.size());
			log.trace("查询部门列表结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("查询列表发生异常：{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	@Override
	protected void load() {
		log.trace("查询部门信息初始...");
		Integer deptId;
		try {
			deptId = dataJson.getInteger("deptId");
		} catch (Exception e) {
			log.error("获取部门Id发生异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == deptId) {
			log.trace("获取部门Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//获得部门对象
		Department department = departmentFactory.getObject("id", deptId);
		if (null == department) {
			log.trace("部门信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		JSONObject object = new JSONObject();
		List<Integer> userIds = null;
		List<String> userNames = null;
		//获得部门Id
		object.put("deptId", department.get("id"));
		object.put("dept_name", department.get("dept_name"));
		object.put("remark", department.get("remark"));
		//上级部门
		object.put("parent_id", department.get("parent_id"));
		//部门管理
		object.put("administrator_id", department.get("administrator_id"));
		//组长
		Employee employeeTmp = employeeFactory.getObject("id", department.get("administrator_id"));
		//部门管理
		object.put("administratorName", employeeTmp == null ? "" : employeeTmp.get("real_name"));
		try {
			JSONObject userInfo = getUserIdsByDeptment(deptId);
			if (null != userInfo) {
				userIds = (List<Integer>) userInfo.get("userIds");
				userNames = (List<String>) userInfo.get("userNames");
			}
			if (null != userIds && userIds.size() > 0) {
				//去除管理员
				userIds.remove(department.get("administrator_id"));
				userNames.remove(employeeTmp.get("real_name"));
			}
		} catch (Exception e) {
			log.error("获取已分配的用户列表异常：{}！", e);
		}
		SuccessJSON success = new SuccessJSON();
		success.put("info", object);
		success.put("users", userIds);
		success.put("userNames", userNames);
		log.trace("查询部门信息结束...");
		writer.print(success);
	}

	@Override
	protected void add() {
		log.trace("新增部门初始...");
		//接收数据
		String deptName;
		String remark;
		Integer administratorId;
		Integer parentDept;
		String usersStr;
		String[] users = null;
		try {
			deptName = dataJson.getString("dept_name");
			remark = dataJson.getString("remark");
			administratorId = dataJson.getInteger("administrator_id");
			parentDept = dataJson.getInteger("parent_id");
			usersStr = dataJson.getString("userIdStr");
		} catch (Exception e) {
			log.error("获取新增部门数据发生异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (StringUtils.isEmpty(deptName) || null == administratorId) {
			log.trace("获取新增部门数据失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//获得分配的部门成员
		if (StringUtils.isNotEmpty(usersStr)) {
			users = usersStr.split(",");
		}
		StringBuilder userStr = new StringBuilder();
		userStr.append(" ( ");
		userStr.append(administratorId);
		if (null != users) {
			for (String id : users) {
				userStr.append(",");
				userStr.append(id);
			}
		}
		userStr.append(" )");
		Department department = departmentFactory.getNewObject(employee);
		try {
			department.set("dept_name", deptName);
			department.set("parent_id", parentDept);
			department.set("remark", remark);
			department.set("flag", 1);
			department.set("administrator_id", administratorId);
			department.set("create_time", new Date());
			department.flash();
			Integer deptId = department.get("id");
			updateUserDeptMent(userStr.toString(), deptId);
			log.trace("新增部门结束...");
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.error("新增部门发生异常：{}！", e);
			writer.print(ErrorCode.ADD_ERROR);
		}
	}


	/**
	 * 更新用户组
	 */
	private void updateUserDeptMent(String userSql, Integer deptmentId) throws Exception {
		if (StringUtils.isEmpty(userSql) || null == deptmentId) {
			throw new NullPointerException();
		}
		String sql = " update employee set department_id=" + deptmentId + " where id in " + userSql;
		dbHelper.update(sql);
	}

	private JSONObject getUserIdsByDeptment(Integer deptId) {
		List<Integer> userIds = new ArrayList<Integer>();
		List<String> userNames = new ArrayList<String>();
		if (null == deptId) {
			return null;
		}
		JSONObject object = new JSONObject();
		List<Employee> employeeList;
		try {
			employeeList = employeeFactory.getObjectsForString(" where flag = 1 and department_id =" + deptId, employee);
		} catch (Exception e) {
			return null;
		}
		if (null == employeeList || employeeList.size() == 0) {
			return null;
		}
		for (Employee employeeTmp : employeeList) {
			userIds.add(employeeTmp.getId());
			userNames.add(employeeTmp.get("real_name"));
		}
		object.put("userIds", userIds);
		object.put("userNames", userNames);
		return object;
	}

}
