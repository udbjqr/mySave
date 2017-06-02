package com.tk.servlet;

import com.tk.objects.identity.Department;
import com.tk.objects.identity.DepartmentFactory;
import org.junit.Test;

import java.sql.SQLException;
import java.util.List;


/**
 * Created by huzehua on 2017/2/9.
 */
public class TestDepartmentServlet {

	@Test
	public void test(){

		try {
			List<Department> deptList = DepartmentFactory.getInstance().getObjectsForString(" where t.flag=1 and t.parent_id is null ", null);

			deptList.forEach(System.out::println);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
}
