package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.SQLException;
import java.util.Date;


public class VisitPlanFactory extends AbstractPersistenceFactory<VisitPlan> {
	private static final Logger logger = LogManager.getLogger(VisitPlanFactory.class.getName());
	private static final VisitPlanFactory instance = new VisitPlanFactory();

	public static VisitPlanFactory getInstance() {
		return instance;
	}

	@Override
	protected VisitPlan createObject(User user) {
		return new VisitPlan(this);
	}

	private VisitPlanFactory() {
		this.tableName = "customer_visits_plan";
		this.sequenceField = addField("id", -1, Integer.class, null, true, true);
		this.sequenceField.setSerial("");

		addField("employee_id", 10, Integer.class, null, true, false);
		addField("custom_id", 10, Integer.class, null, true, false);
		addField("plan_in_time", 20, Date.class, null, true, false);
		addField("plan_out_time", 20, Date.class, null, false, false);
		addField("flag", 2, Integer.class, null, false, false);
		addField("plan_create_time", 20, Date.class, "getdate()", true, false);
		addField("isleave", 2, Integer.class, 0, false, false);
		addField("customer_type", 2, Integer.class, 0, false, false);
		addField("leave_type", 50, String.class, null, false, false);
		addField("leave_desc", 200, String.class, null, false, false);
		addField("mark_type", 2, String.class, null, false, false);
		addField("mark_desc", 2, String.class, null, false, false);

		setWhetherAddToList(false);
		init();

	}

	/**
	 * 确定此店铺是否属于正常拜访范围.
	 *
	 * @param employeeId 操作员Id
	 * @param customId   客户的id
	 * @param year       年
	 * @param month      月
	 * @return true：正常拜访，false：代表已经请假，非正常。
	 */
	public boolean isNormal(int employeeId, int customId, int year, int month) {
		String sql = String.format("select isleave from customer_visits_plan WHERE custom_id = %d and employee_id = %d and " +
										" plan_in_time between '%d-%02d-01 00:00:00' and '%d-%02d-01 00:00:00'",
						customId, employeeId, year, month, year, month + 1);
		Integer result = null;
		try {
			result = dbHelper.selectOneValues(sql);
		} catch (SQLException e) {
			logger.error("执行语句出错，sql:" + sql, e);
		}
		assert result != null;
		return result == 1;
	}

}
