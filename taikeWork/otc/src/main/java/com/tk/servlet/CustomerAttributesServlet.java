package com.tk.servlet;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.annotation.WebServlet;

import com.tk.servlet.result.ErrorCode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.object.CustomerAttributes;
import com.tk.object.CustomerAttributesFactory;
import com.tk.servlet.result.SuccessJSON;


/**
 * 客户属性列表
 */
@WebServlet("/customerAttributes.do")
public class CustomerAttributesServlet extends BaseServlet {
	private static Logger log = LogManager.getLogger(CustomerAttributesServlet.class.getName());

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
	}

	@Override
	protected void queryAll() {
		log.trace("查询所有的客户属性初始...");
		List<CustomerAttributes> list;
		try {
			list = CustomerAttributesFactory.getInstance().getObjectsForString(" where t.flag != 1 ", employee);
		} catch (Exception e) {
			log.error("获取客户规模列表发生异常,异常描述：{}", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
			return;
		}
		List<JSONObject> datas = new ArrayList<>();
		SuccessJSON success = new SuccessJSON();
		for (CustomerAttributes customerAttributes : list) {
			JSONObject object = new JSONObject();
			object.put("id", customerAttributes.get("id"));
			object.put("name", customerAttributes.get("attributes_name"));
			object.put("remark", customerAttributes.get("remark"));
			object.put("flag", customerAttributes.get("flag"));
			datas.add(object);
		}
		success.put("data", datas);
		success.put("count", list.size());
		log.trace("查询所有的客户属性结束...");
		writer.print(success);
	}

	@Override
	protected void delete() {
		// TODO Auto-generated method stub

	}

	@Override
	protected void update() {
		// TODO Auto-generated method stub

	}

	@Override
	protected void query() {
		// TODO Auto-generated method stub

	}

	@Override
	protected void load() {
		// TODO Auto-generated method stub

	}

	@Override
	protected void add() {
		// TODO Auto-generated method stub

	}

}
