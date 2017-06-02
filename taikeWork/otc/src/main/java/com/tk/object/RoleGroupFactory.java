package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.util.Date;

/**
 * 权限组对象工厂方法.
 */
public class RoleGroupFactory extends AbstractPersistenceFactory<RoleGroup> {
	private static RoleGroupFactory instance = new RoleGroupFactory();

	public static RoleGroupFactory getInstance() {
		return instance;
	}

	private RoleGroupFactory() {
		this.tableName = "role_group";
		this.sequenceField = addField("id", -1, Integer.class, "", true, true);
		this.sequenceField.setSerial("");

		addField("group_name", 20, String.class, null, true, false);
		addField("remark", 9999, String.class, null, false, false);
		addField("permission_string", 9999, String.class, null, false, false);
		addField("suppress_displsy_field", 9999, String.class, null, false, false);
		addField("create_time", 25, Date.class, "getdate()", true, false);


		init();

		getAllObjects(null);
	}

	@Override
	protected RoleGroup createObject(User user) {
		return new RoleGroup(this);
	}
}
