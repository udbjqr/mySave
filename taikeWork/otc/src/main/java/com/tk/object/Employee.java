package com.tk.object;

import com.tk.common.PermissionEnum;
import com.tk.common.persistence.*;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.ResultSet;
import java.util.*;


/**
 * 员工对象.
 * <p>
 * 每一个员工对象对应一个员工。
 * <p>
 * 不同的监控对象,应该从此类继承并改写登录方式 此类自维护一个列表,
 *
 * @author yimin
 */
public class Employee extends AbstractPersistence implements User {
	private static Logger logger = LogManager.getLogger(Employee.class.getName());
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();

	private static HandleLogFactory handleLogFactory = HandleLogFactory.getInstance();
	private Map<PermissionEnum, Boolean> permissions = new HashMap<>();
	private RoleGroup roleGroup = null;

	private UserLookOverPermission userLookOverPermission;

	Employee(EmployeeFactory factory) {
		super(factory);
	}

	/**
	 * 员工的登录方法.
	 *
	 * @param passWord 登录时使用的密码
	 * @return 是否登录成功
	 */
	public boolean login(String passWord) {
		boolean result = (passWord != null) && passWord.equals(get("password"));
		if (result) {
			setLastLong();
		}
		return result;

	/*	if (StringUtil.matchPasswd(passWord, get("password"))) {
			try {
				set("lastlogin_time", new Date(System.currentTimeMillis()));
			} catch (WriteValueException e) {
				logger.error("出现异常。", e);
			}
			flash();
			return true;
		}
		return false;*/
	}

	public void setLastLong() {
		try {
			set("lastlogin_time", new Date(System.currentTimeMillis()));
			flash();
		} catch (WriteValueException e) {
			logger.error("出现异常。", e);
		}

	}


	@Override
	public void set(Field field, Object value) throws WriteValueException {
		switch (field.name) {
			case "role_group_id":
				roleGroup = RoleGroupFactory.getInstance().getObject("id", value);
				refreshLookOverPermission();
				break;
			case "permission_string":
				if (null != value) {
					String[] strings = ((String) value).split(";");
					for (String string : strings) {
						String[] s = string.split(":");
						putPermission(Integer.valueOf(s[0]), s[1].equals("1"));
					}
				}
				break;
		}

		super.set(field, value);
	}

	/**
	 * 设置权限字段.
	 *
	 * @param permission 权限对象
	 * @param aBoolean   是否具有有权限
	 */
	private synchronized void putPermission(PermissionEnum permission, Boolean aBoolean) {
		permissions.put(permission, aBoolean == null ? false : aBoolean);
	}

	/**
	 * 得到是否具有操作此权限的能力
	 *
	 * @param permission 权限对象的枚举值
	 * @return true：具有操作权力，false:不允许操作。为空将返回false
	 */
	public Boolean hasPermission(PermissionEnum permission) {
		if (permission == null) {
			logger.warn("permission为空,直接返回禁止.");
			return false;
		}

		if (permission == PermissionEnum.NOT_USE_PERMISSION) {
			return true;
		} else {
			return hasPermission(permission, null);
		}
	}

	/**
	 * 得到是否具有操作此权限的能力
	 *
	 * @param permission 权限对象的枚举值
	 * @param object     需要操作的对象
	 * @return true：具有操作权力，false:不允许操作。为空将返回false
	 */
	public Boolean hasPermission(PermissionEnum permission, Persistence object) {
		if ((int) get("id") == 0) {
			return true;
		}
		Boolean has = permissions.get(permission);


		if (has == null) {
			if (roleGroup != null) {
				has = roleGroup.hasPermission(permission);
				has = has == null ? false : has;
			} else {
				has = false;
			}
		}


		if (has && object != null) {
			handleLogFactory.addHandleLog(this, permission, object);
		}
		return has;
	}

	/**
	 * 设置权限组权限方法.
	 *
	 * @param permission 以权限列表ID为名称的值
	 * @param aBoolean   设置是否具有权限。为null则为false.
	 */
	public void putPermission(int permission, Boolean aBoolean) {
		putPermission(RoleGroup.findPermission(permission), aBoolean);
	}

