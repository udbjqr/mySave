package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.ControlType;
import com.tk.common.DataType;
import com.tk.common.result.ResultCode;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.objects.*;
import com.tk.objects.identity.Department;
import com.tk.objects.identity.DepartmentFactory;
import com.tk.objects.identity.Employee;
import com.tk.objects.identity.EmployeeFactory;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.util.List;

/**
 * 数据源管理
 */
@WebServlet("/dataSource.do")
public class DataSourceServlet extends BaseServlet {
	// 获取到数据字典工厂类
	private static DictFactory dictFactory = DictFactory.getInstance();
	//查询工厂类
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();
	//获取到人员工厂类
	private static EmployeeFactory employeeFactory = EmployeeFactory.getInstance();
	//部门工厂类
	private static DepartmentFactory departmentFactory = DepartmentFactory.getInstance();

	private static Logger log = LogManager.getLogger(DataSourceServlet.class.getName());

	/**
	 * servlet 初始化的时候设置权限
	 *
	 * @throws ServletException
	 */
	@Override
	public void init() throws ServletException {
//		handlePermission.put(ControlType.add, PermissionEnum.GOODS_ADD);
	}

	@Override
	protected boolean handleChilder(HttpServletRequest request, PrintWriter writer, HttpServletResponse response) {
		//获得操作类型
		ControlType controlType = (ControlType) request.getAttribute("controlType");
		if (null == controlType) {
			return false;
		}
		switch (controlType) {
			case queryDateType:
				queryDateType(request, writer);
				return true;
			default:
				return false;
		}
	}


	/**
	 * 获得基本数据类型
	 *
	 * @param request
	 * @param writer
	 */
	protected void queryDateType(HttpServletRequest request, PrintWriter writer) {
		log.trace("获取数据数据源信息初始...");
		JSONArray dataArry = new JSONArray();
		//先拼凑人员和部门的数据类型
		JSONObject userData = new JSONObject();
		userData.put("dataName", "人员");
		userData.put("dataType", DataType.employee);
		dataArry.add(userData);
		JSONObject deptData = new JSONObject();
		deptData.put("dataName", "部门");
		deptData.put("dataType", DataType.deptment);
		dataArry.add(deptData);
		//数据字典里获取
		StringBuilder sql = new StringBuilder();
		sql.append(" SELECT DISTINCT T.dict_name FROM data_dictionary T WHERE T.FLAG = 1 ");
		ResultSet result = null;
		try {
			result = dbHelper.select(sql.toString());
			while (result.next()) {
				JSONObject object = new JSONObject();
				object.put("dataName", result.getString("dict_name"));
				object.put("dataType", DataType.dictionary);
				dataArry.add(object);
			}
			log.trace("获取数据数据源信息结束...");
			writer.print(new ResultCode(true, dataArry));
		} catch (Exception e) {
			log.error("获取数据源信息异常:{}！", e);
			writer.print(ResultCode.QUERY_ERROR);
		} finally {
			dbHelper.close(result);
		}
	}

	/**
	 * 通过数据类型查询到数据的分类
	 *
	 * @param request
	 * @param writer
	 */
	@Override
	protected void query(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询数据分类明细操作初始...");
		JSONObject dataJson = getParam(request);
		//流程名称
		String dataTypeStr;
		String dataName;
		//单独查某个分类下的某个值的名字
		Integer detailId;
		try {
			dataTypeStr = dataJson.getString("dataType");
			dataName = dataJson.getString("dataName");
			detailId = dataJson.getInteger("detail_id");
		} catch (Exception e) {
			log.error("获取数据类型参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(dataTypeStr)) {
			log.trace("获取数据类型操作信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		DataType dataType;
		//转义数据类型
		try {
			dataType = DataType.valueOf(dataTypeStr);
		} catch (IllegalArgumentException e) {
			logger.warn("未知的数据类型！");
			writer.print(ResultCode.UNKNOWN_DATA_SOURCE_TYPE);
			return;
		}
		JSONArray dataArry = new JSONArray();
		//查询语句
		StringBuilder sql = new StringBuilder();
		sql.append(" WHERE T.FLAG =1 ");
		if (null != detailId) {
			sql.append(" and t.id = " + detailId);
		}
		//查人员
		try {
			switch (dataType) {
				case employee:
					List<Employee> employees = employeeFactory.getObjectsForString(sql.toString(), null);
					if (null == employees || employees.size() == 0) {
						log.trace("未查询到人员数据信息");
						writer.print(new ResultCode(true, dataArry));
						return;
					}
					for (Employee employee : employees) {
						JSONObject object = new JSONObject();
						object.put("name", employee.get("real_name"));
						object.put("value", employee.getId());
						dataArry.add(object);
					}
					break;
				case deptment:
					List<Department> departments = departmentFactory.getObjectsForString(sql.toString(), null);
					if (null == departments || departments.size() == 0) {
						log.trace("未查询到部门数据信息");
						writer.print(new ResultCode(true, dataArry));
						return;
					}
					for (Department department : departments) {
						JSONObject object = new JSONObject();
						object.put("name", department.get("dept_name"));
						object.put("value", department.getId());
						dataArry.add(object);
					}
					break;
				default:
					if (StringUtils.isEmpty(dataName)) {
						break;
					}
					sql.append(" AND T.dict_name ='" + dataName + "'");
					List<Dict> dicts = dictFactory.getObjectsForString(sql.toString(), null);
					if (null == dicts || dicts.size() == 0) {
						log.trace("未查询到相关数据字典信息");
						writer.print(new ResultCode(true, dataArry));
						return;
					}
					for (Dict dict : dicts) {
						JSONObject object = new JSONObject();
						object.put("name", dict.get("para_name"));
						object.put("value", dict.get("ID"));
						dataArry.add(object);
					}
					break;
			}
			log.trace("查询数据分类明细操作结束...");
			writer.print(new ResultCode(true, dataArry));
		} catch (Exception e) {
			log.trace("获取数据分类明细发生异常，异常描述:{}", e);
			writer.print(ResultCode.QUERY_ERROR);
		}
	}
}
