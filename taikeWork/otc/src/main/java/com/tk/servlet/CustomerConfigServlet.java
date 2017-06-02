package com.tk.servlet;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.PermissionEnum;
import com.tk.common.persistence.WriteValueException;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.DateUtil;
import com.tk.common.util.ObjectUtil;
import com.tk.common.util.PageUtil;
import com.tk.object.ChainCustomer;
import com.tk.object.ChainCustomerFactory;
import com.tk.object.Customer;
import com.tk.object.CustomerFactory;
import com.tk.object.Goods;
import com.tk.object.GoodsFactory;
import com.tk.object.TargetCustomerToCustomer;
import com.tk.object.TargetCustomerToCustomerFactory;
import com.tk.object.TargetGoodsToGoods;
import com.tk.object.TargetGoodsToGoodsFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

/***
 * 门店销售关系配置
 * @author Administrator
 *
 */
@WebServlet("/customerConfig.do")
public class CustomerConfigServlet extends BaseServlet {

	protected static Logger log = LogManager.getLogger(CustomerConfigServlet.class.getName());
	private Integer pageSize;
	private Integer pageNumber;
	
	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.query, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.add, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.delete, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.update, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.load, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.queryNotCofigCustomer, PermissionEnum.NOT_USE_PERMISSION);
	}
	
	
	@Override
	protected boolean handleChilder() {
		switch (controlType) {
		case queryNotCofigCustomer:
			//查询没有配置的门店
			queryNotCofigCustomer();
			return true;
		default:
			return false;
		}
	}
	
	/***
	 * 查询没有配置的门店
	 */
	private void queryNotCofigCustomer(){
		try {
			Integer chain_customId = dataJson.getInteger("chain_customId");
			StringBuilder sql = new StringBuilder();
			sql.append(" where not exists(select * from target_customer_to_customer a where a.customer_id = t.id) ");
			sql.append(" and exists(select * from chain_customer b where t.chain_customer_id = b.id and b.id = ")
			.append(chain_customId).append(")");
			List<Customer> customerList = CustomerFactory.getInstance().getObjectsForString(sql.toString(), employee);
			//保存数据
			JSONArray jsonArray = new JSONArray();
			for (Customer customer : customerList) {
				JSONObject object = new JSONObject();
				object.put("id", customer.get("id"));
				object.put("name", customer.get("customer_name"));
				jsonArray.add(object);
			}
			
			SuccessJSON success = new SuccessJSON();
			success.put("list", jsonArray);
			writer.print(success);
			log.trace("查询门店列表结束");
		} catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		}catch (NumberFormatException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}
	
	
	/****
	 * 查询门店销售关系配置数据列表
	 */
	@Override
	protected void query() {
		try{
			pageSize = dataJson.getInteger("pageSize");
			pageNumber = dataJson.getInteger("pageNumber");
			String customer_id1 = (String)dataJson.get("customer_id");
			String chain_customer_id1 = (String)dataJson.get("chain_customer_id");
			StringBuilder sql = new StringBuilder("where 1 = 1 ");
			if (StringUtils.isNotBlank(customer_id1)) {
				String str2 = customer_id1.substring(customer_id1.length() - 1);
				if (str2.equals(",")) {
					customer_id1 = customer_id1.substring(0, customer_id1.length() - 1);
				}
				sql.append(" and customer_id in (").append(customer_id1).append(")");
			}
			
			if (StringUtils.isNotBlank(chain_customer_id1)) {
				String str2 = chain_customer_id1.substring(chain_customer_id1.length() - 1);
				if (str2.equals(",")) {
					chain_customer_id1 = chain_customer_id1.substring(0, chain_customer_id1.length() - 1);
				}
				sql.append(" and exists(").append("select * from customer a ")
				.append(" where a.chain_customer_id in (").append(chain_customer_id1).append(")")
				.append(" and t.customer_id = a.id ")
				.append(")");
			}
			List<TargetCustomerToCustomer> list = TargetCustomerToCustomerFactory.getInstance().getObjectsForString(sql.toString(), employee);
			List<TargetCustomerToCustomer> pageList = PageUtil.getPageList(pageNumber, pageSize, list);
			List<JSONObject> dataList = new ArrayList<>();
			for (TargetCustomerToCustomer targetCustomerToCustomer : pageList) {
				JSONObject object = new JSONObject();
				object.put("id", targetCustomerToCustomer.get("id"));
				Integer customer_id = targetCustomerToCustomer.get("customer_id");
				Customer customer = CustomerFactory.getInstance().getObject("id", customer_id);
				String china_customer_name = "";
				if(customer!=null){
					object.put("customer_name", customer.get("customer_name"));//门店客户名称
					Integer chain_customer_id = customer.get("chain_customer_id");
					if(chain_customer_id!=null){
						ChainCustomer chainCustomer = ChainCustomerFactory.getInstance().getObject("id", chain_customer_id);
						china_customer_name = chainCustomer==null?"":chainCustomer.get("china_customer_name");
					}
				}else{
					object.put("customer_name", "");//门店客户名称
				}
				object.put("id", targetCustomerToCustomer.get("id"));
				object.put("china_customer_name", china_customer_name);//连锁客户名称
				object.put("customer_id", customer_id);//门店系统ID
				object.put("target_customer_id", targetCustomerToCustomer.get("target_customer_id"));//门店客户ID
				dataList.add(object);
			}
			
			SuccessJSON success = new SuccessJSON();
			success.put("list", dataList);
			success.put("count", list.size());
			writer.print(success);
		} catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		}catch (NumberFormatException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
		
	}
	
	
	@Override
	protected void add() {
		log.trace("开始新增门店配置...");
		try{
			Integer customer_id = Integer.valueOf(dataJson.get("customer_id").toString());
			String target_customer_id = dataJson.get("target_customer_id").toString();
			boolean ifag = true;
			DBHelper dbHelper = DBHelperFactory.getDBHelper();
			StringBuilder sql = new StringBuilder();
			sql.append(" where customer_id = ").append(customer_id)
			.append(" and target_customer_id = ").append(dbHelper.getString(target_customer_id));
			List<TargetCustomerToCustomer> list = TargetCustomerToCustomerFactory.getInstance().getObjectsForString(sql.toString(), employee);
			if(list.size()>0){
				writer.print(ErrorCode.RECODE_AlREADY_EXIST);//记录已存在！
				return;
			}
			TargetCustomerToCustomer targetCustomerToCustomer = TargetCustomerToCustomerFactory.getInstance().getNewObject(employee);
			targetCustomerToCustomer.set("customer_id", customer_id);
			targetCustomerToCustomer.set("target_customer_id", target_customer_id);
			ifag = targetCustomerToCustomer.flash();
			if(ifag){
				writer.print(new SuccessJSON("msg", "新增门店配置成功！"));
				log.trace("新增门店配置成功！...");
			}else{
				writer.print(ErrorCode.ADD_ERROR);
				log.trace("新增门店配置失败！...");
			}
		} catch (WriteValueException e) {
			log.error("写入数据值异常！", e);
			writer.print(ErrorCode.ADD_ERROR);
		} catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		}catch (NumberFormatException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.ADD_ERROR);
		}
		log.trace("新增门店配置结束");
	}
	
	@Override
	protected void delete() {
		log.trace("开始删除门店配置...");
		try{
			Integer id = Integer.valueOf(dataJson.get("id").toString());
			TargetCustomerToCustomer targetCustomerToCustomer = TargetCustomerToCustomerFactory.getInstance().getObject("id", id);
			if(targetCustomerToCustomer==null){
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}
			targetCustomerToCustomer.delete();
			writer.print(new SuccessJSON("msg", "删除门店配置成功！"));
			log.trace("删除门店配置结束...");
		}catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		}catch (NumberFormatException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.DELETE_ERROR);
		}
	}
	
	@Override
	protected void update() {
		log.trace("开始修改门店配置...");
		try{
			DBHelper dbHelper = DBHelperFactory.getDBHelper();
			boolean ifag = true;
			Integer id = Integer.valueOf(dataJson.get("id").toString());
			Integer customer_id = Integer.valueOf(dataJson.get("customer_id").toString());
			String target_customer_id = dataJson.get("target_customer_id").toString();
			TargetCustomerToCustomer targetCustomerToCustomer = TargetCustomerToCustomerFactory.getInstance().getObject("id", id);
			StringBuilder sql = new StringBuilder();
			sql.append(" where customer_id = ").append(customer_id)
			.append(" and target_customer_id = ").append(dbHelper.getString(target_customer_id));
			List<TargetCustomerToCustomer> list = TargetCustomerToCustomerFactory.getInstance().getObjectsForString(sql.toString(), employee);
			if(list.size()>0){
				writer.print(ErrorCode.RECODE_AlREADY_EXIST);//记录已存在！
				return;
			}
			
			if(targetCustomerToCustomer==null){
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}
			
			if(customer_id!=null){
				targetCustomerToCustomer.set("customer_id", customer_id);
			}
			
			if(target_customer_id!=null){
				targetCustomerToCustomer.set("target_customer_id", target_customer_id);
			}
			ifag = targetCustomerToCustomer.flash();
			if(ifag){
				writer.print(new SuccessJSON("msg", "修改门店配置成功！"));
				log.trace("修改门店配置成功！...");
			}else{
				writer.print(ErrorCode.UPDATE_ERROR);
				log.trace("修改门店配置失败！...");
			}
			log.trace("修改门店配置结束...");
		}catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		}catch (NumberFormatException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.ADD_ERROR);
		}
	}
	
	
	@Override
	protected void load() {
		try{
			Integer id = Integer.valueOf(dataJson.get("id").toString());
			TargetCustomerToCustomer targetCustomerToCustomer = TargetCustomerToCustomerFactory.getInstance().getObject("id", id);
			if(targetCustomerToCustomer==null){
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}
			
			JSONObject object = new JSONObject();
			Integer customer_id = (Integer)targetCustomerToCustomer.get("customer_id");
			if(customer_id!=null){
				Customer customer = CustomerFactory.getInstance().getObject("id", customer_id);
				object.put("chain_customer_id", customer!=null?customer.get("chain_customer_id"):"");
			}else{
				object.put("chain_customer_id", "");
			}
			object.put("customer_id", targetCustomerToCustomer.get("customer_id"));
			object.put("id", targetCustomerToCustomer.get("id"));
			object.put("target_customer_id", targetCustomerToCustomer.get("target_customer_id"));
			writer.print(new SuccessJSON("data",object));
		}catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		}catch (NumberFormatException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.LOAD_ERROR);
		}
	}
	
	@Override
	protected void fileUpload(HttpServletRequest request, HttpServletResponse response) {
		try{
			List<TargetCustomerToCustomer> list = TargetCustomerToCustomerFactory.getInstance().getAllObjects(employee);
			List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
			for (TargetCustomerToCustomer targetCustomerToCustomer : list) {
				Map<String,Object> map = new HashMap<>();
				Integer customer_id = targetCustomerToCustomer.get("customer_id");
				Customer customer = CustomerFactory.getInstance().getObject("id", customer_id);
				String china_customer_name = "";
				if(customer!=null){
					map.put("门店客户名称", customer.get("customer_name"));//门店客户名称
					Integer chain_customer_id = customer.get("chain_customer_id");
					if(chain_customer_id!=null){
						ChainCustomer chainCustomer = ChainCustomerFactory.getInstance().getObject("id", chain_customer_id);
						china_customer_name = chainCustomer==null?"":chainCustomer.get("china_customer_name");
					}
				}else{
					map.put("门店客户名称", "");//门店客户名称
				}
				map.put("连锁客户名称", china_customer_name);//连锁客户名称
				map.put("门店系统ID", customer_id);//门店系统ID
				map.put("门店客户ID", targetCustomerToCustomer.get("target_customer_id"));//门店客户ID
				dataList.add(map);
			}
			
		
			if (dataList.size() > 0) {
				exportListData(dataList);
				log.trace("导出列表数据结束...");
			} else {
				log.trace("暂无数据！");
				writer.print(new SuccessJSON("msg", "暂无数据！"));
			}
			
		} catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		}catch (NumberFormatException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}
	
}
