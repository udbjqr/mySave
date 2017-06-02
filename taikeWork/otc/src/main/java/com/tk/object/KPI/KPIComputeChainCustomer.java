package com.tk.object.KPI;


import com.tk.common.persistence.WriteValueException;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.BigDecimalArithUtils;
import com.tk.common.util.ObjectUtil;
import com.tk.object.ChainCustomer;
import com.tk.object.ChainCustomerFactory;
import com.tk.object.Employee;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.*;

/****
 * 计算连锁门店的KPI
 * @author Administrator
 *
 */
public class KPIComputeChainCustomer {

	private static final Logger logger = LogManager.getLogger(KPIComputeChainCustomer.class.getName());
	private static final List<KPIParameter> parameters;
	private static final DBHelper nanghuaDB;
	private static final DBHelper dbHelper;
	private int year;
	private int month;
	private Map<String, Object> saleTargetMap;//处理过的考核设置数据
	//private String goodsIdsString;  //产品列表字串，用于查询 in
	private String chainCustomerIdsString; //连锁店Id字串
	private List<KPISaleTarget> saleTarget; //连锁门店目标
	private final Integer employeeId;
	private List<ChainCustomer> chainCustomers;//所有的连锁客户
	private static List<Integer> goodsIdsList;//所有的产品列表

	static {
		parameters = KPIParameterFactory.getInstrance().getAllObjects(null);
		nanghuaDB = DBHelperFactory.getSecondDBHelper("2");
		dbHelper = DBHelperFactory.getDBHelper();
	}


	public KPIComputeChainCustomer(Employee employee, int year, int month) {
		this.year = year;
		this.month = month;
		employeeId = employee.getId();

		try {
			//得到员工对应的连锁店对象
			chainCustomers = ChainCustomerFactory.getInstance().getMultipleObjects("employee_id", employeeId, null);

			chainCustomerIdsString = getChainCustomeIds(chainCustomers);

			//得到连锁门店对应的产品考核设置对象
			StringBuilder sql = new StringBuilder();
			sql.append(" where custom_type = 2 ");
			//所属连锁店ID 串不为空
			if (StringUtils.isNotEmpty(chainCustomerIdsString)) {
				sql.append(" and t.customer_id in (").append(chainCustomerIdsString).append(")");
			} else {
				sql.append(" and 1 = 2");
			}
			saleTarget = KPISaleTargetFactory.getInstance().getObjectsForString(sql.toString(), null);


			//得到员工对应的连锁店的所有产品ID（有考核设置的产品）
			getGoodsIds(saleTarget);


			//获取处理过连锁店的考核设置数据
			saleTargetMap = getTarget(saleTarget);

		} catch (SQLException e) {
			logger.error("初始化异常。", e);
		}

	}

	/***
	 * 计算销售额,铺点数方法
	 * @return
	 */
	public List<Double> compute() {
		List<Double> scoreList = new ArrayList<>();
		//计算销售额得分
		Double score1 = computeAllGoodsByAllChainCustomerMoney();
		//计算铺点数得分
		Double score2 = computeBuildSellCount();
		score1 = score1.isNaN() ? 0.0 : score1;
		score2 = score2.isNaN() ? 0.0 : score2;
		scoreList.add(ObjectUtil.convert(score1));
		scoreList.add(ObjectUtil.convert(score2));
		return scoreList;
	}

	/***
	 * 计算铺点数比值
	 * @return
	 */
	private Double computeBuildSellCount() {
		Double result = computeBuildSellCountRatio();
		return result;
	}

