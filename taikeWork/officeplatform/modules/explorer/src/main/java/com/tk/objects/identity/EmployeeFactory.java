package com.tk.objects.identity;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.util.Date;

/**
 * 会员对象的工厂类。
 */
public class EmployeeFactory extends AbstractPersistenceFactory<Employee> {
	private static final EmployeeFactory instance = new EmployeeFactory();

	private EmployeeFactory() {
		this.tableName = "employee";
		this.sequenceField = addField("id", Integer.class, "nextval('seq_employee')", true, true);
		sequenceField.setSerial("seq_employee");

		addField("employee_type", Integer.class, null, true, false);
		addField("login_name", String.class, null, true, false);
		addField("password", String.class, null, true, false);
		addField("sex", Integer.class, null, false, false);
		addField("parent_id", Integer.class, null, false, false);
		addField("real_name", String.class, null, true, false);
		addField("mobile", String.class, null, false, false);
		addField("create_time", Date.class, "now()", true, false);
		addField("lastlogin_time", Date.class, null, false, false);
		addField("permission_string", String.class, null, false, false);
		addField("view_permission_string", String.class, null, false, false);
		addField("weixin_id", String.class, null, false, false);
		addField("flag", Integer.class, null, false, false);
		addField("area_id", Integer.class, null, false, false);
//		addField("weixin_name", String.class, null, false, false);
		addField("position", String.class, null, false, false);
		addField("head_portrait", String.class, null, false, false);
		addField("email", String.class, null, false, false);

		init();
	}

	public static EmployeeFactory getInstance() {
		return instance;

	}

	@Override
	protected Employee createObject(User user) {
		return new Employee(this, null);
	}

	public final boolean isSupperMan(Employee employee) {
		return employee.get("id").equals(0);
	}
}
