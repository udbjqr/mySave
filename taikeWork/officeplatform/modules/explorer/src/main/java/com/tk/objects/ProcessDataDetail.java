package com.tk.objects;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.User;

/**
 * 流程数据对象.
 * <p>
 * 当需要新增和删除某一个流程数据时，需要使用到此类。
 */
public final class ProcessDataDetail extends AbstractPersistence {
	protected ProcessDataDetail(ProcessDataDetailFactory factory, User user) {
		super(factory);
	}
}