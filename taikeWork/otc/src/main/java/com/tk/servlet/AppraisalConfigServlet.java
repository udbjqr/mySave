package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.PageUtil;
import com.tk.common.util.StringUtil;
import com.tk.object.*;
import com.tk.object.KPI.*;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.SQLException;
import java.util.*;

/**
 * 考核设置管理servlet
 * <p>
 *
 * @author huzh
 */
@WebServlet("/appraisalConfig.do")
public class AppraisalConfigServlet extends BaseServlet {
	private static Logger log = LogManager.getLogger(AppraisalConfigServlet.class.getName());
	// 获取到产品门店考核设置工厂类
	private static KPICustomerTargetFactory kpiCustomTargetFactory = KPICustomerTargetFactory.getInstance();
	// 获取到产品人员考核设置工厂类
	private static KPIEmployeeTargetFactory kpiEmployeeTargetFactory = KPIEmployeeTargetFactory.getInstance();
	// 获取到南华客户工厂类
	private static ChainCustomerFactory chainCustomerFactory = ChainCustomerFactory.getInstance();
	// 获取到销售设置工厂类
	private static KPISaleTargetFactory kpiSaleTargetFactory = KPISaleTargetFactory.getInstance();
	// 获取到考核参数设置工厂类
	private static KPIParameterFactory kpiParameterFactory = KPIParameterFactory.getInstrance();
	// 获取到教育设置工厂类
	private static KPIEducateConfigFactory kpiEducateConfigFactory = KPIEducateConfigFactory.getInstance();
	// 客户工厂类
	private static CustomerFactory customerFactory = CustomerFactory.getInstance();
	// 客户工厂类
	private static CustomerAttributesFactory customerAttributesFactory = CustomerAttributesFactory.getInstance();
	// 文档工厂类
	private static DocumentFactory documentFactory = DocumentFactory.getInstance();
	// 员工工厂类
	private static EmployeeFactory employeeFactory = EmployeeFactory.getInstance();
	// 产品工厂类
	private static GoodsFactory goodsFactory = GoodsFactory.getInstance();
	// 客户规模工厂类
	private static CustomerAttributesFactory attributesFactory = CustomerAttributesFactory.getInstance();
	// 供应商工厂类
	private static SupplierFactory supplierFactory = SupplierFactory.getInstance();
	//获得查询工厂类
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();

