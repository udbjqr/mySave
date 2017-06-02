package com.tk.servlet;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.persistence.User;
import com.tk.common.result.ResultCode;
import com.tk.objects.HandleFormEngine;
import com.tk.objects.ProcessData;
import com.tk.objects.ProcessDataDetail;
import com.tk.objects.identity.SetAssignee;
import com.tk.objects.identity.SetAssigneeFactory;
import com.tk.objects.module.Module;
import com.tk.objects.module.ModuleHandle;
import org.activiti.engine.task.Task;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Enumeration;
import java.util.List;

import static com.tk.common.Constant.*;

/**
 * 所有功能操作的分发类.
 */
@WebServlet("/handle.do")
public class HandleServlet extends HttpServlet {
	protected static Logger logger = LogManager.getLogger(HandleServlet.class.getName());

	@Override
	protected void service(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
		req.setCharacterEncoding("UTF-8");
		resp.setCharacterEncoding("UTF-8");
		resp.setHeader("content-type", "text/html;charset=UTF-8");

		//如果日志等级高于info级，就不记录客户的请求详细。400:info等级
		if (logger.getLevel().intLevel() >= 400) {
			logger.trace("客户端发起请求，请求对象：" + this.getClass().getSimpleName());
			//查看上传信息
			for (Enumeration<String> e = req.getParameterNames(); e.hasMoreElements(); ) {
				String name = e.nextElement();
				logger.trace("name:{} value:{}", name, req.getParameter(name));
			}
		}

		PrintWriter writer = resp.getWriter();
		//检查用户是否登录
		User employee = (User) req.getSession().getAttribute(Constant.sessionUserAttrib);
		if (employee == null) {
			writer.print(ResultCode.NOT_LOGIN);
			return;
		}

		//获得参数
		JSONObject jsonObject = getParam(req);
		if (jsonObject == null || jsonObject.isEmpty()) {
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}

		//获得当前的act任务对象
		Task task = getTask(jsonObject);
		if (task == null) {
			writer.print(ResultCode.NOT_FOUND_TASK);
			return;
		}

		ModuleHandle moduleData;
		ProcessData processData = PROCESS_DATA_FACTORY.getObject("execution_id", task.getProcessInstanceId());

		//此操作为任务的查询操作，返回任务对应的数据
		if ("query".equals(jsonObject.get("controlType"))) {
//			moduleData = new ModuleHandle(ModuleFactory.getInstance().getObject("id",15), HandleFactory.getHandle(2));
			moduleData = HandleFormEngine.getRenderReadForm(task);
			//执行操作
			Module module = moduleData.getModule();
			ResultCode code = moduleData.getHandle().run(employee, task, module, processData, jsonObject);
			writer.print(code);
		} else {
			//得到操作的对象。
			moduleData = (ModuleHandle) formService.getRenderedTaskForm(task.getId(), "tkFormEngine");
			//设置当前执行人
			identityService.setAuthenticatedUserId(employee.get("login_name"));


			if (moduleData == null) {
				writer.print(ResultCode.TASK_NOT_FOUND_HANDLE);
				return;
			}

			//执行操作
			Module module = moduleData.getModule();
			ResultCode code = moduleData.getHandle().run(employee, task, module, processData, jsonObject);

			if (code.isSuccess()) {
				//存储流程数据
				ProcessDataDetail processDetailData = processData.createDetail();
				try {
					//设置数据
					processDetailData.set("module_id", module.getId());
					processDetailData.set("handle_id", moduleData.getHandle().getId());
					processDetailData.set("execution_id", task.getExecutionId());
					processDetailData.set("task_id", task.getId());
					processDetailData.set("task_name",task.getName());
					processDetailData.set("now_data", jsonObject);
					processDetailData.set("result_data", JSONObject.toJSON(taskService.getVariables(task.getId())));
					processDetailData.set("employee_id", employee.get("login_name"));
					processDetailData.flush();
					//更新最后操作者
					processData.set("last_operat", employee.get("login_name"));
					processData.flush();
				} catch (Exception e) {
					logger.trace("存储流程数据发生异常！");
				}

				taskService.setVariable(task.getId(), "_lastEmployee", employee.get("login_name"));

				taskService.complete(task.getId());

				//这边判断下个节点是否有处理人
				List<SetAssignee> tosetList;
				try {
					tosetList = SetAssigneeFactory.getInstance().getObjectsForString(" where t.employee_id = "
									+ dbHelper.getString(employee.get("login_name")) + " and execution_id = " + dbHelper.getString(task.getExecutionId()), null);
					if (null != tosetList && tosetList.size() > 0) {
						SetAssignee setAssignee = tosetList.get(0);
						//给前台一个标记，判断是否跳转进下个节点处理人设置页面
						JSONObject setObject = new JSONObject();
						setObject.put("type", "selectNextAssignee");
						setObject.put("task_id", setAssignee.get("task_id"));
						setObject.put("employee_id", setAssignee.get("employee_id"));
						setObject.put("execution_id", setAssignee.get("execution_id"));
						code.addAdditionalMessage("jump", setObject.toJSONString());
					}
				} catch (Exception e) {
					logger.error("查询当前用户是否有可分配下节点任务人列表发生异常：{}", e);
				}

				logger.debug("任务：{}完成。", task.getId());
			}
			writer.print(code);
		}
	}

	/**
	 * 获得前端指定的任务对象
	 */
	private Task getTask(JSONObject jsonParameter) {
		String taskId = jsonParameter.getString("task_id");
		if (taskId == null) {
			logger.error("参数错误！");
			return null;
		}

		return taskService.createTaskQuery().taskId(taskId).singleResult();
	}

	/**
	 * 参数接收
	 */
	private JSONObject getParam(HttpServletRequest request) {
		String paramMap = request.getParameter("paramMap");
		return JSONObject.parseObject(paramMap);
	}


}
