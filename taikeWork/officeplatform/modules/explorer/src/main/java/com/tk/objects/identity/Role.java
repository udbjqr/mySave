package com.tk.objects.identity;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.Field;
import com.tk.common.persistence.User;
import com.tk.common.persistence.WriteValueException;

import java.sql.SQLException;
import java.util.List;

/**
 * 用户角色数据对象,此类仅代表数据字典类本身与数据库对接.
 * <p>
 * 当需要新增和删除某一个用户角色时，需要使用到此类。
 */
public final class Role extends AbstractPersistence {
	private List<Employee> employees;

	protected Role(RoleFactory factory, User user) {
		super(factory);
	}

	@Override
	public synchronized void set(Field field, Object value) throws WriteValueException {
		super.set(field, value);

		if (field.name.equals("id")) {
			try {
				refreshEmployee(value);
			} catch (SQLException e) {
				logger.error("查询出现异常：", e);
				throw new WriteValueException("查询出现异常，", value, null);
			}
		}
	}

	private void refreshEmployee(Object id) throws SQLException {
		employees = EmployeeFactory.getInstance().getObjectsForString(
						" INNER JOIN link_department_role_employee l on t.id = l.employee_id where l.role_id = " + id,
						null);
	}

	public List<Employee> getEmployees() {
		return employees;
	}
}
