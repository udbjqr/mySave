package com.tk.objects;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.util.Date;

public final class ProcessDataDetailFactory extends AbstractPersistenceFactory<ProcessDataDetail> {
	private static final ProcessDataDetailFactory instance = new ProcessDataDetailFactory();

	private ProcessDataDetailFactory() {
		this.tableName = "process_detail_data";
		this.sequenceField = addField("id", Integer.class, "nextval('seq_process_data')", true, true);
		sequenceField.setSerial("seq_process_data");

		addField("module_id", Integer.class, null, false, false);
		addField("handle_id", Integer.class, null, false, false);
		addField("execution_id", String.class, null, true, false);
		addField("task_id", String.class, null, true, false);
		addField("task_name", String.class, null, true, false);
		addField("now_data", JSONObject.class, null, false, false);
		addField("result_data", JSONObject.class, null, false, false);
		addField("employee_id", String.class, null, false, false);
		addField("create_time", Date.class, "getdate()", true, false);

		setIsCheck(false);
		init();
	}

	public static ProcessDataDetailFactory getInstance() {
		return instance;
	}

	@Override
	protected ProcessDataDetail createObject(User user) {
		return new ProcessDataDetail(this, user);
	}
}
