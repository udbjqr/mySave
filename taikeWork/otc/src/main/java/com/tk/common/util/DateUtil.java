package com.tk.common.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

/**
 * 项目名称: carplay <br/>
 * 类名称 : DateUtil.java<br/>
 * 类描述 : 日期工具类<br/>
 *
 * @author huzehua <br/>
 * @version 1.0
 */
public class DateUtil {

	private static DateFormat df = new SimpleDateFormat("yyyy-MM-dd");

	private static DateFormat df2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

	private static TimeZone zone = TimeZone.getTimeZone("GMT+8");

	/**
	 * 一天有多少毫秒
	 */

	private static final int ONE_DAY = 1000 * 60 * 60 * 24;

	/**
	 * 获取当前年份
	 *
	 * @return
	 */
	public static String getYear() {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
		sdf.setTimeZone(zone);
		return sdf.format(date);
	}

	/**
	 * 获取当前月份
	 *
	 * @return
	 */
	public static String getMonth() {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("MM");
		sdf.setTimeZone(zone);
		return sdf.format(date);
	}

	/**
	 * 获取当前日期
	 *
	 * @return yyyy-MM-dd
	 */
	public static String getDate() {
		Date date = new Date();
		df.setTimeZone(zone);
		return df.format(date);
	}

	/**
	 * 获取日期
	 *
	 * @param time
	 * @return
	 */
	public static String getDate(long time) {
		Date date = new Date(time);
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		return format.format(date);
	}

	/**
	 * 获取当前时间
	 *
	 * @return yyyy-MM-dd HH:mm:ss
	 */
	public static String getTime() {
		Date date = new Date();
		df2.setTimeZone(zone);
		return df2.format(date);
	}

	/**
	 * 获取指定格式的当前时间
	 */
	public static String getTime(String format) {
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat(format);
		sdf.setTimeZone(zone);
		return sdf.format(date);
	}

	/**
	 * 获取时间
	 *
	 * @param time
	 * @return
	 */
	public static String getTime(long time) {
		Date date = new Date(time);
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		return format.format(date);
	}

	/**
	 * 传进"yyyy-MM-dd HH:mm"类型的字符串
	 *
	 * @param start 开始时间
	 * @param end   结束时间
	 * @return 两时间段的时间差(分钟为单位)
	 */
	public static int getMinute(String start, String end) {
		DateUtil d = new DateUtil();
		long startT = d.fromDateStringToLong(start);
		long endT = d.fromDateStringToLong(end);
		long mint = (endT - startT) / 1000;
		return (int) mint / 60;
	}

	/**
	 * 获取时间差
	 *
	 * @param start 开始时间
	 * @param end   结束时间
	 * @return long 类型的时间差
	 */
	public static long getSecond(String start, String end) {
		DateUtil d = new DateUtil();
		long startT = d.fromDateStringToLong(start);
		long endT = d.fromDateStringToLong(end);
		return (long) (endT - startT) / 1000;
	}

	/**
	 * 判断2个时间点相隔多少年，月，日
	 *
	 * @param fromDate 2005-05-31
	 * @param toDate   2007-01-01
	 * @return 2: 20: 580
	 */
	public static int[] getDateLength(String fromDate, String toDate) {
		Calendar c1 = stringToCalendar(fromDate);
		Calendar c2 = stringToCalendar(toDate);
		int[] p1 = {c1.get(Calendar.YEAR), c1.get(Calendar.MONTH),
						c1.get(Calendar.DAY_OF_MONTH)};
		int[] p2 = {c2.get(Calendar.YEAR), c2.get(Calendar.MONTH),
						c2.get(Calendar.DAY_OF_MONTH)};
		return new int[]{
						p2[0] - p1[0],
						p2[0] * 12 + p2[1] - p1[0] * 12 - p1[1],
						(int) ((c2.getTimeInMillis() - c1.getTimeInMillis()) / (24 * 3600 * 1000))};
	}

	/**
	 * 格式化时间
	 *
	 * @param date 时间
	 * @param type 要格式化得类型，例如yyyy-MM-dd
	 * @return
	 */
	public static Object formatDate(Object date, String type) {
		if (date != null && !"".equals(date)) {
			SimpleDateFormat format = new SimpleDateFormat(type);
			return format.format(date);
		}
		return null;
	}

