package com.tk.common.persistence;

/**
 * 数据字段对象类.
 *
 * 此对象
 */
public class Field {
	public static final String SPILT_STR = "@@";

	public Class<?> fieldClass;
	public Object defaultValue = null;
	public String name;
	public int length;
	public boolean mandatory;
	public boolean primaryKey;
	private String Serial = null;
	private final boolean isViewField;
	final int order;

	Field(String name, int length, Class<?> fieldClass, Object defaultValue, boolean mandatory, boolean primaryKey,int order) {
		this(name, length, fieldClass, defaultValue, mandatory, primaryKey, false,order);
	}

	Field(String name, int length, Class<?> fieldClass, Object defaultValue, boolean mandatory, boolean primaryKey, boolean isViewField,int order) {
		this.fieldClass = fieldClass;
		this.defaultValue = defaultValue;
		this.name = name;
		this.length = length;
		this.mandatory = mandatory;
		this.primaryKey = primaryKey;
		this.isViewField = isViewField;
		this.order = order;
	}

	public void setSerial(String serial) {
		Serial = serial;
	}

	public boolean isSerial() {
		return Serial != null;
	}

	public String getSerial() {
		return Serial;
	}

	public boolean isViewField() {
		return isViewField;
	}
}
