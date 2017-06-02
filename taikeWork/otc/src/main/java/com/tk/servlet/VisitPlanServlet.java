package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.DateUtil;
import com.tk.common.util.PageUtil;
import com.tk.object.*;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * 拜访计划管理servlet
 * <p>
 *
 * @author huzh
 */
@WebServlet("/visitPlan.do")
public class VisitPlanServlet extends BaseServlet {
	private static Logger log = LogManager.getLogger(VisitPlanServlet.class.getName());
	// 获取到拜访计划工厂类
	private static VisitPlanFactory visitPlanFactory = VisitPlanFactory.getInstance();
	// 获取到拜访记录工厂类
	private static VisitsFactory visitsFactory = VisitsFactory.getInstance();
	//客户工厂类
	private static CustomerFactory customerFactory = CustomerFactory.getInstance();
	//商业客户工厂类
	private static ChainCustomerFactory chainCustomerFactory = ChainCustomerFactory.getInstance();
	//客户工厂类
	private static AuditPlanNoteFactory auditPlanNoteFactory = AuditPlanNoteFactory.getInstance();
	//数据库查询工厂类
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();
	private Integer pageSize;
	private Integer pageNumber;

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.audit, PermissionEnum.PLAN_AUDIT);
		handlePermission.put(ControlType.reset, PermissionEnum.VISIT_PLAN_RESERT);
		handlePermission.put(ControlType.auditList, PermissionEnum.PLAN_AUDIT_QUERY);
		handlePermission.put(ControlType.update, PermissionEnum.VISIT_PLAN_UPDATE);
		handlePermission.put(ControlType.delete, PermissionEnum.VISIT_PLAN_DELETE);
		handlePermission.put(ControlType.add, PermissionEnum.VISIT_PLAN_ADD);
		handlePermission.put(ControlType.load, PermissionEnum.VISIT_PLAN_QUERY);
		handlePermission.put(ControlType.updateLeave, PermissionEnum.PLAN_AUDIT_MODIFY);
		handlePermission.put(ControlType.submit, PermissionEnum.VISIT_PLAN_SUBMIT);
		handlePermission.put(ControlType.query, PermissionEnum.VISIT_PLAN_QUERY);
		handlePermission.put(ControlType.queryAll, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.fileImport, PermissionEnum.VISIT_PLAN_IMPORT);
		handlePermission.put(ControlType.fileExport, PermissionEnum.VISIT_PLAN__EXPORT);
		handlePermission.put(ControlType.queryMyPlan, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.isShowVisitPlanAuditMenu, PermissionEnum.NOT_USE_PERMISSION);
	}

	@Override
	protected boolean handleChilder() {
		switch (controlType) {
			case audit:
				if (employee.hasPermission(handlePermission.get(ControlType.audit))) {
					audit();
					return true;
				} else {
					return false;
				}
			case reset:
				if (employee.hasPermission(handlePermission.get(ControlType.audit))) {
					resetPlanByMonth();
					return true;
				} else {
					return false;
				}
			case auditList:
				if (employee.hasPermission(handlePermission.get(ControlType.auditList))) {
					auditList();
					return true;
				} else {
					writer.println(ErrorCode.USER_NOT_HAS_PERMISSION);
					return true;
				}
			case submit:
				if (employee.hasPermission(handlePermission.get(ControlType.submit))) {
					submitPlan();
					return true;
				} else {
					return false;
				}
			case updateLeave:
				if (employee.hasPermission(handlePermission.get(ControlType.updateLeave))) {
					updateIsleave();
					return true;
				} else {
					return false;
				}
			case queryMyPlan:
				queryMyPlan();
				return true;
			case isShowVisitPlanAuditMenu:
				isShowVisitPlanAuditMenu();
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
		log.trace("删除拜访计划初始...");
		Integer planId;
		try {
			//计划Id
			planId = dataJson.getInteger("planId");
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
		VisitPlan visitPlan = visitPlanFactory.getObject("id", planId);
		if (null == visitPlan) {
			log.trace("拜访计划不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		//判断是否为 未提交或已驳回
		Integer flag = visitPlan.get("flag");
		if (0 != flag && 2 != flag) {
			log.trace("非未提交或已驳回的数据不能删除！");
			writer.print(ErrorCode.UN_REJECT_NO_HANDLE);
			return;
		}
		visitPlan.delete();
		log.trace("删除拜访计划结束...");
		writer.print(new SuccessJSON());
	}


	/**
	 * 清空数据（按月份，清空未提交、已驳回）
	 */
	protected void resetPlanByMonth() {
		log.trace("按月清空拜访计划初始...");
		//获取到用户Id
		Integer employeeId;
		//计划月份
		String planMonth;
		try {
			//获取到用户Id
			employeeId = employee.get("id");
			//计划月份
			planMonth = dataJson.getString("planDay");
		} catch (Exception e) {
			log.error("获取计划月份或计划Id发生异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (StringUtils.isEmpty(planMonth) || null == employeeId) {
			log.trace("获取计划月份或计划Id失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		String sql = "delete from customer_visits_plan where (flag =0 or flag =2) and employee_id =" + employeeId + " and convert(char(7) , plan_in_time , 120)= '" + planMonth + "'";
		try {
			dbHelper.update(sql);
			log.trace("按月清空拜访计划结束...");
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.trace("按月清空拜访计划发生异常:{}！", e);
			writer.print(ErrorCode.DELETE_ERROR);
		}
	}

	@Override
	protected void update() {
		log.trace("修改拜访计划初始....");
		Integer planId;
//		Integer customId;
		//计划日期
		String planDate;
		//计划时段（AM：上午，PM：下午）
		String planTime;
		try {
			//计划Id
			planId = dataJson.getInteger("planId");
			//客户Id
//			customId = dataJson.getInteger("custom_id");
			//计划日期
			planDate = dataJson.getString("planDate");
			//计划时段（AM：上午，PM：下午）
			planTime = dataJson.getString("planTime");
		} catch (Exception e) {
			log.error("获取修改拜访计划参数异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == planId || StringUtils.isEmpty(planDate) || StringUtils.isEmpty(planTime)) {
			log.trace("获取修改拜访计划参数失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//创建新的拜访计划
		VisitPlan plan = visitPlanFactory.getObject("id", planId);
		if (null == plan) {
			log.trace("拜访计划信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		//判断是否为驳回和未提交，否则不能修改
		Integer flag = plan.get("flag");
		if (2 != flag && 0 != flag) {
			log.trace("非驳回和未提交的计划不能修改！");
			writer.print(ErrorCode.UN_REJECT_NO_HANDLE);
			return;
		}
		try {
			if ("AM".equals(planTime)) {
				plan.set("plan_in_time", DateUtil.stringToDate(planDate + " 09:00:00.000"));
			} else if ("PM".equals(planTime)) {
				plan.set("plan_in_time", DateUtil.stringToDate(planDate + " 15:00:00.000"));
			}
			plan.set("plan_create_time", new Date());
			plan.set("isleave", 0);
			plan.flash();
			log.trace("修改拜访计划结束....");
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.trace("修改拜访计划发生异常:{}！", e);
			writer.print(ErrorCode.ADD_ERROR);
		}
	}

	/**
	 * 修改请假状态
	 */
	public void updateIsleave() {
		log.trace("修改请假状态初始....");
		Integer planId;
		Integer isleave;
		try {
			planId = dataJson.getInteger("planId");
			isleave = dataJson.getInteger("isleave");
		} catch (Exception e) {
			log.error("获取修改计划参数异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == planId || null == isleave) {
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			log.trace("获取修改计划参数失败！");
			return;
		}
		VisitPlan visitPlan = visitPlanFactory.getObject("id", planId);
		if (null == visitPlan) {
			log.trace("拜访计划信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		//判断是否已审核，非已审核不能请假
		Integer flag = visitPlan.get("flag");
		if (1 != flag) {
			log.trace("非已审核，不能请假！");
			writer.print(ErrorCode.UN_AUDIT_NO_HANDLE);
			return;
		}
		try {
			visitPlan.set("isleave", isleave);
			visitPlan.flash();
			log.trace("修改请假状态结束...");
			writer.print(new SuccessJSON());
		} catch (Exception e) {
			log.trace("修改请假状态发生异常:{}！", e);
			writer.print(ErrorCode.UPDATE_ERROR);
		}
	}

	/**
	 * 审核拜访计划
	 */
	protected void audit() {
		log.trace("审核拜访计划初始...");
		//获取到用户Id
		Integer employeeId;
		//计划时间
		String startTime;
		String endTime;
		//计划月份
		String planMonth;
		//审核
		Integer flag;
		//驳回意见
		String opinion;

		try {
			//审核开始时间，审核结束时间
			startTime = dataJson.getString("startTime");
			endTime = dataJson.getString("endTime");
			//获取到用户Id
			employeeId = dataJson.getInteger("employee_id");
			//计划月份
			planMonth = dataJson.getString("planDay");
			//审核
			flag = dataJson.getInteger("flag");
			//获得审核意见
			opinion = dataJson.getString("opinion");
		} catch (Exception e) {
			log.error("获取审核数据异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == employeeId || null == flag) {
			log.trace("获取审核数据失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//计划月份为空，默认当前月
		if (StringUtils.isEmpty(planMonth)) {
			planMonth = DateUtil.getTime("yyyy-MM");
		}
		//如果是驳回未填写驳回意见的
		if (2 == flag) {
			if (StringUtils.isEmpty(opinion)) {
				log.trace("审核失败，驳回未填写驳回意见！");
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}
		}
		//判断有无已提交或已修改的的数据
		List<VisitPlan> planList;
		StringBuffer sqlStr = new StringBuffer();
		sqlStr.append("  where (flag = 3 or flag =4) ");
		//未选择时间，默认审核当前月份
		if (StringUtils.isEmpty(startTime) && StringUtils.isEmpty(endTime)) {
			sqlStr.append(" and convert(char(7) , plan_in_time , 120)= '" + planMonth + "'");
		}
		if (StringUtils.isNotEmpty(startTime)) {
			sqlStr.append(" and convert(char(10) , plan_in_time , 120) >= '" + startTime + "'");
		}
		if (StringUtils.isNotEmpty(endTime)) {
			sqlStr.append(" and convert(char(10) , plan_in_time , 120) <= '" + endTime + "'");
		}
		sqlStr.append(" and employee_id = " + employeeId);
		try {
			planList = visitPlanFactory.getObjectsForString(sqlStr.toString(), employee);
		} catch (Exception e) {
			log.error("查询已提交的拜访计划数据异常:{}！", e);
			return;
		}
		if (null == planList || planList.size() <= 0) {
			SuccessJSON success = new SuccessJSON();
			success.put("count", 0);
			log.trace("审核拜访计划结束...");
			writer.print(success);
			return;
		}
		try {
			//审核已提交的数据
			String sql = "UPDATE CUSTOMER_VISITS_PLAN SET flag=" + flag + sqlStr.toString();
			dbHelper.update(sql);
			//判断是否为已修改
			if (flag == 2) {
				String note = " where employee_id= " + employeeId + " and month= '" + planMonth + "'";
				//添加计划审核意见
				AuditPlanNote auditPlanNote;
				List<AuditPlanNote> noteList;
				try {
					noteList = auditPlanNoteFactory.getObjectsForString(note, null);
					if (null == noteList || noteList.size() == 0) {
						auditPlanNote = auditPlanNoteFactory.getNewObject(null);
						auditPlanNote.set("employee_id", employeeId);
						auditPlanNote.set("month", planMonth);
						auditPlanNote.set("audit_user", employee.get("id"));
						auditPlanNote.set("opinion", opinion);
					} else {
						auditPlanNote = noteList.get(0);
						auditPlanNote.set("audit_user", employee.get("id"));
						auditPlanNote.set("update_time", new Date());
						auditPlanNote.set("opinion", opinion);
					}

					auditPlanNote.flash();
				} catch (Exception e) {
					log.error("添加计划审核意见异常！");
				}
			}
			log.trace("审核拜访计划结束...");
			writer.print(new SuccessJSON());
		} catch (SQLException e) {
			log.error("审核拜访计划发生异常:{}！", e);
			writer.print(ErrorCode.AUDIR_ERROR);
		}
	}

	/**
	 * 获得我的计划列表
	 */
	public void queryMyPlan() {
		log.trace("手机端按天获取计划列表初始...");
		//获取到用户Id
		Integer employeeId;
		//计划号
		String planDay;
		try {
			employeeId = employee.get("id");
			planDay = dataJson.getString("planDay");
		} catch (Exception e) {
			log.error("获取查询计划列表参数异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
//		pageSize = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
		pageSize = 999;
		pageNumber = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));
		if (StringUtils.isEmpty(planDay)) {
			log.trace("获取计划日期失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		StringBuilder sql = new StringBuilder();
		sql.append("  WHERE t.employee_id =" + employeeId);
		//查询我的计划（已审核）
		sql.append(" and t.flag = 1 ");
		//如果是查询按某天的计划
		sql.append(" and convert(char(10) ,t.plan_in_time , 120)= '" + planDay + "' ");
		sql.append(" ORDER BY t.plan_in_time DESC ");
		List<VisitPlan> list = null;
		JSONArray dataArry = null;
		try {
			list = visitPlanFactory.getObjectsForString(sql.toString(), employee);
			dataArry = getPlanList(list, pageNumber, pageSize);
			if (null == dataArry) {
				dataArry = new JSONArray();
			}
			SuccessJSON success = new SuccessJSON();
			success.put("list", dataArry);
			success.put("count", list == null ? 0 : list.size());
			log.trace("手机端按天获取计划列表结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("按天获取拜访计划列表异常：{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
			return;
		}
	}

	/**
	 * 获得拜访审核列表
	 */
	protected void auditList() {
		log.trace("获取拜访计划审核列表初始...");
		//获取到用户Id
		Integer employeeId;
		//计划时间
		String startTime;
		String endTime;

		//审核状态
		Integer flag;
		try {
			employeeId = dataJson.getInteger("employee_id");
			startTime = dataJson.getString("startTime");
			endTime = dataJson.getString("endTime");
			flag = dataJson.getInteger("flag");
		} catch (Exception e) {
			log.error("获取查询审核列表参数异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		pageSize = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
		pageNumber = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));
		StringBuilder sql = new StringBuilder();
		sql.append(" WHERE  T.employee_id =" + employeeId);
		//如果审核开始时间跟结束时间未传，默认查询当月
		if (StringUtils.isEmpty(startTime) && StringUtils.isEmpty(endTime)) {
			sql.append(" and convert(char(7) ,T.plan_in_time , 120)= '" + DateUtil.getTime("yyyy-MM") + "' ");
		}
		if (StringUtils.isNotEmpty(startTime)) {
			sql.append(" and convert(char(10) ,T.plan_in_time , 120) >= '" + startTime + "'");
		}
		if (StringUtils.isNotEmpty(endTime)) {
			sql.append(" and convert(char(10) ,T.plan_in_time , 120) <= '" + endTime + "'");
		}
		if (flag == null || flag == 3) {
			sql.append(" and (flag = 3 or flag = 4) ");
		} else {
			sql.append(" and flag = " + flag);
		}
		sql.append(" ORDER BY T.plan_in_time DESC ");
		List<VisitPlan> list;
		JSONArray dataArry;
		try {
			list = visitPlanFactory.getObjectsForString(sql.toString(), employee);
			dataArry = getPlanList(list, pageNumber, pageSize);
			if (null == dataArry) {
				dataArry = new JSONArray();
			}
			SuccessJSON success = new SuccessJSON();
			success.put("list", dataArry);
			success.put("count", list == null ? 0 : list.size());
			log.trace("获取拜访计划审核列表结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("获取拜访计划审核列表发生异常：{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
			return;
		}
	}

	/**
	 * 获得拜访计划列表
	 */
	@Override
	protected void query() {
		log.trace("获取拜访计划列表初始...");
		//获取到用户Id
		Integer employeeId = employee.get("id");
		//计划的那天
		String planDay;
		String customerName;
		try {
			planDay = dataJson.getString("planDay");
			customerName = dataJson.getString("customerName");
		} catch (Exception e) {
			log.error("获取拜访计划查询参数异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		pageSize = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
		pageNumber = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));
		//计划月份
		if (StringUtils.isEmpty(planDay)) {
			log.trace("获取计划月份失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" WHERE T.id  in ( ");
		sql.append(" SELECT t.id FROM customer_visits_plan t LEFT JOIN customer c ON c.id = t.custom_id ");
		sql.append(" WHERE T.employee_id =" + employeeId);
		//如果是查询按某天的计划
		sql.append(" and convert(char(7) ,T.plan_in_time , 120)= '" + planDay + "' ");
		if (StringUtils.isNotEmpty(customerName)) {
			sql.append(" and c.customer_name like " + dbHelper.getString("%" + customerName + "%"));
		}
		sql.append("  UNION ALL ");
		sql.append(" SELECT t.id FROM customer_visits_plan t LEFT JOIN chain_customer ch ON ch.id = t.custom_id ");
		sql.append(" WHERE T.employee_id =" + employeeId);
		//如果是查询按某天的计划
		sql.append(" and convert(char(7) ,T.plan_in_time , 120)= '" + planDay + "' ");
		if (StringUtils.isNotEmpty(customerName)) {
			sql.append(" and ch.china_customer_name like " + dbHelper.getString("%" + customerName + "%"));
		}
		sql.append(") ORDER BY T.plan_in_time DESC ");
		List<VisitPlan> list;
		JSONArray dataArry;
		try {
			list = visitPlanFactory.getObjectsForString(sql.toString(), employee);
			dataArry = getPlanList(list, pageNumber, pageSize);
			if (null == dataArry) {
				dataArry = new JSONArray();
			}
			SuccessJSON success = new SuccessJSON();
			String auditNote = null;
			try {
				//判断是否有未提交或驳回的数据（否则可以清空数据和提交审批数据）
				sql.setLength(0);
				sql.append(" where (flag = 0 or flag = 2 ) ");
				sql.append(" and T.employee_id =" + employeeId);
				sql.append(" and convert(char(7) ,T.plan_in_time , 120)= '" + planDay + "' ");
				List<VisitPlan> unSubmitList = visitPlanFactory.getObjectsForString(sql.toString(), employee);
				if (unSubmitList.size() > 0) {
					success.put("canControl", "1");
				} else {
					success.put("canControl", "0");
				}
				int res = 0;
				//判断有无驳回的数据，有的话，在列表显示审核警告
				for (VisitPlan plan : unSubmitList) {
					Integer flag = plan.get("flag");
					if (2 != flag) {
						continue;
					} else {
						res++;
						break;
					}
				}
				if (res > 0) {
					sql.setLength(0);
					sql.append(" WHERE employee_id= " + employeeId);
					sql.append(" and month ='" + planDay + "' order by create_time desc ");
					List<AuditPlanNote> noteList = auditPlanNoteFactory.getObjectsForString(sql.toString(), null);
					//获得审核意见
					if (noteList.size() > 0) {
						auditNote = noteList.get(0).get("opinion");
					}
				}
			} catch (Exception e) {
				success.put("canControl", "0");
			}
			success.put("list", dataArry);
			success.put("auditNote", auditNote);
			success.put("count", list == null ? 0 : list.size());
			log.trace("获取拜访计划列表结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("查询拜访计划列表发生异常：{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
			return;
		}
	}

	/**
	 * 获得查询语句
	 *
	 * @param employeeId
	 * @param planDay
	 * @param customerName
	 * @return
	 */
	protected String getSearchPlanSql(Integer employeeId, String planDay, String customerName) {
		return null;
	}

	/**
	 * 获得计划
	 *
	 * @return
	 */
	protected JSONArray getPlanList(List<VisitPlan> list, int currentPage, int showRow) {
		if (list == null || list.size() <= 0) {
			return null;
		}
		JSONArray dataArry = new JSONArray();
		List<VisitPlan> subList = PageUtil.getPageList(currentPage, showRow, list);
		for (VisitPlan plan : subList) {
			JSONObject object = new JSONObject();
			//客户类型
			Integer customType = plan.get("customer_type");
			Store customer = null;
			if (1 == customType) {
				customer = customerFactory.getObject("id", plan.get("custom_id"));
				object.put("coustom", customer == null ? "" : customer.get("customer_name"));
			} else if (2 == customType) {
				customer = chainCustomerFactory.getObject("id", plan.get("custom_id"));
				object.put("coustom", customer == null ? "" : customer.get("china_customer_name"));
			}
			object.put("address", customer == null ? "" : customer.get("address"));
			//获得拜访记录
			Visits visit = visitsFactory.getObject("plan_id", plan.get("id"));
			//截取到天
			Date planTime = plan.get("plan_in_time");
			String time = (String) DateUtil.formatDate(planTime, "yyyy-MM-dd HH:mm");

			String day = StringUtils.isEmpty(time) ? "" : time.substring(8, 11);
			String hours = StringUtils.isEmpty(time) ? "" : time.substring(11, 13);
			//计划状态
			Integer flag = plan.get("flag");
			Integer isleave = plan.get("isleave");
			if (null != flag) {
				switch (flag) {
					case 0:
						object.put("statusShow", "未提交");
						break;
					case 1:
						object.put("statusShow", "通过");
						break;
					case 2:
						object.put("statusShow", "驳回");
						break;
					case 3:
						object.put("statusShow", "已提交");
						break;
					case 4:
						object.put("statusShow", "已修改");
						break;
				}
			}
			object.put("id", plan.get("id"));
			//判断是否已经拜访完（是否已签入，签出）
			object.put("flag", visit == null ? "0" : visit.get("flag"));
			//计划状态
			object.put("planStatus", flag);
			object.put("isleave", isleave);
			//客户类型（1：门店客户，2：商业客户）
			object.put("customer_type", plan.get("customer_type"));
			object.put("custom_id", plan.get("custom_id"));
			object.put("time", StringUtils.isEmpty(time) ? "" : time.substring(0, 11));
			object.put("day", day);
			object.put("hours", StringUtils.isEmpty(hours) ? "" : (Integer.parseInt(hours) > 12 ? "下午" : "上午"));
			String leave_type = plan.get("leave_type");
			if(StringUtils.isNotBlank(leave_type)){
				object.put("leaveShow", leave_type);
			}else{
				object.put("leaveShow", 0 == isleave ? "正常" : "请假");
			}
			object.put("mark_type", plan.get("mark_type")==null?"正常":plan.get("mark_type"));
			dataArry.add(object);
		}
		return dataArry;
	}

	/**
	 * 查看拜访计划
	 */
	@Override
	protected void load() {
		log.trace("查询拜访计划信息初始...");
		Integer planId;
		try {
			planId = dataJson.getInteger("planId");
		} catch (Exception e) {
			log.error("获取计划Id发生异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == planId) {
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			log.trace("获取计划Id失败！");
			return;
		}
		VisitPlan plan = visitPlanFactory.getObject("id", planId);
		if (null == plan) {
			log.trace("拜访信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		JSONObject object = new JSONObject();
		//截取到天
		Date planTime = plan.get("plan_in_time");
		String time = (String) DateUtil.formatDate(planTime, "yyyy-MM-dd HH:mm");
		String hours = StringUtils.isEmpty(time) ? "" : time.substring(11, 13);
		try {
			object.put("id", plan.get("id"));
			object.put("custom_id", plan.get("custom_id"));
			object.put("time", StringUtils.isEmpty(time) ? "" : time.substring(0, 11));
			object.put("hours", StringUtils.isEmpty(hours) ? "" : (Integer.parseInt(hours) > 12 ? "PM" : "AM"));
			SuccessJSON success = new SuccessJSON();
			success.put("info", object);
			log.trace("查询拜访计划信息结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("查询拜访计划信息发生异常:{}！", e);
			writer.print(ErrorCode.LOAD_ERROR);
		}
	}

	@Override
	protected void add() {
		log.trace("新增拜访计划初始...");
		Integer employeeId = employee.getId();
		String customerAndTypeStr;
		//计划日期
		String planDate;
		//计划月份
//		String planMonth;
		//计划时段（AM：上午，PM：下午）
		String planTime;
		try {
			//多计划新增（包括Id和type,格式为[id1:type1,id2:type2]）
			customerAndTypeStr = dataJson.getString("customerAndTypeStr");
			//计划月份
//			planMonth = dataJson.getString("planDay");
			//计划日期
			planDate = dataJson.getString("planDate");
			//计划时段（AM：上午，PM：下午）
			planTime = dataJson.getString("planTime");
		} catch (Exception e) {
			log.error("获取新增拜访计划参数异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (StringUtils.isEmpty(customerAndTypeStr) || StringUtils.isEmpty(planDate) || StringUtils.isEmpty(planTime)) {
			log.trace("获取新增拜访计划参数失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//拜访时间
		Date planInTime = new Date();
		if ("AM".equals(planTime)) {
			planInTime = DateUtil.stringToDate(planDate + " 09:00:00.000");
		} else if ("PM".equals(planTime)) {
			planInTime = DateUtil.stringToDate(planDate + " 15:00:00.000");
		}
		//切割计划列表
		String[] customArr = customerAndTypeStr.split(",");
		//创建新的拜访计划
		VisitPlan plan;
		//循环新增计划
		for (String custom : customArr) {
			try {
				Integer customId = Integer.parseInt(custom.split(":")[0]);
				Integer customType = Integer.parseInt(custom.split(":")[1]);
				plan = visitPlanFactory.getNewObject(employee);
				plan.set("employee_id", employeeId);
				plan.set("custom_id", customId);
				//拜访时间
				plan.set("plan_in_time", planInTime);
				plan.set("flag", 0);
				plan.set("isleave", 0);
				//客户类型
				plan.set("customer_type", customType);
				plan.set("plan_create_time", new Date());
				plan.flash();
			} catch (Exception e) {
				continue;
			}
		}
		log.trace("新增拜访计划结束...");
		writer.print(new SuccessJSON());
	}

	/**
	 * 提交拜访计划
	 */
	protected void submitPlan() {
		log.trace("提交拜访计划初始...");
		//获取到用户Id
		Integer employeeId = employee.get("id");
		//计划月份
		String planMonth;
		//修改前状态
		Integer flag;
		//修改前状态
		Integer newFlag = 3;
		try {
			//计划月份
			planMonth = dataJson.getString("planDay");
		} catch (Exception e) {
			log.error("获取拜访提交月份发生异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (StringUtils.isEmpty(planMonth)) {
			log.trace("获取拜访计划提交月份失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//判断有无未提交或驳回的数据
		List<VisitPlan> planList = null;
		try {
			planList = visitPlanFactory.getObjectsForString(" where (flag = 0 or flag = 2) and convert(char(7) , plan_in_time , 120)= '" + planMonth + "' and employee_id =" + employeeId, employee);
		} catch (Exception e) {
			log.error("查询未提交的拜访计划数据异常:{}", e);
		}
		if (null == planList || planList.size() <= 0) {
			SuccessJSON success = new SuccessJSON();
			success.put("count", 0);
			log.trace("提交拜访计划结束...");
			writer.print(success);
			return;
		}
		List<String> sqlList = new ArrayList<>();
		//循环需要提交的计划（未提交，已驳回）
		for (int i = 0; i < planList.size(); i++) {
			Integer planId = planList.get(i).get("id");
			//判断提交前是何种状态
			flag = planList.get(i).get("flag");
			if (2 == flag) {
				//如果是驳回再提交，则状态为已修改
				newFlag = 4;
			} else if (0 == flag) {
				//否则为已提交
				newFlag = 3;
			}
			String sql = " UPDATE CUSTOMER_VISITS_PLAN SET FLAG = " + newFlag + " WHERE id= " + planId;
			sqlList.add(sql);
		}
		try {
			//提交当前用户所选月份的所有状态为未提交的计划
			String[] sqlArr = sqlList.toArray(new String[sqlList.size()]);
			dbHelper.execBatchSql(sqlArr);
			log.trace("提交拜访计划结束...");
			writer.print(new SuccessJSON());
		} catch (SQLException e) {
			log.error("提交拜访计划发生异常！");
			writer.print(ErrorCode.UPDATE_ERROR);
		}
	}


	/**
	 * 导入拜访计划数据
	 *
	 * @param request
	 */
	@Override
	protected void fileImport(HttpServletRequest request) {
		log.trace("开始导入拜访计划...");
		try {
			boolean ifag = false;
			String dataFormt = "yyyy-MM";
			//拜访人
			Integer employee_id = employee.getId();
			String planMonth = dataJson.getString("planMonth");

			if (StringUtils.isBlank(planMonth)) {
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}
			Collection<Map> importExcel = getImportDataMap(request);

			if (importExcel == null) {
				return;
			}

			//判断当前月份是已经提交或审核通过计划或已修改
			String sql = " where (t.flag = 1 or t.flag =3 or t.flag =4 )  and convert(char(7) , plan_in_time , 120)= '" + planMonth + "' and employee_id = " + employee_id;
			List<VisitPlan> planList = null;
			try {
				planList = visitPlanFactory.getObjectsForString(sql, employee);
				if (null != planList && planList.size() > 0) {
					writer.print(ErrorCode.IMPORT_FILE_ERRROR.setMessage("已存在审核通过计划，不能再次导入！"));
					return;
				}
			} catch (Exception e) {
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}

			String customer_Id_tilte = "拜访客户ID";
			String plan_in_time_tilte = "计划拜访时间";

			SimpleDateFormat sdf = new SimpleDateFormat("yyyy年MM月dd日hh时");
			String formatErrorMsg = "格式应该为yyyy年MM月dd日hh时的格式,示例：2016年10月13日18时";
			for (Map map : importExcel) {
				String customer_Id = (String) map.get(customer_Id_tilte);
				String plan_in_time = (String) map.get(plan_in_time_tilte);

				if (customer_Id == null) {
					if (!vaditeImportNullDate(customer_Id_tilte, map)) {
						return;
					}
					writer.print(ErrorCode.IMPORT_FILE_FAIL);
					return;
				} else {
					//数据类型校验
					Integer id = null;
					try {
						id = Integer.valueOf(customer_Id);
					} catch (NumberFormatException e) {
						getImportErrorMsg(1, customer_Id_tilte, customer_Id, map, null);
						return;
					}

					Customer customer = customerFactory.getObject("id", id);
					if (customer == null) {
						getImportErrorMsg(4, customer_Id_tilte, customer_Id, map, null);
						return;
					}
				}

				if (StringUtils.isBlank(plan_in_time)) {
					if (!vaditeImportNullDate(plan_in_time_tilte, map)) {
						return;
					}
					return;
				} else {
					try {
						Date date = sdf.parse(plan_in_time);
						String formatDate = (String) DateUtil.formatDate(date, dataFormt);
						if (!StringUtils.equals(formatDate, planMonth)) {
							writer.print(ErrorCode.IMPORT_FILE_ERRROR.setMessage("计划月份必须为" + planMonth));
							return;
						}
					} catch (ParseException e) {
						getImportErrorMsg(0, plan_in_time_tilte, plan_in_time, map, formatErrorMsg);
						return;
					}


				}
			}


			for (Map map : importExcel) {
				VisitPlan plan = visitPlanFactory.getNewObject(employee);
				String customer_Id = map.get(customer_Id_tilte).toString();
				String plan_in_time = map.get(plan_in_time_tilte).toString();
				Date plan_in_time_date = sdf.parse(plan_in_time);


				//设置访问人
				plan.set("employee_id", employee_id);
				plan.set("custom_id", customer_Id);
				plan.set("plan_in_time", plan_in_time_date);
				plan.set("flag", 0);
				plan.set("plan_create_time", new Date());
				plan.set("isleave", 0);

				ifag = plan.flash();
			}

			if (ifag) {
				writer.print(new SuccessJSON("msg", "导入列表数据成功！"));
			} else if (importExcel.size() == 0) {
				writer.print(ErrorCode.IMPORT_FILE_ERRROR.setMessage("请在模板中填写内容！"));
			} else {
				writer.print(ErrorCode.IMPORT_FILE_FAIL);
			}
			log.trace("导入拜访计划结束...");
		} catch (Exception e) {
			log.error("文件导入失败", e);
			writer.print(ErrorCode.IMPORT_FILE_FAIL);
		}

	}
	
	/***
	 * 微信端判断是否有工作计划菜单权限
	 */
	private void isShowVisitPlanAuditMenu(){
		try{
			String ifag = "true";
			if (!employee.hasPermission(handlePermission.get(ControlType.audit))) {
				ifag = "false";
			}
			writer.println(new SuccessJSON("isShowMenu",ifag));
		}catch(Exception e){
			log.error("出现异常", e);
		}
	}

	@Override
	protected void fileUpload(HttpServletRequest request, HttpServletResponse response) {
		log.trace("开始导出拜访计划...");
		try {
			//获取到用户Id
			Integer employeeId = dataJson.getInteger("employee_id");

			//计划年月
			String planDay = dataJson.getString("planDay");

			//判断是否需要已审核
			if (StringUtils.isEmpty(planDay)) {
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}

			if (null == employeeId) {
				employeeId = employee.get("id");
			}


			StringBuilder sql = new StringBuilder();
			sql.append(" WHERE T.employee_id =" + employeeId);
			//如果是查询按某天的计划
			sql.append(" and flag = 3 and convert(char(7) ,T.plan_in_time , 120)= '" + planDay + "' ");
			sql.append(" ORDER BY T.plan_in_time DESC ");

			List<VisitPlan> list = visitPlanFactory.getObjectsForString(sql.toString(), employee);
			List<Map<String, Object>> dataMap = new ArrayList<Map<String, Object>>();
			for (VisitPlan plan : list) {

				Map<String, Object> map = new LinkedHashMap<String, Object>();
				Customer customer = customerFactory.getObject("id", plan.get("custom_id"));
				//截取到天
				Date planTime = plan.get("plan_in_time");
				String day = (String) DateUtil.formatDate(planTime, "yyyy-MM-dd HH:mm");
				if (StringUtils.isNotBlank(day)) {
					day = day.replace(" ", ",");
					String[] split = day.split(",");
					if (split.length > 1) {
						String date = split[0];
						String time = split[1];
						if (StringUtils.isNotBlank(time)) {
							String[] house = time.split(":");
							if (house.length > 1) {
								map.put("时段", Integer.valueOf(house[0]).intValue() < 12 ? "上午" : "下午");
							}
						}
						map.put("拜访日期", StringUtils.isEmpty(date) ? "" : date);

					}
				}

				if (!map.containsKey("时段")) {
					map.put("时段", "");
				}

				if (!map.containsKey("拜访日期")) {
					map.put("拜访日期", "");
				}

				map.put("客户编号", plan.get("custom_id"));
				map.put("单位名称", customer.get("customer_name"));
				map.put("地址", customer.get("address"));


				dataMap.add(map);
			}


			if (dataMap.size() > 0) {
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

}
