package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.util.Date;


public class VisitsFactory extends AbstractPersistenceFactory<Visits> {
	private static final VisitsFactory instance = new VisitsFactory();

	public static VisitsFactory getInstance() {
		return instance;
	}

	@Override
	protected Visits createObject(User user) {
		return new Visits(this);
	}

	private VisitsFactory() {
		this.tableName = "customer_visits";
		this.sequenceField = addField("id", -1, Integer.class, null, true, true);
		this.sequenceField.setSerial("");

		addField("customer_id", 10, Integer.class, null, true, false);
		addField("visits_employee_id", 10, Integer.class, null, true, false);
		addField("visits_time", 20, Date.class, "getdate()", true, false);
		addField("flag", 2, Integer.class, null, true, false);
		addField("sign_in_localtion", 200, String.class, null, false, false);
		addField("sign_in_time", 20, Date.class, "getdate()", false, false);
		addField("sign_out_time", 20, Date.class, null, false, false);
		addField("plan_id", 10, Integer.class, null, true, false);

		setWhetherAddToList(false);
		init();
	}
}
