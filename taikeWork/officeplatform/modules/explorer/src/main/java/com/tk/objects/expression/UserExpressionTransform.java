package com.tk.objects.expression;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.objects.identity.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;


/**
 * 提供转换的对象.
 */
public final class UserExpressionTransform {
	private final static Logger logger = LogManager.getLogger(UserExpressionTransform.class.getName());
	private final static UserExpressionTransform instance = new UserExpressionTransform();

	public final static UserExpressionTransform USER_EXPRESSION_TRANSFORM = instance;

	private final static DepartmentFactory DEPARTMENT_FACTORY = DepartmentFactory.getInstance();
	private final static EmployeeFactory EMPLOYEE_FACTORY = EmployeeFactory.getInstance();
	private final static RoleFactory ROLE_FACTORY = RoleFactory.getInstance();
	private final static String NULLString = "";

	public static UserExpressionTransform getInstance() {
		return instance;
	}

	/**
	 * 根据传入的名称，返回用“，”分隔的用户的名称.
	 * <p>
	 * 根据当前数据库内人员与部门、岗位的关系，转换出对应人员的对象。
	 * <p>
	 * 此对象提供用户、部门、岗位之间的关系，并且以一个字段来获得所需要的用户身份。
	 * <p>
	 * 使用"_"来分隔，前缀大写字母为指明类型。
	 * 例：“USERE101_E23_D29_R2_SD20R44”
	 * E:用户对象，后续数字为用户对象ID
	 * D：部门，后续数字为部门ID
	 * R：岗位，后续数据为岗位ID
	 * S：部门与岗位，后续必须也只能带一个部门和一个岗位。
	 * 每一个分隔为指定单一ID，需要多个可以多写
	 * <p>
	 * 提供的数据将会根据当时数据库内数据，给出对应的用户名称。
	 * <p>
	 * 多个用户可以重复，转换后仅提供单一个用户名。
	 * <p>
	 * 注：指名此方法的对象应确定以“USER”为开头,以上所有字符必须大写
	 *
	 * @param names 需要转换的名称，必须以“USER”为开头
	 * @return 如果未找到或者没有对象时返回为“”,如果参数格式错误，将返回null
	 */
	public String transformUser(String names) {
		logger.trace("匹配用户，开始查找指定用户。");

		ArrayList<Employee> tempUsers = new ArrayList<>();

		if (names == null || names.equals("")) {
			logger.trace("未传入值，返回空值");
			return NULLString;
		}

		if (!names.startsWith("USER")) {
			logger.error("传入的参数格式错误，请检查，{}，参数必须以USER 开头，并以_ 分隔。", names);
			return null;
		}

		for (String name : names.substring(4).split("_")) {
			if (name.startsWith("S")) {//部门+岗位的处理方式
				String[] drs = name.substring(1).split("R"); //SD20R44 格式
				if (drs.length == 2) {
					drs[0] = drs[0].substring(1);
					try {
						String sql = " INNER JOIN link_department_role_employee l on t.id = l.employee_id where l.department_id = "
										+ drs[0] + " and role_id = " + drs[1];

						EMPLOYEE_FACTORY.getObjectsForString(sql, null).forEach(employee -> addToUsers(tempUsers, employee));
					} catch (SQLException e) {
						logger.error("读取员工数据出现异常.", e);
						return null;
					}
				} else {
					logger.error("传入的参数格式错误，请检查，{}，S开头必须带有一个部门和岗位，而且部门在前。", name);
					return null;
				}
			} else if (name.startsWith("E")) {  //人员的处理方式
				Employee employee = EMPLOYEE_FACTORY.getObject("id", Integer.parseInt(name.substring(1)));
				if (employee != null && !tempUsers.contains(employee)) {
					tempUsers.add(employee);
				}
			} else if (name.startsWith("D")) {  //部门的处理方式
				addToList(DEPARTMENT_FACTORY, tempUsers, name, object -> ((Department) object).getEmployees());
			} else if (name.startsWith("R")) {//岗位的处理方式
				addToList(ROLE_FACTORY, tempUsers, name, object -> ((Role) object).getEmployees());
			} else {
				logger.error("传入的参数格式错误，请检查，{}，参数开头只能是'E、D、R、S'，并以_ 分隔。", name);
				return null;
			}
		}

		StringBuilder builder = new StringBuilder();
		for (Employee employee : tempUsers) {
			builder.append(employee.get("login_name").toString()).append(",");
		}
		if (builder.length() > 1) {
			builder.delete(builder.length() - 1, builder.length());
		}

		return builder.toString();
	}