	/**
	 * 根据权限对象，获得此本对象是否可能操作此权限.
	 *
	 * @param permission 权限对象的ID值
	 * @return true：具有操作权力，false:不允许操作。为空将返回false
	 */
	public Boolean getPermission(int permission) {
		return permissions.get(RoleGroup.findPermission(permission));
	}

	/**
	 * 根据权限对象，获得此对象所拥有的菜单权限.
	 *
	 * @return true：具有操作权力，false:不允许操作。为空将返回false
	 */
	public List<Integer> getMenu() {
		List<Integer> menuList = new ArrayList<>();
		if ((int) get("id") == 0) {
			menuList.add(0);
			return menuList;
		}
		if (null == permissions || permissions.size() <= 0) {
			try {
				permissions = roleGroup.getRoleGroupPermissions();
			} catch (Exception e) {
				menuList.add(null);
				return menuList;
			}
		}
		//查询当前用户所有权限
		if (null != permissions && permissions.size() > 0) {
			//循环所有的权限
			for (PermissionEnum permission : PermissionEnum.values()) {
				Object bl = permissions.get(permission);
				//如果没有有这权限，继续下一次循环
				if (bl == null) {
					continue;
				}
				//获得权限名
				String name = permission.getHandleName();
				//判断是否是列表
				if (name.contains("列表")) {
					try {
						menuList.add(permission.getCode());
					} catch (Exception e) {
						logger.error("异常", e);
					}
				}
			}
		}
		return menuList;
	}

	/**
	 * 将微信号与用户绑定
	 *
	 * @param wxName 用户的微信ID
	 * @param openId 用户的openId
	 */
	public void bind(String wxName, String openId) throws WriteValueException {
		set("weixin_name", wxName);
		set("weixin_id", openId);

		flash();
	}

	@Override
	public int getId() {
		return get("id");
	}

	@Override
	public String getSuppressDisplsyField() {
		//超级管理员直接具有所有权限
		if (((EmployeeFactory) factory).isSupperMan(this)) {
			return "";
		}

		String viewPermission = get("view_permission_string");
		if ((viewPermission == null || viewPermission.equals("")) && roleGroup != null) {
			viewPermission = roleGroup.get("view_permission_string");
		}

		return viewPermission == null ? "" : viewPermission;
	}

	@Override
	public UserLookOverPermission getUserLookOverPermission() {
		//超级管理员直接具有所有权限
		if (((EmployeeFactory) factory).isSupperMan(this)) {
			return null;
		}

		return userLookOverPermission;
	}

	@Override
	public boolean canViewField(String fieldName) {
		//超级管理员直接具有所有权限
		if (((EmployeeFactory) factory).isSupperMan(this)) {
			return true;
		}

		Set<Integer> saleDetail = userLookOverPermission.get("sale_detail");
		if (saleDetail == null || !ControlViewField.contains(fieldName)) {
			return true;
		}

		for (Integer id : saleDetail) {
			if (ControlViewField.valueOf(fieldName).getIndex() == id) {
				return true;
			}
		}

		return false;
	}


	@Override
	public void init() {
		refreshLookOverPermission();
	}


	public void refreshLookOverPermission() {
		logger.trace("为用户{}重新计算数据权限,ID:{}", get("real_name"), get("id"));
		userLookOverPermission = new UserLookOverPermission();

		Set<Integer> supplier = readGroupRecordPermission(roleGroup == null ? null : roleGroup.get("id"), "supplier");
		if (supplier != null) {
			userLookOverPermission.put("supplier", supplier);
			//noinspection ConstantConditions
			userLookOverPermission.put("goods", readGoodsPermission(supplier));
		}

		userLookOverPermission.put("customer", readCustomerPermission());
		userLookOverPermission.put("chain_customer", readChainCustomerPermission());

		Set<Integer> saleDetail = readGroupRecordPermission(roleGroup == null ? null : roleGroup.get("id"), "sale_detail");
		if (saleDetail != null) {
			userLookOverPermission.put("sale_detail", saleDetail);
		}
	}

