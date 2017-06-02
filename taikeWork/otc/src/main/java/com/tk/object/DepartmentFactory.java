package com.tk.object;


import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.util.Date;


public class DepartmentFactory extends AbstractPersistenceFactory<Department> {
	private static final DepartmentFactory instance = new DepartmentFactory();

	public static DepartmentFactory getInstance() {
		return instance;
	}

	@Override
	protected Department createObject(User user) {
		return new Department(this);
	}

	private DepartmentFactory() {
		this.tableName = "department";
		this.sequenceField = addField("id", -1, Integer.class, null, true, true);
		sequenceField.setSerial("");

		addField("dept_name", 200, String.class, null, true, false);
		addField("flag", 0, Integer.class, 0, true, false);
		addField("remark", 2000, String.class, null, false, false);
		addField("parent_id", 10, Integer.class, null, false, false);
		addField("administrator_id", -1, Integer.class, null, false, false);
		addField("create_time", 20, Date.class, "getdate()", false, false);

		init();
	}
}
