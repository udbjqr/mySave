package com.tk.object;


import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import org.junit.Test;

import java.sql.SQLException;

public class ConnectionTest {

	@Test
	public void testIdleConnect() {
		DBHelper dbHelper = DBHelperFactory.getDBHelper();

		try {
			Thread.sleep(100);
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		try {
			String name = dbHelper.selectOneValues("select real_name from employee where id = 0 ");

			System.out.println(name);
		} catch (SQLException e) {
			e.printStackTrace();
		}

		//try {
		//	for (int i = 0; i < 10; i++) {
		//		dbHelper.select("select * from employee;");
		//	}
		//} catch (SQLException e) {
		//	e.printStackTrace();
		//}
	}
}
