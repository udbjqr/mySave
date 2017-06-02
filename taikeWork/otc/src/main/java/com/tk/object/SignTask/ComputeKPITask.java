package com.tk.object.SignTask;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

import com.tk.common.util.BigDecimalArithUtils;
import com.tk.common.util.DateUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import com.tk.common.persistence.WriteValueException;
import com.tk.common.util.scheduler.FixedTimeStartTask;
import com.tk.object.Employee;
import com.tk.object.EmployeeFactory;
import com.tk.object.KPI.KPIComputeChainCustomer;
import com.tk.object.KPI.KPIComputeCustomer;
import com.tk.object.KPI.KPIScoreRecord;
import com.tk.object.KPI.KPIScoreRecordFactory;

/***
 * 定时计算KPI每月1号00:00执行）
 * @author Administrator
 *
 */
public class ComputeKPITask extends FixedTimeStartTask {

	private static Logger log = LogManager.getLogger(ComputeKPITask.class.getName());

	@Override
	public void execute() {
		log.trace("开始计算KPI任务...");
		StringBuilder sql = new StringBuilder(" where employee_type = 1 and flag = 1 ");
		List<Employee> list;
		try {
			Calendar calendar = Calendar.getInstance();
			calendar.add(Calendar.DAY_OF_MONTH, -1);
			int year = calendar.get(Calendar.YEAR);
			int month = calendar.get(Calendar.MONTH);

			list = EmployeeFactory.getInstance().getObjectsForString(sql.toString(), null);
			for (Employee employee : list) {
				List<Double> allScore = new ArrayList<>();
				KPIComputeChainCustomer computeChainCustomer = new KPIComputeChainCustomer(employee, year, month);
				List<Double> scoreList = computeChainCustomer.compute();
				KPIComputeCustomer computeCustomer = new KPIComputeCustomer(employee, year, month);
				List<Double> scoreList2 = computeCustomer.compute();
				if (scoreList == null || scoreList.size() != 2) {
					continue;
				}
				allScore.addAll(scoreList);
				if (scoreList2 == null || scoreList2.size() != 4) {
					continue;
				}
				allScore.addAll(scoreList2);
				//计算总分
				Double sumScore = 0.0;
				for (Double score : allScore) {
					sumScore += BigDecimalArithUtils.add(sumScore, score);
				}

				try {
					KPIScoreRecord record = KPIScoreRecordFactory.getInstance().getNewObject(null);
					sql.delete(0, sql.length());
					sql.append(" where year = ").append(year)
									.append(" and month = ").append(month)
									.append(" and employee_id = ").append(employee.getId());
					List<KPIScoreRecord> scoreRecordlist = KPIScoreRecordFactory.getInstance().getObjectsForString(sql.toString(), null);
					if (scoreRecordlist.size() > 0) {
						continue;
					}
					record.set("employee_id", employee.getId());
					record.set("year", year);
					record.set("month", month);
					record.set("display_surface_score", scoreList2.get(0));
					record.set("display_number_score", scoreList2.get(1));
					record.set("weighted_price_score", scoreList2.get(2));
					record.set("customer_sale_score", null);
					record.set("play_number_score", scoreList2.get(3));
					record.set("chain_customer_sale_score", scoreList.get(0));
					record.set("build_sell_count_score", scoreList.get(1));
					record.set("score", sumScore);
					record.set("flag", 1);
					record.set("create_time", new Date(System.currentTimeMillis()));
					record.flash();
				} catch (WriteValueException e) {
					log.error("设置数据异常", e);
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		log.trace("计算KPI任务结束...");
	}

}