	/***
	 * 计算一个产品在一个连锁门店铺点数比值
	 */
	private Double computeBuildSellCountRatioByOneChainCustomer(Integer goods_id, Integer chain_customer_id) {
		try {
			StringBuilder sql = new StringBuilder();
			sql.append("select count(distinct customer_id) as count ")
							.append(" from customer_visits_detail a ")
							.append(" left join customer_visits b ")
							.append(" on a.visits_id = b.id ")
							.append(" left join customer c ")
							.append(" on b.customer_id = c.id ")
							.append("where  convert(char(7),b.sign_in_time,120) = ")
							.append(String.format("'%d-%02d'", year, month))
							.append(" and goods_id = ").append(goods_id)
							.append(" and chain_customer_id = ").append(chain_customer_id);
			Integer count = (Integer) dbHelper.selectOneValues(sql.toString());
			logger.trace("产品ID: " + goods_id + " 在连锁门店ID: " + chain_customer_id + " 中的实际铺点数:" + count);
			if (count != null) {
				//实际铺点数
				Double intValue = count.doubleValue();
				logger.trace("获取要求铺点数...");
				//获取要求铺点数
				Map<String, Object> chainRequireVal = getChainRequireVal(chain_customer_id, goods_id);
				logger.trace("要求铺点数:" + chainRequireVal);
				if (chainRequireVal != null && chainRequireVal.size() > 0) {
					Integer requireVal = (Integer) chainRequireVal.get("build_sell_count");
					logger.trace("一个产品在一个连锁门店要求铺点数:" + requireVal);
					//TODO 这边转换为了了
					Double value = BigDecimalArithUtils.div(intValue, requireVal);
					logger.trace("一个产品在一个连锁门店铺点数比值 BigDecimal :" + value);

					Double result = BigDecimalArithUtils.div(intValue, requireVal);
					logger.trace("一个产品在一个连锁门店铺点数比值:" + result);

					sql.setLength(0);
					sql.append(" where customer_type = 2 and goods_id = ").append(goods_id)
									.append(" and customer_id = ").append(chain_customer_id);
					List<kPIGoodsSaleScore> list = kPIGoodsSaleScoreFactory.getInstance().getObjectsForString(sql.toString(), null);
					if (list.size() > 0) {
						kPIGoodsSaleScore goodsSaleScore = list.get(0);
						Double minRatio = getMinRatio("总销售额");
						goodsSaleScore.set("require_build_sell_count", requireVal);
						goodsSaleScore.set("build_sell_count", intValue.intValue());
						goodsSaleScore.set("build_sell_count_require_ratio", minRatio);
						goodsSaleScore.set("build_sell_count_actual_ratio", result);
						goodsSaleScore.flash();
					}
					return result;
				}
				logger.trace("一个产品在一个连锁门店要求铺点数:没有设置");
				return null;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}


	/***
	 * 计算一个产品在所有连锁门店铺点数比值(平均值)
	 */
	private Double computeBuildSellCountRatioByAllChainCustomer(Integer goods_id) {
		if (null == chainCustomers || chainCustomers.size() < 1) {
			return 0.0;
		}
		Map<String, Double> dataMap = new HashMap<>();
		Double value = 0.0;
		for (ChainCustomer chainCustomer : chainCustomers) {
			Double val = computeBuildSellCountRatioByOneChainCustomer(goods_id, chainCustomer.get("id"));
			/*if(val==null){
				val = 0.0;
			}*/
			//没有设置要求值,不做计算
			if (val != null) {
				value += BigDecimalArithUtils.add(value, val);
				dataMap.put(chainCustomer.get("id").toString(), val);
			}
		}
		return BigDecimalArithUtils.add(value, dataMap.size());
	}

	/***
	 * 计算所有产品在所有连锁门店铺点数比值和得分
	 */
	private Double computeBuildSellCountRatio() {
		if (null == goodsIdsList || goodsIdsList.size() < 1) {
			return 0.0;
		}
		Map<String, Double> map = new HashMap<>();
		Double value = 0.0;//总比值和/产品数
		for (Integer goodsId : goodsIdsList) {
			Double val = computeBuildSellCountRatioByAllChainCustomer(goodsId);
			value += BigDecimalArithUtils.add(value, val);
			map.put(goodsId + "", value);
		}

		Double ratio = BigDecimalArithUtils.div(value, map.size());
		logger.trace("所有产品在所有连锁门店铺点数比值和得分:");
		logger.trace(value + "/" + map.size() + "=" + ratio);
		String paramName = "铺点数";
		return computeScoreByRatio(ratio, paramName);
	}


	/****
	 * 查询一个产品在所有连锁门店销售额(一个月的时间)
	 */
	private Map<String, Object> queryGoodsOnChainCustomerMoneny(Integer goods_id) {
		ResultSet rs = null;
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Calendar calendar = Calendar.getInstance();
			calendar.set(year, month - 1, 1);
			String startTimeDate = sdf.format(calendar.getTime());
			calendar.add(Calendar.MONTH, +1);
			String endTimeDate = sdf.format(calendar.getTime());
			StringBuilder sql = new StringBuilder();
			sql.append("select a.credate,a.customid,a.goodsid,")
							.append(" a.total_line from nherpuser.BMS_SA_DTLQRY_V a,nherpuser.bms_sk_costingprice_lst_v b ")
							.append(" where a.entryid=1 and a.goodsid=b.GOODSID ")
							.append(" and b.entryid = 1 ")
							.append(" and a.goodsid = ").append(goods_id)
							.append(" and a.customid in (").append(chainCustomerIdsString).append(")")
							.append(" and a.credate between ")
							.append(nanghuaDB.getString(startTimeDate))
							.append(" and ")
							.append(nanghuaDB.getString(endTimeDate));
			rs = nanghuaDB.select(sql.toString());
			Map<String, Object> dataMap = new HashMap<>();//产品ID:dataList
			List<Map<String, Object>> dataList = new ArrayList<>();//map
			while (rs.next()) {
				Map<String, Object> map = new HashMap<>();//连锁客户ID:销售额
				map.put(rs.getObject("customid").toString(), rs.getDouble("total_line"));
				dataList.add(map);
			}
			dataMap.put(goods_id.toString(), dataList);
			return dataMap;
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			nanghuaDB.close(rs);
		}
		return null;
	}

	/***
	 * 获取一个产品在一个连锁门店销售额
	 * @return
	 */
	private Double getOneGoodsOnChainCustomerMoney(Integer goods_id, Integer chain_customer_id) {
		ResultSet rs = null;
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Calendar calendar = Calendar.getInstance();
			calendar.set(year, month - 1, 1);
			String startTimeDate = sdf.format(calendar.getTime());
			calendar.add(Calendar.MONTH, +1);
			String endTimeDate = sdf.format(calendar.getTime());
			StringBuilder sql = new StringBuilder();
			sql.append("select sum(a.total_line) as sum_total_line,sum(a.goodsqty) as sum_goodsqty  ")
							.append(" from nherpuser.BMS_SA_DTLQRY_V a,nherpuser.bms_sk_costingprice_lst_v b ")
							.append(" where a.entryid=1 and a.goodsid=b.GOODSID ")
							.append(" and b.entryid = 1 ")
							.append(" and a.goodsid = ").append(goods_id)
							.append(" and a.customid = ").append(chain_customer_id)
							.append(" and a.credate between ")
							.append(nanghuaDB.getString(startTimeDate))
							.append(" and ")
							.append(nanghuaDB.getString(endTimeDate));
			rs = nanghuaDB.select(sql.toString());
			if (rs.next()) {
				Double sum_total_line = rs.getDouble("sum_total_line");//总销售额
				//Double sum_goodsqty = rs.getDouble("sum_goodsqty");//总销售量
				return sum_total_line;
			} else {
				return 0.0;
			}
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			nanghuaDB.close(rs);
		}
		return 0.0;
	}


