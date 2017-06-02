package com.tk.objects.module;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;
import org.activiti.engine.impl.bpmn.data.Data;

/**
 */
public class ModuleFactory extends AbstractPersistenceFactory<Module> {
	private static final ModuleFactory instance = new ModuleFactory();

	private ModuleFactory() {
		this.tableName = "module";
		this.sequenceField = addField("id", Integer.class, "nextval('seq_module')", true, true);
		sequenceField.setSerial("seq_module");

		addField("module_name", String.class, null, true, false);
		addField("remark", String.class, null, false, false);
		addField("flag", Integer.class, 0, true, false);
		addField("create_time", Data.class, null, false, false);
		addField("create_user", Integer.class, null, false, false);
		addField("update_time", Data.class, null, false, false);
		addField("update_user", Integer.class, null, false, false);
		addField("form_structure", JSONObject.class, null, false, false);
		addField("form_type", Integer.class, null, false, false);
		init();
	}

	public static ModuleFactory getInstance() {
		return instance;
	}

	@Override
	protected Module createObject(User user) {
		return new Module(this,user);
	}
}
