package com.tk;

import com.tk.common.Constant;
import com.tk.objects.identity.EmployeeFactory;
import org.activiti.engine.ProcessEngineConfiguration;
import org.activiti.engine.impl.persistence.entity.ExecutionEntity;
import org.activiti.engine.impl.pvm.process.ActivityImpl;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.junit.Before;
import org.junit.Test;

import static com.tk.common.Constant.*;

public class ProcessTest {
	private static Logger logger = LogManager.getLogger(ProcessTest.class.getName());

	@Before
	public void initActiviti() {
		Constant.processEngine = ProcessEngineConfiguration.createProcessEngineConfigurationFromResource(
			"test_activiti.cfg.xml").buildProcessEngine();
		WebConfig.init();
	}

	@Test
	public void testStartProcess() throws Exception {
		threadHttpSessionLink.put(Thread.currentThread(), new TestHttpSession(Constant.sessionUserAttrib, EmployeeFactory.getInstance().getObject("id",6)));
		repositoryService.createDeployment().addClasspathResource("./test.bpmn").deploy();

		ProcessInstance processInstance = runtimeService.startProcessInstanceByKey("test");

		logger.trace("pid=" + processInstance.getId() + ", pdid=" + processInstance.getProcessDefinitionId());
		
		//当前
		ActivityImpl activity = ((ExecutionEntity) processInstance).getActivity();
		logger.debug(activity.getActivityBehavior().getClass().getName());

		taskService = processEngine.getTaskService();

		Task task = taskService.createTaskQuery().singleResult();

		//runtimeService.setVariable(task.getExecutionId(),"a",0);

		taskService.setVariable(task.getId(), "a", 1);
		logger.trace(task);

		logger.warn(((ExecutionEntity) processInstance).getVariable("abcd"));
		logger.warn(((ExecutionEntity) processInstance).getVariable("aaaa"));
		taskService.complete(task.getId());

		task = taskService.createTaskQuery().singleResult();
		logger.trace(task);

		taskService.complete(task.getId());
		logger.trace(taskService.createTaskQuery().count());
	}

}
