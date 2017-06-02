package com.tk.objects.identity;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.User;


public class SetAssignee extends AbstractPersistence {

	SetAssignee(SetAssigneeFactory setAssigneeFactory, User user) {
		super(setAssigneeFactory);
	}
}
