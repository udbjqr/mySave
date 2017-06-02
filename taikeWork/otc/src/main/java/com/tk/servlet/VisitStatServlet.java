package com.tk.servlet;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.common.persistence.UserLookOverPermission;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.DateUtil;
import com.tk.common.util.ObjectUtil;
import com.tk.common.util.PageUtil;
import com.tk.object.AreaDivision;
import com.tk.object.AreaDivisionFactory;
import com.tk.object.ChainCustomer;
import com.tk.object.ChainCustomerFactory;
import com.tk.object.Customer;
import com.tk.object.CustomerFactory;
import com.tk.object.Employee;
import com.tk.object.EmployeeFactory;
import com.tk.object.Goods;
import com.tk.object.GoodsFactory;
import com.tk.object.RemarkDetail;
import com.tk.object.RemarkDetailFactory;
import com.tk.object.Store;
import com.tk.object.Supplier;
import com.tk.object.SupplierFactory;
import com.tk.object.VisitDetail;
import com.tk.object.VisitDetailFactory;
import com.tk.object.VisitPlan;
import com.tk.object.VisitPlanFactory;
import com.tk.object.Visits;
import com.tk.object.VisitsFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

/**
 * 拜访统计管理servlet
 * <p>
 *
 * @author huzh
 */
@WebServlet("/visitStat.do")
public class VisitStatServlet extends BaseServlet {
	private static Logger log = LogManager.getLogger(VisitStatServlet.class.getName());
	// 获取到拜访记录工厂类
	private static VisitsFactory visitsFactory = VisitsFactory.getInstance();
	// 获取到拜访计划工厂类
	private static VisitPlanFactory visitPlanFactory = VisitPlanFactory.getInstance();
	// 获取到拜访明细工厂类
	private static VisitDetailFactory visitDetailFactory = VisitDetailFactory.getInstance();
	// 获取到商业拜访备注工厂类
	private static RemarkDetailFactory remarkDetailFactory = RemarkDetailFactory.getInstance();
	// 产品工厂类
	private static GoodsFactory goodsFactory = GoodsFactory.getInstance();
	// 供应商工厂类
	private static SupplierFactory supplierFactory = SupplierFactory.getInstance();
	// 门店客户工厂类
	private static CustomerFactory customerFactory = CustomerFactory.getInstance();
	// 商业客户工厂类
	private static ChainCustomerFactory chainCustomerFactory = ChainCustomerFactory.getInstance();
	// 获得查询工厂类
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();
	private Integer pageSize;
	private Integer pageNumber;

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.queryEmployeeStat, PermissionEnum.EMPLOYEE_VISIT_STAT_QUERY);
		// 门店拜访统计详情 start
		handlePermission.put(ControlType.queryStockList, PermissionEnum.VISIT_STAT_LOAD);
		handlePermission.put(ControlType.loadChainStock, PermissionEnum.VISIT_STAT_LOAD);
		handlePermission.put(ControlType.loadStockInfo, PermissionEnum.VISIT_STAT_LOAD);
		// 门店拜访统计详情 end
		// 代表拜访统计详情 start
		handlePermission.put(ControlType.queryStockListByEmployee, PermissionEnum.EMPLOYEE_VISIT_STAT_LOAD);
		handlePermission.put(ControlType.loadChainStockByEmployee, PermissionEnum.EMPLOYEE_VISIT_STAT_LOAD);
		handlePermission.put(ControlType.loadStockInfoByEmployee, PermissionEnum.EMPLOYEE_VISIT_STAT_LOAD);
		// 代表拜访统计详情 end
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.queryCustomerStatList, PermissionEnum.CUSTOMER_VISIT_STAT_QUERY);
		handlePermission.put(ControlType.queryGoodsStatList, PermissionEnum.GOODS_VISIT_STAT_QUERY);
		handlePermission.put(ControlType.fileExport, PermissionEnum.VISIT_STAT_EXPORT);
		handlePermission.put(ControlType.goodsStatisticsDetail, PermissionEnum.GOODS_VISIT_STAT_LOAD);
		handlePermission.put(ControlType.fileExportGoodsStatisticsDetail, PermissionEnum.GOODS_VISIT_STAT_EXPORT);
	}

	@Override
	protected boolean handleChilder() {
		switch (controlType) {
		case queryEmployeeStat:// 代表拜访统计列表
			if (employee.hasPermission(handlePermission.get(ControlType.queryEmployeeStat))) {
				queryEmployeeStat();
			} else {
				errorPermission(ControlType.queryEmployeeStat);
			}
			return true;
		case queryStockList:// 拜访统计详情（门店拜访统计）
			if (employee.hasPermission(handlePermission.get(ControlType.queryStockList))) {
				queryStockList();
			} else {
				errorPermission(ControlType.queryStockList);
			}
			return true;
		case loadChainStock:// 商业客户拜访备注详情（门店拜访统计）
			if (employee.hasPermission(handlePermission.get(ControlType.loadChainStock))) {
				loadChainStock();
			} else {
				errorPermission(ControlType.loadChainStock);
			}
			return true;
		case loadStockInfo:// 根据拜访记录查询盘点明细列表（门店拜访统计）
			if (employee.hasPermission(handlePermission.get(ControlType.loadStockInfo))) {
				loadStockInfo();
			} else {
				errorPermission(ControlType.goodsSaleScoreDetail);
			}
			return true;
		case queryStockListByEmployee:// 代表拜访统计详情（代表拜访统计）
			if (employee.hasPermission(handlePermission.get(ControlType.queryStockListByEmployee))) {
				queryStockList();
			} else {
				errorPermission(ControlType.queryStockListByEmployee);
			}
			return true;
		case loadChainStockByEmployee:// 商业客户拜访备注详情（代表拜访统计）
			if (employee.hasPermission(handlePermission.get(ControlType.loadChainStockByEmployee))) {
				loadChainStock();
			} else {
				errorPermission(ControlType.loadChainStockByEmployee);
			}
			return true;
		case loadStockInfoByEmployee:// 根据拜访记录查询盘点明细列表（代表拜访统计）
			if (employee.hasPermission(handlePermission.get(ControlType.loadStockInfoByEmployee))) {
				loadStockInfo();
			} else {
				errorPermission(ControlType.loadStockInfoByEmployee);
			}
			return true;
		case goodsStatisticsDetail:// 产品拜访统计详情
			if (employee.hasPermission(handlePermission.get(ControlType.goodsStatisticsDetail))) {
				goodsStatisticsDetail();
			} else {
				errorPermission(ControlType.goodsSaleScoreDetail);
			}
			return true;
		case fileExportGoodsStatisticsDetail:// 导出产品统计详情
			if (employee.hasPermission(handlePermission.get(ControlType.fileExportGoodsStatisticsDetail))) {
				fileExportGoodsStatisticsDetail();
			} else {
				errorPermission(ControlType.fileExportGoodsStatisticsDetail);
			}
			return true;
		case queryCustomerStatList:// 门店拜访统计
			if (employee.hasPermission(handlePermission.get(ControlType.queryCustomerStatList))) {
				queryCustomerStatList();
			} else {
				errorPermission(ControlType.queryCustomerStatList);
			}
			return true;
		case queryGoodsStatList:// 产品拜访统计
			if (employee.hasPermission(handlePermission.get(ControlType.queryGoodsStatList))) {
				queryGoodsStatList();
			} else {
				errorPermission(ControlType.queryGoodsStatList);
			}
			return true;
		default:
			return false;
		}
	}

	/***
	 * 导出拜访统计产品详情
	 */
	private void fileExportGoodsStatisticsDetail() {
		try {
			List<Map<String, Object>> list = fileExportShopPointDetail();
			if (list.size() > 0) {
				exportListData(list);
				log.trace("导出列表数据结束...");
			} else {
				log.trace("暂无数据！");
				writer.print(new SuccessJSON("msg", "暂无数据！"));
			}
		} catch (Exception e) {
			log.error("参数异常！", e);
			writer.print(ErrorCode.EXPORT_FILE_FAIL);
		}

	}

	/***
	 * 查询产品在门店的铺点数详情
	 * 
	 * @return
	 */
	private List<Map<String, Object>> fileExportShopPointDetail() {
		Integer goodsId = Integer.valueOf(dataJson.get("goodsId").toString());
		String startDate = dataJson.getString("startDate");
		String endDate = dataJson.getString("endDate");
		DBHelper dbHelper = DBHelperFactory.getDBHelper();
		List<Map<String, Object>> dataList = new ArrayList<>();
		ResultSet rs = null;
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("select distinct customer_id,a.*,f.supplier_name,c.customer_name,")
					.append("b.sign_in_time,b.sign_out_time,h.china_customer_name,g.real_name,f.supplier_name")
					.append(" from customer_visits_detail a  left join customer_visits b  ")
					.append(" on a.visits_id = b.id  left join customer c on b.customer_id = c.id ")
					.append(" left join goods e on e.id = a.goods_id").append(" left join supplier f on f.id = e.supplier_id")
					.append(" left join employee g on g.id = b.visits_employee_id")
					.append(" left join chain_customer h on h.id = c.chain_customer_id").append(" where  a.goods_id = ")
					.append(goodsId);

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
			String yearMoth = sdf.format(new Date());
			if (StringUtils.isNotBlank(startDate) && StringUtils.isNotBlank(endDate)) {
				sql.append(" and b.sign_in_time between  ").append(dbHelper.getString(startDate)).append(" and  ")
						.append(dbHelper.getString(endDate));
			} else {
				sql.append(" and convert(char(7) ,b.sign_in_time , 120) = ").append(dbHelper.getString(yearMoth));
			}

			rs = dbHelper.select(sql.toString());
			while (rs.next()) {
				Map<String, Object> map = new HashMap<>();
				map.put("编号", rs.getObject("id"));// 编号
				map.put("开始时间", rs.getObject("sign_in_time"));// 开始时间
				map.put("门店名称", rs.getObject("customer_name"));// 门店名称
				map.put("连锁", rs.getObject("china_customer_name"));// 连锁
				map.put("代表", rs.getObject("real_name"));// 代表
				map.put("供应商", rs.getObject("supplier_name"));// 供应商
				map.put("陈列面", rs.getObject("display_surface"));// 陈列面
				map.put("陈列数", rs.getObject("display_number"));// 陈列数
				map.put("标签价", rs.getObject("tag_price"));// 标签价
				map.put("铺点数", rs.getObject("shop_point") == null ? "" : rs.getObject("shop_point"));// 铺点数
				map.put("库存", rs.getObject("real_stock"));// 库存
				map.put("结束时间", rs.getObject("sign_out_time"));// 结束时间
				dataList.add(map);
			}
		} catch (Exception e) {
			logger.error("出现异常！", e);
		} finally {
			dbHelper.close(rs);
		}
		return dataList;
	}

	/***
	 * 产品拜访统计详情
	 */
	private void goodsStatisticsDetail() {
		ResultSet rs = null;
		try {
			Integer goodsId = Integer.valueOf(dataJson.get("goodsId").toString());
			String startDate = dataJson.getString("startDate");
			String endDate = dataJson.getString("endDate");
			String name = dataJson.getString("name");
			String chainCustomerId = dataJson.getString("chainCustomerId");
			String employeeId = dataJson.getString("employeeId");
			Integer supperId = dataJson.getInteger("supperId");
			pageSize = dataJson.getInteger("pageSize");
			pageNumber = dataJson.getInteger("pageNumber");

			if (pageSize == null || pageNumber == null) {
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}

			StringBuilder sql = new StringBuilder();
			StringBuilder sql2 = new StringBuilder();
			// 查询一个产品的铺点数
			sql.append("select count(distinct customer_id) as count_shop_point,")
					.append("goods_id  from customer_visits_detail a  left join customer_visits b ")
					.append(" on a.visits_id = b.id  left join customer c on b.customer_id = c.id ")
					.append(" left join goods e on e.id = a.goods_id ").append(" left join supplier f on f.id = e.supplier_id ")
					.append(" where  a.goods_id = ").append(goodsId);

			// 查询一个产品代表的铺点数
			sql2.append("select count(distinct customer_id) as count_shop_point,")
					.append("goods_id,b.visits_employee_id from customer_visits_detail a  left join customer_visits b ")
					.append(" on a.visits_id = b.id  left join customer c on b.customer_id = c.id ")
					.append(" left join goods e on e.id = a.goods_id ").append(" left join supplier f on f.id = e.supplier_id ")
					.append(" where  a.goods_id = ").append(goodsId);

			if (supperId != null) {
				sql.append(" and e.supplier_id = ").append(supperId);
				sql2.append(" and e.supplier_id = ").append(supperId);
			}

			if (StringUtils.isNotBlank(employeeId)) {
				String str2 = employeeId.substring(employeeId.length() - 1);
				if (str2.equals(",")) {
					employeeId = employeeId.substring(0, employeeId.length() - 1);
				}

				sql.append(" and b.visits_employee_id in ( ").append(employeeId).append(")");
				sql2.append(" and b.visits_employee_id in (").append(employeeId).append(")");
			}

			Integer userId = employee.get("id");
			Employee user = EmployeeFactory.getInstance().getObject("id", userId);
			if ((Integer) user.get("employee_type") == 1) {
				sql.append(" and b.visits_employee_id = ").append(userId);
				sql2.append(" and b.visits_employee_id = ").append(userId);
			}

			if (StringUtils.isNotBlank(chainCustomerId)) {
				String str2 = chainCustomerId.substring(chainCustomerId.length() - 1);
				if (str2.equals(",")) {
					chainCustomerId = chainCustomerId.substring(0, chainCustomerId.length() - 1);
				}
				sql.append(" and c.chain_customer_id in ( ").append(chainCustomerId).append(")");
				sql2.append(" and c.chain_customer_id in ( ").append(chainCustomerId).append(")");
			}

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
			String yearMoth = sdf.format(new Date());
			if (StringUtils.isNotBlank(startDate) && StringUtils.isNotBlank(endDate)) {
				sql.append(" and b.sign_in_time between  ").append(dbHelper.getString(startDate)).append(" and  ")
						.append(dbHelper.getString(endDate));
				sql2.append(" and b.sign_in_time between  ").append(dbHelper.getString(startDate)).append(" and  ")
						.append(dbHelper.getString(endDate));
			} else {
				sql.append(" and convert(char(7) ,b.sign_in_time , 120) = ").append(dbHelper.getString(yearMoth));
				sql2.append(" and convert(char(7) ,b.sign_in_time , 120) = ").append(dbHelper.getString(yearMoth));
			}

			if (StringUtils.isNotBlank(name)) {
				sql.append(" and (").append("c.customer_name like ").append(dbHelper.getString("%" + name + "%")).append(" or")
						.append(" f.supplier_name like ").append(dbHelper.getString("%" + name + "%")).append(" or")
						.append(" exists(").append(" select * from employee e where e.id = b.visits_employee_id")
						.append(" and e.real_name like ").append(dbHelper.getString("%" + name + "%")).append("))");

				sql2.append(" and (").append("c.customer_name like ").append(dbHelper.getString("%" + name + "%")).append(" or")
						.append(" f.supplier_name like ").append(dbHelper.getString("%" + name + "%")).append(" or")
						.append(" exists(").append(" select * from employee e where e.id = b.visits_employee_id")
						.append(" and e.real_name like ").append(dbHelper.getString("%" + name + "%")).append("))");
			}
			sql.append(" group BY a.goods_id ");
			sql2.append(" group BY a.goods_id,b.visits_employee_id  ");

			// 铺点数区域百分比
			List<Map<String, Integer>> list = new ArrayList<>();
			// 所有区域的铺点数和
			Integer sum_count_shop_point = 0;
			Integer count_shop_point = 0;
			try {
				rs = dbHelper.select(sql2.toString());
				Integer visits_employee_id = null;
				while (rs.next()) {
					visits_employee_id = rs.getInt("visits_employee_id");
					if (visits_employee_id != null) {
						Map<String, Integer> map = new HashMap<>();
						count_shop_point = rs.getInt("count_shop_point");
						sum_count_shop_point += count_shop_point;
						map.put("count_shop_point", count_shop_point);
						map.put("visits_employee_id", visits_employee_id);
						list.add(map);
					}
				}
			} catch (SQLException e) {
				log.error("其他异常！", e);
				writer.print(ErrorCode.GET_LIST_INFO_ERROR);
				return;
			} finally {
				dbHelper.close(rs);
			}

			SuccessJSON successJSON = new SuccessJSON();
			Goods goods = GoodsFactory.getInstance().getObject("id", goodsId);
			if (goods != null) {
				successJSON.put("goods_name", goods.get("goods_name"));
				successJSON.put("specification", goods.get("specification"));
			}

			// 地区铺点数百分比
			successJSON.put("areaDivisioRatio", getAreaDivisioRatio(list, sum_count_shop_point));
			// 产品在门店的铺点数详情列表
			List<Map<String, Object>> dataList = queryShopPointDetail();
			List<Map<String, Object>> noShopPointDetailList = queryNoShopPointDetail();
			List<Map<String, Object>> pageList = PageUtil.getPageList(pageNumber, pageSize, dataList);// 有铺点门店
			List<Map<String, Object>> pageList2 = PageUtil.getPageList(pageNumber, pageSize, noShopPointDetailList);// 无铺点门店
			successJSON.put("list", pageList);
			successJSON.put("noShopPointDetailList", pageList2);
			successJSON.put("count", dataList.size());
			successJSON.put("noShopPointDetailListCount", noShopPointDetailList.size());
			Double shop_point_ratio = new Double(dataList.size()) / (noShopPointDetailList.size() + dataList.size());
			if (shop_point_ratio.isNaN()) {
				shop_point_ratio = 0.00;
			}
			successJSON.put("shop_point_ratio", ObjectUtil.convert(shop_point_ratio, 4));// 铺点数百分比
			successJSON.put("no_shop_point_ratio", ObjectUtil.convert(1 - shop_point_ratio, 4));// 没铺点数百分比
			writer.print(successJSON);

		} catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		} catch (NumberFormatException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	/****
	 * 计算地区铺点数百分比
	 * 
	 * @param list
	 * @param sum_count_shop_point
	 *          总铺点数
	 * @return
	 */
	private List<Map<String, Double>> getAreaDivisioRatio(List<Map<String, Integer>> list, Integer sum_count_shop_point) {
		List<Map<String, Double>> areaDivisioRatio = new ArrayList<>();
		try {
			List<Employee> empList = EmployeeFactory.getInstance()
					.getObjectsForString(" where flag = 1 and real_name!='' and employee_type = 1 ", employee);
			String area_name = "";
			Integer visits_employee_id = 0;
			for (Employee emp : empList) {
				area_name = emp.get("real_name");
				visits_employee_id = emp.get("id");
				if (visits_employee_id != 0) {
					Map<String, Double> map = new HashMap<>();
					boolean ifag = true;// 标记是已经添加
					for (Map<String, Integer> areaDivisioRatioMap : list) {
						Integer visits_employee_id2 = areaDivisioRatioMap.get("visits_employee_id");
						Integer count_shop_point2 = areaDivisioRatioMap.get("count_shop_point");
						Double ratio = count_shop_point2.doubleValue() / sum_count_shop_point.doubleValue();
						if (visits_employee_id.intValue() == visits_employee_id2.intValue()) {
							map.put(area_name, ObjectUtil.convert(ratio));
							ifag = false;
						}
					}

					if (ifag) {
						// 地区名：铺点数百分比
						map.put(area_name, 0.0);
					}
					areaDivisioRatio.add(map);
				}
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return areaDivisioRatio;
	}

	/***
	 * 查询产品在门店的铺点数详情
	 * 
	 * @return
	 */
	private List<Map<String, Object>> queryShopPointDetail() {
		Integer goodsId = Integer.valueOf(dataJson.get("goodsId").toString());
		String startDate = dataJson.getString("startDate");
		String endDate = dataJson.getString("endDate");
		String name = dataJson.getString("name");
		String chainCustomerId = dataJson.getString("chainCustomerId");
		String employeeId = dataJson.getString("employeeId");
		Integer supperId = dataJson.getInteger("supperId");
		DBHelper dbHelper = DBHelperFactory.getDBHelper();
		List<Map<String, Object>> dataList = new ArrayList<>();
		ResultSet rs = null;
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("select customer_id,a.*,f.supplier_name,c.customer_name,")
					.append("b.sign_in_time,b.sign_out_time,h.china_customer_name,g.real_name,f.supplier_name")
					.append(" from customer_visits_detail a  left join customer_visits b  ")
					.append(" on a.visits_id = b.id  left join customer c on b.customer_id = c.id ")
					.append(" left join goods e on e.id = a.goods_id").append(" left join supplier f on f.id = e.supplier_id")
					.append(" left join employee g on g.id = b.visits_employee_id")
					.append(" left join chain_customer h on h.id = c.chain_customer_id").append(" where  a.goods_id = ")
					.append(goodsId);

			if (supperId != null) {
				sql.append(" and e.supplier_id = ").append(supperId);
			}

			if (StringUtils.isNotBlank(employeeId)) {
				String str2 = employeeId.substring(employeeId.length() - 1);
				if (str2.equals(",")) {
					employeeId = employeeId.substring(0, employeeId.length() - 1);
				}
				sql.append(" and b.visits_employee_id in (").append(employeeId).append(")");
			}

			Integer userId = employee.get("id");
			Employee user = EmployeeFactory.getInstance().getObject("id", userId);
			if ((Integer) user.get("employee_type") == 1) {
				sql.append(" and b.visits_employee_id = ").append(userId);
			}

			if (StringUtils.isNotBlank(chainCustomerId)) {
				String str2 = chainCustomerId.substring(chainCustomerId.length() - 1);
				if (str2.equals(",")) {
					chainCustomerId = chainCustomerId.substring(0, chainCustomerId.length() - 1);
				}
				sql.append(" and c.chain_customer_id in (").append(chainCustomerId).append(")");
			}

			if (StringUtils.isNotBlank(name)) {
				sql.append(" and (").append(" c.customer_name like ").append(dbHelper.getString("%" + name + "%")).append(" or")
						.append(" f.supplier_name like ").append(dbHelper.getString("%" + name + "%")).append(" or")
						.append(" exists(").append(" select * from employee e where e.id = b.visits_employee_id")
						.append(" and e.real_name like ").append(dbHelper.getString("%" + name + "%")).append(" ))");
			}

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
			String yearMoth = sdf.format(new Date());
			if (StringUtils.isNotBlank(startDate) && StringUtils.isNotBlank(endDate)) {
				sql.append(" and b.sign_in_time between  ").append(dbHelper.getString(startDate)).append(" and  ")
						.append(dbHelper.getString(endDate));
			} else {
				sql.append(" and convert(char(7) ,b.sign_in_time , 120) = ").append(dbHelper.getString(yearMoth));
			}

			rs = dbHelper.select(sql.toString());
			Set<String> set = new HashSet<>();// 去重
			while (rs.next()) {
				Integer id = rs.getInt("customer_id");
				if (!set.contains(id + "")) {
					set.add(id + "");
				} else {
					continue;
				}
				JSONObject object = new JSONObject();
				object.put("id", rs.getObject("id"));// 编号
				object.put("visits_id", rs.getObject("visits_id"));// 拜访编号
				object.put("goods_id", rs.getObject("goods_id"));// 产品编号
				object.put("sign_in_time", DateUtil.formatDate(rs.getObject("sign_in_time"), "yyyy-MM-dd hh:mm:ss"));// 开始时间
				object.put("customer_name", rs.getObject("customer_name"));// 门店名称
				object.put("china_customer_name", rs.getObject("china_customer_name"));// 连锁
				object.put("employee_name", rs.getObject("real_name"));// 代表
				object.put("supplier_name", rs.getObject("supplier_name"));// 供应商
				object.put("display_surface", rs.getObject("display_surface"));// 陈列面
				object.put("display_number", rs.getObject("display_number"));// 陈列数
				object.put("tag_price", rs.getObject("tag_price"));// 标签价
				object.put("shop_point", rs.getObject("shop_point") == null ? "" : rs.getObject("shop_point"));// 铺点数
				object.put("real_stock", rs.getObject("real_stock"));// 库存
				object.put("sign_out_time", DateUtil.formatDate(rs.getObject("sign_out_time"), "yyyy-MM-dd hh:mm:ss"));// 结束时间
				dataList.add(object);
			}

		} catch (Exception e) {
			logger.error("出现异常！", e);
		} finally {
			dbHelper.close(rs);
		}
		return dataList;
	}

	/***
	 * 查询产品在门店的没有铺点数详情
	 * 
	 * @return
	 */
	private List<Map<String, Object>> queryNoShopPointDetail() {
		Integer goodsId = Integer.valueOf(dataJson.get("goodsId").toString());
		String startDate = dataJson.getString("startDate");
		String endDate = dataJson.getString("endDate");
		String name = dataJson.getString("name");
		String chainCustomerId = dataJson.getString("chainCustomerId");
		String employeeId = dataJson.getString("employeeId");
		Integer supperId = dataJson.getInteger("supperId");
		DBHelper dbHelper = DBHelperFactory.getDBHelper();
		List<Map<String, Object>> dataList = new ArrayList<>();
		ResultSet rs = null;
		try {
			StringBuilder sql = new StringBuilder();// 查询未铺点的门店
			sql.append("select c.id,c.customer_name,")
					.append(" t.sign_in_time,t.sign_out_time,h.china_customer_name,g.real_name,g.id")
					.append(" from customer_visits t ").append(" inner join customer c ").append(" on t.customer_id = c.id ")
					.append(" left join employee g ").append(" on g.id = t.visits_employee_id")
					.append(" left join chain_customer h ").append(" on h.id = c.chain_customer_id")
					.append(" where t.customer_id not in")
					.append(" (select distinct b.customer_id from customer_visits_detail a  left join customer_visits b ")
					.append(" on a.visits_id = b.id  left join customer c ")
					.append(" on b.customer_id = c.id  left join goods e ").append(" on e.id = a.goods_id left join supplier f ")
					.append(" on f.id = e.supplier_id left join employee g ")
					.append(" on g.id = b.visits_employee_id left join chain_customer h ")
					.append(" on h.id = c.chain_customer_id where  ").append(" a.goods_id = ").append(goodsId);
			if (StringUtils.isNotBlank(employeeId)) {
				String str2 = employeeId.substring(employeeId.length() - 1);
				if (str2.equals(",")) {
					employeeId = employeeId.substring(0, employeeId.length() - 1);
				}
				sql.append(" and b.visits_employee_id in (").append(employeeId).append(")");
			}

			Integer userId = employee.get("id");
			Employee user = EmployeeFactory.getInstance().getObject("id", userId);
			if ((Integer) user.get("employee_type") == 1) {
				sql.append(" and b.visits_employee_id = ").append(userId);
			}

			if (supperId != null) {
				sql.append(" and e.supplier_id = ").append(supperId);
			}

			if (StringUtils.isNotBlank(chainCustomerId)) {
				String str2 = chainCustomerId.substring(chainCustomerId.length() - 1);
				if (str2.equals(",")) {
					chainCustomerId = chainCustomerId.substring(0, chainCustomerId.length() - 1);
				}
				sql.append(" and c.chain_customer_id in (").append(chainCustomerId).append(")");
			}

			if (StringUtils.isNotBlank(name)) {
				sql.append(" and (").append(" c.customer_name like ").append(dbHelper.getString("%" + name + "%")).append(" or")
						.append(" f.supplier_name like ").append(dbHelper.getString("%" + name + "%")).append(" or")
						.append(" exists(").append(" select * from employee e where e.id = b.visits_employee_id")
						.append(" and e.real_name like ").append(dbHelper.getString("%" + name + "%")).append(" ))");
			}

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
			String yearMoth = sdf.format(new Date());
			if (StringUtils.isNotBlank(startDate) && StringUtils.isNotBlank(endDate)) {
				sql.append(" and b.sign_in_time between ").append(dbHelper.getString(startDate)).append(" and ")
						.append(dbHelper.getString(endDate));
			} else {
				sql.append(" and convert(char(7) ,b.sign_in_time , 120) = ").append(dbHelper.getString(yearMoth));
			}
			sql.append(") ");
			if (StringUtils.isNotBlank(employeeId)) {
				String str2 = employeeId.substring(employeeId.length() - 1);
				if (str2.equals(",")) {
					employeeId = employeeId.substring(0, employeeId.length() - 1);
				}
				sql.append("  and t.visits_employee_id in (").append(employeeId).append(")");
			}

			if ((Integer) user.get("employee_type") == 1) {
				sql.append(" and t.visits_employee_id = ").append(userId);
			}

			if (StringUtils.isNotBlank(startDate) && StringUtils.isNotBlank(endDate)) {
				sql.append(" and t.sign_in_time between  ").append(dbHelper.getString(startDate)).append(" and  ")
						.append(dbHelper.getString(endDate));
			} else {
				sql.append("  and convert(char(7) ,t.sign_in_time , 120) = ").append(dbHelper.getString(yearMoth));
			}

			Set<String> set = new HashSet<>();// 去重
			rs = dbHelper.select(sql.toString());
			while (rs.next()) {
				JSONObject object = new JSONObject();
				Integer id = rs.getInt("id");
				if (!set.contains(id + "")) {
					set.add(id + "");
				} else {
					continue;
				}
				object.put("id", rs.getObject("id"));// 编号
				// object.put("visits_id", rs.getObject("visits_id"));//拜访编号
				// object.put("goods_id", goodsId);//产品编号
				object.put("sign_in_time", DateUtil.formatDate(rs.getObject("sign_in_time"), "yyyy-MM-dd hh:mm:ss"));// 开始时间
				object.put("customer_name", rs.getObject("customer_name"));// 门店名称
				object.put("china_customer_name", rs.getObject("china_customer_name"));// 连锁
				object.put("employee_name", rs.getObject("real_name"));// 代表
				Goods goods = GoodsFactory.getInstance().getObject("id", goodsId);
				if (goods != null) {
					Long goods_id = goods.get("id");
					Supplier supplier = SupplierFactory.getInstance().getObject("id", goods_id.intValue());
					object.put("supplier_name", supplier != null ? supplier.get("supplier_name") : "");// 供应商
				} else {
					object.put("supplier_name", "");// 供应商
				}

				/*
				 * object.put("display_surface", rs.getObject("display_surface"));//陈列面
				 * object.put("display_number", rs.getObject("display_number"));//陈列数
				 * object.put("tag_price", rs.getObject("tag_price"));//标签价
				 * object.put("shop_point",
				 * rs.getObject("shop_point")==null?"":rs.getObject("shop_point"));//铺点数
				 * object.put("real_stock", rs.getObject("real_stock"));//库存
				 */
				object.put("sign_out_time", DateUtil.formatDate(rs.getObject("sign_out_time"), "yyyy-MM-dd hh:mm:ss"));// 结束时间
				dataList.add(object);
			}

		} catch (Exception e) {
			logger.error("出现异常！", e);
		} finally {
			dbHelper.close(rs);
		}
		return dataList;
	}

	@Override
	protected void queryAll() {

	}

	@Override
	protected void delete() {
	}

	@Override
	protected void update() {

	}

	@Override
	protected void query() {
		log.trace("查询拜访统计信息列表初始...");
		// 查询类型（store:门店，product:产品)
		String selectType;
		try {
			selectType = dataJson.getString("selectType");
		} catch (Exception e) {
			log.error("获取查询拜访统计信息异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (StringUtils.isEmpty(selectType)) {
			log.trace("获取列表查询类型失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		queryStatList();
	}

	/***
	 * 产品拜访统计
	 */
	private void queryGoodsStatList() {
		// 计划月份
		String planMonth;
		// 产品ID
		String goodId;
		// 用户类型
		Integer employeeType = employee.get("employee_type");
		String name = dataJson.getString("name");
		try {
			goodId = dataJson.getString("goods_id");
			planMonth = dataJson.getString("planMonth");
		} catch (Exception e) {
			log.error("获取查询拜访统计信息异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		// 判断是何种用户
		if (null == employeeType) {
			log.trace("获取当前用户类型失败！");
			writer.print(ErrorCode.GET_USER_TYPE_FAIL);
			return;
		}
		// 判断当前用户是否代表
		boolean isType1 = employeeType == 1 ? true : false;

		// 如果月份没有传，默认当前月份
		if (StringUtils.isEmpty(planMonth)) {
			planMonth = DateUtil.getTime("yyyy-MM");
		}
		pageSize = Integer
				.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
		pageNumber = Integer
				.parseInt(StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));
		// 根据产品查询结果
		ResultSet rs = null;
		ResultSet rs2 = null;
		// 返回信息
		SuccessJSON success = new SuccessJSON();
		List<JSONObject> dataArry = new ArrayList<>();
		// 拼凑SQL
		StringBuilder sql = new StringBuilder();

		List<JSONObject> subList = new ArrayList<>();
		StringBuilder goodsIds = new StringBuilder();
		UserLookOverPermission userLookOverPermission = employee.getUserLookOverPermission();
		boolean ifag = true;
		if (userLookOverPermission != null) {
			Set<Integer> set = userLookOverPermission.get("goods");
			if (set == null) {
				ifag = false;
			} else if (set.size() > 0) {
				for (Integer integer : set) {
					goodsIds.append(integer).append(",");
				}
			}
		} else {
			ifag = false;
		}

		if (goodsIds.length() > 0) {
			goodsIds.delete(goodsIds.length() - 1, goodsIds.length());
		}

		// 根据产品ID查询平均盘点明细
		sql.append(" select c.*,a.goods_name,a.specification,b.supplier_name from (");
		sql.append(
				" select t.goods_id,sum(t.display_surface)display_surface_count,sum(t.display_number)display_number_count,round(avg(cast(t.display_number AS FLOAT)), 2)  AS display_number,round(avg(cast(t.display_surface AS FLOAT)), 2) AS display_surface,");
		sql.append(
				" convert(float,round(avg(t.tag_price),2)) as tag_price,avg(t.shop_point)as shop_point,avg(t.sail_total)as sail_total ");
		sql.append(
				" from customer_visits_detail t inner join customer_visits v on v.id=t.visits_id where v.flag = 1 and convert(char(7) ,sign_in_time , 120)= '"
						+ planMonth + "' ");
		if (StringUtils.isNotEmpty(goodId)) {
			sql.append(" and t.goods_id in (").append(goodId).append(")");
		}

		if (ifag) {
			sql.append(" and t.goods_id in (").append(goodsIds.toString()).append(")");
		}

		if (isType1) {
			sql.append(" and exists(").append(" select 1 from  customer_visits a where a.id = t.visits_id ")
					.append(" and a.visits_employee_id = ").append(employee.getId()).append(")");
		}

		sql.append(" group BY t.goods_id ");
		sql.append(" ) c left join goods a on a.id = c.goods_id left join supplier b on a.supplier_id = b.id where 1 = 1 ");
		if (StringUtils.isNotBlank(name)) {
			String str = name.substring(name.length() - 1);
			if (str.equals(",")) {
				name = name.substring(0, name.length() - 1);
			}
			String[] split3 = name.split(",");
			boolean ifag2 = true;
			if (split3.length == 0) {
				ifag2 = false;
			}
			for (String id : split3) {
				// 判断是否整数
				if (!id.matches("[0-9]+")) {
					ifag2 = false;
					break;
				}
			}

			if (ifag2) {
				sql.append(" and a.id in (").append(name.toString()).append(")");
			} else {
				sql.append("and (a.goods_name like ").append(dbHelper.getString("%" + name + "%"))
						.append("or b.supplier_name like ").append(dbHelper.getString("%" + name + "%")).append(")");
			}
		}

		try {
			rs = dbHelper.select(sql.toString());
			while (rs.next()) {
				JSONObject object = new JSONObject();
				// 供应商名
				object.put("supplier", rs.getString("supplier_name"));
				object.put("goods_id", rs.getString("goods_id"));
				object.put("goods_name", rs.getString("goods_name"));
				// 规格
				object.put("specification", rs.getString("specification"));
				object.put("display_surface", convert(rs.getDouble("display_surface")));
				object.put("display_surface_count", rs.getString("display_surface_count"));
				object.put("display_number", ObjectUtil.convert(rs.getDouble("display_number")));
				object.put("display_number_count", rs.getString("display_number_count"));
				object.put("weighted_price", ObjectUtil.convert(rs.getDouble("tag_price")));
				object.put("shop_point", rs.getString("shop_point"));
				object.put("sail_total", rs.getString("sail_total"));
				dataArry.add(object);
			}

			sql.delete(0, sql.length());
			sql.append("select count(distinct customer_id) as count_shop_point,goods_id ")
					.append(" from customer_visits_detail a ").append(" left join customer_visits b ")
					.append(" on a.visits_id = b.id ").append(" left join customer c").append(" on b.customer_id = c.id ")
					.append(" where convert(char(7) ,b.sign_in_time , 120)= ").append(dbHelper.getString(planMonth));
			if (ifag) {
				sql.append(" and goods_id in(").append(goodsIds.toString()).append(")");
			}

			if (isType1) {
				sql.append(" and b.visits_employee_id = ").append(employee.getId());
			}

			sql.append(" group BY goods_id ");
			rs2 = dbHelper.select(sql.toString());

			String goods_id_rs = "";
			String goods_id_json = "";
			Integer count_shop_point = 0;
			while (rs2.next()) {
				goods_id_rs = rs2.getString("goods_id");
				for (JSONObject object : dataArry) {
					goods_id_json = object.getString("goods_id");
					if (StringUtils.equals(goods_id_rs, goods_id_json)) {
						count_shop_point = rs2.getInt("count_shop_point");
						object.put("shop_point", count_shop_point);
					}
				}
			}

			// 分页
			subList = PageUtil.getPageList(pageNumber, pageSize, dataArry);
		} catch (SQLException e) {
			log.error("根据产品查询统计发生异常：{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
			return;
		} finally {
			dbHelper.close(rs);
			dbHelper.close(rs2);
		}
		success.put("list", subList);
		success.put("count", dataArry.size());
		writer.print(success);
	}

	/***
	 * 门店拜访统计
	 */
	private void queryCustomerStatList() {
		// 计划月份
		String planMonth;
		// 根据门店统计（按时间段）
		String timeStart;
		String timeEnd;
		// 客户Id
		String customId;
		// 连锁门店Id
		String chain_customId;
		// 拜访人
		String visitMan;
		// 拜访人
		String visitId;
		// 用户类型
		Integer employeeType = employee.get("employee_type");
		try {
			visitMan = dataJson.getString("visitMan");
			visitId = dataJson.getString("employee_id");
			chain_customId = dataJson.getString("chain_customId");
			customId = dataJson.getString("custom_id");
			timeStart = dataJson.getString("timeStart");
			timeEnd = dataJson.getString("timeEnd");
			planMonth = dataJson.getString("planMonth");
		} catch (Exception e) {
			log.error("获取查询拜访统计信息异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		// 判断是何种用户
		if (null == employeeType) {
			log.trace("获取当前用户类型失败！");
			writer.print(ErrorCode.GET_USER_TYPE_FAIL);
			return;
		}
		// 如果是代表
		if (1 == employeeType) {
			visitId = employee.get("id");
			visitMan = "";
		}
		// 如果月份没有传，默认当前月份
		if (StringUtils.isEmpty(planMonth)) {
			planMonth = DateUtil.getTime("yyyy-MM");
		}
		pageSize = Integer
				.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
		pageNumber = Integer
				.parseInt(StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));
		// 拜访统计（门店）
		List<Visits> visitsesList = null;
		// 根据产品查询结果
		// 返回信息
		SuccessJSON success = new SuccessJSON();
		List<JSONObject> dataArry = new ArrayList<>();
		// 拼凑SQL
		StringBuilder sql = new StringBuilder();

		// 根据店铺
		try {
			// 如果单选商业客户
			if (StringUtils.isNotBlank(chain_customId) && StringUtils.isBlank(customId)) {
				sql.append(" left join customer c on c.id = t.customer_id ");
				sql.append(" left join chain_customer ch on ch.id = c.chain_customer_id ");
			}
			if (StringUtils.isNotBlank(customId)) {
				sql.append(" left join customer c on c.id = t.customer_id ");
			}
			sql.append(" inner join customer_visits_plan p on p.id= t.plan_id ");
			// 拜访人
			if (StringUtils.isNotEmpty(visitMan)) {
				sql.append(" left join employee e on e.id = t.visits_employee_id ");
			}
			sql.append(" WHERE (t.flag = 1 or t.flag = 2) ");
			// 拜访人
			if (StringUtils.isNotBlank(visitId)) {
				String str2 = visitId.substring(visitId.length() - 1);
				if (str2.equals(",")) {
					visitId = visitId.substring(0, visitId.length() - 1);
				}
				sql.append(" and t.visits_employee_id in (" + visitId).append(")");
			}
			// 计划开始时间
			if (StringUtils.isNotEmpty(timeStart)) {
				sql.append(" and convert(char(10) ,T.sign_in_time , 120) >= '" + timeStart + "'");
			}
			// 计划结束时间
			if (StringUtils.isNotEmpty(timeEnd)) {
				sql.append(" and convert(char(10) ,T.sign_in_time , 120) <= '" + timeEnd + "'");
			}
			// 如果开始和结束时间都没有传，则只查当月的数据
			if (StringUtils.isEmpty(timeStart) && StringUtils.isEmpty(timeEnd)) {
				sql.append(" and convert(char(7) ,T.sign_in_time , 120) = '" + planMonth + "'");
			}
			// 只选了商业客户（显示商业客户以及之下的门店客户）
			if (StringUtils.isNotBlank(chain_customId) && StringUtils.isBlank(customId)) {
				String str2 = chain_customId.substring(chain_customId.length() - 1);
				if (str2.equals(",")) {
					chain_customId = chain_customId.substring(0, chain_customId.length() - 1);
				}
				sql.append(
						" and (t.customer_id in (" + chain_customId + ") or c.chain_customer_id in(" + chain_customId + " )) ");
			}
			if (StringUtils.isNotBlank(customId)) {
				sql.append(" and t.customer_id in (").append(customId).append(")");
			}
			// 拜访人
			if (StringUtils.isNotEmpty(visitMan)) {
				sql.append(" and (e.real_name like ").append(dbHelper.getString("%" + visitMan + "%"))
						.append(" or exists(select 1 from customer f ")
						.append(" where f.id = t.customer_id and p.customer_type = 1 and f.customer_name like ")
						.append(dbHelper.getString("%" + visitMan + "%")).append(")")
						.append(" or exists(select 1 from chain_customer g")
						.append(" where g.id = t.customer_id and p.customer_type = 2 and g.china_customer_name like ")
						.append(dbHelper.getString("%" + visitMan + "%")).append("))");
			}
			sql.append(" ORDER BY T.sign_in_time ASC");
			visitsesList = visitsFactory.getObjectsForString(sql.toString(), employee);
			for (Visits visit : visitsesList) {
				Date signInTime = visit.get("sign_in_time");
				Date signOutTime = visit.get("sign_out_time");
				// 存储对象
				JSONObject object = new JSONObject();
				Store customer = null;
				// 获取到拜访计划
				VisitPlan plan = visitPlanFactory.getObject("id", visit.get("plan_id"));
				// 获取到门店类型
				Integer costomType = plan.get("customer_type");
				if (1 == costomType) {
					customer = customerFactory.getObject("id", visit.get("customer_id"));
					// 客户名
					object.put("coustom", customer == null ? "" : customer.get("customer_name"));
					// 客户类型名称
					object.put("costomTypeName", "门店客户");
				} else if (2 == costomType) {
					customer = chainCustomerFactory.getObject("id", visit.get("customer_id"));
					object.put("coustom", customer == null ? "" : customer.get("china_customer_name"));
					// 客户类型名称
					object.put("costomTypeName", "连锁客户");
				}
				// 客户类型
				object.put("costomType", costomType);
				object.put("id", visit.get("id"));
				object.put("custom_id", customer == null ? "" : customer.get("id"));
				object.put("address", customer == null ? "" : customer.get("address"));
				object.put("sign_in_time", DateUtil.formatDate(signInTime, "yyyy-MM-dd hh:mm:ss"));
				object.put("sign_out_time", DateUtil.formatDate(signOutTime, "yyyy-MM-dd hh:mm:ss"));
				if (signInTime != null && signOutTime != null) {
					object.put("stayTime", (signOutTime.getTime() - signInTime.getTime()) / 1000 / 60);
				}
				object.put("flag", visit.get("flag"));
				object.put("mark_type", "正常");
				// 拜访人
				object.put("visitor",
						EmployeeFactory.getInstance().getObject("id", visit.get("visits_employee_id")).get("real_name"));
				dataArry.add(object);
			}

			sql.delete(0, sql.length());
			// 如果单选商业客户
			if (StringUtils.isNotBlank(chain_customId) && StringUtils.isBlank(customId)) {
				sql.append(" left join customer c on c.id = t.custom_id ");
				sql.append(" left join chain_customer ch on ch.id = c.chain_customer_id ");
			}
			if (StringUtils.isNotBlank(customId)) {
				sql.append(" left join customer c on c.id = t.custom_id ");
			}
			sql.append(" where t.flag = 1 and t.mark_type is not null ");
			sql.append(" and t.plan_in_time between ")
			.append(dbHelper.getString(timeStart))
			.append(" and ").append(dbHelper.getString(timeEnd));
			// 拜访人
			if (StringUtils.isNotBlank(visitId)) {
				String str2 = visitId.substring(visitId.length() - 1);
				if (str2.equals(",")) {
					visitId = visitId.substring(0, visitId.length() - 1);
				}
				sql.append(" and t.employee_id in (").append(visitId).append(")");
			}

			if (StringUtils.isNotBlank(customId)) {
				sql.append(" and t.custom_id in (").append(customId).append(")");
			}

			// 只选了商业客户（显示商业客户以及之下的门店客户）
			if (StringUtils.isNotBlank(chain_customId) && StringUtils.isBlank(customId)) {
				sql.append(" and (t.custom_id in (").append(chain_customId).append(")").append(" or c.chain_customer_id in (")
						.append(chain_customId).append("))");
			}

			List<VisitPlan> visitPlanList = VisitPlanFactory.getInstance().getObjectsForString(sql.toString(), employee);
			for (VisitPlan plan : visitPlanList) {
				Store customer = null;
				JSONObject object = new JSONObject();
				// 获取到门店类型
				Integer costomType = plan.get("customer_type");
				if (1 == costomType) {
					customer = customerFactory.getObject("id", plan.get("custom_id"));
					// 客户名
					object.put("coustom", customer == null ? "" : customer.get("customer_name"));
					// 客户类型名称
					object.put("costomTypeName", "门店客户");
				} else if (2 == costomType) {
					customer = chainCustomerFactory.getObject("id", plan.get("custom_id"));
					object.put("coustom", customer == null ? "" : customer.get("china_customer_name"));
					// 客户类型名称
					object.put("costomTypeName", "连锁客户");
				}
				// 客户类型
				object.put("costomType", costomType);
				object.put("id", plan.get("id"));
				object.put("custom_id", customer == null ? "" : customer.get("id"));
				object.put("address", customer == null ? "" : customer.get("address"));
				object.put("sign_in_time", "");
				object.put("sign_out_time", "");
				object.put("mark_type", plan.get("mark_type") == null ? "正常" : plan.get("mark_type"));
				object.put("flag", plan.get("flag"));
				// 拜访人
				object.put("visitor", EmployeeFactory.getInstance().getObject("id", plan.get("employee_id")).get("real_name"));
				dataArry.add(object);
			}

			List<JSONObject> pageList = PageUtil.getPageList(pageNumber, pageSize, dataArry);
			success.put("list", pageList);
			success.put("count", dataArry.size());
			writer.print(success);
		} catch (Exception e) {
			log.error("根据门店查询统计发生异常:{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
			return;
		}
	}

	/**
	 * 代表获取统计列表
	 */
	protected void queryEmployeeStat() {
		log.trace("查询代表拜访统计信息列表初始...");
		// 查询类型（store:门店，product:产品)
		String selectType;
		try {
			selectType = dataJson.getString("selectType");
		} catch (Exception e) {
			log.error("获取代表拜访统计信息异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (StringUtils.isEmpty(selectType)) {
			log.trace("获取代表统计查询类型失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		queryStatList();
	}

	/**
	 * 获得统计列表
	 */
	private void queryStatList() {
		// 查询类型（store:门店，product:产品)
		String selectType;
		// 计划月份
		String planMonth;
		// 根据门店统计（按时间段）
		String timeStart;
		String timeEnd;
		// 客户Id
		String customId;
		// 连锁门店Id
		String chain_customId;
		// 拜访人
		String visitMan;
		// 拜访人
		String visitId;
		// 产品ID
		String goodId;
		// 用户类型
		Integer employeeType = employee.get("employee_type");
		try {
			selectType = dataJson.getString("selectType");
			visitMan = dataJson.getString("visitMan");
			visitId = dataJson.getString("employee_id");
			chain_customId = dataJson.getString("chain_customId");
			customId = dataJson.getString("custom_id");
			goodId = dataJson.getString("goods_id");
			timeStart = dataJson.getString("timeStart");
			timeEnd = dataJson.getString("timeEnd");
			planMonth = dataJson.getString("planMonth");
		} catch (Exception e) {
			log.error("获取查询拜访统计信息异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		// 判断是何种用户
		if (null == employeeType) {
			log.trace("获取当前用户类型失败！");
			writer.print(ErrorCode.GET_USER_TYPE_FAIL);
			return;
		}
		// 如果是代表
		if (1 == employeeType) {
			visitId = employee.get("id");
			visitMan = "";
		}
		if (StringUtils.isEmpty(selectType)) {
			log.trace("获取列表查询类型失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		// 如果月份没有传，默认当前月份
		if (StringUtils.isEmpty(planMonth)) {
			planMonth = DateUtil.getTime("yyyy-MM");
		}
		pageSize = Integer
				.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
		pageNumber = Integer
				.parseInt(StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));
		// 拜访统计（门店）
		List<Visits> visitsesList = null;
		// 根据产品查询结果
		ResultSet rs = null;
		ResultSet rs2 = null;
		// 返回信息
		SuccessJSON success = new SuccessJSON();
		List<JSONObject> dataArry = new ArrayList<>();
		// 拼凑SQL
		StringBuilder sql = new StringBuilder();

		// 根据店铺
		if ("store".equals(selectType)) {
			try {
				// 如果单选商业客户
				if (StringUtils.isNotBlank(chain_customId) && StringUtils.isBlank(customId)) {
					sql.append(" left join customer c on c.id = t.customer_id ");
					sql.append(" left join chain_customer ch on ch.id = c.chain_customer_id ");
				}
				if (StringUtils.isNotBlank(customId)) {
					sql.append(" left join customer c on c.id = t.customer_id ");
				}
				sql.append(" inner join customer_visits_plan p on p.id= t.plan_id ");
				// 拜访人
				if (StringUtils.isNotEmpty(visitMan)) {
					sql.append(" left join employee e on e.id = t.visits_employee_id ");
				}
				sql.append(" WHERE (t.flag = 1 or t.flag = 2) ");
				// 拜访人
				if (null != visitId) {
					sql.append(" and t.visits_employee_id =" + visitId);
				}
				// 计划开始时间
				if (StringUtils.isNotEmpty(timeStart)) {
					sql.append(" and convert(char(10) ,T.sign_in_time , 120) >= '" + timeStart + "'");
				}
				// 计划结束时间
				if (StringUtils.isNotEmpty(timeEnd)) {
					sql.append(" and convert(char(10) ,T.sign_in_time , 120) <= '" + timeEnd + "'");
				}
				// 如果开始和结束时间都没有传，则只查当月的数据
				if (StringUtils.isEmpty(timeStart) && StringUtils.isEmpty(timeEnd)) {
					sql.append(" and convert(char(7) ,T.sign_in_time , 120) = '" + planMonth + "'");
				}
				// 只选了商业客户（显示商业客户以及之下的门店客户）
				if (StringUtils.isNotBlank(chain_customId) && StringUtils.isBlank(customId)) {
					sql.append(" and (t.customer_id in (").append(chain_customId).append(")")
							.append(" or c.chain_customer_id in (").append(chain_customId).append("))");
				}
				if (StringUtils.isNotBlank(customId)) {
					sql.append(" and t.customer_id in (").append(customId).append(")");
				}
				// 拜访人
				if (StringUtils.isNotEmpty(visitMan)) {
					sql.append(" and (e.real_name like ").append(dbHelper.getString("%" + visitMan + "%"))
							.append(" or exists(select 1 from customer f ")
							.append(" where f.id = t.customer_id and p.customer_type = 1 and f.customer_name like ")
							.append(dbHelper.getString("%" + visitMan + "%")).append(")")
							.append(" or exists(select 1 from chain_customer g")
							.append(" where g.id = t.customer_id and p.customer_type = 2 and g.china_customer_name like ")
							.append(dbHelper.getString("%" + visitMan + "%")).append("))");
				}
				sql.append(" ORDER BY T.sign_in_time ASC");
				visitsesList = visitsFactory.getObjectsForString(sql.toString(), employee);
				for (Visits visit : visitsesList) {
					Date signInTime = visit.get("sign_in_time");
					Date signOutTime = visit.get("sign_out_time");
					// 存储对象
					JSONObject object = new JSONObject();
					Store customer = null;
					// 获取到拜访计划
					VisitPlan plan = visitPlanFactory.getObject("id", visit.get("plan_id"));
					// 获取到门店类型
					Integer costomType = plan.get("customer_type");
					if (1 == costomType) {
						customer = customerFactory.getObject("id", visit.get("customer_id"));
						// 客户名
						object.put("coustom", customer == null ? "" : customer.get("customer_name"));
						// 客户类型名称
						object.put("costomTypeName", "门店客户");
					} else if (2 == costomType) {
						customer = chainCustomerFactory.getObject("id", visit.get("customer_id"));
						object.put("coustom", customer == null ? "" : customer.get("china_customer_name"));
						// 客户类型名称
						object.put("costomTypeName", "连锁客户");
					}
					// 客户类型
					object.put("costomType", costomType);
					object.put("id", visit.get("id"));
					object.put("custom_id", customer == null ? "" : customer.get("id"));
					object.put("address", customer == null ? "" : customer.get("address"));
					object.put("sign_in_time", DateUtil.formatDate(signInTime, "yyyy-MM-dd hh:mm:ss"));
					object.put("sign_out_time", DateUtil.formatDate(signOutTime, "yyyy-MM-dd hh:mm:ss"));
					if (signInTime != null && signOutTime != null) {
						object.put("stayTime", (signOutTime.getTime() - signInTime.getTime()) / 1000 / 60);
					}
					object.put("flag", visit.get("flag"));
					object.put("mark_type", "正常");
					// 拜访人
					object.put("visitor",
							EmployeeFactory.getInstance().getObject("id", visit.get("visits_employee_id")).get("real_name"));
					dataArry.add(object);
				}

				sql.delete(0, sql.length());
				// 如果单选商业客户
				if (StringUtils.isNotBlank(chain_customId) && StringUtils.isBlank(customId)) {
					sql.append(" left join customer c on c.id = t.custom_id ");
					sql.append(" left join chain_customer ch on ch.id = c.chain_customer_id ");
				}
				if (StringUtils.isNotBlank(customId)) {
					sql.append(" left join customer c on c.id = t.custom_id ");
				}
				sql.append(" where t.flag = 1 and t.mark_type is not null ");
				// 拜访人
				if (StringUtils.isNotBlank(visitId)) {
					String str2 = visitId.substring(visitId.length() - 1);
					if (str2.equals(",")) {
						visitId = visitId.substring(0, visitId.length() - 1);
					}
					sql.append(" and t.employee_id in (").append(visitId).append(")");
				}

				if (StringUtils.isNotBlank(customId)) {
					sql.append(" and t.custom_id in (").append(customId).append(")");
				}

				// 只选了商业客户（显示商业客户以及之下的门店客户）
				if (StringUtils.isNotBlank(chain_customId) && StringUtils.isBlank(customId)) {
					sql.append(" and (t.custom_id in (").append(chain_customId).append(")").append(" or c.chain_customer_id in (")
							.append(chain_customId).append("))");
				}

				List<VisitPlan> visitPlanList = VisitPlanFactory.getInstance().getObjectsForString(sql.toString(), employee);
				for (VisitPlan plan : visitPlanList) {
					Store customer = null;
					JSONObject object = new JSONObject();
					// 获取到门店类型
					Integer costomType = plan.get("customer_type");
					if (1 == costomType) {
						customer = customerFactory.getObject("id", plan.get("custom_id"));
						// 客户名
						object.put("coustom", customer == null ? "" : customer.get("customer_name"));
						// 客户类型名称
						object.put("costomTypeName", "门店客户");
					} else if (2 == costomType) {
						customer = chainCustomerFactory.getObject("id", plan.get("custom_id"));
						object.put("coustom", customer == null ? "" : customer.get("china_customer_name"));
						// 客户类型名称
						object.put("costomTypeName", "连锁客户");
					}
					// 客户类型
					object.put("costomType", costomType);
					object.put("id", plan.get("id"));
					object.put("custom_id", customer == null ? "" : customer.get("id"));
					object.put("address", customer == null ? "" : customer.get("address"));
					object.put("sign_in_time", "");
					object.put("sign_out_time", "");
					object.put("mark_type", plan.get("mark_type") == null ? "正常" : plan.get("mark_type"));
					object.put("flag", plan.get("flag"));
					// 拜访人
					object.put("visitor",
							EmployeeFactory.getInstance().getObject("id", plan.get("employee_id")).get("real_name"));
					dataArry.add(object);
				}

				List<JSONObject> list = PageUtil.getPageList(pageNumber, pageSize, dataArry);
				success.put("list", list);
				success.put("count", dataArry == null ? 0 : dataArry.size());
			} catch (Exception e) {
				log.error("根据门店查询统计发生异常:{}！", e);
				writer.print(ErrorCode.GET_LIST_INFO_ERROR);
				return;
			}
			;
		} else if ("product".equals(selectType)) {
			// DBHelper dbHelper2 = DBHelperFactory.getSecondDBHelper("2");
			List<JSONObject> subList = new ArrayList<>();
			StringBuilder goodsIds = new StringBuilder();
			UserLookOverPermission userLookOverPermission = employee.getUserLookOverPermission();
			boolean ifag = true;
			if (userLookOverPermission != null) {
				Set<Integer> set = userLookOverPermission.get("goods");
				if (set == null) {
					ifag = false;
				} else if (set.size() > 0) {
					for (Integer integer : set) {
						goodsIds.append(integer).append(",");
					}
				}
			} else {
				ifag = false;
			}

			if (goodsIds.length() > 0) {
				goodsIds.delete(goodsIds.length() - 1, goodsIds.length());
			}

			// 根据产品ID查询平均盘点明细
			sql.append(
					" select t.goods_id,sum(t.display_surface)display_surface_count,sum(t.display_number)display_number_count,round(avg(cast(t.display_number AS FLOAT)), 2)  AS display_number,round(avg(cast(t.display_surface AS FLOAT)), 2) AS display_surface,");
			sql.append(
					" convert(float,round(avg(t.tag_price),2)) as tag_price,avg(t.shop_point)as shop_point,avg(t.sail_total)as sail_total ");
			sql.append(
					" from customer_visits_detail t inner join customer_visits v on v.id=t.visits_id where v.flag = 1 and convert(char(7) ,sign_in_time , 120)= '"
							+ planMonth + "' ");
			if (StringUtils.isNotEmpty(goodId)) {
				sql.append(" and t.goods_id=" + goodId);
			}

			if (ifag) {
				sql.append(" and t.goods_id in(").append(goodsIds.toString()).append(")");
			}
			sql.append(" group BY t.goods_id ");

			try {
				rs = dbHelper.select(sql.toString());
				while (rs.next()) {
					JSONObject object = new JSONObject();
					Supplier supplier = null;
					Goods good = goodsFactory.getObject("id", rs.getString("goods_id"));
					if (null != good) {
						supplier = supplierFactory.getObject("id", good.get("supplier_id"));
					}
					// 供应商名
					object.put("supplier", supplier == null ? "" : supplier.get("supplier_name"));
					object.put("goods_id", rs.getString("goods_id"));
					object.put("goods_name", good == null ? "" : good.get("goods_name"));
					// 规格
					object.put("specification", good == null ? "" : good.get("specification"));
					object.put("display_surface", convert(rs.getDouble("display_surface")));
					object.put("display_surface_count", rs.getString("display_surface_count"));
					object.put("display_number", ObjectUtil.convert(rs.getDouble("display_number")));
					object.put("display_number_count", rs.getString("display_number_count"));
					object.put("weighted_price", ObjectUtil.convert(rs.getDouble("tag_price")));
					object.put("shop_point", rs.getString("shop_point"));
					object.put("sail_total", rs.getString("sail_total"));
					dataArry.add(object);
				}

				sql.delete(0, sql.length());
				sql.append("select count(distinct customer_id) as count_shop_point,goods_id ")
						.append(" from customer_visits_detail a ").append(" left join customer_visits b ")
						.append(" on a.visits_id = b.id ").append(" left join customer c").append(" on b.customer_id = c.id ")
						.append(" where convert(char(7) ,b.sign_in_time , 120)= ").append(dbHelper.getString(planMonth));
				if (ifag) {
					sql.append(" and goods_id in(").append(goodsIds.toString()).append(")");
				}
				sql.append(" group BY goods_id ");
				rs2 = dbHelper.select(sql.toString());

				String goods_id_rs = "";
				String goods_id_json = "";
				Integer count_shop_point = 0;
				while (rs2.next()) {
					goods_id_rs = rs2.getString("goods_id");
					for (JSONObject object : dataArry) {
						goods_id_json = object.getString("goods_id");
						if (StringUtils.equals(goods_id_rs, goods_id_json)) {
							count_shop_point = rs2.getInt("count_shop_point");
							object.put("shop_point", count_shop_point);
						}
					}
				}

				// 分页
				subList = PageUtil.getPageList(pageNumber, pageSize, dataArry);
			} catch (SQLException e) {
				log.error("根据产品查询统计发生异常：{}！", e);
				writer.print(ErrorCode.GET_LIST_INFO_ERROR);
				return;
			} finally {
				dbHelper.close(rs);
				dbHelper.close(rs2);
			}
			success.put("list", subList);
			success.put("count", dataArry.size());
		}
		log.trace("查询统计列表信息结束...");
		writer.print(success);
	}

	/***
	 * 四舍五入保留一位小数
	 * 
	 * @param value
	 * @return
	 */
	private static double convert(double value) {
		DecimalFormat df = new DecimalFormat("#.#");
		double result = Double.valueOf(df.format(value));
		return result;
	}

	/**
	 * 根据拜访记录查询商业客户拜访备注
	 */
	protected void loadChainStock() {
		log.trace("根据拜访记录查询商业拜访信息初始...");
		// 拜访记录Id
		Integer visitId;
		try {
			visitId = dataJson.getInteger("visits_id");
		} catch (Exception e) {
			log.error("获取查询拜访数据异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == visitId) {
			log.trace("获取拜访记录Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		Visits visit = visitsFactory.getObject("id", visitId);
		if (null == visit) {
			log.trace("拜访记录数据不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		// 获得门店名称
		ChainCustomer customer = chainCustomerFactory.getObject("id", visit.get("customer_id"));
		RemarkDetail detail = remarkDetailFactory.getObject("visits_id", visitId);
		if (null == detail) {
			log.trace("此次拜访未做备注！");
			SuccessJSON success = new SuccessJSON();
			log.trace("根据拜访记录查询商业拜访信息结束...");
			writer.print(success);
			return;
		}
		JSONObject object = new JSONObject();
		object.put("id", detail.get("id"));
		object.put("customer", customer == null ? "" : customer.get("china_customer_name"));
		object.put("visits_id", visitId);
		object.put("remark", detail.get("remark"));
		SuccessJSON success = new SuccessJSON();
		success.put("info", object);
		log.trace("根据拜访记录查询商业拜访信息初始...");
		writer.print(success);
	}

	/***
	 * 根据拜访记录查询盘点明细列表
	 */
	protected void queryStockList() {
		log.trace("根据拜访记录查询盘点明细列表初始...");
		// 拜访记录Id
		Integer visitId;
		String goods_id;
		try {
			visitId = dataJson.getInteger("visits_id");
			goods_id = dataJson.getString("goods_id");
		} catch (Exception e) {
			log.error("获取查询盘点列表数据异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == visitId) {
			log.trace("获取拜访记录Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		pageSize = Integer
				.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
		pageNumber = Integer
				.parseInt(StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));

		Visits visit = visitsFactory.getObject("id", visitId);
		if (null == visit) {
			log.trace("拜访记录不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		// 获得门店名称
		Customer customer = customerFactory.getObject("id", visit.get("customer_id"));
		List<VisitDetail> detailList;
		JSONArray dataArr = new JSONArray();
		StringBuilder sql = new StringBuilder();
		sql.append(" where visits_id =" + visitId);

		StringBuilder goodsIds = new StringBuilder();
		UserLookOverPermission userLookOverPermission = employee.getUserLookOverPermission();
		boolean ifag = true;
		if (userLookOverPermission != null) {
			Set<Integer> set = userLookOverPermission.get("goods");
			if (set == null) {
				ifag = false;
			} else if (set.size() > 0) {
				for (Integer integer : set) {
					goodsIds.append(integer).append(",");
				}
			}
		} else {
			ifag = false;
		}

		if (goodsIds.length() > 0) {
			goodsIds.delete(goodsIds.length() - 1, goodsIds.length());
		}

		if (StringUtils.isNotBlank(goods_id)) {
			String str2 = goods_id.substring(goods_id.length() - 1);
			if (str2.equals(",")) {
				goods_id = goods_id.substring(0, goods_id.length() - 1);
			}
			sql.append(" and goods_id in ").append("(").append(goods_id.toString()).append(")");
		} else if (ifag) {
			sql.append(" and goods_id in ").append("(").append(goodsIds.toString()).append(")");
		}

		try {
			detailList = visitDetailFactory.getObjectsForString(sql.toString(), null);
			if (null != detailList && detailList.size() > 0) {
				List<VisitDetail> subList = PageUtil.getPageList(pageNumber, pageSize, detailList);
				for (VisitDetail detail : subList) {
					JSONObject object = getInfo(detail);
					if (null != object) {
						dataArr.add(object);
					}
				}
			}
			SuccessJSON success = new SuccessJSON();
			success.put("list", dataArr);
			success.put("customName", customer.get("customer_name"));
			success.put("count", detailList == null ? 0 : detailList.size());
			log.trace("根据拜访记录查询盘点明细列表结束...");
			writer.print(success);
		} catch (Exception e) {
			log.trace("根据拜访记录查询盘点明细列表发生异常：{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	/***
	 * 根据拜访记录查询盘点明细列表
	 */
	protected void loadStockInfo() {
		log.trace("根据产品Id获取产品明细详情初始...");
		// 拜访记录Id
		Integer visitId;
		// 产品Id
		Integer goodId;
		try {
			visitId = dataJson.getInteger("visits_id");
			goodId = dataJson.getInteger("goods_id");
		} catch (Exception e) {
			log.error("获取查询盘点列表数据异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == visitId || null == goodId) {
			log.trace("获取拜访记录Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		Visits visit = visitsFactory.getObject("id", visitId);
		if (null == visit) {
			log.trace("拜访记录不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		// 获得门店名称
		Customer customer = customerFactory.getObject("id", visit.get("customer_id"));
		List<VisitDetail> detailList = null;
		StringBuilder sql = new StringBuilder();
		sql.append(" where visits_id =" + visitId);
		sql.append(" and goods_id =" + goodId);
		try {
			detailList = visitDetailFactory.getObjectsForString(sql.toString(), null);
			if (null == detailList || detailList.size() < 1) {
				log.trace("获取盘点产品明细失败！");
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}
			VisitDetail detail = detailList.get(0);
			JSONObject object = getInfo(detail);
			SuccessJSON success = new SuccessJSON();
			success.put("info", object);
			success.put("customName", customer.get("customer_name"));
			log.trace("根据产品Id获取产品明细详情结束...");
			writer.print(success);
		} catch (Exception e) {
			log.trace("根据产品Id获取产品明细详情发生异常：{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	/***
	 * 根据拜访记录查询盘点明细列表
	 */
	private JSONObject getInfo(VisitDetail detail) {
		if (null == detail) {
			return null;
		}
		JSONObject object = new JSONObject();
		Goods goods = goodsFactory.getObject("id", detail.get("goods_id"));
		Supplier supplier = null;
		if (goods != null) {
			supplier = supplierFactory.getObject("id", goods.get("supplier_id"));
		}
		// 产品名
		object.put("goods_id", detail.get("goods_id"));
		// 产品名
		object.put("visits_id", detail.get("visits_id"));
		// 产品名
		object.put("goodName", goods == null ? "" : goods.get("goods_name"));
		// 规格
		object.put("specification", goods == null ? "" : goods.get("specification"));
		// 供应商
		object.put("supplierName", supplier == null ? "" : supplier.get("supplier_name"));
		// 来源
		object.put("purchaseSource", detail.get("purchase_source"));
		// 标签价
		object.put("tagPrice", detail.get("tag_price"));
		// 进货数
		object.put("batchNumber", detail.get("batch_number"));
		// 批号
		object.put("purchaseNumber", detail.get("purchase_number"));
		// 陈列面
		object.put("displaySurface", detail.get("display_surface"));
		// 陈列数
		object.put("displayNumber", detail.get("display_number"));
		// 加权价
		object.put("weightedPrice", detail.get("weighted_price"));
		// 库存
		object.put("realStock", detail.get("real_stock"));
		// 盘点图片
		object.put("image_urls", detail.get("image_urls"));
		return object;
	}

	@Override
	protected void add() {
	}

	@Override
	protected void fileUpload(HttpServletRequest request, HttpServletResponse response) {
		try {
			log.trace("开始导出列表数据...");
			// 查询类型（store:门店，product:产品)
			String selectType = dataJson.getString("selectType");
			if (StringUtils.isBlank(selectType)) {
				writer.println(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}

			List<Map<String, Object>> dataMap = null;
			switch (selectType) {
			case "store":
				dataMap = fileExportStore();
				break;
			case "product":
				dataMap = fileExportProduct();
				break;
			case "productDetail":
				dataMap = fileExportProductDetail();
				break;
			default:
				writer.println(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}

			if (dataMap == null) {
				return;
			} else if (dataMap.size() > 0) {
				exportListData(dataMap);
				log.trace("导出列表数据结束...");
			} else {
				log.trace("暂无数据！");
				writer.print(new SuccessJSON("msg", "暂无数据！"));
			}

		} catch (Exception e) {
			log.error("异常", e);
			writer.print(ErrorCode.EXPORT_FILE_FAIL);
			return;
		}
	}

	/***
	 * 导出门店拜访统计
	 * 
	 * @return
	 */
	private List<Map<String, Object>> fileExportStore() {
			// 根据门店统计（按时间段）
			String timeStart;
			String timeEnd;
			Integer employeeType = employee.get("employee_type");
			List<Map<String, Object>> dataMap = new ArrayList<Map<String, Object>>();
			try {
				timeStart = dataJson.getString("timeStart");
				timeEnd = dataJson.getString("timeEnd");
			} catch (Exception e) {
				log.error("获取查询拜访统计信息异常:{}！", e);
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
				return null;
			}
			// 判断是何种用户
			if (null == employeeType) {
				log.trace("获取当前用户类型失败！");
				writer.print(ErrorCode.GET_USER_TYPE_FAIL);
				return null;
			}
			
			StringBuilder sql = new StringBuilder();
			// 根据店铺
			try {
				sql.append(" WHERE (t.flag = 1 or t.flag = 2) ");
				// 计划开始时间
				if (StringUtils.isBlank(timeStart) || StringUtils.isBlank(timeEnd)) {
					writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
					return null;
				}else{
					sql.append(" and t.sign_in_time between ").append(dbHelper.getString(timeStart))
					.append(" and ").append(dbHelper.getString(timeEnd));
				}
			
				sql.append(" ORDER BY T.sign_in_time ASC");
				List<Visits> visitsesList = visitsFactory.getObjectsForString(sql.toString(), employee);
				for (Visits visit : visitsesList) {
					Date signInTime = visit.get("sign_in_time");
					Date signOutTime = visit.get("sign_out_time");
					// 存储对象
					Map<String,Object> object = new LinkedHashMap<>();
					Store customer = null;
					// 获取到拜访计划
					VisitPlan plan = visitPlanFactory.getObject("id", visit.get("plan_id"));
					// 获取到门店类型
					Integer costomType = plan.get("customer_type");
					object.put("编号", visit.get("id"));
					if (1 == costomType) {
						customer = customerFactory.getObject("id", visit.get("customer_id"));
						// 客户名
						object.put("门店名称", customer == null ? "" : customer.get("customer_name"));
						// 客户类型名称
						object.put("门店类型", "门店客户");
					} else if (2 == costomType) {
						customer = chainCustomerFactory.getObject("id", visit.get("customer_id"));
						object.put("门店名称", customer == null ? "" : customer.get("china_customer_name"));
						// 客户类型名称
						object.put("门店类型", "连锁客户");
					}
					
					if(customer == null){
						object.put("地址","");
					}else{
						object.put("地址", customer.get("address") == null ? "" : customer.get("address"));
					}
					object.put("签到时间", DateUtil.formatDate(signInTime, "yyyy-MM-dd hh:mm:ss"));
					object.put("签出时间", DateUtil.formatDate(signOutTime, "yyyy-MM-dd hh:mm:ss"));
					if (signInTime != null && signOutTime != null) {
						object.put("逗留时间", (signOutTime.getTime() - signInTime.getTime()) / 1000 / 60);
					}else{
						object.put("逗留时间", "");
					}
					object.put("状态", (Integer)visit.get("flag")==1?"正常":"");
					object.put("标记类型", "正常");
					// 拜访人
					object.put("拜访人",
							EmployeeFactory.getInstance().getObject("id", visit.get("visits_employee_id")).get("real_name"));
					dataMap.add(object);
				}

				sql.delete(0, sql.length());
				sql.append(" where t.flag = 1 and t.mark_type is not null ");
				sql.append(" and t.plan_in_time between ").append(dbHelper.getString(timeStart))
				.append(" and ").append(dbHelper.getString(timeEnd));
				List<VisitPlan> visitPlanList = VisitPlanFactory.getInstance().getObjectsForString(sql.toString(), employee);
				for (VisitPlan plan : visitPlanList) {
					Store customer = null;
					Map<String,Object> object = new LinkedHashMap<>();
					// 获取到门店类型
					Integer costomType = plan.get("customer_type");
					object.put("编号", plan.get("id"));
					if (1 == costomType) {
						customer = customerFactory.getObject("id", plan.get("custom_id"));
						// 客户名
						object.put("门店名称", customer == null ? "" : customer.get("customer_name"));
						// 客户类型名称
						object.put("门店类型", "门店客户");
					} else if (2 == costomType) {
						customer = chainCustomerFactory.getObject("id", plan.get("custom_id"));
						object.put("门店名称", customer == null ? "" : customer.get("china_customer_name"));
						// 客户类型名称
						object.put("门店类型", "连锁客户");
					}
					
					
					if(customer == null){
						object.put("地址","");
					}else{
						object.put("地址", customer.get("address") == null ? "" : customer.get("address"));
					}
					object.put("签到时间", "");
					object.put("签出时间", "");
					object.put("逗留时间", "");
					object.put("标记类型", plan.get("mark_type") == null ? "正常" : plan.get("mark_type"));
					object.put("状态", (Integer)plan.get("flag")==1?"正常":"");
					// 拜访人
					object.put("拜访人", EmployeeFactory.getInstance().getObject("id", plan.get("employee_id")).get("real_name"));
					dataMap.add(object);
				}

			} catch (Exception e) {
				log.error("发生异常:{}！", e);
				writer.print(ErrorCode.EXPORT_FILE_FAIL);
				return null;
			}
		return dataMap;
	}

	/***
	 * 导出产品拜访统计详情列表
	 * 
	 * @return
	 */
	private List<Map<String, Object>> fileExportProductDetail() {
		StringBuilder sql = new StringBuilder();
		List<Map<String, Object>> dataMap = new ArrayList<Map<String, Object>>();
		// 拜访记录Id
		Integer visitId;
		try {
			visitId = dataJson.getInteger("visits_id");
		} catch (Exception e) {
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return null;
		}
		if (null == visitId) {
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return null;
		}
		Visits visit = visitsFactory.getObject("id", visitId);
		if (null == visit) {
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return null;
		}

		sql.setLength(0);
		sql.append(" where visits_id =" + visitId);
		try {
			List<VisitDetail> detailList = visitDetailFactory.getObjectsForString(sql.toString(), null);
			for (VisitDetail detail : detailList) {
				Map<String, Object> map = new LinkedHashMap<String, Object>();
				Goods goods = goodsFactory.getObject("id", detail.get("goods_id"));
				Supplier supplier = null;
				if (goods != null) {
					supplier = supplierFactory.getObject("id", goods.get("supplier_id"));
				}
				// 产品ID
				map.put("产品ID", detail.get("goods_id"));
				// 产品名
				map.put("产品名", goods == null ? "" : goods.get("goods_name"));
				// 规格
				map.put("规格", goods == null ? "" : goods.get("specification"));
				// 供应商
				map.put("供应商", supplier == null ? "" : supplier.get("supplier_name"));
				// 来源
				map.put("来源", detail.get("purchase_source"));
				// 进货数
				map.put("进货数", detail.get("batch_number"));
				// 批号
				map.put("批号", detail.get("purchase_number"));
				// 陈列面
				map.put("陈列面", detail.get("display_surface"));
				// 陈列数
				map.put("陈列数", detail.get("display_number"));
				// 加权价
				map.put("加权价", detail.get("weighted_price"));
				// 库存
				map.put("库存", detail.get("real_stock"));
				dataMap.add(map);
			}
		} catch (Exception e) {
			writer.print(ErrorCode.EXPORT_FILE_FAIL);
			return null;
		}
		return dataMap;
	}

	/***
	 * 导出产品拜访统计列表
	 * 
	 * @return
	 */
	private List<Map<String, Object>> fileExportProduct() {
		StringBuilder sql = new StringBuilder();
		String planMonth = dataJson.getString("planMonth");
		List<Map<String, Object>> dataMap = new ArrayList<Map<String, Object>>();
		if (StringUtils.isBlank(planMonth)) {
			writer.println(ErrorCode.GET_FONT_END_INFO_ERROR);
			return null;
		}
		// 用户类型
		Integer employeeType = employee.get("employee_type");
		try {
			planMonth = dataJson.getString("planMonth");
		} catch (Exception e) {
			log.error("获取查询拜访统计信息异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return null;
		}
		// 判断是何种用户
		if (null == employeeType) {
			log.trace("获取当前用户类型失败！");
			writer.print(ErrorCode.GET_USER_TYPE_FAIL);
			return null;
		}
		// 判断当前用户是否代表
		boolean isType1 = employeeType == 1 ? true : false;

		// 如果月份没有传，默认当前月份
		if (StringUtils.isEmpty(planMonth)) {
			planMonth = DateUtil.getTime("yyyy-MM");
		}
		// 根据产品查询结果
		ResultSet rs = null;
		ResultSet rs2 = null;
		// 返回信息
		StringBuilder goodsIds = new StringBuilder();
		UserLookOverPermission userLookOverPermission = employee.getUserLookOverPermission();
		boolean ifag = true;
		if (userLookOverPermission != null) {
			Set<Integer> set = userLookOverPermission.get("goods");
			if (set == null) {
				ifag = false;
			} else if (set.size() > 0) {
				for (Integer integer : set) {
					goodsIds.append(integer).append(",");
				}
			}
		} else {
			ifag = false;
		}

		if (goodsIds.length() > 0) {
			goodsIds.delete(goodsIds.length() - 1, goodsIds.length());
		}

		// 根据产品ID查询平均盘点明细
		sql.append(" select c.*,a.goods_name,a.specification,b.supplier_name from (");
		sql.append(
				" select t.goods_id,sum(t.display_surface)display_surface_count,sum(t.display_number)display_number_count,round(avg(cast(t.display_number AS FLOAT)), 2)  AS display_number,round(avg(cast(t.display_surface AS FLOAT)), 2) AS display_surface,");
		sql.append(
				" convert(float,round(avg(t.tag_price),2)) as tag_price,avg(t.shop_point)as shop_point,avg(t.sail_total)as sail_total ");
		sql.append(
				" from customer_visits_detail t inner join customer_visits v on v.id=t.visits_id where v.flag = 1 and convert(char(7) ,sign_in_time , 120)= '"
						+ planMonth + "' ");

		if (ifag) {
			sql.append(" and t.goods_id in (").append(goodsIds.toString()).append(")");
		}

		if (isType1) {
			sql.append(" and exists(").append(" select 1 from  customer_visits a where a.id = t.visits_id ")
					.append(" and a.visits_employee_id = ").append(employee.getId()).append(")");
		}

		sql.append(" group BY t.goods_id ");
		sql.append(" ) c left join goods a on a.id = c.goods_id left join supplier b on a.supplier_id = b.id where 1 = 1 ");

		try {
			rs = dbHelper.select(sql.toString());
			while (rs.next()) {
				Map<String, Object> object = new LinkedHashMap<>();
				object.put("供应商", rs.getString("supplier_name"));
				object.put("产品ID", rs.getString("goods_id"));
				object.put("编号/产品/规格",
						rs.getString("goods_id") + "/" + rs.getString("goods_name") + "/" + rs.getString("specification"));
				object.put("平均陈列面", convert(rs.getDouble("display_surface")));
				object.put("总陈列面", rs.getString("display_surface_count"));
				object.put("平均陈列数", ObjectUtil.convert(rs.getDouble("display_number")));
				object.put("总陈列数", rs.getString("display_number_count"));
				object.put("平均加权价", ObjectUtil.convert(rs.getDouble("tag_price")));
				object.put("铺点数", rs.getString("shop_point")==null?"":rs.getString("shop_point"));
				object.put("销售总额", rs.getString("sail_total")==null?"":rs.getString("sail_total"));
				dataMap.add(object);
			}

			sql.delete(0, sql.length());
			sql.append("select count(distinct customer_id) as count_shop_point,goods_id ")
					.append(" from customer_visits_detail a ").append(" left join customer_visits b ")
					.append(" on a.visits_id = b.id ").append(" left join customer c").append(" on b.customer_id = c.id ")
					.append(" where convert(char(7) ,b.sign_in_time , 120)= ").append(dbHelper.getString(planMonth));
			if (ifag) {
				sql.append(" and goods_id in(").append(goodsIds.toString()).append(")");
			}

			if (isType1) {
				sql.append(" and b.visits_employee_id = ").append(employee.getId());
			}

			sql.append(" group BY goods_id ");
			rs2 = dbHelper.select(sql.toString());

			String goods_id_rs = "";
			String goods_id_json = "";
			Integer count_shop_point = 0;
			while (rs2.next()) {
				goods_id_rs = rs2.getString("goods_id");
				for (Map<String, Object> object : dataMap) {
					goods_id_json = (String) object.get("产品ID");
					if (StringUtils.equals(goods_id_rs, goods_id_json)) {
						count_shop_point = rs2.getInt("count_shop_point");
						object.put("铺点数", count_shop_point);
					}
				}
			}

		} catch (SQLException e) {
			log.error("根据产品查询统计发生异常：{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
			return null;
		} finally {
			dbHelper.close(rs);
			dbHelper.close(rs2);
		}
		return dataMap;
	}

}
