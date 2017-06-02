package com.tk.objects.identity;


import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.util.Date;


public class DepartmentFactory extends AbstractPersistenceFactory<Department> {
	private static final DepartmentFactory instance = new DepartmentFactory();

	private DepartmentFactory() {
		this.tableName = "department";
		this.sequenceField = addField("id", Integer.class, "nextval('seq_department')", true, true);
		sequenceField.setSerial("seq_department");

		addField("dept_name", String.class, null, true, false);
		addField("flag", Integer.class, 0, true, false);
		addField("remark", String.class, null, false, false);
		addField("dept_type", String.class, null, false, false);
		addField("parent_id", Integer.class, null, false, false);
		addField("administrator_id", Integer.class, null, false, false);
		addField("create_time", Date.class, "getdate()", false, false);
		addField("revision", Integer.class, null, false, false);

		init();
	}

	public static DepartmentFactory getInstance() {
		return instance;
	}

	@Override
	protected Department createObject(User user) {
		return new Department(this, null);
	}
}
