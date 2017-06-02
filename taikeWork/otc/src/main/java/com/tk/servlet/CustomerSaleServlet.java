package com.tk.servlet;

import java.math.BigDecimal;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.PermissionEnum;
import com.tk.common.persistence.UserLookOverPermission;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.DateUtil;
import com.tk.common.util.ObjectUtil;
import com.tk.common.util.PageUtil;
import com.tk.object.ChainCustomer;
import com.tk.object.ChainCustomerFactory;
import com.tk.object.Customer;
import com.tk.object.CustomerFactory;
import com.tk.object.CustomerSale;
import com.tk.object.CustomerSaleFactory;
import com.tk.object.Goods;
import com.tk.object.GoodsFactory;
import com.tk.object.TargetCustomerToCustomer;
import com.tk.object.TargetCustomerToCustomerFactory;
import com.tk.object.TargetGoodsToGoods;
import com.tk.object.TargetGoodsToGoodsFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

/***
 * 门店销售数据
 * @author Administrator
 *
 */
@WebServlet("/customerSale.do")
public class CustomerSaleServlet extends BaseServlet {

	protected static Logger log = LogManager.getLogger(CustomerSaleServlet.class.getName());
	private Integer pageSize;
	private Integer pageNumber;

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.query, PermissionEnum.CUSTOM_SAIL_QUERY);
		handlePermission.put(ControlType.fileImport, PermissionEnum.CUSTOM_SAIL_IMPORT);
		handlePermission.put(ControlType.fileExport, PermissionEnum.CUSTOM_SAIL_UPLOAD);
	}


	/****
	 * 查询门店销售数据列表
	 */
	@Override
	protected void query() {
		try{
			DBHelper dbHelper = DBHelperFactory.getDBHelper();
			pageSize = dataJson.getInteger("pageSize");
			pageNumber = dataJson.getInteger("pageNumber");
			String startTime = dataJson.getString("startTime");
			String name = dataJson.getString("name");
			String endTime = dataJson.getString("endTime");
			String customerId = dataJson.getString("customer_id");
			String goodsId = dataJson.getString("goods_id");
			StringBuilder sql = new StringBuilder(" where 1 = 1 ");
			StringBuilder sql2 = new StringBuilder(" select sum(goods_saleMoney) from customer_sale ");
			SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
			if (StringUtils.isNotBlank(name)) {
				sql.append(" and ( ");
				sql.append(" exists(select * from goods a where t.goods_id = a.id ")
				.append(" and a.goods_name like ").append(dbHelper.getString("%"+name+"%")).append(")");
				sql.append(" or exists(select * from customer b ")
				.append("left join chain_customer c on b.chain_customer_id = c.id where b.id = t.customer_id ")
				.append("  and (b.customer_name like ").append(dbHelper.getString("%"+name+"%"))
				.append("  or c.china_customer_name like ").append(dbHelper.getString("%"+name+"%")).append(")");
				sql.append(" ))");
			}
			
			StringBuilder goodsIds = new StringBuilder();
			UserLookOverPermission userLookOverPermission = employee.getUserLookOverPermission();
			boolean ifag = true;
			if(userLookOverPermission!=null){
				Set<Integer> set = userLookOverPermission.get("goods");
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
			

			if(StringUtils.isNotBlank(customerId)){
				String str2 = customerId.substring(customerId.length() - 1);
				if (str2.equals(",")) {
					customerId = customerId.substring(0, customerId.length() - 1);
				}
				sql.append(" and customer_id in ( ").append(customerId).append(")");
			}
			
			
			if(StringUtils.isNotBlank(goodsId)){
				String str2 = goodsId.substring(goodsId.length() - 1);
				if (str2.equals(",")) {
					goodsId = goodsId.substring(0, goodsId.length() - 1);
				}
				sql.append(" and goods_id in ( ").append(goodsId).append(")");
			}else{
				if(ifag){
					sql.append(" and goods_id in(").append(goodsIds.toString()).append(")");
				}
			}

			if (StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)) {
				Date startTimeDate = format.parse(startTime);
				Date endTimeDate = format.parse(endTime);
				sql.append(" and sale_time between " + dbHelper.getString(startTimeDate) + "  and " + dbHelper.getString(endTimeDate));
				sql2.append(" where  sale_time between " + dbHelper.getString(startTimeDate) + "  and " + dbHelper.getString(endTimeDate));
			}


			List<CustomerSale> list = CustomerSaleFactory.getInstance().getObjectsForString(sql.toString(), employee);
			List<CustomerSale> pageList = PageUtil.getPageList(pageNumber, pageSize, list);
			List<JSONObject> dataList = new ArrayList<>();
			for (CustomerSale chainCustomerSale : pageList) {
				JSONObject object = new JSONObject();
				Integer customer_id = (Integer)chainCustomerSale.get("customer_id");
				if(customer_id!=null){
					Customer customer = CustomerFactory.getInstance().getObject("id", customer_id);
					Integer chain_customer_id = (Integer)customer.get("chain_customer_id");
					ChainCustomer chainCustomer = ChainCustomerFactory.getInstance().getObject("id", chain_customer_id);
					object.put("china_customer_name", chainCustomer==null?"":chainCustomer.get("china_customer_name"));
					object.put("customer_name", customer==null?"":customer.get("customer_name"));
				}else{
					object.put("customer_name", "");//门店客户名称
					object.put("china_customer_name", "");//连锁名称
				}

				Long goods_id = (Long)chainCustomerSale.get("goods_id");
				if(goods_id!=null){
					Goods goods = GoodsFactory.getInstance().getObject("id", goods_id);
					object.put("goods_name", goods==null?"":goods.get("goods_name"));
					object.put("specification", goods.get("specification"));//产品规格
				}else{
					object.put("goods_name", "");//产品名称
					object.put("specification", "");//产品规格
				}

				object.put("goods_num", chainCustomerSale.get("goods_num"));//产品数量
				object.put("goods_price", ObjectUtil.convert(chainCustomerSale.get("goods_price")));//产品价格
				object.put("goods_saleMoney", ObjectUtil.convert(chainCustomerSale.get("goods_saleMoney")));//产品销售额
				object.put("sale_time", DateUtil.formatDate(chainCustomerSale.get("sale_time"), Constant.DATEFORMAT));//销售时间
				dataList.add(object);
			}

			BigDecimal saleMoneyTotal = (BigDecimal)dbHelper.selectOneValues(sql2.toString());
			SuccessJSON success = new SuccessJSON();
			if(saleMoneyTotal!=null){
				success.put("saleMoneyTotal", ObjectUtil.convert(saleMoneyTotal.doubleValue()));//总销售额
			}else{
				success.put("saleMoneyTotal", "0.00");//总销售额
			}
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


	/***
	 * 导入销售数据
	 */
	@Override
	protected void fileImport(HttpServletRequest request) {
		log.trace("开始导入门店销售数据...");
		try {
			Collection<Map> importExcel = getImportDataMap(request);
			if (importExcel == null) {
				return;
			}

			boolean ifag = true;
			if(!importValidate(importExcel)){
				return;
			}

			Integer chain_customer_id = Integer.valueOf(dataJson.get("chain_customer_id").toString());//连锁客户ID
			String target_customer_id_tile = "门店ID";
			String target_goods_id_title = "产品ID";
			String sale_time_title = "销售时间";
			String goods_num_title = "数量";
			String goods_price_title = "单价";
			String goods_saleMoney_title = "销售额";
			DBHelper dbHelper = DBHelperFactory.getDBHelper();
			StringBuilder sql = new StringBuilder();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日hh时mm分");
			Integer target_customer_id;
			Date sale_time;
			String goods_price,goods_saleMoney,goods_num,target_goods_id;

			for (Map map : importExcel) {
				target_customer_id = Integer.valueOf(map.get(target_customer_id_tile).toString());
				target_goods_id= (String)map.get(target_goods_id_title);
				sale_time = sdf.parse((String)map.get(sale_time_title));
				goods_num = (String)map.get(goods_num_title);
				goods_price = (String)map.get(goods_price_title);
				goods_saleMoney = (String)map.get(goods_saleMoney_title);

				sql.delete(0, sql.length());//清空字符串
				sql.append(" left join customer b on t.customer_id = b.id where b.chain_customer_id = ")
								.append(chain_customer_id).append(" and t.target_customer_id = ").append(dbHelper.getString(target_customer_id));
				List<TargetCustomerToCustomer> targetCustomerToCustomerList = TargetCustomerToCustomerFactory.getInstance().getObjectsForString(sql.toString(), employee);
				sql.delete(0, sql.length());//清空字符串
				sql.append(" where chain_customer_id = ").append(chain_customer_id)
								.append(" and target_goods_id = ").append(dbHelper.getString(target_goods_id));
				List<TargetGoodsToGoods> targetGoodsToGoodsList = TargetGoodsToGoodsFactory.getInstance().getObjectsForString(sql.toString(), employee);
				if(targetCustomerToCustomerList.size()>0 && targetGoodsToGoodsList.size()>0){
					TargetCustomerToCustomer targetCustomerToCustomer = targetCustomerToCustomerList.get(0);
					CustomerSale customerSale = CustomerSaleFactory.getInstance().getNewObject(employee);
					TargetGoodsToGoods targetGoodsToGoods = targetGoodsToGoodsList.get(0);
					if(targetGoodsToGoods!=null && targetCustomerToCustomer!=null){
						customerSale.set("goods_id", targetGoodsToGoods.get("goods_id"));
						customerSale.set("customer_id", targetCustomerToCustomer.get("customer_id"));
						customerSale.set("goods_num", goods_num);
						customerSale.set("goods_price", goods_price);
						customerSale.set("goods_saleMoney", goods_saleMoney);
						customerSale.set("sale_time", sale_time);
						ifag = customerSale.flash();
						if(!ifag){
							writer.print(ErrorCode.IMPORT_FILE_FAIL);
							return;
						}
					}
				}else{
					writer.print(ErrorCode.IMPORT_FILE_FAIL);
					return;
				}
			}

			if (ifag) {
				writer.print(new SuccessJSON("msg", "导入列表数据成功！"));
			} else if (importExcel.size() == 0) {
				writer.print(ErrorCode.IMPORT_FILE_ERRROR.setMessage("请在模板中填写内容！"));
			} else {
				writer.print(ErrorCode.IMPORT_FILE_FAIL);
			}
			log.trace("导入销售数据结束...");
		} catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		}catch (NumberFormatException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			log.error("文件导入失败", e);
			writer.print(ErrorCode.IMPORT_FILE_FAIL);
		}
	}


	protected boolean importValidate(Collection<Map> importExcel) {
		try{
			DBHelper dbHelper = DBHelperFactory.getDBHelper();
			Integer chain_customer_id = Integer.valueOf(dataJson.get("chain_customer_id").toString());//连锁客户ID
			String target_customer_id_tile = "门店ID";
			String target_goods_id_title = "产品ID";
			String sale_time_title = "销售时间";
			String goods_num_title = "数量";
			String goods_price_title = "单价";
			String goods_saleMoney_title = "销售额";

			StringBuilder sql = new StringBuilder();
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日hh时mm分");
			String goods_price,goods_saleMoney,goods_num,target_goods_id,target_customer_id,sale_time;
			for (Map map : importExcel) {
				target_customer_id = map.get(target_customer_id_tile).toString();
				target_goods_id= (String)map.get(target_goods_id_title);
				sale_time = (String)map.get(sale_time_title);
				goods_num = (String)map.get(goods_num_title);
				goods_price = (String)map.get(goods_price_title);
				goods_saleMoney = (String)map.get(goods_saleMoney_title);


				if (StringUtils.isBlank(sale_time)) {
					//非空校验
					if (!vaditeImportNullDate(sale_time_title, map)) {
						return false;
					}
					return false;
				} else {
					//时间校验
					try {
						sdf.parse(sale_time);
					} catch (ParseException e) {
						getImportErrorMsg(0, sale_time_title, sale_time, map, "格式应该为yyyy年MM月dd日hh时mm分的格式,示例：2016年10月13日18时30分");
						return false;
					}
				}


				if (StringUtils.isBlank(goods_saleMoney)) {
					//非空校验
					if (!vaditeImportNullDate(goods_saleMoney_title, map)) {
						return false;
					}
					return false;
				} else {
					//小数校验
					try {
						Double.valueOf(goods_saleMoney);
					} catch (NumberFormatException e) {
						getImportErrorMsg(2, goods_saleMoney_title, goods_saleMoney, map, null);
						return false;
					}
				}

				if (StringUtils.isBlank(goods_price)) {
					//非空校验
					if (!vaditeImportNullDate(goods_price_title, map)) {
						return false;
					}
					return false;
				} else {
					//小数校验
					try {
						Double.valueOf(goods_price);
					} catch (NumberFormatException e) {
						getImportErrorMsg(2, goods_price_title, goods_price, map, null);
						return false;
					}
				}


				if (StringUtils.isBlank(goods_num)) {
					//非空校验
					if (!vaditeImportNullDate(goods_num_title, map)) {
						return false;
					}
					return false;
				} else {
					//整数校验
					try {
						Integer.valueOf(goods_num);
					} catch (NumberFormatException e) {
						getImportErrorMsg(2, goods_num_title, goods_num, map, null);
						return false;
					}
				}



				if (StringUtils.isBlank(target_customer_id)) {
					//非空校验
					if (!vaditeImportNullDate(target_customer_id_tile, map)) {
						return false;
					}
					return false;
				} else {
					sql.delete(0, sql.length());//清空字符串
					sql.append(" left join customer b on t.customer_id = b.id where b.chain_customer_id = ")
									.append(chain_customer_id).append(" and t.target_customer_id = ").append(dbHelper.getString(target_customer_id));
					List<TargetCustomerToCustomer> targetCustomerToCustomerList = TargetCustomerToCustomerFactory.getInstance().getObjectsForString(sql.toString(), employee);
					if (targetCustomerToCustomerList.size()==0) {
						getImportErrorMsg(4, target_customer_id_tile, target_customer_id, map, null);
						return false;
					}
				}


				if (StringUtils.isBlank(target_goods_id)) {
					//非空校验
					if (!vaditeImportNullDate(target_goods_id_title, map)) {
						return false;
					}
					return false;
				} else {
					sql.delete(0, sql.length());//清空字符串
					sql.append(" where chain_customer_id = ").append(chain_customer_id)
									.append(" and target_goods_id = ").append(dbHelper.getString(target_goods_id));
					List<TargetGoodsToGoods> targetGoodsToGoodsList = TargetGoodsToGoodsFactory.getInstance().getObjectsForString(sql.toString(), employee);
					if (targetGoodsToGoodsList.size()==0) {
						getImportErrorMsg(4, target_goods_id_title, target_goods_id, map, null);
						return false;
					}
				}

			}
		} catch (Exception e) {
			log.error("文件导入失败", e);
			writer.print(ErrorCode.IMPORT_FILE_FAIL);
			return false;
		}
		return true;
	}


	@Override
	protected void fileUpload(HttpServletRequest request, HttpServletResponse response) {
		try{
			List<CustomerSale> list = CustomerSaleFactory.getInstance().getAllObjects(employee);
			List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
			for (CustomerSale chainCustomerSale : list) {
				Map<String,Object> map = new HashMap<>();
				Integer customer_id = (Integer)chainCustomerSale.get("customer_id");
				if(customer_id!=null){
					Customer customer = CustomerFactory.getInstance().getObject("id", customer_id);
					map.put("门店客户名称", customer==null?"":customer.get("customer_name"));
				}else{
					map.put("门店客户名称", "");//门店客户名称
				}

				Long goods_id = (Long)chainCustomerSale.get("goods_id");
				if(goods_id!=null){
					Goods goods = GoodsFactory.getInstance().getObject("id", goods_id);
					map.put("产品名称", goods==null?"":goods.get("goods_name"));
				}else{
					map.put("产品名称", "");//产品名称
				}
				map.put("产品数量", chainCustomerSale.get("goods_num"));//产品数量
				map.put("产品价格", ObjectUtil.convert(chainCustomerSale.get("goods_price")));//产品价格
				map.put("销售额", ObjectUtil.convert(chainCustomerSale.get("goods_saleMoney")));//产品销售额
				map.put("销售时间", DateUtil.formatDate(chainCustomerSale.get("sale_time"), Constant.DATEFORMAT));
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
