package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.Config;
import com.tk.common.util.DateUtil;
import com.tk.common.util.FileUtil;
import com.tk.common.util.GeoUtils;
import com.tk.object.*;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.annotation.WebServlet;
import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * 考核管理servlet
 * <p>
 *
 * @author huzh
 */
@WebServlet("/appraisals.do")
public class AppraisalsServlet extends BaseServlet {
	private static Logger log = LogManager.getLogger(AppraisalsServlet.class.getName());
	// 获取到拜访记录工厂类
	private static VisitsFactory visitsFactory = VisitsFactory.getInstance();
	// 获取到拜访计划工厂类
	private static VisitPlanFactory visitPlanFactory = VisitPlanFactory.getInstance();
	// 获取到门店拜访详情工厂类
	private static VisitDetailFactory visitDetailFactory = VisitDetailFactory.getInstance();
	// 获取到商业拜访详情工厂类
	private static RemarkDetailFactory remarkDetailFactory = RemarkDetailFactory.getInstance();
	//客户工厂类
	private static CustomerFactory customerFactory = CustomerFactory.getInstance();
	//商业客户工厂类
	private static ChainCustomerFactory chainCustomerFactory = ChainCustomerFactory.getInstance();
	//产品工厂类
	private static GoodsFactory goodsFactory = GoodsFactory.getInstance();
	//供应商工厂类
	private static SupplierFactory supplierFactory = SupplierFactory.getInstance();
	//查询工厂类
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.add, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.load, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.uploadImg, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.stockInit, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.query, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.checkSign, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.checkSignOut, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.sign, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.addRemark, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.loadRemark, PermissionEnum.NOT_USE_PERMISSION);
	}

	@Override
	protected boolean handleChilder() {
		switch (controlType) {
			case stockInit:
				stockInit();
				return true;
			case checkSign:
				checkSign();
				return true;
			case checkSignOut:
				checkSignOut();
				return true;
			case uploadImg:
				uploadImage();
				return true;
			case sign:
				sign();
				return true;
			case addRemark:
				addReMark();
				return true;
			case loadRemark:
				loadChainRemark();
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

	/**
	 * 获得当前客户历史来访记录
	 */
	@Override
	protected void query() {
		log.trace("根据客户Id获取历史来访记录初始...");
		Integer customerId;
		try {
			customerId = dataJson.getInteger("customer_id");
		} catch (Exception e) {
			log.error("获取客户Id异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == customerId) {
			log.trace("获取客户Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		Integer employeeId = employee.get("id");
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.customer_id='" + customerId + "' ");
		sql.append(" and visits_employee_id= '" + employeeId + "'");
		List<Visits> visitses = null;
		JSONArray jsonArray = new JSONArray();
		try {
			visitses = visitsFactory.getObjectsForString(sql.toString(), employee);
			if (null != visitses && visitses.size() > 0) {
				for (Visits visit : visitses) {
					Object day = DateUtil.formatDate(visit.get("visits_time"), "yyyy-MM-dd");
					JSONObject object = new JSONObject();
					object.put("visits_id", visit.get("id"));
					object.put("visits_time", visit.get("visits_time"));
					object.put("dayWeek", DateUtil.getDayWeek(day.toString()));
					jsonArray.add(object);
				}
			}
			SuccessJSON success = new SuccessJSON();
			success.put("list", jsonArray);
			log.trace("根据客户Id获取历史来访记录结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("根据客户Id获取历史来访记录异常:{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	/**
	 * 获取商业客户备注信息
	 */
	protected void loadChainRemark() {
		log.trace("根据拜访记录Id获取记录详情信息初始....");
		Integer planId;
		try {
			planId = dataJson.getInteger("plan_id");
		} catch (Exception e) {
			log.error("获取拜访计划Id异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == planId) {
			log.trace("获取拜访计划Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}

		//获取到拜访计划
		VisitPlan plan = visitPlanFactory.getObject("id", planId);
		if (null == plan) {
			log.trace("拜访计划不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		//获取到客户类型（１：门店客户，２：商业客户）
		Integer cuatomType = plan.get("customer_type");
		if (null == cuatomType || 2 != cuatomType) {
			log.trace("根据拜访记录Id获取记录详情信息结束（非商业客户）....");
			return;
		}
		//获得拜访记录
		Visits visits = visitsFactory.getObject("plan_id", planId);
		if (null == visits) {
			log.trace("根据拜访记录Id获取记录详情信息结束（未签到）....");
			return;
		}
		Integer visitsId = visits.get("id");
		RemarkDetail remarkDetail = remarkDetailFactory.getObject("visits_id", visitsId);
		JSONObject remarkObject = new JSONObject();
		if (null != remarkDetail) {
			remarkObject.put("detail_id", remarkDetail.get("id"));
			remarkObject.put("visits_id", remarkDetail.get("visits_id"));
			remarkObject.put("remark", remarkDetail.get("remark"));
		} else {
			remarkObject.put("visits_id", visitsId);
		}
		SuccessJSON success = new SuccessJSON();
		success.put("visitObject", remarkObject);
		log.trace("根据拜访记录Id获取记录详情信息结束....");
		writer.print(success);
	}


	/**
	 * 获取访问记录详情
	 */
	@Override
	protected void load() {
		log.trace("根据拜访记录Id获取记录详情信息初始....");
		Integer visitsId;
		try {
			visitsId = dataJson.getInteger("visits_id");
		} catch (Exception e) {
			log.error("获取拜访记录Id异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == visitsId) {
			log.trace("获取拜访记录Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		Visits visits = visitsFactory.getObject("id", visitsId);
		if (null == visits) {
			log.trace("拜访记录不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}

		Object day = DateUtil.formatDate(visits.get("visits_time"), "yyyy-MM-dd");
		//数据存储
		JSONObject visitObject = new JSONObject();
		visitObject.put("visits_time", day);
		visitObject.put("dayWeek", DateUtil.getDayWeek(day.toString()));
		//签入，签出时间
		visitObject.put("sign_in_time", visits.get("sign_in_time"));
		visitObject.put("sign_out_time", visits.get("sign_out_time"));
		JSONArray jsonArray = new JSONArray();
		List<VisitDetail> details = visitDetailFactory.getMultipleObjects("visits_id", visitsId, null);
		if (null != details && details.size() > 0) {
			for (VisitDetail detail : details) {
				JSONObject object = new JSONObject();
				Goods goods = goodsFactory.getObject("id", detail.get("goods_id"));
				if (goods != null) {
					object.put("goods_name", goods.get("goods_name"));
					object.put("specification", goods.get("specification"));
					Integer supplierId = goods.get("supplier_id");
					Supplier supplier = supplierFactory.getObject("id", supplierId);
					object.put("supplier", supplier == null ? "" : supplier.get("supplier_name"));
				}
				object.put("purchase_number", detail.get("purchase_number"));
				object.put("purchase_source", detail.get("purchase_source"));
				object.put("display_surface", detail.get("display_surface"));
				object.put("display_number", detail.get("display_number"));
				object.put("weighted_price", detail.get("weighted_price"));
				object.put("tag_price", detail.get("tag_price"));
				object.put("real_stock", detail.get("real_stock"));
				object.put("image_urls", detail.get("image_urls"));
				object.put("remark", detail.get("remark"));
				jsonArray.add(object);
			}
		}
		SuccessJSON success = new SuccessJSON();
		success.put("visitObject", visitObject);
		success.put("list", jsonArray);
		log.trace("根据拜访记录Id获取记录详情信息结束....");
		writer.print(success);
	}

	/**
	 * 盘点初始（用于判断考核产品是否已经盘点过，进入查看或者新增盘点页面）
	 */
	public void stockInit() {
		log.trace("根据获取产品盘点信息初始...");
		//产品
		Integer goodsId;
		//访问记录Id
		Integer visitsId;
		//门店Id
		Integer customId;
		try {
			goodsId = dataJson.getInteger("goods_id");
			visitsId = dataJson.getInteger("visits_id");
			customId = dataJson.getInteger("custom_id");
		} catch (Exception e) {
			log.error("获取产品Id或拜访记录Id发生异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		//未签到
		if (null == goodsId || null == visitsId) {
			log.trace("获取产品Id或拜访记录Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//查询签到信息
		Visits visit = visitsFactory.getObject("id", visitsId);
		if (null == visit) {
			log.trace("拜访信息不存在或未签到！");
			writer.print(ErrorCode.UN_SIGN);
			return;
		}
		//查询是否已经盘点过
		StringBuilder sql = new StringBuilder();
		sql.append(" where t.visits_id = " + visitsId);
		sql.append(" and t.goods_id =" + goodsId);
		//拜访详情
		List<VisitDetail> detailList;
		try {
			detailList = visitDetailFactory.getObjectsForString(sql.toString(), null);
			SuccessJSON success = new SuccessJSON();
			//返回
			JSONObject object = null;
			VisitDetail detail = null;
			/**
			 * 未盘点,返回最后一次盘点信息到前台
			 */
			if (null == detailList || detailList.size() == 0) {
				//获取到当前门店的Id
				if (null == customId) {
					log.trace("获取当前门店用户Id失败，不能查询历史数据！");
					success.put("info", null);
					success.put("unStuck", true);
					writer.print(success);
					return;
				}
				sql.setLength(0);
				sql.append(" inner join customer_visits v on v.id = t.visits_id ");
				sql.append(" where 1=1 and v.customer_id =" + customId);
				sql.append(" and t.goods_id =" + goodsId);
				sql.append(" order by v.visits_time desc ");
				detailList = visitDetailFactory.getObjectsForString(sql.toString(), null);
				if (null != detailList && detailList.size() > 0) {
					detail = detailList.get(0);
					object = getInfo(detail, false);
				}
				log.trace("产品未盘点，进入盘点页面！");
				success.put("info", object);
				success.put("unStuck", true);
				writer.print(success);
				return;
			}
			//已盘点
			detail = detailList.get(0);
			object = getInfo(detail, true);
			//判断是否已签出（未签出仍可以修改）
			Integer isSign = visit.get("flag");
			if (1 == isSign || 2 == isSign) {
				success.put("unStuck", false);
			} else {
				success.put("unStuck", true);
			}
			success.put("info", object);
			log.trace("根据获取产品盘点信息结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("获取盘点信息发生异常：{}！", e);
			writer.print(ErrorCode.LOAD_ERROR);
		}
	}

	/**
	 * 获得盘点明细
	 *
	 * @param detail
	 * @param bool   是否为修改回填
	 * @return
	 */
	public JSONObject getInfo(VisitDetail detail, Boolean bool) {
		if (null == detail) {
			return null;
		}
		JSONObject object = new JSONObject();
		//设置数据
		if (bool) {
			object.put("detail_id", detail.get("id"));
			object.put("image_urls", detail.get("image_urls"));
			object.put("real_stock", detail.get("real_stock"));
		}
		object.put("goods_name", goodsFactory.getObject("id", detail.get("goods_id")).get("goods_name"));
		object.put("display_surface", detail.get("display_surface"));
		object.put("display_number", detail.get("display_number"));
		object.put("purchase_number", detail.get("purchase_number"));
		object.put("purchase_source", detail.get("purchase_source"));
		object.put("weighted_price", detail.get("weighted_price"));
		object.put("batch_number", detail.get("batch_number"));
		object.put("tag_price", detail.get("tag_price"));
		object.put("remark", detail.get("remark"));
		return object;
	}

	/**
	 * 上传图片接口
	 */
	protected void uploadImage() {
		//上传图片名
		String fileName;
		//获取上传图片流
		String base64Img;
		try {
			//上传图片名
			fileName = dataJson.getString("fileName");
			//获取上传图片流
			base64Img = dataJson.getString("base64Img");
		} catch (Exception e) {
			log.error("获取文件流异常！", e);
			writer.print(ErrorCode.GET_FILE_STREAM_ERROR);
			return;
		}
		//获取文件流信息失败
		if (StringUtils.isEmpty(fileName) || StringUtils.isEmpty(base64Img)) {
			log.trace(ErrorCode.GET_FILE_STREAM_FAIL);
			writer.print(ErrorCode.GET_FILE_STREAM_FAIL);
			return;
		}
		//上传文件类型
		String fileType = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length());
		List<String> fileTypeList = FileUtil.getFileTypeList();
		//是否为允许的上传类型
		if (!fileTypeList.contains(fileType.toLowerCase())) {
			writer.print(ErrorCode.FILETYPE_ERROR);
			return;
		}

		//生成文件新名字
		String newFileName = UUID.randomUUID().toString().replaceAll("-", "") + "." + fileType;
		//时间目录
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String date = sdf.format(new Date());
		//数据库保存路径
		String filePath = "upload/" + Config.getInstance().getProperty("stockDirectory") + date + "/" + newFileName;
		//实际保存路径
		String savePath = Config.getInstance().getProperty("fileUploadPath") + Config.getInstance().getProperty("stockDirectory") + date;
		File f = new File(savePath);
		if (!f.exists()) {
			f.mkdirs();
		}
		//文件完整路径
		String saveFile = savePath + "/" + newFileName;
		try {
			FileUtil.getFileByString(base64Img, saveFile);
		} catch (Exception e) {
			log.error("上传产品图片失败！", e);
			writer.print(ErrorCode.FILEUPLOAD_FAIL);
			return;
		}

		//文件保存成功
		SuccessJSON success = new SuccessJSON();
		success.put("filePath", filePath);
		writer.print(success);
	}

	/**
	 * 商业客户拜访新增拜访备注
	 */
	protected void addReMark() {
		//访问记录Id
		Integer visitsId;
		//访问明细Id
		Integer detailId;
		//备注
		String remark;
		try {
			detailId = dataJson.getInteger("detail_id");
			visitsId = dataJson.getInteger("visits_id");
			remark = dataJson.getString("remark");
		} catch (Exception e) {
			log.error("获取新增或修改盘点明细参数异常！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		//未签到
		if (null == visitsId) {
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//拜访详情
		RemarkDetail visitDetail;
		//如果是修改
		if (null != detailId) {
			visitDetail = remarkDetailFactory.getObject("id", detailId);
			if (null == visitDetail) {
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}
		} else {
			visitDetail = remarkDetailFactory.getNewObject(employee);
		}
		try {
			//访问记录Id
			visitDetail.set("visits_id", visitsId);
			visitDetail.set("flag", 1);
			visitDetail.set("remark", remark);
			visitDetail.flash();
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			writer.print(ErrorCode.ADD_ERROR);
		}
	}

	/**
	 * 门店盘点
	 */
	@Override
	protected void add() {
		//产品
		Integer goodsId;
		//访问记录Id
		Integer visitsId;
		//访问明细Id
		Integer detailId;
		try {
			goodsId = dataJson.getInteger("goods_id");
			detailId = dataJson.getInteger("detail_id");
			visitsId = dataJson.getInteger("visits_id");
		} catch (Exception e) {
			log.error("获取新增或修改盘点明细参数异常！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		//未签到
		if (null == goodsId || null == visitsId) {
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}

		//拜访详情
		VisitDetail visitDetail;
		//如果是修改
		if (null != detailId) {
			visitDetail = visitDetailFactory.getObject("id", detailId);
			if (null == visitDetail) {
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}
		} else {
			visitDetail = visitDetailFactory.getNewObject(employee);
		}
		try {
			//访问记录Id
			visitDetail.set("visits_id", visitsId);
			visitDetail.set("flag", 1);
			//产品Id
			visitDetail.set("goods_id", goodsId);
			//实际库存数量
			visitDetail.set("real_stock", dataJson.get("real_stock"));
			//陈列面
			visitDetail.set("display_surface", dataJson.get("display_surface"));
			//标签价
			visitDetail.set("tag_price", dataJson.get("tag_price"));
			//加权价
			visitDetail.set("weighted_price", dataJson.get("weighted_price"));
			//陈列数
			visitDetail.set("display_number", dataJson.get("display_number"));
			//进货数量
			visitDetail.set("purchase_number", dataJson.get("purchase_number"));
			//进货来源
			visitDetail.set("purchase_source", dataJson.get("purchase_source"));
			//销售数量
			visitDetail.set("sail_number", dataJson.get("sail_number"));
			//批号
			visitDetail.set("batch_number", dataJson.get("batch_number"));
			//铺点数
			visitDetail.set("shop_point", dataJson.get("shop_point"));
			//销售额
			visitDetail.set("sail_total", dataJson.get("sail_total"));
			visitDetail.set("remark", dataJson.get("remark"));
			//上传图片名（多张图片）
			visitDetail.set("image_urls", dataJson.getString("fileNames"));

			visitDetail.flash();
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			writer.print(ErrorCode.ADD_ERROR);
		}
	}

	/**
	 * 判断是否已签到
	 */
	protected void checkSign() {
		//计划ID
		Integer planId;
		try {
			planId = dataJson.getInteger("plan_id");
		} catch (Exception e) {
			log.error("出现异常！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == planId) {
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//查询计划
		VisitPlan plan = visitPlanFactory.getObject("id", planId);
		if (null == plan) {
			log.error("根据id：{} 查询计划失败，计划不存在！", planId);
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		//获取到拜访客户的Id
		Integer customId = plan.get("custom_id");
		//定位
		String local;
		Integer customerType = plan.get("customer_type");
		Store customer = null;
		if (1 == customerType) {
			customer = customerFactory.getObject("id", customId);
		} else if (2 == customerType) {
			customer = chainCustomerFactory.getObject("id", customId);
		}
		local = customer.get("location");
		Visits visits = visitsFactory.getObject("plan_id", planId);
		SuccessJSON success = new SuccessJSON();
		//说明是签入（查询是否有未签出的数据）
		if (null == visits) {
			//否则签入
			success.put("signType", "signIn");
		} else {
			Integer flag = visits.get("flag");
			//为1时，说明已经签到签出过了（1：正常签出，2：系统定时签出）
			if (1 == flag || 2 == flag) {
				success.put("signType", "alreadySign");
			} else {
				success.put("signType", "signOut");
			}
		}
		//查询门店位置信息
		success.put("location", local);
		log.trace("根据计划Id 获取门店位置信息结束...");
		writer.print(success);
	}

	/**
	 * 判断签出时是否有未盘点的考核产品
	 */
	protected void checkSignOut() {
		log.trace("判断签出时是否有未盘点的考核产品初始...");
		//拜访记录Id
		Integer plan_id;
		try {
			plan_id = dataJson.getInteger("plan_id");
		} catch (Exception e) {
			log.error("获取拜访计划plan_id异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == plan_id) {
			log.trace("获取拜访计划Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//判断客户类型
		VisitPlan plan = visitPlanFactory.getObject("id", plan_id);
		if (null == plan) {
			log.trace("拜访信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		Integer customType = plan.get("customer_type");
		if (2 == customType) {
			//如果签出时扔有考核的产品未盘点
			SuccessJSON success = new SuccessJSON();
			success.put("unStack", 0);
			log.trace("判断签出时是否有未盘点的考核产品结束（非门店客户不用盘点）...");
			writer.print(success);
			return;
		}
		Visits visits = visitsFactory.getObject("plan_id", plan_id);
		if (null == visits) {
			log.trace("获取拜访记录不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		//获取拜访记录Id
		Integer visits_id = visits.get("id");
		//判断是否所有的考核产品都盘点过
		StringBuilder sqlStr = new StringBuilder();
		sqlStr.append("SELECT (SELECT count(g.id)  FROM goods g WHERE is_assess = 1) - count(vd.id) as unStock ");
		sqlStr.append(" FROM customer_visits_detail vd INNER JOIN customer_visits v ON vd.visits_id = v.id ");
		sqlStr.append(" where v.id = " + visits_id);
		try {
			Integer unStock = dbHelper.selectOneValues(sqlStr.toString());
			//如果签出时扔有考核的产品未盘点
			SuccessJSON success = new SuccessJSON();
			success.put("unStack", unStock);
			log.trace("判断签出时是否有未盘点的考核产品结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("签出时查询是否有未盘点产品发生异常：{}！", e);
			writer.print(ErrorCode.SIGN_ERROR);
		}
	}


	/**
	 * 签到
	 */
	protected void sign() {
		//计划ID
		Integer planId;
		//客户Id
		Integer customerId;
		//签到地址
		String signInLocaltion;
		//签到日期
		String planDay;
		try {
			planDay = dataJson.getString("planDay");
			planId = dataJson.getInteger("plan_id");
			customerId = dataJson.getInteger("customer_id");
			signInLocaltion = dataJson.getString("sign_in_localtion");
		} catch (Exception e) {
			log.error("出现异常！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == planId || StringUtils.isEmpty(planDay) || null == customerId || StringUtils.isEmpty(signInLocaltion)) {
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//获取到拜访计划
		VisitPlan plan = visitPlanFactory.getObject("id", planId);
		if (null == plan) {
			log.trace("拜访计划信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		//客户类型（1：门店，2：商业）
		Integer customType = plan.get("customer_type");
		Store customer = null;
		if (1 == customType) {
			customer = customerFactory.getObject("id", customerId);
		} else if (2 == customType) {
			customer = chainCustomerFactory.getObject("id", customerId);
		} else {
			log.trace("未知的门店客户类型！");
			writer.print(ErrorCode.UNKNOWN_CUSTOMER_TYPE);
			return;
		}
		if (null == customer) {
			log.trace("拜访的客户信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		//true 首次签到，false:非首次
		String firstSign = customer.get("location");
		Boolean isFirstSign = StringUtils.isEmpty(firstSign);
		try {
			//判断签到还是签出（signIn,signOut）
			Visits visits = visitsFactory.getObject("plan_id", planId);
			//签到
			if (null == visits) {
				/**
				 * 如果是签到 判断当天是否有未签出的计划
				 */
				Integer employeeId = employee.get("id");
				List<VisitPlan> planList;
				String sql = " left join customer_visits v on v.plan_id = t.id where v.flag = 0 and v.visits_employee_id = " + employeeId + " and convert(char(10) ,t.plan_in_time , 120)= '" + planDay + "'";
				try {
					planList = visitPlanFactory.getObjectsForString(sql, employee);
				} catch (Exception e) {
					log.error("查询未签出的计划列表异常，异常描述：{}", e);
					writer.print(ErrorCode.GET_LIST_INFO_ERROR);
					return;
				}
				if (null != planList && planList.size() > 0) {
					log.trace("存在未签出的拜访计划！");
					writer.print(ErrorCode.EXIST_UNSIGN_OUT_PLAN);
					return;
				}

				//首次签到，客户坐标刷入新值
				if (isFirstSign) {
					try {
						customer.set("location", signInLocaltion);
						//更新拜访次数
						if(customer instanceof Customer){
							String select = "select COUNT(*) as count from customer_visits t where t.customer_id = "+customerId;
							Integer count = dbHelper.selectOneValues(select);
							customer.set("visits_number", count);
						}
						customer.flash();
					} catch (Exception e) {
						log.error("首次签到发生异常：{}！", e);
					}
				} else {//判断两坐标的距离是否大于配置距离
					//获得配置最大的距离
					Integer maxDistance = Integer.parseInt(Config.getInstance().getProperty("maxDistance"));
					String[] firstSigns = firstSign.split(",");
					String[] signInLocaltions = signInLocaltion.split(",");
					Double longt_x = Double.parseDouble(firstSigns[0]);
					Double lat_x = Double.parseDouble(firstSigns[1]);
					Double longt_y = Double.parseDouble(signInLocaltions[0]);
					Double lat_y = Double.parseDouble(signInLocaltions[1]);
					Boolean overStep = GeoUtils.overStep(longt_x, lat_x, longt_y, lat_y, maxDistance);
					//如果超过了签到距离返回错误
					if (overStep) {
						log.trace("超出了可签到距离！");
						writer.print(ErrorCode.OUT_OF_SIGN_PLACE);
						return;
					}
				}
				visits = visitsFactory.getNewObject(employee);
				visits.set("customer_id", customerId);
				visits.set("visits_employee_id", employee.get("id"));
				visits.set("visits_time", new Date(System.currentTimeMillis()));
				visits.set("flag", 0);
				visits.set("plan_id", planId);//计划Id
				visits.set("sign_in_localtion", signInLocaltion);
				visits.set("sign_in_time", new Date(System.currentTimeMillis()));
				visits.flash();
				
			} else {//签出
				visits.set("sign_out_time", new Date(System.currentTimeMillis()));
				visits.set("flag", 1);
				visits.flash();
			}
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			//签到发生异常
			writer.print(ErrorCode.SIGN_ERROR);
		}
	}

}
