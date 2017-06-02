package com.tk.object.SignTask;

import java.sql.ResultSet;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.scheduler.FixedTimeStartTask;
import com.tk.object.SaleGoodsMonth;
import com.tk.object.SaleGoodsMonthFactory;
import com.tk.object.VisitsFactory;

/***
 * 定时导入销售数据（每月1号 6:00执行）
 * @author Administrator
 *
 */
public class ImportSaleDataTask extends FixedTimeStartTask{
	
	private static Logger log = LogManager.getLogger(ImportSaleDataTask.class.getName());
	private static SaleGoodsMonthFactory saleGoodsMonthFactory = SaleGoodsMonthFactory.getInstance();

	@Override
	protected void execute() {
		log.info("执行导入销售数据任务");
		DBHelper secondDBHelper = DBHelperFactory.getSecondDBHelper("2");
		DBHelper dBHelper = DBHelperFactory.getDBHelper();
		ResultSet rs = null;
		try{
			StringBuilder sql = new StringBuilder();
			sql.append("select max(useyear) as useyear from sale_goods_month");
			Integer maxUseYear = dBHelper.selectOneValues(sql.toString());//最大的年份
			sql.delete(0, sql.length());
			sql.append("select max(usemonth) as usemonth from sale_goods_month where useyear = "+maxUseYear);
			Integer maxUseMonth = dBHelper.selectOneValues(sql.toString());//最大的月份
			sql.delete(0, sql.length());
			sql.append("select * from nherpuser.rpt_sa_goods_natural_month_v where useyear > ").append(maxUseYear)
			.append(" or (useyear = ").append(maxUseYear)
			.append(" and usemonth > ").append(maxUseMonth).append(")");
			rs = secondDBHelper.select(sql.toString());
			while (rs.next()) {
				SaleGoodsMonth saleGoodsMonth = saleGoodsMonthFactory.getNewObject(null);
				saleGoodsMonth.set("useyear", rs.getObject("useyear"));
				saleGoodsMonth.set("usemonth", rs.getObject("usemonth"));
				saleGoodsMonth.set("goodsid", rs.getObject("goodsid"));
				saleGoodsMonth.set("factoryid", rs.getObject("factoryid"));
				saleGoodsMonth.set("total", rs.getObject("total"));
				saleGoodsMonth.set("entryid", rs.getObject("entryid"));
				saleGoodsMonth.set("goodsqty", rs.getObject("goodsqty"));
				saleGoodsMonth.flash();
			}
			
			
		}catch(Exception e){
			log.error("执行导入销售数据任务发生异常",e);
		}finally {
			secondDBHelper.close(rs);
		}
	}

}
