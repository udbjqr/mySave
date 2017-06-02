package com.tk.objects.identity;

import org.activiti.engine.impl.interceptor.Session;
import org.activiti.engine.impl.interceptor.SessionFactory;
import org.activiti.engine.impl.persistence.entity.MembershipIdentityManager;

/**
 */
public class MembershipManagerFactory implements SessionFactory {
	@Override
	public Class<?> getSessionType() {
		return MembershipIdentityManager.class;
	}

	@Override
	public Session openSession() {
		return new MembershipManager();
	}
}
