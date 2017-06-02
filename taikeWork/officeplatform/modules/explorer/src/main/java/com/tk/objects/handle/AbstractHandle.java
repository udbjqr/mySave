package com.tk.objects.handle;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.persistence.User;
import com.tk.common.result.ResultCode;
import com.tk.objects.ProcessData;
import com.tk.objects.module.Module;
import org.activiti.engine.task.Task;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import static com.tk.common.Constant.PROCESS_DATA_PREFIX;

/**
 * 操作类的虚类.
 * <p>
 * 从此类继承对象将无法继续重写run()方法，保证执行前后可以执行相关操作。
 * <p>
 * 此类的继承类构造的对象将被长期持有，因此此操作的继承类必须保证操作是线程安全。
 */
public abstract class AbstractHandle implements Handle {
	protected static final Logger logger = LogManager.getLogger(AbstractHandle.class.getPackage().getName());
	protected int id;
	protected String view_name;
	protected String prompt;
	protected int flag;

	protected String url;

	protected AbstractHandle(String url) {
		this.url = url;
	}
	@Override
	public ResultCode run(User user, Task task, Module module, ProcessData processData, JSONObject jsonData) {
		ResultCode resultCode = beforeRun(user, task, module, processData, jsonData);
		if (resultCode != null) {
			return resultCode;
		}

		resultCode = execute(user, task, module, processData, jsonData);

		resultCode = afterRun(user, task, module, processData, jsonData, resultCode);

		return resultCode;
	}

	/**
	 * 实际的执行动作.
	 */
	protected ResultCode execute(User user, Task task, Module module, ProcessData processData, JSONObject jsonData) {
		return null;
	}

	/**
	 * 实际执行之前的操作.
	 */
	protected ResultCode beforeRun(User user, Task task, Module module, ProcessData processData, JSONObject jsonData) {
		ResultCode resultCode = checkPara(user, task, module, processData, jsonData);

		if (resultCode != null) {
			return resultCode;
		}

		logger.debug("操作{}将被执行", id);

		return null;
	}

	private ResultCode checkPara(User user, Task task, Module module, ProcessData processData, JSONObject jsonData) {
		if (task == null) {
			logger.error("任务为空，无法继续执行。");
			return ResultCode.NOT_FOUND_TASK;
		}

		if (module == null) {
			logger.error("功能模块为空，无法继续执行。");
			return ResultCode.NOT_FOUND_MODULE;
		}

		if (jsonData == null) {
			logger.warn("操作数据为空，可能产生异常。");
		}

		return null;
	}

	/**
	 * 实际执行之后的操作.
	 */
	protected ResultCode afterRun(User user, Task task, Module module, ProcessData processData, JSONObject jsonData, ResultCode resultCode) {
		logger.debug("操作{}执行结束", id);
		return resultCode;
	}

	/**
	 * 使用数据库数据，初始化操作对象.
	 * <p>
	 * 此方法应仅仅为工厂类调用.
	 *
	 * @param data 操作对象的数据对象
	 */
	Handle initValue(HandleData data) {
		this.id = data.get("id");
		this.view_name = data.get("view_name");
		this.prompt = data.get("prompt");
		this.flag = data.get("flag");
		return this;
	}

	@Override
	public final int getId() {
		return id;
	}

	@Override
	public void undo() {
		logger.error("未实现此方法。");
	}


	/**
	 * 根据流程数据和模块,查找对象的模块表单Id.
	 * <p>
	 * 一个流程当中可能存在多个模块的表单,应该允许存在.而一个流程当中每个模块数据只允许存在一次.
	 *
	 * 存储方式以:M+Id的方式存放在JSON字段内.
	 *
	 * @param processDataFrom 流程数据
	 * @param moduleId        模块Id
	 * @return
	 */
	protected Integer getPorcessDataFormId(JSONObject processDataFrom, int moduleId) {
		if (processDataFrom == null) {
			return null;
		}

		return processDataFrom.getInteger(PROCESS_DATA_PREFIX + moduleId);
	}

	protected void setPorcessDataFormId(JSONObject processDataFrom, int moduleId,int formId){
		if(processDataFrom == null){
			return;
		}

		processDataFrom.put(PROCESS_DATA_PREFIX + moduleId ,formId);
	}
}
