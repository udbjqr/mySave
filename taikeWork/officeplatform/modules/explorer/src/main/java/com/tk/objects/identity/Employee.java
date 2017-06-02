package com.tk.objects.identity;

import com.tk.common.PermissionEnum;
import com.tk.common.persistence.*;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.StringUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;


/**
 * 员工对象.
 * <p>
 * 每一个员工对象对应一个员工。
 * <p>
 * 不同的监控对象,应该从此类继承并改写登录方式 此类自维护一个列表,
 *
 * @author yimin
 */
public class Employee extends AbstractPersistence implements User, org.activiti.engine.identity.User {
	private static Logger logger = LogManager.getLogger(Employee.class.getName());
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();

	private Map<PermissionEnum, Boolean> permissions = new HashMap<>();

	private UserLookOverPermission userLookOverPermission;

	Employee(EmployeeFactory factory, User user) {
		super(factory);
	}

	@Override
	public String getSuppressDisplsyField() {
		//超级管理员直接具有所有权限
		if (((EmployeeFactory) factory).isSupperMan(this)) {
			return "";
		}

		String viewPermission = get("view_permission_string");
		//if ((viewPermission == null || viewPermission.equals("")) && roleGroup != null) {
		//	viewPermission = roleGroup.get("view_permission_string");
		//}

		return viewPermission == null ? "" : viewPermission;
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
			flush();
			return true;
		}
		return false;*/
	}

	private void setLastLong() {
		try {
			set("lastlogin_time", new Date(System.currentTimeMillis()));
			flush();
		} catch (WriteValueException e) {
			logger.error("出现异常。", e);
		}

	}

	/**
	 * 得到是否具有操作此权限的能力
	 *
	 * @param permission 权限对象的枚举值
	 * @return true：具有操作权力，false:不允许操作。为空将返回false
	 */
	public boolean hasPermission(PermissionEnum permission) {
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
	public boolean hasPermission(PermissionEnum permission, Persistence object) {
		if ((int) get("id") == 0) {
			return true;
		}
		Boolean has = permissions.get(permission);

		//if (has == null) {
		//	if (roleGroup != null) {
		//		has = roleGroup.hasPermission(permission);
		//		has = has == null ? false : has;
		//	} else {
		//		has = false;
		//	}
		//}

		return has == null ? false : has;
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

		flush();
	}

	@Override
	public String getId() {
		return get("login_name");
	}

	@Override
	public void setId(String id) {
		try {
			set("login_name", id);
		} catch (WriteValueException e) {
			logger.error("设置登录名出现错误.", e);
		}
	}

	@Override
	public String getFirstName() {
		return get("real_name");
	}

	@Override
	public void setFirstName(String firstName) {
		try {
			set("real_name", firstName);
		} catch (WriteValueException e) {
			logger.error("设置真实名称出现错误.", e);
		}
	}

	@Override
	public String getLastName() {
		return "";
	}

	@Override
	public void setLastName(String lastName) {
	}

	@Override
	public String getEmail() {
		return get("email");
	}

	@Override
	public void setEmail(String email) {
		try {
			set("email", email);
		} catch (WriteValueException e) {
			logger.error("设置邮件出现错误.", e);
		}
	}

	@Override
	public String getPassword() {
		return get("password");
	}

	@Override
	public void setPassword(String password) {
		try {
			set("password", StringUtil.encrypt(password));
		} catch (WriteValueException e) {
			logger.error("设置密码出现错误.", e);
		}
	}

	@Override
	public boolean isPictureSet() {
		String pictureStr = get("head_portrait");
		return !(pictureStr == null || pictureStr.equals(""));
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
		return true;
	}

}
