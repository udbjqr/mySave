package com.tk.object;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.AbstractPersistenceFactory;

/**
 * 对方连锁门店与本系统门店对应对象.
 */


public class TargetCustomerToCustomer extends AbstractPersistence {
	protected TargetCustomerToCustomer(TargetCustomerToCustomerFactory factory) {
		super(factory);
	}
}
