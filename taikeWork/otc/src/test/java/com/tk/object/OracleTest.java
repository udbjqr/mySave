package com.tk.object;

import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import org.junit.Test;

import java.sql.SQLException;

public class OracleTest {

	@Test
	public void test(){
		DBHelper dbHelper = DBHelperFactory.getSecondDBHelper("2");

		try {
			dbHelper.select("select 1 from dual;");
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

}
