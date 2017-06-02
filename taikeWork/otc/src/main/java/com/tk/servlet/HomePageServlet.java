package com.tk.servlet;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.PermissionEnum;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.DateUtil;
import com.tk.common.util.ObjectUtil;
import com.tk.object.*;
import com.tk.object.KPI.KPICustomerTargetFactory;
import com.tk.object.KPI.KPISaleTargetFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.annotation.WebServlet;

import java.math.BigDecimal;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

/**
 * 首页管理 servlet
 */
@WebServlet("/homePage.do")
public class HomePageServlet extends BaseServlet {
	protected static Logger log = LogManager.getLogger(HomePageServlet.class.getName());
	// 获取到考核设置工厂类
	private static KPICustomerTargetFactory kpiCustomTargetFactory = KPICustomerTargetFactory.getInstance();
	// 获取到南华客户工厂类
	private static ChainCustomerFactory chainCustomerFactory = ChainCustomerFactory.getInstance();
	// 获取到销售设置工厂类
	private static KPISaleTargetFactory kpiSaleTargetFactory = KPISaleTargetFactory.getInstance();
	// 客户工厂类
	private static CustomerFactory customerFactory = CustomerFactory.getInstance();
	// 产品工厂类
	private static GoodsFactory goodsFactory = GoodsFactory.getInstance();
	// 供应商工厂类
	private static SupplierFactory supplierFactory = SupplierFactory.getInstance();

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.stat, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.getMenus, PermissionEnum.NOT_USE_PERMISSION);
	}

	@Override
	protected boolean handleChilder() {
		switch (controlType) {
			case stat:
				stat();
				return true;
			case getMenus:
				getMenus();
				return true;
			default:
				return false;
		}
	}


	/**
	 * 获得统计信息（产品、客户、销售额）
	 */
	protected void stat() {
		log.trace("首页统计考核产品数，客户数，销售额初始...");
		//初始化（产品数、销量数、客户总数）
		Integer goodCount;
		Double saleCount = 0.0;
		Integer customerCount;
		DBHelper nanhuaDbHelper = DBHelperFactory.getSecondDBHelper("2");
		ResultSet rs = null;
		//查询考核产品总数
		try {
			List<Goods> goodsList = goodsFactory.getAllObjects(employee);
			goodCount = goodsList.size();
		} catch (Exception e) {
			log.error("首页统计产品数发生异常：{}！", e);
			goodCount = 0;
		}
		//查询销售总额
		try {
//			DBHelper nanhuaDbHelper = DBHelperFactory.getSecondDBHelper("2");
			//查询连锁客户
//			String sql = String.format("select sum(total_line) as sale_count from import_sale_detail where a.customid in %s and " +
//											" goodsid in %s and credate BETWEEN '%d-%02d-01 00:00:01' and '%d-%02d-01 00:00:00'",
//							chainCustomerFactory.loadChainCustomers(employee.get("id")), goodsFactory.loadGoodsString(), calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH), calendar.get(Calendar.YEAR), calendar.get(Calendar.MONTH) + 1);
//			saleCount = nanhuaDbHelper.selectOneValues(sql);
			
			/*SimpleDateFormat sdf = new SimpleDateFormat(Constant.DATEFORMAT);
			StringBuilder sql = new StringBuilder();
			StringBuilder goodsIds = new StringBuilder();
			List<Goods> goodsList = GoodsFactory.getInstance().getAllObjects(employee);
			for (Goods goods : goodsList) {
				goodsIds.append(goods.get("id") + ",");
			}
			
			if (goodsIds.length() > 0) {
				goodsIds.delete(goodsIds.length() - 1, goodsIds.length());
				sql.append("select sum(total_line) as count ")
				 .append( "from nherpuser.BMS_SA_DTLQRY_V a,nherpuser.bms_sk_costingprice_lst_v b ")
				 .append( "where a.entryid=1 and a.goodsid=b.GOODSID and b.entryid=1 and a.goodsid in (" + goodsIds + ")");
				Calendar calendar = Calendar.getInstance();
				String endTimeDate = sdf.format(calendar.getTime());
				calendar.add(Calendar.MONTH, -1);
				String startTimeDate = sdf.format(calendar.getTime());
				sql.append(" and a.credate between " + nanhuaDbHelper.getString(startTimeDate) + "  and " + nanhuaDbHelper.getString(endTimeDate));
				BigDecimal bigDecimal = (BigDecimal)nanhuaDbHelper.selectOneValues(sql.toString());
				saleCount = bigDecimal.doubleValue();
			} else {
				writer.print(new SuccessJSON("msg", "暂无数据！"));
				return;
			}*/
			
		} catch (Exception e) {
			logger.error("统计销售总额发生异常：{}！", e);
			saleCount = 0.0;
		}
		//查询客户总数
		try {
			List<Customer> customerList = customerFactory.getAllObjects(employee);
			customerCount = customerList.size();
		} catch (Exception e) {
			logger.error("统计客户数发生异常：{}！", e);
			customerCount = 0;
		}
		//返回首页数据
		SuccessJSON success = new SuccessJSON();
		success.put("goodCount", goodCount);
		success.put("saleCount", saleCount);
		success.put("customerCount", customerCount);
		log.trace("首页统计产品数，客户数，销售额结束...");
		writer.print(success);
	}

	/**
	 * 获得菜单
	 */
	protected void getMenus() {
		log.trace("根据用户权限获取菜单初始...");
		SuccessJSON success = new SuccessJSON();
		success.put("userName", employee.get("real_name"));
		success.put("menus", employee.getMenu());
		log.trace("根据用户权限获取菜单结束...");
		writer.print(success);
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

	@Override
	protected void query() {

	}

	@Override
	protected void load() {

	}

	@Override
	protected void add() {

	}
}
