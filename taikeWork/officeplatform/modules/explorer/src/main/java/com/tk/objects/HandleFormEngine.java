package com.tk.objects;

import com.tk.common.Constant;
import com.tk.objects.handle.Handle;
import com.tk.objects.handle.HandleFactory;
import com.tk.objects.module.Module;
import com.tk.objects.module.ModuleFactory;
import com.tk.objects.module.ModuleHandle;
import org.activiti.engine.ActivitiException;
import org.activiti.engine.ActivitiObjectNotFoundException;
import org.activiti.engine.form.StartFormData;
import org.activiti.engine.form.TaskFormData;
import org.activiti.engine.impl.context.Context;
import org.activiti.engine.impl.form.FormEngine;
import org.activiti.engine.impl.form.TaskFormHandler;
import org.activiti.engine.impl.persistence.entity.TaskEntity;
import org.activiti.engine.task.Task;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * 表单处理类，从此类获得的将是一个包含模块与操作对应关系的对象.
 * 格式： module:moduleId&handel:handelId
 */
public class HandleFormEngine implements org.activiti.engine.impl.form.FormEngine {
	private static final Logger logger = LogManager.getLogger(HandleFormEngine.class.getName());

	public static ModuleHandle getRenderReadForm(Task task) {
		Context.setProcessEngineConfiguration(Constant.processEngineConfiguration);
		Context.setCommandContext(Constant.commandContextFactory.createCommandContext(null));

		TaskEntity entity = (TaskEntity) task;
		if (entity == null) {
			throw new ActivitiObjectNotFoundException("Task '" + entity.getId() + "' not found", Task.class);
		}

		if (entity.getTaskDefinition() == null) {
			throw new ActivitiException("Task form definition for '" + entity.getId() + "' not found");
		}

		TaskFormHandler taskFormHandler = entity.getTaskDefinition().getTaskFormHandler();
		if (taskFormHandler == null) {
			return null;
		}

		FormEngine formEngine = Context.getCommandContext()
						.getProcessEngineConfiguration()
						.getFormEngines()
						.get("tkFormEngine");

		if (formEngine == null) {
			throw new ActivitiException("No formEngine 'tkFormEngine' defined process engine configuration");
		}

		TaskFormData taskForm = taskFormHandler.createTaskForm(entity);

		if (taskForm.getFormKey() == null) {
			return null;
		}

		return (ModuleHandle) getFormTemplateString(taskForm.getFormKey(), true);

	}

	private static Object getFormTemplateString(String formKey, boolean isQuery) {
		String[] strings = formKey.split("&");
		if (strings.length != 2) {
			logger.error("错误的设置了操作！要且仅要一个'&'分隔符，传入的数据：" + formKey);
			return null;
		}

		String[] handles = strings[1].split(":");
		if (handles.length != 2) {
			logger.error("错误的设置了操作对象！需要一个':'分隔符，传入的数据：" + strings[1]);
			return null;
		}
		if (!handles[0].trim().equals("handle")) {
			logger.error("未指定操作对象！需要'handle'。传入的数据：" + strings[1]);
			return null;
		}

		String[] modules = strings[0].split(":");
		if (modules.length != 2) {
			logger.error("错误的设置了功能模块对象！需要一个':'分隔符，传入的数据：" + strings[0]);
			return null;
		}
		if (!modules[0].trim().equals("module")) {
			logger.error("未指定功能模块对象！需要'handle'。传入的数据：" + strings[1]);
			return null;
		}

		Handle handle;
		try {
			Module module = ModuleFactory.getInstance().getObject("id", Integer.parseInt(modules[1]));
			//如果此次需要的是查询对象，给出查询的接口。
			if (isQuery) {
				handle = module.getQuestHandle();
			} else {
				handle = HandleFactory.getHandle(Integer.parseInt(handles[1]));
			}

			return new ModuleHandle(module, handle);
		} catch (Exception e) {
			logger.error("获得功能模块与操作时发生异常。", e);
		}
		return null;
	}

	public String getName() {
		return "tkFormEngine";
	}

	public Object renderStartForm(StartFormData startForm) {
		if (startForm.getFormKey() == null) {
			return null;
		}
		return getFormTemplateString(startForm.getFormKey(), false);
	}

	public Object renderTaskForm(TaskFormData taskForm) {
		if (taskForm.getFormKey() == null) {
			return null;
		}

		return getFormTemplateString(taskForm.getFormKey(), false);
	}


}
