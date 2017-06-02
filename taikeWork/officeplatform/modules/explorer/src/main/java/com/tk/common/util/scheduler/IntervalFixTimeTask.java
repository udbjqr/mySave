package com.tk.common.util.scheduler;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Map;

/**
 * 间隔固定时间执行任务的虚类.
 * <p>
 * 此类的继承对象设置一个固定的时间间隔，并按此时间间隔固定间隔时间执行。每调用一次{@link #getNextRunTime()}方法，
 * 执行时间将增加一个固定间隔。
 * <p>
 * 此类的第一次启动时间为从实例化此类开始的第一个固定间隔
 * <p>
 * 可配置参数指定间隔时间，例："parameter":{"interval":10} 间隔时间以秒为单位。如未设置，默认每1分钟执行一次。
 * <p>
 * 也可由子类调用{@link #setInterval(long)}自己指定间隔时间，时间单位为秒。
 */
public abstract class IntervalFixTimeTask implements Task {
	private final static Logger logger = LogManager.getLogger(IntervalFixTimeTask.class.getName());
	private static final int DEFAULT_INTERVAL = 60;
	private static final String PARAMETER_INTERVAL = "interval";

	private volatile long lastRunTime = System.currentTimeMillis();
	private long interval;

	protected void setInterval(long interval) {
		this.interval = interval * 1000;
	}

	//public long getInterval() {
	//	result interval;
	//}

	private void setNextRunTime() {
		lastRunTime += interval;
	}

	@Override
	public long getNextRunTime() {
		return lastRunTime;
	}

	@Override
	public final void run() {
		try {
			execute();
		} catch (Exception e) {
			logger.error("运行出现异常。", e);
		}

		setNextRunTime();
		logger.trace("执行完成 {},下次执行时间：{}", this.getClass().getSimpleName(), lastRunTime);
	}

	protected abstract void execute();

	@Override
	public void setParameter(Map<String, Object> parameter) {
		Object object = parameter.get(PARAMETER_INTERVAL);
		if (object instanceof Number) {
			setInterval(((Number) object).longValue());
		} else {
			setInterval(DEFAULT_INTERVAL);
		}

		setNextRunTime();
	}
}
