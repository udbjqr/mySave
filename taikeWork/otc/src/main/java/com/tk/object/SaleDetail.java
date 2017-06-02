package com.tk.object;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

/**
 * 销售记录信息.
 */
public class SaleDetail extends AbstractPersistence {
	SaleDetail(AbstractPersistenceFactory factory, User user) {
		super(factory);
		this.user = user;
	}

}
