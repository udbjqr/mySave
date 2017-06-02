package com.tk.object.importData;

import com.tk.common.util.scheduler.IntervalFixTimeTask;

/**
 * 定时获得数据执行任务.
 */
public class TimeImportTask extends IntervalFixTimeTask {


	@Override
	protected void execute(){
		ImportUpstreamData.getInstance().importGoods();
	}
}
