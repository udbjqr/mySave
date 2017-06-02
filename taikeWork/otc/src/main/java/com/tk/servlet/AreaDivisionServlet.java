package com.tk.servlet;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.annotation.WebServlet;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.object.AreaDivision;
import com.tk.object.AreaDivisionFactory;
import com.tk.servlet.result.SuccessJSON;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

/**
 * 员工地区
 */
@WebServlet("/areaDivision.do")
public class AreaDivisionServlet extends BaseServlet {
	private static Logger log = LogManager.getLogger(AreaDivisionServlet.class.getName());

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
	}

	@Override
	protected void queryAll() {
		log.trace("获取所有的地区列表初始...");
		List<AreaDivision> list = AreaDivisionFactory.getInstance().getAllObjects(employee);
		List<JSONObject> datas = new ArrayList<>();
		SuccessJSON success = new SuccessJSON();
		for (AreaDivision areaDivision : list) {
			JSONObject object = new JSONObject();
			object.put("id", areaDivision.get("id"));
			object.put("name", areaDivision.get("area_name"));
			object.put("remark", areaDivision.get("remark"));
			object.put("flag", areaDivision.get("flag"));
			datas.add(object);
		}
		success.put("data", datas);
		success.put("count", list.size());
		log.trace("获取所有的地区列表结束...");
		writer.print(success);
	}

	@Override
	protected void delete() {

	}

	@Override
	protected void update() {

	}

	@Override
	protected void query() {

	}

	@Override
	protected void load() {

	}

	@Override
	protected void add() {

	}

}
