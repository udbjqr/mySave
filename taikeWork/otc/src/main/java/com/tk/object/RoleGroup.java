package com.tk.object;

import com.tk.common.PermissionEnum;
import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.Field;
import com.tk.common.persistence.WriteValueException;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashMap;
import java.util.Map;

/**
 * 权限组对象，对应操作员的权限组.
 */
public class RoleGroup extends AbstractPersistence {
	private static final Logger logger = LogManager.getLogger(RoleGroup.class.getName());

	private Map<PermissionEnum, Boolean> permissions = new HashMap<>();

	RoleGroup(AbstractPersistenceFactory factory) {
		super(factory);
	}

	@Override
	public void set(Field field, Object value) throws WriteValueException {
		PermissionEnum permissionEnum = null;
		if (field.name.equals("permission_string") && value != null) {
			permissions.clear();
			String[] strings = ((String) value).split(",");
			for (String string : strings) {
				String[] s = string.split(":");
				try {
					permissionEnum = findPermission(Integer.valueOf(s[0]));
				} catch (Exception e) {
					logger.error("权限字串格式不正确！" + string, e);
				}
				if (permissionEnum != null) {
					permissions.put(permissionEnum, s[1].equals("1"));
				} else {
					logger.error("找不到对应的权限id，id：" + string);
				}

			}
		}

		super.set(field, value);
	}

	/**
	 * 得到是否具有操作此权限的能力
	 *
	 * @param permission 权限对象
	 * @return true：具有操作权力，false:不允许操作。为空将返回false
	 */
	Boolean hasPermission(PermissionEnum permission) {
		Boolean bool = permissions.get(permission);
		return bool == null ? false : bool;
	}


	static PermissionEnum findPermission(int permissionId) {
		for (PermissionEnum permission : PermissionEnum.values()) {
			if (permission.getCode() == permissionId) {
				return permission;
			}
		}
		return null;
	}

	/**
	 * @return 获取所有的权限类型
	 */
	public Map<PermissionEnum, Boolean> getRoleGroupPermissions() {
		return permissions;
	}
}
