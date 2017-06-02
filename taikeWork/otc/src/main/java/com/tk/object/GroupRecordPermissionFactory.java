package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

/**
 * 角色记录权限对象工厂类.
 */
public class GroupRecordPermissionFactory extends AbstractPersistenceFactory<GroupRecordPermission> {
	private static GroupRecordPermissionFactory instance = new GroupRecordPermissionFactory();

	public static GroupRecordPermissionFactory getInstance() {
		return instance;
	}

	@Override
	protected GroupRecordPermission createObject(User user) {
		return new GroupRecordPermission(this);
	}

	private GroupRecordPermissionFactory() {
		this.tableName = "group_record_permission";
		this.sequenceField = addField("id", -1, Integer.class, null, true, true);
		this.sequenceField.setSerial("");

		addField("group_id", 10, String.class, null, true, false);
		addField("record_type", 20, String.class, null, true, false);
		addField("flag", 20, String.class, null, false, false);
		addField("value", 20, String.class, null, true, false);


		setWhetherAddToList(false);
		init();
	}

}
