package com.tk.common.persistence;

/**
 * 用户权限部分接口，此接口指定当前所对应的操作用户.
 *
 * @author yimin
 */
public interface User {
	/**
	 * 返回指明此对象的唯一Id.
	 */
	int getId();

	/**
	 * 一个用;号分隔开的，无查看或者操作字段权限的字符串.
	 */
	String getSuppressDisplsyField();


	/**
	 * 返回此用户所对应的查看权限.
	 *
	 * 当需要一个权限的列表时，使用getUserLookOverPermission().get(1).的方式去获得。
	 * 除有特别需求外，为空或size为0,则具有所有权限。
	 */
	UserLookOverPermission getUserLookOverPermission();

	boolean canViewField(String fieldName);
}
