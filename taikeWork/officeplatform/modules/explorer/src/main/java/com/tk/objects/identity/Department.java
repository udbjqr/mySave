package com.tk.objects.identity;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.Field;
import com.tk.common.persistence.User;
import com.tk.common.persistence.WriteValueException;
import org.activiti.engine.identity.Group;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;


public class Department extends AbstractPersistence implements Group {
	private List<Employee> employees = new ArrayList<>();
	private List<Role> roles = new ArrayList<>();

	Department(DepartmentFactory departmentFactory, User user) {
		super(departmentFactory);
	}

	@Override
	public String getId() {
		return get("id");
	}

	@Override
	public void setId(String id) {
		logger.error("不允许进行此操作.");
	}

	@Override
	public String getName() {
		return get("dept_name");
	}

	@Override
	public void setName(String name) {
		try {
			set("dept_name", name);
		} catch (WriteValueException e) {
			logger.error("设置名称出现错误.", e);
		}
	}

	@Override
	public String getType() {
		return get("dept_type");
	}

	@Override
	public void setType(String string) {
		try {
			set("dept_type", string);
		} catch (WriteValueException e) {
			logger.error("设置类型出现错误.", e);
		}
	}

	@Override
	public synchronized void set(Field field, Object value) throws WriteValueException {
		super.set(field, value);

		if (field.name.equals("id")) {
			try {
				refreshRoles((Integer) value);
				refreshEmployee((Integer) value);
			} catch (SQLException e) {
				logger.error("查询出现异常：", e);
				throw new WriteValueException("查询出现异常，", value, null);
			}
		}
	}

	public void refreshRoles(int departmentId) throws SQLException {
		roles = RoleFactory.getInstance().getObjectsForString(
						" INNER JOIN link_department_role l on t.id = l.role_id where l.department_id =  " + departmentId,
						null);
	}

	public void refreshEmployee(int departmentId) throws SQLException {
		employees = EmployeeFactory.getInstance().getObjectsForString(
						" INNER JOIN link_department_role_employee l on t.id = l.employee_id where l.department_id = " + departmentId,
						null);
	}

	public List<Employee> getEmployees() {
		return employees;
	}

	public List<Role> getRoles() {
		return roles;
	}
}