	/***
	 * 计算一个产品在一个连锁门店销售额比值
	 * @return
	 */
	private Double computeOneGoodsByOneChainCustomerMoney(Integer chain_customer_id, Integer goods_id) {
		//获取一个产品在一个连锁门店的实际值
		Double value = (Double) getOneGoodsOnChainCustomerMoney(goods_id, chain_customer_id);
		logger.trace("一个产品在一个连锁门店的销售额实际值:" + value);
		//获取一个产品在一个连锁门店的销售额要求值
		logger.trace("获取一个产品在一个连锁门店的销售额要求值...");
		Map<String, Object> chainRequireVal = getChainRequireVal(chain_customer_id, goods_id);
		logger.trace("一个产品在一个连锁门店的销售额要求值:" + chainRequireVal);
		if (chainRequireVal != null) {
			Double requireVal = Double.valueOf(chainRequireVal.get("money").toString());
			logger.trace("一个产品在一个连锁门店的销售额要求值:" + requireVal);

			try {
				Double minRatio = getMinRatio("铺点数");
				kPIGoodsSaleScore goodsSaleScore = kPIGoodsSaleScoreFactory.getInstance().getNewObject(null);
				goodsSaleScore.set("goods_id", goods_id);
				goodsSaleScore.set("customer_type", 2);
				goodsSaleScore.set("customer_id", chain_customer_id);
				goodsSaleScore.set("employee_id", employeeId);
				goodsSaleScore.set("year", year);
				goodsSaleScore.set("month", month);
				goodsSaleScore.set("require_build_sell_count", 0);
				goodsSaleScore.set("build_sell_count", 0);
				goodsSaleScore.set("build_sell_count_require_ratio", 0.0);
				goodsSaleScore.set("build_sell_count_actual_ratio", 0.0);
				goodsSaleScore.set("require_number", 0);
				goodsSaleScore.set("number", 0);
				goodsSaleScore.set("number_require_ratio", 0.0);
				goodsSaleScore.set("number_actual_ratio", 0.0);
				goodsSaleScore.set("require_money", requireVal);
				goodsSaleScore.set("money", value);
				goodsSaleScore.set("money_require_ratio", minRatio);
				goodsSaleScore.set("money_actual_ratio", BigDecimalArithUtils.div(value, requireVal));
				goodsSaleScore.flash();
			} catch (WriteValueException e) {
				logger.error("出现异常！", e);
			}
			return BigDecimalArithUtils.div(value, requireVal);
		}
		return null;
	}

