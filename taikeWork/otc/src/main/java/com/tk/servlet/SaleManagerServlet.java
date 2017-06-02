package com.tk.servlet;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.PermissionEnum;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.DateUtil;
import com.tk.common.util.ObjectUtil;
import com.tk.common.util.PageUtil;
import com.tk.object.ChainCustomer;
import com.tk.object.ChainCustomerFactory;
import com.tk.object.Goods;
import com.tk.object.GoodsFactory;
import com.tk.object.SaleDetail;
import com.tk.object.SaleDetailFactory;
import com.tk.object.Supplier;
import com.tk.object.SupplierFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;


/***
 * 销售查询
 * @author Administrator
 *
 */
@WebServlet("/sale.do")
public class SaleManagerServlet extends BaseServlet {

	private int pageSize;
	private int pageNumber;
	private static Logger log = LogManager.getLogger(SaleManagerServlet.class.getName());

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.query, PermissionEnum.NH_SALE_QUERY);
		handlePermission.put(ControlType.fileExport, PermissionEnum.NH_SALE_EXPORT);
	}


	@Override
	protected void queryAll() {
		// TODO Auto-generated method stub

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
		log.trace("开始销售查询...");
		DBHelper dbHelper = DBHelperFactory.getSecondDBHelper("2");
		SimpleDateFormat format = new SimpleDateFormat(Constant.DATEFORMAT);
		ResultSet rs = null;
		try {
			pageSize = Integer.valueOf(dataJson.get("pageSize").toString());
			pageNumber = Integer.valueOf(dataJson.get("pageNumber").toString());

			String startTime = dataJson.getString("startTime");
			String endTime = dataJson.getString("endTime");
			String name = dataJson.getString("name");
			String supplierId = dataJson.getString("supplierId");
			String customerId = dataJson.getString("customerId");

			StringBuilder sql = new StringBuilder();
			StringBuilder goodsIds = new StringBuilder();
			List<Goods> goodsList = GoodsFactory.getInstance().getAllObjects(employee);
			for (Goods goods : goodsList) {
				goodsIds.append(goods.get("id") + ",");
			}

			if (goodsIds.length() > 0) {
				goodsIds.delete(goodsIds.length() - 1, goodsIds.length());
				sql.append("select a.wholesaleprice,a.salesdtlid,a.credate,a.customid,a.customname,a.entryid,a.goodsid,a.goodsname,")
								.append(" a.goodstype,a.factoryid,a.factoryname,a.goodsunit,a.goodsqty,a.resaleprice,a.unitprice,b.costprice costprice1,")
								.append(" '' costprice2,'' costprice3,a.total_line,a.goodsqty*b.COSTPRICE costtotal1,'' costtotal2,'' costtotal3")
								.append(" from NHERPUSER.BMS_SA_DTLQRY_V a,NHERPUSER.bms_sk_costingprice_lst_v b")
								.append(" where a.entryid=1 and a.goodsid=b.GOODSID  and b.entryid=1 and a.goodsid in (" + goodsIds + ")");
			} else {
				writer.print(new SuccessJSON("msg", "暂无数据！"));
				return;
			}

			if (StringUtils.isNotBlank(name)) {
				name = name.trim();
				String str = name.substring(name.length() - 1);
				if (str.equals(",")) {
					name = name.substring(0, name.length() - 1);
				}
				String[] split3 = name.split(",");
				boolean ifag = true;
				if(split3.length==0){
					ifag = false;
				}
				for (String id : split3) {
					//判断是否整数
					if(!id.matches("[0-9]+")){
						ifag = false;
						break;
					}
				}
				
				if(ifag){
					sql.append(" and a.goodsid in (").append(name).append(")");
				}else{
					sql.append(" and ( a.goodsname like " + dbHelper.getString("%" + name + "%"));
					sql.append(" or a.customname like  " + dbHelper.getString("%" + name + "%"));
					sql.append(" or a.factoryname like " + dbHelper.getString("%" + name + "%") + " ) ");
				}
			}

			//如果选择了供应商,则查询，否则查询有权限的的供应商
			if (StringUtils.isNotBlank(supplierId)) {
				String str = supplierId.substring(supplierId.length()-1);
				if(str.equals(",")){
					supplierId = supplierId.substring(0,supplierId.length()-1);
				}
				sql.append(" and factoryid in (").append(supplierId).append(")");
			} else {
				//获得到供应商id
				StringBuffer supplierIds = new StringBuffer();
				List<Supplier> supplierList = SupplierFactory.getInstance().getAllObjects(employee);
				for (Supplier supplier : supplierList) {
					supplierIds.append(supplier.get("id") + ",");
				}
				if (supplierIds.length() > 0) {
					supplierIds.delete(supplierIds.length() - 1, supplierIds.length());
					sql.append(" and a.factoryid in (").append(supplierIds).append(")");
				}
			}

			if (StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)) {
				Date startTimeDate = format.parse(startTime);
				Date endTimeDate = format.parse(endTime);
				sql.append(" and a.credate between " + dbHelper.getString(startTimeDate) + "  and " + dbHelper.getString(endTimeDate));
			}
			
			
			if (StringUtils.isNotBlank(customerId)) {
				String str = customerId.substring(customerId.length()-1);
				if(str.equals(",")){
					supplierId = customerId.substring(0,customerId.length()-1);
				}
				sql.append(" and a.customid in (").append(customerId).append(")");
			}

			sql.append(" order by a.credate asc ");

			List<JSONObject> list = new ArrayList<>();
			rs = dbHelper.select(sql.toString());
			Double countCostPrice1 = 0.0;//总开票价
			Double countRetails = 0.0;//总零售价
			Double countRetailsCostPrice = 0.0;//总零售成本价
			Double countWholesaleprice = 0.0;//总批发价
			Double countCosttotal2 = 0.0;//总销售成本2
			Double countCosttotal3 = 0.0;//总销售成本3
			Double sellingMoney = 0.0;//总销售价

			Double costtotal1;//开票价
			Double totalLine;//总金额
			Double retails;//零售价
			Double retailsCostPrice;//零售成本价
			Double wholesaleprice;//零售成本价
			while (rs.next()) {
				JSONObject object = new JSONObject();
				String goodsName = rs.getObject("goodsid") + "/" + rs.getObject("goodsname") + "/" + rs.getObject("goodstype");
				object.put("unitprice", ObjectUtil.convert(rs.getDouble("unitprice")));//开票价
				object.put("retails", ObjectUtil.convert(rs.getDouble("resaleprice")));//零售价
				object.put("retailsCostPrice", ObjectUtil.convert(rs.getDouble("costprice1")));//零售成本价
				object.put("costPrice2", "");//成本价2
				object.put("costPrice3", "");//成本价3
				object.put("salesVolume", rs.getObject("goodsqty"));
				object.put("goodsId", rs.getObject("goodsid"));
				object.put("id", rs.getObject("salesdtlid"));
				object.put("goodsName", goodsName);
				object.put("goodstype", rs.getObject("goodstype"));
				object.put("supplier", rs.getObject("factoryname"));//供应商
				Date date = rs.getTimestamp("credate");
				object.put("saleTme", DateUtil.formatDate(date, Constant.DATEFORMAT));//创建时间
				object.put("sellingPrice", ObjectUtil.convert(rs.getDouble("wholesaleprice")));//批发价
				object.put("sellingMoney", ObjectUtil.convert(rs.getDouble("total_line")));//销售价
				object.put("operatorId", "");
				object.put("operatorName", "");
				object.put("customerName", rs.getObject("customid") + rs.getString("customname"));//连锁客户

				//计算总开票价
				costtotal1 = rs.getDouble("unitprice");
				if (costtotal1 != null) {
					countCostPrice1 += costtotal1;
				}

				//计算总零售价
				retails = rs.getDouble("resaleprice");
				if (countRetails != null) {
					countRetails += retails;
				}

				//计算总零售成本价
				retailsCostPrice = rs.getDouble("costprice1");
				if (countRetails != null) {
					countRetailsCostPrice += retailsCostPrice;
				}

				//计算总批发价
				wholesaleprice = rs.getDouble("wholesaleprice");
				if (countRetails != null) {
					countWholesaleprice += wholesaleprice;
				}

				//计算总金额
				totalLine = rs.getDouble("total_line");
				if (totalLine != null) {
					sellingMoney += totalLine;
				}
				list.add(object);
			}

			Map<String, String> dataMap = new HashMap<String, String>();
			dataMap.put("costPrice2", "cost_price2");
			dataMap.put("costPrice3", "cost_price3");
			Map<String, String> permission = new HashMap<>();
			SaleDetail newSaleDetail = SaleDetailFactory.getInstance().getNewObject(employee);
			if (newSaleDetail.canViewField(employee, "cost_price2")) {
				permission.put("cost_price2", "true");
			} else {
				permission.put("cost_price2", "false");
			}

			if (newSaleDetail.canViewField(employee, "cost_price3")) {
				permission.put("cost_price3", "true");
			} else {
				permission.put("cost_price3", "false");
			}

			for (JSONObject object : list) {
				Integer id = Integer.valueOf(object.get("id").toString());
				SaleDetail saleDetail = SaleDetailFactory.getInstance().getObject("id", id);
				if (saleDetail != null) {
					for (String key : dataMap.keySet()) {
						String value = dataMap.get(key);
						if (saleDetail.canViewField(employee, value)) {//是否显示列的值
							if (key.equals("costPrice3") || key.equals("costPrice2")) {
								if (saleDetail.get(value) != null) {
									if(key.equals("costPrice3")){
										BigDecimal salesVolume = (BigDecimal) object.get("salesVolume");//销售数量
										countCosttotal2+=ObjectUtil.convert((Double)saleDetail.get(value)*salesVolume.intValue());
									}else if(key.equals("costPrice2")){
										BigDecimal salesVolume = (BigDecimal) object.get("salesVolume");//销售数量
										countCosttotal3+=ObjectUtil.convert((Double)saleDetail.get(value)*salesVolume.intValue());
									}
									object.put(key, ObjectUtil.convert((Double) saleDetail.get(value)));
								} else {
									object.put(key, "");
								}
							}
						}
					}
				}
			}
			
			List<JSONObject> subList = PageUtil.getPageList(pageNumber, pageSize, list);

			SuccessJSON success = new SuccessJSON();
			success.put("count", list.size());
			success.put("saleList", subList);
			success.put("permission", permission);
			success.put("saleCountMoeny", ObjectUtil.convert(sellingMoney));//总销售额
			success.put("countCostPrice1", ObjectUtil.convert(countCostPrice1));//总开票价
			success.put("countCostPrice2", ObjectUtil.convert(countCosttotal2));//总成本价2
			success.put("countCostPrice3", ObjectUtil.convert(countCosttotal3));//总成本价3

			/*success.put("countMoeny1", ObjectUtil.convert(sellingMoney - countCostPrice1));//总盈亏1
			success.put("countMoeny2", ObjectUtil.convert(sellingMoney - countCosttotal2));//总盈亏2
			success.put("countMoeny3", ObjectUtil.convert(sellingMoney - countCosttotal3));//总盈亏3*/

			success.put("countRetails", ObjectUtil.convert(countRetails));//总零售价
			success.put("countRetailsCostPrice", ObjectUtil.convert(countRetailsCostPrice));//总零售成本价
			success.put("countWholesaleprice", ObjectUtil.convert(countWholesaleprice));//总批发价

			writer.print(success);
			log.trace("销售查询结束...");
		} catch (SQLException e) {
			log.error("sql语句异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		} catch (NullPointerException | ParseException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} finally {
			dbHelper.close(rs);
		}

	}


	@Override
	protected void load() {

	}

	@Override
	protected void add() {

	}

	@Override
	protected void fileUpload(HttpServletRequest request, HttpServletResponse response) {
		log.trace("开始导出销售查询...");
		DBHelper dbHelper = DBHelperFactory.getSecondDBHelper("2");
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		ResultSet rs = null;
		try {
				String startTime = dataJson.getString("startTime");
				String endTime = dataJson.getString("endTime");
				String supplierId = dataJson.getString("supplierId");
				String customerId = dataJson.getString("customerId");

				StringBuilder sql = new StringBuilder();
				StringBuilder goodsIds = new StringBuilder();
				List<Goods> goodsList = GoodsFactory.getInstance().getAllObjects(employee);
				for (Goods goods : goodsList) {
					goodsIds.append(goods.get("id") + ",");
				}

				if (goodsIds.length() > 0) {
					goodsIds.delete(goodsIds.length() - 1, goodsIds.length());
					sql.append("select a.wholesaleprice,a.salesdtlid,a.credate,a.customid,a.customname,a.entryid,a.goodsid,a.goodsname,")
									.append(" a.goodstype,a.factoryid,a.factoryname,a.goodsunit,a.goodsqty,a.resaleprice,a.unitprice,b.costprice costprice1,")
									.append(" '' costprice2,'' costprice3,a.total_line,a.goodsqty*b.COSTPRICE costtotal1,'' costtotal2,'' costtotal3")
									.append(" from NHERPUSER.BMS_SA_DTLQRY_V a,NHERPUSER.bms_sk_costingprice_lst_v b")
									.append(" where a.entryid=1 and a.goodsid=b.GOODSID  and b.entryid=1 and a.goodsid in (" + goodsIds + ")");
				} else {
					writer.print(new SuccessJSON("msg", "暂无数据！"));
					return;
				}
			

				//如果选择了供应商,则查询，否则查询有权限的的供应商
				if (StringUtils.isNotBlank(supplierId)) {
					String str = supplierId.substring(supplierId.length()-1);
					if(str.equals(",")){
						supplierId = supplierId.substring(0,supplierId.length()-1);
					}
					sql.append(" and factoryid in (").append(supplierId).append(")");
				} else {
					//获得到供应商id
					StringBuffer supplierIds = new StringBuffer();
					List<Supplier> supplierList = SupplierFactory.getInstance().getAllObjects(employee);
					for (Supplier supplier : supplierList) {
						supplierIds.append(supplier.get("id") + ",");
					}
					if (supplierIds.length() > 0) {
						supplierIds.delete(supplierIds.length() - 1, supplierIds.length());
						sql.append(" and a.factoryid in (").append(supplierIds).append(")");
					}
				}

				if (StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)) {
					Date startTimeDate = format.parse(startTime);
					Date endTimeDate = format.parse(endTime);
					sql.append(" and a.credate between " + dbHelper.getString(startTimeDate) + "  and " + dbHelper.getString(endTimeDate));
				}
				
				
				if (StringUtils.isNotBlank(customerId)) {
					String str = customerId.substring(customerId.length()-1);
					if(str.equals(",")){
						supplierId = customerId.substring(0,customerId.length()-1);
					}
					sql.append(" and a.customid in (").append(customerId).append(")");
				}

				sql.append(" order by a.credate asc ");


			List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
			rs = dbHelper.select(sql.toString());
			while (rs.next()) {
				Map<String, Object> map = new LinkedHashMap<String, Object>();
				map.put("销售成本1", rs.getObject("costprice1"));
				map.put("销售成本2", "");
				map.put("销售成本3", "");
				map.put("数量", rs.getObject("goodsqty"));
				map.put("ID号", rs.getObject("salesdtlid"));
				map.put("批次", rs.getObject("salesdtlid"));
				map.put("品名", rs.getObject("goodsname"));
				map.put("规格", rs.getObject("goodstype"));
				map.put("供应商", rs.getObject("factoryname"));
				map.put("业务时间", rs.getObject("credate"));
				map.put("单价", rs.getObject("unitprice"));
				map.put("金额", rs.getObject("total_line"));
				list.add(map);
			}

			if (list.size() > 0) {
				exportListData(list);
				log.trace("导出列表数据结束...");
			} else {
				log.trace("暂无数据！");
				writer.print(new SuccessJSON("msg", "暂无数据！"));
			}

		} catch (SQLException e) {
			log.error("sql语句异常！", e);
			writer.print(ErrorCode.EXPORT_FILE_FAIL);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.EXPORT_FILE_FAIL);
		} finally {
			dbHelper.close(rs);
		}

	}

}
