package com.tk.common.util.scheduler;

/**
 * 此对象为定时刷新配置文件对象.
 *
 * 刷新时间将由配置文件中"refreshTime" 指定。如此值为0表示不更新。负数
 */
public class RegularlyUpdatedConfig  extends  IntervalFixTimeTask{
	private SchedulerManager manager = SchedulerManager.getInstance();

	@Override
	public void execute() {
		manager.refreshProperties();
	}
}
