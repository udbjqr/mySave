package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.ControlType;
import com.tk.common.result.ResultCode;
import com.tk.objects.handle.Handle;
import com.tk.objects.identity.Employee;
import com.tk.objects.identity.SetAssignee;
import com.tk.objects.identity.SetAssigneeFactory;
import com.tk.objects.module.ModuleHandle;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.task.Task;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.util.List;

import static com.tk.common.Constant.*;
import static com.tk.objects.expression.UserExpressionTransform.USER_EXPRESSION_TRANSFORM;

/**
 * 任务管理
 */
@WebServlet("/task.do")
public class TaskServlet extends BaseServlet {
	private static Logger log = LogManager.getLogger(TaskServlet.class.getName());

	/**
	 * servlet 初始化的时候设置权限
	 *
	 * @throws ServletException
	 */
	@Override
	public void init() throws ServletException {
//		handlePermission.put(ControlType.add, PermissionEnum.GOODS_ADD);
	}

	@Override
	protected boolean handleChilder(HttpServletRequest request, PrintWriter writer, HttpServletResponse response) {
		//获得操作类型
		ControlType controlType = (ControlType) request.getAttribute("controlType");
		if (null == controlType) {
			return false;
		}
		switch (controlType) {
			case queryWaitTask:
				queryWaitTask(request, writer);
				return true;
			case claimTask:
				claimTask(request, writer);
				return true;
			case entrustTask:
				entrustTask(request, writer);
				return true;
			case historyTask:
				historyTask(request, writer);
				return true;
			case sponsorByMeTask:
				sponsorByMeTask(request, writer);
				return true;
			case setAssigenee:
				setAssigenee(request, writer);
				return true;
			default:
				return false;
		}
	}

	/**
	 * 查询我的任务列表
	 *
	 * @param request
	 * @param writer
	 */
	protected void queryWaitTask(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询我的任务列表初始...");
		Employee employee = (Employee) request.getSession().getAttribute(Constant.sessionUserAttrib);
		Integer employeeId = employee.get("id");
		List<Task> taskList = taskService//与正在执行的任务管理相关的Service
						.createTaskQuery()//创建任务查询对象
						/**查询条件（where部分）*/
						.taskAssignee(employee.get("login_name"))//指定个人任务查询，指定办理人
//						.taskCandidateUser(candidateUser)//组任务的办理人查询
//						.processDefinitionId(processDefinitionId)//使用流程定义ID查询
//						.processInstanceId(processInstanceId)//使用流程实例ID查询
//						.executionId(executionId)//使用执行对象ID查询
						/**排序*/
						.orderByTaskCreateTime().asc()//使用创建时间的升序排列
						/**返回结果集*/
//						.singleResult()//返回惟一结果集
//						.count()//返回结果集的数量
//						.listPage(firstResult, maxResults);//分页查询
						.list();//返回列表
		if (null == taskList || taskList.size() == 0) {
			log.trace("未查询到我的任务列表信息...");
			writer.print(ResultCode.NORMAL);
			return;
		}
		JSONArray jsonArray = new JSONArray();
		for (Task task : taskList) {
			JSONObject object = new JSONObject();
			object.put("task_id", task.getId());
			object.put("task_name", task.getName());
			object.put("create_time", task.getCreateTime());
			object.put("create_user", task.getAssignee());
			//流程实例ID
			object.put("instance_id", task.getProcessInstanceId());
			//执行对象ID
			object.put("execution_id", task.getExecutionId());
			//流程定义ID
			object.put("definition_id", task.getProcessDefinitionId());
			//操作名称
			object.put("definition_id", task.getProcessDefinitionId());
			try {
				//获取操作对象
				ModuleHandle moduleData = (ModuleHandle) formService.getRenderedTaskForm(task.getId(), "tkFormEngine");
				if (moduleData == null) {
					continue;
				}
				Handle handle = moduleData.getHandle();
				//判断是哪个操作对象
				log.info("获取到操作对象类名是：{}", handle.getClass());
				//跳转路径
				object.put("jumpUrl", handle.getUrl() + "/" + task.getId());

			} catch (Exception e) {
				log.error("获取任务ID为：{} 的任务操作对象信息失败，异常描述：{}", task.getId(), e);
			}

			jsonArray.add(object);
		}
		log.trace("查询我的任务列表结束...");
		writer.print(new ResultCode(true, jsonArray));
	}

