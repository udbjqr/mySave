package com.tk.objects.handle.common;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.persistence.User;
import com.tk.common.result.ResultCode;
import com.tk.objects.ProcessData;
import com.tk.objects.handle.QuestHandle;
import com.tk.objects.module.Module;
import org.activiti.engine.task.Task;

import static com.tk.common.Constant.PROCESS_DATA_PREFIX;

/**
 * 通用的查询操作方式
 */
public class ListClass extends QuestHandle {

	public ListClass() {
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
	public ResultCode run(User user, Task task, Module module, ProcessData processData, JSONObject jsonData) {
		JSONObject resultJson = new JSONObject();
		//表单数据
		FormData formData = null;
		//表单ID
		Integer formData_Id = null;
		//获得功能对应的空表单
		JSONObject formStructure = module.getFormStructure();
		resultJson.put("formStructure", formStructure);

		//查询有没有已存在的表单数据
		JSONObject dataFromProcess = processData.get("data");
		//找到表单数据ID
		if (null != dataFromProcess) {
			formData_Id = (Integer) dataFromProcess.get(PROCESS_DATA_PREFIX + module.get("id"));
		}
		if (null != formData_Id) {
			formData = FormDataFactory.getInstance().getObject("id", formData_Id);
		}
		if (null != formData) {
			JSONObject formDataJson = formData.get("form_data");
			resultJson.put("formData", formDataJson);
		}
		resultJson.put("task_id", task.getId());
		resultJson.put("processData", processData);
		resultJson.put("jsonData", jsonData);
		return new ResultCode(true, resultJson);
	}

	@Override
	public Object getFormValue(String name, int formId) {
		FormData data = FormDataFactory.getInstance().getObject("id", formId);
		if (data != null) {
			return ((JSONObject) data.get("form_data")).get(name);
		}

		return null;
	}
}
