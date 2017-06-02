package com.tk.common.util;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

/**
 * 项目名称: OTC <br/>
 * 类名称 : GeoUtils.java<br/>
 * 类描述 : 坐标计算类<br/>
 *
 * @author huzehua <br/>
 * @version 1.0
 */
public class GeoUtils {

	//签到
	private final static double PI = 3.14159265358979323; // 圆周率
	private final static double R = 6371229; // 地球的半径

	/**
	 * 计算两经纬度点之间的距离（单位：米）
	 *
	 * @param longt_x 经度
	 * @param lat_x   纬度
	 * @param longt_y
	 * @param lat_y
	 * @return
	 */
	public static Boolean overStep(double longt_x, double lat_x, double longt_y, double lat_y, int maxDistance) {
		double x, y;
		x = (longt_y - longt_x) * PI * R
						* Math.cos(((lat_x + lat_y) / 2) * PI / 180) / 180;
		y = (lat_y - lat_x) * PI * R / 180;

		return Math.hypot(x, y) > maxDistance;
	}
}
