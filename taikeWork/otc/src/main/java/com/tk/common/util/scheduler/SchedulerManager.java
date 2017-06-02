package com.tk.common.util.scheduler;

import com.tk.common.util.FileUtil;
import com.tk.common.util.MapUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.util.Loader;
import org.json.JSONArray;
import org.json.JSONObject;

import java.util.LinkedList;
import java.util.List;

/**
 * 计划任务实现的管理对象.
 * <p>
 * 从资源目录下的文件scheduler.json中读取相应的配置，此文件需要采用UTF-8格式。
 * <p>
 * 每次更新配置文件后，均会重新实例化任务对象，并将新的任务对象放至执行队列当中，任务类需要保证数据一致性。
 * 也可以设置配置文件中刷新值为0表明不更新，更新单位为分钟
 * <p>
 * 任务需要保证其执行的足够快速，如需要长时间执行的，可另启一个线程执行，以保证不会对整个任务链的执行造成影响。
 */
public final class SchedulerManager {
	private static final Logger logger = LogManager.getLogger(SchedulerManager.class.getName());
	private static final String PROPERTIES_FILENAME = "scheduler.json";
	private static final String PARAMETER = "parameter";
	private static final String CLASS = "class";
	private static final String TASKS = "tasks";
	private static final String THREAD_NAME = "scheduler_run_task";

	private static SchedulerManager instance = new SchedulerManager();
	private String stringProperties;
	private final Scheduler scheduler = new Scheduler();

	private SchedulerManager() {

	}

	public Scheduler getScheduler() {
		return scheduler;
	}

	public void start(){
		logger.info("计划任务启动！");
		refreshProperties();

		Thread thread = new Thread(scheduler, THREAD_NAME);
		thread.start();
	}

	private void refreshRunTasks(final JSONObject jsonProperties) {
		List<Task> tasks = new LinkedList<>();

		JSONArray array = jsonProperties.getJSONArray(TASKS);
		JSONObject object;
		try {
			for (int i = 0; i < array.length(); i++) {
				object = (JSONObject) array.get(i);
				String className = object.getString(CLASS);

				Class<?> taskClass = Class.forName(className);
				Task task = (Task) taskClass.newInstance();
				task.setParameter(MapUtil.getParameter(object, PARAMETER));

				tasks.add(task);
				logger.trace("增加运行任务：{}", className);
			}
		} catch (Exception e) {
			logger.error("读取配置文件出错", e);
		}

		scheduler.changed(tasks);
	}



	void refreshProperties() {
		logger.trace("刷新配置文件");

		String string4File = FileUtil.getProperties(Loader.getResource(PROPERTIES_FILENAME,SchedulerManager.class.getClassLoader()), "UTF-8");
		if (string4File != null && !string4File.equals(stringProperties)) {
			logger.trace("配置文件有更新,{}", string4File);

			stringProperties = string4File;
			JSONObject jsonProperties = new JSONObject(string4File);

			refreshRunTasks(jsonProperties);
		}
	}

	public static SchedulerManager getInstance() {
		return instance;
	}
}
