package com.tk.object;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.AbstractPersistenceFactory;

/**
 * 信息资料对象.
 */


public class Document extends AbstractPersistence {
	protected Document(DocumentFactory factory) {
		super(factory);
	}
}
