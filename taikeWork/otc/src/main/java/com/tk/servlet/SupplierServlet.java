package com.tk.servlet;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.common.persistence.UserLookOverPermission;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.object.Goods;
import com.tk.object.Supplier;
import com.tk.object.SupplierFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.annotation.WebServlet;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@WebServlet("/supplier.do")
public class SupplierServlet extends BaseServlet {
	protected static Logger log = LogManager.getLogger(SupplierServlet.class.getName());

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.querySupplierByPermission, PermissionEnum.NOT_USE_PERMISSION);
	}
	
	@Override
	protected boolean handleChilder() {
		switch (controlType) {
		case querySupplierByPermission:
			querySupplierByPermission();
			return true;

		default:
			return false;
		}
	}
	
	/***
	 * 根据权限查询列表
	 */
	private void querySupplierByPermission(){
		try {
			log.trace("查询所有供应商信息初始...");
			StringBuilder sql = new StringBuilder(" where  1 = 1 ");
			StringBuilder goodsIds = new StringBuilder();
			UserLookOverPermission userLookOverPermission = employee.getUserLookOverPermission();
			boolean ifag = true;
			if(userLookOverPermission!=null){
				Set<Integer> set = userLookOverPermission.get("supplier");
				if(set==null){
					ifag = false;
				}else if(set.size()>0){
					for (Integer integer : set) {
						goodsIds.append(integer).append(",");
					}
				}
			}else{
				ifag = false;
			}
			
			if (goodsIds.length() > 0) {
				goodsIds.delete(goodsIds.length() - 1, goodsIds.length());
			}
			
			
			if(ifag){
				sql.append(" and id in(").append(goodsIds.toString()).append(")");
			}
			
			
			List<Supplier> list = SupplierFactory.getInstance().getObjectsForString(sql.toString(), employee);
			List<JSONObject> datas = new ArrayList<>();
			for (Supplier supplier : list) {
				JSONObject object = new JSONObject();
				object.put("name", supplier.get("supplier_name"));
				object.put("id", supplier.get("id"));
				object.put("flag", supplier.get("flag"));
				object.put("remark", supplier.get("remark"));
				datas.add(object);
			}
			
			
			SuccessJSON success = new SuccessJSON();
			success.put("list", datas);
			success.put("count", datas.size());
			writer.println(success);
		} catch (Exception e) {
			log.error("出现异常！",e);
			writer.println(ErrorCode.GET_LIST_INFO_ERROR);
		}
		log.trace("查询所有供应商信息结束...");
	}

	@Override
	protected void queryAll() {
		log.trace("查询所有供应商信息初始...");
		List<Supplier> list = SupplierFactory.getInstance().getAllObjects(employee);
		List<JSONObject> datas = new ArrayList<>();
		SuccessJSON success = new SuccessJSON();

		for (Supplier supplier : list) {
			JSONObject object = new JSONObject();
			object.put("name", supplier.get("supplier_name"));
			object.put("id", supplier.get("id"));
			object.put("flag", supplier.get("flag"));
			object.put("remark", supplier.get("remark"));
			datas.add(object);
		}
		success.put("list", datas);
		log.trace("查询所有供应商信息结束...");
		writer.println(success);
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
