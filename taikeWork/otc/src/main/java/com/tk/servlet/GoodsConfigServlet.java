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
import com.tk.common.PermissionEnum;
import com.tk.common.persistence.WriteValueException;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
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
 * 产品销售关系配置
 * @author Administrator
 *
 */
@WebServlet("/goodsConfig.do")
public class GoodsConfigServlet extends BaseServlet {

	protected static Logger log = LogManager.getLogger(GoodsConfigServlet.class.getName());
	private Integer pageSize;
	private Integer pageNumber;
	
	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.query, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.add, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.delete, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.update, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.load, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.fileExport, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.queryNotCofigGoods, PermissionEnum.NOT_USE_PERMISSION);
	}
	
	@Override
	protected boolean handleChilder() {
		switch (controlType) {
		case queryNotCofigGoods:
			//查询没有配置的产品
			queryNotCofigGoods();
			return true;
		default:
			return false;
		}
	}
	
	/***
	 * 查询没有配置的产品
	 */
	private void queryNotCofigGoods(){
		try {
			Integer chain_customId = dataJson.getInteger("chain_customId");
			StringBuilder sql = new StringBuilder();
			sql.append(" where not exists( ")
				 .append(" select * from target_goods_to_goods a ")
				 .append(" where a.goods_id = t.id and a.chain_customer_id = ")
				 .append(chain_customId)
				 .append(")");
			List<Goods> goodsList = GoodsFactory.getInstance().getObjectsForString(sql.toString(), employee);
			//保存数据
			JSONArray jsonArray = new JSONArray();
			for (Goods goods : goodsList) {
				JSONObject object = new JSONObject();
				object.put("id", goods.get("id"));
				object.put("name", goods.get("goods_name"));
				jsonArray.add(object);
			}
			
			SuccessJSON success = new SuccessJSON();
			success.put("list", jsonArray);
			writer.print(success);
			log.trace("查询产品列表结束");
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
	 * 查询门店产品销售关系配置数据列表
	 */
	@Override
	protected void query() {
		try{
			pageSize = dataJson.getInteger("pageSize");
			pageNumber = dataJson.getInteger("pageNumber");
			String goods_id1 = dataJson.getString("goods_id");
			String chain_customer_id1 = dataJson.getString("chain_customer_id");
			StringBuilder sql = new StringBuilder(" where 1 = 1 ");
			if(StringUtils.isNotBlank(goods_id1)){
				String str2 = goods_id1.substring(goods_id1.length() - 1);
				if (str2.equals(",")) {
					goods_id1 = goods_id1.substring(0, goods_id1.length() - 1);
				}
				sql.append(" and goods_id in (").append(goods_id1).append(")");
			}
			
			if(StringUtils.isNotBlank(chain_customer_id1)){
				String str2 = chain_customer_id1.substring(chain_customer_id1.length() - 1);
				if (str2.equals(",")) {
					chain_customer_id1 = chain_customer_id1.substring(0, chain_customer_id1.length() - 1);
				}
				sql.append(" and chain_customer_id  in (").append(chain_customer_id1).append(")");
			}
			
			List<TargetGoodsToGoods> list = TargetGoodsToGoodsFactory.getInstance().getObjectsForString(sql.toString(), employee);
			List<TargetGoodsToGoods> pageList = PageUtil.getPageList(pageNumber, pageSize, list);
			List<JSONObject> dataList = new ArrayList<>();
			for (TargetGoodsToGoods targetGoodsToGoods : pageList) {
				JSONObject object = new JSONObject();
				object.put("id", targetGoodsToGoods.get("id"));
				Integer chain_customer_id = targetGoodsToGoods.get("chain_customer_id");
				Integer goods_id = targetGoodsToGoods.get("goods_id");
				ChainCustomer chainCustomer = ChainCustomerFactory.getInstance().getObject("id", chain_customer_id);
				Goods goods = GoodsFactory.getInstance().getObject("id", goods_id);
				if(chainCustomer!=null){
					object.put("chain_customer_name", chainCustomer.get("china_customer_name"));
				}else{
					object.put("chain_customer_name", "");//连锁客户名称
				}
				
				if(goods!=null){
					object.put("goods_name", goods.get("goods_name"));//产品名称
					object.put("specification", goods.get("specification"));//产品规格
					object.put("goods_id", goods.get("id"));//系统产品ID
				}else{
					object.put("goods_name", "");//产品名称
					object.put("goods_id", "");//系统产品ID
					object.put("specification", "");//产品规格
				}
				object.put("id", targetGoodsToGoods.get("id"));
				object.put("chain_customer_id", chain_customer_id);
				object.put("target_goods_id", targetGoodsToGoods.get("target_goods_id"));//客户产品ID
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
		log.trace("开始新增产品配置...");
		try{
			DBHelper dbHelper = DBHelperFactory.getDBHelper();
			boolean ifag = true;
			Integer chain_customer_id = Integer.valueOf(dataJson.get("chain_customer_id").toString());
			Integer goods_id = Integer.valueOf(dataJson.get("goods_id").toString());
			String target_goods_id = dataJson.get("target_goods_id").toString();
			
			StringBuilder sql = new StringBuilder();
			sql.append(" where goods_id = ").append(goods_id)
			.append(" and chain_customer_id = ").append(chain_customer_id);
			List<TargetGoodsToGoods> targetGoodsToGoodsList = TargetGoodsToGoodsFactory.getInstance().getObjectsForString(sql.toString(), employee);
			sql.delete(0, sql.length());
			sql.append(" where chain_customer_id = ").append(chain_customer_id)
			.append(" and target_goods_id = ").append(dbHelper.getString(target_goods_id));
			List<TargetGoodsToGoods> targetGoodsToGoodsList2 = TargetGoodsToGoodsFactory.getInstance().getObjectsForString(sql.toString(), employee);
			if(targetGoodsToGoodsList.size()>0){
				writer.print(ErrorCode.GOODSID_IS_ADD);//记录已存在！
				return;
			}else if(targetGoodsToGoodsList2.size()>0){
				writer.print(ErrorCode.TARGET_GOODS_ID_IS_USE);//该客户产品ID已经被使用!
				return;
			}
			
			TargetGoodsToGoods targetGoodsToGoods = TargetGoodsToGoodsFactory.getInstance().getNewObject(employee);
			targetGoodsToGoods.set("chain_customer_id", chain_customer_id);
			targetGoodsToGoods.set("goods_id", goods_id);
			targetGoodsToGoods.set("target_goods_id", target_goods_id);
			ifag = targetGoodsToGoods.flash();
			if(ifag){
				writer.print(new SuccessJSON("msg", "新增产品配置成功！"));
				log.trace("新增产品配置成功！...");
			}else{
				writer.print(ErrorCode.ADD_ERROR);
				log.trace("新增产品配置失败！...");
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
		log.trace("新增产品配置结束");
	}
	
	
	@Override
	protected void load() {
		try{
			Integer id = Integer.valueOf(dataJson.get("id").toString());
			TargetGoodsToGoods targetGoodsToGoods = TargetGoodsToGoodsFactory.getInstance().getObject("id", id);
			if(targetGoodsToGoods==null){
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}
			
			JSONObject object = new JSONObject();
			object.put("chain_customer_id", targetGoodsToGoods.get("chain_customer_id"));
			object.put("goods_id", targetGoodsToGoods.get("goods_id"));
			object.put("target_goods_id", targetGoodsToGoods.get("target_goods_id"));
			object.put("id", targetGoodsToGoods.get("id"));
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
	protected void delete() {
		log.trace("开始删除产品配置...");
		try{
			Integer id = Integer.valueOf(dataJson.get("id").toString());
			TargetGoodsToGoods targetGoodsToGoods = TargetGoodsToGoodsFactory.getInstance().getObject("id", id);
			if(targetGoodsToGoods==null){
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}
			
			targetGoodsToGoods.delete();
			writer.print(new SuccessJSON("msg", "删除产品配置成功！"));
			log.trace("删除产品配置结束...");
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
		log.trace("开始修改产品配置...");
		try{
			DBHelper dbHelper = DBHelperFactory.getDBHelper();
			boolean ifag = true;
			String chain_customer_id_sql = "";
			Integer id = Integer.valueOf(dataJson.get("id").toString());
			String chain_customer_id = dataJson.getString("chain_customer_id");
			String goods_id = dataJson.getString("goods_id");
			String target_goods_id = dataJson.getString("target_goods_id");
			TargetGoodsToGoods targetGoodsToGoods = TargetGoodsToGoodsFactory.getInstance().getObject("id", id);
			if(targetGoodsToGoods==null){
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}
			
			
			if(StringUtils.isNotBlank(chain_customer_id)){
				chain_customer_id_sql = chain_customer_id;
			}else{
				chain_customer_id_sql = targetGoodsToGoods.get("chain_customer_id").toString();
			}
			StringBuilder sql = new StringBuilder();
			Integer oldGoods_id = targetGoodsToGoods.get("goods_id");
			String old_target_goods_id = targetGoodsToGoods.get("target_goods_id");
			if(StringUtils.isNotBlank(goods_id) && !goods_id.equals(oldGoods_id)){
				sql.append(" where goods_id = ").append(goods_id)
				.append(" and chain_customer_id = ").append(chain_customer_id_sql);
				List<TargetGoodsToGoods> targetGoodsToGoodsList = TargetGoodsToGoodsFactory.getInstance().getObjectsForString(sql.toString(), employee);
				sql.delete(0, sql.length());
				if(targetGoodsToGoodsList.size()>0){
					writer.print(ErrorCode.GOODSID_IS_ADD);//记录已存在！
					return;
				}
			}
			
			if(StringUtils.isNotBlank(target_goods_id) && !target_goods_id.equals(old_target_goods_id)){
				sql.append(" where chain_customer_id = ").append(chain_customer_id_sql)
				.append(" and target_goods_id = ").append(dbHelper.getString(target_goods_id));
				List<TargetGoodsToGoods> targetGoodsToGoodsList2 = TargetGoodsToGoodsFactory.getInstance().getObjectsForString(sql.toString(), employee);
				if(targetGoodsToGoodsList2.size()>0){
					writer.print(ErrorCode.TARGET_GOODS_ID_IS_USE);//该客户产品ID已经被使用!
					return;
				}
			}
			
			if(StringUtils.isNotBlank(chain_customer_id)){
				targetGoodsToGoods.set("chain_customer_id", chain_customer_id);
			}
			
			if(StringUtils.isNotBlank(goods_id)){
				targetGoodsToGoods.set("goods_id", goods_id);
			}
			
			if(StringUtils.isNotBlank(target_goods_id)){
				targetGoodsToGoods.set("target_goods_id", target_goods_id);
			}
			
			ifag = targetGoodsToGoods.flash();
			if(ifag){
				writer.print(new SuccessJSON("msg", "修改产品配置成功！"));
				log.trace("修改产品配置成功！...");
			}else{
				writer.print(ErrorCode.UPDATE_ERROR);
				log.trace("修改产品配置失败！...");
			}
			log.trace("修改产品配置结束...");
		}catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		}catch (NumberFormatException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.UPDATE_ERROR);
		}
	}
	
	
	@Override
	protected void fileUpload(HttpServletRequest request, HttpServletResponse response) {
		try{
			List<TargetGoodsToGoods> list = TargetGoodsToGoodsFactory.getInstance().getAllObjects(employee);
			List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
			for (TargetGoodsToGoods targetGoodsToGoods : list) {
				Map<String,Object> map = new HashMap<>();
				Integer chain_customer_id = targetGoodsToGoods.get("chain_customer_id");
				Integer goods_id = targetGoodsToGoods.get("goods_id");
				ChainCustomer chainCustomer = ChainCustomerFactory.getInstance().getObject("id", chain_customer_id);
				Goods goods = GoodsFactory.getInstance().getObject("id", goods_id);
				if(chainCustomer!=null){
					map.put("连锁客户名称", chainCustomer.get("china_customer_name"));
				}else{
					map.put("连锁客户名称", "");//连锁客户名称
				}
				
				if(goods!=null){
					map.put("产品名称", goods.get("goods_name"));//产品名称
					map.put("系统产品ID", goods.get("id"));//系统产品ID
					map.put("产品规格", goods.get("specification"));//产品规格
				}else{
					map.put("产品名称", "");//产品名称
					map.put("系统产品ID", "");//系统产品ID
					map.put("产品规格", "");//产品规格
				}
				
				map.put("客户产品ID", targetGoodsToGoods.get("target_goods_id"));//客户产品ID
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
