package com.tk.common.util.scheduler;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Calendar;
import java.util.Locale;
import java.util.Map;

/**
 * 此类为固定时间启动虚类.
 * <p>
 * 此类的子类必须实现{@link #execute()}方法。定时时限可直接由配置文件指定。
 */
public abstract class FixedTimeStartTask implements Task {
	private static final String NAME_YEAR = "year";
	private static final String NAME_MONTH = "month";
	private static final String NAME_WEAK = "weak";
	private static final String NAME_DAY_OF_MONTH = "day_of_month";
	private static final String NAME_DAY_OF_WEAK = "day_of_weak";
	private static final String NAME_HOUR = "hour";
	private static final String NAME_MINUTE = "minute";
	//private static final String NAME_SECOND = "second";
	private static final String CONFIG_WILDCARD = "*";
	private static Logger logger = LogManager.getLogger(FixedTimeStartTask.class.getName());

	private long lastRunTime;
	private Calendar calendar = Calendar.getInstance(Locale.CHINA);
	private boolean isChange = false;
	private boolean isFirst = false;

	private int[] yearArray = new int[20];
	private int[] monthArray = new int[12];
	private int[] weakArray = new int[4];
	private int[] dayOfWeakArray = new int[7];
	private int[] dayOfMonthArray = new int[31];
	private int[] hourArray = new int[24];
	private int[] minuteArray = new int[60];
	//private int[] secondArray = new int[60];

	@Override
	public final void run() {
		execute();
		setLastRunTime();
		logger.trace("执行完成 {},下次执行时间：{}", this.getClass().getSimpleName(), lastRunTime);
	}


	/**
	 * 实现类修改此方法以提供不同的下一次启动时间的处理方法.
	 * <p>
	 * 一般不需要直接修改此方法。
	 */
	public void setLastRunTime() {
		if (isFirst) {
			//computeDelta(Calendar.SECOND,  secondArray);
			computeDeltaFirst(Calendar.MINUTE, minuteArray);
			computeDeltaFirst(Calendar.HOUR_OF_DAY, hourArray);
			//computeDeltaFirst(Calendar.DAY_OF_WEEK, dayOfWeakArray);
			computeDeltaFirst(Calendar.DAY_OF_MONTH, dayOfMonthArray);
			//computeDeltaFirst(Calendar.WEEK_OF_MONTH, weakArray);
			computeDeltaFirst(Calendar.MONTH, monthArray);
			computeDeltaFirst(Calendar.YEAR, yearArray);

			lastRunTime = calendar.getTimeInMillis();
			isFirst = false;
		} else {
			isChange = false;
			//computeDelta(Calendar.SECOND,  secondArray);
			computeDelta(Calendar.MINUTE, minuteArray);
			computeDelta(Calendar.HOUR_OF_DAY, hourArray);
			//computeDelta(Calendar.DAY_OF_WEEK, dayOfWeakArray);
			computeDelta(Calendar.DAY_OF_MONTH, dayOfMonthArray);
			//computeDelta(Calendar.WEEK_OF_MONTH, weakArray);
			computeDelta(Calendar.MONTH, monthArray);
			computeDelta(Calendar.YEAR, yearArray);

			lastRunTime = calendar.getTimeInMillis();
		}
	}

	private void computeDelta(int calendarMode, int[] array) {
		if (isChange) {
			return;
		}

		int incremental = calendar.get(calendarMode);
		int i = 0;
		for (; i < array.length; i++) {
			if (array[i] > incremental) {
				break;
			}
		}

		isChange = i != array.length;
		calendar.set(calendarMode, i == array.length ? array[0] : array[i]);
	}

	private void computeDeltaFirst(int calendarMode, int[] array) {
		int incremental = calendar.get(calendarMode);
		int i = 0;
		for (; i < array.length; i++) {
			if (array[i] >= incremental) {
				break;
			}
		}

		calendar.set(calendarMode, i == array.length ? array[0] : array[i]);
	}

	protected abstract void execute();

