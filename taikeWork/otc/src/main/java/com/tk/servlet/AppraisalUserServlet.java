package com.tk.servlet;

import java.util.ArrayList;
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

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.PageUtil;
import com.tk.object.AreaDivision;
import com.tk.object.AreaDivisionFactory;
import com.tk.object.ChainCustomer;
import com.tk.object.ChainCustomerFactory;
import com.tk.object.Customer;
import com.tk.object.CustomerFactory;
import com.tk.object.Document;
import com.tk.object.DocumentFactory;
import com.tk.object.Employee;
import com.tk.object.EmployeeFactory;
import com.tk.object.Goods;
import com.tk.object.GoodsFactory;
import com.tk.object.RoleGroup;
import com.tk.object.RoleGroupFactory;
import com.tk.object.KPI.KPIScoreRecord;
import com.tk.object.KPI.KPIScoreRecordFactory;
import com.tk.object.KPI.kPIEducateScore;
import com.tk.object.KPI.kPIEducateScoreFactory;
import com.tk.object.KPI.KPIGoodCumsotrScore;
import com.tk.object.KPI.KPIGoodCumsotrScoreFactory;
import com.tk.object.KPI.kPIGoodsSaleScore;
import com.tk.object.KPI.kPIGoodsSaleScoreFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

/**
 * 用户考核管理servlet
 * <p>
 *
 * @author huzh
 */
@WebServlet("/appraisalUser.do")
public class AppraisalUserServlet extends BaseServlet {
	private static Logger log = LogManager.getLogger(AppraisalUserServlet.class.getName());
	// 获取到考核记录工厂类
	private static KPIScoreRecordFactory kpiScoreRecordFactory = KPIScoreRecordFactory.getInstance();
	// 获取到员工工厂类
	private static EmployeeFactory employeeFactory = EmployeeFactory.getInstance();
	// 获取到地区工厂类
	private static AreaDivisionFactory areaDivisionFactory = AreaDivisionFactory.getInstance();
	// 获取到角色工厂类
	private static RoleGroupFactory roleGroupFactory = RoleGroupFactory.getInstance();
	// 获得查询工厂类
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();

