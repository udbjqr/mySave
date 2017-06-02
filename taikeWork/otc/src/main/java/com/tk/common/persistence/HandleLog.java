package com.tk.common.persistence;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * 用户日志对象类.
 * <p>
 * 此类目前将用户日志对象写入数据库内，如需要写入其他地方，可继承并改写此类方法。
 */
public class HandleLog extends AbstractPersistence {
	private final static Logger logger = LogManager.getLogger(HandleLog.class.getName());

	protected HandleLog( AbstractPersistenceFactory factory) {
		super(factory);
	}

	@Override
	public boolean delete() {
		logger.warn("不支持此方法的调用。");
		return false;
	}

	@Override
	protected boolean updateData(String sqlstr) {
		logger.warn("不支持此方法的调用。");
		return false;
	}

}
