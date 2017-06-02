package com.tk.objects.expression;

import com.alibaba.fastjson.JSONObject;
import com.tk.objects.ProcessData;
import com.tk.objects.handle.Handle;
import com.tk.objects.handle.QuestHandle;
import com.tk.objects.module.Module;
import com.tk.objects.module.ModuleFactory;
import org.activiti.engine.delegate.DelegateExecution;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.VariableScope;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import static com.tk.common.Constant.PROCESS_DATA_FACTORY;
import static com.tk.common.Constant.PROCESS_DATA_PREFIX;

/**
 * 此类用来转换流程上面指定的流程表单数据.
 * <p>
 * 数据格式:以FV开头,紧跟moduleId,再跟下划线,最后是表单内列名称.
 * 如:FV15_qingjiabeizhu
 *
 * @author zhengyimin
 */

public class FormExpressionTransform {
	private final static Logger logger = LogManager.getLogger(FormExpressionTransform.class.getName());
	private final static FormExpressionTransform instance = new FormExpressionTransform();
	private final static String NULLString = null;
	public final static FormExpressionTransform FORM_EXPRESSION_TRANSFORM = instance;

	public static FormExpressionTransform getInstance() {
		return instance;
	}

	/**
	 * 根据传入的名称，返回实际表单的数据.
	 *
	 * @param name  需要转换的名称，必须以“FV”为开头
	 * @param scope 变量范围对象
	 * @return 如果未找到或者没有对象时返回null
	 */
	public Object transform(String name, VariableScope scope) {
		logger.trace("匹配表单数据，开始查找指定值。");
		String moduleKey, key;

		if (name == null || name.equals("")) {
			logger.trace("未传入值，返回空值");
			return NULLString;
		}

		if (!name.startsWith("FV")) {
			logger.error("传入的参数格式错误，请检查，{}，参数必须以FV开头，并紧跟变量名。", name);
			return null;
		}

		key = name.substring(2);
		String[] temp = key.split("_");
		if (temp.length != 2) {
			logger.error("传入的参数格式错误，请检查，{}，参数必须以FV开头，并紧跟变量名。", name);
			return null;
		}

		moduleKey = temp[0];
		//得到对应的流程表数据
		ProcessData processData = PROCESS_DATA_FACTORY.getObject("execution_id", getExecutionId(scope));
		JSONObject formData = processData.get("data");

		Integer formId = formData.getInteger(PROCESS_DATA_PREFIX + moduleKey);
		Module module = ModuleFactory.getInstance().getObject("id", moduleKey);
		if (module == null) {
			logger.error("未找到定义的module,请检查:" + name);
			return null;
		}

		Handle questHandle = module.getQuestHandle();
		return ((QuestHandle) questHandle).getFormValue(key, formId);
	}

	//根据变量类型获得流程执行Id
	private String getExecutionId(VariableScope scope) {
		if (DelegateExecution.class.isAssignableFrom(scope.getClass())) {
			return ((DelegateExecution) scope).getId();
		} else if (DelegateTask.class.isAssignableFrom(scope.getClass())) {
			return ((DelegateTask) scope).getExecutionId();
		}

		return null;
	}

}