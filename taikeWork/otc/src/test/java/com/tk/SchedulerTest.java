package com.tk;

import com.tk.common.Constant;
import com.tk.common.util.scheduler.FixedTimeStartTask;
import com.tk.common.util.scheduler.Scheduler;
import com.tk.common.util.scheduler.SchedulerManager;
import com.tk.common.util.scheduler.Task;
import org.junit.Test;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

public class SchedulerTest {
	@Test
	public void test(){
		SimpleDateFormat format = new SimpleDateFormat(Constant.DATEFORMAT);
		SchedulerManager.getInstance().start();

		Scheduler scheduler = SchedulerManager.getInstance().getScheduler();

		List<Task> tasks = scheduler.getTasks();

		for (Task task: tasks){
			System.out.println(format.format(new Date(task.getNextRunTime())));
			((FixedTimeStartTask)task).setLastRunTime();
			System.out.println(format.format(new Date(task.getNextRunTime())));
			System.out.println(format.format(new Date(task.getNextRunTime())));
			System.out.println(format.format(new Date(task.getNextRunTime())));
		}
	}
}
