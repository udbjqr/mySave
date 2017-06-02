package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.util.Date;

/**
 * 会员对象的工厂类。
 */
public class EmployeeFactory extends AbstractPersistenceFactory<Employee> {
	private static final EmployeeFactory instance = new EmployeeFactory();

	public static EmployeeFactory getInstance() {
		return instance;

	}

	@Override
	protected Employee createObject(User user) {
		return new Employee(this);
	}

	private EmployeeFactory() {
		this.tableName = "employee";
		this.sequenceField = addField("id", -1, Integer.class, null, true, true);
		sequenceField.setSerial("id");

		addField("employee_type", 10, Integer.class, null, true, false);
		addField("login_name", 20, String.class, null, true, false);
		addField("password", 50, String.class, null, true, false);
		addField("sex", 2, Integer.class, null, false, false);
		addField("parent_id",10,Integer.class,null,false,false);
		addField("department_id",10,Integer.class,null,false,false);
		addField("real_name", 10, String.class, null, true, false);
		addField("mobile", 20, String.class, null, false, false);
		addField("role_group_id", 10, Integer.class, null, false, false);
		addField("create_time", 20, Date.class, "getdate()", true, false);
		addField("lastlogin_time", 10, Date.class, null, false, false);
		addField("permission_string", 9999, String.class, null, false, false);
		addField("view_permission_string", 9999, String.class, null, false, false);
		addField("weixin_id", 9999, String.class, null, false, false);
		addField("flag", 10, Integer.class, null, false, false);
		addField("area_id", 10, Integer.class, null, false, false);
		addField("weixin_name", 9999, String.class, null, false, false);
		addField("position", 2000, String.class, null, false, false);
		addField("head_portrait", 8000, String.class, null, false, false);
		addField("email", 2000, String.class, null, false, false);

		init();
	}

	public final boolean isSupperMan(Employee employee){
		return employee.get("id").equals(0);
	}
}