	@Override
	public void setParameter(Map<String, Object> parameter) {
		setYearArray(((String) parameter.get(NAME_YEAR)));
		this.monthArray = handleConfig(((String) parameter.get(NAME_MONTH)), 12, this.monthArray);
		this.weakArray = handleConfig(((String) parameter.get(NAME_WEAK)), 4, this.weakArray);
		this.dayOfWeakArray = handleConfig(((String) parameter.get(NAME_DAY_OF_WEAK)), 7, this.dayOfWeakArray);
		this.dayOfMonthArray = handleConfig(((String) parameter.get(NAME_DAY_OF_MONTH)), 31, this.dayOfMonthArray);
		this.hourArray = handleConfig(((String) parameter.get(NAME_HOUR)), 24, this.hourArray);
		this.minuteArray = handleConfig(((String) parameter.get(NAME_MINUTE)), 60, this.minuteArray);
		//this.secondArray = handleConfig(((String) parameter.get(NAME_SECOND)), 60, this.secondArray);

		isFirst = true;
		setLastRunTime();
	}


	@Override
	public long getNextRunTime() {
		return lastRunTime;
	}

	private void setYearArray(String yearArray) {
		int nowYear = calendar.get(Calendar.YEAR);

		//未指定或者指定为通配符
		if (yearArray == null || "".equals(yearArray) || CONFIG_WILDCARD.equals(yearArray)) {
			for (int i = 0; i < this.yearArray.length; i++) {
				this.yearArray[i] = nowYear + i;
			}
			return;
		}

		//对应使用间隔模式
		int ind = 0;
		int interval = getInterval(yearArray);
		if (interval > 0) {
			for (int i = nowYear; ind < this.yearArray.length; i++) {
				if (i % interval == 0) {
					this.yearArray[ind++] = i;
				}
			}
			return;
		}

		this.yearArray = handleSpecifyMode(yearArray);
	}


	private int[] handleConfig(String string, int maxValue, int[] array) {
		//未指定或者指定为通配符
		if (string == null || "".equals(string) || CONFIG_WILDCARD.equals(string)) {
			for (int i = 0; i < array.length; i++) {
				array[i] = i;
			}
			return array;
		}

		string = string.trim();

		//对应使用间隔模式
		int interval = getInterval(string);
		if (interval > 0) {
			return handleIntervalMode(interval, maxValue, array);
		}

		//对应使用指定模式
		return handleSpecifyMode(string);
	}

	/**
	 * 处理固定间隔时间模式的方法.
	 *
	 * @param interval 固定的间隔时间
	 * @param maxValue 进制数，即此间隔时间的最大值
	 * @param array    一个临时的数组，暂存数据。此数组内数据将被改写。
	 * @return 一个新数组，存放所有可能执行的数字。
	 */
	private int[] handleIntervalMode(int interval, int maxValue, int[] array) {
		int ind = 0, i;
		for (i = 0; i < maxValue; i++) {
			if (i % interval == 0) {
				array[ind++] = i;
			}
		}

		int[] newArray = new int[ind];
		for (i = 0; i < ind; i++) {
			newArray[i] = array[i];
		}
		return newArray;
	}

	/**
	 * 对应使用指定模式
	 *
	 * @param string 传入的值
	 * @return 一个int数组，表明指定的值
	 */
	private int[] handleSpecifyMode(String string) {
		String[] strings = string.split(",");
		int[] array = new int[strings.length];

		int i;
		for (i = 0; i < strings.length; i++) {
			try {
				array[i] = Integer.parseInt(strings[i].trim());
			} catch (NumberFormatException e) {
				logger.error("配置需要一个正整数,错误的配置{}.", string, e);
			}
		}

		return array;
	}

	/**
	 * 得到间隔时间的除数因子.
	 *
	 * @param string 参数字串
	 * @return 返回固定间隔的除数因子
	 */
	private int getInterval(String string) {
		if (string == null) {
			logger.error("传入的参数为空，不能进行计算。");
			return -1;
		}

		if (string.startsWith("/")) {
			String intervalString = string.substring(1).trim();

			int interval = 1;
			if (!intervalString.isEmpty()) {
				interval = Integer.parseInt(intervalString);
			}
			return interval;
		}

		return -1;
	}
}