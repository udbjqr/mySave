package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.PermissionEnum;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.DateUtil;
import com.tk.common.util.PageUtil;
import com.tk.object.*;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.annotation.WebServlet;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;

/**
 * 角色管理操作.
 */
@WebServlet("/roleGroup.do")
public class RoleGroupServlet extends BaseServlet {
	private static Logger log = LogManager.getLogger(RoleGroupServlet.class.getName());
	// 获取到供应商工厂类
	private static SupplierFactory supplierFactory = SupplierFactory.getInstance();
	// 获取到区域工厂类
	private static AreaDivisionFactory areaDivisionFactory = AreaDivisionFactory.getInstance();
	// 获取到连锁客户工厂类
	private static CustomerAttributesFactory customerAttributesFactory = CustomerAttributesFactory.getInstance();
	// 获取到角色工厂类
	private static RoleGroupFactory roleGroupFactory = RoleGroupFactory.getInstance();
	//角色记录权限工厂类
	private static GroupRecordPermissionFactory groupRecordPermissionFactory = GroupRecordPermissionFactory.getInstance();
	//获得查询工厂类
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();
	private Integer pageSize;
	private Integer pageNumber;

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.add, PermissionEnum.ROLE_ADD);
		handlePermission.put(ControlType.update, PermissionEnum.ROLE_UPDATE);
		handlePermission.put(ControlType.load, PermissionEnum.ROLE_QUERY);
		handlePermission.put(ControlType.query, PermissionEnum.ROLE_QUERY);
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
	}

	@Override
	protected boolean handleChilder() {
		return false;
	}

	@Override
	protected void queryAll() {
		log.trace("获取所有角色组初始...");
		List<RoleGroup> groupList = null;
		JSONArray jsonArray = new JSONArray();
		try {
			groupList = roleGroupFactory.getAllObjects(null);
			if (null != groupList && groupList.size() > 0) {
				for (RoleGroup role : groupList) {
					JSONObject object = new JSONObject();
					object.put("id", role.get("id"));
					object.put("name", role.get("group_name"));
					jsonArray.add(object);
				}
			}
			SuccessJSON success = new SuccessJSON();
			success.put("list", jsonArray);
			log.trace("获取所有角色组结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("获取所有角色组发生异常:{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	@Override
	protected void delete() {

	}

	@Override
	protected void update() {
		log.trace("修改角色组信息初始...");
		String updateType = null;
		try {
			updateType = dataJson.getString("updateType");
		} catch (Exception e) {
			log.error("获取修改类型异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		}
		if (StringUtils.isEmpty(updateType)) {
			log.trace("获取修改类型失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		ErrorCode errorCode;
		try {
			if ("role".equals(updateType)) {
				errorCode = updateRoleInfo();
			} else if ("function".equals(updateType)) {
				errorCode = updateFunctionInfo();
			} else if ("data".equals(updateType)) {
				errorCode = updateDataInfo();
			} else {
				log.trace("未知的修改类型！");
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}
			if (null != errorCode) {
				log.error("修改角色组信息失败！");
				writer.print(errorCode);
			}
			log.trace("修改角色组信息结束...");
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.error("修改角色组信息发生异常：{}！", e);
			writer.print(ErrorCode.UPDATE_ERROR);
		}
	}

	@Override
	protected void query() {
		log.trace("查询角色组列表初始...");
		String starTime;
		String endTime;
		String roleName;
		try {
			starTime = dataJson.getString("startDate");
			endTime = dataJson.getString("endDate");
			roleName = dataJson.getString("roleName");
		} catch (Exception e) {
			log.error("获取查询参数异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		pageSize = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
		pageNumber = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));
		//根据条件查询角色组信息
		StringBuilder sql = new StringBuilder();
		sql.append(" WHERE 1=1 ");
		if (StringUtils.isNotEmpty(starTime)) {
			sql.append(" and t.create_time>='" + starTime + "'");
		}
		if (StringUtils.isNotEmpty(endTime)) {
			sql.append(" and t.create_time<='" + endTime + "'");
		}
		if (StringUtils.isNotEmpty(roleName)) {
			sql.append(" and t.group_name like " + dbHelper.getString("%" + roleName + "%"));
		}
		List<RoleGroup> roleList;
		JSONArray jsonArray = new JSONArray();
		try {
			//获得所有的数据
			roleList = roleGroupFactory.getObjectsForString(sql.toString(), employee);
			if (null != roleList && roleList.size() > 0) {
				List<RoleGroup> subList = PageUtil.getPageList(pageNumber, pageSize, roleList);
				for (RoleGroup role : subList) {
					JSONObject object = new JSONObject();
					object.put("id", role.get("id"));
					object.put("group_name", role.get("group_name"));
					object.put("remark", role.get("remark"));
					object.put("create_time", DateUtil.formatDate(role.get("create_time"), Constant.DATEFORMAT));
					jsonArray.add(object);
				}
			}
			SuccessJSON success = new SuccessJSON();
			success.put("list", jsonArray);
			success.put("count", roleList == null ? 0 : roleList.size());
			log.trace("查询角色组列表信息结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("查询角色组列表发生异常:{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	@Override
	protected void load() {
		log.trace("查询角色组信息初始...");
		String loadType;
		try {
			loadType = dataJson.getString("loadType");
		} catch (Exception e) {
			log.error("获取查询类型异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (StringUtils.isEmpty(loadType)) {
			log.trace("获取查询类型失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		JSONObject object;
		try {
			if ("role".equals(loadType)) {
				object = loadRoleInfo();
			} else if ("function".equals(loadType)) {
				object = loadFunctionInfo();
			} else if ("data".equals(loadType)) {
				object = loadDataInfo();
			} else {
				log.trace("未知的查询类型{}！", loadType);
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}
			if (null == object) {
				log.trace("角色组信息不存在！");
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}
			Object errorCode = object.get("success");
			// 判断是否出现异常码
			if (null != errorCode && !"".equals(errorCode)) {
				log.trace("查询角色组信息失败！");
				writer.print(errorCode);
				return;
			}
			SuccessJSON success = new SuccessJSON();
			success.put("info", object);
			log.trace("查询角色组信息结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("查询角色组信息发生异常：{}！", e);
			writer.print(ErrorCode.LOAD_ERROR);
		}
	}

	/**
	 * @return 返回功能权限信息
	 */
	private JSONObject loadFunctionInfo() {
		//查询角色数据
		JSONObject object = getRoleInfo();
		if (null == object) {
			object = new JSONObject();
			object.put("success", ErrorCode.OBJECT_NOT_EXIST);
			return object;
		}
		//判断获取角色信息有没有产生错误
		ErrorCode errorCode = (ErrorCode) object.get("success");
		if (null != errorCode) {
			return object;
		}
		object.put("success", null);
		RoleGroup role = (RoleGroup) object.get("role");
		//查询到所拥有的权限
		//例如这种格式（“1：1；2：1；3：3；4：4；5：1”）
		String permissionStr = role.get("permission_string");
		if (StringUtils.isEmpty(permissionStr)) {
			object.put("permission", "");
			return object;
		}
		//传给前端数据
		StringBuilder permissionBuild = new StringBuilder();
		//切割成不同的权限
		//例如这种格式（“[1:1,2:1,3:1,4:1,5:1]”）
		String[] permiArry = permissionStr.split(",");
		for (int i = 0; i < permiArry.length; i++) {
			String signPerm = permiArry[i];
			//获得单个权限
			String permission = signPerm.split(":")[0];
			if (i < permiArry.length - 1) {
				permissionBuild.append(permission + ",");
			} else {
				permissionBuild.append(permission);
			}
		}
		object.put("permission", permissionBuild);
		return object;
	}

	/**
	 * @return 返回角色权限信息
	 */
	private JSONObject loadRoleInfo() {
		//查询角色数据
		JSONObject object = getRoleInfo();
		if (null == object) {
			object = new JSONObject();
			object.put("success", ErrorCode.OBJECT_NOT_EXIST);
			return object;
		}
		//判断获取角色信息有没有产生错误
		ErrorCode errorCode = (ErrorCode) object.get("success");
		if (null != errorCode) {
			return object;
		}
		RoleGroup role = (RoleGroup) object.get("role");
		object.put("success", null);
		object.put("role_id", role.get("id"));
		object.put("group_name", role.get("group_name"));
		object.put("remark", role.get("remark"));
		return object;
	}

	/**
	 * @return 返回数据权限信息
	 */
	private JSONObject loadDataInfo() {
		//查询角色数据
		JSONObject object = getRoleInfo();
		if (null == object) {
			object = new JSONObject();
			object.put("success", ErrorCode.OBJECT_NOT_EXIST);
			return object;
		}
		//判断获取角色信息有没有产生错误
		ErrorCode errorCode = (ErrorCode) object.get("success");
		if (null != errorCode) {
			return object;
		}
		RoleGroup role = (RoleGroup) object.get("role");
		Integer roleId = role.get("id");

		//获得所有角色权限记录
		String sql = " where t.group_id =" + roleId;

		List<GroupRecordPermission> recordList = null;
		//拼凑权限
		StringBuilder premissionStr = new StringBuilder();
		try {
			recordList = groupRecordPermissionFactory.getObjectsForString(sql, employee);
			//查询所拥有的数据权限
			if (null != recordList && recordList.size() > 0) {
				for (int i = 0; i < recordList.size(); i++) {
					//判断是哪张表的字段，用表名当作key
					String recordType = recordList.get(i).get("record_type");
					Integer value = recordList.get(i).get("value");
					if (i < recordList.size()) {
						premissionStr.append(recordType + ":" + value + ",");
					} else {
						premissionStr.append(recordType + ":" + value);
					}
				}
			}

			//拼凑数据，返回给前台
			JSONObject dataPremission = queryDataPremissionJson();
			if (dataPremission != null) {
				dataPremission.put("premissionStr", premissionStr);
			}
			return dataPremission;
		} catch (Exception e) {
			object.put("success", ErrorCode.GET_LIST_INFO_ERROR);
			return object;
		}
	}

	/**
	 * 获得数据权限Json
	 *
	 * @return
	 * @throws Exception
	 */
	private JSONObject queryDataPremissionJson() throws Exception {
		/**
		 * -产品
		 *   --供应商
		 *     ---拜耳
		 *     ---邦迪
		 *   --价格
		 *     ---成本
		 *     ---销售
		 *     ---批发价
		 *   --产品
		 *     ---考核产品
		 *     ---非考核产品
		 * -客户管理
		 *   --连锁客户
		 *     ---黄庆仁
		 *     ---CRSKA
		 *   --区域
		 *     ---南昌
		 *     ---九江
		 *     ---宜春
		 * -考核管理
		 *   --进货
		 *   --来源
		 *   --批次
		 */
		//所有的都由这个包裹
		JSONObject dataObject = new JSONObject();
		dataObject.put("key", "1");

		//最外层Arry
		JSONArray dataArray = new JSONArray();

		//获得到勾选的数据权限
		/**{**/
		//供应商权限
//		Set<Integer> suppSet = preMap.get("supplier");
		//价格权限
//		Set<Integer> priceSet = preMap.get("sale_detail");
		//产品权限
//		Set<Integer> pudctSet = preMap.get("goods");
		//连锁客户权限
//		Set<Integer> customSet = preMap.get("customer_attributes");
		//区域权限
//		Set<Integer> areaSet = preMap.get("area_division");
		//考核管理权限
//		Set<Integer> appriSet = preMap.get("customer_visits_detail");

		/**}**/
		//产品管理
		JSONArray prudctData = new JSONArray();
		//先拼凑产品管理JsonArry
		/**------------------{------------**/
		/*供应商*/
		JSONObject suppObject = getSupplierList();

		/*价格*/
		JSONObject priceObject = getPriceList();

		/*考核类型*/
		JSONObject appriObject = getAppriList();

		//添加进产品
		prudctData.add(suppObject);
		prudctData.add(priceObject);
		prudctData.add(appriObject);

		JSONObject prudct = new JSONObject();
		prudct.put("key", "2");
		prudct.put("name", "产品");
		prudct.put("items", prudctData);
		/**------------------}------------**/
		//客户管理
		JSONArray customData = new JSONArray();
		/**------------------{------------**/
		/*连锁客户*/
		JSONObject customObject = getCustomAttrList();

		/*区域*/
//		JSONObject areaObject = getAreaList(areaSet);


		customData.add(customObject);
//		customData.add(areaObject);

		JSONObject custom = new JSONObject();
		custom.put("key", "3");
		custom.put("name", "客户管理");
		custom.put("items", customData);
		/**------------------}------------**/

		//考核管理
//		JSONArray appriData = new JSONArray();
		/**------------------{------------**/


		/**------------------}------------**/

		dataArray.add(prudct);
		dataArray.add(custom);
		dataObject.put("items", dataArray);
		return dataObject;
	}

	/**
	 * 区域列表，并根据数据权限选中
	 *
	 * @param set
	 * @return
	 */
	private JSONObject getAreaList(Set<Integer> set) {
		/**
		 * --区域
		 *   --南昌
		 *   --九江
		 *   --宜春
		 */
		JSONObject returnObject = new JSONObject();
		returnObject.put("key", "4");
		returnObject.put("name", "区域");

		List<AreaDivision> list = areaDivisionFactory.getAllObjects(null);
		JSONArray areaArry = new JSONArray();
		for (AreaDivision area : list) {
			JSONObject object = new JSONObject();
			object.put("value", "area_division:" + area.get("id"));
			object.put("name", area.get("area_name"));
			//判断是否有这权限
			if (null != set) {
				if (set.contains(area.get("id"))) {
					object.put("check", true);
				}
			}
			areaArry.add(object);
		}
		returnObject.put("items", areaArry);
		return returnObject;
	}

	/**
	 * 供应商列表，并根据数据权限选中
	 *
	 * @return
	 */
	private JSONObject getSupplierList() {
		/**
		 * --供应商
		 *    --拜耳
		 *    --邦迪
		 *    --舒邦
		 */
		JSONObject returnObject = new JSONObject();
		returnObject.put("key", "5");
		returnObject.put("name", "供应商");

		List<Supplier> list = supplierFactory.getAllObjects(null);
		JSONArray suppArry = new JSONArray();
		for (Supplier supplier : list) {
			JSONObject object = new JSONObject();
			object.put("value", "supplier:" + supplier.get("id"));
			object.put("name", supplier.get("supplier_name"));
			suppArry.add(object);
		}
		returnObject.put("items", suppArry);
		return returnObject;
	}

	/**
	 * 价格列表，并根据数据权限选中
	 *
	 * @return
	 */
	private JSONObject getPriceList() {
		/**
		 * --价格
		 *    --成本1
		 *    --成本2
		 *    --成本3
		 *    --销售价
		 *    --批发价
		 */
		JSONObject returnObject = new JSONObject();
		returnObject.put("key", "6");
		returnObject.put("name", "价格");

		JSONArray priceArry = new JSONArray();
		JSONObject price1 = new JSONObject();
		price1.put("value", "sale_detail:" + 1);
		price1.put("name", "成本1");
		JSONObject price2 = new JSONObject();
		price2.put("value", "sale_detail:" + 2);
		price2.put("name", "成本2");
		JSONObject price3 = new JSONObject();
		price3.put("value", "sale_detail:" + 3);
		price3.put("name", "成本3");
		JSONObject sail = new JSONObject();
		sail.put("value", "sale_detail:" + 4);
		sail.put("name", "销售价");
//		JSONObject whole = new JSONObject();
//		whole.put("value", "sale_detail:" + 5);
//		whole.put("name", "批发价");
		priceArry.add(price1);
		priceArry.add(price2);
		priceArry.add(price3);
		priceArry.add(sail);
//		priceArry.add(whole);

		returnObject.put("items", priceArry);
		return returnObject;
	}

	/**
	 * 考核类型，并根据数据权限选中
	 *
	 * @return
	 */
	private JSONObject getAppriList() {
		/**
		 * --产品
		 *    --考核产品
		 *    --非考核产品
		 */
		JSONObject returnObject = new JSONObject();
		returnObject.put("key", "7");
		returnObject.put("name", "产品");
		//子数组
		JSONArray appriArry = new JSONArray();
		JSONObject appri1 = new JSONObject();
		appri1.put("value", "goods:" + 0);
		appri1.put("name", "非考核产品");
		JSONObject appri2 = new JSONObject();
		appri2.put("value", "goods:" + 1);
		appri2.put("name", "考核产品");
		appriArry.add(appri1);
		appriArry.add(appri2);
		returnObject.put("items", appriArry);
		return returnObject;
	}

	/**
	 * 连锁客户，并根据数据权限选中
	 *
	 * @return
	 */
	private JSONObject getCustomAttrList() {
		/**
		 * --连锁客户
		 *    --黄庆仁
		 *    --CRSKA
		 *    --CSHQ_Others
		 *    --CHSQ
		 */
		JSONObject returnObject = new JSONObject();
		returnObject.put("key", "8");
		returnObject.put("name", "连锁客户");

		List<CustomerAttributes> list = null;
		try {
			list = customerAttributesFactory.getObjectsForString(" where flag != 1 ", null);
		} catch (SQLException e) {
			log.error("查询连锁客户发生异常：{}！", e);
		}
		if (null == list || list.size() == 0) {
			returnObject.put("items", "");
			return returnObject;
		}
		JSONArray suppArry = new JSONArray();
		for (CustomerAttributes customer : list) {
			JSONObject object = new JSONObject();
			object.put("value", "customer_attributes:" + customer.get("id"));
			object.put("name", customer.get("attributes_name"));
			suppArry.add(object);
		}
		returnObject.put("items", suppArry);
		return returnObject;
	}


	@Override
	protected void add() {
		log.trace("新增角色组初始...");
		String groupName;
		String remark;
		try {
			groupName = dataJson.getString("group_name");
			remark = dataJson.getString("remark");
		} catch (Exception e) {
			log.error("获取新增数据异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (StringUtils.isEmpty(groupName)) {
			log.trace("获取新增信息失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//新增角色信息
		try {
			RoleGroup role = roleGroupFactory.getNewObject(employee);
			role.set("group_name", groupName);
			role.set("remark", remark);
			role.set("create_time", new Date());
			role.flash();
			SuccessJSON success = new SuccessJSON();
			success.put("role_id", role.getToString("id"));
			log.trace("新增角色组结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("新增角色组发生异常：{}！", e);
			writer.print(ErrorCode.ADD_ERROR);
		}
	}

	/**
	 * 修改角色信息
	 *
	 * @return
	 */
	private ErrorCode updateRoleInfo() throws Exception {
		Integer roleId = dataJson.getInteger("role_id");
		String groupName = dataJson.getString("group_name");
		String remark = dataJson.getString("remark");
		if (null == roleId || StringUtils.isEmpty(groupName)) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}
		// 返回结果
		JSONObject object = getRoleInfo();
		if (null == object) {
			return ErrorCode.OBJECT_NOT_EXIST;
		}
		ErrorCode errorCode = (ErrorCode) object.get("success");
		if (null != errorCode) {
			return errorCode;
		}
		RoleGroup roleGroup = (RoleGroup) object.get("role");
		roleGroup.set("group_name", groupName);
		roleGroup.set("remark", remark);
		roleGroup.flash();
		return null;
	}

	/**
	 * 修改功能权限信息
	 *
	 * @return
	 */
	private ErrorCode updateFunctionInfo() throws Exception {
		Integer roleId = dataJson.getInteger("role_id");
		//前台拼接的权限
		String permission = dataJson.getString("permission");
		if (null == roleId) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}
		// 返回结果
		JSONObject object = getRoleInfo();
		if (null == object) {
			return ErrorCode.OBJECT_NOT_EXIST;
		}
		ErrorCode errorCode = (ErrorCode) object.get("success");
		if (null != errorCode) {
			return errorCode;
		}
		RoleGroup roleGroup = (RoleGroup) object.get("role");
		roleGroup.set("permission_string", permission);
		roleGroup.flash();
		return null;
	}

	/**
	 * 修改数据权限信息
	 *
	 * @return
	 */
	private ErrorCode updateDataInfo() throws Exception {
		Integer roleId = dataJson.getInteger("role_id");
		//前台拼接的权限
		String datapermission = dataJson.getString("datapermission");
		if (null == roleId) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}
		// 返回结果
		JSONObject object = getRoleInfo();
		if (null == object) {
			return ErrorCode.OBJECT_NOT_EXIST;
		}
		ErrorCode errorCode = (ErrorCode) object.get("success");
		if (null != errorCode) {
			return errorCode;
		}
		//删除角色记录权限
		dbHelper.update("DELETE from group_record_permission where group_id =" + roleId);

		List<String> sqlList = new ArrayList<String>();
		//前台传过来的格式：[goods:1,custom:1,custom:2]
		String[] premiArr = datapermission.split(",");
		if (null != premiArr && premiArr.length > 0) {
			for (String permiStr : premiArr) {
				String[] permis = permiStr.split(":");
				try {
					String record_type = permis[0];
					String value = permis[1];
					String sql = " insert into group_record_permission (group_id,record_type,flag,value) values(" + roleId + ",'" + record_type + "',1," + value + ")";
					sqlList.add(sql);
				} catch (Exception e) {
					continue;
				}
			}
			try {
				//批量执行插入
				String[] insertSql = (String[]) sqlList.toArray(new String[sqlList.size()]);
				dbHelper.execBatchSql(insertSql);

				ResultSet set = dbHelper.select("select * from employee where role_group_id = " + roleId);

				while(set.next()){
					Employee employee = EmployeeFactory.getInstance().getObject("id",set.getInt("id"));
					employee.refreshLookOverPermission();
				}
			} catch (SQLException e) {
				return ErrorCode.UPDATE_ERROR;
			}
		}
		return null;
	}

	/**
	 * 抽出查询角色
	 *
	 * @return
	 */
	private JSONObject getRoleInfo() {
		//角色组Id
		Integer roleId = null;
		// 返回结果
		JSONObject object = new JSONObject();
		try {
			roleId = dataJson.getInteger("role_id");
		} catch (Exception e) {
			object.put("success", ErrorCode.REQUEST_PARA_ERROR);
			return object;
		}
		if (null == roleId) {
			object.put("success", ErrorCode.GET_FONT_END_INFO_ERROR);
			return object;
		}
		//查询角色信息
		RoleGroup role = roleGroupFactory.getObject("id", roleId);
		if (null == role) {
			object.put("success", ErrorCode.OBJECT_NOT_EXIST);
			return object;
		}
		object.put("success", null);
		object.put("role", role);
		return object;
	}
}
