package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.util.Date;

/**
 * 资料信息工厂对象
 */
public class AuditPlanNoteFactory extends AbstractPersistenceFactory<AuditPlanNote> {
	private static AuditPlanNoteFactory instance = new AuditPlanNoteFactory();

	public static AuditPlanNoteFactory getInstance() {
		return instance;
	}

	private AuditPlanNoteFactory() {
		this.tableName = "audit_plan_note";

		addField("employee_id", 10, Integer.class, null, true, true);
		addField("month", 20, String.class, null, true, true);
		addField("audit_user", 10, Integer.class, null, true, false);
		addField("opinion", 2000, String.class, null, true, false);
		addField("create_time", 20, Date.class, "getdate()", true, false);
		addField("update_time", 20, Date.class, "getdate()", true, false);

		init();
		setWhetherAddToList(false);
	}

	@Override
	protected AuditPlanNote createObject(User user) {
		return new AuditPlanNote(this);
	}

}
