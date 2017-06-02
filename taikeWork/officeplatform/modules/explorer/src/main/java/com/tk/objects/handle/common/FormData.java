package com.tk.objects.handle.common;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

/**
 * 保存默认的表单对象数据.
 */
public class FormData extends AbstractPersistence {
	protected FormData(AbstractPersistenceFactory factory, User user) {
		super(factory);
	}
}
