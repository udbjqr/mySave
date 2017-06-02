package com.tk.object;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import com.tk.object.KPI.KPIComputeChainCustomer;
import com.tk.object.KPI.KPIComputeCustomer;
import com.tk.object.SignTask.ComputeKPITask;

public class KpiTest {

	public static void main(String[] args) {
		
		/*Calendar calendar = Calendar.getInstance();
		int year = calendar.get(Calendar.YEAR);
		int month = calendar.get(Calendar.MONTH)+1;
		String sql = String.format("delete from kpi_score_record where create_time between '%d-%d-' and '%d-%d-01'",
		year,month,year,month+1);
		
		System.out.println(sql);*/
		
		/*Calendar calendar = Calendar.getInstance();
		int year = calendar.get(Calendar.YEAR);
		int month = calendar.get(Calendar.MONTH)+1;
		calendar.set(Calendar.DATE, 8);
		String sql = String.format("delete from kpi_score_record where create_time between '%1$tY-%1$tm-%1$td' and '%2$tY-%2$tm-%2$td'",
		calendar.getTime(),calendar.getTime());
		
		System.out.println(sql);*/

		
		/*String format = String.format("日期：%d-%d-%3$02d", 2016,11,8);
		System.out.println(format);*/
		
		//%[argument_index$][flags][width][.precision]conversion 公式
		/*String format = String.format("小数：%.4f",1.4155555);
		System.out.println(format);*/
		

		/*ComputeKPITask computeKPITask = new ComputeKPITask();
		computeKPITask.execute();*/
		
		
		String str = "003";   
		boolean isNum = str.matches("[0-9]+");   
		System.out.println(isNum);
		
	}

	
	
}
