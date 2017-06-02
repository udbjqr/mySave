package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.common.persistence.UserLookOverPermission;
import com.tk.common.persistence.WriteValueException;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.Config;
import com.tk.common.util.FileUtil;
import com.tk.common.util.PageUtil;
import com.tk.object.*;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;

import java.io.File;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.*;

/**
 * 产品管理
 */
@WebServlet("/goods.do")
public class GoodsServlet extends BaseServlet {
	// 获取到拜访计划工厂类
	private static GoodsFactory goodsFactory = GoodsFactory.getInstance();
	// 获取到供应商工厂类
	private static SupplierFactory supplierFactory = SupplierFactory.getInstance();
	// 获取到拜访记录工厂类
	private static VisitsFactory visitsFactory = VisitsFactory.getInstance();
	// 获取到拜访详情工厂类
	private static VisitDetailFactory visitDetailFactory = VisitDetailFactory.getInstance();

	private Integer pageSize;
	private Integer pageNumber;
	private static Logger log = LogManager.getLogger(GoodsServlet.class.getName());

	@Override
	protected boolean checkPara() {
		return true;
	}

	@Override
	protected boolean handleChilder() {
		switch (controlType) {
			case apprisalGoods:
				queryApprisalGoods();
				return true;
			case assessGoods:
				getAssessGoods();
				return true;
			case queryGoodsInfo:
				queryGoodsList();
				return true;
			case getGoodsInFo:
				getGoodsInfo();
				return true;
			case queryGoodsBySuperId:
				queryGoodsBySuperId();
				return true;
			case queryAllGoods:
				queryAllGoods();
				return true;
			case queryGoodsByPermission:
				queryGoodsByPermission();
				return true;
			default:
				return false;
		}
	}

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.add, PermissionEnum.GOODS_ADD);
		handlePermission.put(ControlType.update, PermissionEnum.GOODS_UPDATE);
		handlePermission.put(ControlType.load, PermissionEnum.GOODS_QUERY);
		handlePermission.put(ControlType.query, PermissionEnum.GOODS_QUERY);
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.fileExport, PermissionEnum.GOODS_EXPORT);
		handlePermission.put(ControlType.delete, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.queryGoodsInfo, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.queryAllGoods, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.queryGoodsByPermission, PermissionEnum.NOT_USE_PERMISSION);
		// 手机端查询
		handlePermission.put(ControlType.assessGoods, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.apprisalGoods, PermissionEnum.NOT_USE_PERMISSION);
	}
	
	
	
	
	/***
	 * 根据权限查询产品列表
	 */
	private void queryGoodsByPermission(){
		try {
			DBHelper dbHelper = DBHelperFactory.getDBHelper();
			StringBuilder sql = new StringBuilder(" where  1 = 1 ");
			String goods_name = (String)dataJson.get("goods_name");
			if(StringUtils.isNotBlank(goods_name)){
				sql.append("and goods_name like ").append(dbHelper.getString("%"+goods_name+"%"));
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
			
			
			if(ifag){
				sql.append(" and id in(").append(goodsIds.toString()).append(")");
			}
			
			
			
			
			List<Goods> goodsList = getGoodsList(sql.toString());
			List<JSONObject> list = new ArrayList<>();
			for (Goods goods : goodsList) {
				JSONObject object = new JSONObject();
				object.put("id", goods.get("id"));
				object.put("name", goods.get("goods_name"));
				object.put("specification", goods.get("specification"));
				list.add(object);
			}
			
			SuccessJSON success = new SuccessJSON();
			success.put("list", list);
			success.put("count", list.size());
			writer.println(success);
		} catch (Exception e) {
			log.error("出现异常！",e);
			writer.println(ErrorCode.GET_LIST_INFO_ERROR);
		}
		
	}
	/***
	 * 查询所有产品列表
	 */
	private void queryAllGoods(){
		try {
			DBHelper dbHelper = DBHelperFactory.getDBHelper();
			StringBuilder sql = new StringBuilder(" where  1 = 1 ");
			String goods_name = (String)dataJson.get("goods_name");
			if(StringUtils.isNotBlank(goods_name)){
				sql.append("and goods_name like ").append(dbHelper.getString("%"+goods_name+"%"));
			}
			List<Goods> goodsList = getGoodsList(sql.toString());
			List<JSONObject> list = new ArrayList<>();
			for (Goods goods : goodsList) {
				JSONObject object = new JSONObject();
				object.put("id", goods.get("id"));
				object.put("name", goods.get("goods_name"));
				object.put("specification", goods.get("specification"));
				list.add(object);
			}
			
			SuccessJSON success = new SuccessJSON();
			success.put("list", list);
			success.put("count", list.size());
			writer.println(success);
		} catch (Exception e) {
			log.error("出现异常！",e);
			writer.println(ErrorCode.GET_LIST_INFO_ERROR);
		}
		
	}
	

	/***
	 * 查询产品信息按关键字查询
	 */
	private void queryGoodsList() {
		log.trace("开始产品关键字查询...");
		DBHelper dbHelper = DBHelperFactory.getSecondDBHelper("2");
		ResultSet rs = null;
		try {
			String name = dataJson.getString("name");
			pageSize = dataJson.getInteger("pageSize");
			pageNumber = dataJson.getInteger("pageNumber");
			if (StringUtils.isBlank(name) || pageSize == null || pageNumber == null) {
				writer.print(ErrorCode.GET_LIST_INFO_ERROR);
				return;
			}

			StringBuilder builder = new StringBuilder();
			builder.append("select * from (SELECT goodsid,goodsname,goodstype,factoryname,")
							.append("rownum as r FROM nherpuser.zx_pub_goods_price_qty_v WHERE usestatus = 1 ");
			/*builder.append("select * from (SELECT goodsid,goodsname,goodstype,factoryname,")
							.append(" 1 as r FROM nherpuser.zx_pub_goods_price_qty_v WHERE usestatus = 1 ");*/
			//ID查询
			try {
				Integer.valueOf(name);
				builder.append(" and cast(goodsid as varchar(200)) like ").append(dbHelper.getString(name + "%"));
			} catch (NumberFormatException e) {
				builder.append(" and goodsname  like ").append(dbHelper.getString("%" + name + "%"));
			}
			builder.append(") a where").append(" r  <= ").append(pageSize);

			rs = dbHelper.select(builder.toString());

			builder = new StringBuilder();
			while (rs.next()) {
				builder.append("{\"supplierName\":\"").append(rs.getString("factoryname"))
								.append("\",\"goodsId\":").append(rs.getString("goodsid"))
								.append(",\"specification\":\"").append(rs.getString("goodstype") == null ? "" : rs.getString("goodstype"))
								.append("\",\"goodsName\":\"").append(rs.getString("goodsname"))
								.append("\"},");
			}
			if (builder.length() > 0) {
				builder.delete(builder.length() - 1, builder.length());
			}
			builder.insert(0, "{\"success\":true,\"map\":{\"data\":[").append("]}}");
			writer.println(builder.toString());
			log.trace("产品关键字查询结束...");
		} catch (Exception e) {
			log.error("产品关键字查询出错", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		} finally {
			dbHelper.close(rs);
		}
	}

	/**
	 * 根据计划Id 查询所有考核产品是不是已经盘点过（计划Id 非必传，如果没有传，那就是查所有的考核产品）
	 */
	@Override
	protected void queryAll() {
		log.trace("根据计划Id查询所有考核产品初始...");
		DBHelper dbHelper = DBHelperFactory.getDBHelper();
		// 计划Id
		Integer planId = dataJson.getInteger("plan_id");
		Integer visits_id = null;
		// 为了查询拜访记录的Id,方便产品盘点
		try {
			Visits visits = visitsFactory.getObject("plan_id", planId);
			if (null != visits) {
				visits_id = visits.get("id");
			}
		} catch (Exception e) {
			visits_id = null;
		}
		String goodName = dataJson.getString("goodName");
		StringBuilder sql = new StringBuilder();
		sql.append("SELECT T.*, isnull(p.goods_id, 0) isStock ");
		sql.append(" FROM goods T LEFT JOIN supplier s ON s.id = t.supplier_id ");
		sql.append("  LEFT JOIN (SELECT vd.goods_id FROM customer_visits_detail vd ");
		sql.append(" LEFT JOIN customer_visits VS ON VS.id = VD.visits_id ");
		sql.append(" WHERE vs.plan_id = " + planId);
		sql.append(" ) P ON P.goods_id = t.id WHERE t.is_assess = 1 and t.flag = 1 ");
		if (StringUtils.isNotEmpty(goodName)) {
			sql.append(" AND T.goods_name like " + dbHelper.getString("%" + goodName + "%"));
		}
		sql.append(" order by t.supplier_id ");
		//查询盘点产品
		ResultSet resultSet = null;
		JSONArray jsonArray = new JSONArray();
		try {
			resultSet = dbHelper.select(sql.toString());

			while (resultSet.next()) {
				JSONObject object = new JSONObject();
				Supplier supplier = supplierFactory.getObject("id", resultSet.getInt("supplier_id"));
				object.put("id", resultSet.getInt("id"));
				// 产品名
				object.put("goodsName", resultSet.getString("goods_name"));
				object.put("supplierId", resultSet.getString("supplier_id"));
				//规格
				object.put("specification", resultSet.getString("specification"));
				// 供应商名字
				object.put("supplierName", supplier == null ? "" : supplier.get("supplier_name"));
				// 图片
				object.put("imgUrl", resultSet.getString("image_URL"));
				// 是否考核
				object.put("isAssess", resultSet.getString("is_assess"));
				//是否已盘点
				object.put("isStock", resultSet.getInt("isStock"));
				jsonArray.add(object);
			}
		} catch (Exception e) {
			logger.error("根据计划查询考核产品列表信息异常：{}！", e);
		} finally {
			dbHelper.close(resultSet);
		}
		SuccessJSON success = new SuccessJSON();
		success.put("list", jsonArray);
		success.put("visits_id", visits_id);
		writer.print(success);
		log.trace("根据计划Id查询所有考核产品初始...");
	}

	/**
	 * 获得所有考核产品（用于显示库存，销量等）
	 */
	protected void queryApprisalGoods() {
		log.trace("查询所有考核产品初始...");
		// 判断到底是库存还是销量
		String queryType;
		// 客户Id
		String customerId;
		// 计划Id
		String planId;
		try {
			queryType = dataJson.getString("queryType");
			customerId = dataJson.getString("customer_id");
			planId = dataJson.getString("plan_id");
		} catch (Exception e) {
			log.error("获取查询考核产品参数异常：{}！", e);
			return;
		}
		if (StringUtils.isEmpty(queryType) || StringUtils.isEmpty(customerId) || StringUtils.isEmpty(planId)) {
			log.error("获取查询所有考核产品参数失败！");
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.flag = 1 and t.is_assess='1' ");
		List<Goods> goodList;
		try {
			goodList = getGoodsList(sql.toString());
			// 获得产品信息失败
			if (null == goodList || goodList.size() <= 0) {
				log.trace("获取考核产品列表失败！");
				writer.print(ErrorCode.GET_LIST_INFO_ERROR);
				return;
			}
			JSONArray goodArr = new JSONArray();
			// 循环
			for (Goods good : goodList) {
				// 清空sql
				sql.setLength(0);
				Integer supplierId = good.get("supplier_id");
				//获得供应商
				Supplier supplier = supplierFactory.getObject("id", supplierId);

				JSONObject object = new JSONObject();
				object.put("goodsId", good.get("id"));
				object.put("specification", good.get("id"));
				object.put("supplier", supplier == null ? "" : supplier.get("supplier_name"));
				object.put("goodsName", good.get("goods_name"));
				object.put("imgUrl", good.get("image_URL"));
				// 获得
				sql.append(" left join customer_visits_detail d on t.id= d.visits_id where ");
				sql.append(" t.plan_id='" + planId + "' ");
				sql.append(" and goods_id ='" + good.get("id") + "' ");
				sql.append(" order by t.visits_time ");
				// 查询当前用户的商品最近的库存、销售、进货情况
				List<Visits> visits = visitsFactory.getObjectsForString(sql.toString(), null);
				if (null == visits || visits.size() <= 0) {
					// 时间为空
					object.put("time", "");
					// 批号
					object.put("batchNumber", "");
					// 数量都为0
					object.put("number", 0);
					goodArr.add(object);
					continue;
				}
				// 获得最后一次拜访记录
				Visits lastVisit = visits.get(0);
				object.put("time", lastVisit.get("visits_time"));
				// 获得产品拜访详情
				VisitDetail detail = visitDetailFactory.getObject("visits_id", lastVisit.get("id"));
				// 获得最近一次考核信息
				if ("stock".equals(queryType)) {// 库存
					object.put("number", detail.get("real_stock"));
				} else if ("purchase".equals(queryType)) {// 进货
					object.put("number", detail.get("purchase_number"));
				} else if ("sail".equals(queryType)) {// 销量
					object.put("number", detail.get("sail_number"));
				}
				object.put("batchNumber", detail.get("batch_number"));
				goodArr.add(object);
			}
			log.trace("查询所有考核产品结束...");
			writer.print(new SuccessJSON("list", goodArr));
		} catch (Exception e) {
			log.trace("查询所有考核产品发生异常:{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	/**
	 * 查询产品列表
	 *
	 * @return
	 */
	private List<Goods> getGoodsList(String sql) {
		List<Goods> goodList;
		try {
			goodList = goodsFactory.getObjectsForString(sql, employee);
			return goodList;
		} catch (Exception e) {
			log.error(ErrorCode.GET_LIST_INFO_ERROR);
			return null;
		}
	}

	/**
	 * 获得所有考核产品
	 */
	public void getAssessGoods() {
		log.trace("查询所有考核产品初始...");
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.flag = 1 and t.is_assess='1' ");
		List<Goods> goodList;
		try {
			goodList = getGoodsList(sql.toString());
			JSONArray goodArr = new JSONArray();
			if (null != goodList) {
				// 循环
				for (Goods good : goodList) {
					JSONObject object = new JSONObject();
					object.put("goodsId", good.get("id"));
					object.put("specification", good.get("specification"));
					object.put("goodsName", good.get("goods_name"));
					goodArr.add(object);
				}
			}
			SuccessJSON success = new SuccessJSON();
			log.trace("查询所有考核产品结束...");
			success.put("list", goodArr);
			writer.print(success);
		} catch (Exception e) {
			log.error("查询所有考核产品发生异常：{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}

	}

	/***
	 * 删除产品图片
	 */
	@Override
	protected void delete() {
		Integer id = dataJson.getInteger("id");
		String filePath = dataJson.getString("filePath");
		try {
			Goods goods = goodsFactory.getObject("id", id);
			if (id == null || goods == null) {
				log.error(ErrorCode.REQUEST_PARA_ERROR);
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
			} else if (StringUtils.isBlank(filePath)) {
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			} else {
				String newImageURL = "";
				String image_URL = goods.get("image_URL");
				if (StringUtils.isNotBlank(image_URL)) {
					String[] split = image_URL.split(";");
					for (String path : split) {
						if (!StringUtils.equals(filePath, path)) {
							newImageURL += path+";";
						}
					}
					String fileUploadPath = Config.getInstance().getProperty("fileUploadPath");
					fileUploadPath = fileUploadPath.replace("upload/", "");
					File f = new File(fileUploadPath+filePath);
					if(f.exists()){
						f.delete();
					}
				} else {
					writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
					return;
				}

				goods.set("image_URL", newImageURL);
				goods.flash();
				writer.print(new SuccessJSON("msg", "删除图片成功！"));
			}

		} catch (Exception e) {
			log.error("删除图片失败！", e);
			writer.print(ErrorCode.DELETE_ERROR);
		}
	}

	@Override
	protected void update() {
		log.trace("开始修改产品信息...");
		Integer id = dataJson.getInteger("id");
		Goods goods = goodsFactory.getObject("id", id);
		String goodsName = dataJson.getString("goodsName");
		String specification = dataJson.getString("specification");
		Integer supplierId = dataJson.getInteger("supplierId");
		Integer isAssess = dataJson.getInteger("isAssess");
		String manual = dataJson.getString("manual");
		Integer flag = dataJson.getInteger("flag");
		String imageURL = dataJson.getString("filePath");
		if (id == null || goods == null) {
			log.error(ErrorCode.REQUEST_PARA_ERROR);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		try {
			if (StringUtils.isNotBlank(imageURL)) {
				String fileName = dataJson.getString("fileName").toString();
				String type = fileName.substring(fileName.indexOf(".") + 1, fileName.length());
				List<String> fileTypeList = FileUtil.getFileTypeList();

				if (!fileTypeList.contains(type.toLowerCase())) {
					writer.print(ErrorCode.FILETYPE_ERROR);
					return;
				}
			}
			if (goodsName != null && !goodsName.isEmpty()) {
				goods.set("goods_name", goodsName);
			}
			if (flag != null) {
				goods.set("flag", flag);
			}
			if (manual != null && !manual.isEmpty()) {
				goods.set("manual", manual);
			}
			if (isAssess != null) {
				goods.set("is_assess", isAssess);
			}
			if (supplierId != null) {
				goods.set("supplier_id", supplierId);
			}
			if (specification != null && !specification.isEmpty()) {
				goods.set("specification", specification);
			}

			if (StringUtils.isNotBlank(imageURL)) {
				goods.set("image_URL", imageURL);
			}

			goods.flash();

			writer.print(new SuccessJSON().put("msg", "修改产品成功！"));
			log.trace("修改产品信息结束...");
		} catch (WriteValueException e) {
			log.error("写入数据值异常！", e);
			writer.print(ErrorCode.UPDATE_ERROR);
		}
	}

	@Override
	protected void query() {
		// 添加批发价和库存显示
		DBHelper dbHelper2 = DBHelperFactory.getSecondDBHelper("2");
		DBHelper dbHelper = DBHelperFactory.getDBHelper();
		ResultSet rs = null;
		try {
			pageSize = dataJson.getInteger("pageSize");
			pageNumber = dataJson.getInteger("pageNumber");
			//只查询未停用的产品
			StringBuilder sql = new StringBuilder(" where 1 = 1 ");
			String supplierId = dataJson.getString("supplierId");
			Integer isAssess = dataJson.getInteger("isAssess");
			Integer flag = dataJson.getInteger("flag");
			String name = dataJson.getString("name");

			if (StringUtils.isNotBlank(supplierId)) {
				String str2 = supplierId.substring(supplierId.length() - 1);
				if (str2.equals(",")) {
					supplierId = supplierId.substring(0, supplierId.length() - 1);
				}
				sql.append(" and supplier_id in (" + supplierId).append(")");
			}
			if (isAssess != null) {
				sql.append(" and is_assess = " + isAssess);
			}

			if (flag != null) {
				sql.append(" and flag = " + flag);
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
					sql.append(" and id in (").append(name).append(")");
				}else{
					sql.append(" and (t.goods_name like " + dbHelper.getString("%" + name + "%"));
					sql.append(" or exists( select 1 from supplier where supplier_name like " + dbHelper.getString("%" + name + "%")
									+ " and t.supplier_id = supplier.id ))");
				}
			}

			sql.append(" order by create_time desc");
			List<Goods> goodsList = goodsFactory.getObjectsForString(sql.toString(), employee);
			List<Goods> subList = PageUtil.getPageList(pageNumber, pageSize, goodsList);
			List<JSONObject> datas = new ArrayList<>();
			SuccessJSON success = new SuccessJSON();

			StringBuilder goodsIds = new StringBuilder();
			for (Goods goods : subList) {
				goodsIds.append(goods.get("id") + ",");
			}

			Map<String, Object> map = new HashMap<>();
			if (goodsIds.length() > 0) {
				goodsIds.delete(goodsIds.length() - 1, goodsIds.length());

				StringBuilder selectSql = new StringBuilder();

				selectSql.append(
								"select goodsid,goodsname,goodstype,factoryid,factoryname,goodsunit,wholeprice,stgoodsqty from nherpuser.zx_pub_goods_price_qty_v ");
				selectSql.append(" where usestatus = 1 and  goodsid in (" + goodsIds + ")");

				rs = dbHelper2.select(selectSql.toString());
				while (rs.next()) {
					Map<String, Object> data = new HashMap<>();
					data.put("sellingPrice", rs.getObject("wholeprice"));// 产品批发价
					data.put("goodsqty", rs.getObject("stgoodsqty"));// 库存
					map.put(rs.getInt("goodsid") + "", data);
				}
			}

			for (Goods goods : subList) {
				JSONObject object = new JSONObject();
				if (goods.canViewField(employee, "id")) {
					object.put("id", goods.get("id"));
				}
				if (goods.canViewField(employee, "goods_name")) {
					object.put("goodsName", goods.get("goods_name"));
				}
				if (goods.canViewField(employee, "image_URL")) {
					if (goods.get("image_URL") != null) {
						//String path = Config.getInstance().getProperty("configPath");
						object.put("imgageURL", goods.get("image_URL"));
					} else {
						object.put("imgageURL", "");
					}

				}
				if (goods.canViewField(employee, "specification")) {
					object.put("specification", goods.get("specification"));// 规格
				}
				if (goods.canViewField(employee, "flag")) {
					object.put("status", goods.get("flag"));
				}

				if (goods.canViewField(employee, "is_assess")) {
					object.put("isAssess", goods.get("is_assess"));// 标记出考核产品
				}

				Integer supplierId2 = null;
				if (goods.canViewField(employee, "supplier_id")) {
					supplierId2 = (Integer) goods.get("supplier_id");
				}

				Supplier supplier = null;
				if (supplierId2 != null) {
					supplier = SupplierFactory.getInstance().getObject("id", supplierId2);
				}

				if (supplier != null) {
					object.put("supplier", supplier.get("supplier_name"));// 供应商
				}

				@SuppressWarnings("unchecked")
				Map<String, Object> dataMap = (Map<String, Object>) map.get(goods.get("id").toString());
				if (dataMap != null) {
					object.put("sellingPrice", dataMap.get("sellingPrice"));// 产品批发价
					object.put("goodsqty", dataMap.get("goodsqty"));// 库存
				}
				datas.add(object);
			}
			success.put("data", datas);
			success.put("count", goodsList.size());
			writer.print(success);
		} catch (SQLException e) {
			log.error("sql语句异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		} catch (NullPointerException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		} finally {
			dbHelper2.close(rs);
		}
	}

	//微信产品信息查询（产品停用时不显示）
	private void getGoodsInfo() {
		DBHelper dbHelper2 = DBHelperFactory.getSecondDBHelper("2");
		ResultSet rs = null;
		try {
			// 添加批发价和库存显示
			Integer id = dataJson.getInteger("id");
			JSONObject object = new JSONObject();
			Goods goods = goodsFactory.getObject("id", id);
			if (goods == null) {
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}

			Integer flag = goods.get("flag");
			if (flag == null || flag.intValue() == 0) {
				writer.print(ErrorCode.GOODS_FLAG_IS_0);
				return;
			}


			ImportSaleDetail importSaleDetail = ImportSaleDetailFactory.getInstance().getObject("goodsid", id);
			if (importSaleDetail != null) {
				object.put("unitprice", importSaleDetail.get("unitprice"));
				object.put("goodsqty", importSaleDetail.get("goodsqty"));// 产品库存
			}
			object.put("goodsName", goods.get("goods_name"));
			object.put("id", goods.get("id"));
			object.put("imageURL", goods.get("image_URL"));
			object.put("flag", goods.get("flag"));
			object.put("specification", goods.getToString("specification"));
			Object manual = goods.get("manual");
			if (manual != null) {
				object.put("manual", manual);// 产品说明
			} else {
				object.put("manual", "");// 产品说明
			}

			Integer supplierId2 = (Integer) goods.get("supplier_id");
			Supplier supplier = SupplierFactory.getInstance().getObject("id", supplierId2);
			if (supplier != null) {
				object.put("supplier", supplier.get("supplier_name"));// 供应商
			}
			object.put("isAssess", goods.get("is_assess"));// 标记出考核产品

			StringBuilder selectSql = new StringBuilder();

			selectSql.append(
							"select goodsid,goodsname,goodstype,factoryid,factoryname,goodsunit,wholeprice,stgoodsqty from nherpuser.zx_pub_goods_price_qty_v ");
			selectSql.append(" where usestatus = 1 and  goodsid =" + goods.get("id"));
			rs = dbHelper2.select(selectSql.toString());
			if (rs.next()) {
				object.put("sellingPrice", rs.getObject("wholeprice"));// 产品批发价
				object.put("goodsqty", rs.getObject("stgoodsqty"));// 库存
			}
			writer.print(new SuccessJSON("goods", object));
		} catch (Exception e) {
			log.error("查询产品详情出错", e);
			writer.print(ErrorCode.LOAD_ERROR);
		} finally {
			dbHelper2.close(rs);
		}
	}

	@Override
	protected void load() {
		DBHelper dbHelper2 = DBHelperFactory.getSecondDBHelper("2");
		ResultSet rs = null;
		try {
			// 添加批发价和库存显示
			Integer id = dataJson.getInteger("id");
			JSONObject object = new JSONObject();
			Goods goods = goodsFactory.getObject("id", id);
			if (goods == null) {
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}
			ImportSaleDetail importSaleDetail = ImportSaleDetailFactory.getInstance().getObject("goodsid", id);
			if (importSaleDetail != null) {
				object.put("unitprice", importSaleDetail.get("unitprice"));
				object.put("goodsqty", importSaleDetail.get("goodsqty"));// 产品库存
			}
			object.put("goodsName", goods.get("goods_name"));
			object.put("id", goods.get("id"));
			//String path = Config.getInstance().getProperty("configPath");
			object.put("imageURL", goods.get("image_URL"));
			object.put("flag", goods.get("flag"));
			object.put("specification", goods.getToString("specification"));
			Object manual = goods.get("manual");
			if (manual != null) {
				object.put("manual", manual);// 产品说明
			} else {
				object.put("manual", "");// 产品说明
			}

			Integer supplierId2 = (Integer) goods.get("supplier_id");
			Supplier supplier = SupplierFactory.getInstance().getObject("id", supplierId2);
			if (supplier != null) {
				object.put("supplier", supplier.get("supplier_name"));// 供应商
			}
			object.put("isAssess", goods.get("is_assess"));// 标记出考核产品

			StringBuilder selectSql = new StringBuilder();

			selectSql.append(
							"select goodsid,goodsname,goodstype,factoryid,factoryname,goodsunit,wholeprice,stgoodsqty from nherpuser.zx_pub_goods_price_qty_v ");
			selectSql.append(" where usestatus = 1 and  goodsid =" + goods.get("id"));
			rs = dbHelper2.select(selectSql.toString());
			if (rs.next()) {
				object.put("sellingPrice", rs.getObject("wholeprice"));// 产品批发价
				object.put("goodsqty", rs.getObject("stgoodsqty"));// 库存
			}
			writer.print(new SuccessJSON("goods", object));
		} catch (Exception e) {
			log.error("查询产品详情出错", e);
			writer.print(ErrorCode.LOAD_ERROR);
		} finally {
			dbHelper2.close(rs);
		}

	}

	@Override
	protected void add() {
		DBHelper dbHelper = DBHelperFactory.getSecondDBHelper("2");
		ResultSet rs = null;
		try {

			Integer goodsId = Integer.valueOf(dataJson.getInteger("id").toString());

			StringBuilder sql = new StringBuilder();

			sql.append(
							"select goodsid,goodsname,goodstype,factoryid,factoryname,goodsunit,wholeprice,stgoodsqty from nherpuser.zx_pub_goods_price_qty_v ");
			sql.append(" where usestatus = 1 and  goodsid = " + goodsId);

			rs = dbHelper.select(sql.toString());
			if (!rs.next()) {
				log.trace(ErrorCode.GOODSID_NOT_EXISTS);
				writer.print(ErrorCode.GOODSID_NOT_EXISTS);
				dbHelper.close(rs);
				return;
			}

			Goods good = goodsFactory.getObject("id", goodsId);
			if (good != null) {
				writer.print(ErrorCode.GOODSID_IS_ADD);
				return;
			}

			Integer supplierId = rs.getInt("factoryid");// 供应商Id
			String goodsName = rs.getString("goodsname");// 产品名称
			String goodsType = rs.getString("goodstype");// 规格
			String factoryName = rs.getString("factoryname");// 供应商名称

			Supplier supplier = SupplierFactory.getInstance().getObject("id", supplierId);
			if (supplier == null) {
				Supplier newSupplier = SupplierFactory.getInstance().getNewObject(employee);
				newSupplier.set("id", supplierId);
				newSupplier.set("supplier_name", factoryName);
				newSupplier.flash();
			}

			Goods goods = GoodsFactory.getInstance().getNewObject(employee);
			goods.set("id", goodsId);
			goods.set("goods_name", goodsName);
			goods.set("specification", goodsType);
			goods.set("supplier_id", supplierId);// 供应商Id
			goods.set("is_assess", 0);// 是否考核
			goods.set("flag", 0);// 状态

			goods.flash();
			writer.print(new SuccessJSON().put("msg", "新增产品成功！"));
			importSaleStatisticData(goodsId);
			

		} catch (WriteValueException e) {
			log.error("写入数据值异常！", e);
			writer.print(ErrorCode.ADD_ERROR);
		} catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		} catch (SQLException e) {
			log.error("查询数据异常！", e);
			writer.print(ErrorCode.ADD_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.ADD_ERROR);
		} finally {
			dbHelper.close(rs);
		}
	}
	
	/***
	 * 导入产品的销售统计数据
	 */
	private void importSaleStatisticData(Integer goodsId){
		log.info("执行导入产品销售数据");
		DBHelper secondDBHelper = DBHelperFactory.getSecondDBHelper("2");
		ResultSet rs = null;
		try{
			StringBuilder sql = new StringBuilder();
			sql.append("select * from nherpuser.rpt_sa_goods_natural_month_v where  goodsid = ").append(goodsId);
			rs = secondDBHelper.select(sql.toString());
			SaleGoodsMonthFactory saleGoodsMonthFactory = SaleGoodsMonthFactory.getInstance();
			while (rs.next()) {
				SaleGoodsMonth saleGoodsMonth = saleGoodsMonthFactory.getNewObject(null);
				saleGoodsMonth.set("useyear", rs.getObject("useyear"));
				saleGoodsMonth.set("usemonth", rs.getObject("usemonth"));
				saleGoodsMonth.set("goodsid", rs.getObject("goodsid"));
				saleGoodsMonth.set("factoryid", rs.getObject("factoryid"));
				saleGoodsMonth.set("total", rs.getObject("total"));
				saleGoodsMonth.set("entryid", rs.getObject("entryid"));
				saleGoodsMonth.set("goodsqty", rs.getObject("goodsqty"));
				saleGoodsMonth.flash();
			}
			
		}catch(Exception e){
			log.error("执行导入销售数据任务发生异常",e);
		}finally {
			secondDBHelper.close(rs);
		}
	}

	@Override
	protected void fileUpload(javax.servlet.http.HttpServletRequest request,
	                          javax.servlet.http.HttpServletResponse response) {
		List<Goods> goodsList = goodsFactory.getAllObjects(employee);
		List<Map<String, Object>> list = new ArrayList<Map<String, Object>>();
		for (Goods goods : goodsList) {
			Map<String, Object> map = new LinkedHashMap<String, Object>();
			if (goods.canViewField(employee, "id")) {
				if (StringUtils.isBlank(goods.get("id").toString())) {
					map.put("产品ID", "");
				} else {
					map.put("产品ID", goods.get("id"));
				}
			}
			if (goods.canViewField(employee, "goods_name")) {
				if (StringUtils.isBlank(goods.get("goods_name"))) {
					map.put("产品名称", "");
				} else {
					map.put("产品名称", goods.get("goods_name"));
				}

				if (goods.canViewField(employee, "flag")) {
					Integer status = goods.get("flag");
					if (status.intValue() == 0) {
						map.put("状态", "停用");
					} else {
						map.put("状态", "正常");
					}
				}
			}
			if (goods.canViewField(employee, "specification")) {
				if (StringUtils.isBlank(goods.get("specification"))) {
					map.put("规格", "");// 规格
				} else {
					map.put("规格", goods.get("specification"));// 规格
				}
			}

			Integer supplierId2 = goods.get("supplier_id");
			Supplier supplier = SupplierFactory.getInstance().getObject("id", supplierId2);
			if (StringUtils.isBlank(supplier.get("supplier_name"))) {
				map.put("供应商", "");// 供应商
			} else {
				map.put("供应商", supplier.get("supplier_name"));// 供应商
			}

			Integer status = (Integer) goods.get("is_assess");
			if (status.intValue() == 0) {
				map.put("是否考核", "未考核");
			} else {
				map.put("是否考核", "考核");
			}

			SaleDetail saleDetail = SaleDetailFactory.getInstance().getObject("goods_id", goods.get("id"));
			if (saleDetail != null) {
				if (saleDetail.get("selling_price") == null) {
					map.put("产品批发价", "");// 产品批发价
				} else {
					map.put("产品批发价", saleDetail.get("selling_price"));// 产品批发价
				}
				if (saleDetail.get("sales_volume") == null) {
					map.put("库存", "");// 库存
				} else {
					map.put("库存", saleDetail.get("sales_volume"));// 库存
				}
			} else {
				map.put("产品批发价", "");// 产品批发价
				map.put("库存", "");// 库存
			}
			list.add(map);
		}
		if (list.size() > 0) {
			exportListData(list);
			log.trace("导出列表数据结束...");
		} else {
			log.trace("暂无数据！");
			writer.print(new SuccessJSON("msg", "暂无数据！"));
		}
	}

	@Override
	protected void fileImport(HttpServletRequest request) {
		try {
			boolean ifag = false;
			Collection<Map> importExcel = getImportDataMap(request);
			if (importExcel == null) {
				return;
			}

			for (Map map : importExcel) {
				String id = map.get("产品ID").toString();
				String goodsName = map.get("产品名称").toString();
				String supplierName = map.get("供应商").toString();
				String supplierId = map.get("供应商Id").toString();
				if (StringUtils.isBlank(supplierId) && StringUtils.isNotBlank(supplierName)) {
					Supplier supplier = SupplierFactory.getInstance().getNewObject(employee);
					supplier.set("supplier_name", supplierName);
					supplier.flash();
					supplierId = supplier.get("id").toString();
				}
				String specification = map.get("规格").toString();
				Integer flag = Integer.valueOf(map.get("状态").toString());
				String manual = map.get("产品说明").toString();
				String isAssess = map.get("标记出考核产品").toString();
				Goods goods = goodsFactory.getNewObject(employee);
				goods.set("id", id);
				goods.set("goods_name", goodsName);
				goods.set("specification", specification);
				goods.set("supplier_id", supplierId);
				goods.set("is_assess", isAssess);
				goods.set("manual", manual);
				goods.set("flag", flag);

				ifag = goods.flash();
			}

			if (ifag) {
				writer.print(new SuccessJSON("msg", "导入产品列表成功！"));
			} else {
				writer.print(ErrorCode.IMPORT_FILE_FAIL);
			}
		} catch (Exception e) {
			log.error("文件导入失败", e);
			writer.print(ErrorCode.IMPORT_FILE_FAIL);
		}
	}

	/***
	 * 获取产品按供应商ID
	 */
	private void queryGoodsBySuperId() {
		try {
			String supplier_id = (String) dataJson.get("supplierId").toString();
			Integer isAssess = dataJson.getInteger("isAssess");
			if(StringUtils.isBlank(supplier_id)){
				List<JSONObject> array = new ArrayList<>();
				SuccessJSON success = new SuccessJSON();
				success.put("data", array);
				success.put("count", array.size());
				writer.print(success);
				return;
			}
			
			if(StringUtils.isNotBlank(supplier_id)){
				String str = supplier_id.substring(supplier_id.length()-1);
				if(str.equals(",")){
					supplier_id = supplier_id.substring(0,supplier_id.length()-1);
				}
			}
			StringBuilder sql = new StringBuilder();
			sql.append(" where supplier_id in (" + supplier_id+")");
			if(isAssess!=null){
				sql.append(" and is_assess= ").append(isAssess);
			}
			List<Goods> goodsList = goodsFactory.getObjectsForString(sql.toString(), employee);
			List<JSONObject> array = new ArrayList<>();
			for (Goods goods : goodsList) {
				JSONObject object = new JSONObject();
				object.put("id", goods.get("id"));
				object.put("specification", goods.get("specification"));
				object.put("name", goods.get("goods_name"));
				array.add(object);
			}

			SuccessJSON success = new SuccessJSON();
			success.put("data", array);
			success.put("count", goodsList.size());
			writer.print(success);

		} catch (SQLException e) {
			log.error("sql语句异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		} catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

}
