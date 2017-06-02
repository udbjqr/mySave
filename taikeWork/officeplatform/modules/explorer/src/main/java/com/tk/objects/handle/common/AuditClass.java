package com.tk.objects.handle.common;


import com.alibaba.fastjson.JSONObject;
import com.tk.common.persistence.User;
import com.tk.common.result.ResultCode;
import com.tk.objects.ProcessData;
import com.tk.objects.handle.AbstractHandle;
import com.tk.objects.module.Module;
import org.activiti.engine.task.Task;

/**
 * 默认的审核操作.
 */
public class AuditClass extends AbstractHandle {

	public AuditClass() {
		super("reviewInput");
	}

	@Override
	public void setUrl(String url) {
		this.url = url;
	}

	@Override
	public String getUrl() {
		return url;
	}

	@Override
	protected ResultCode execute(User user, Task task, Module module, ProcessData processData, JSONObject jsonData) {
		FormData formData = FormDataFactory.getInstance().getNewObject(user);
		JSONObject formStructure = module.getFormStructure();
		JSONObject data = new JSONObject();

		//TODO 这边根据审核的类型去操作流程数据

	/*	for (Entry<String, Object> entry : formStructure.entrySet()) {
			data.put(entry.getKey(), jsonData.get(entry.getKey()));
		}

		try {
			formData.set("module_id", module.get("id"));
			formData.set("form_data", data);
			if (user != null) {
				formData.set("create_user", user.get("id"));
			}
		} catch (WriteValueException e) {
			logger.error("写数据出现异常。", e);
			return ResultCode.ADD_ERROR;
		}

		formData.flush();*/
		return ResultCode.NORMAL;
	}
}
