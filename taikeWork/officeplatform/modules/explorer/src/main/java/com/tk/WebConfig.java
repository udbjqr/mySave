package com.tk;

import com.tk.common.Constant;
import org.activiti.engine.ProcessEngines;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletContainerInitializer;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import java.util.Set;

public class WebConfig implements ServletContainerInitializer {
	private final Logger logger = LogManager.getLogger(WebConfig.class.getName());
	@Override
	public void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException {
		logger.info("开始初始化动作！");
		Constant.processEngine = ProcessEngines.getDefaultProcessEngine();
		init();
	}

	public static void init() {
//		Constant.formService = Constant.processEngine.getFormService();
//		Constant.taskService = Constant.processEngine.getTaskService();
//		Constant.identityService = Constant.processEngine.getIdentityService();
//		Constant.historyService = Constant.processEngine.getHistoryService();
//		Constant.dynamicBpmnService = Constant.processEngine.getDynamicBpmnService();
//		Constant.managementService = Constant.processEngine.getManagementService();
//		Constant.repositoryService = Constant.processEngine.getRepositoryService();
//		Constant.runtimeService = Constant.processEngine.getRuntimeService();
//		Constant.dbHelper = DBHelperFactory.getDBHelper();
	}
}
