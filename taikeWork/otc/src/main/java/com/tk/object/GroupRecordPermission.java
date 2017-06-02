package com.tk.object;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.AbstractPersistenceFactory;

/**
 * 权限对象.每一个权限对象对应的一个权限.
 */
public class GroupRecordPermission extends AbstractPersistence {

	protected GroupRecordPermission( GroupRecordPermissionFactory groupRecordPermissionFactory) {
		super(groupRecordPermissionFactory);
	}
}