	/**
	 * 查询待处理列表
	 *
	 * @param request
	 * @param writer
	 */
	protected void queryUndealTask(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询待办任务列表初始...");
		Employee employee = (Employee) request.getSession().getAttribute(Constant.sessionUserAttrib);
		Integer employeeId = employee.get("id");
		List<Task> taskList = taskService//与正在执行的任务管理相关的Service
						.createTaskQuery()//创建任务查询对象
						/**查询条件（where部分）*/
//						.taskAssignee()//指定个人任务查询，指定办理人
						.taskCandidateUser(employee.get("login_name"))//组任务的办理人查询
//						.processDefinitionId(processDefinitionId)//使用流程定义ID查询
//						.processInstanceId(processInstanceId)//使用流程实例ID查询
//						.executionId(executionId)//使用执行对象ID查询
						/**排序*/
						.orderByTaskCreateTime().asc()//使用创建时间的升序排列
						/**返回结果集*/
//						.singleResult()//返回惟一结果集
//						.count()//返回结果集的数量
//						.listPage(firstResult, maxResults);//分页查询
						.list();//返回列表
		if (null == taskList || taskList.size() == 0) {
			log.trace("未查询到待办任务列表信息...");
			writer.print(ResultCode.NORMAL);
			return;
		}
		JSONArray jsonArray = new JSONArray();
		for (Task task : taskList) {
			JSONObject object = new JSONObject();
			object.put("task_id", task.getId());
			object.put("task_name", task.getName());
			object.put("create_time", task.getCreateTime());
			object.put("create_user", task.getAssignee());
			//流程实例ID
			object.put("instance_id", task.getProcessInstanceId());
			//执行对象ID
			object.put("execution_id", task.getExecutionId());
			//流程定义ID
			object.put("definition_id", task.getProcessDefinitionId());
			jsonArray.add(object);
		}
		log.trace("查询待办任务列表结束...");
		writer.print(new ResultCode(true, jsonArray));
	}