	private Integer pageSize;
	private Integer pageNumber;

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.add, PermissionEnum.APPRAISAL_CONFIG_ADD);
		handlePermission.put(ControlType.delete, PermissionEnum.APPRAISAL_CONFIG_DELETE);
		handlePermission.put(ControlType.load, PermissionEnum.APPRAISAL_CONFIG_QUERY);
		handlePermission.put(ControlType.query, PermissionEnum.APPRAISAL_CONFIG_QUERY);
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.update, PermissionEnum.APPRAISAL_CONFIG_UPDATE);
		handlePermission.put(ControlType.fileImport, PermissionEnum.APPRAISAL_CONFIG_IMPORT);
		handlePermission.put(ControlType.fileExport, PermissionEnum.APPRAISAL_CONFIG_EXPORT);
	}

	@Override
	protected boolean handleChilder() {
		return false;
	}

	@Override
	protected void queryAll() {
		log.trace("获取考核评分占比初始...");
		List<KPIParameter> parameterList = kpiParameterFactory.getAllObjects(employee);
		JSONArray jsonArray = new JSONArray();
		JSONObject percent = new JSONObject();
		if (null != parameterList && parameterList.size() > 0) {
			for (KPIParameter parameter : parameterList) {
				Integer id = parameter.get("id");
				switch (id) {
					case 1:
						percent.put("despaly_face", parameter.get("max_score"));
						break;
					case 2:
						percent.put("despaly_number", parameter.get("max_score"));
						break;
					case 3:
						percent.put("weighted_price", parameter.get("max_score"));
						break;
					case 4:
						percent.put("build_sell_count", parameter.get("max_score"));
						break;
					case 5:
						percent.put("money", parameter.get("max_score"));
						break;
					case 6:
						percent.put("educate", parameter.get("max_score"));
						break;
				}
				JSONObject object = new JSONObject();
				object.put("id", parameter.get("id"));
				object.put("name", parameter.get("parameter_name"));
				object.put("maxScore", parameter.get("max_score"));
				object.put("formulas", parameter.get("formulas"));
				object.put("paul_at_the_end", parameter.get("paul_at_the_end"));
				jsonArray.add(object);
			}
		}
		SuccessJSON success = new SuccessJSON();
		success.put("list", jsonArray);
		success.put("info", percent);
		log.trace("获取考核评分占比结束...");
		writer.print(success);
	}

	@Override
	protected void delete() {
		log.trace("删除考核配置信息初始...");
		// 删除类型（product：根据产品，employee：根据人员，educate：根据教育，coustom：根据客户）
		String deleteType = dataJson.getString("deleteType");
		if (StringUtils.isEmpty(deleteType)) {
			log.trace("考核配置获取删除类型失败...");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		ErrorCode errorCode;
		try {
			if ("product".equals(deleteType)) {
				errorCode = deleteProductConfig();
			} else if ("employee".equals(deleteType)) {
				errorCode = deleteEmployeeConfig();
			} else if ("educate".equals(deleteType)) {
				errorCode = deleteEducateConfig();
			} else if ("coustom".equals(deleteType)) {
				errorCode = deleteCoustomConfig();
			} else {
				log.trace("考核配置未知的删除类型！");
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}
			if (null != errorCode) {
				log.error("删除配置发生错误！");
				writer.print(errorCode);
				return;
			}
		} catch (Exception e) {
			log.error("删除考核配置信息发生异常:{}！", e);
			writer.print(ErrorCode.DELETE_ERROR);
		}
		log.trace("删除考核配置信息结束...");
		writer.print(new SuccessJSON("msg", "删除成功！"));
	}

	/**
	 * 删除产品门店考核配置
	 *
	 * @throws Exception
	 */
	private ErrorCode deleteProductConfig() throws Exception {
		// 产品Id
		Integer goodId = dataJson.getInteger("good_id");
		//获得门店类型
		Integer attributesId = dataJson.getInteger("attributes_id");
		if (null == goodId || null == attributesId) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.good_id =" + goodId);
		sql.append(" and t.attributes_id = " + attributesId);
		List<KPICustomerTarget> targetList = kpiCustomTargetFactory.getObjectsForString(sql.toString(), employee);
		if (null == targetList || targetList.size() == 0) {
			return null;
		}
		KPICustomerTarget target = targetList.get(0);
		boolean bl = target.delete();
		if (!bl) {
			return ErrorCode.DELETE_ERROR;
		}
		return null;
	}

	/**
	 * 删除产品人员考核配置
	 *
	 * @throws Exception
	 */
	private ErrorCode deleteEmployeeConfig() throws Exception {
		// 产品Id
		Integer goodId = dataJson.getInteger("good_id");
		//获得门店类型
		Integer employeeId = dataJson.getInteger("employee_id");
		if (null == goodId || null == employeeId) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.good_id =" + goodId);
		sql.append(" and t.employee_id = " + employeeId);
		List<KPIEmployeeTarget> targetList = kpiEmployeeTargetFactory.getObjectsForString(sql.toString(), employee);
		if (null == targetList || targetList.size() == 0) {
			return null;
		}
		KPIEmployeeTarget target = targetList.get(0);
		boolean bl = target.delete();
		if (!bl) {
			return ErrorCode.DELETE_ERROR;
		}
		return null;
	}

	/**
	 * 删除教育考核配置
	 *
	 * @throws Exception
	 */
	private ErrorCode deleteEducateConfig() throws Exception {
		// 产品Id
		Integer documentId = dataJson.getInteger("document_id");
		//获得考核人员
		Integer employeeId = dataJson.getInteger("employee_id");
		if (null == documentId || null == employeeId) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.document_id =" + documentId);
		sql.append(" and t.employee_id = " + employeeId);
		List<KPIEducateConfig> targetList = kpiEducateConfigFactory.getObjectsForString(sql.toString(), employee);
		if (null == targetList || targetList.size() == 0) {
			return null;
		}
		KPIEducateConfig target = targetList.get(0);
		boolean bl = target.delete();
		if (!bl) {
			return ErrorCode.DELETE_ERROR;
		}
		return null;
	}

	/**
	 * 删除南华客户考核
	 *
	 * @throws Exception
	 */
	private ErrorCode deleteCoustomConfig() throws Exception {
		// 配置Id
		Integer saleId = dataJson.getInteger("sale_id");
		if (null == saleId) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.id =" + saleId);
		List<KPISaleTarget> targetList = kpiSaleTargetFactory.getObjectsForString(sql.toString(), employee);
		if (null == targetList || targetList.size() == 0) {
			return null;
		}
		KPISaleTarget target = targetList.get(0);
		boolean bl = target.delete();
		if (!bl) {
			return ErrorCode.DELETE_ERROR;
		}
		return null;
	}

	/**
	 * 修改考核配置信息
	 */
	@Override
	protected void update() {
		log.trace("修改考核配置信息初始...");
		// 查询类型
		String updateType = dataJson.getString("updateType");
		if (StringUtils.isEmpty(updateType)) {
			log.trace("获取配置修改类型失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		ErrorCode errorCode;
		try {
			if ("product".equals(updateType)) {
				errorCode = updateProductConfig();
			} else if ("employee".equals(updateType)) {
				errorCode = updateEmployeeConfig();
			} else if ("educate".equals(updateType)) {
				errorCode = updateEducateConfig();
			} else if ("coustom".equals(updateType)) {
				errorCode = updateCoustomConfig();
			} else {
				log.trace("未知的修改类型！");
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}
			if (null != errorCode) {
				log.error("修改考核配置信息发生错误！");
				writer.print(errorCode);
				return;
			}
		} catch (Exception e) {
			log.error("修改考核配置信息发生异常:{}！", e);
			writer.print(ErrorCode.UPDATE_ERROR);
		}
		log.trace("修改考核配置信息结束...");
		writer.print(new SuccessJSON());
	}

	/**
	 * 获得产品考核设置参数记录
	 */
	@Override
	protected void query() {
		log.trace("查询考核配置列表初始...");
		// 查询类型
		String selectType = dataJson.getString("selectType");
		pageSize = Integer
						.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
		pageNumber = Integer.parseInt(
						StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));
		if (StringUtils.isEmpty(selectType)) {
			log.trace("获取考核配置查询类型失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		JSONArray jsonArray = null;
		try {
			if ("product".equals(selectType)) {
				jsonArray = getConfigListByProduct();
			} else if ("employee".equals(selectType)) {
				jsonArray = getConfigListByEmployee();
			} else if ("educate".equals(selectType)) {
				jsonArray = getConfigListByEducate();
			} else if ("coustom".equals(selectType)) {
				jsonArray = getConfigListByCustomer();
			} else {
				log.trace("未知考核配置查询类型！");
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}

			List<Object> pageList = PageUtil.getPageList(pageNumber, pageSize, jsonArray);
			SuccessJSON success = new SuccessJSON();
			success.put("list", pageList);
			success.put("count", jsonArray.size());
			log.trace("查询考核配置列表结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("查询考核配置列表发生异常:{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	/**
	 * 产品考核根据门店类型查列表
	 *
	 * @return
	 */
	private JSONArray getConfigListByProduct() throws SQLException {
		String goodsName = dataJson.getString("goodsName");
		// 供应商
		Integer supplierId = dataJson.getInteger("supplier_id");
		//门店类型
		String attributesId = dataJson.getString("attributes_id");

		// 查询考核产品设置
		StringBuilder sql = new StringBuilder();
		sql.append(" left join goods d on d.id = t.good_id where 1=1 ");
		if (StringUtils.isNotEmpty(goodsName)) {
			sql.append(" and d.goods_name like " + dbHelper.getString("%" + goodsName + "%"));
		}
		if (StringUtils.isNotBlank(attributesId)) {
			sql.append(" and t.attributes_id in  (").append(attributesId).append(")");
		}
		if (null != supplierId) {
			sql.append(" and d.supplier_id = " + supplierId);
		}
		sql.append(" order by good_id  ");
		List<KPICustomerTarget> list = kpiCustomTargetFactory.getObjectsForString(sql.toString(), employee);
		JSONArray jsonArray = new JSONArray();
		for (KPICustomerTarget target : list) {
			Goods goods = goodsFactory.getObject("id", target.get("good_id"));
			//客户类型
			CustomerAttributes attributes = attributesFactory.getObject("id", target.get("attributes_id"));
			JSONObject object = new JSONObject();
			object.put("good_id", target.get("good_id"));
			object.put("attributes_id", target.get("attributes_id"));
			// 规格
			object.put("specification", goods == null ? "" : goods.get("specification"));
			object.put("goods_name", goods == null ? "" : goods.get("goods_name"));
			//门店类型
			object.put("attributes_name", attributes == null ? "" : attributes.get("attributes_name"));
			// 供应商
			object.put("supplier", goods == null ? ""
							: supplierFactory.getObject("id", goods.get("supplier_id")).get("supplier_name"));
			// 陈列面
			object.put("display_surface", target.get("display_surface"));
			// 陈列数
			object.put("display_number", target.get("display_number"));
			// 加权价
			object.put("weighted_price", target.get("weighted_price"));
			jsonArray.add(object);
		}
		return jsonArray;
	}

	/**
	 * 产品考核根据人员查列表
	 *
	 * @return
	 */
	private JSONArray getConfigListByEmployee() throws SQLException {
		String goodsName = dataJson.getString("goodsName");
		// 供应商
		Integer supplierId = dataJson.getInteger("supplier_id");
		//考核人
		String employeeId = dataJson.getString("employee_id");
		// 查询考核产品设置
		StringBuilder sql = new StringBuilder();
		sql.append(" left join goods d on d.id = t.good_id where 1=1 ");
		if (StringUtils.isNotEmpty(goodsName)) {
			sql.append(" and d.goods_name like " + dbHelper.getString("%" + goodsName + "%"));
		}
		if (StringUtils.isNotBlank(employeeId)) {
			String str2 = employeeId.substring(employeeId.length() - 1);
			if (str2.equals(",")) {
				employeeId = employeeId.substring(0, employeeId.length() - 1);
			}
			sql.append(" and t.employee_id in( ").append(employeeId).append(")");
		}
		if (null != supplierId) {
			sql.append(" and d.supplier_id = " + supplierId);
		}
		sql.append(" order by good_id  ");
		List<KPIEmployeeTarget> list = kpiEmployeeTargetFactory.getObjectsForString(sql.toString(), employee);
		JSONArray jsonArray = new JSONArray();
		for (KPIEmployeeTarget target : list) {
			Goods goods = goodsFactory.getObject("id", target.get("good_id"));
			//人员
			Employee employeeTmp = employeeFactory.getObject("id", target.get("employee_id"));
			JSONObject object = new JSONObject();
			object.put("good_id", target.get("good_id"));
			object.put("employee_id", target.get("employee_id"));
			// 规格
			object.put("specification", goods == null ? "" : goods.get("specification"));
			object.put("goods_name", goods == null ? "" : goods.get("goods_name"));
			//人员名
			object.put("employeeName", employeeTmp == null ? "" : employeeTmp.get("real_name"));
			// 供应商
			object.put("supplier", goods == null ? ""
							: supplierFactory.getObject("id", goods.get("supplier_id")).get("supplier_name"));
			// 陈列面
			object.put("display_surface", target.get("display_surface"));
			// 陈列数
			object.put("display_number", target.get("display_number"));
			// 加权价
			object.put("weighted_price", target.get("weighted_price"));
			CustomerAttributes attributes = customerAttributesFactory.getObject("id", target.get("attributes_id"));
			//门店类型
			object.put("attributes_name", attributes == null ? "" : attributes.get("attributes_name"));
			jsonArray.add(object);
		}
		return jsonArray;
	}

	/**
	 * 根据门店查列表
	 *
	 * @return
	 */
	private JSONArray getConfigListByEducate() throws SQLException {
		//文档名
		String documentName = dataJson.getString("documentName");
		// 产品Id
		String employeeId = dataJson.getString("employee_id");
		// 文件Id
		String documentId = dataJson.getString("document_id");
		// 查询考核产品设置
		StringBuilder sql = new StringBuilder();
		//只查文档
		sql.append(" left join documents c on c.id=t.document_id where c.flag = 1 ");
		if (StringUtils.isNotEmpty(documentName)) {
			sql.append(" and c.document_name like " + dbHelper.getString("%" + documentName + "%"));
		}
		if (StringUtils.isNotBlank(documentId)) {
			sql.append(" and t.document_id in( ").append(documentId).append(")");
		}
		if (StringUtils.isNotBlank(employeeId)) {
			sql.append(" and t.employee_id in( ").append(employeeId).append(")");
		}
		sql.append(" order by t.document_id ");
		List<KPIEducateConfig> list = kpiEducateConfigFactory.getObjectsForString(sql.toString(), employee);
		JSONArray jsonArray = new JSONArray();
		for (KPIEducateConfig config : list) {
			//人员
			Employee employeeTmp = employeeFactory.getObject("id", config.get("employee_id"));
			Document document = documentFactory.getObject("id", config.get("document_id"));
			JSONObject object = new JSONObject();
			object.put("document_id", config.get("document_id"));
			object.put("employee_id", config.get("employee_id"));
			// 单位名称
			object.put("documentName", document == null ? "" : document.get("document_name"));
			object.put("employeeName", employeeTmp == null ? "" : employeeTmp.get("real_name"));
			// 至少播放次数
			object.put("play_nunmer_less_than", config.get("play_nunmer_less_than"));
			// 至少播放时间
			object.put("play_time_less_than", config.get("play_time_less_than"));
			object.put("flag", config.get("flag"));
			jsonArray.add(object);
		}
		return jsonArray;
	}

	/**
	 * 根据客户查列表
	 *
	 * @return
	 */
	private JSONArray getConfigListByCustomer() throws SQLException {
		// 考核产品
		String goodId = dataJson.getString("good_id");
		// 查询考核产品设置
		StringBuilder sql = new StringBuilder();
		sql.append(" where 1=1 ");
		if (StringUtils.isNotBlank(goodId)) {
			String str2 = goodId.substring(goodId.length() - 1);
			if (str2.equals(",")) {
				goodId = goodId.substring(0, goodId.length() - 1);
			}
			sql.append(" and t.good_id in( ").append(goodId).append(")");
		}
		sql.append(" order by good_id  ");
		List<KPISaleTarget> list = kpiSaleTargetFactory.getObjectsForString(sql.toString(), employee);
		JSONArray jsonArray = new JSONArray();
		for (KPISaleTarget sale : list) {
			JSONObject object = new JSONObject();
			Goods goods = goodsFactory.getObject("id", sale.get("good_id"));
			//门店类型，判断回填门店或连锁
			Integer customType = sale.get("custom_type");
			Store customer;
			CustomerAttributes attributes;
			if (1 == customType) {
				attributes = customerAttributesFactory.getObject("id", sale.get("attributes_id"));
				customer = customerFactory.getObject("id", sale.get("customer_id"));
				object.put("attributesName", attributes == null ? "" : attributes.get("attributes_name"));
				object.put("customName", customer == null ? "" : customer.get("customer_name"));
			} else {
				customer = chainCustomerFactory.getObject("id", sale.get("customer_id"));
				object.put("customName", customer == null ? "" : customer.get("china_customer_name"));
			}
			object.put("id", sale.get("id"));
			object.put("good_id", sale.get("good_id"));
			object.put("customer_id", sale.get("customer_id"));
			object.put("attributes_id", sale.get("attributes_id"));
			object.put("custom_type", customType);
			object.put("customTypeShow", customType == 1 ? "门店" : "连锁");
			object.put("chain_customer_id", sale.get("chain_customer_id"));
			// 规格
			object.put("specification", goods == null ? "" : goods.get("specification"));
			// 产品名
			object.put("goods_name", goods == null ? "" : goods.get("goods_name"));
			// 供应商
			object.put("supplier", goods == null ? ""
							: supplierFactory.getObject("id", goods.get("supplier_id")).get("supplier_name"));
			// 铺点数
			object.put("build_sell_count", sale.get("build_sell_count"));
			// 目标销售件数
			object.put("number", sale.get("number"));
			// 目标销售总金额
			object.put("money", sale.get("money"));
			jsonArray.add(object);
		}
		return jsonArray;
	}

	/**
	 * 获取访问记录详情
	 */
	@Override
	protected void load() {
		log.trace("查询考核配置详情初始...");
		// 查询类型
		String loadType = dataJson.getString("loadType");
		if (StringUtils.isEmpty(loadType)) {
			log.trace("获取考核配置详情查询类型失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		JSONObject object;
		try {
			if ("product".equals(loadType)) {
				object = loadProductConfig();
			} else if ("employee".equals(loadType)) {
				object = loadEmployeeConfig();
			} else if ("educate".equals(loadType)) {
				object = loadEducateConfig();
			} else if ("coustom".equals(loadType)) {
				object = loadCoustomConfig();
			} else {
				log.trace("位置的考核配置详情查询类型！");
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}
			if (null == object) {
				log.trace("考核配置不存在！");
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}
			Object errorCode = object.get("success");
			// 判断是否出现异常码
			if (null != errorCode && !"".equals(errorCode)) {
				log.error("查询考核配置失败！");
				writer.print(errorCode);
				return;
			}
			// 否则查询出了正常数据，返回给前端
			SuccessJSON success = new SuccessJSON();
			success.put("info", object);
			log.trace("查询考核配置详情结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("查询考核配置详情发生异常:{}！", e);
			writer.print(ErrorCode.LOAD_ERROR);
		}
	}

	@Override
	protected void add() {
		log.trace("新增考核配置详情初始...");
		// 查询类型
		String addType = dataJson.getString("addType");
		if (StringUtils.isEmpty(addType)) {
			log.trace("获取考核配置新增类型失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		ErrorCode errorCode;
		try {
			if ("product".equals(addType)) {
				errorCode = addProductConfig();
			} else if ("employee".equals(addType)) {
				errorCode = addEmployeeConfig();
			} else if ("educate".equals(addType)) {
				errorCode = addEducateConfig();
			} else if ("coustom".equals(addType)) {
				errorCode = addCoustomConfig();
			} else {
				log.trace("未知的考核配置新增类型！");
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}
			if (null != errorCode) {
				log.error("新增考核配置失败！");
				writer.print(errorCode);
				return;
			}
			log.trace("新增考核配置结束...");
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.error("新增考核配置发生异常:{}！", e);
			writer.print(ErrorCode.ADD_ERROR);
		}
	}

	/**
	 * 新增产品门店考核
	 *
	 * @throws Exception
	 */
	private ErrorCode addProductConfig() throws Exception {
		// 产品Id
		Integer goodId = dataJson.getInteger("good_id");
		// 陈列面
		Integer displaySurface = dataJson.getInteger("display_surface");
		// 陈列数
		Integer displayNumber = dataJson.getInteger("display_number");
		// 加权价
		Double weightedPrice = dataJson.getDouble("weighted_price");
		// 门店类型
		String attributesIds = dataJson.getString("attributes_ids");
		if (null == goodId || null == displaySurface || null == displayNumber || null == weightedPrice) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}
		//如果没有选择门店规模，默认选择全部的规模
		StringBuilder attributes = new StringBuilder();
		if (StringUtils.isEmpty(attributesIds)) {
			List<CustomerAttributes> attributesList = customerAttributesFactory.getObjectsForString(" where flag !=1 ", null);
			if (null == attributesList || attributesList.size() < 1) {
				return ErrorCode.OBJECT_NOT_EXIST;
			}
			//拼接
			for (int i = 0; i < attributesList.size(); i++) {
				if (i < attributesList.size() - 1) {
					attributes.append(attributesList.get(i).get("id") + ",");
				} else {
					attributes.append(attributesList.get(i).get("id") + "");
				}
			}
			//重新赋值
			attributesIds = attributes.toString();
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.good_id =" + goodId);
		sql.append(" and t.attributes_id in (" + attributesIds + ") ");
		List<KPICustomerTarget> targetList = kpiCustomTargetFactory.getObjectsForString(sql.toString(), employee);
		if (null != targetList && targetList.size() > 0) {
			return ErrorCode.RECODE_AlREADY_EXIST;
		}
		String[] attributeIdArr = attributesIds.split(",");
		for (String attributesId : attributeIdArr) {
			KPICustomerTarget target = kpiCustomTargetFactory.getNewObject(null);
			target.set("good_id", goodId);
			target.set("display_surface", displaySurface);
			target.set("display_number", displayNumber);
			target.set("weighted_price", weightedPrice);
			target.set("attributes_id", attributesId);
			target.set("flag", 1);
			boolean bl = target.flash();
			if (!bl) {
				return ErrorCode.ADD_ERROR;
			}
		}
		return null;
	}

	/**
	 * 新增产品人员考核
	 *
	 * @throws Exception
	 */
	private ErrorCode addEmployeeConfig() throws Exception {
		// 产品Id
		Integer goodId = dataJson.getInteger("good_id");
		// 陈列面
		Integer displaySurface = dataJson.getInteger("display_surface");
		// 陈列数
		Integer displayNumber = dataJson.getInteger("display_number");
		// 门店类型
		Integer attributesId = dataJson.getInteger("attributes_id");
		// 加权价
		Double weightedPrice = dataJson.getDouble("weighted_price");
		// 员工Id
		String employeeId = dataJson.getString("employee_id");
		if (null == attributesId || null == goodId || null == displaySurface || null == displayNumber || null == weightedPrice || StringUtils.isEmpty(employeeId)) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}

		String str2 = employeeId.substring(employeeId.length() - 1);
		if (str2.equals(",")) {
			employeeId = employeeId.substring(0, employeeId.length() - 1);
		}
		String[] employeeIdArr = employeeId.split(",");
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.good_id =" + goodId);
		sql.append(" and t. attributes_id =" + attributesId);
		sql.append(" and t.employee_id in (")
						.append(employeeId)
						.append(")");
		List<KPIEmployeeTarget> targetList = kpiEmployeeTargetFactory.getObjectsForString(sql.toString(), employee);
		if (targetList.size() > 0) {
			return ErrorCode.RECODE_AlREADY_EXIST;
		}
		boolean bl = false;
		for (String empId : employeeIdArr) {
			KPIEmployeeTarget target = kpiEmployeeTargetFactory.getNewObject(null);
			target.set("good_id", goodId);
			target.set("display_surface", displaySurface);
			target.set("display_number", displayNumber);
			target.set("weighted_price", weightedPrice);
			target.set("employee_id", empId);
			target.set("attributes_id", attributesId);
			target.set("flag", 1);
			bl = target.flash();
		}

		if (!bl) {
			return ErrorCode.ADD_ERROR;
		}
		return null;
	}

	/**
	 * 新增教育考核
	 *
	 * @throws Exception
	 */
	private ErrorCode addEducateConfig() throws Exception {
		// 产品Id
		Integer documentId = dataJson.getInteger("document_id");
		//获得考核人员
		String employeeId = dataJson.getString("employee_id");
		// 至少播放次数
		Integer playNunmerLessThan = dataJson.getInteger("play_nunmer_less_than");
		// 至少播放时间
		Integer playTimeLessThan = dataJson.getInteger("play_time_less_than");
		if (StringUtils.isBlank(employeeId) || null == documentId || null == playNunmerLessThan || null == playTimeLessThan) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}

		String str2 = employeeId.substring(employeeId.length() - 1);
		if (str2.equals(",")) {
			employeeId = employeeId.substring(0, employeeId.length() - 1);
		}
		String[] employeeIdArr = employeeId.split(",");
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.document_id =" + documentId);
		sql.append(" and t.employee_id in (").append(employeeId).append(")");
		List<KPIEducateConfig> configList = kpiEducateConfigFactory.getObjectsForString(sql.toString(), employee);
		if (configList.size() > 0) {
			return ErrorCode.RECODE_EXIST_ONE_OR_MANY;
		}

		boolean bl = true;
		for (String empId : employeeIdArr) {
			KPIEducateConfig config = kpiEducateConfigFactory.getNewObject(employee);
			config.set("document_id", documentId);
			config.set("employee_id", empId);
			config.set("play_nunmer_less_than", playNunmerLessThan);
			config.set("play_time_less_than", playTimeLessThan);
			config.set("flag", 1);
			bl = config.flash();
		}

		if (!bl) {
			return ErrorCode.ADD_ERROR;
		}
		return null;
	}

	/**
	 * 新增南华客户考核
	 *
	 * @throws Exception
	 */
	private ErrorCode addCoustomConfig() throws Exception {
		// 产品Id
		Integer goodId = dataJson.getInteger("good_id");
		//客户类型
		Integer customType = dataJson.getInteger("custom_type");
		// 连锁客户Id
		Integer chainCustomerId = dataJson.getInteger("chain_customer_id");
		// 门店客户Id
		Integer customerId = dataJson.getInteger("customer_id");
		//门店规模
		Integer attributesId = dataJson.getInteger("attributes_id");
		// 铺点数
		Integer buildSellCount = dataJson.getInteger("build_sell_count");
		// 要求数量
		Integer number = dataJson.getInteger("number");
		// 要求金额
		Double money = dataJson.getDouble("money");
		if (null == goodId || null == customType || null == buildSellCount || null == number || null == money) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.good_id =" + goodId);
		if (1 == customType) {
			//如果是普通门店，规模跟门店必选其一
			if (null == attributesId && null == customerId) {
				return ErrorCode.GET_FONT_END_INFO_ERROR;
			}
			if (null != attributesId) {
				sql.append(" and t.attributes_id = " + attributesId);
			}
			if (null != customerId) {
				sql.append(" and t.customer_id = " + customerId);
			}
		} else {
			//连锁门店，一定要选择门店ID
			if (null == chainCustomerId) {
				return ErrorCode.GET_FONT_END_INFO_ERROR;
			}
			sql.append(" and t.customer_id = " + chainCustomerId);
		}
		List<KPISaleTarget> targetList = kpiSaleTargetFactory.getObjectsForString(sql.toString(), employee);
		if (null != targetList && targetList.size() > 0) {
			return ErrorCode.RECODE_AlREADY_EXIST;
		}
		KPISaleTarget target = kpiSaleTargetFactory.getNewObject(employee);
		target.set("good_id", goodId);
		if (1 == customType) {
			target.set("customer_id", customerId);
			target.set("attributes_id", attributesId);
		} else {
			target.set("customer_id", chainCustomerId);
		}
		target.set("custom_type", customType);
		target.set("build_sell_count", buildSellCount);
		target.set("number", number);
		target.set("money", money);
		target.set("flag", 1);
		boolean bl = target.flash();
		if (!bl) {
			return ErrorCode.ADD_ERROR;
		}
		return null;
	}

	/**
	 * 修改产品门店考核
	 *
	 * @throws Exception
	 */
	private ErrorCode updateProductConfig() throws Exception {
		// 产品Id
		Integer goodId = dataJson.getInteger("good_id");
		//获得门店类型
		Integer attributesId = dataJson.getInteger("attributes_id");
		// 陈列面
		Integer displaySurface = dataJson.getInteger("display_surface");
		// 陈列数
		Integer displayNumber = dataJson.getInteger("display_number");
		// 加权价
		Double weightedPrice = dataJson.getDouble("weighted_price");
		if (null == goodId || null == attributesId || null == displaySurface || null == displayNumber || null == weightedPrice) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.good_id =" + goodId);
		sql.append(" and t.attributes_id =" + attributesId);
		List<KPICustomerTarget> targetList = kpiCustomTargetFactory.getObjectsForString(sql.toString(), employee);
		if (null == targetList || targetList.size() == 0) {
			return ErrorCode.OBJECT_NOT_EXIST;
		} else if (targetList.size() > 1) {
			return ErrorCode.TOO_MANEY_RESULT_ERROR;
		}
		KPICustomerTarget target = targetList.get(0);
		target.set("display_surface", displaySurface);
		target.set("display_number", displayNumber);
		target.set("weighted_price", weightedPrice);
		boolean bl = target.flash();
		if (!bl) {
			return ErrorCode.UPDATE_ERROR;
		}
		return null;
	}

	/**
	 * 修改产品人员考核
	 *
	 * @throws Exception
	 */
	private ErrorCode updateEmployeeConfig() throws Exception {
		// 产品Id
		Integer goodId = dataJson.getInteger("good_id");
		//获得考核人员
		Integer employeeId = dataJson.getInteger("employee_id");
		// 陈列面
		Integer displaySurface = dataJson.getInteger("display_surface");
		// 陈列数
		Integer displayNumber = dataJson.getInteger("display_number");
		// 加权价
		Double weightedPrice = dataJson.getDouble("weighted_price");
		if (null == goodId || null == employeeId || null == displaySurface || null == displayNumber || null == weightedPrice) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.good_id =" + goodId);
		sql.append(" and t.employee_id =" + employeeId);
		List<KPIEmployeeTarget> targetList = kpiEmployeeTargetFactory.getObjectsForString(sql.toString(), employee);
		if (null == targetList || targetList.size() == 0) {
			return ErrorCode.OBJECT_NOT_EXIST;
		} else if (targetList.size() > 1) {
			return ErrorCode.TOO_MANEY_RESULT_ERROR;
		}
		KPIEmployeeTarget target = targetList.get(0);
		target.set("display_surface", displaySurface);
		target.set("display_number", displayNumber);
		target.set("weighted_price", weightedPrice);
		boolean bl = target.flash();
		if (!bl) {
			return ErrorCode.UPDATE_ERROR;
		}
		return null;
	}

	/**
	 * 修改教育考核
	 *
	 * @throws Exception
	 */
	private ErrorCode updateEducateConfig() throws Exception {
		// 文档Id
		Integer documentId = dataJson.getInteger("document_id");
		//获得考核人员
		Integer employeeId = dataJson.getInteger("employee_id");
		// 陈列面
		Integer playNunmerLessThan = dataJson.getInteger("play_nunmer_less_than");
		// 陈列数
		Integer playTimeLessThan = dataJson.getInteger("play_time_less_than");

		if (null == documentId || employeeId == null || null == playNunmerLessThan || null == playTimeLessThan) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.document_id =" + documentId);
		sql.append(" and t.employee_id = " + employeeId);
		List<KPIEducateConfig> targetList = kpiEducateConfigFactory.getObjectsForString(sql.toString(), employee);
		if (null == targetList || targetList.size() == 0) {
			return ErrorCode.OBJECT_NOT_EXIST;
		} else if (targetList.size() > 1) {
			return ErrorCode.TOO_MANEY_RESULT_ERROR;
		}
		KPIEducateConfig config = targetList.get(0);
		config.set("play_nunmer_less_than", playNunmerLessThan);
		config.set("play_time_less_than", playTimeLessThan);
		boolean bl = config.flash();
		if (!bl) {
			return ErrorCode.UPDATE_ERROR;
		}
		return null;
	}

	/**
	 * 修改南华客户考核
	 *
	 * @throws Exception
	 */
	private ErrorCode updateCoustomConfig() throws Exception {
		// 配置Id
		Integer saleId = dataJson.getInteger("sale_id");
		// 铺点数
		Integer buildSellCount = dataJson.getInteger("build_sell_count");
		// 要求数量
		Integer number = dataJson.getInteger("number");
		// 要求金额
		Double money = dataJson.getDouble("money");
		if (null == saleId || null == buildSellCount || null == number || null == money) {
			return ErrorCode.GET_FONT_END_INFO_ERROR;
		}
		// 根据产品Id查询
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.id =" + saleId);
		List<KPISaleTarget> targetList = kpiSaleTargetFactory.getObjectsForString(sql.toString(), employee);
		if (null == targetList || targetList.size() == 0) {
			return ErrorCode.OBJECT_NOT_EXIST;
		}
		KPISaleTarget target = targetList.get(0);
		target.set("build_sell_count", buildSellCount);
		target.set("number", number);
		target.set("money", money);
		boolean bl = target.flash();
		if (!bl) {
			return ErrorCode.UPDATE_ERROR;
		}
		return null;
	}

	/**
	 * 查询产品门店考核
	 *
	 * @throws Exception
	 */
	private JSONObject loadProductConfig() throws Exception {
		// 返回结果
		JSONObject object = new JSONObject();
		// 记录Id
		Integer goodId = dataJson.getInteger("good_id");
		//门店类型
		Integer attributesId = dataJson.getInteger("attributes_id");
		if (null == goodId || null == attributesId) {
			object.put("success", ErrorCode.GET_FONT_END_INFO_ERROR);
			return object;
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.good_id =" + goodId);
		sql.append(" and t.attributes_id = " + attributesId);
		List<KPICustomerTarget> targetList = kpiCustomTargetFactory.getObjectsForString(sql.toString(), employee);
		if (null == targetList || targetList.size() == 0) {
			object.put("success", ErrorCode.OBJECT_NOT_EXIST);
			return object;
		} else if (targetList.size() > 1) {
			object.put("success", ErrorCode.TOO_MANEY_RESULT_ERROR);
			return object;
		}

		// 根据Id查询
		KPICustomerTarget target = targetList.get(0);
		if (null == target) {
			object.put("success", ErrorCode.OBJECT_NOT_EXIST);
			return object;
		}
		Goods good = goodsFactory.getObject("id", target.get("good_id"));
		CustomerAttributes attributes = attributesFactory.getObject("id", target.get("attributes_id"));
		object.put("success", null);
		object.put("good_id", target.get("good_id"));
		object.put("goodName", good == null ? "" : good.get("goods_name"));
		object.put("attributes_id", target.get("attributes_id"));
		object.put("attributes_name", attributes == null ? "" : attributes.get("attributes_name"));
		object.put("display_surface", target.get("display_surface"));
		object.put("display_number", target.get("display_number"));
		object.put("weighted_price", target.get("weighted_price"));
		return object;
	}

	/**
	 * 查询产品人员考核
	 *
	 * @throws Exception
	 */
	private JSONObject loadEmployeeConfig() throws Exception {
		// 返回结果
		JSONObject object = new JSONObject();
		// 记录Id
		Integer goodId = dataJson.getInteger("good_id");
		//门店类型
		Integer employeeId = dataJson.getInteger("employee_id");
		if (null == goodId || null == employeeId) {
			object.put("success", ErrorCode.GET_FONT_END_INFO_ERROR);
			return object;
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.good_id =" + goodId);
		sql.append(" and t.employee_id = " + employeeId);
		List<KPIEmployeeTarget> targetList = kpiEmployeeTargetFactory.getObjectsForString(sql.toString(), employee);
		if (null == targetList || targetList.size() == 0) {
			object.put("success", ErrorCode.OBJECT_NOT_EXIST);
			return object;
		} else if (targetList.size() > 1) {
			object.put("success", ErrorCode.TOO_MANEY_RESULT_ERROR);
			return object;
		}

		// 根据Id查询
		KPIEmployeeTarget target = targetList.get(0);
		if (null == target) {
			object.put("success", ErrorCode.OBJECT_NOT_EXIST);
			return object;
		}
		Goods good = goodsFactory.getObject("id", target.get("good_id"));
		Employee employeeTmp = employeeFactory.getObject("id", target.get("employee_id"));
		object.put("success", null);
		object.put("good_id", target.get("good_id"));
		object.put("goodName", good == null ? "" : good.get("goods_name"));
		object.put("employee_id", target.get("employee_id"));
		object.put("employeeName", employeeTmp == null ? "" : employeeTmp.get("real_name"));
		object.put("display_surface", target.get("display_surface"));
		object.put("display_number", target.get("display_number"));
		object.put("weighted_price", target.get("weighted_price"));
		return object;
	}

	/**
	 * 查询教育考核
	 *
	 * @throws Exception
	 */
	private JSONObject loadEducateConfig() throws Exception {
		// 返回结果
		JSONObject object = new JSONObject();
		// 记录Id
		Integer documentId = dataJson.getInteger("document_id");
		// 客户Id
		Integer employeeId = dataJson.getInteger("employee_id");
		if (null == documentId || null == employeeId) {
			object.put("success", ErrorCode.GET_FONT_END_INFO_ERROR);
			return object;
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.document_id =" + documentId);
		sql.append(" and t.employee_id =" + employeeId);
		List<KPIEducateConfig> targetList = kpiEducateConfigFactory.getObjectsForString(sql.toString(), employee);
		if (null == targetList || targetList.size() == 0) {
			object.put("success", ErrorCode.OBJECT_NOT_EXIST);
			return object;
		} else if (targetList.size() > 1) {
			object.put("success", ErrorCode.TOO_MANEY_RESULT_ERROR);
			return object;
		}

		//根据Id查询
		KPIEducateConfig target = targetList.get(0);
		if (null == target) {
			object.put("success", ErrorCode.OBJECT_NOT_EXIST);
			return object;
		}
		Document document = documentFactory.getObject("id", target.get("document_id"));
		Employee employeeTmp = employeeFactory.getObject("id", target.get("employee_id"));
		object.put("success", null);
		object.put("document_id", target.get("document_id"));
		object.put("documentName", document == null ? "" : document.get("document_name"));
		object.put("employee_id", target.get("employee_id"));
		object.put("employeeName", employeeTmp == null ? "" : employeeTmp.get("real_name"));
		object.put("play_nunmer_less_than", target.get("play_nunmer_less_than"));
		object.put("play_time_less_than", target.get("play_time_less_than"));
		return object;
	}

	/**
	 * 查询南华客户考核
	 *
	 * @throws Exception
	 */
	private JSONObject loadCoustomConfig() throws Exception {
		// 返回结果
		JSONObject object = new JSONObject();
		// 配置Id
		Integer saleId = dataJson.getInteger("sale_id");
		if (null == saleId) {
			object.put("success", ErrorCode.GET_FONT_END_INFO_ERROR);
			return object;
		}
		// 根据产品Id查询
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.id =" + saleId);
		List<KPISaleTarget> targetList = kpiSaleTargetFactory.getObjectsForString(sql.toString(), employee);
		if (null == targetList || targetList.size() == 0) {
			object.put("success", ErrorCode.OBJECT_NOT_EXIST);
			return object;
		}
		KPISaleTarget target = targetList.get(0);
		//门店类型，判断回填门店或连锁
		Integer customType = target.get("custom_type");
		Goods good = goodsFactory.getObject("id", target.get("good_id"));
		Store customer;
		CustomerAttributes attributes;
		if (1 == customType) {
			attributes = customerAttributesFactory.getObject("id", target.get("attributes_id"));
			customer = customerFactory.getObject("id", target.get("customer_id"));
			object.put("customName", customer == null ? "" : customer.get("customer_name"));
			object.put("attributesName", attributes == null ? "" : attributes.get("attributes_name"));
		} else {
			customer = chainCustomerFactory.getObject("id", target.get("customer_id"));
			object.put("customName", customer == null ? "" : customer.get("china_customer_name"));
		}
		object.put("success", null);
		object.put("good_id", target.get("good_id"));
		object.put("custom_type", customType);
		object.put("goodName", good == null ? "" : good.get("goods_name"));
		object.put("customer_id", target.get("customer_id"));
		object.put("build_sell_count", target.get("build_sell_count"));
		object.put("number", target.get("number"));
		object.put("money", target.get("money"));
		return object;
	}

	@Override
	protected void fileUpload(HttpServletRequest request, HttpServletResponse response) {
		try {
			// 导出类型
			String exportType = dataJson.getString("exportType").toString();

			List<Map<String, Object>> list = new ArrayList<>();

			if ("product".equals(exportType)) {
				list = exportConfigListByProduct();
			} else if ("educate".equals(exportType)) {
				list = exportConfigListByStore();
			} else if ("coustom".equals(exportType)) {
				list = exportConfigListByCustomer();
			} else {
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}

			// 导出Excel文件
			exportFile(list);

		} catch (Exception e) {
			log.error("参数异常！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		}
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
	 * 导出产品考核设置
	 *
	 * @return
	 * @throws Exception
	 */
	private List<Map<String, Object>> exportConfigListByProduct() throws Exception {
		// 查询考核产品设置
		StringBuilder sql = new StringBuilder();
		sql.append(" left join goods d on d.id = t.good_id where t.custom_id =0  order by good_id");
		List<KPICustomerTarget> list = kpiCustomTargetFactory.getObjectsForString(sql.toString(), employee);

		List<Map<String, Object>> dataList = new ArrayList<>();

		for (KPICustomerTarget target : list) {
			Goods goods = goodsFactory.getObject("id", target.get("good_id"));
			Map<String, Object> object = new TreeMap<String, Object>();

			object.put("编号", target.get("good_id"));
			// 规格
			object.put("规格", goods == null ? "" : goods.get("specification"));
			object.put("产品", goods == null ? "" : goods.get("goods_name"));
			// 供应商
			object.put("供应商", goods == null ? ""
							: supplierFactory.getObject("id", goods.get("supplier_id")).get("supplier_name"));
			// 陈列面
			object.put("陈列面", target.get("display_surface"));
			// 陈列数
			object.put("陈列数", target.get("display_number"));
			// 加权价
			object.put("加权价", target.get("weighted_price"));
			dataList.add(object);
		}

		return dataList;
	}

	/****
	 * 导出总销售额设置
	 *
	 * @return
	 * @throws Exception
	 */
	private List<Map<String, Object>> exportConfigListByCustomer() throws Exception {
		List<Map<String, Object>> dataList = new ArrayList<>();
		// 查询考核产品设置
		StringBuilder sql = new StringBuilder();
		sql.append(" left join chain_customer c on c.id=t.chain_customer_id ");
		sql.append(" left join goods g on g.id= t.good_id where 1=1 ");

		sql.append(" order by good_id  ");
		List<KPISaleTarget> list = kpiSaleTargetFactory.getObjectsForString(sql.toString(), employee);

		for (KPISaleTarget sale : list) {
			Goods goods = goodsFactory.getObject("id", sale.get("good_id"));
			// KPIcustomer customer = kpiCustomerFactory.getObject("id",
			// sale.get("chain_customer_id"));

			Map<String, Object> map = new HashMap<String, Object>();
			map.put("编号", sale.get("good_id"));
			// object.put("good_id", sale.get("good_id"));
			// 规格
			map.put("规格", goods == null ? "" : goods.get("specification"));
			// 南华客户
			// object.put("specification", customer == null ? "" :
			// customer.get("china_customer_name"));
			// 产品名
			map.put("产品", goods == null ? "" : goods.get("goods_name"));
			// 供应商
			map.put("供应商", goods == null ? ""
							: supplierFactory.getObject("id", goods.get("supplier_id")).get("supplier_name"));
			// 铺点数
			map.put("铺点数", sale.get("build_sell_count"));
			// 目标销售件数
			map.put("目标销售件数", sale.get("number"));
			// 目标销售总金额
			map.put("目标销售总金额", sale.get("money"));
			dataList.add(map);
		}

		return dataList;
	}

	/****
	 * 导出门店考核设置
	 *
	 * @return
	 * @throws Exception
	 */
	private List<Map<String, Object>> exportConfigListByStore() throws Exception {
		List<Map<String, Object>> dataList = new ArrayList<>();

		// 查询考核产品设置
		StringBuilder sql = new StringBuilder();
		sql.append("  left join customer c on c.id=t.custom_id where t.custom_id !=0 ");
		sql.append(" order by good_id  ");
		List<KPICustomerTarget> list = kpiCustomTargetFactory.getObjectsForString(sql.toString(), employee);

		for (KPICustomerTarget target : list) {
			Customer customer = customerFactory.getObject("id", target.get("custom_id"));
			Goods goods = goodsFactory.getObject("id", target.get("goods_id"));
			Map<String, Object> map = new HashMap<String, Object>();
			map.put("编号", target.get("good_id"));
			// map.put("good_id", target.get("good_id"));
			// 单位名称
			map.put("单位名称", customer == null ? "" : customer.get("customer_name"));
			// 单位地址
			map.put("单位地址", customer == null ? "" : customer.get("address"));
			// 产品名
			map.put("产品名", goods == null ? "" : goods.get("goods_name"));
			// 陈列面
			map.put("陈列面", target.get("display_surface"));
			// 陈列数
			map.put("陈列数", target.get("display_number"));
			// 加权价
			map.put("加权价", target.get("weighted_price"));
			dataList.add(map);
		}

		return dataList;
	}

	@Override
	protected void fileImport(HttpServletRequest request) {
		// 导入类型
		String importType = dataJson.getString("importType");
		if (StringUtils.isEmpty(importType)) {
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}

		try {
			Collection<Map> dataMap = getImportDataMap(request);
			if (dataMap == null) {
				return;
			}

			ErrorCode errorCode = null;
			if ("product".equals(importType)) {
				if (importProductConfigValidate(dataMap)) {
					errorCode = importProductConfig(dataMap);
				} else {
					return;
				}
			} else if ("educate".equals(importType)) {
				if (importStoreConfigValidate(dataMap)) {
					errorCode = importStoreConfig(dataMap);
				} else {
					return;
				}
			} else if ("coustom".equals(importType)) {
				errorCode = importCoustomConfig(dataMap);
			} else {
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}

			if (errorCode == null) {
				writer.print(new SuccessJSON("msg", "导入列表数据成功！"));
			} else {
				writer.print(errorCode);
			}

		} catch (Exception e) {
			log.error("文件导入异常！", e);
			writer.print(ErrorCode.IMPORT_FILE_FAIL);
		}
	}

	/***
	 * 导入产品考核校验
	 * @param dataMap
	 * @return
	 */
	protected boolean importProductConfigValidate(Collection<Map> dataMap) {
		String goodId, displaySurface, weightedPrice, displayNumber;
		String goodId_title = "产品Id";
		String displaySurface_title = "陈列面";
		String displayNumber_title = "陈列数";
		String weightedPrice_title = "加权价";
		Integer id = null;
		for (Map map : dataMap) {
			// 产品Id
			goodId = (String) map.get(goodId_title);
			// 陈列面
			displaySurface = (String) map.get(displaySurface_title);
			// 陈列数
			displayNumber = (String) map.get(displayNumber_title);
			// 加权价
			weightedPrice = (String) map.get(weightedPrice_title);

			if (StringUtils.isBlank(goodId)) {
				//非空校验
				if (!vaditeImportNullDate(goodId_title, map)) {
					return false;
				}
				return false;
			} else {
				//整数校验
				try {
					id = Integer.valueOf(goodId);
				} catch (NumberFormatException e) {
					getImportErrorMsg(1, goodId_title, goodId, map, null);
					return false;
				}

				//id校验
				Goods goods = goodsFactory.getObject("id", id);
				if (goods == null) {
					getImportErrorMsg(4, goodId_title, goodId, map, null);
					return false;
				}
			}

			if (StringUtils.isBlank(displaySurface)) {
				//非空校验
				if (!vaditeImportNullDate(displaySurface_title, map)) {
					return false;
				}
				return false;
			} else {
				//整数校验
				try {
					id = Integer.valueOf(displaySurface);
				} catch (NumberFormatException e) {
					getImportErrorMsg(1, displaySurface_title, displaySurface, map, null);
					return false;
				}
			}

			if (StringUtils.isBlank(displayNumber)) {
				//非空校验
				if (!vaditeImportNullDate(displayNumber_title, map)) {
					return false;
				}
				return false;
			} else {
				//整数校验
				try {
					id = Integer.valueOf(displayNumber);
				} catch (NumberFormatException e) {
					getImportErrorMsg(1, displayNumber_title, displayNumber, map, null);
					return false;
				}
			}

			if (StringUtils.isBlank(weightedPrice)) {
				//非空校验
				if (!vaditeImportNullDate(weightedPrice_title, map)) {
					return false;
				}
				return false;
			} else {
				//小数校验
				try {
					Double price = Double.valueOf(weightedPrice);
				} catch (NumberFormatException e) {
					getImportErrorMsg(2, weightedPrice_title, weightedPrice, map, null);
					return false;
				}
			}

		}
		return true;
	}

	/**
	 * 导入产品考核
	 *
	 * @param dataMap
	 * @throws Exception
	 */
	private ErrorCode importProductConfig(Collection<Map> dataMap) throws Exception {
		boolean ifag = true;

		String goodId, displaySurface, weightedPrice, displayNumber;
		for (Map map : dataMap) {
			// 产品Id
			goodId = map.get("产品Id").toString();
			// 陈列面
			displaySurface = map.get("陈列面").toString();
			// 陈列数
			displayNumber = map.get("陈列数").toString();
			// 加权价
			weightedPrice = map.get("加权价").toString();

			StringBuilder sql = new StringBuilder();
			sql.append(" where t.good_id =" + goodId);
			sql.append(" and t.custom_id = 0 ");
			List<KPICustomerTarget> targetList = kpiCustomTargetFactory.getObjectsForString(sql.toString(), employee);
			if (targetList.size() > 0) {
				return ErrorCode.RECODE_EXIST_ONE_OR_MANY;
			}


			KPICustomerTarget target = kpiCustomTargetFactory.getNewObject(employee);
			target.set("good_id", goodId);
			target.set("custom_id", 0);
			target.set("display_surface", displaySurface);
			target.set("display_number", displayNumber);
			target.set("weighted_price", weightedPrice);
			target.set("flag", 1);

			ifag = target.flash();
		}

		if (ifag) {
			return null;
		} else {
			return ErrorCode.IMPORT_FILE_FAIL;
		}
	}

	/***
	 * 导入门店考核校验
	 * @param dataMap
	 * @return
	 */
	protected boolean importStoreConfigValidate(Collection<Map> dataMap) {
		String goodId, displayNumber, customId, displaySurface, weightedPrice;
		String goodId_title = "产品Id";
		String displayNumber_title = "陈列数",
						customId_title = "客户Id",
						displaySurface_title = "陈列面",
						weightedPrice_title = "加权价";

		for (Map map : dataMap) {
			// 产品Id
			goodId = (String) map.get(goodId_title);
			// 客户Id
			customId = (String) map.get(customId_title);
			// 陈列面
			displaySurface = (String) map.get(displaySurface_title);
			// 陈列数
			displayNumber = (String) map.get(displayNumber_title);
			// 加权价
			weightedPrice = (String) map.get(weightedPrice_title);

			Integer id = null;

			if (StringUtils.isBlank(weightedPrice)) {
				//非空校验
				if (!vaditeImportNullDate(weightedPrice_title, map)) {
					return false;
				}
				return false;
			} else {
				//整数校验
				try {
					Double.valueOf(weightedPrice);
				} catch (NumberFormatException e) {
					getImportErrorMsg(2, weightedPrice_title, weightedPrice, map, null);
					return false;
				}
			}

			if (StringUtils.isBlank(displayNumber)) {
				//非空校验
				if (!vaditeImportNullDate(displayNumber_title, map)) {
					return false;
				}
				return false;
			} else {
				//整数校验
				try {
					id = Integer.valueOf(displayNumber);
				} catch (NumberFormatException e) {
					getImportErrorMsg(1, displayNumber_title, displayNumber, map, null);
					return false;
				}
			}


			if (StringUtils.isBlank(displaySurface)) {
				//非空校验
				if (!vaditeImportNullDate(displaySurface_title, map)) {
					return false;
				}
				return false;
			} else {
				//整数校验
				try {
					id = Integer.valueOf(displaySurface);
				} catch (NumberFormatException e) {
					getImportErrorMsg(1, displaySurface_title, displaySurface, map, null);
					return false;
				}
			}


			if (StringUtils.isBlank(goodId)) {
				//非空校验
				if (!vaditeImportNullDate(goodId_title, map)) {
					return false;
				}
				return false;
			} else {
				//整数校验
				try {
					id = Integer.valueOf(goodId);
				} catch (NumberFormatException e) {
					getImportErrorMsg(1, goodId_title, goodId, map, null);
					return false;
				}

				//id校验
				Goods goods = goodsFactory.getObject("id", id);
				if (goods == null) {
					getImportErrorMsg(4, goodId_title, goodId, map, null);
					return false;
				}
			}


			if (StringUtils.isBlank(customId)) {
				//非空校验
				if (!vaditeImportNullDate(customId_title, map)) {
					return false;
				}
				return false;
			} else {
				//整数校验
				try {
					id = Integer.valueOf(customId);
				} catch (NumberFormatException e) {
					getImportErrorMsg(1, customId_title, customId, map, null);
					return false;
				}

				//id校验
				Customer customer = customerFactory.getObject("id", id);
				if (customer == null) {
					getImportErrorMsg(4, customId_title, customId, map, null);
					return false;
				}
			}

			StringBuilder sql = new StringBuilder();
			sql.append(" where t.good_id =" + goodId);
			sql.append(" and t.custom_id = " + customId);
			List<KPICustomerTarget> targetList = null;
			try {
				targetList = kpiCustomTargetFactory.getObjectsForString(sql.toString(), employee);
			} catch (SQLException e) {
				e.printStackTrace();
			}

			if (targetList != null && targetList.size() > 0) {
				writer.print(ErrorCode.RECODE_AlREADY_EXIST);
				return false;
			}
		}

		return true;
	}


	/**
	 * 导入门店考核
	 *
	 * @param dataMap
	 * @throws Exception
	 */
	private ErrorCode importStoreConfig(Collection<Map> dataMap) throws Exception {
		boolean ifag = true;
		for (Map map : dataMap) {
			// 产品Id
			String goodId = map.get("产品Id").toString();
			// 客户Id
			String customId = map.get("客户Id").toString();
			// 陈列面
			String displaySurface = map.get("陈列面").toString();
			// 陈列数
			String displayNumber = map.get("陈列数").toString();
			// 加权价
			String weightedPrice = map.get("加权价").toString();


			StringBuilder sql = new StringBuilder();
			sql.append(" where t.good_id =" + goodId);
			sql.append(" and t.custom_id = " + customId);
			List<KPICustomerTarget> targetList = kpiCustomTargetFactory.getObjectsForString(sql.toString(), employee);
			if (targetList.size() > 0) {
				return ErrorCode.RECODE_AlREADY_EXIST;
			}

			KPICustomerTarget target = kpiCustomTargetFactory.getNewObject(employee);
			target.set("good_id", goodId);
			target.set("custom_id", customId);
			target.set("display_surface", displaySurface);
			target.set("display_number", displayNumber);
			target.set("weighted_price", weightedPrice);
			target.set("flag", 1);
			ifag = target.flash();
		}

		if (ifag) {
			return null;
		} else {
			return ErrorCode.IMPORT_FILE_FAIL;
		}
	}

	/**
	 * 导入南华客户考核
	 *
	 * @param dataMap
	 * @throws Exception
	 */
	private ErrorCode importCoustomConfig(Collection<Map> dataMap) throws Exception {
		boolean ifag = true;
		for (Map map : dataMap) {
			// 产品Id
			String goodId = map.get("产品Id").toString();
			// 南华客户Id
			String chainCustomerId = map.get("南华客户Id").toString();
			// 铺点数
			String buildSellCount = map.get("铺点数").toString();
			// 要求数量
			String number = map.get("要求数量").toString();
			// 要求金额
			String money = map.get("要求金额").toString();

			StringBuilder sql = new StringBuilder();
			sql.append(" where t.good_id =" + goodId);
			sql.append(" and t.chain_customer_id = " + chainCustomerId);
			List<KPISaleTarget> targetList = kpiSaleTargetFactory.getObjectsForString(sql.toString(), employee);
			if (targetList.size() > 0) {
				return ErrorCode.RECODE_AlREADY_EXIST;
			}

			KPISaleTarget target = kpiSaleTargetFactory.getNewObject(employee);
			target.set("good_id", goodId);
			target.set("chain_customer_id", chainCustomerId);
			target.set("build_sell_count", buildSellCount);
			target.set("number", number);
			target.set("money", money);
			target.set("flag", 1);
			ifag = target.flash();
		}

		if (ifag) {
			return null;
		} else {
			return ErrorCode.IMPORT_FILE_FAIL;
		}
	}

}
