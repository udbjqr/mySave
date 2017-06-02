package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.PermissionEnum;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.DateUtil;
import com.tk.common.util.PageUtil;
import com.tk.object.*;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.*;

/**
 * 用户管理操作.
 */
@WebServlet("/userManger.do")
public class UserMangerServlet extends BaseServlet {
	private static Logger log = LogManager.getLogger(UserMangerServlet.class.getName());
	// 获取到员工工厂类
	private static EmployeeFactory employeeFactory = EmployeeFactory.getInstance();
	// 获取到地区工厂类
	private static AreaDivisionFactory areaDivisionFactory = AreaDivisionFactory.getInstance();
	// 获取到角色工厂类
	private static RoleGroupFactory roleGroupFactory = RoleGroupFactory.getInstance();
	// 获取到角色工厂类
	private static DepartmentFactory departmentFactory = DepartmentFactory.getInstance();
	//获得查询工厂类
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();

	private Integer pageSize;
	private Integer pageNumber;

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.add, PermissionEnum.USER_ADD);
		handlePermission.put(ControlType.update, PermissionEnum.USER_UPDATE);
		handlePermission.put(ControlType.load, PermissionEnum.USER_QUERY);
		handlePermission.put(ControlType.query, PermissionEnum.USER_QUERY);
		handlePermission.put(ControlType.resetUserInfo, PermissionEnum.USER_RESETINFO);
		handlePermission.put(ControlType.resetPwd, PermissionEnum.USER_RESETPWD);
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.fileExport, PermissionEnum.USER_EXPORT);
	}

	@Override
	protected boolean handleChilder() {
		switch (controlType) {
			case resetPwd:
				if (employee.hasPermission(handlePermission.get(ControlType.resetPwd))) {
					return resetPwd();
				} else {
					return false;
				}
			case resetUserInfo:
				if (employee.hasPermission(handlePermission.get(ControlType.resetUserInfo))) {
					return resetUserInfo();
				} else {
					return false;
				}
			default:
				return true;
		}
	}

	@Override
	protected void queryAll() {
		log.trace("获取所有的员工初始...");
		List<Employee> employeeList;
		JSONArray jsonArray = new JSONArray();
		String sql = " where flag = 1 and real_name !='' and real_name is not null ";
		try {
			employeeList = employeeFactory.getObjectsForString(sql, null);
			if (null != employeeList && employeeList.size() > 0) {
				for (Employee user : employeeList) {
					JSONObject object = new JSONObject();
					object.put("id", user.getId());
					object.put("name", user.get("real_name"));
					jsonArray.add(object);
				}
			}
			SuccessJSON success = new SuccessJSON();
			success.put("list", jsonArray);
			log.trace("获取所有的员工结束...");
			writer.print(success);
		} catch (Exception e) {
			log.trace("获取所有的员工发生异常：{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	@Override
	protected void delete() {

	}

	/**
	 * 清空用户信息
	 *
	 * @return 返回成功或失败
	 */
	protected boolean resetUserInfo() {
		log.trace("清空员工信息初始...");
		//获得用户Id
		Integer employeeId;
		try {
			employeeId = dataJson.getInteger("employee_id");
		} catch (Exception e) {
			log.error("获取员工Id参数异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return true;
		}
		if (null == employeeId) {
			log.trace("获取员工Id参数失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return true;
		}
		Employee employeeInfo = employeeFactory.getObject("id", employeeId);
		if (null == employeeInfo) {
			log.trace("员工信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return true;
		}
		try {
			employeeInfo.set("real_name", "");
			employeeInfo.set("sex", null);
			employeeInfo.set("weixin_id", null);
			employeeInfo.set("weixin_name", "");
			employeeInfo.set("mobile", "");
			employeeInfo.set("email", "");
			employeeInfo.set("lastlogin_time", null);
			employeeInfo.set("head_portrait", "");
			employeeInfo.set("flag", "0");
			employeeInfo.flash();
			log.trace("清空员工信息结束...");
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.trace("清空员工信息发生异常：{}！", e);
			writer.print(ErrorCode.DELETE_ERROR);
		}
		return true;
	}

	/**
	 * 重置用户密码
	 *
	 * @return
	 */
	protected boolean resetPwd() {
		log.trace("重置用户密码初始...");
		//获得用户Id
		Integer employeeId;
		try {
			employeeId = dataJson.getInteger("employee_id");
		} catch (Exception e) {
			log.error("获取用户Id异常:{}!", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return true;
		}
		if (null == employeeId) {
			log.trace("获取用户Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return true;
		}
		Employee employeeInfo = employeeFactory.getObject("id", employeeId);
		if (null == employeeInfo) {
			log.trace("用户信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return true;
		}
		try {
			employeeInfo.set("password", "123456");
			employeeInfo.flash();
			log.trace("重置用户密码结束...");
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.error("重置用户密码发生异常：{}！", e);
			writer.print(ErrorCode.CALL_SERVLET_ERROR);
		}
		return true;
	}

	@Override
	protected void update() {
		log.trace("修改用户信息初始...");
		Integer areaId;
		Integer employeeId;
		String realName;
		String weixinName;
		String mobile;
		String email;
		Integer employeeType;
		Integer departmentId;
		Integer roleGroupId;
		try {
			areaId = dataJson.getInteger("area_id");
			employeeId = dataJson.getInteger("employee_id");
			realName = dataJson.getString("real_name");
			weixinName = dataJson.getString("weixin_name");
			mobile = dataJson.getString("mobile");
			email = dataJson.getString("email");
			employeeType = dataJson.getInteger("employee_type");
			departmentId = dataJson.getInteger("department_id");
			roleGroupId = dataJson.getInteger("role_group_id");
		} catch (Exception e) {
			log.error("获取修改用户信息异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == areaId || null == employeeId || null == employeeType || null == departmentId || null == roleGroupId) {
			log.trace("获取修改用户信息失败！");
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		Employee employeeInfo = employeeFactory.getObject("id", employeeId);
		if (null == employeeInfo) {
			log.trace("用户信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		try {
			employeeInfo.set("real_name", realName);
			employeeInfo.set("weixin_name", weixinName);
			employeeInfo.set("mobile", mobile);
			employeeInfo.set("email", email);
			employeeInfo.set("employee_type", employeeType);
			employeeInfo.set("department_id", departmentId);
			employeeInfo.set("role_group_id", roleGroupId);
			employeeInfo.set("area_id", areaId);
			employeeInfo.set("flag", 1);
			employeeInfo.flash();
			log.trace("修改用户信息结束...");
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.error("修改用户信息发生异常：{}！", e);
			writer.print(ErrorCode.CALL_SERVLET_ERROR);
		}
	}

	@Override
	protected void query() {
		log.trace("查询用户列表初始...");
		String starTime;
		String endTime;
		String weixinName;
		String useFlag;
		String employeeName;
		try {
			starTime = dataJson.getString("starTime");
			endTime = dataJson.getString("endTime");
			weixinName = dataJson.getString("weixinName");
			useFlag = dataJson.getString("useFlag");
			employeeName = dataJson.getString("employeeName");
		} catch (Exception e) {
			log.error("获取查询参数发生异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		try {
			pageSize = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
			pageNumber = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));
			//根据条件查询用户信息
			StringBuilder sql = new StringBuilder();
			sql.append(" WHERE 1=1 ");
			if (StringUtils.isNotEmpty(starTime)) {
				sql.append(" and t.create_time>='" + starTime + "'");
			}
			if (StringUtils.isNotEmpty(endTime)) {
				sql.append(" and t.create_time<='" + endTime + "'");
			}
			if (StringUtils.isNotEmpty(employeeName)) {
				sql.append(" and t.real_name like " + dbHelper.getString("%" + employeeName + "%"));
			}
			if (StringUtils.isNotEmpty(weixinName)) {
				sql.append(" and t.weixin_id like " + dbHelper.getString("%" + weixinName + "%"));
			}
			if (StringUtils.isNotEmpty(useFlag)) {
				sql.append(" and t.flag= " + useFlag);
			}
			sql.append(" order by id desc ");
			List<Employee> employeeList;
			JSONArray jsonArray = new JSONArray();
			//获得所有的数据
			employeeList = employeeFactory.getObjectsForString(sql.toString(), employee);
			if (null != employeeList && employeeList.size() > 0) {
				List<Employee> subList = PageUtil.getPageList(pageNumber, pageSize, employeeList);
				for (Employee employee : subList) {
					JSONObject object = new JSONObject();
					AreaDivision areaDivision = areaDivisionFactory.getObject("id", employee.get("area_id"));
					RoleGroup roleGroup = roleGroupFactory.getObject("id", employee.get("role_group_id"));
					object.put("id", employee.get("id"));
					object.put("login_name", employee.get("login_name"));
					object.put("employee_type", employee.get("employee_type"));
					object.put("area_name", areaDivision == null ? "" : areaDivision.get("area_name"));
					object.put("real_name", employee.get("real_name"));
					object.put("roleName", roleGroup == null ? "" : roleGroup.get("group_name"));
					object.put("mobile", employee.get("mobile"));
					object.put("weixin_name", StringUtils.isEmpty(employee.get("weixin_id")) ? "未绑定" : employee.get("weixin_id"));
					object.put("isBind", StringUtils.isEmpty(employee.get("weixin_id")) ? "未绑定" : "已绑定");
					object.put("create_time", DateUtil.formatDate(employee.get("create_time"), Constant.DATEFORMAT));
					object.put("status", employee.get("flag"));
					jsonArray.add(object);
				}
			}
			SuccessJSON success = new SuccessJSON();
			success.put("list", jsonArray);
			success.put("count", employeeList == null ? 0 : employeeList.size());
			log.trace("查询用户列表结束...");
			writer.print(success);
		} catch (Exception e) {
			log.trace("查询用户列表发生异常：{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	@Override
	protected void load() {
		log.trace("查询用户信息初始...");
		Integer employeeId;
		try {
			employeeId = dataJson.getInteger("employee_id");
		} catch (Exception e) {
			log.error("获取用户Id发生异常：{} ！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == employeeId) {
			log.trace("获取用户Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		Employee employeeInfo = employeeFactory.getObject("id", employeeId);
		if (null == employeeInfo) {
			log.trace("用户信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		RoleGroup roleGroup = roleGroupFactory.getObject("id", employeeInfo.get("role_group_id"));
		AreaDivision areaDivision = areaDivisionFactory.getObject("id", employeeInfo.get("area_id"));
		Department department = departmentFactory.getObject("id", employeeInfo.get("department_id"));
		Integer employeeType = employeeInfo.get("employee_type");
		JSONObject object = new JSONObject();
		object.put("employee_id", employeeInfo.get("id"));
		object.put("login_name", employeeInfo.get("login_name"));
		object.put("real_name", employeeInfo.get("real_name"));
		switch (employeeType) {
			case 1:
				object.put("employee_type_name", "代表");
				break;
			case 2:
				object.put("employee_type_name", "主管");
				break;
			case 3:
				object.put("employee_type_name", "行政");
				break;
			case 4:
				object.put("employee_type_name", "厂家");
				break;
			case 5:
				object.put("employee_type_name", "区域经理");
				break;
			case 6:
				object.put("employee_type_name", "总经理");
				break;
		}
		//地区名
		object.put("area_id", employeeInfo.get("area_id"));
		object.put("employee_type", employeeInfo.get("employee_type"));
		object.put("areaName", areaDivision == null ? "" : areaDivision.get("area_name"));

		//部门名
		object.put("department_id", employeeInfo.get("department_id"));
		object.put("departmentName", department == null ? "" : department.get("dept_name"));
		//角色名
		object.put("role_group_id", employeeInfo.get("role_group_id"));
		object.put("roleName", roleGroup == null ? "" : roleGroup.get("group_name"));
		object.put("mobile", employeeInfo.get("mobile"));
		object.put("weixin_name", employeeInfo.get("weixin_name"));
		object.put("email", employeeInfo.get("email"));
		object.put("create_time", employeeInfo.get("create_time"));
		//最后登录时间
		object.put("lastlogin_time", employeeInfo.get("lastlogin_time"));
		SuccessJSON success = new SuccessJSON();
		success.put("employee", object);
		log.trace("查询用户信息结束...");
		writer.print(success);
	}

	@Override
	protected void add() {
		log.trace("新增用户初始....");
		Integer areaId;
		String loginName;
		String password;
		String realName;
		String weixinName;
		String mobile;
		String email;
		Integer employeeType;
		Integer departmentId;
		Integer roleGroupId;
		try {
			loginName = dataJson.getString("login_name");
			password = dataJson.getString("password");
			areaId = dataJson.getInteger("area_id");
			realName = dataJson.getString("real_name");
			weixinName = dataJson.getString("weixin_name");
			mobile = dataJson.getString("mobile");
			email = dataJson.getString("email");
			employeeType = dataJson.getInteger("employee_type");
			departmentId = dataJson.getInteger("department_id");
			roleGroupId = dataJson.getInteger("role_group_id");
		} catch (Exception e) {
			log.error("获取新增用户数据异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}

		if (StringUtils.isEmpty(loginName) || null == employeeType || StringUtils.isEmpty(password) || null == areaId || null == departmentId || null == roleGroupId) {
			log.trace("获取新增用户数据失败！");
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		Employee employeeTmp = employeeFactory.getObject("login_name", loginName);
		//判断登录名是否重复
		if (null != employeeTmp) {
			log.trace("已存在相同登录名的用户，不能新增！");
			writer.print(ErrorCode.LOGIN_NAME_EXIST);
			return;
		}
		//判断真实姓名是否重复
		employeeTmp = employeeFactory.getObject("real_name", realName);
		if (null != employeeTmp) {
			log.trace("已存在相同真实姓名的用户，不能新增！");
			writer.print(ErrorCode.REAL_NAME_EXIST);
			return;
		}
		try {
			Employee newEmployee = employeeFactory.getNewObject(employee);
			newEmployee.set("login_name", loginName);
			newEmployee.set("real_name", realName);
			newEmployee.set("weixin_name", weixinName);
			newEmployee.set("mobile", mobile);
			newEmployee.set("email", email);
			newEmployee.set("login_name", loginName);
			newEmployee.set("password", password);
			newEmployee.set("employee_type", employeeType);
			newEmployee.set("department_id", departmentId);
			newEmployee.set("create_time", new Date());
			newEmployee.set("area_id", areaId);
			newEmployee.set("role_group_id", roleGroupId);
			newEmployee.set("flag", 1);
			newEmployee.flash();
			log.trace("新增用户结束....");
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.error("新增用户发生异常：{}！", e);
			writer.print(ErrorCode.ADD_ERROR);
		}
	}

	@Override
	protected void fileUpload(HttpServletRequest request, HttpServletResponse response) {
		List<Employee> empList = EmployeeFactory.getInstance().getAllObjects(employee);
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		for (Employee employee : empList) {
			Map<String, Object> map = new LinkedHashMap<String, Object>();
			AreaDivision areaDivision = areaDivisionFactory.getObject("id", employee.get("area_id"));
			RoleGroup roleGroup = roleGroupFactory.getObject("id", employee.get("role_group_id"));
			map.put("序号", employee.get("id"));
			map.put("帐号", employee.get("login_name"));
			map.put("员工地区", areaDivision == null ? "" : areaDivision.get("area_name"));
			map.put("员工姓名", employee.get("real_name") == null ? "" : employee.get("real_name"));
			map.put("角色", roleGroup == null ? "" : roleGroup.get("group_name"));
			map.put("手机号码", employee.get("mobile") == null ? "" : employee.get("mobile"));
			map.put("微信号", employee.get("weixin_name") == null ? "" : employee.get("mobile"));
			map.put("创建时间", employee.get("create_time"));
			Integer flag = (Integer) employee.get("flag");
			map.put("状态", flag.intValue() == 1 ? "正常" : "异常");
			list.add(map);
		}

		if (list.size() > 0) {
			exportListData(list);
			log.trace("导出列表数据结束...");
		} else {
			log.trace("暂无数据！");
			writer.print(new SuccessJSON("msg", "暂无数据！"));
		}
	}

	@Override
	protected void fileImport(HttpServletRequest request) {
		try {
			boolean ifag = false;
			Collection<Map> importExcel = getImportDataMap(request);
			if (importExcel == null) {
				return;
			}

			for (Map map : importExcel) {
				Integer areaId = Integer.valueOf(map.get("地区ID").toString());
				String loginName = map.get("帐号").toString();
				String password = map.get("密码").toString();
				String realName = map.get("员工姓名").toString();
				String weixinName = map.get("微信号").toString();
				String mobile = map.get("手机号码").toString();
				String email = map.get("邮箱").toString();
				Integer employeeType = Integer.valueOf(map.get("用户类型ID").toString());
				Integer departmentId = Integer.valueOf(map.get("部门ID").toString());
				Integer roleGroupId = Integer.valueOf(map.get("角色ID").toString());

				Employee newEmployee = employeeFactory.getNewObject(employee);
				newEmployee.set("login_name", loginName);
				newEmployee.set("real_name", realName);
				newEmployee.set("weixin_name", weixinName);
				newEmployee.set("mobile", mobile);
				newEmployee.set("email", email);
				newEmployee.set("login_name", loginName);
				newEmployee.set("password", password);
				newEmployee.set("employee_type", employeeType);
				newEmployee.set("department_id", departmentId);
				newEmployee.set("create_time", new Date());
				newEmployee.set("area_id", areaId);
				newEmployee.set("role_group_id", roleGroupId);
				newEmployee.set("flag", 1);
				ifag = newEmployee.flash();
				writer.print(new SuccessJSON());
			}

			if (ifag) {
				writer.print(new SuccessJSON("msg", "导入用户列表成功！"));
			} else {
				writer.print(ErrorCode.IMPORT_FILE_FAIL);
			}
		} catch (Exception e) {
			log.error("文件导入失败", e);
			writer.print(ErrorCode.IMPORT_FILE_FAIL);
		}
	}

}
