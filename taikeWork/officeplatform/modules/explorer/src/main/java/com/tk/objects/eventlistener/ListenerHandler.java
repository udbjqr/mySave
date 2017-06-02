package com.tk.objects.eventlistener;

import com.tk.objects.identity.Employee;
import org.activiti.engine.delegate.event.ActivitiEvent;

/**
 * 监听操作的接口，实现此操作的对象可被监听器调用.
 */
public interface ListenerHandler {

	void run(ActivitiEvent event, Employee employee);
}