	/**
	 * 格式时间字符串转为long
	 *
	 * @param inVal
	 * @return
	 */
	public long fromDateStringToLong(String inVal) {
		return DateUtil.fromDateStringToLong(inVal, "yyyy-MM-dd HH:mm");
	}

	/**
	 * 格式时间字符串转为long
	 *
	 * @param inVal  时间字符串
	 * @param format 时间格式类型
	 * @return
	 */
	public static long fromDateStringToLong(String inVal, String format) {
		Date date = null;
		SimpleDateFormat inputFormat = new SimpleDateFormat(format);
		try {
			date = inputFormat.parse(inVal);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return date.getTime();
	}

	/**
	 * 将String时间转成Calendar对象
	 *
	 * @param date 2005-05-31
	 * @return Calendar
	 */
	public static Calendar stringToCalendar(String date) {
		Calendar cal = Calendar.getInstance();
		cal.clear();
		cal.set(Integer.parseInt(date.substring(0, 4)),
						Integer.parseInt(date.substring(5, 7)) - 1,
						Integer.parseInt(date.substring(8, 10)));
		return cal;
	}

	/**
	 * 把字符串变成日期格式
	 *
	 * @param dateStr
	 * @return Date
	 */
	public static Date stringToDate(String dateStr) {
		String formatStr = "yyyy-MM-dd";
		if (dateStr.length() > 10) {
			formatStr = "yyyy-MM-dd HH:mm:ss";
		}
		SimpleDateFormat format = new SimpleDateFormat(formatStr);
		Date date = null;
		try {
			date = format.parse(dateStr);
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		return date;
	}

	/**
	 * 获取2个时间点中相隔具体天数
	 *
	 * @param time1 开始时间 2010-09-01
	 * @param time2 结束时间 2010-09-05
	 * @return 具体时间数组（2010-09-01,2010-09-02,2010-09-03,2010-09-04,2010-09-05）
	 */
	public static String[] getTimeArrByStartAndEnd(String time1, String time2) {
		int ret[] = DateUtil.getDateLength(time1, time2);
		if (ret == null || ret.length <= 0) {
			return null;
		}
		int dayNum = ret[2];
		String[] dateStrArr = new String[dayNum + 1];
		dateStrArr[0] = time1;
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Calendar cal1 = DateUtil.stringToCalendar(time1);
		for (int i = 0; i < dayNum; i++) {
			cal1.add(Calendar.DATE, 1);
			dateStrArr[i + 1] = sdf.format(cal1.getTime());
		}
		return dateStrArr;
	}

	/**
	 * 根据年份加减日期
	 *
	 * @param date 时间 2010-09-01
	 *             年份 1/-1
	 * @return 2011-09-01
	 */
	public static String countYear(String date, int year) {
		Calendar cal = Calendar.getInstance();
		cal.set(Integer.parseInt(date.substring(0, 4)),
						Integer.parseInt(date.substring(5, 7)) - 1,
						Integer.parseInt(date.substring(8, 10)));
		cal.add(Calendar.YEAR, year);
		return (String) DateUtil.formatDate(cal.getTime(), "yyyy-MM-dd");
	}

	/**
	 * 根据月份加减日期
	 *
	 * @param date   时间 2010-09-01
	 * @param amount 月数 3/-3
	 * @return 2010-06-01
	 */
	public static String countMonth(String date, int amount) {
		Calendar cal = Calendar.getInstance();
		cal.set(Integer.parseInt(date.substring(0, 4)),
						Integer.parseInt(date.substring(5, 7)) - 1,
						Integer.parseInt(date.substring(8, 10)));
		cal.add(Calendar.MONTH, amount);
		return (String) DateUtil.formatDate(cal.getTime(), "yyyy-MM-dd");
	}

	/**
	 * 根据天数加减日期
	 *
	 * @param date   时间 2010-09-01
	 * @param amount 天数 3/-3
	 * @return 2010-06-01
	 */
	public static String countDay(String date, int amount) {
		Calendar cal = Calendar.getInstance();
		cal.set(Integer.parseInt(date.substring(0, 4)),
						Integer.parseInt(date.substring(5, 7)) - 1,
						Integer.parseInt(date.substring(8, 10)));
		cal.add(Calendar.DATE, amount);
		return (String) DateUtil.formatDate(cal.getTime(), "yyyy-MM-dd");
	}

	/**
	 * 根据年月日 时分秒加减秒
	 *
	 * @param date   2010-09-01 01:00:00
	 * @param second 秒数 3/-3
	 * @return 2010-09-01 01:00:03
	 */
	public static String countSecond(String date, int second) {
		Calendar cal = Calendar.getInstance();
		cal.set(Integer.parseInt(date.substring(0, 4)),
						Integer.parseInt(date.substring(5, 7)) - 1,
						Integer.parseInt(date.substring(8, 10)),
						Integer.parseInt(date.substring(11, 13)),
						Integer.parseInt(date.substring(14, 16)),
						Integer.parseInt(date.substring(17, 19)));
		cal.add(Calendar.SECOND, second);
		return (String) DateUtil.formatDate(cal.getTime(),
						"yyyy-MM-dd HH:mm:ss");
	}

	public static long ObjectTOLong(Object longObj) {
		return Long.valueOf(String.valueOf(longObj));
	}

	/**
	 * 判断日期是否存在
	 *
	 * @param time (yyyy-mm-dd)
	 * @return
	 */
	public static boolean checkDateIsExists(String time) {
		try {
			Date date2 = DateUtil.stringToDate(time);
			long l2 = date2.getTime();
			String time2 = DateUtil.getDate(l2);
			if (time2.equals(time)) {
				return true;
			}
			return false;
		} catch (Exception e) {
			return false;
		}
	}

	/**
	 * 根据年月参数，获取该月份的最后一天
	 *
	 * @param time (yyyy-mm)
	 * @return
	 */
	public static String getMonthLastDate(String time) {
		boolean res = false;
		String lastDate = "";
		for (int i = 31; i >= 28; i--) {
			lastDate = time + "-" + i;
			res = DateUtil.checkDateIsExists(lastDate);
			if (res) {
				return lastDate;
			}
		}
		return time + "-31";
	}

	/**
	 * 获取传入的日期是周几
	 *
	 * @param day
	 * @return
	 */
	public static String getDayWeek(String day) {
		final String dayNames[] = {"7", "1", "2", "3", "4", "5", "6"};
		SimpleDateFormat sdfInput = new SimpleDateFormat("yyyy-MM-dd");
		Calendar calendar = Calendar.getInstance();
		Date date = new Date();
		try {
			date = sdfInput.parse(day);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		calendar.setTime(date);
		int dayOfWeek = calendar.get(Calendar.DAY_OF_WEEK);
		return dayNames[dayOfWeek - 1];
	}

	/**
	 * TODO 返回两时间段隔的天数<br/>
	 * <p>
	 * TODO 返回两时间段隔的天数
	 * </p>
	 *
	 * @param time1 开始时间
	 * @param time2 结束时间
	 * @return
	 * @throws Exception
	 */
	public static int countDays(String time1, String time2) throws Exception {
		Date date1 = df.parse(time1);
		Date date2 = df.parse(time2);
		Calendar nowDate = Calendar.getInstance(), oldDate = Calendar
						.getInstance();
		nowDate.setTime(date1);
		oldDate.setTime(date2);
		long timeNow = nowDate.getTimeInMillis();
		long timeOld = oldDate.getTimeInMillis();
		int days = (int) ((timeOld - timeNow) / (ONE_DAY));
		return days;
	}



	/**
	 * 获取日期中的某数值。如获取月份
	 * @param dateStr 日期
	 * @return 数值
	 */
	public static int getMonth(String dateStr) {
	// 解析格式，yyyy表示年，MM(大写M)表示月,dd表示天，HH表示小时24小时制，小写的话是12小时制
	// mm，小写，表示分钟，ss表示秒

		// 用parse方法，可能会异常，所以要try-catch
		Date date = stringToDate(dateStr);
		// 获取日期实例
		Calendar calendar = Calendar.getInstance();
		// 将日历设置为指定的时间
		calendar.setTime(date);

		return calendar.get(Calendar.MONTH);
	}

	public static void main(String[] args) {
		// System.out.println(DateUtil.getMonthLastDate("2019-02-30".substring(0,
		// 7)));
//		String time = DateUtil.getTime();
//		System.out.println(time);

//		System.out.println(DateUtil.getSecond(DateUtil.getTime(), DateUtil.countSecond(DateUtil.getTime(), 7000)));
//		System.out.println("time  "+getInteger(stringToDate(),Calendar.MONTH));
		System.out.println("time  "+getMonth(countDay(getDate(),-2)));
		// System.out.println(DateUtil.countSecond(DateUtil.getTime(),1));
	}
}
