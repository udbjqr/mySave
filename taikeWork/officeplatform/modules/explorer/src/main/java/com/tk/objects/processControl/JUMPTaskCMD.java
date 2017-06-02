package com.tk.objects.processControl;

import org.activiti.engine.impl.context.Context;
import org.activiti.engine.impl.interceptor.Command;
import org.activiti.engine.impl.interceptor.CommandContext;
import org.activiti.engine.impl.persistence.entity.ExecutionEntity;
import org.activiti.engine.impl.persistence.entity.ExecutionEntityManager;
import org.activiti.engine.impl.persistence.entity.TaskEntity;
import org.activiti.engine.impl.pvm.process.ActivityImpl;

import java.util.Iterator;
import java.util.Map;

/**
 * 节点的跳转
 */
public class JUMPTaskCMD implements Command<Void> {
	protected String executionId;
	protected ActivityImpl desActivity;
	protected Map<String, Object> paramvar;
	protected ActivityImpl currentActivity;

	public Void execute(CommandContext commandContext) {
		ExecutionEntityManager executionEntityManager = Context.getCommandContext().getExecutionEntityManager();

		// 获取当前流程的executionId，因为在并发的情况下executionId是唯一的。
		ExecutionEntity executionEntity = executionEntityManager
			.findExecutionById(executionId);
		executionEntity.setVariables(paramvar);
		executionEntity.setEventSource(this.currentActivity);
		executionEntity.setActivity(this.currentActivity);

		// 根据executionId 获取Task
		Iterator<TaskEntity> localIterator = Context.getCommandContext().getTaskEntityManager().findTasksByExecutionId(this.executionId).iterator();

		while (localIterator.hasNext()) {
			TaskEntity taskEntity = localIterator.next();

			// 触发任务监听
			taskEntity.fireEvent("complete");
			// 删除任务的原因
			Context.getCommandContext().getTaskEntityManager().deleteTask(taskEntity, "completed", false);
		}
		executionEntity.executeActivity(this.desActivity);
		return null;
	}

	/**
	 * 构造参数 可以根据自己的业务需要添加更多的字段
	 */
	public JUMPTaskCMD(String executionId, ActivityImpl desActivity,
	                   Map<String, Object> paramvar, ActivityImpl currentActivity) {
		this.executionId = executionId;
		this.desActivity = desActivity;
		this.paramvar = paramvar;
		this.currentActivity = currentActivity;
	}

//第一种方式调用
//	Map<String, Object> vars = new HashMap<String, Object>();
//	String[] v = { "shareniu1", "shareniu2", "shareniu3", "shareniu4" };
//vars.put("assigneeList", Arrays.asList(v));
//	RepositoryService repositoryService = demo.getRepositoryService();
//	ReadOnlyProcessDefinition processDefinitionEntity = (ReadOnlyProcessDefinition) repositoryService
//		.getProcessDefinition("daling:29:137504");
//	// 目标节点
//	ActivityImpl destinationActivity = (ActivityImpl) processDefinitionEntity
//		.findActivity("usertask5");
//	String executionId = "137509";
//	// 当前节点
//	ActivityImpl currentActivity = (ActivityImpl)processDefinitionEntity
//		.findActivity("usertask3");
//demo.getManagementService().executeCommand(
//new JDJumpTaskCmd(executionId, destinationActivity, vars,
//currentActivity));

//第二种方式调用
//	Map<String, Object> vars = new HashMap<String, Object>();
//	String[] v = { "shareniu1", "shareniu2", "shareniu3", "shareniu4" };
//vars.put("assigneeList", Arrays.asList(v));
//	CommandExecutor commandExecutor = taskServiceImpl
//		.getCommandExecutor();
//    commandExecutor.execute(new JDJumpTaskCmd(executionId,
//                                              destinationActivity, vars, currentActivity));
}