	private Set<Integer> readChainCustomerPermission() {
		Set<Integer> data = new HashSet<>();
		ResultSet set = null;
		try {
			String sql = "";
			switch ((Integer) get("employee_type")) {
				case 4: //厂家
				case 6: //总经理
				case 5: //区域经理
				case 2: //主管
				case 3: //行政
					return null;
				case 1: //销售代表
					sql = "SELECT id from chain_customer where employee_id = " + get("id").toString();
					break;
				default:
					logger.error("员工类型超出理解范围。");
			}

			set = dbHelper.select(sql);

			//noinspection StatementWithEmptyBody
			while (set.next()) {
				data.add(set.getInt("id"));
			}

			return data;
		} catch (Exception e) {
			logger.error("出现异常", e);
		} finally {
			dbHelper.close(set);
		}

		return null;
	}


	private Set<Integer> readCustomerPermission() {
		Set<Integer> data = new HashSet<>();
		ResultSet set = null;
		try {
			String sql = "";
			switch ((Integer) get("employee_type")) {
				case 5: //区域经理
					sql = String.format("SELECT id FROM customer WHERE area_manager = %1$s UNION SELECT p.value as id FROM " +
									" group_record_permission p INNER JOIN role_group a ON p.group_id = a.id INNER JOIN " +
									" employee c ON a.id = c.role_group_id WHERE c.id = %1$s and p.record_type = " +
									"'customer_attributes'", get("id").toString());
					break;
				case 3: //行政
				case 4: //厂家
				case 1: //销售代表
					sql = String.format("SELECT id FROM customer WHERE employee_id = %1$s UNION SELECT p.value as id FROM " +
									" group_record_permission p INNER JOIN role_group a ON p.group_id = a.id INNER JOIN " +
									" employee c ON a.id = c.role_group_id WHERE c.id = %1$s and p.record_type = " +
									"'customer_attributes'", get("id").toString());
					break;
				case 2: //主管
					sql = String.format("SELECT id FROM customer WHERE person_in_charge_id = %1$s UNION SELECT p.value as id FROM " +
									" group_record_permission p INNER JOIN role_group a ON p.group_id = a.id INNER JOIN " +
									" employee c ON a.id = c.role_group_id WHERE c.id = %1$s and p.record_type = " +
									"'customer_attributes'", get("id").toString());
					break;
				case 6: //总经理
					return null;
				default:
					logger.error("员工类型超出理解范围。");
			}

			set = dbHelper.select(sql);

			//noinspection StatementWithEmptyBody
			while (set.next()) {
				data.add(set.getInt("id"));
			}

			return data;
		} catch (Exception e) {
			logger.error("出现异常", e);
		} finally {
			dbHelper.close(set);
		}

		return null;
	}

	private Set<Integer> readGroupRecordPermission(Integer id, String name) {
		if (id == null) {
			return null;
		}

		//读供应商对象
		Set<Integer> data = new HashSet<>();
		ResultSet set = null;
		try {
			String sql = String.format("select value from group_record_permission where group_id = %d and record_type = %s",
							id, dbHelper.getString(name));

			set = dbHelper.select(sql);

			//noinspection StatementWithEmptyBody
			while (set.next()) {
				data.add(set.getInt(1));
			}

			return data.isEmpty() ? null : data;
		} catch (Exception e) {
			logger.error("出现异常", e);
		} finally {
			dbHelper.close(set);
		}
		return null;
	}

	private Set<Integer> readGoodsPermission(Set<Integer> suppliers) {
		ResultSet set = null;
		StringBuilder builder = new StringBuilder();

		for (Integer supplier : suppliers) {
			builder.append(supplier).append(",");
		}

		if (builder.length() > 1) {
			builder.delete(builder.length() - 1, builder.length());
		} else {
			return null;
		}

		Set<Integer> customerList = new HashSet<>();
		try {

			set = dbHelper.select("select id from goods where supplier_id in (" + builder.toString() + ")");

			//noinspection StatementWithEmptyBody
			while (set.next()) {
				customerList.add(set.getInt("id"));
			}

			return customerList;
		} catch (Exception e) {
			logger.error("出现异常", e);
		} finally {
			dbHelper.close(set);
		}

		return null;
	}
}
