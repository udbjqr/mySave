package com.tk.objects.eventlistener;

import com.tk.objects.identity.Employee;
import org.activiti.engine.delegate.event.ActivitiEvent;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public abstract class AbstractListenerHandler implements ListenerHandler {
	protected final static Logger logger = LogManager.getLogger(AbstractListenerHandler.class.getName());
	@Override
	public abstract void run(ActivitiEvent event, Employee employee);
}
