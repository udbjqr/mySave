package com.tk.objects.handle.common;


import com.alibaba.fastjson.JSONObject;
import com.tk.common.persistence.User;
import com.tk.common.persistence.WriteValueException;
import com.tk.common.result.ResultCode;
import com.tk.objects.ProcessData;
import com.tk.objects.handle.AbstractHandle;
import com.tk.objects.module.Module;
import org.activiti.engine.task.Task;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Date;

/**
 * 默认的新增或修改操作.
 */
public class AddClass extends AbstractHandle {
	private static final FormDataFactory formDataFactory = FormDataFactory.getInstance();
	protected static Logger logger = LogManager.getLogger(AddClass.class.getName());

	public AddClass() {
		super("initiatecom");
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
		//表单数据
		FormData form = null;
		//表单ID
		//查询有没有已存在的表单数据
		JSONObject processDataFrom = processData.get("data");

		//找到表单数据ID
		Integer formData_Id = getPorcessDataFormId(processDataFrom, module.getId());

		if (null != formData_Id) {
			form = formDataFactory.getObject("id", formData_Id);
		}
		//这个要保存的
		JSONObject formData = new JSONObject();

		module.steam((id) -> formData.put(id, jsonData.get(id)));

		try {
			if (null != form) {//若为修改
				form.set("update_user", user.get("id"));
				form.set("update_time", new Date(System.currentTimeMillis()));
			} else {//新增
				form = FormDataFactory.getInstance().getNewObject(user);
				if (user != null) {
					form.set("create_user", user.get("id"));
				}
				//虽否被锁，0：未被锁，1：被锁
				form.set("lock", 0);
				form.set("flag", 1);
				form.set("create_time", new Date(System.currentTimeMillis()));
				form.set("module_id", module.get("id"));
			}
			form.set("form_data", formData);
		} catch (WriteValueException e) {
			logger.error("写数据出现异常。", e);
			return ResultCode.ADD_ERROR;
		}

		form.flush();

		//把表单id更新进流程数据
		formData_Id = form.get("id");

		try {
			if (null == processDataFrom) {
				processDataFrom = new JSONObject();
			}

			setPorcessDataFormId(processDataFrom, module.getId(), formData_Id);
			processData.set("data", processDataFrom);
			processData.flush();
		} catch (Exception e) {
			logger.error("将表单数据ID更新进流程数据发生异常:{}", e);
		}
		return ResultCode.NORMAL;
	}

}
