package com.tk.servlet;


import java.util.List;

import javax.servlet.annotation.WebServlet;

import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.PageUtil;
import com.tk.object.*;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

/***
 * 连锁门店列表查询
 * @author Administrator
 *
 */
@WebServlet("/chainCustomer.do")
public class ChainCustomerServlet extends BaseServlet {

	protected static Logger log = LogManager.getLogger(ChainCustomerServlet.class.getName());
	//连锁门店工厂类
	private static ChainCustomerFactory chainCustomerFactory = ChainCustomerFactory.getInstance();
	//区域工厂类
	private static AreaDivisionFactory areaDivisionFactory = AreaDivisionFactory.getInstance();
	//员工工厂类
	private static EmployeeFactory employeeFactory = EmployeeFactory.getInstance();
	//数据库连接
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();
	private Integer pageSize;
	private Integer pageNumber;

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.query, PermissionEnum.CHAIN_CUSTOM_QUERY);
		handlePermission.put(ControlType.add, PermissionEnum.CHAIN_CUSTOM_ADD);
		handlePermission.put(ControlType.load, PermissionEnum.CHAIN_CUSTOM_QUERY);
		handlePermission.put(ControlType.update, PermissionEnum.CHAIN_CUSTOM_UPDATE);
		handlePermission.put(ControlType.updateLocation, PermissionEnum.CHAIN_CUSTOM_UPDATE);
		handlePermission.put(ControlType.disable, PermissionEnum.CHAIN_CUSTOM_DISABLE);
	}

	@Override
	protected boolean handleChilder() {
		switch (controlType) {
			case disable:
				if (employee.hasPermission(handlePermission.get(ControlType.disable))) {
					disable();
					return true;
				} else {
					return false;
				}
			case updateLocation:
				if (employee.hasPermission(handlePermission.get(ControlType.updateLocation))) {
					updateLocation();
					return true;
				} else {
					return false;
				}
			case getCustomerInfo://微信查询商业客户
				permissionControlLoad();
				return true;
			default:
				return false;
		}
	}

	@Override
	protected void queryAll() {
		log.trace("获取所有连锁客户初始...");
		List<ChainCustomer> list;
		try {
			//只查连锁和正常状态的
			//String sql = " where custom_type = 1 and flag = 1  ";
			list = chainCustomerFactory.getAllObjects(null);
			JSONArray array = new JSONArray();
			for (ChainCustomer customer : list) {
				JSONObject object = new JSONObject();
				object.put("id", customer.get("id"));
				object.put("name", customer.get("china_customer_name"));
				object.put("flag", customer.get("flag"));
				object.put("area_id", customer.get("area_id"));
				array.add(object);
			}
			log.trace("获取所有连锁客户结束...");
			writer.print(new SuccessJSON("list", array));
		} catch (Exception e) {
			log.error("获取所有连锁客户发生异常:{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	@Override
	protected void delete() {
		// TODO Auto-generated method stub

	}

	/**
	 * 停用连锁客户
	 */
	protected void disable() {
		log.trace("停用或启用连锁客户信息初始....");
		//商业客户Id
		Integer chainId;
		//停用启用标识（1：启用，0：停用）
		Integer flag;
		try {
			chainId = dataJson.getInteger("chain_id");
			flag = dataJson.getInteger("flag");
		} catch (Exception e) {
			log.error("获取连锁客户Id异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (chainId == null || flag == null) {
			log.trace("获取连锁客户Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		ChainCustomer customer = chainCustomerFactory.getObject("id", chainId);
		if (null == customer) {
			log.trace("连锁客户信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		try {
			customer.set("flag", flag);
			customer.flash();
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.error("停用或启用连锁客户发生异常：{}！", e);
			writer.print(ErrorCode.UPDATE_ERROR);
		}
	}

	/**
	 * 更新客户坐标
	 */
	protected void updateLocation() {
		//客户Id
		Integer chainCustomId;
		//坐标
		String location;
		try {
			chainCustomId = dataJson.getInteger("chainCustom_id");
			location = dataJson.getString("location");
		} catch (Exception e) {
			log.error("获取清空参数异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == chainCustomId) {
			log.trace("获取客户Id为空！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		ChainCustomer customer = chainCustomerFactory.getObject("id", chainCustomId);
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
	protected void update() {
		log.trace("修改连锁客户信息初始....");
		Integer chainId;
		String chainName;
		Integer areaId;
		Integer customType;
		//联系人
		String buyer;
		//联系电话
		String buyerPhone;
		//代表
		Integer employeeId;
		try {
			chainId = dataJson.getInteger("chain_id");
			chainName = dataJson.getString("chain_name");
			areaId = dataJson.getInteger("area_id");
			employeeId = dataJson.getInteger("employee_id");
			customType = dataJson.getInteger("custom_type");
			buyer = dataJson.getString("buyer");
			buyerPhone = dataJson.getString("buyer_phone");
		} catch (Exception e) {
			log.error("获取修改信息异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (chainId == null) {
			log.trace("获取修改信息失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		ChainCustomer customer = chainCustomerFactory.getObject("id", chainId);
		if (null == customer) {
			log.trace("连锁客户信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		try {
			if (null != areaId) {
				customer.set("area_id", areaId);
			}
			if (null != employeeId) {
				customer.set("employee_id", employeeId);
			}
			if (null != customType) {
				customer.set("custom_type", customType);
			}
			if (null != chainName) {
				customer.set("china_customer_name", chainName);
			}
			if (null != buyer) {
				customer.set("buyer", buyer);
			}
			if (null != buyerPhone) {
				customer.set("buyer_phone", buyerPhone);
			}
			customer.flash();
			log.trace("修改连锁客户结束...");
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.error("修改连锁客户发生异常：{}！", e);
			writer.print(ErrorCode.ADD_ERROR);
		}
	}

	/***
	 * 查询按地区ID连锁客户
	 */
	@Override
	protected void query() {
		log.trace("查询连锁客户列表初始...");
		//地区
		String area_id;
		//负责代表
		String employee_id;
		//连锁门店名
		String chainCustomName;
		//客户类型
		Integer customType;
		//使用状态
		Integer flag;
		try {
			area_id = dataJson.getString("area_id");
			flag = dataJson.getInteger("flag");
			employee_id = dataJson.getString("employee_id");
			customType = dataJson.getInteger("custom_type");
			chainCustomName = dataJson.getString("chainCustomName");
		} catch (Exception e) {
			log.error("获取查询参数异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		pageSize = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
		pageNumber = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));

		List<ChainCustomer> list;
		StringBuilder sql = new StringBuilder();
		sql.append(" where 1=1 ");
		if (StringUtils.isNotBlank(area_id) && !StringUtils.equals("0", area_id)) {
			String str2 = area_id.substring(area_id.length() - 1);
			if (str2.equals(",")) {
				area_id = area_id.substring(0, area_id.length() - 1);
			}
			sql.append(" and area_id in (").append(area_id).append(")");
		}
		if (StringUtils.isNotBlank(employee_id)) {
			String str2 = employee_id.substring(employee_id.length() - 1);
			if (str2.equals(",")) {
				employee_id = employee_id.substring(0, employee_id.length() - 1);
			}
			sql.append(" and employee_id in ( ").append(employee_id).append(")");
		}
		if (null != customType) {
			sql.append(" and custom_type = " + customType);
		}
		if (null != flag) {
			sql.append(" and flag = " + flag);
		}
		if (StringUtils.isNotEmpty(chainCustomName)) {
			sql.append(" and china_customer_name like " + dbHelper.getString("%" + chainCustomName + "%"));
		}
		JSONArray array = new JSONArray();
		try {
			list = chainCustomerFactory.getObjectsForString(sql.toString(), employee);
			if (null != list && list.size() > 0) {
				List<ChainCustomer> subList = PageUtil.getPageList(pageNumber, pageSize, list);
				for (ChainCustomer customer : subList) {
					AreaDivision area = areaDivisionFactory.getObject("id", customer.get("area_id"));
					Employee employeeTmp = employeeFactory.getObject("id", customer.get("employee_id"));
					JSONObject object = new JSONObject();
					Integer custom_type = customer.get("custom_type");
					object.put("id", customer.get("id"));
					object.put("name", customer.get("china_customer_name"));
					object.put("status", customer.get("flag"));
					object.put("custom_type", null == custom_type ? "" : (custom_type == 1 ? "连锁" : "批发"));
					object.put("area_id", customer.get("area_id"));
					object.put("employee_id", customer.get("employee_id"));
					object.put("employeeName", employeeTmp == null ? "" : employeeTmp.get("real_name"));
					//区域名
					object.put("areaName", area == null ? "" : area.get("area_name"));
					array.add(object);
				}
			}
			SuccessJSON success = new SuccessJSON();
			success.put("list", array);
			success.put("count", null == list ? 0 : list.size());
			log.trace("查询连锁客户列表结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("查询连锁客户信列表发生异常:{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}

	}

	/***
	 * 权限控制（门店客户）停用的门店客户不显示
	 */
	protected void permissionControlLoad() {
		boolean bool = true;
		Integer id = dataJson.getInteger("chain_id");
		if (id == null) {
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		ChainCustomer customer = chainCustomerFactory.getObject("id", id);
		if (customer == null) {
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		} else {
			Integer flag = customer.get("flag");
			if (flag == 0) {
				bool = false;
			}
		}
		//判断是否已停用
		if (bool) {
			load();
		} else {
			writer.print(ErrorCode.CUSTOM_FLAG_IS_0);//门店已经停用
		}
	}

	@Override
	protected void load() {
		log.trace("查询连锁客户信息初始...");
		Integer chainId;
		try {
			chainId = dataJson.getInteger("chain_id");
		} catch (Exception e) {
			log.error("获取连锁客户Id异常：{}", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (chainId == null) {
			log.trace("获取连锁客户Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		ChainCustomer customer = chainCustomerFactory.getObject("id", chainId);
		if (null == customer) {
			log.trace("连锁客户信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		JSONObject object = new JSONObject();
		AreaDivision area = areaDivisionFactory.getObject("id", customer.get("area_id"));
		Employee employeeTmp = employeeFactory.getObject("id", customer.get("employee_id"));
		object.put("chain_id", customer.get("id"));
		object.put("area_id", customer.get("area_id"));
		object.put("address", customer.get("address"));
		object.put("location", customer.get("location"));
		object.put("buyer", customer.get("buyer"));
		object.put("buyer_phone", customer.get("buyer_phone"));
		object.put("address", customer.get("address"));
		object.put("employee_id", customer.get("employee_id"));
		object.put("custom_type", customer.get("custom_type"));
		object.put("employeeName", employeeTmp == null ? "" : employeeTmp.get("real_name"));
		object.put("areaName", area == null ? "" : area.get("area_name"));
		object.put("china_customer_name", customer.get("china_customer_name"));
		SuccessJSON success = new SuccessJSON();
		success.put("info", object);
		log.trace("查询连锁客户信息结束...");
		writer.print(success);
	}

	@Override
	protected void add() {
		log.trace("新增连锁客户初始...");
		Integer chainId;
		String chainName;
		Integer areaId;
		Integer employeeId;
		Integer customType;
		try {
			chainId = dataJson.getInteger("chain_id");
			chainName = dataJson.getString("chain_name");
			areaId = dataJson.getInteger("area_id");
			employeeId = dataJson.getInteger("employee_id");
			//连锁客户类型
			customType = dataJson.getInteger("custom_type");
		} catch (Exception e) {
			log.error("获取新增信息异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (chainId == null || null == areaId || null == employeeId || null == customType || StringUtils.isEmpty(chainName)) {
			log.trace("获取新增信息失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		try {
			ChainCustomer customer = chainCustomerFactory.getObject("id", chainId);
			if (null != customer) {
				log.trace("已存在重复的英克系统ID！");
				writer.print(ErrorCode.CHAIN_CUSTON_EXIST);
				return;
			}
			customer = chainCustomerFactory.getNewObject(employee);
			customer.set("id", chainId);
			customer.set("area_id", areaId);
			customer.set("employee_id", employeeId);
			customer.set("custom_type", customType);
			customer.set("china_customer_name", chainName);
			customer.set("flag", 1);
			customer.flash();
			log.trace("新增连锁客户结束...");
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.error("新增连锁客户发生异常:{}！", e);
			writer.print(ErrorCode.ADD_ERROR);
		}
	}
}
