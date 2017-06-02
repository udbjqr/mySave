package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;


public class RemarkDetailFactory extends AbstractPersistenceFactory<RemarkDetail> {
	private static final RemarkDetailFactory instance = new RemarkDetailFactory();

	public static RemarkDetailFactory getInstance() {
		return instance;
	}

	@Override
	protected RemarkDetail createObject(User user) {
		return new RemarkDetail(this);
	}

	private RemarkDetailFactory() {
		this.tableName = "chain_visit_detail";
		this.sequenceField = addField("id", -1, Integer.class, null, true, true);
		this.sequenceField.setSerial("");

		addField("visits_id", 10, Integer.class, null, false, true);
		addField("remark", 2000, String.class, null, false, false);
		addField("flag", 2, Integer.class, 0, true, false);

		setWhetherAddToList(false);
		init();
	}
}
