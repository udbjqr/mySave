package com.tk.objects;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.util.Date;

public final class ProcessDataFactory extends AbstractPersistenceFactory<ProcessData> {
	private static final ProcessDataFactory instance = new ProcessDataFactory();

	private ProcessDataFactory() {
		this.tableName = "process_data";

		addField("execution_id", String.class, null, false, true);
		addField("sponsor", String.class, null, false, false);
		addField("data", JSONObject.class, null, false, false);
		addField("flag", Integer.class, 0, false, false);
		addField("create_time", Date.class, "now()", true, false);
		addField("last_operat", String.class, null, false, false);

		setIsCheck(false);
		hasId = false;
		init();
	}

	public static ProcessDataFactory getInstance() {
		return instance;
	}

	@Override
	protected ProcessData createObject(User user) {
		return new ProcessData(this, user);
	}
}
