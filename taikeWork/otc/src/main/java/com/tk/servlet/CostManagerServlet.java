package com.tk.servlet;



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
import com.tk.common.persistence.WriteValueException;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.DateUtil;
import com.tk.common.util.ObjectUtil;
import com.tk.common.util.PageUtil;
import com.tk.object.ChainCustomer;
import com.tk.object.ChainCustomerFactory;
import com.tk.object.Employee;
import com.tk.object.EmployeeFactory;
import com.tk.object.Goods;
import com.tk.object.GoodsFactory;
import com.tk.object.SaleDetail;
import com.tk.object.SaleDetailFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

/***
 * 成本管理
 * @author Administrator
 *
 */
@WebServlet("/cost.do")
public class CostManagerServlet extends BaseServlet{
	
	private int pageSize;
	private int pageNumber;
	private static Logger log = LogManager.getLogger(CostManagerServlet.class.getName());
	private SaleDetailFactory saleDetailFactory = SaleDetailFactory.getInstance(); 

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.update, PermissionEnum.COST_UPDATE);
		handlePermission.put(ControlType.load, PermissionEnum.COST_QUERY);
		handlePermission.put(ControlType.query, PermissionEnum.COST_QUERY);
		handlePermission.put(ControlType.fileExport, PermissionEnum.COST_EXPORT);
	}

	@Override
	protected void queryAll() {
		
	}

	@Override
	protected void delete() {
		
	}

	/****
	 * 修改多个成本价
	 */
	@Override
	protected void update() {
		log.trace("开始修改成本...");
		try {
			String ids = dataJson.getString("id");
			if(StringUtils.isNotBlank(ids)){
				String str2 = ids.substring(ids.length() - 1);
				if (str2.equals(",")) {
					ids = ids.substring(0, ids.length() - 1);
				}
				
				String[] idsArr = ids.split(",");
				List<Integer> idList = new ArrayList<>();
				for (String id : idsArr) {
					idList.add(Integer.valueOf(id));
				}
				
				for (Integer id : idList) {
					updateDetail(id);
				}
			}else{
				log.trace(ErrorCode.GET_FONT_END_INFO_ERROR);
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}
			
			writer.print(new SuccessJSON().put("msg","修改成本成功！"));
			log.trace("修改成本结束...");
		} catch (WriteValueException e) {
			log.error("写入数据值异常！", e);
			writer.print(ErrorCode.UPDATE_ERROR);
		}catch (NullPointerException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		}catch (NumberFormatException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		}catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.UPDATE_ERROR);
		}
	}
	
	/****
	 * 修改单个成本价
	 * @param id
	 * @throws WriteValueException
	 */
	private void updateDetail(Integer id) throws WriteValueException{
		SaleDetail detail = saleDetailFactory.getObject("id", id);
		Double costPrice2 = null;
		Double costPrice3 = null;
		
		if(StringUtils.isNotBlank(dataJson.getString("costPrice2"))){
			costPrice2 = Double.valueOf(dataJson.getString("costPrice2"));
		}
		
		if(StringUtils.isNotBlank(dataJson.getString("costPrice3"))){
			costPrice3 = Double.valueOf(dataJson.getString("costPrice3"));
		}
		
		if(detail==null){
			detail = saleDetailFactory.getNewObject(employee);
			detail.set("id", id);
			detail.set("modify_prices", 1);
		}else{
			if(detail.get("modify_prices")!=null){
				detail.set("modify_prices", (Integer)detail.get("modify_prices")+1);
			}else{
				detail.set("modify_prices", 1);
			}
		}
		
		if(costPrice2!=null){
			detail.set("cost_price2", costPrice2);
		}
		
		if(costPrice3!=null){
			detail.set("cost_price3", costPrice3);
		}
		detail.set("operator_id",employee.get("id"));
		
		detail.set("operator_time", new Date());//记录操作时间
		detail.flash();
	}

	@Override
	protected void query() {
		log.trace("开始成本查询...");
		DBHelper dbHelper2 = DBHelperFactory.getSecondDBHelper("2");
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		ResultSet rs2 = null;
	 	try {
	 		pageSize =  dataJson.getInteger("pageSize");
		 	pageNumber = dataJson.getInteger("pageNumber");
		 	String startTime = dataJson.getString("startTime");
		 	String endTime = dataJson.getString("endTime");
		 	String name = dataJson.getString("name");
		 	
		 	StringBuilder ids = new StringBuilder();
		 	List<Goods> goodsList = GoodsFactory.getInstance().getAllObjects(employee);
		 	StringBuilder chainCustomerIds = new StringBuilder();
			for (Goods goods : goodsList) {
				ids.append(goods.get("id") + ",");
			}
			
			List<ChainCustomer> chainCustomerList = ChainCustomerFactory.getInstance().getAllObjects(employee);
			for (ChainCustomer chainCustomer : chainCustomerList) {
				chainCustomerIds.append(chainCustomer.get("id") + ",");
			}
		 	
		 	StringBuilder sql2 = new StringBuilder();
		 
		 	if (ids.length() > 0) {
				ids.delete(ids.length() - 1, ids.length());
				sql2.append("select a.wholesaleprice,a.salesdtlid,a.credate,a.customid,a.customname,a.entryid,a.goodsid,a.goodsname,")
				.append(" a.goodstype,a.factoryid,a.factoryname,a.goodsunit,a.goodsqty,a.resaleprice,a.unitprice,b.costprice costprice1,")
				.append(" '' costprice2,'' costprice3,a.total_line,a.goodsqty*b.COSTPRICE costtotal1,'' costtotal2,'' costtotal3")
				.append(" from NHERPUSER.BMS_SA_DTLQRY_V a,NHERPUSER.bms_sk_costingprice_lst_v b")
				.append(" where a.entryid=1 and a.goodsid=b.GOODSID and b.entryid=1 and a.goodsid in (" + ids + ")");
		 	}
		 	
			if (chainCustomerIds.length() > 0) {
				chainCustomerIds.delete(chainCustomerIds.length() - 1, chainCustomerIds.length());
				sql2.append(" and a.customid in (" + chainCustomerIds + ")");
			} else {
				writer.print(new SuccessJSON("msg", "暂无数据！"));
				return;
			}
		
			if(StringUtils.isNotBlank(name)){
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
					sql2.append(" and a.goodsid in (").append(name).append(")");
				}else{
					sql2.append(" and ( a.goodsname like " + dbHelper2.getString("%" + name + "%"));
					sql2.append(" or a.customname like  " + dbHelper2.getString("%" + name + "%"));
					sql2.append(" or a.factoryname like " + dbHelper2.getString("%" + name + "%") + " ) ");
				}
		 	}

		 	
		 	if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
		 		Date startTimeDate = format.parse(startTime);
		 		Date endTimeDate = format.parse(endTime);
		 		sql2.append(" and a.credate between ").append(dbHelper2.getString(startTimeDate))
		 		.append("  and ")
		 		.append(dbHelper2.getString(endTimeDate));
		 		/*sql2.append(" and a.credate>=to_date(").append(dbHelper2.getString(startTimeDate))
				 .append(",'yyyy-mm-dd') and a.credate<to_date(") .append(dbHelper2.getString(endTimeDate))
				 .append(",'yyyy-mm-dd') ");*/
		 	}
		 	
		 	List<JSONObject> list = new ArrayList<>();
		 	rs2 = dbHelper2.select(sql2.toString());
		 	while (rs2.next()) {
				JSONObject object  = new JSONObject();
				object.put("unitprice", ObjectUtil.convert(rs2.getDouble("unitprice")));//开票价
				object.put("retails", ObjectUtil.convert(rs2.getDouble("resaleprice")));//零售价
				object.put("retailsCostPrice", ObjectUtil.convert(rs2.getDouble("costprice1")));//零售成本价
				object.put("costPrice2", "");
				object.put("costPrice3", "");
				object.put("salesVolume", rs2.getObject("goodsqty"));//销售数量
				object.put("goodsId", rs2.getObject("goodsid"));//产品Id
				object.put("id", rs2.getObject("salesdtlid"));//批号
				object.put("goodsName", rs2.getObject("goodsname"));
				object.put("goodstype", rs2.getObject("goodstype"));
				object.put("supplier", rs2.getObject("factoryname"));//供应商
				object.put("saleTme", DateUtil.formatDate(rs2.getDate("credate"), Constant.DATEFORMAT));//创建时间
				object.put("sellingPrice", ObjectUtil.convert(rs2.getDouble("wholesaleprice")));//批发价
				object.put("sellingMoney", ObjectUtil.convert(rs2.getDouble("total_line")));//总金额
				object.put("operatorName", "");
				
				object.put("customerName", rs2.getString("customname"));
				list.add(object);
			}
			
			Map<String,String> dataMap = new HashMap<String,String>();
			dataMap.put("costPrice2", "cost_price2");
			dataMap.put("costPrice3", "cost_price3");
			dataMap.put("modifyPrices", "modify_prices");
			dataMap.put("operatorName", "operator_id");
			dataMap.put("operatorTime", "operator_time");
			
			
			
			
			List<JSONObject> subList = PageUtil.getPageList(pageNumber, pageSize, list);
			SuccessJSON success = new SuccessJSON();
			for (JSONObject object : subList) {
				SaleDetail saleDetail = saleDetailFactory.getObject("id", object.get("id"));
				if(saleDetail!=null){
					for (String key : dataMap.keySet()) {
						String value = dataMap.get(key);
						if(saleDetail.canViewField(employee, value)){//是否显示列的值
							if(key.equals("costPrice3") || key.equals("costPrice2")){
								if(saleDetail.get(value)!=null){
									object.put(key, ObjectUtil.convert((Double)saleDetail.get(value)));
								}else{
									object.put(key, "");
								}
							}else if(key.equals("operatorName")){
								Integer operator_id = (Integer)saleDetail.get(value);
								Employee emp = EmployeeFactory.getInstance().getObject("id", operator_id);
								object.put(key, emp==null?"":emp.get("real_name"));
							}else if(key.equals("operatorTime")){
								object.put(key, DateUtil.formatDate(saleDetail.get(value), Constant.DATEFORMAT)==null?"":
								DateUtil.formatDate(saleDetail.get(value), Constant.DATEFORMAT));
							}else{
								object.put(key, saleDetail.get(value)==null?"":saleDetail.get(value));
							}
						}
					}
				}
			}
			
			success.put("costList",subList);
			success.put("count",list.size());
			writer.print(success);
			log.trace("成本查询结束...");
		}catch (SQLException e) {
			log.error("sql语句异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}catch (NullPointerException | ParseException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		}catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}finally {
			dbHelper2.close(rs2);
		}
	 	
	 	
	 	

	 	
	}

	@Override
	protected void load() {
		log.trace("开始成本查询详情...");
		DBHelper dbHelper2 = DBHelperFactory.getSecondDBHelper("2");
		ResultSet rs2 = null;
	 	try {
	 		Integer id = Integer.valueOf(dataJson.get("id").toString());
	 	 	StringBuilder ids = new StringBuilder();
		 	List<Goods> goodsList = GoodsFactory.getInstance().getAllObjects(employee);
			for (Goods goods : goodsList) {
				ids.append(goods.get("id") + ",");
			}
		 	
		 	StringBuilder sql2 = new StringBuilder();
		 
		 	if (ids.length() > 0) {
				ids.delete(ids.length() - 1, ids.length());
				
				/*sql2.append("select a.salesdtlid,a.credate,a.customid,a.customname,a.entryid,a.goodsid,a.goodsname,"
					+ "a.goodstype,a.factoryid,a.factoryname,a.goodsunit,a.goodsqty,a.unitprice,b.costprice costprice1,"
					+ "'' costprice2,'' costprice3,a.total_line,a.goodsqty*b.COSTPRICE costtotal1,'' costtotal2,'' costtotal3 "
					+ "from nherpuser.BMS_SA_DTLQRY_V a,nherpuser.bms_sk_costingprice_lst_v b "
					+ "where a.entryid=1 and a.goodsid=b.GOODSID and b.entryid=1 and a.goodsid in ("+ids+")");*/
				
				sql2.append("select a.wholesaleprice,a.salesdtlid,a.credate,a.customid,a.customname,a.entryid,a.goodsid,a.goodsname,")
				.append(" a.goodstype,a.factoryid,a.factoryname,a.goodsunit,a.goodsqty,a.resaleprice,a.unitprice,b.costprice costprice1,")
				.append(" '' costprice2,'' costprice3,a.total_line,a.goodsqty*b.COSTPRICE costtotal1,'' costtotal2,'' costtotal3")
				.append(" from NHERPUSER.BMS_SA_DTLQRY_V a,NHERPUSER.bms_sk_costingprice_lst_v b")
				.append(" where a.entryid=1 and a.goodsid=b.GOODSID and b.entryid=1 and a.goodsid in (" + ids + ")");
		 	}
		 	
		 	rs2 = dbHelper2.select(sql2.toString());
		 	JSONObject object  = new JSONObject();
		 	if(rs2.next()) {
				object.put("costPrice1", rs2.getObject("unitprice"));//开票价
				object.put("costPrice2", "");
				object.put("costPrice3", "");
				object.put("salesVolume", rs2.getObject("goodsqty"));//销售数量
				object.put("goodsId", rs2.getObject("goodsid"));//产品Id
				object.put("id", rs2.getObject("salesdtlid"));//批号
				object.put("goodsName", rs2.getObject("goodsname"));
				object.put("goodstype", rs2.getObject("goodstype"));
				object.put("supplier", rs2.getObject("factoryname"));//供应商
				object.put("saleTme", rs2.getObject("credate"));//创建时间
				object.put("sellingPrice", rs2.getObject("unitprice"));//单价
				object.put("sellingMoney", rs2.getObject("wholesaleprice"));//批发价
				object.put("specification", rs2.getObject("goodstype"));//规格
				object.put("operatorName", "");
			}
			
			Map<String,String> dataMap = new HashMap<String,String>();
			dataMap.put("costPrice1", "cost_price1");
			dataMap.put("costPrice2", "cost_price2");
			dataMap.put("costPrice3", "cost_price3");
			dataMap.put("sellingPrice", "selling_price");
			dataMap.put("modifyPrices", "modify_prices");
			dataMap.put("operatorName", "operator_id");
			dataMap.put("operatorTime", "operator_time");
			
			
			SaleDetail saleDetail = SaleDetailFactory.getInstance().getObject("id", id);
			if(saleDetail!=null){
				for (String key : dataMap.keySet()) {
					String value = dataMap.get(key);
					if(StringUtils.equals("operatorName", key)){
						Long saleDetailId = saleDetail.get("id");
						Employee emp = EmployeeFactory.getInstance().getObject("id", saleDetailId.intValue());
						if(emp!=null){
							object.put(key, emp.get("real_name"));
						}else{
							object.put(key, "");
						}
					}else if(saleDetail.canViewField(employee,value)){
						object.put(key, saleDetail.get(value)==null?"":saleDetail.get(value));
					}
				}
			}
			writer.print(new SuccessJSON("data", object));
			log.trace("成本查询详情结束...");
	 	}catch (SQLException e) {
			log.error("sql语句异常！", e);
			writer.print(ErrorCode.LOAD_ERROR);
		}catch (NullPointerException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		}catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.LOAD_ERROR);
		}finally {
			dbHelper2.close(rs2);
		}
	}

	@Override
	protected void add() {
		
	}
	
	@Override
	protected void fileUpload(HttpServletRequest request, HttpServletResponse response) {
		log.trace("开始导出成本列表...");
		DBHelper dbHelper2 = DBHelperFactory.getSecondDBHelper("2");
		SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		ResultSet rs2 = null;
		try {
		 	StringBuilder ids = new StringBuilder();
		 	List<ChainCustomer> chainCustomerList = ChainCustomerFactory.getInstance().getAllObjects(employee);
		  for (ChainCustomer chainCustomer : chainCustomerList) {
		  	ids.append(chainCustomer.get("id")+",");
			}
		  
		 	
		 	StringBuilder sql2 = new StringBuilder();
		 
		 	if (ids.length() > 0) {
				ids.delete(ids.length() - 1, ids.length());
				
				sql2.append("select a.salesdtlid,a.credate,a.customid,a.customname,a.entryid,a.goodsid,a.goodsname,"
					+ "a.goodstype,a.factoryid,a.factoryname,a.goodsunit,a.goodsqty,a.unitprice,b.costprice costprice1,"
					+ "'' costprice2,'' costprice3,a.total_line,a.goodsqty*b.COSTPRICE costtotal1,'' costtotal2,'' costtotal3 "
					+ "from nherpuser.BMS_SA_DTLQRY_V a,nherpuser.bms_sk_costingprice_lst_v b "
					+ "where a.entryid=1 and a.goodsid=b.GOODSID and b.entryid=1 and a.customid in ("+ids+")");
		 	}
		 	String startTime = dataJson.getString("startTime");
		 	String endTime = dataJson.getString("endTime");
		 	
		 	if(StringUtils.isNotBlank(startTime) && StringUtils.isNotBlank(endTime)){
		 		Date startTimeDate = format.parse(startTime);
		 		Date endTimeDate = format.parse(endTime);
		 		sql2.append(" and a.credate between "+dbHelper2.getString(startTimeDate)+"  and "+dbHelper2.getString(endTimeDate));
		 	}
		 	
		 	List<Map<String,Object>> list = new ArrayList<>();
		 	rs2 = dbHelper2.select(sql2.toString());
			
			while (rs2.next()) {
				Map<String,Object> map  = new LinkedHashMap<>();
				map.put("成本价1", rs2.getObject("costprice1"));//成本价一
				map.put("成本价2", "");
				map.put("成本价3", "");
				map.put("销售数量", rs2.getObject("goodsqty"));//销售数量
				map.put("产品ID", rs2.getObject("goodsid"));//产品Id
				map.put("批号", rs2.getObject("salesdtlid"));//批号
				map.put("品名", rs2.getObject("goodsname"));
				map.put("规格", rs2.getObject("goodstype"));
				map.put("供应商", rs2.getObject("factoryname"));//供应商
				map.put("创建时间", rs2.getObject("credate"));//创建时间
				map.put("单价", rs2.getObject("unitprice"));//单价
				map.put("总金额", rs2.getObject("total_line"));//总金额
				map.put("操作人", "");
				
				list.add(map);
			}
			
			Map<String,String> dataMap = new HashMap<String,String>();
			dataMap.put("成本价2", "cost_price2");
			dataMap.put("成本价3", "cost_price3");
			dataMap.put("调价次数", "modify_prices");
			dataMap.put("操作人", "operator_id");
			
			for (Map<String,Object> map : list) {
				SaleDetail saleDetail = saleDetailFactory.getObject("id", map.get("id"));
				if(saleDetail!=null){
					for (String key : dataMap.keySet()) {
						String value = dataMap.get(key);
						if(saleDetail.canViewField(employee, value)){//是否显示列的值
							map.put(key, saleDetail.get(value));
						}
					}
				}
			}

		if (list.size() > 0) {
			exportListData(list);
			log.trace("导出列表数据结束...");
		}else{
			log.trace("暂无数据！");
			writer.print(new SuccessJSON("msg","暂无数据！"));
		}
		
		}catch (SQLException e) {
			log.error("sql语句异常！", e);
			writer.print(ErrorCode.EXPORT_FILE_FAIL);
		}catch (NullPointerException |ParseException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		}catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.EXPORT_FILE_FAIL);
		}finally {
			dbHelper2.close(rs2);
		}
	}

}
