package com.tk.common;

/**
 * 权限的列表对象，每一个对应一个权限值
 */
public enum PermissionEnum {
	NOT_USE_PERMISSION(0, "无需要权限");

	//模;
	//_QUERY(101, "管理-列表"),

	private final int code;
	private final String name;

	PermissionEnum(int code, String name) {
		this.code = code;
		this.name = name;
	}

	public String getHandleName() {
		return name;
	}

	public int getCode() {
		return code;
	}
}
