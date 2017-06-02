package com.tk.object.importData;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Random;

import org.junit.Test;

import com.tk.common.persistence.WriteValueException;
import com.tk.object.Customer;
import com.tk.object.CustomerFactory;
import com.tk.object.Employee;
import com.tk.object.EmployeeFactory;
import com.tk.object.VisitPlan;
import com.tk.object.VisitPlanFactory;

public class TestImportPlan {

	@Test
	public void test() {
		try {
			Employee employee = EmployeeFactory.getInstance().getObject("id", 49);
			List<Customer> customerList = CustomerFactory.getInstance().getMultipleObjects("employee_id", 49, employee);
			for (Customer customer : customerList) {
				System.out.println(customer.get("id").toString());
			}
			
			
			int count = customerList.size();
			Random random = new Random();
			List<List<String>> list = testGetDate();
			for (List<String> date : list) {
				VisitPlan visitPlan = VisitPlanFactory.getInstance().getNewObject(employee);
				int index = random.nextInt(count);
				Customer customer = customerList.get(index);
				// 设置访问人
				visitPlan.set("employee_id", 49);
				String plan_in_time = date.get(0);// map.get("计划拜访时间").toString();
				String plan_out_time = date.get(1);// map.get("计划离开时间").toString();

				visitPlan.set("custom_id", customer.get("id"));
				visitPlan.set("plan_in_time", plan_in_time);
				visitPlan.set("plan_out_time", plan_out_time);
				visitPlan.set("flag", 1);
				visitPlan.set("plan_create_time", new Date());

				visitPlan.flash();
			}
			
			
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	
	//3.获取一个月的日期
	public static List<List<String>> testGetDate(){
		// 获取Calendar
		Calendar calendar2 = Calendar.getInstance();
		// 设置日期为本月最大日期
		calendar2.set(Calendar.DATE, calendar2.getActualMaximum(Calendar.DATE));
		//获取日
		int date = calendar2.get(Calendar.DATE);
		
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
		System.out.println("date:"+date);
		
		List<List<String>> dateList = new ArrayList<>();
		Random random = new Random();
		for (int i = 0; i < date; i++) {
			for (int j = 0; j < 8; j++) {
				List<String> twoDate = new ArrayList<>();
				calendar2.set(Calendar.MONTH, 8);
				calendar2.set(Calendar.DATE, i+1);
				calendar2.set(Calendar.HOUR_OF_DAY, random.nextInt(24));//时
				calendar2.set(Calendar.MINUTE, random.nextInt(60));//分
				calendar2.set(Calendar.SECOND, random.nextInt(60));//秒
				String dateStr1 = sdf.format(calendar2.getTime());
				calendar2.add(Calendar.MINUTE, random.nextInt(60));
				String dateStr2 = sdf.format(calendar2.getTime());
				twoDate.add(dateStr1);
				twoDate.add(dateStr2);
				
				dateList.add(twoDate);
			}
		}
		
		
		System.out.println(dateList);
		return dateList;
	}
	
	
	
	public static void main(String[] args) {
		testGetDate();
	}
	
	
}
