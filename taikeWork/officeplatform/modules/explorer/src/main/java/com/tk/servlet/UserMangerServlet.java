package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.ControlType;
import com.tk.common.persistence.User;
import com.tk.common.result.ResultCode;
import com.tk.common.util.DateUtil;
import com.tk.objects.identity.Employee;
import com.tk.objects.identity.EmployeeFactory;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.util.Date;
import java.util.List;

import static com.tk.common.Constant.dbHelper;

/**
 * 用户管理操作.
 */
@WebServlet("/userManger.do")
public class UserMangerServlet extends BaseServlet {
	private static Logger log = LogManager.getLogger(UserMangerServlet.class.getName());
	// 获取到员工工厂类
	private static EmployeeFactory employeeFactory = EmployeeFactory.getInstance();

	// 获取到角色工厂类
//	private static RoleGroupFactory roleGroupFactory = RoleGroupFactory.getInstance();
	// 获取到部门工厂类
//	private static DepartmentFactory departmentFactory = DepartmentFactory.getInstance();

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
			case resetPwd:
				resetPwd(request, writer);
			default:
				return true;
		}
	}

	protected void queryAll(HttpServletRequest request, PrintWriter writer) {
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
			log.trace("获取所有的员工结束...");
			writer.print(new ResultCode(true, jsonArray));
		} catch (Exception e) {
			log.trace("获取所有的员工发生异常：{}！", e);
			writer.print(ResultCode.QUERY_ERROR);
		}
	}

	/**
	 * 删除用户（非真删）
	 *
	 * @param request
	 * @param writer
	 */
	protected void delete(HttpServletRequest request, PrintWriter writer) {
		log.trace("删除用户初始...");
		JSONObject dataJson = getParam(request);
		Integer employeeId;
		try {
			employeeId = dataJson.getInteger("employee_id");
		} catch (Exception e) {
			log.error("获取删除用户Id发生异常：{} ！", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == employeeId) {
			log.trace("获取用户Id失败！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Employee employeeInfo = employeeFactory.getObject("id", employeeId);
		if (null == employeeInfo) {
			log.trace("用户信息不存在！");
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		try {
			employeeInfo.set("flag", -1);
			employeeInfo.flush();
			log.trace("删除用户结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("删除用户发生异常，异常描述：{}", e);
			writer.print(ResultCode.DELETE_ERROR);
		}

	}

	/**
	 * 重置用户密码
	 *
	 * @return
	 */
	protected void resetPwd(HttpServletRequest request, PrintWriter writer) {
		log.trace("重置用户密码初始...");
		JSONObject dataJson = getParam(request);
		//获得用户Id
		Integer employeeId;
		try {
			employeeId = dataJson.getInteger("employee_id");
		} catch (Exception e) {
			log.error("获取用户Id异常:{}!", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == employeeId) {
			log.trace("获取用户Id失败！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Employee employeeInfo = employeeFactory.getObject("id", employeeId);
		if (null == employeeInfo) {
			log.trace("用户信息不存在！");
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		try {
			employeeInfo.set("password", "123456");
			employeeInfo.flush();
			log.trace("重置用户密码结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("重置用户密码发生异常：{}！", e);
			writer.print(ResultCode.RESET_ERROR);
		}
	}

	@Override
	protected void update(HttpServletRequest request, PrintWriter writer) {
		log.trace("修改用户信息初始...");
		JSONObject dataJson = getParam(request);
		Integer areaId;
		Integer employeeId;
		String realName;
		String mobile;
		String email;
		Integer employeeType;
		try {
			areaId = dataJson.getInteger("area_id");
			employeeId = dataJson.getInteger("employee_id");
			realName = dataJson.getString("real_name");
			mobile = dataJson.getString("mobile");
			email = dataJson.getString("email");
			employeeType = dataJson.getInteger("employee_type");
		} catch (Exception e) {
			log.error("获取修改用户信息异常：{}！", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == employeeId || null == employeeType) {
			log.trace("获取修改用户信息失败！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Employee employeeInfo = employeeFactory.getObject("id", employeeId);
		if (null == employeeInfo) {
			log.trace("用户信息不存在！");
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		try {
			employeeInfo.set("real_name", realName);
			employeeInfo.set("mobile", mobile);
			employeeInfo.set("email", email);
			employeeInfo.set("employee_type", employeeType);
			employeeInfo.set("area_id", areaId);
			employeeInfo.set("flag", 1);
			employeeInfo.flush();
			log.trace("修改用户信息结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("修改用户信息发生异常：{}！", e);
			writer.print(ResultCode.UPDATE_ERROR);
		}
	}

	@Override
	protected void query(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询用户列表初始...");
		JSONObject dataJson = getParam(request);
		//检查用户是否登录
		User employee = (User) request.getSession().getAttribute(Constant.sessionUserAttrib);
		String starTime;
		String endTime;
		String useFlag;
		String employeeName;
		try {
			starTime = dataJson.getString("starTime");
			endTime = dataJson.getString("endTime");
			useFlag = dataJson.getString("useFlag");
			employeeName = dataJson.getString("employeeName");
		} catch (Exception e) {
			log.error("获取查询参数发生异常：{}！", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
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
			if (StringUtils.isNotEmpty(employeeName)) {
				sql.append(" and t.real_name like " + dbHelper.getString("%" + employeeName + "%"));
			}
			//已删除的不显示
			sql.append(" and t.flag != -1 ");
			if (StringUtils.isNotEmpty(useFlag)) {
				sql.append(" and t.flag= " + useFlag);
			}
			sql.append(" order by id desc ");
			List<Employee> employeeList;
			JSONArray jsonArray = new JSONArray();
			//获得所有的数据
			employeeList = employeeFactory.getObjectsForString(sql.toString(), employee);
			if (null != employeeList && employeeList.size() > 0) {
				for (User user : employeeList) {
					JSONObject object = new JSONObject();
					object.put("id", user.get("id"));
					object.put("login_name", user.get("login_name"));
					object.put("employee_type", user.get("employee_type"));
					object.put("real_name", user.get("real_name"));
					object.put("mobile", user.get("mobile"));
					object.put("weixin_id", StringUtils.isEmpty(user.get("weixin_id")) ? "未绑定" : user.get("weixin_id"));
					object.put("create_time", DateUtil.formatDate(user.get("create_time"), Constant.DATEFORMAT));
					object.put("lastlogin_time", DateUtil.formatDate(user.get("lastlogin_time"), Constant.DATEFORMAT));
					object.put("flag", user.get("flag"));
					jsonArray.add(object);
				}
			}

			log.trace("查询用户列表结束...");
			writer.print(new ResultCode(true, jsonArray));
		} catch (Exception e) {
			log.trace("查询用户列表发生异常：{}！", e);
			writer.print(ResultCode.QUERY_ERROR);
		}
	}

	@Override
	protected void load(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询用户信息初始...");
		JSONObject dataJson = getParam(request);
		Integer employeeId;
		try {
			employeeId = dataJson.getInteger("employee_id");
		} catch (Exception e) {
			log.error("获取用户Id发生异常：{} ！", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == employeeId) {
			log.trace("获取用户Id失败！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Employee employeeInfo = employeeFactory.getObject("id", employeeId);
		if (null == employeeInfo) {
			log.trace("用户信息不存在！");
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
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

		//部门名
//		object.put("department_id", employeeInfo.get("department_id"));
//		object.put("departmentName", department == null ? "" : department.get("dept_name"));
		//角色名
		object.put("mobile", employeeInfo.get("mobile"));
		object.put("email", employeeInfo.get("email"));
		object.put("create_time", employeeInfo.get("create_time"));
		//最后登录时间
		object.put("lastlogin_time", employeeInfo.get("lastlogin_time"));
		log.trace("查询用户信息结束...");
		writer.print(new ResultCode(true, object));
	}

	@Override
	protected void add(HttpServletRequest request, PrintWriter writer) {
		log.trace("新增用户初始....");
		JSONObject dataJson = getParam(request);
		User employee = (User) request.getSession().getAttribute(Constant.sessionUserAttrib);
		Integer areaId;
		String loginName;
		String password;
		String realName;
		String mobile;
		String email;
		Integer employeeType;
		try {
			loginName = dataJson.getString("login_name");
			password = dataJson.getString("password");
			areaId = dataJson.getInteger("area_id");
			realName = dataJson.getString("real_name");
			mobile = dataJson.getString("mobile");
			email = dataJson.getString("email");
			employeeType = dataJson.getInteger("employee_type");
		} catch (Exception e) {
			log.error("获取新增用户数据异常:{}！", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}

		if (StringUtils.isEmpty(loginName) || null == employeeType || StringUtils.isEmpty(password)) {
			log.trace("获取新增用户数据失败！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Employee employeeTmp = employeeFactory.getObject("login_name", loginName);
		//判断登录名是否重复
		if (null != employeeTmp) {
			log.trace("已存在相同登录名的用户，不能新增！");
			writer.print(ResultCode.USER_NAME_EXIST);
			return;
		}
		//判断真实姓名是否重复
		employeeTmp = employeeFactory.getObject("real_name", realName);
		if (null != employeeTmp) {
			log.trace("已存在相同真实姓名的用户，不能新增！");
			writer.print(ResultCode.REAL_NAME_EXIST);
			return;
		}

		try {
			Employee newEmployee = employeeFactory.getNewObject(employee);
			newEmployee.set("login_name", loginName);
			newEmployee.set("real_name", realName);
			newEmployee.set("mobile", mobile);
			newEmployee.set("email", email);
			newEmployee.set("login_name", loginName);
			newEmployee.set("password", password);
			newEmployee.set("employee_type", employeeType);
			newEmployee.set("create_time", new Date());
			newEmployee.set("area_id", areaId);
			newEmployee.set("flag", 1);
			newEmployee.flush();
			log.trace("新增用户结束....");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("新增用户发生异常：{}！", e);
			writer.print(ResultCode.ADD_ERROR);
		}
	}
}
