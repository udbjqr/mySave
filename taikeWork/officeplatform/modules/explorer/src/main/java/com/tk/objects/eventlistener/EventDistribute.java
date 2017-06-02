package com.tk.objects.eventlistener;

import com.tk.common.Constant;
import com.tk.objects.identity.Employee;
import com.tk.objects.identity.EmployeeFactory;
import org.activiti.engine.delegate.event.ActivitiEvent;
import org.activiti.engine.delegate.event.ActivitiEventListener;
import org.activiti.engine.impl.persistence.entity.ExecutionEntity;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.runtime.ProcessInstance;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.http.HttpSession;

import static com.tk.common.Constant.runtimeService;
import static com.tk.common.Constant.threadHttpSessionLink;

/**
 * 事件的发布实例.
 */
public class EventDistribute implements ActivitiEventListener {
	protected static final Logger logger = LogManager.getLogger(EventDistribute.class.getName());

	@Override
	public void onEvent(ActivitiEvent event) {
		String type = "", name = "";
		//如果没有实例Id,直接退出
		if (event.getProcessInstanceId() == null) {
			logger.debug("获得事件,类型：{}", event.getType().name());
			return;
		}

		ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(event.getProcessInstanceId()).singleResult();
		if (processInstance != null && processInstance instanceof ExecutionEntity) {
			ActivityImpl activity = ((ExecutionEntity) processInstance).getActivity();
			if (activity != null) {
				type = activity.getActivityBehavior().getClass().getName();
				name = activity.getId();
			}
		}

		logger.debug("获得事件,类型：{},当前处理对象：name:{},type:{}", event.getType().name(), name, type);

		switch (event.getType()) {
			case PROCESS_STARTED: //流程启动时，构建流程对象
				ProcessInstanceCreate.getInstance().run(event, getCurrentEmployee());
			case TASK_CREATED: //任务开始时处理,目前处理任务是否有指定操作人员和候选人
				AssignStaffing.getInstance().run(event,getCurrentEmployee());
		}
	}


	private Employee getCurrentEmployee(){
		HttpSession session = threadHttpSessionLink.get(Thread.currentThread());
		if(session == null){
			logger.error("错误:未找到线程当前用户!!取默认用户.");
			return EmployeeFactory.getInstance().getObject("id",0);
		}

		return (Employee)session.getAttribute(Constant.sessionUserAttrib);
	}

	@Override
	public boolean isFailOnException() {
		return false;
	}
}
