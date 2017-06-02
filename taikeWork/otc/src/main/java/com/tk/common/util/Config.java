package com.tk.common.util;

import com.tk.common.sql.DBHelperFactory;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.logging.log4j.core.util.Loader;

import java.util.Properties;

/**
 * 读基本配置文件方法.
 * <p>
 * 此对象为单一类对象，并且获得一次将不再进行修改。
 * 此类调用log4j2的方法。
 */
public class Config extends Properties {
	private static Logger logger = LogManager.getLogger(Config.class.getName());
	private static Config instance = new Config();

	private static final String PROPERTIES_FILENAME = "Config.properties";

	public static Config getInstance() {
		return instance;
	}

	private Config() {
		String string4File = FileUtil.getProperties(Loader.getResource(PROPERTIES_FILENAME, DBHelperFactory.class.getClassLoader()), "ISO-8859-1");
		defaults = FileUtil.getPropertiesFromString(string4File);

		setConfigValue();
	}

	/**
	 * 根据可能的配置，对未配置的值写默认值。
	 */
	private void setConfigValue() {
		put("fileUploadPath", defaults.getProperty("fileUploadPath", "./upload/"));
		put("maxDistance",defaults.getProperty("maxDistance", "30"));
	}


	@Override
	public synchronized Object get(Object key) {
		logger.error("未提供此方法，请使用getProperties()");
		return null;
	}


	@Override
	public synchronized Object put(Object key, Object value) {
		logger.error("未提供此方法，请使用getProperties()");
		return null;
	}
}
