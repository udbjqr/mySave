package com.tk.objects;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.Field;
import com.tk.common.persistence.User;
import com.tk.common.persistence.WriteValueException;

import java.util.ArrayList;
import java.util.List;

/**
 * 流程数据对象.
 * <p>
 * 当需要新增和删除某一个流程数据时，需要使用到此类。
 */
public final class ProcessData extends AbstractPersistence {
	private final static ProcessDataDetailFactory DETAIL_FACTORY = ProcessDataDetailFactory.getInstance();
	private List<ProcessDataDetail> details = new ArrayList<>();

	protected ProcessData(ProcessDataFactory factory, User user) {
		super(factory);
	}

	@Override
	public synchronized void set(Field field, Object value) throws WriteValueException {
		if (field.name.equals("execution_id")) {
			details = DETAIL_FACTORY.getMultipleObjects("execution_id", value, null);
		}

		super.set(field, value);
	}

	public List<ProcessDataDetail> getDetails() {
		return details;
	}

	public ProcessDataDetail createDetail() {
		return DETAIL_FACTORY.getNewObject(null);
	}
}
