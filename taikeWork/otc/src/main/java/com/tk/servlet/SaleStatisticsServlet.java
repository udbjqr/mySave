package com.tk.servlet;

import java.sql.ResultSet;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.annotation.WebServlet;

import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.ObjectUtil;
import com.tk.object.Goods;
import com.tk.object.GoodsFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

/***
 * 销售统计
 *
 * @author Administrator
 *
 */
@WebServlet("/saleStatistics.do")
public class SaleStatisticsServlet extends BaseServlet {

	protected static Logger log = LogManager.getLogger(HomePageServlet.class.getName());


	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.query, PermissionEnum.STAT_QUERY);
	}

	/***
	 * 查询销售按单品月份或厂家月份
	 */
	@Override
	protected void query() {
		log.trace("开始销售统计查询...");
		try {
			String startTime = dataJson.getString("startTime");// yyyy-MM 本期开始时间
			String endTime = dataJson.getString("endTime");// yyyy-MM 本期结束时间
			String goodsId = dataJson.getString("goodsId");// 产品ID
			String supplierId = dataJson.getString("supplierId");// 供应商名称
			String compareStartTime = dataJson.getString("compareStartTime");// yyyy-MM 同比开始时间
			String compareEndTime = dataJson.getString("compareEndTime");// yyyy-MM 同比结束时间
			String ids = dataJson.getString("ids");// 关键字搜索ID
			Integer isAssess = dataJson.getInteger("isAssess");//是否考核

			if (StringUtils.isBlank(startTime) || StringUtils.isBlank(endTime) || StringUtils.isBlank(compareStartTime) || StringUtils.isBlank(compareEndTime)) {
				writer.println(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}

			String[] split = startTime.split("-");
			String[] split2 = endTime.split("-");
			String[] compareStartSplit = compareStartTime.split("-");
			String[] compareEndSplit = compareEndTime.split("-");
			Integer startYear = null;//本期开始年份
			Integer startMonth = null;//本期开始月份
			Integer endYear = null;//本期结束年份
			Integer endMonth = null;//本期结束月份
			Integer compareStartYear = null;//同比开始年份
			Integer compareStartMonth = null;//同比开始月份
			Integer compareEndYear = null;//同比结束年份
			Integer compareEndMonth = null;//同比结束月份
			if (split.length > 1 && split2.length > 1 && compareStartSplit.length > 1 && compareEndSplit.length > 1) {
				startYear = Integer.valueOf(split[0]);
				startMonth = Integer.valueOf(split[1]);
				endYear = Integer.valueOf(split2[0]);
				endMonth = Integer.valueOf(split2[1]);

				compareStartYear = Integer.valueOf(compareStartSplit[0]);
				compareStartMonth = Integer.valueOf(compareStartSplit[1]);
				compareEndYear = Integer.valueOf(compareEndSplit[0]);
				compareEndMonth = Integer.valueOf(compareEndSplit[1]);
			} else {
				writer.println(ErrorCode.REQUEST_PARA_ERROR);
				return;
			}

			StringBuilder sql = new StringBuilder();
			sql.append("select sum(goodsqty) goodsqty ,sum(total) total,useyear,usemonth")
			.append(" from sale_goods_month where entryid = 1 ");
			StringBuilder queryGoods = new StringBuilder(" where 1 = 1 ");
			if (StringUtils.isNotBlank(supplierId)) {
				String str = supplierId.substring(supplierId.length() - 1);
				if (str.equals(",")) {
					supplierId = supplierId.substring(0, supplierId.length() - 1);
				}
				sql.append(" and factoryid in (").append(supplierId).append(")");
				queryGoods.append(" and supplier_id in (").append(supplierId).append(")");
			}
			
			if(isAssess!=null){
				queryGoods.append(" and is_assess= ").append(isAssess);
			}
			
			if (StringUtils.isNotBlank(goodsId)) {
				String str2 = goodsId.substring(goodsId.length() - 1);
				if (str2.equals(",")) {
					goodsId = goodsId.substring(0, goodsId.length() - 1);
				}
				sql.append(" and goodsid in (").append(goodsId).append(")");
			} else {
				StringBuilder goodsIds = new StringBuilder();
				//过滤没有权限查看的产品
				List<Goods> goodsList = GoodsFactory.getInstance().getObjectsForString(queryGoods.toString(), employee);
				for (Goods goods : goodsList) {
					goodsIds.append(goods.get("id") + ",");
				}
				//nherpuser.rpt_sa_goods_natural_month_v
				if (goodsIds.length() > 0) {
					goodsIds.delete(goodsIds.length() - 1, goodsIds.length());
					sql.append(" and goodsid in (" + goodsIds + ")");
				} else {
					sql.append(" and 1=2");
				}
			}

			if(StringUtils.isNotBlank(ids)){
				ids = ids.trim();
				String str = ids.substring(ids.length() - 1);
				if (str.equals(",")) {
					ids = ids.substring(0, ids.length() - 1);
				}
				String[] split3 = ids.split(",");
				boolean ifag = true;
				if(split3.length==0){
					ifag = false;
				}
				for (String id : split3) {
					//判断是否整数
					if(!id.matches("[0-9]+")){
						ifag = false;
						break;
					}
				}
				
				if(ifag){
					sql.append(" and goodsid in (").append(ids).append(")");
				}else{
					writer.print(ErrorCode.REQUEST_PARA_ERROR);
					return;
				}
			}


			StringBuilder sql2 = new StringBuilder(sql.toString());
			sql.append(" and ( (useyear  = ").append(startYear).append(" and usemonth >= ").append(startMonth).append(")");
			sql.append(" or (useyear = ").append(endYear).append(" and usemonth <= ").append(endMonth).append(")");
			if (endYear - startYear > 1) {
				for (int i = startYear; i < endYear; i++) {
					sql.append(" or (useyear = ").append(i).append(") ");
				}
			}
			
			
			
			sql.append(")  group by useyear, usemonth order by useyear,usemonth asc");

			sql2.append(" and ( (useyear  = ").append(compareStartYear).append(" and usemonth >= ").append(compareStartMonth).append(")");
			sql2.append(" or (useyear = ").append(compareEndYear).append(" and usemonth <= ").append(compareEndMonth).append(")");
			if (compareEndYear - compareStartYear > 1) {
				for (int i = compareStartYear; i < compareEndYear; i++) {
					sql2.append(" or (useyear = ").append(i).append(") ");
				}
			}
			sql2.append(" ) group by useyear, usemonth order by useyear,usemonth asc");
			Double countLastSale = 0.0;
			Double countTodaySale = 0.0;
			Set<String> allTodayYearMonths = new LinkedHashSet<>();//所有的年月
			Set<String> allLastYearMonths = new LinkedHashSet<>();//所有的年月
			List<String> todayList = geteTotalList(sql.toString(), startTime, endTime, allTodayYearMonths, "today");//本期的销售金额
			if (todayList.size() > 0) {
				countTodaySale = Double.valueOf(todayList.get(todayList.size() - 1).toString());
				todayList.remove(todayList.size() - 1);
			}

			List<String> lastList = geteTotalList(sql2.toString(), compareStartTime, compareEndTime, allLastYearMonths, "last");//同比的销售金额
			if (lastList.size() > 0) {
				countLastSale = Double.valueOf(lastList.get(lastList.size() - 1).toString());
				lastList.remove(lastList.size() - 1);
			}
			List<String> rateOfRiseList = getRateOfRiseList(todayList, lastList);

			SuccessJSON success = new SuccessJSON();
			success.put("todayYear", startYear + "年" + startMonth + "月~" + endYear + "年" + endMonth + "月");//本期时间
			success.put("lastYear", compareStartYear + "年" + compareStartMonth + "月~" + compareEndYear + "年" + compareEndMonth + "月");//同比时间
			success.put("todayYearSale", ObjectUtil.convert(countTodaySale / 10000.00));// 本期总销售额(万元)
			success.put("lastYearSale", ObjectUtil.convert(countLastSale / 10000.00));// 同比总销售额(万元)
			success.put("count", allTodayYearMonths.size());
			success.put("todayList", todayList);//本期数据
			success.put("lastList", lastList);//同比数据
			success.put("monthYears", allTodayYearMonths);//本期年月
			success.put("lastMonthYears", allLastYearMonths);//同比年月
			success.put("rateOfRise", rateOfRiseList);//增长率
			writer.print(success);
		} catch (NullPointerException e) {
			log.error("出现参数异常！", e);
			writer.println(ErrorCode.GET_FONT_END_INFO_ERROR);
		} catch (NumberFormatException e) {
			log.error("参数转换异常!", e);
			writer.println(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			log.error("其他异常！", e);
			writer.println(ErrorCode.GET_LIST_INFO_ERROR);
		}
	}

	private List<String> getRateOfRiseList(List<String> todayList, List<String> lastList) {
		List<String> rateOfRiseList = new ArrayList<>();
		for (int i = 0; i < todayList.size(); i++) {
			Double todayValue = Double.valueOf(todayList.get(i));
			if (i >= lastList.size()) {
				rateOfRiseList.add("0.00");
			} else {
				Double lastValue = Double.valueOf(lastList.get(i));
				if (lastValue.doubleValue() != 0.0) {
					Double result = (todayValue - lastValue) / Math.abs(lastValue);
					rateOfRiseList.add("" + ObjectUtil.convert(result));
				} else {
					rateOfRiseList.add("" + 0.00);
				}
			}
		}
		return rateOfRiseList;
	}


	/***
	 * 获取今年或去年的销售额数据List
	 * @param sql
	 * @param startTime
	 * @param endTime
	 * @param allYearMonths
	 * @param type
	 * @return
	 * @throws Exception
	 */
	private List<String> geteTotalList(String sql, String startTime, String endTime, Set<String> allYearMonths, String type) throws Exception {
		DBHelper dbHelper = DBHelperFactory.getDBHelper();
		ResultSet rs = null;
		List<String> todayList = new ArrayList<>();//本期的销售金额
		try {
			rs = dbHelper.select(sql.toString());//查询本期时间数据
			Set<String> yearMonths = getMonthSet(startTime, endTime);//本期所有的年月（yyyy-MM）
			allYearMonths.addAll(yearMonths);
			List<JSONObject> todayDataList = new ArrayList<>();//本期的销售数据
			Double countsale = 0.0;
			//本期的月总销售
			while (rs.next()) {
				Integer useyear = (Integer) rs.getInt("useyear");// 年份
				JSONObject object = new JSONObject();
				Double total = (Double) rs.getDouble("total");// 总销售金额
				Double goodsqty = (Double) rs.getDouble("goodsqty");// 总销售量
				object.put("useyear", useyear.toString());// 年份
				object.put("usemonth", rs.getObject("usemonth").toString());// 月份
				object.put("total", ObjectUtil.convert(total / 10000));
				object.put("goodsqty", goodsqty);
				countsale += total;
				todayDataList.add(object);
			}

			String yearMoth = "";
			String useyear = "";
			String usemonth = "";
			boolean ifag = true;
			for (String dateStr : allYearMonths) {
				ifag = true;
				for (JSONObject object : todayDataList) {
					useyear = object.get("useyear").toString();
					usemonth = object.get("usemonth").toString();
					if (usemonth.toString().length() == 1) {
						yearMoth = useyear + "-0" + usemonth;
					} else {
						yearMoth = useyear + "-" + usemonth;
					}

					if (dateStr.equals(yearMoth)) {
						ifag = false;
						todayList.add("" + object.get("total").toString());
						break;
					}
				}

				if (ifag) {
					todayList.add("0");
				}
			}

			todayList.add(countsale + "");
		} catch (Exception e) {
			log.error("出现异常！", e);
		} finally {
			dbHelper.close(rs);
		}
		return todayList;

	}

	/***
	 * 获取月份List
	 * @param startDate
	 * @param endDate
	 * @return
	 */
	private List<String> getDateList(String startDate, String endDate) {
		Set<String> allYearMonths;//所有的年月（yyyy-MM）
		List<String> allMonths = new ArrayList<>();//所有的月份（MM月）
		try {
			allYearMonths = getMonthSet(startDate, endDate);

			for (String str : allYearMonths) {
				String[] split3 = str.split("-");
				allMonths.add(split3[1] + "月");
			}
			return allMonths;
		} catch (ParseException e) {
			log.error("出现异常", e);
		}
		return allMonths;

	}


	/***
	 * 获取一段时间的日期
	 * @param startTime yyyy-MM格式
	 * @param endTime yyyy-MM格式
	 * @return
	 * @throws ParseException
	 */
	private Set<String> getMonthSet(String startTime, String endTime) throws ParseException {
		Date d1 = new SimpleDateFormat("yyyy-MM").parse(startTime);// 定义起始日期
		Date d2 = new SimpleDateFormat("yyyy-MM").parse(endTime);// 定义结束日期

		Set<String> dateList = new LinkedHashSet<>();
		Calendar dd = Calendar.getInstance();// 定义日期实例
		dd.setTime(d1);// 设置日期起始时间
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM");
		while (dd.getTime().before(d2)) {// 判断是否到结束日期
			String str = sdf.format(dd.getTime());//获取日期字符串
			dateList.add(str);
			dd.add(Calendar.MONTH, 1);// 进行当前日期月份加1
		}

		String str = sdf.format(dd.getTime());//获取日期字符串
		dateList.add(str);
		return dateList;
	}


	/***
	 * 处理数据
	 * @param list
	 * @param type
	 * @param yearMonths
	 * @param yearIfag
	 * @return
	 */
	private List<String> getList(List<JSONObject> list, String type, Set<String> yearMonths, String yearIfag) {
		List<String> newList = new ArrayList<>();
		for (String yearMonth : yearMonths) {
			boolean ifag = false;//判断标志
			String[] split = yearMonth.split("-");
			Integer year = Integer.valueOf(split[0]);
			Integer month = Integer.valueOf(split[1]);
			for (JSONObject object : list) {
				Object value = (Object) object.get(type);
				Integer year2 = Integer.valueOf(object.get("useyear").toString());// 年份
				Integer month2 = Integer.valueOf(object.get("usemonth").toString());// 月份
				if (yearIfag.equals("今年") && year.intValue() == year2.intValue() && month.intValue() == month2.intValue()) {
					ifag = true;
					newList.add(value.toString());
					break;
				} else if (yearIfag.equals("去年") && year.intValue() - 1 == year2.intValue() && month.intValue() == month2.intValue()) {
					ifag = true;
					newList.add(value.toString());
					break;
				} else if (yearIfag.equals("增长率") && year.intValue() == year2.intValue() && month.intValue() == month2.intValue()) {
					ifag = true;
					newList.add(value.toString());
					break;
				}
			}

			if (!ifag) {
				newList.add("0");
			}
		}
		return newList;
	}

}
