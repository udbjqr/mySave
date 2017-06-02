package com.tk.objects.identity;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

public final class DeptLinkRoleFactory extends AbstractPersistenceFactory<DeptLinkRole> {
	private static final DeptLinkRoleFactory instance = new DeptLinkRoleFactory();

	private DeptLinkRoleFactory() {
		this.tableName = "link_department_role";

		addField("department_id", Integer.class, null, true, true);
		addField("role_id", Integer.class, null, true, true);

		init();
	}

	public static DeptLinkRoleFactory getInstance() {
		return instance;
	}

	@Override
	protected DeptLinkRole createObject(User user) {
		return new DeptLinkRole(this, user);
	}
}