	/***
	 * 获取最小比值
	 * @param paramName
	 * @return
	 */
	private Double getMinRatio(String paramName) {
		KPIParameter kpiParameter = getParameter(paramName);
		Double minRatio = kpiParameter.get("paul_at_the_end");
		return minRatio;
	}


	/***
	 * 计算所有产品在所有连锁门店销售额比值和得分
	 * @return
	 */
	private Double computeAllGoodsByAllChainCustomerMoney() {
		if (null == goodsIdsList || goodsIdsList.size() < 1) {
			return 0.0;
		}
		Map<String, Double> map = new HashMap<>();
		Double value = 0.0;//总比值和/产品数
		for (Integer goodsId : goodsIdsList) {
			Double result = computeOneGoodsByAllChainCustomerMoney(goodsId);
			value += BigDecimalArithUtils.add(value, result);
			map.put(goodsId + "", result);
		}

		Double ratio = BigDecimalArithUtils.div(value, map.size());
		logger.trace("所有产品在所有连锁门店销售额比值:" + ratio);
		String paramName = "总销售额";
		return computeScoreByRatio(ratio, paramName);
	}

	/***
	 * 根据比值计算得分
	 * 比较最低比值算得分
	 * @return
	 */
	private Double computeScoreByRatio(Double ratio, String paramName) {
		logger.trace("开始根据比值计算得分...");
		KPIParameter kpiParameter = getParameter(paramName);
		//最低比值
		Double minRatio = kpiParameter.get("paul_at_the_end");
		logger.trace("最低比值:" + minRatio);
		//最高分数
		Double maxScore = kpiParameter.get("max_score");
		logger.trace("最高分数:" + maxScore);
		Double total = 0.0;//最终结果
		if (kpiParameter != null) {
			if (ratio > 1) {//大于超过目标记 100%
				total = BigDecimalArithUtils.mul(1, maxScore);
				logger.trace("大于超过目标记 100%");
			} else if (ratio < minRatio) {//小于最低比值
				total = 0.0;
				logger.trace("小于最低比值");
			} else {
				total = BigDecimalArithUtils.mul(ratio, maxScore);
			}
		}
		logger.trace("得分:" + total);
		logger.trace("根据比值计算得分结束...");
		return total;
	}

