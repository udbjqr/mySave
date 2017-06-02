package com.tk.objects.handle;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

/**
 * 保存对象数据.
 */
public class ModuleLinkHandle extends AbstractPersistence {
	protected ModuleLinkHandle(ModuleLinkHandleFactory factory, User user) {
		super(factory);
	}
}
