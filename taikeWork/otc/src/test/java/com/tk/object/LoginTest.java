package com.tk.object;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Random;

import com.tk.common.util.DateUtil;

public class LoginTest {

	public static void main(String[] args){  
     /*	SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		  Calendar calendar = Calendar.getInstance();
		  calendar.add(Calendar.DATE, +3);
			Date date = calendar.getTime();
			System.out.println(sdf.format(date));
			Date currentDate = new Date();
			Double time = (date.getTime()-currentDate.getTime())/1000.00/60/60/24;
			System.out.println(sdf.format(currentDate));
			System.out.println(time.doubleValue());*/
			String formatDate = (String) DateUtil.formatDate(new Date(1483455638812l), "yyyy-MM-dd hh:mm:ss");
			System.out.println(formatDate);
   }
	  
	interface Test{  
	   public static final float NUM = new Random().nextFloat();   
	}

}
