package com.tk.servlet;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import javax.servlet.annotation.WebServlet;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.tk.common.PermissionEnum;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.object.SignTask.ComputeKPITask;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

/***
 * 考核管理
 * @author Administrator
 *
 */
@WebServlet("/scoreRecord.do")
public class KPIScoreRecordServlet extends BaseServlet {
	
	protected static Logger log = LogManager.getLogger(GoodsConfigServlet.class.getName());

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.againComputeKPI, PermissionEnum.NOT_USE_PERMISSION);
	}
	
	@Override
	protected boolean handleChilder() {
		switch (controlType) {
		case againComputeKPI:
			againComputeKPI();
			return true;
		default:
			return false;
		}
	}
	
	/***
	 * 重新计算KPI
	 */
	private void againComputeKPI(){
		log.trace("开始重新计算KPI...");
		try{
			DBHelper dbHelper = DBHelperFactory.getDBHelper();
			String dateStr = dataJson.get("date").toString();//yyyy-MM 要重算的年月
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
			Date date = sdf.parse(dateStr);
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(date);
			int year = calendar.get(Calendar.YEAR);
			int month = calendar.get(Calendar.MONTH)+1;
			String sql = String.format("delete from kpi_score_record where create_time between '%d-%02d-01' and '%d-%02d-01'",
			year,month,year,month+1);
			writer.print(new SuccessJSON("msg", "重新计算KPI成功！请等待2-3分钟后，查询KPI计算结果！"));
			dbHelper.execBatchSql(new String[]{sql});
			new ComputeKPITask().execute();//计算KPI
			log.trace("重新计算KPI结束...");
		}catch (NullPointerException e) {
			log.error(ErrorCode.GET_FONT_END_INFO_ERROR, e);
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
		}catch (NumberFormatException e) {
			log.error(ErrorCode.REQUEST_PARA_ERROR, e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.print(ErrorCode.DELETE_ERROR);
		}
	}

}