	/**
	 * 根据表达式转换成对象集合
	 *
	 * @param names
	 * @return
	 */
	public JSONObject transformObject(String names) {
		logger.trace("匹配用户，开始查找指定用户。");

		String msg;
		JSONObject resultObject = new JSONObject();
		resultObject.put("success", false);

		List<JSONObject> jsonList = new ArrayList<>();

		if (names == null || names.equals("")) {
			msg = "未传入值，返回空值";
			logger.trace(msg);
			resultObject.put("msg", msg);
			return resultObject;
		}

		if (!names.startsWith("USER")) {
			msg = "传入的参数格式错误，请检查，{}，参数必须以USER 开头，并以_ 分隔。";
			logger.error(msg, names);
			resultObject.put("msg", msg);
			return resultObject;
		}

		for (String name : names.substring(4).split("_")) {
			JSONObject jsonObject = null;
			if (name.startsWith("S")) {//部门+岗位的处理方式
				String[] drs = name.substring(1).split("R"); //SD20R44 格式
				if (drs.length == 2) {
					//查询角色
					Role role = RoleFactory.getInstance().getObject("id", drs[1]);
					if (null != role) {
						jsonObject = new JSONObject();
						jsonObject.put("id", role.get("id"));
						jsonObject.put("name", role.get("role_name"));
						jsonObject.put("type", "role");
					}
				} else {
					msg = "传入的参数格式错误，请检查，{}，S开头必须带有一个部门和岗位，而且部门在前。";
					logger.error(msg, name);
					resultObject.put("msg", msg);
					return resultObject;
				}
			} else if (name.startsWith("E")) {  //人员的处理方式
				Employee user = EmployeeFactory.getInstance().getObject("id", Integer.parseInt(name.substring(1)));
				if (user != null) {
					jsonObject = new JSONObject();
					jsonObject.put("id", user.get("id"));
					jsonObject.put("name", user.get("real_name"));
					jsonObject.put("type", "user");
				}

			} else if (name.startsWith("D")) {  //部门的处理方式
				Department department = DepartmentFactory.getInstance().getObject("id", Integer.parseInt(name.substring(1)));
				if (department != null) {
					jsonObject = new JSONObject();
					jsonObject.put("id", department.get("id"));
					jsonObject.put("name", department.get("dept_name"));
					jsonObject.put("type", "dept");
				}
			} else {
				msg = "传入的参数格式错误，请检查，{}，参数开头只能是'E、D、R、S'，并以_ 分隔。";
				logger.error(msg, name);
				resultObject.put("msg", msg);
				return resultObject;
			}
			//添加进集合
			if (null != jsonObject) {
				jsonList.add(jsonObject);
			}
		}
		resultObject.put("success", true);
		resultObject.put("jsonList", jsonList);
		return resultObject;
	}

	private void addToList(AbstractPersistenceFactory factory, ArrayList<Employee> list, String name, DepAndRole depAndRole) {
		AbstractPersistence object = factory.getObject("id", Integer.parseInt(name.substring(1)));
		if (object != null) {
			depAndRole.getList(object).forEach(employee -> addToUsers(list, employee));
		}
	}

	private void addToUsers(ArrayList<Employee> list, Employee employee) {
		if (!list.contains(employee)) {
			list.add(employee);
		}
	}

	@FunctionalInterface
	interface DepAndRole {
		List<Employee> getList(AbstractPersistence object);
	}
}