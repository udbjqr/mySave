package com.tk.common.util.scheduler;

import com.tk.common.util.ObjectUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 计划任务的实现对象。
 */
public class Scheduler implements Runnable {
	private static final Logger logger = LogManager.getLogger(Scheduler.class.getName());

	private List<Task> tasks;
	private final Map<Task, Long> tasks2RunTime = new HashMap<>();

	private Task runTask;
	private long pioneerRunTime;

	synchronized void changed(List<Task> tasks) {
		this.tasks = tasks;

		tasks2RunTime.clear();
		for (Task task : tasks) {
			pioneerRunTime = ObjectUtil.checkPositive(task.getNextRunTime(), "task.getNextRunTime()");
			tasks2RunTime.put(task, pioneerRunTime);
			runTask = task;
		}

		this.notify();
	}

	@Override
	public synchronized void run() {
		//noinspection InfiniteLoopStatement
		while (true) {
			try {
				while (tasks.size() == 0) {
					this.wait();
				}

				getJustNowRunTask();

				if (System.currentTimeMillis() < pioneerRunTime) {
					this.wait(pioneerRunTime - System.currentTimeMillis());
				}

				logger.trace("开始执行任务。");
				runTask.run();
				logger.trace("任务执行结束。");

			} catch (InterruptedException e) {
				logger.error("", e);
			} finally {
				pioneerRunTime = runTask.getNextRunTime();
				logger.info("启动定时器。。。。。。");
				logger.info("下次执行时间为：   " + pioneerRunTime);
				tasks2RunTime.put(runTask, pioneerRunTime);
			}
		}
	}

	/**
	 * 得到最近运行时间
	 */
	private void getJustNowRunTask() {
		long taskRunTime;
		for (Task task : tasks) {
			taskRunTime = tasks2RunTime.get(task);
			if (taskRunTime < pioneerRunTime) {
				runTask = task;
				pioneerRunTime = taskRunTime;
			}
		}
	}

	public List<Task> getTasks() {
		return tasks;
	}
}
