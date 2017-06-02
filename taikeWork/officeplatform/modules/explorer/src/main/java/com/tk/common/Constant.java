package com.tk.common;

import com.tk.common.sql.DBHelper;
import com.tk.objects.ProcessDataFactory;
import org.activiti.engine.*;
import org.activiti.engine.impl.cfg.ProcessEngineConfigurationImpl;
import org.activiti.engine.impl.interceptor.CommandContextFactory;

import javax.servlet.http.HttpSession;
import java.util.Hashtable;
import java.util.Map;

/**
 * 此类保存程序当中用到的常量数据
 *
 * @author yimin
 */
public final class Constant {
	/**
	 * 在session内存储用户属性的名称.
	 */
	public final static String sessionUserAttrib = "user";

	/**
	 * 日期数据转换的格式字符串
	 */
	public static final String DATEFORMAT = "yyyy-MM-dd HH:mm:ss";

	public static TaskService taskService;
	public static FormService formService;
	public static DynamicBpmnService dynamicBpmnService;
	public static HistoryService historyService;
	public static IdentityService identityService;
	public static ManagementService managementService;
	public static RepositoryService repositoryService;
	public static RuntimeService runtimeService;
	public static ProcessEngine processEngine;

	public static ProcessEngineConfigurationImpl processEngineConfiguration;
	public static CommandContextFactory commandContextFactory;

	public static DBHelper dbHelper;

	public static Map<Thread,HttpSession> threadHttpSessionLink = new Hashtable<>();

	public static String PROCESS_DATA_PREFIX = "MODULE_";
	public static ProcessDataFactory PROCESS_DATA_FACTORY = ProcessDataFactory.getInstance();
}
