package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.common.persistence.WriteValueException;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.PageUtil;
import com.tk.object.*;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.SQLException;
import java.util.*;

/**
 * 客户管理
 */
@WebServlet("/customer.do")
public class CustomerServlet extends BaseServlet {

	private static Logger log = LogManager.getLogger(CustomerServlet.class.getName());
	// 获取到拜访记录工厂类
	private static VisitsFactory visitsFactory = VisitsFactory.getInstance();
	// 获取到员工工厂类
	private static EmployeeFactory employeeFactory = EmployeeFactory.getInstance();
	// 获取到门店工厂类
	private static CustomerFactory customerFactory = CustomerFactory.getInstance();
	// 获取到商业客户工厂类
	private static ChainCustomerFactory chainCustomerFactory = ChainCustomerFactory.getInstance();
	// 获取到门店工厂类
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();

	private int pageSize;
	private int pageNumber;

	@Override
	protected boolean handleChilder() {
		switch (controlType) {
			case visitHistory:
				queryVisitHistory();
				return true;
			case queryPlanStore:
				queryPlanStore();
				return true;
			case updateLocation:
				if (employee.hasPermission(handlePermission.get(ControlType.updateLocation))) {
					updateLocation();
					return true;
				} else {
					return false;
				}
			case disable:
				if (employee.hasPermission(handlePermission.get(ControlType.disable))) {
					disable();
					return true;
				} else {
					return false;
				}
			case getCustomerInfo://微信查询门店客户
				permissionControlLoad();
				return true;
			default:
				return false;
		}
	}

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.add, PermissionEnum.CUSTOM_ADD);
		handlePermission.put(ControlType.update, PermissionEnum.CUSTOM_UPDATE);
		handlePermission.put(ControlType.load, PermissionEnum.CUSTOM_QUERY);
		handlePermission.put(ControlType.disable, PermissionEnum.CUSTOM_DISABLE);
		handlePermission.put(ControlType.query, PermissionEnum.CUSTOM_QUERY);
		handlePermission.put(ControlType.queryPlanStore, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.updateLocation, PermissionEnum.CUSTOM_UPDATE);
		handlePermission.put(ControlType.visitHistory, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.fileImport, PermissionEnum.CUSTOM_IMPORT);
		handlePermission.put(ControlType.fileExport, PermissionEnum.CUSTOM_EXPORT);
	}

	@Override
	protected void queryAll() {
		log.trace("开始查询门店列表");
		//门店列表
		List<Customer> customerList;
		//连锁客户列表
		String chain_customId;
		String name;
		try {
			//这个是统计的时候根据商业客户ID查找下面的门店列表
			chain_customId = dataJson.getString("chain_customId");
			name = dataJson.getString("name");
		} catch (Exception e) {
			log.error("查询列表发生异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		StringBuilder sql = new StringBuilder();
		//查询门店客户
		try {
			if (StringUtils.isNotBlank(chain_customId)) {
				sql.append(" left join chain_customer ch on ch.id= t.chain_customer_id ");
				sql.append(" where t.id !=0 and t.flag= 1 and t.chain_customer_id in (")
				.append(chain_customId).append(")");
			} else if (StringUtils.isNotEmpty(name)) {
				sql.append(" where t.id != 0 and t.flag = 1 and customer_name like " + dbHelper.getString("%" + name + "%"));
			}
			//判断是否根据条件查询
			if (sql.length() < 1) {
				sql.append("where t.id != 0 and flag= 1");
			}
			sql.append(" ORDER BY customer_name ");
			customerList = customerFactory.getObjectsForString(sql.toString(), employee);
		} catch (Exception e) {
			log.error("查询门店列表异常！");
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
			return;
		}
		//保存数据
		JSONArray jsonArray = new JSONArray();
		if (null != customerList && customerList.size() > 0) {
			for (Customer customer : customerList) {
				JSONObject object = new JSONObject();
				object.put("id", customer.get("id"));
				object.put("name", customer.get("customer_name"));
				jsonArray.add(object);
			}
		}

		SuccessJSON success = new SuccessJSON();
		success.put("list", jsonArray);
		writer.print(success);
		log.trace("查询门店列表结束");
	}

	/**
	 * 拜访计划门店
	 */
	protected void queryPlanStore() {
		log.trace("开始查询门店列表（包括门店跟商业）");
		//门店列表
		List<Customer> customerList;
		//连锁客户列表
		List<ChainCustomer> chainCustomerList;

		String name;
		try {
			//商业客户或门店客户名
			name = dataJson.getString("name");
		} catch (Exception e) {
			log.error("查询列表发生异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		StringBuilder sql = new StringBuilder();
		//查询门店客户
		try {
			if (StringUtils.isNotEmpty(name)) {
				sql.append(" where t.id != 0 and t.flag = 1 and customer_name like " + dbHelper.getString("%" + name + "%"));
			}
			//判断是否根据条件查询
			if (sql.length() < 1) {
				sql.append("where t.id != 0 and flag= 1");
			}
			sql.append(" ORDER BY customer_name ");
			customerList = customerFactory.getObjectsForString(sql.toString(), employee);
		} catch (Exception e) {
			log.error("查询门店列表异常！");
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
			return;
		}
		//保存数据
		JSONArray jsonArray = new JSONArray();
		//非通过商业客户ID查询
		sql.setLength(0);
		sql.append(" where flag = 1 ");
		sql.append(" and t.employee_id =" + employee.getId());
		if (StringUtils.isNotEmpty(name)) {
			sql.append(" and china_customer_name like " + dbHelper.getString("%" + name + "%"));
		}
		sql.append(" ORDER BY china_customer_name ");
		//查询商业客户
		try {
			chainCustomerList = chainCustomerFactory.getObjectsForString(sql.toString(), employee);
		} catch (Exception e) {
			log.error("查询门店列表异常！");
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
			return;
		}
		if (null != chainCustomerList && chainCustomerList.size() > 0) {
			for (ChainCustomer chainCustomer : chainCustomerList) {
				JSONObject object = new JSONObject();
				object.put("id", chainCustomer.get("id"));
				object.put("name", chainCustomer.get("china_customer_name"));
				//代表是商业客户
				object.put("type", "2");
				jsonArray.add(object);
			}
		}

		if (null != customerList && customerList.size() > 0) {
			for (Customer customer : customerList) {
				JSONObject object = new JSONObject();
				object.put("id", customer.get("id"));
				object.put("name", customer.get("customer_name"));
				//代表是门店客户
				object.put("type", "1");
				jsonArray.add(object);
			}
		}

		SuccessJSON success = new SuccessJSON();
		success.put("list", jsonArray);
		writer.print(success);
		log.trace("查询门店列表结束");
	}

	@Override
	protected void delete() {
		log.trace("开始删除客户");
		try {
			Integer id = dataJson.getInteger("id");
			Customer customer = customerFactory.getObject("id", id);

			customer.delete();
		} catch (Exception e) {
			log.error("参数异常！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		}
	}

	/**
	 * 停用或启用门店客户
	 */
	protected void disable() {
		log.trace("停用或启用门店客户信息初始....");
		//门店客户Id
		Integer customId;
		//停用启用标识（1：启用，0：停用）
		Integer flag;
		try {
			customId = dataJson.getInteger("custom_id");
			flag = dataJson.getInteger("flag");
		} catch (Exception e) {
			log.error("获取连锁客户Id异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (customId == null || flag == null) {
			log.trace("获取门店客户Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		Customer customer = customerFactory.getObject("id", customId);
		if (null == customer) {
			log.trace("门店客户信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		try {
			customer.set("flag", flag);
			customer.flash();
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.error("停用或启用门店客户发生异常：{}！", e);
			writer.print(ErrorCode.UPDATE_ERROR);
		}
	}

	@Override
	protected void update() {
		try {
			log.trace("开始修改客户");
			Integer id = dataJson.getInteger("id");
			String customerName = dataJson.getString("customerName");
			Integer areaId = dataJson.getInteger("areaId");
			Integer employeeId = dataJson.getInteger("employeeId");
			String address = dataJson.getString("address");
			Integer attributesId = dataJson.getInteger("attributes_id");
			String buyer = dataJson.getString("buyer");
			String buyerPhone = dataJson.getString("buyerPhone");
			Integer personInChargeId = dataJson.getInteger("personInChargeId");
			Integer chainCustomerId = dataJson.getInteger("chainCustomerId");

			Customer customer = customerFactory.getObject("id", id);
			if (customer == null) {
				log.trace("客户信息不存在！");
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}

			if (attributesId != null) {
				customer.set("attributes_id", attributesId);
			}

			if (StringUtils.isNotBlank(buyerPhone)) {
				customer.set("buyer_phone", buyerPhone);
			}

			if (personInChargeId != null) {
				customer.set("person_in_charge_id", personInChargeId);
			}

			if (StringUtils.isNotBlank(buyer)) {
				customer.set("buyer", buyer);
			}


			if (StringUtils.isNotBlank(customerName)) {
				customer.set("customer_name", customerName);
			}

			if (StringUtils.isNotBlank(address)) {
				customer.set("address", address);
			}

			if (areaId != null) {
				customer.set("area_id", areaId);
			}

			if (areaId != null) {
				customer.set("chain_customer_id", chainCustomerId);
			}

			if (employeeId != null) {
				customer.set("employee_id", employeeId);
			}
			customer.flash();
			writer.print(new SuccessJSON().put("msg", "修改客户成功!"));
			log.trace("修改客户结束");
		} catch (WriteValueException e) {
			log.error("写入数据值异常！", e);
			writer.print(ErrorCode.UPDATE_ERROR);
		} catch (Exception e) {
			log.error("参数异常！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		}
	}

	@Override
	protected void query() {
		DBHelper dbHelper = DBHelperFactory.getDBHelper();
		String employeeId = dataJson.getString("employeeId");// 代表
		String personInChargeId = dataJson.getString("personInChargeId");//主管
		String areaId = dataJson.getString("areaId");
		//停用启用状态
		Integer flag = dataJson.getInteger("flag");
		String name = dataJson.getString("name");
		pageSize = dataJson.getInteger("pageSize");
		pageNumber = dataJson.getInteger("pageNumber");

		String whereLast = " where 1 = 1 ";
		if (flag != null) {
			whereLast += " and flag = " + flag;
		}

		if (StringUtils.isNotBlank(employeeId)) {
			String str2 = employeeId.substring(employeeId.length() - 1);
			if (str2.equals(",")) {
				employeeId = employeeId.substring(0, employeeId.length() - 1);
			}
			whereLast += " and employee_id in (" + employeeId+")";
		}

		if (StringUtils.isNotBlank(areaId)) {
			String str2 = areaId.substring(areaId.length() - 1);
			if (str2.equals(",")) {
				areaId = areaId.substring(0, areaId.length() - 1);
			}
			whereLast += " and area_id in (" + areaId+")";
		}

		if (StringUtils.isNotBlank(personInChargeId)) {
			String str2 = personInChargeId.substring(personInChargeId.length() - 1);
			if (str2.equals(",")) {
				personInChargeId = personInChargeId.substring(0, personInChargeId.length() - 1);
			}
			whereLast += " and person_in_charge_id in (" + personInChargeId+")";
		}


		if (StringUtils.isNotBlank(name)) {
			//whereLast += " and address like " + dbHelper.getString("%" + name + "%");
			whereLast += " and customer_name like " + dbHelper.getString("%" + name + "%");
			//whereLast += " or exists( select 1 from customer_attributes where attributes_name like "
			//dbHelper.getString("%" + name + "%") + "  )";
		}

		try {

			List<Customer> customerList = customerFactory.getObjectsForString(whereLast, employee);
			List<Customer> subList = PageUtil.getPageList(pageNumber, pageSize, customerList);

			List<JSONObject> datas = new ArrayList<>();
			SuccessJSON success = new SuccessJSON();

			for (Customer customer : subList) {
				JSONObject object = new JSONObject();
				object.put("id", customer.get("id"));

				AreaDivision areaDivision = AreaDivisionFactory.getInstance().getObject("id", customer.get("area_id"));
				if (areaDivision != null) {
					object.put("areaName", areaDivision.get("area_name"));
				}

				Employee employee2 = EmployeeFactory.getInstance().getObject("id", customer.get("employee_id"));

				if (employee2 != null) {
					object.put("realName", employee2.get("real_name"));// 负责人
				}
				object.put("customerName", customer.get("customer_name"));
				Integer visits_number = customer.get("visits_number");
				String select = "select COUNT(*) as count from customer_visits t where t.customer_id = "+customer.get("id");
				Integer count = dbHelper.selectOneValues(select);
				object.put("visitsNumber", visits_number.intValue()!=0?visits_number:count);

				Employee employeeTmp = EmployeeFactory.getInstance().getObject("id", customer.get("person_in_charge_id"));
				if (employeeTmp != null) {
					object.put("personInChargeName", employeeTmp.get("real_name"));
				}
				//获取客户属性
				CustomerAttributes customerAttributes = CustomerAttributesFactory.getInstance().getObject("id",
								customer.get("attributes_id"));
				if (customerAttributes != null) {
					object.put("attributesName", customerAttributes.get("attributes_name"));
				}

				object.put("address", customer.get("address"));
				object.put("buyer", customer.get("buyer"));
				object.put("status", customer.get("flag"));
				object.put("buyerPhone", customer.get("buyer_phone"));

				Integer chainCustomerId = customer.get("chain_customer_id");
				if (chainCustomerId != null) {
					ChainCustomer chainCustomer = chainCustomerFactory.getObject("id", chainCustomerId);
					if (chainCustomer != null) {
						object.put("chainCustomerId", chainCustomerId);//连锁客户Id
						object.put("chainCustomerName", chainCustomer.get("china_customer_name"));//连锁客户
					} else {
						object.put("chainCustomerName", "");//连锁客户
					}
				}
				datas.add(object);
			}
			success.put("customerList", datas);
			success.put("count", customerList.size());
			writer.print(success);
		} catch (SQLException e) {
			log.error("sql语句异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	/**
	 * 获得当前客户历史来访记录
	 */
	protected void queryVisitHistory() {
		Integer customerId = dataJson.getInteger("customer_id");
		if (null == customerId) {
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		pageSize = Integer
						.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
		pageNumber = Integer
						.parseInt(StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.customer_id='" + customerId + "' ");
		sql.append(" order by t.visits_time desc ");
		List<Visits> visitses = null;
		JSONArray jsonArray = new JSONArray();
		try {
			visitses = visitsFactory.getObjectsForString(sql.toString(), employee);
			if (null != visitses && visitses.size() > 0) {
				List<Visits> subList = PageUtil.getPageList(pageNumber, pageSize, visitses);
				for (Visits visit : subList) {
					Employee employee = employeeFactory.getObject("id", visit.get("visits_employee_id"));
					JSONObject object = new JSONObject();
					object.put("visitName", employee == null ? "" : employee.get("real_name"));
					object.put("signTime", visit.get("sign_in_time"));
					jsonArray.add(object);
				}
			}
			SuccessJSON success = new SuccessJSON();
			success.put("list", jsonArray);
			success.put("count", visitses == null ? 0 : visitses.size());
			writer.print(success);
			log.trace("返回数据成功！");
		} catch (Exception e) {
			log.error("参数异常", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	@Override
	protected void load() {
		Integer id = dataJson.getInteger("id");

		if (id == null) {
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		Customer customer = customerFactory.getObject("id", id);

		if (customer == null) {
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		JSONObject object = new JSONObject();
		object.put("address", customer.get("address"));
		object.put("location", customer.get("location"));
		object.put("attributes_id", customer.get("attributes_id"));

		CustomerAttributes customerAttributes = CustomerAttributesFactory.getInstance().getObject("id",
						customer.get("attributes_id"));

		if (customerAttributes != null) {
			object.put("attributesName", customerAttributes.get("attributes_name"));
		} else {
			object.put("attributesName", "");
		}
		object.put("visitsNumber", customer.get("visits_number"));
		object.put("buyer", customer.get("buyer"));
		object.put("buyerPhone", customer.get("buyer_phone"));

		Employee personInCharge = EmployeeFactory.getInstance().getObject("id", customer.get("person_in_charge_id"));
		if (employee != null) {
			object.put("personInChargeName", personInCharge == null ? "" : personInCharge.get("real_name"));
			object.put("personInChargeId", personInCharge == null ? "" : personInCharge.get("id"));
		} else {
			object.put("personInChargeName", "");
			object.put("personInChargeId", "");
		}

		object.put("id", customer.get("id"));
		AreaDivision areaDivision = AreaDivisionFactory.getInstance().getObject("id", customer.get("area_id"));

		if (areaDivision != null) {
			object.put("areaId", areaDivision.get("id"));
			object.put("areaName", areaDivision.get("area_name"));
		} else {
			object.put("areaName", "");
			object.put("areaId", "");
		}

		Employee employeeTmp = EmployeeFactory.getInstance().getObject("id", customer.get("employee_id"));
		if (employeeTmp != null) {
			object.put("realName", employeeTmp.get("real_name"));// 负责人
			object.put("employeeId", employeeTmp.get("id"));// 负责人Id
			object.put("customerName", customer.get("customer_name"));
			// 地址
			object.put("address", customer.get("address"));
		} else {
			object.put("employeeId", "");// 负责人Id
			object.put("realName", "");
			object.put("customerName", "");
			// 地址
			object.put("address", "");
		}

		Integer areaManagerId = customer.get("area_manager");
		Integer chainCustomerId = customer.get("chain_customer_id");

		if (areaManagerId != null) {
			Employee areaManager = EmployeeFactory.getInstance().getObject("id", areaManagerId);
			if (areaManager != null) {
				object.put("areaManagerId", areaManagerId);//区域经理ID
				object.put("areaManagerName", areaManager.get("real_name"));//区域经理
			} else {
				object.put("areaManagerId", "");//区域经理ID
				object.put("areaManagerName", "");//区域经理
			}
		}
		if (chainCustomerId != null) {
			ChainCustomer chainCustomer = ChainCustomerFactory.getInstance().getObject("id", chainCustomerId);
			if (chainCustomer != null) {
				object.put("chainCustomerId", chainCustomerId);//连锁客户ID
				object.put("chainCustomerName", chainCustomer.get("china_customer_name"));//连锁客户
			} else {
				object.put("chainCustomerId", "");//连锁客户ID
				object.put("chainCustomerName", "");//连锁客户
			}
		}
		writer.print(new SuccessJSON("customer", object));
	}

	/***
	 * 权限控制（门店客户）停用的门店客户不显示
	 */
	protected void permissionControlLoad() {
		boolean bool = true;
		Integer id = dataJson.getInteger("id");

		if (id == null) {
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		Customer customer = customerFactory.getObject("id", id);
		if (customer == null) {
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		} else {
			Integer flag = customer.get("flag");
			if (flag == null || flag == 0) {
				bool = false;
			}
		}
		//判断是否可用
		if (bool) {
			load();
		} else {
			writer.print(ErrorCode.CUSTOM_FLAG_IS_0);//门店已经停用
		}
	}

	/**
	 * 更新客户坐标
	 */
	protected void updateLocation() {
		//客户Id
		Integer customId;
		//坐标
		String location;
		try {
			customId = dataJson.getInteger("custom_id");
			location = dataJson.getString("location");
		} catch (Exception e) {
			log.error("获取清空参数异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == customId) {
			log.trace("获取客户Id为空！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		Customer customer = customerFactory.getObject("id", customId);
		if (null == customer) {
			log.trace("客户信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		try {
			customer.set("location", location);
			customer.flash();
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.error("更新客户位置信息失败！");
			writer.print(ErrorCode.UPDATE_ERROR);
			return;
		}
	}

	@Override
	protected void add() {
		try {
			String customerName = dataJson.getString("customerName");//客户名称
			Integer areaId = dataJson.getInteger("areaId");//区域ID
			Integer employeeId = dataJson.getInteger("employeeId");
			String address = dataJson.getString("address");//地址
			Integer attributesId = dataJson.getInteger("attributes_id");//门店类型
			String buyer = dataJson.getString("buyer");//采购联系人
			String buyerPhone = dataJson.getString("buyerPhone");//采购联系方式
			Integer personInChargeId = dataJson.getInteger("personInChargeId");//责任主管ID
			Integer chainCustomerId = dataJson.getInteger("chainCustomerId");//南华客户ID
			Integer areaManagerId = dataJson.getInteger("areaManagerId");//区域经理ID
			//根据门店名称查询是否已经有相同名称的门店
			Customer customer = customerFactory.getObject("customer_name", customerName);
			if (null != customer) {
				log.trace("已有同名的门店，不能新增！");
				writer.print(ErrorCode.CUSTOM_NAME_EXIST);
				return;
			}
			customer = customerFactory.getNewObject(employee);
			if (areaManagerId == null || employeeId == null
							|| areaId == null || areaManagerId == null
							|| StringUtils.isEmpty(customerName)
							|| personInChargeId == null || chainCustomerId == null) {
				log.trace("获取新增连锁客户信息失败！");
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}

			customer.set("buyer_phone", buyerPhone);
			customer.set("buyer", buyer);
			customer.set("chain_customer_id", chainCustomerId);
			customer.set("area_manager", areaManagerId);


			customer.set("flag", 1);
			customer.set("customer_name", customerName);
			customer.set("attributes_id", attributesId);
			customer.set("area_id", areaId);
			customer.set("employee_id", employeeId);
			customer.set("address", address);
			customer.set("person_in_charge_id", personInChargeId);
			customer.set("visits_number", 0);
			customer.flash();
			writer.print(new SuccessJSON().put("msg", "新增客户成功!"));
		} catch (WriteValueException e) {
			log.error("写入数据值异常！", e);
			writer.print(ErrorCode.ADD_ERROR);
		} catch (Exception e) {
			log.error("参数异常！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		}
	}

	protected boolean importValidate(Collection<Map> importExcel) {
		String employeeId_title = "负责人姓名";
		String personInChargeId_title = "责任主管姓名";
		String attributesId_title = "属性名称";
		String customerName_title = "门店名称";
		String address_title = "地址";
		String chainCustomerId_title = "连锁客户ID";
		String areaManagerId_title = "区域经理姓名";
		String areaName_title = "区域名称";
		String employeeName, personInChargeName, chainCustomerId, areaManagerName, attributesName;
		String customerName, address, areaName;
		Integer id = null;
		// 数据类型校验
		for (Map map : importExcel) {
			employeeName = (String) map.get(employeeId_title);
			personInChargeName = (String) map.get(personInChargeId_title);
			chainCustomerId = (String) map.get(chainCustomerId_title);
			areaManagerName = (String) map.get(areaManagerId_title);
			attributesName = (String) map.get(attributesId_title);
			areaName = (String) map.get(areaName_title);
			customerName = (String) map.get(customerName_title);
			address = (String) map.get(address_title);

			if (StringUtils.isBlank(customerName)) {
				//非空校验
				if (!vaditeImportNullDate(customerName_title, map)) {
					return false;
				}
				return false;
			} else {
				//字段校验
				Customer customer = CustomerFactory.getInstance().getObject("customer_name", customerName);
				if (customer != null) {//是否存在相同门店名称的门店
					getImportErrorMsg(0, customerName_title, customerName, map, "已经存在相同门店名称的门店！");
					return false;
				}
			}

			if (StringUtils.isBlank(areaName)) {
				//非空校验
				if (!vaditeImportNullDate(areaName_title, map)) {
					return false;
				}
				return false;
			} else {
				//字段校验
				AreaDivision area = AreaDivisionFactory.getInstance().getObject("area_name", areaName);
				if (area == null) {
					getImportErrorMsg(4, areaName_title, areaName, map, null);
					return false;
				}
			}


			if (StringUtils.isBlank(address)) {
				//非空校验
				if (!vaditeImportNullDate(address_title, map)) {
					return false;
				}
				return false;
			}

			if (StringUtils.isBlank(employeeName)) {
				//非空校验
				if (!vaditeImportNullDate(employeeId_title, map)) {
					return false;
				}
				return false;
			} else {
				//字段校验
				Employee emp = EmployeeFactory.getInstance().getObject("real_name", employeeName);
				if (emp == null) {
					getImportErrorMsg(4, employeeId_title, employeeName, map, null);
					return false;
				}

			}


			if (StringUtils.isBlank(personInChargeName)) {
				//非空校验
				if (!vaditeImportNullDate(personInChargeId_title, map)) {
					return false;
				}
				return false;
			} else {
				//字段校验
				Employee emp = EmployeeFactory.getInstance().getObject("real_name", personInChargeName);
				if (emp == null) {
					getImportErrorMsg(4, personInChargeId_title, personInChargeName, map, null);
					return false;
				}

			}


			if (StringUtils.isBlank(chainCustomerId)) {
				//非空校验
				if (!vaditeImportNullDate(chainCustomerId_title, map)) {
					return false;
				}
				return false;
			} else {
				//整数校验
				try {
					id = Integer.valueOf(chainCustomerId);
				} catch (NumberFormatException e) {
					getImportErrorMsg(1, chainCustomerId_title, chainCustomerId, map, null);
					return false;
				}


				//id校验
				ChainCustomer chainCustomer = ChainCustomerFactory.getInstance().getObject("id", id);
				if (chainCustomer == null) {
					getImportErrorMsg(4, chainCustomerId_title, chainCustomerId, map, null);
					return false;
				}

			}


			if (StringUtils.isBlank(areaManagerName)) {
				//非空校验
				if (!vaditeImportNullDate(areaManagerId_title, map)) {
					return false;
				}
				return false;
			} else {
				//字段校验
				Employee emp = EmployeeFactory.getInstance().getObject("real_name", areaManagerName);
				if (emp == null) {
					getImportErrorMsg(4, areaManagerId_title, areaManagerName, map, null);
					return false;
				}
			}
		}

		return true;
	}

	@Override
	protected void fileImport(HttpServletRequest request) {
		boolean result = false;
		try {
			Collection<Map> importExcel = getImportDataMap(request);

			if (importExcel == null) {
				return;
			}

			if (!importValidate(importExcel)) {
				return;
			}

			String areaName_title = "区域名称";
			String employeeId_title = "负责人姓名";
			String personInChargeId_title = "责任主管姓名";
			String customerName_title = "门店名称";
			String address_title = "地址";
			String buyer_title = "采购联系人";
			String buyerPhone_title = "采购联系方式";
			String chainCustomerId_title = "连锁客户ID";
			String areaManagerId_title = "区域经理姓名";
			String employeeName, personInChargeName, chainCustomerId, areaManagerName;
			String customerName, address, buyer, buyerPhone, areaName;


			for (Map map : importExcel) {
				employeeName = map.get(employeeId_title).toString();
				personInChargeName = map.get(personInChargeId_title).toString();
				chainCustomerId = (String) map.get(chainCustomerId_title);
				areaManagerName = map.get(areaManagerId_title).toString();
				customerName = (String) map.get(customerName_title);
				address = map.get(address_title).toString();
				buyer = (String) map.get(buyer_title);
				buyerPhone = (String) map.get(buyerPhone_title);
				areaName = (String) map.get(areaName_title);


				Customer customer = customerFactory.getNewObject(employee);
				Employee personInCharge = EmployeeFactory.getInstance().getObject("real_name", personInChargeName);
				Employee emp = EmployeeFactory.getInstance().getObject("real_name", employeeName);
				Employee area_manager = EmployeeFactory.getInstance().getObject("real_name", areaManagerName);
				AreaDivision area = AreaDivisionFactory.getInstance().getObject("area_name", areaName);
				customer.set("buyer_phone", buyerPhone);
				customer.set("buyer", buyer);
				customer.set("chain_customer_id", Integer.valueOf(chainCustomerId));
				customer.set("attributes_id", 5);
				customer.set("person_in_charge_id", personInCharge.get("id"));
				customer.set("customer_name", customerName);
				customer.set("employee_id", emp.get("id"));
				customer.set("address", address);
				customer.set("area_manager", area_manager.get("id"));
				customer.set("visits_number", 0);

				result = customer.flash();
			}

			if (result) {
				writer.print(new SuccessJSON("msg", "导入客户列表成功！"));
			} else {
				writer.print(ErrorCode.IMPORT_FILE_FAIL);
			}

		} catch (Exception e) {
			log.error("文件导入失败", e);
			writer.print(ErrorCode.IMPORT_FILE_FAIL);
		}

	}

	@Override
	protected void fileUpload(HttpServletRequest request, HttpServletResponse response) {
		List<Customer> customerList = null;
		customerList = customerFactory.getAllObjects(employee);
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		for (Customer customer : customerList) {
			Map<String, Object> map = new LinkedHashMap<String, Object>();
			map.put("编号", customer.get("id"));
			AreaDivision areaDivision = AreaDivisionFactory.getInstance().getObject("id", customer.get("area_id"));
			if (areaDivision != null) {
				map.put("区域名称", areaDivision.get("area_name"));
			} else {
				map.put("区域名称", "");
			}

			Employee employee2 = EmployeeFactory.getInstance().getObject("id", customer.get("employee_id"));
			if (employee2 != null) {
				map.put("代表", employee2.get("real_name"));
			} else {
				map.put("代表", "");
			}
			map.put("单位名称", customer.get("customer_name"));
			map.put("拜访次数", customer.get("visits_number"));
			map.put("地址", customer.get("address"));

			Employee employee = EmployeeFactory.getInstance().getObject("id", customer.get("person_in_charge_id"));
			if (employee != null) {
				map.put("主管", employee.get("real_name"));
			} else {
				map.put("主管", "");
			}

			map.put("采购联系人", customer.get("buyer"));
			map.put("采购联系方式", customer.get("buyer_phone"));

			list.add(map);
		}

		if (list.size() > 0) {
			exportListData(list);
		} else {
			log.trace("暂无数据！");
			writer.print(new SuccessJSON("msg", "暂无数据！"));
		}

	}

}
