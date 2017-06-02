package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.tk.common.PermissionEnum;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.object.*;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.annotation.WebServlet;

import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * 拜访计划管理手机servlet
 * <p>
 *
 * @author huzh
 */
@WebServlet("/visitMobilePlan.do")
public class VisitPlanMobileServlet extends VisitPlanServlet {
	private static Logger log = LogManager.getLogger(VisitPlanMobileServlet.class.getName());
	// 获取到拜访计划工厂类
	private static VisitPlanFactory visitPlanFactory = VisitPlanFactory.getInstance();
	//客户工厂类
	private static AuditPlanNoteFactory auditPlanNoteFactory = AuditPlanNoteFactory.getInstance();
	//数据库查询工厂类
	private static DBHelper dbHelper = DBHelperFactory.getDBHelper();
	private Integer pageSize;
	private Integer pageNumber;

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.reset, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.update, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.delete, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.add, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.load, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.submit, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.query, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.addMarkContext, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.addLeaveContext, PermissionEnum.NOT_USE_PERMISSION);
	}

	@Override
	protected boolean handleChilder() {
		switch (controlType) {
			case reset:
				if (employee.hasPermission(handlePermission.get(ControlType.audit))) {
					resetPlanByMonth();
					return true;
				} else {
					return false;
				}
			case submit:
				if (employee.hasPermission(handlePermission.get(ControlType.submit))) {
					submitPlan();
					return true;
				} else {
					return false;
				}
			case addLeaveContext://添加请假内容
				addLeaveContext();
				return true;
			case addMarkContext://添加标记内容
				addMarkContext();
				return true;
			default:
				return false;
		}
	}
	
	/***
	 * 添加请假内容
	 */
	private void addLeaveContext(){
		log.trace("添加请假内容初始....");
		Integer planId;
		Integer leave_type;
		try {
			planId = dataJson.getInteger("planId");
			leave_type = dataJson.getInteger("leave_type");
		} catch (Exception e) {
			log.error("获取添加请假内容参数异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == planId) {
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			log.trace("添加请假内容参数失败！");
			return;
		}
		
		String leave_type_str = "";
		switch (leave_type) {
			case 1:
				leave_type_str = "年假";
				break;
			case 2:
				leave_type_str = "事假";
				break;
			case 3:
				leave_type_str = "病假";
				break;
			case 4:
				leave_type_str = "退休";
				break;
			case 5:
				leave_type_str = "南华大药房";
				break;
			default:
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
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
			visitPlan.set("isleave", 1);
			visitPlan.set("leave_type", leave_type_str);
			visitPlan.flash();
			log.trace("添加请假内容结束...");
			writer.print(new SuccessJSON("msg","请假成功！"));
		} catch (Exception e) {
			log.trace("添加请假内容发生异常:{}！", e);
			writer.print(ErrorCode.ADD_ERROR);
		}
	}
	
	/***
	 * 添加标记内容
	 */
	private void addMarkContext(){
		log.trace("添加标记内容初始....");
		Integer planId;
		Integer mark_type;
		try {
			planId = dataJson.getInteger("planId");
			mark_type = dataJson.getInteger("mark_type");
		} catch (Exception e) {
			log.error("获取添加标记内容参数异常:{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (null == planId || null == mark_type) {
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			log.trace("添加标记内容参数失败！");
			return;
		}
		
		String mark_type_str = "";
		switch (mark_type) {
			case 1:
				mark_type_str = "门店关门";
				break;
			case 2:
				mark_type_str = "门店搬迁";
				break;
			case 3:
				mark_type_str = "开会";
				break;
			default:
				writer.print(ErrorCode.REQUEST_PARA_ERROR);
				return;
		}
		
		VisitPlan visitPlan = visitPlanFactory.getObject("id", planId);
		if (null == visitPlan) {
			log.trace("拜访计划信息不存在！");
			writer.print(ErrorCode.OBJECT_NOT_EXIST);
			return;
		}
		//判断是否已审核，非已审核不能标记
		Integer flag = visitPlan.get("flag");
		if (1 != flag) {
			log.trace("非已审核，不能标记！");
			writer.print(ErrorCode.UN_AUDIT_NO_HANDLE);
			return;
		}
		
		Integer isleave = visitPlan.get("isleave");
		String leave_type = visitPlan.get("leave_type");
		//已经标记或已经请假不能操作
		if(isleave.intValue()==1 || StringUtils.isNotBlank(leave_type)){
			log.trace(ErrorCode.HAVE_MARK_NO_HANDLE);
			writer.print(ErrorCode.HAVE_MARK_NO_HANDLE);
			return;
		}
		
		//判断计划时间是否超过3天
		Date date = (Date)visitPlan.get("plan_in_time");
		Date currentDate = new Date();
		Double time = (currentDate.getTime()-date.getTime())/1000.00/60/60/24;
		if (time.doubleValue()>3.0) {
			log.trace("已超过标记时间,不能标记！");
			writer.print(ErrorCode.TIME_OUT_NO_HANDLE);
			return;
		}
		
		try {
			visitPlan.set("mark_type", mark_type_str);
			visitPlan.flash();
			log.trace("添加标记内容结束...");
			writer.print(new SuccessJSON("msg","标记成功！"));
		} catch (Exception e) {
			log.trace("添加标记内容发生异常:{}！", e);
			writer.print(ErrorCode.ADD_ERROR);
		}
	}
	

	/**
	 * 获得拜访计划列表
	 */
	@Override
	protected void query() {
		log.trace("手机端获取拜访计划列表初始...");
		//获取到用户Id
		Integer employeeId = employee.get("id");
		//计划的那天
		String planDay;
		//计划月份
		String planMonth;
		//客户名
		String customerName;
		try {
			planDay = dataJson.getString("planDay");
			planMonth = dataJson.getString("planMonth");
			customerName = dataJson.getString("customerName");
		} catch (Exception e) {
			log.error("获取查询列表参数异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		pageSize = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageSize")) ? "10" : dataJson.getString("pageSize"));
		pageNumber = Integer.parseInt(StringUtils.isEmpty(dataJson.getString("pageNumber")) ? "1" : dataJson.getString("pageNumber"));
		//计划月份
		if (StringUtils.isEmpty(planDay)) {
			log.trace("获取计划查询月份失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		StringBuilder sql = new StringBuilder();
		sql.append(" WHERE T.id  in ( ");
		sql.append(" SELECT t.id FROM customer_visits_plan t LEFT JOIN customer c ON c.id = t.custom_id ");
		sql.append(" WHERE T.employee_id =" + employeeId);
		//如果是查询按某天的计划
		sql.append(" and convert(char(10) ,T.plan_in_time , 120)= '" + planDay + "' ");
		if (StringUtils.isNotEmpty(customerName)) {
			sql.append(" and c.customer_name like " + dbHelper.getString("%" + customerName + "%"));
		}
		sql.append("  UNION ALL ");
		sql.append(" SELECT t.id FROM customer_visits_plan t LEFT JOIN chain_customer ch ON ch.id = t.custom_id ");
		sql.append(" WHERE T.employee_id =" + employeeId);
		//如果是查询按某天的计划
		sql.append(" and convert(char(10) ,T.plan_in_time , 120)= '" + planDay + "') ");
		if (StringUtils.isNotEmpty(customerName)) {
			sql.append(" and ch. like china_customer_name " + dbHelper.getString("%" + customerName + "%"));
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
			try {
				//判断当月是否有未提交或驳回的数据（否则可以清空数据和提交审批数据）
				sql.setLength(0);
				sql.append(" where (flag = 0 or flag = 2 ) ");
				sql.append(" and T.employee_id =" + employeeId);
				sql.append(" and convert(char(7) ,T.plan_in_time , 120)= '" + planMonth + "' ");
				List<VisitPlan> unSubmitList = visitPlanFactory.getObjectsForString(sql.toString(), employee);
				
				String auditNote = "";
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
					sql.append(" and month ='" + planMonth + "' order by create_time desc ");
					List<AuditPlanNote> noteList = auditPlanNoteFactory.getObjectsForString(sql.toString(), null);
					//获得审核意见
					if (noteList.size() > 0) {
						auditNote = noteList.get(0).get("opinion");
					}
				}
				if (unSubmitList.size() > 0) {
					success.put("canControl", "1");
				} else {
					success.put("canControl", "0");
				}
				success.put("auditNote", auditNote);
			} catch (Exception e) {
				success.put("canControl", "0");
			}
			success.put("list", dataArry);
			success.put("count", list == null ? 0 : list.size());
			log.trace("手机端获取拜访计划列表结束...");
			writer.print(success);
		} catch (Exception e) {
			log.error("手机端查询计划列表发生异常：{}！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}
}
