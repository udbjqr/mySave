package com.tk.object.SignTask;

import com.tk.common.util.DateUtil;
import com.tk.common.util.scheduler.FixedTimeStartTask;
import com.tk.common.util.scheduler.IntervalFixTimeTask;
import com.tk.object.VisitPlanFactory;
import com.tk.object.Visits;
import com.tk.object.VisitsFactory;
import com.tk.object.importData.ImportUpstreamData;
import com.tk.servlet.AppraisalsServlet;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.List;

/**
 * 定时签出未签出的数据
 */
public class SignOutTask extends FixedTimeStartTask {
	private static Logger log = LogManager.getLogger(SignOutTask.class.getName());
	// 获取到拜访记录工厂类
	private static VisitsFactory visitsFactory = VisitsFactory.getInstance();

	@Override
	protected void execute() {
		//查询当天所有的未签出的数据
		String unSignOut = " where flag =0 and convert(char(10) ,t.visits_time , 120)= '" + DateUtil.getDate() + "' ";
		List<Visits> visitsList;
		try {
			visitsList = visitsFactory.getObjectsForString(unSignOut, null);
		} catch (Exception e) {
			log.error("定时查询未签出的拜访计划异常:{}！ ", e);
			return;
		}
		//判断当天是否有未签出的拜访计划
		if (null == visitsList || visitsList.size() < 1) {
			log.trace("暂无需定时签出的拜访计划！");
			return;
		}
		//否则自动签出,(2,为特殊签出的状态)
		int count = 0;
		for (Visits plan : visitsList) {
			try {
				plan.set("flag", 2);
				plan.flash();
			} catch (Exception e) {
				log.trace("定时签出发生异常，异常描述：{} ！", e);
				return;
			}
			count++;
		}
		log.info("定时签出结束，共签出：" + count + " 条数据！");
	}
}