	/***
	 * 计算一个产品在所有连锁门店销售额比值
	 * @return
	 */
	private Double computeOneGoodsByAllChainCustomerMoney(Integer goods_id) {
		List<Double> values = new ArrayList<>();
		Double sumValue = 0.0;//求和
		for (ChainCustomer chainCustomer : chainCustomers) {
			Integer chain_customer_id = chainCustomer.get("id");
			Double value = computeOneGoodsByOneChainCustomerMoney(chain_customer_id, goods_id);
			//没有设置要求值不做计算
			if (value != null) {
				sumValue += BigDecimalArithUtils.add(sumValue, value);
				values.add(value);
			}
		}
		Double result = BigDecimalArithUtils.add(sumValue, values.size());//计算平均值
		logger.trace("一个产品在所有连锁门店销售额比值:" + result);
		return result;
	}

	/***
	 * 获取一个产品在一个连锁门店的要求值
	 * 0  铺点数要求值
	 * 1 销售额要求值
	 * @return
	 */
	private Map<String, Object> getChainRequireVal(Integer chain_customer_id, Integer goods_id) {
		if (null == saleTargetMap || saleTargetMap.size() < 1) {
			return null;
		}
		Map<String, Object> valueList = (Map<String, Object>) saleTargetMap.get(chain_customer_id + "," + goods_id);
		return valueList;
	}


	/***
	 * 得到员工对应的连锁店的所有产品ID的字符串（有考核设置的产品）. 
	 * 以1，2，4的形式给出。
	 * @return
	 */
	private static String getChainCustomerIds(List<ChainCustomer> chainCustomerList) {
		StringBuilder chainCustomerIds = new StringBuilder();
		for (ChainCustomer chainCustomer : chainCustomerList) {
			chainCustomerIds.append(chainCustomer.get("id") + ",");
		}

		if (chainCustomerIds.length() > 0) {
			chainCustomerIds.delete(chainCustomerIds.length() - 1, chainCustomerIds.length());
		}
		return chainCustomerIds.toString();
	}


	/***
	 * 得到员工对应的连锁店的所有产品ID的字符串（有考核设置的产品）. 
	 * 以1，2，4的形式给出。
	 * @return
	 */
	private static String getGoodsIds(List<KPISaleTarget> list) {
		if (null == list || list.size() < 1) {
			return null;
		}
		StringBuilder idsStr = new StringBuilder();
		List<Integer> idsList = new ArrayList<>();
		for (KPISaleTarget kpiSaleTarget : list) {
			idsList.add(kpiSaleTarget.get("good_id"));
		}

		goodsIdsList = idsList;
		return idsStr.toString();
	}


	/*****
	 * 获取连锁店的考核设置
	 * @param targetList
	 * @return
	 */
	private static Map<String, Object> getTarget(List<KPISaleTarget> targetList) {
		if (null == targetList || targetList.size() < 1) {
			return null;
		}
		Map<String, Object> kpiSaleTargetMap = new HashMap<>();
		for (KPISaleTarget kpiSaleTarget : targetList) {
			Integer customer_id = kpiSaleTarget.get("customer_id");
			Integer good_id = kpiSaleTarget.get("good_id");
			Integer build_sell_count = kpiSaleTarget.get("build_sell_count");//铺点数
			Double money = kpiSaleTarget.get("money");//销售额
			Map<String, Object> values = new HashMap<String, Object>();
			values.put("build_sell_count", build_sell_count);
			values.put("money", money);
			kpiSaleTargetMap.put(customer_id + "," + good_id, values);
		}
		return kpiSaleTargetMap;
	}

	/***
	 * 得到员工对应的连锁店ID的字符串
	 * 以1，2，4的形式给出。
	 * @return
	 */
	private static String getChainCustomeIds(List<ChainCustomer> list) {
		if (null == list || list.size() < 1) {
			return null;
		}
		StringBuilder chainCustomeIds = new StringBuilder();
		for (ChainCustomer chainCustomer : list) {
			chainCustomeIds.append(chainCustomer.get("id") + ",");
		}

		if (chainCustomeIds.length() > 0) {
			chainCustomeIds.delete(chainCustomeIds.length() - 1, chainCustomeIds.length());
		}
		return chainCustomeIds.toString();
	}


	/**
	 * 得到对应的参数对象.
	 */
	private KPIParameter getParameter(String name) {
		for (KPIParameter parameter : parameters) {
			if (parameter.get("parameter_name").equals(name)) {
				return parameter;
			}
		}

		return null;
	}

}
