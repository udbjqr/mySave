package com.tk.objects.eventlistener;


import com.tk.common.persistence.WriteValueException;
import com.tk.objects.ProcessData;
import com.tk.objects.identity.Employee;
import org.activiti.engine.delegate.event.ActivitiEvent;
import org.activiti.engine.impl.util.json.JSONObject;

import java.util.Date;

import static com.tk.common.Constant.PROCESS_DATA_FACTORY;

/**
 * 当一个流程实例被建立时调用.
 * <p>
 * 此对象负责创建流程时的必须的操作
 */
public final class ProcessInstanceCreate extends AbstractListenerHandler {
	private final static ProcessInstanceCreate instance = new ProcessInstanceCreate();

	public static ProcessInstanceCreate getInstance() {
		return instance;
	}


	@Override
	public void run(ActivitiEvent event, Employee employee) {
		ProcessData processData = PROCESS_DATA_FACTORY.getNewObject(null);

		try {
			processData.set("execution_id", event.getProcessInstanceId());
			if (employee == null) {
				logger.warn("操作员为空,将发起人0插入数据库当中,可能引起异常.");
				processData.set("sponsor", "");
			}else {
				processData.set("sponsor", employee.getId());
			}
			processData.set("create_time", new Date(System.currentTimeMillis()));
			processData.set("data",new JSONObject());

			processData.flush();
		} catch (WriteValueException e) {
			logger.error("发生意外异常：", e);
		}
	}
}