	/**
	 * 认领任务
	 *
	 * @param request
	 * @param writer
	 */
	protected void claimTask(HttpServletRequest request, PrintWriter writer) {
		log.trace("任务认领初始...");
		JSONObject dataJson = getParam(request);
		Employee employee = (Employee) request.getSession().getAttribute(Constant.sessionUserAttrib);
		String taskId;
		try {
			taskId = dataJson.getString("task_id");
		} catch (Exception e) {
			log.error("获取任务id信息发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(taskId)) {
			log.trace("获取任务ID信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
//		taskService.setOwner(taskId, employee.get("real_name"));
		taskService.claim(taskId, employee.get("login_name"));
		log.trace("任务认领结束...");
		writer.print(ResultCode.NORMAL);
	}


	/**
	 * 委托他人代办
	 *
	 * @param request
	 * @param writer
	 */
	protected void entrustTask(HttpServletRequest request, PrintWriter writer) {
		log.trace("委托他人代办初始...");
		JSONObject dataJson = getParam(request);
		String taskId;
		//委托人Id
		Integer entrustUserId;
		try {
			taskId = dataJson.getString("task_id");
			entrustUserId = dataJson.getInteger("employee_id");
		} catch (Exception e) {
			log.error("获取委托代办信息发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(taskId) || entrustUserId == null) {
			log.trace("获取委托代办信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		//设置代办人
		taskService.setAssignee(taskId, entrustUserId.toString());
		log.trace("查询他人代办结束...");
		writer.print(ResultCode.NORMAL);
	}

	/**
	 * 获得历史任务列表
	 *
	 * @param request
	 * @param writer
	 */
	protected void historyTask(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询历史任务列表初始...");
		Employee employee = (Employee) request.getSession().getAttribute(Constant.sessionUserAttrib);
		List<HistoricTaskInstance> taskList = historyService//与正在执行的任务管理相关的Service
						.createHistoricTaskInstanceQuery()//创建任务查询对象
						/**查询条件（where部分）*/
						.taskAssignee(employee.get("login_name"))
						.finished() //已结束
//						.taskAssignee()//指定个人任务查询，指定办理人
//						.processDefinitionId(processDefinitionId)//使用流程定义ID查询
//						.processInstanceId(processInstanceId)//使用流程实例ID查询
//						.executionId(executionId)//使用执行对象ID查询
						/**返回结果集*/
						.list();//返回列表
		if (null == taskList || taskList.size() == 0) {
			log.trace("未查询历史任务列表信息...");
			writer.print(ResultCode.NORMAL);
			return;
		}
		JSONArray jsonArray = getTaskJson(taskList);
		log.trace("查询历史任务列表结束...");
		writer.print(new ResultCode(true, jsonArray));

	}

	/**
	 * 获得我发起的任务列表
	 *
	 * @param request
	 * @param writer
	 */
	protected void sponsorByMeTask(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询历史任务列表初始...");
		Employee employee = (Employee) request.getSession().getAttribute(Constant.sessionUserAttrib);
		List<HistoricTaskInstance> taskList = historyService//与正在执行的任务管理相关的Service
						.createHistoricTaskInstanceQuery()//创建任务查询对象
						/**查询条件（where部分）*/
						.taskOwner(employee.get("login_name"))
						.finished() //已结束
//						.taskAssignee()//指定个人任务查询，指定办理人
//						.processDefinitionId(processDefinitionId)//使用流程定义ID查询
//						.processInstanceId(processInstanceId)//使用流程实例ID查询
//						.executionId(executionId)//使用执行对象ID查询
						/**返回结果集*/
						.list();//返回列表
		if (null == taskList || taskList.size() == 0) {
			log.trace("未查询历史任务列表信息...");
			writer.print(ResultCode.NORMAL);
			return;
		}
		JSONArray jsonArray = getTaskJson(taskList);
		log.trace("查询历史任务列表结束...");
		writer.print(new ResultCode(true, jsonArray));
	}

	/**
	 * 下一个加点未设置操作人（设置候选人）
	 *
	 * @param request
	 * @param writer
	 */
	protected void setAssigenee(HttpServletRequest request, PrintWriter writer) {
		log.trace("设置节点候选人操作初始...");
		JSONObject dataJson = getParam(request);
		//表达式
		String nameExpression;
		String taskId;
		String executionId;
		try {
			nameExpression = dataJson.getString("name_expression");
			taskId = dataJson.getString("task_id");
			executionId = dataJson.getString("execution_id");
		} catch (Exception e) {
			log.error("获取设置表达式信息信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(nameExpression) || StringUtils.isEmpty(taskId) || StringUtils.isEmpty(executionId)) {
			log.trace("获取查询设置候选人参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		if (!nameExpression.startsWith("USER")) {
			logger.error("传入的参数格式错误，请检查，{}，参数必须以USER 开头，并以_ 分隔。", nameExpression);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		//设置候选人
		try {
			String userNameStr = USER_EXPRESSION_TRANSFORM.transformUser(nameExpression);
			if (StringUtils.isEmpty(userNameStr)) {
				log.trace("根据条件表达式未能查询到人员信息，请确认人员或表达式是否有效。");
				writer.print(ResultCode.CAN_NOT_SET_ASSIGNEE);
			}
			String[] names = userNameStr.split(",");
			//设置候选人
			if (userNameStr.indexOf(',') > 0) {
				taskService.addCandidateUser(taskId, userNameStr);
			} else {//如果是设置单个人员
				taskService.setAssignee(taskId, names[0]);
			}

			//删除记录信息
			SetAssignee setAssignee = SetAssigneeFactory.getInstance().getObject("execution_id", executionId);
			setAssignee.delete();
			log.trace("设置节点候选人结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("查询流程定义信息发生异常，异常描述:{}", e);
			writer.print(ResultCode.UPDATE_ERROR);
		}
	}

	/**
	 * 根据数据转换成json
	 */
	private JSONArray getTaskJson(List<HistoricTaskInstance> taskList) {
		if (null == taskList || taskList.size() < 1) {
			return null;
		}
		JSONArray jsonArray = new JSONArray();
		for (HistoricTaskInstance task : taskList) {
			JSONObject object = new JSONObject();
			object.put("task_id", task.getId());
			object.put("instance_id", task.getProcessInstanceId());//流程实例ID
			object.put("task_name", task.getName());
			object.put("create_time", task.getCreateTime());
			object.put("end_time", task.getEndTime());
			object.put("create_user", task.getAssignee());
			jsonArray.add(object);
		}
		return jsonArray;
	}


}
