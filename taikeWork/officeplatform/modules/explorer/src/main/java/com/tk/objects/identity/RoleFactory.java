package com.tk.objects.identity;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

public final class RoleFactory extends AbstractPersistenceFactory<Role> {
	private static final RoleFactory instance = new RoleFactory();

	private RoleFactory() {
		this.tableName = "role";
		this.sequenceField = addField("id", Integer.class, "nextval('seq_role')", true, true);
		sequenceField.setSerial("seq_role");

		addField("role_name", String.class, null, true, false);
		addField("remark", String.class, null, false, false);
		addField("parent_id", String.class, null, false, false);
		addField("create_time", String.class, "getdate()", false, false);
		addField("flag", Integer.class, 1, true, false);

		init();
	}

	public static RoleFactory getInstance() {
		return instance;
	}

	@Override
	protected Role createObject(User user) {
		return new Role(this, user);
	}
}
