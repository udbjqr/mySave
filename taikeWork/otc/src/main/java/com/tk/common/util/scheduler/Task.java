package com.tk.common.util.scheduler;

import java.util.Map;

/**
 * 实现此接口的实例可放在{@link Scheduler}中执行。
 * <p>
 * 此接口继承Runnable，标明实现此接口的对象也可在线程当中执行。
 * <p>
 * 如{@like #getNextRunTime()}指明的执行时间小于等于当前时间，将会被执行，实现类必须保证在有限次调用后，返回值大于当前时间。
 * <p>
 * 实现此接口对象需要保证其执行的足够快速，如需要长时间执行的，可另启一个线程执行，以保证不会对整个任务链的执行造成影响。
 */
public interface Task extends Runnable {

	/**
	 * 返回下次执行时间，以毫秒为单位.
	 * <p>
	 * 实现类必须保证在有限次调用后，返回值大于当前时间。
	 *
	 * @return
	 */
	long getNextRunTime();

	void setParameter(Map<String, Object> parameter);
}
