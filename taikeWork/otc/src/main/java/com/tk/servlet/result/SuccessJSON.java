package com.tk.servlet.result;

import com.tk.common.util.StringUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.json.JSONObject;


/**
 * 返回Servlet成功时的对象组合.
 */
public class SuccessJSON {
	private final static Logger logger = LogManager.getLogger(SuccessJSON.class.getName());
	// 返回内容
	private JSONObject map;
	private final static String resultString = "\"success\":true,\"map\":";
	private String value;

	public SuccessJSON() {
		this.map = new JSONObject();
		this.value = resultString;
	}

	public SuccessJSON(String key, Object value) {
		this();

		map.put(key, value);
	}


	public SuccessJSON put(String key, Object value) {
		map.put(key, value);
		return this;
	}

	public SuccessJSON addFirstFloorValue(String key, Object value) {
		this.value = "\"" + key + "\":" + StringUtil.converToJSONString(value) + ",";
		return this;
	}

	@Override
	public String toString() {
		String result = "{" + value + map.toString() + "}";

		logger.trace("返回给前台的数据:" + result);
		return result;
	}
}
