package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.common.persistence.WriteValueException;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.Config;
import com.tk.common.util.FileUtil;
import com.tk.common.util.PageUtil;
import com.tk.common.util.excel.ExcelUtil;
import com.tk.object.*;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * 产品手机端管理
 */
@WebServlet("/goodsMobile.do")
public class GoodsMobileServlet extends GoodsServlet {

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.getGoodsInFo, PermissionEnum.NOT_USE_PERMISSION);
		//handlePermission.put(ControlType.load, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.query, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
	}
}
