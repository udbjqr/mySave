package com.tk.object.importData;

import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class TestDate {

	public static void main(String[] args) throws ParseException {
		///result();
		convert(3555555555.8715435934050405034);
	}
	
	public static void result(){
		double a = 300;
		double b = 800;
		double result = a*b*100000;
		System.out.println(result);
		System.out.println(result/10000);
	}
	
	
	 /***
	 * 四舍五入
	 * @param value
	 * @return
	 */
  public static double convert(double value) {
		DecimalFormat  df = new DecimalFormat("#.##");  
    System.out.println(df.format(value));
    double result = Double.valueOf(df.format(value));
		return result;
	}
	
	
	public static void getDate() throws ParseException{
		Date d1 = new SimpleDateFormat("yyyy-MM").parse("2014-1");// 定义起始日期

		Date d2 = new SimpleDateFormat("yyyy-MM").parse("2016-5");// 定义结束日期

		Calendar dd = Calendar.getInstance();// 定义日期实例

		dd.setTime(d1);// 设置日期起始时间

		while (dd.getTime().before(d2)) {// 判断是否到结束日期

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");

			String str = sdf.format(dd.getTime());

			System.out.println(str);// 输出日期结果

			dd.add(Calendar.MONTH, 1);// 进行当前日期月份加1

		}
	}
}
