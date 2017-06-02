package com.tk.objects.identity;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

public final class DeptLinkRoleLinkEmployeeFactory extends AbstractPersistenceFactory<DeptLinkRoleLinkEmployee> {
	private static final DeptLinkRoleLinkEmployeeFactory instance = new DeptLinkRoleLinkEmployeeFactory();

	private DeptLinkRoleLinkEmployeeFactory() {
		this.tableName = "link_department_role_employee";

		addField("department_id", Integer.class, null, true, true);
		addField("role_id", Integer.class, null, true, true);
		addField("employee_id", Integer.class, null, true, true);

		init();
	}

	public static DeptLinkRoleLinkEmployeeFactory getInstance() {
		return instance;
	}

	@Override
	protected DeptLinkRoleLinkEmployee createObject(User user) {
		return new DeptLinkRoleLinkEmployee(this, user);
	}
}