	private Integer pageSize;
	private Integer pageNumber;

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.query, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.fileExport, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.educateKPIScoreDetail, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.goodsSaleScoreDetail, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.customerSaleScoreDetail, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.exportKPIScoreDetail, PermissionEnum.NOT_USE_PERMISSION);
	}

	@Override
	protected boolean handleChilder() {
		switch (controlType) {
		case educateKPIScoreDetail:
			educateKPIScoreDetail();// 教育考核详情
			return true;
		case goodsSaleScoreDetail:
			goodsSaleScoreDetail();// 销量考核详情
			return true;
		case customerSaleScoreDetail:
			customerSaleScoreDetail();// 维护考核详情
			return true;
		case exportKPIScoreDetail:
			exportKPIScoreDetail();// 导出考核详情
			return true;
		default:
			return false;
		}
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

	/****
	 * 导出Excel文件
	 *
	 * @param list
	 */
	private void exportFile(List<Map<String, Object>> list) {
		if (list.size() > 0) {
			exportListData(list);
			log.trace("导出列表数据结束...");
		} else {
			log.trace("暂无数据！");
			writer.print(new SuccessJSON("msg", "暂无数据！"));
		}
	}

	/****
	 * 导出教育考核详情
	 * 
	 * @return
	 * @throws Exception
	 */
	private List<Map<String, Object>> exportEducateKPIScoreDetail(Integer year, Integer month, Integer employee_id)
			throws Exception {
		List<Map<String, Object>> dataList = new ArrayList<>();
		try {
			StringBuilder sql = new StringBuilder();
			sql.append(" where t.year = ").append(year).append(" and t.month = ").append(month)
					.append(" and t.employee_id = ").append(employee_id);
			List<kPIEducateScore> list = kPIEducateScoreFactory.getInstance().getObjectsForString(sql.toString(), employee);
			for (kPIEducateScore educateScore : list) {
				Map<String, Object> map = new HashMap<>();
				Integer document_id = (Integer)educateScore.get("document_id");
				if(document_id!=null){
					Document document = DocumentFactory.getInstance().getObject("id", document_id);
					if (document!=null) {
						map.put("资料名称", document.get("document_name"));//资料名称
					}
				}
				// 要求播放次数
				map.put("要求比值",
						educateScore.get("require_play_number") == null ? "" : educateScore.get("require_play_number"));// 要求比值
				// 实际播放次数
				map.put("实际播放次数", educateScore.get("play_number") == null ? "" : educateScore.get("play_number"));
				// 要求比值
				map.put("要求比值", educateScore.get("require_ratio") == null ? "" : educateScore.get("play_number"));
				// 实际比值
				map.put("实际比值", educateScore.get("actual_ratio") == null ? "" : educateScore.get("actual_ratio"));
				dataList.add(map);
			}

			log.trace("查询教育考核详情结束");
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
		return dataList;
	}

	/****
	 * 导出销量考核详情
	 * 
	 * @return
	 * @throws Exception
	 */
	private List<Map<String, Object>> exportGoodsSaleScoreDetail(Integer year, Integer month, Integer employee_id)
			throws Exception {
		List<Map<String, Object>> dataList = new ArrayList<>();
		try {
			StringBuilder sql = new StringBuilder();
			sql.append(" where t.year = ").append(year).append(" and t.month = ").append(month)
					.append(" and t.employee_id = ").append(employee_id);
			List<kPIGoodsSaleScore> list = kPIGoodsSaleScoreFactory.getInstance().getObjectsForString(sql.toString(),
					employee);
			for (kPIGoodsSaleScore goodsSaleScore : list) {
				Map<String, Object> map = new HashMap<>();
				Integer goods_id = (Integer) goodsSaleScore.get("goods_id");
				map.put("产品ID", goods_id);// 产品ID
				if (goods_id != null) {
					Goods goods = GoodsFactory.getInstance().getObject("id", goods_id);
					if (goods != null) {
						map.put("产品名称", goods.get("goods_name"));// 产品名称
						map.put("产品规格", goods.get("specification"));// 产品规格
					}
				}

				Integer customer_id = (Integer) goodsSaleScore.get("customer_id");
				if (customer_id != null) {
					ChainCustomer customer = ChainCustomerFactory.getInstance().getObject("id", customer_id);
					if (customer != null) {
						map.put("客户名称", customer.get("china_customer_name"));// 客户名称
					}
				}

				map.put("要求销售额",
						goodsSaleScore.get("require_money") == null ? "" : goodsSaleScore.get("require_money"));// 要求销售额
				map.put("实际销售额", goodsSaleScore.get("money") == null ? "" : goodsSaleScore.get("money"));// 实际销售额
				map.put("销售额要求比值",
						goodsSaleScore.get("money_require_ratio") == null ? "" : goodsSaleScore.get("money_require_ratio"));// 销售额要求比值
				map.put("销售额实际比值",
						goodsSaleScore.get("money_actual_ratio") == null ? "" : goodsSaleScore.get("money_actual_ratio"));// 销售额实际比值
				map.put("要求铺点数", goodsSaleScore.get("require_build_sell_count") == null ? ""
						: goodsSaleScore.get("require_build_sell_count"));// 要求铺点数
				map.put("实际铺点数",
						goodsSaleScore.get("build_sell_count") == null ? "" : goodsSaleScore.get("build_sell_count"));// 实际铺点数
				map.put("铺点数要求比值", goodsSaleScore.get("build_sell_count_require_ratio") == null ? ""
						: goodsSaleScore.get("build_sell_count_require_ratio"));// 铺点数要求比值
				map.put("铺点数实际比值", goodsSaleScore.get("build_sell_count_actual_ratio") == null ? ""
						: goodsSaleScore.get("build_sell_count_actual_ratio"));// 铺点数实际比值
				dataList.add(map);
			}

			log.trace("查询销量考核详情结束");
		} catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
		} catch (NumberFormatException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
		} catch (Exception e) {
			log.error("其他异常！", e);
		}
		return dataList;
	}

	/****
	 * 导出维护考核详情
	 * 
	 * @return
	 * @throws Exception
	 */
	private List<Map<String, Object>> exportCustomerSaleScoreDetail(Integer year, Integer month, Integer employee_id)
			throws Exception {
		List<Map<String, Object>> dataList = new ArrayList<>();
		try {
			StringBuilder sql = new StringBuilder();
			sql.append(" where t.year = ").append(year).append(" and t.month = ").append(month)
					.append(" and t.employee_id = ").append(employee_id);
			List<KPIGoodCumsotrScore> list = KPIGoodCumsotrScoreFactory.getInstance().getObjectsForString(sql.toString(),
					employee);
			for (KPIGoodCumsotrScore goodCumsotrScore : list) {
				JSONObject map = new JSONObject();
				Integer goods_id = (Integer) goodCumsotrScore.get("goods_id");
				map.put("产品ID", goods_id);// 产品ID
				if (goods_id != null) {
					Goods goods = GoodsFactory.getInstance().getObject("id", goods_id);
					if (goods != null) {
						map.put("产品名称", goods.get("goods_name"));// 产品名称
						map.put("产品规格", goods.get("specification"));// 产品规格
					}
				}

				Integer customer_id = (Integer) goodCumsotrScore.get("customer_id");
				if (customer_id != null) {
					Customer customer = CustomerFactory.getInstance().getObject("id", customer_id);
					if (customer != null) {
						map.put("门店名称", customer.get("customer_name"));// 门店名称
					}
				}

				map.put("要求陈列数", goodCumsotrScore.get("require_display_number") == null ? ""
						: goodCumsotrScore.get("require_display_number"));// 要求陈列数
				map.put("实际陈列数",
						goodCumsotrScore.get("display_number") == null ? "" : goodCumsotrScore.get("display_number"));// 实际陈列数
				map.put("要求陈列面", goodCumsotrScore.get("require_display_surface") == null ? ""
						: goodCumsotrScore.get("require_display_surface"));// 要求陈列面
				map.put("实际陈列面",
						goodCumsotrScore.get("display_surface") == null ? "" : goodCumsotrScore.get("display_surface"));// 实际陈列面
				map.put("要求平均加权价", goodCumsotrScore.get("require_weighted_price") == null ? ""
						: goodCumsotrScore.get("require_weighted_price"));// 要求平均加权价
				map.put(" 实际平均加权价",
						goodCumsotrScore.get("weighted_price") == null ? "" : goodCumsotrScore.get("weighted_price"));// 实际平均加权价
				map.put("陈列面要求比值", goodCumsotrScore.get("display_surface_require_ratio") == null ? ""
						: goodCumsotrScore.get("display_surface_require_ratio"));// 陈列面要求比值
				map.put("陈列面实际比值",
						goodCumsotrScore.get("display_surface_ratio") == null ? "" : goodCumsotrScore.get("display_surface_ratio"));// 陈列面实际比值
				map.put("陈列数要求比值", goodCumsotrScore.get("display_number_require_ratio") == null ? ""
						: goodCumsotrScore.get("display_number_require_ratio"));// 陈列数要求比值
				map.put("陈列数实际比值",
						goodCumsotrScore.get("display_number_ratio") == null ? "" : goodCumsotrScore.get("display_number_ratio"));// 陈列数实际比值
				map.put("平均加权价要求比值", goodCumsotrScore.get("weighted_price_require_ratio") == null ? ""
						: goodCumsotrScore.get("weighted_price_require_ratio"));// 平均加权价要求比值
				map.put("平均加权价实际比值",
						goodCumsotrScore.get("weighted_price_ratio") == null ? "" : goodCumsotrScore.get(""));// 平均加权价实际比值
				dataList.add(map);
			}
			log.trace("查询销量考核详情结束");
		} catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
		} catch (NumberFormatException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
		} catch (Exception e) {
			log.error("其他异常！", e);
		}
		return dataList;
	}

	private void exportKPIScoreDetail() {
		try {
			// 导出类型
			String exportType = dataJson.getString("exportType").toString();
			Integer employee_id = Integer.valueOf(dataJson.get("employee_id").toString());
			// 获得年月
			String time = dataJson.getString("time");
			if (StringUtils.isBlank(time) || StringUtils.isBlank(exportType)) {
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}

			Integer year;
			Integer month;
			try {
				String[] times = time.split("-");
				year = Integer.parseInt(times[0]);
				month = Integer.parseInt(times[1]);
			} catch (Exception e) {
				log.error("查询时间格式有误！", e);
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}
			List<Map<String, Object>> list = new ArrayList<>();
			if ("educateKPIScoreDetail".equals(exportType)) {// 教育考核详情
				list = exportEducateKPIScoreDetail(year, month, employee_id);
			} else if ("goodsSaleScoreDetail".equals(exportType)) {// 销量考核详情
				list = exportGoodsSaleScoreDetail(year, month, employee_id);
			} else if ("customerSaleScoreDetail".equals(exportType)) {// 维护考核详情
				list = exportCustomerSaleScoreDetail(year, month, employee_id);
			} else {
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}

			// 导出Excel文件
			exportFile(list);
		} catch (NullPointerException e) {
			log.error("参数异常！", e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		} catch (Exception e) {
			log.error("导出异常！", e);
			writer.print(ErrorCode.EXPORT_FILE_FAIL);
		}
	}

	/**
	 * 获得所有员工的考核记录
	 */
	@Override
	protected void query() {
		log.trace("获取员工考核记录列表初始...");
		// 获得年月
		String time;
		String employeeName;
		String employeeId;
		try {
			time = dataJson.getString("time");
			employeeName = dataJson.getString("name");
			employeeId = dataJson.getString("employee_id");
		} catch (Exception e) {
			log.error("获取查询参数发生异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		pageSize = Integer
				.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
		pageNumber = Integer
				.parseInt(StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));
		if (StringUtils.isEmpty(time)) {
			log.trace("获取考核记录查询时间月份失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		Integer year;
		Integer month;
		try {
			String[] times = time.split("-");
			year = Integer.parseInt(times[0]);
			month = Integer.parseInt(times[1]);
		} catch (Exception e) {
			log.error("查询时间格式有误！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		// 查询考核记录
		StringBuilder sql = new StringBuilder();
		sql.append(" left join employee e on e.id = t.employee_id where e.flag =1 ");
		if (StringUtils.isNotEmpty(employeeName)) {
			sql.append(" and e.real_name like " + dbHelper.getString("%" + employeeName + "%"));
		}
		if (StringUtils.isNotBlank(employeeId)) {
			String str2 = employeeId.substring(employeeId.length() - 1);
			if (str2.equals(",")) {
				employeeId = employeeId.substring(0, employeeId.length() - 1);
			}
			sql.append("and employee_id in (").append(employeeId).append(")");
		}
		sql.append(" and t.year = " + year);
		sql.append(" and t.month = " + month);
		sql.append(" order by score desc ");
		List<KPIScoreRecord> list;
		JSONArray jsonArray = new JSONArray();
		try {
			list = kpiScoreRecordFactory.getObjectsForString(sql.toString(), employee);
			List<KPIScoreRecord> subList = PageUtil.getPageList(pageNumber, pageSize, list);
			for (KPIScoreRecord record : subList) {
				AreaDivision area = null;
				RoleGroup role = null;
				Employee user = employeeFactory.getObject("id", record.get("employee_id"));
				Integer areaId = user.get("area_id");
				Integer roleId = user.get("role_group_id");
				if (null != areaId) {
					area = areaDivisionFactory.getObject("id", areaId);
				}
				if (null != roleId) {
					role = roleGroupFactory.getObject("id", roleId);
				}
				JSONObject object = new JSONObject();
				object.put("employee_id", record.get("employee_id"));
				object.put("employeeName", user.get("real_name"));
				object.put("roleName", role == null ? "" : role.get("group_name"));
				object.put("areaName", area == null ? "" : area.get("area_name"));
				/*
				 * object.put("time", record.get("year")); object.put("month",
				 * record.get("month"));
				 */
				object.put("time", String.format("%d-%02d", record.get("year"), record.get("month")));
				object.put("score", record.get("score"));
				object.put("remark", record.get("remark"));
				jsonArray.add(object);
			}

			SuccessJSON success = new SuccessJSON();
			success.put("list", jsonArray);
			success.put("count", list == null ? 0 : list.size());
			log.trace("获取员工考核记录列表结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("获取员工考核记录列表发生异常！");
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	@Override
	protected void load() {

	}

	/***
	 * 教育考核详情
	 */
	private void educateKPIScoreDetail() {
		try {
			// 获得年月
			String time = dataJson.getString("time");
			log.trace("开始查询教育考核详情...");
			Integer employee_id = Integer.valueOf(dataJson.get("employee_id").toString());
			StringBuilder sql = new StringBuilder();
			pageSize = dataJson.getInteger("pageSize");
			pageNumber = dataJson.getInteger("pageNumber");
			Integer year;
			Integer month;
			try {
				String[] times = time.split("-");
				year = Integer.parseInt(times[0]);
				month = Integer.parseInt(times[1]);
			} catch (Exception e) {
				log.error("查询时间格式有误！", e);
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}

			sql.append(" where t.year = ").append(year).append(" and t.month = ").append(month)
					.append(" and t.employee_id = ").append(employee_id);
			List<kPIEducateScore> list = kPIEducateScoreFactory.getInstance().getObjectsForString(sql.toString(), employee);
			List<kPIEducateScore> subList = PageUtil.getPageList(pageNumber, pageSize, list);
			JSONArray jsonArray = new JSONArray();
			for (kPIEducateScore educateScore : subList) {
				JSONObject object = new JSONObject();
				Integer document_id = (Integer)educateScore.get("document_id");
				if(document_id!=null){
					Document document = DocumentFactory.getInstance().getObject("id", document_id);
					if (document!=null) {
						object.put("document_name", document.get("document_name"));//资料名称
					}
				}
				// 要求播放次数
				object.put("require_play_number",
						educateScore.get("require_play_number") == null ? "" : educateScore.get("require_play_number"));// 要求比值
				// 实际播放次数
				object.put("play_number", educateScore.get("play_number") == null ? "" : educateScore.get("play_number"));
				// 要求比值
				object.put("require_ratio", educateScore.get("require_ratio") == null ? "" : educateScore.get("play_number"));
				// 实际比值
				object.put("actual_ratio", educateScore.get("actual_ratio") == null ? "" : educateScore.get("actual_ratio"));
				jsonArray.add(object);
			}

			SuccessJSON success = new SuccessJSON();
			success.put("count", list.size());
			success.put("list", jsonArray);
			writer.print(success);
			log.trace("查询教育考核详情结束");
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

	/***
	 * 销量考核详情
	 */
	private void goodsSaleScoreDetail() {
		try {
			// 获得年月
			String time = dataJson.getString("time");
			log.trace("开始查询销量考核详情...");
			Integer employee_id = Integer.valueOf(dataJson.get("employee_id").toString());
			StringBuilder sql = new StringBuilder();
			pageSize = dataJson.getInteger("pageSize");
			pageNumber = dataJson.getInteger("pageNumber");
			Integer year;
			Integer month;
			try {
				String[] times = time.split("-");
				year = Integer.parseInt(times[0]);
				month = Integer.parseInt(times[1]);
			} catch (Exception e) {
				log.error("查询时间格式有误！", e);
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}

			sql.append(" where t.year = ").append(year).append(" and t.month = ").append(month)
					.append(" and t.employee_id = ").append(employee_id);
			List<kPIGoodsSaleScore> list = kPIGoodsSaleScoreFactory.getInstance().getObjectsForString(sql.toString(),
					employee);
			List<kPIGoodsSaleScore> subList = PageUtil.getPageList(pageNumber, pageSize, list);
			JSONArray jsonArray = new JSONArray();
			for (kPIGoodsSaleScore goodsSaleScore : subList) {
				JSONObject object = new JSONObject();
				Integer goods_id = (Integer) goodsSaleScore.get("goods_id");
				object.put("goods_id", goods_id);// 产品ID
				if (goods_id != null) {
					Goods goods = GoodsFactory.getInstance().getObject("id", goods_id);
					if (goods != null) {
						object.put("goods_name", goods.get("goods_name"));// 产品名称
						object.put("specification", goods.get("specification"));// 产品规格
					}
				}

				Integer customer_id = (Integer) goodsSaleScore.get("customer_id");
				if (customer_id != null) {
					ChainCustomer customer = ChainCustomerFactory.getInstance().getObject("id", customer_id);
					if (customer != null) {
						object.put("customer_name", customer.get("china_customer_name"));// 客户名称
					}
				}

				object.put("require_money",
						goodsSaleScore.get("require_money") == null ? "" : goodsSaleScore.get("require_money"));// 要求销售额
				object.put("money", goodsSaleScore.get("money") == null ? "" : goodsSaleScore.get("money"));// 实际销售额
				object.put("money_require_ratio",
						goodsSaleScore.get("money_require_ratio") == null ? "" : goodsSaleScore.get("money_require_ratio"));// 销售额要求比值
				object.put("money_actual_ratio",
						goodsSaleScore.get("money_actual_ratio") == null ? "" : goodsSaleScore.get("money_actual_ratio"));// 销售额实际比值
				object.put("require_build_sell_count", goodsSaleScore.get("require_build_sell_count") == null ? ""
						: goodsSaleScore.get("require_build_sell_count"));// 要求铺点数
				object.put("build_sell_count",
						goodsSaleScore.get("build_sell_count") == null ? "" : goodsSaleScore.get("build_sell_count"));// 实际铺点数
				object.put("build_sell_count_require_ratio", goodsSaleScore.get("build_sell_count_require_ratio") == null ? ""
						: goodsSaleScore.get("build_sell_count_require_ratio"));// 铺点数要求比值
				object.put("build_sell_count_actual_ratio", goodsSaleScore.get("build_sell_count_actual_ratio") == null ? ""
						: goodsSaleScore.get("build_sell_count_actual_ratio"));// 铺点数实际比值
				jsonArray.add(object);
			}

			SuccessJSON success = new SuccessJSON();
			success.put("count", list.size());
			success.put("list", jsonArray);
			writer.print(success);
			log.trace("查询销量考核详情结束");
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

	/***
	 * 维护考核详情
	 */
	private void customerSaleScoreDetail() {
		try {
			// 获得年月
			String time = dataJson.getString("time");
			log.trace("开始查询销量考核详情...");
			Integer employee_id = Integer.valueOf(dataJson.get("employee_id").toString());
			StringBuilder sql = new StringBuilder();
			pageSize = dataJson.getInteger("pageSize");
			pageNumber = dataJson.getInteger("pageNumber");
			Integer year;
			Integer month;
			try {
				String[] times = time.split("-");
				year = Integer.parseInt(times[0]);
				month = Integer.parseInt(times[1]);
			} catch (Exception e) {
				log.error("查询时间格式有误！", e);
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}

			sql.append(" where t.year = ").append(year).append(" and t.month = ").append(month)
					.append(" and t.employee_id = ").append(employee_id);
			List<KPIGoodCumsotrScore> list = KPIGoodCumsotrScoreFactory.getInstance().getObjectsForString(sql.toString(),
					employee);
			List<KPIGoodCumsotrScore> subList = PageUtil.getPageList(pageNumber, pageSize, list);
			JSONArray jsonArray = new JSONArray();
			for (KPIGoodCumsotrScore goodCumsotrScore : subList) {
				JSONObject object = new JSONObject();
				Integer goods_id = (Integer) goodCumsotrScore.get("goods_id");
				object.put("goods_id", goods_id);// 产品ID
				if (goods_id != null) {
					Goods goods = GoodsFactory.getInstance().getObject("id", goods_id);
					if (goods != null) {
						object.put("goods_name", goods.get("goods_name"));// 产品名称
						object.put("specification", goods.get("specification"));// 产品规格
					}
				}

				Integer customer_id = (Integer) goodCumsotrScore.get("customer_id");
				if (customer_id != null) {
					Customer customer = CustomerFactory.getInstance().getObject("id", customer_id);
					if (customer != null) {
						object.put("customer_name", customer.get("customer_name"));// 门店名称
					}
				}

				object.put("require_display_number", goodCumsotrScore.get("require_display_number") == null ? ""
						: goodCumsotrScore.get("require_display_number"));// 要求陈列数
				object.put("display_number",
						goodCumsotrScore.get("display_number") == null ? "" : goodCumsotrScore.get("display_number"));// 实际陈列数
				object.put("require_display_surface", goodCumsotrScore.get("require_display_surface") == null ? ""
						: goodCumsotrScore.get("require_display_surface"));// 要求陈列面
				object.put("display_surface",
						goodCumsotrScore.get("display_surface") == null ? "" : goodCumsotrScore.get("display_surface"));// 实际陈列面
				object.put("require_weighted_price", goodCumsotrScore.get("require_weighted_price") == null ? ""
						: goodCumsotrScore.get("require_weighted_price"));// 要求平均加权价
				object.put("weighted_price",
						goodCumsotrScore.get("weighted_price") == null ? "" : goodCumsotrScore.get("weighted_price"));// 实际平均加权价
				object.put("display_surface_require_ratio", goodCumsotrScore.get("display_surface_require_ratio") == null ? ""
						: goodCumsotrScore.get("display_surface_require_ratio"));// 陈列面要求比值
				object.put("display_surface_ratio",
						goodCumsotrScore.get("display_surface_ratio") == null ? "" : goodCumsotrScore.get("display_surface_ratio"));// 陈列面实际比值
				object.put("display_number_require_ratio", goodCumsotrScore.get("display_number_require_ratio") == null ? ""
						: goodCumsotrScore.get("display_number_require_ratio"));// 陈列数要求比值
				object.put("display_number_ratio",
						goodCumsotrScore.get("display_number_ratio") == null ? "" : goodCumsotrScore.get("display_number_ratio"));// 陈列数实际比值
				object.put("weighted_price_require_ratio", goodCumsotrScore.get("weighted_price_require_ratio") == null ? ""
						: goodCumsotrScore.get("weighted_price_require_ratio"));// 平均加权价要求比值
				object.put("weighted_price_ratio",
						goodCumsotrScore.get("weighted_price_ratio") == null ? "" : goodCumsotrScore.get("weighted_price_ratio"));// 平均加权价实际比值
				jsonArray.add(object);
			}

			SuccessJSON success = new SuccessJSON();
			success.put("count", list.size());
			success.put("list", jsonArray);
			writer.print(success);
			log.trace("查询销量考核详情结束");
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

	@Override
	protected void add() {

	}

	@Override
	protected void fileUpload(HttpServletRequest request, HttpServletResponse response) {
		// 获得年月
		String time;
		try {
			time = dataJson.getString("time");
		} catch (Exception e) {
			log.error("出现异常！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}

		Integer year;
		Integer month;
		try {
			String[] times = time.split("-");
			year = Integer.parseInt(times[0]);
			month = Integer.parseInt(times[1]);
		} catch (Exception e) {
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		// 查询考核记录
		StringBuilder sql = new StringBuilder();
		sql.append(" left join employee e on e.id = t.employee_id where 1=1 ");
		sql.append(" and t.year = " + year);
		sql.append(" and t.month = " + month);
		sql.append(" order by year,month,score desc ");

		List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
		try {
			List<KPIScoreRecord> list = kpiScoreRecordFactory.getObjectsForString(sql.toString(), employee);
			for (KPIScoreRecord record : list) {
				AreaDivision area = null;
				RoleGroup role = null;
				Employee user = employeeFactory.getObject("id", record.get("employee_id"));
				Integer areaId = user.get("area_id");
				Integer roleId = user.get("role_group_id");
				if (null != areaId) {
					area = areaDivisionFactory.getObject("id", areaId);
				}
				if (null != roleId) {
					role = roleGroupFactory.getObject("id", roleId);
				}
				Map<String, Object> map = new LinkedHashMap<String, Object>();
				map.put("序号", user.get("employee_id"));
				map.put("员工姓名", user.get("real_name"));
				map.put("角色", role == null ? "" : role.get("group_name"));
				map.put("员工地区", area == null ? "" : area.get("area_name"));
				map.put("年", record.get("year"));
				map.put("月", record.get("month"));
				map.put("总分", record.get("score"));
				dataList.add(map);
			}

			if (dataList.size() > 0) {
				exportListData(dataList);
				log.trace("导出列表数据结束...");
			} else {
				log.trace("暂无数据！");
				writer.print(new SuccessJSON("msg", "暂无数据！"));
			}

		} catch (Exception e) {
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}
}
