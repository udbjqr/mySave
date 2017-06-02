package com.tk.objects.handle;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

public final class HandleDataFactory extends AbstractPersistenceFactory<HandleData> {
	private static final HandleDataFactory instance = new HandleDataFactory();

	HandleDataFactory() {
		//TODO 这里配置关于操作的字段
		this.tableName = "handle";
		this.sequenceField = addField("id", Integer.class, "nextval('seq_handle')", true, true);
		sequenceField.setSerial("seq_handle");

		addField("view_name", String.class, null, false, false);
		addField("prompt", String.class, null, false, false);
		addField("flag", Integer.class, 0, false, false);
		addField("type", Integer.class, 0, false, false);
		addField("is_default", Integer.class, 0, false, false);
		//操作对应的类名
		addField("class_name", String.class, null, false, false);

		init();
	}

	public static HandleDataFactory getInstance() {
		return instance;
	}

	@Override
	protected HandleData createObject(User user) {
		return new HandleData(this, user);
	}
}
