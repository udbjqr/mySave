package com.tk.objects.identity;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

public final class SetAssigneeFactory extends AbstractPersistenceFactory<SetAssignee> {
	private static final SetAssigneeFactory instance = new SetAssigneeFactory();

	private SetAssigneeFactory() {
		this.tableName = "to_set_assignee";

		addField("task_id", Integer.class, null, true, true);
		addField("employee_id", Integer.class, null, true, true);
		addField("execution_id", Integer.class, null, true, true);

		init();
	}

	public static SetAssigneeFactory getInstance() {
		return instance;
	}

	@Override
	protected SetAssignee createObject(User user) {
		return new SetAssignee(this, user);
	}
}
