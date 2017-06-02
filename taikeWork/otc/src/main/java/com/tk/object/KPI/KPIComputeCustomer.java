package com.tk.object.KPI;

import java.sql.ResultSet;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.tk.common.util.BigDecimalArithUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.tk.common.persistence.WriteValueException;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.object.Customer;
import com.tk.object.CustomerFactory;
import com.tk.object.Employee;

/****
 * 计算门店的KPT
 *
 * @author Administrator
 *
 */
public class KPIComputeCustomer {

	private static final Logger logger = LogManager.getLogger(KPIComputeCustomer.class.getName());
	private static final List<KPIParameter> parameters;
	private static final DBHelper dbHelper;
	private static int year;
	private static int month;
	private Map<String, Object> customerTargetMap = new HashMap<String, Object>();// 处理过的考核设置数据
	private List<KPICustomerTarget> customerTarget = new ArrayList<>(); // 门店目标
	private StringBuilder scoreDetail = new StringBuilder();// 记分详情
	private static Integer employeeId;
	private List<Customer> customers;// 所有的客户
	private static List<Integer> goodsIdsList = new ArrayList<>();// 所有的产品列表

	static {
		parameters = KPIParameterFactory.getInstrance().getAllObjects(null);
		dbHelper = DBHelperFactory.getDBHelper();
	}

	public KPIComputeCustomer(Employee employee, int year, int month) {
		KPIComputeCustomer.year = year;
		KPIComputeCustomer.month = month;
		employeeId = employee.getId();
		try {
			// 得到员工对应门店对象(拜访计划审核通过的门店)
			StringBuilder sql = new StringBuilder();
			sql.append(" where exists(select * from customer_visits_plan a ")
							.append(" where a.custom_id = t.id and a.flag = 1 ")
							.append(" and a.isleave = 0 ")
							.append(" and convert(char(7),a.plan_in_time,120) = ")
							.append(String.format("'%d-%02d'", year, month)).append(")");
			customers = CustomerFactory.getInstance().getObjectsForString(sql.toString(), null);

			// 得到员工对应的一个月拜访后所有录入的产品ID（拜访后所有录入的产品）
			getGoodsIds();

			// 得到门店对应的产品考核设置对象
			customerTarget = KPICustomerTargetFactory.getInstance().getAllObjects(null);

			// 获取处理过门店的考核设置数据
			customerTargetMap = getTarget(customerTarget);

		} catch (Exception e) {
			logger.error("初始化异常。", e);
		}

	}

	/***
	 * 计算方法(陈列面,陈列数,平均加权价,播放次数)
	 *
	 * @return
	 */
	public List<Double> compute() {
		//计算陈列面,陈列数,平均加权价得分
		List<Double> scoreList = computeDataScore();
		if (null == scoreList || scoreList.size() < 1) {
			return null;
		}
		int size = 3 - scoreList.size();
		for (int i = 0; i < size; i++) {
			scoreList.add(0.0);
		}
		/*//计算平均加权价得分
		Double score1 = computeWeightedPriceScore();
		score1 = score1.isNaN()?0.0:score1;*/
		//计算播放次数得分
		Double score2 = computePlayNumberScore();
		score2 = score2.isNaN() ? 0.0 : score2;
		/*scoreList.add(score1);*/
		scoreList.add(score2);
		return scoreList;
	}


	/***
	 * 计算一个产品在所有类型门店的平均加权价
	 */
	private Double computeOneGoodsWeightedPriceAllTypeCustomer(Integer goodsId) {
		ResultSet rs = null;
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Calendar calendar = Calendar.getInstance();
			calendar.set(year, month - 1, 1);
			String startTimeDate = sdf.format(calendar.getTime());
			calendar.add(Calendar.MONTH, +1);
			String endTimeDate = sdf.format(calendar.getTime());
			StringBuilder sql = new StringBuilder();
			sql.append("select avg(tag_price) as mean,attributes_id from customer_visits_detail t ")
							.append(" left join customer_visits b ")
							.append(" on t.visits_id = b.id ")
							.append(" left join customer c ")
							.append(" on c.id = b.customer_id where")
							.append(" sign_in_time ")
							.append(" between ").append(dbHelper.getString(startTimeDate))
							.append(" and ").append(dbHelper.getString(endTimeDate))
							.append(" and visits_employee_id  = ").append(employeeId)
							.append(" and goods_id = ").append(goodsId)
							.append(" group by c.attributes_id");

			rs = dbHelper.select(sql.toString());
			Integer attributes_id = null;
			Double mean = null;
			List<Double> dataList = new ArrayList<>();
			while (rs.next()) {
				//实际值
				mean = rs.getDouble("mean");
				attributes_id = rs.getInt("attributes_id");
				//attributes_id为空不做计算，考核设置没有这样的设置
				if (attributes_id != null) {
					//获取要求值
					List<String> values = (List<String>) customerTargetMap.get(attributes_id + "," + goodsId);
					if (values != null) {
						Double weighted_price = Double.valueOf(values.get(2));
						//计算比值
						dataList.add(BigDecimalArithUtils.div(mean, weighted_price));
					}
				}
			}

			//计算平均值
			Double result = 0.0;
			for (Double double1 : dataList) {
				result += BigDecimalArithUtils.add(result, double1);
			}
			return BigDecimalArithUtils.div(result, dataList.size());
		} catch (Exception e) {
			logger.error("出现异常！", e);
		} finally {
			dbHelper.close(rs);
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
	 * 计算所有产品在所有类型门店的平均加权价
	 */
	private List<Double> computeOneGoodsWeightedPriceAllCustomer() {
		if (null == goodsIdsList || goodsIdsList.size() < 1) {
			return null;
		}
		List<Double> resultList = new ArrayList<>();
		for (Integer goodsId : goodsIdsList) {
			Double result = computeOneGoodsWeightedPriceAllTypeCustomer(goodsId);
			if (result != null && !result.isNaN()) {
				resultList.add(result);
			}
		}
		return resultList;
	}

	/***
	 * 计算加权价得分（平均分）
	 * @return
	 */
	public Double computeWeightedPriceScore() {
		List<Double> resultList = computeOneGoodsWeightedPriceAllCustomer();
		Double ratio = 0.0;
		for (Double double1 : resultList) {
			ratio += BigDecimalArithUtils.add(ratio, double1);
		}
		logger.trace("最终加权价比值：" + BigDecimalArithUtils.add(ratio, resultList.size()));
		return computeScoreByRatio(BigDecimalArithUtils.add(ratio, resultList.size()), "平均加权价");
	}


	/***
	 * 计算播放次数得分
	 * @return
	 */
	private Double computePlayNumberScore() {
		StringBuilder sql = new StringBuilder();
		sql.append(" left join documents a on t.document_id = a.id ")
						.append(" where employee_id = ").append(employeeId);
		try {
			Double ratio = 0.0;
			List<Double> resultList = new ArrayList<>();
			//查询需要考核的文件的考核设置
			List<KPIEducateConfig> educateConfigList = KPIEducateConfigFactory.getInstance().getMultipleObjects("employee_id", employeeId, null);
			//计算所有文件的播放次数比值
			for (KPIEducateConfig kpiEducateConfig : educateConfigList) {
				//要求文件ID
				Integer document_id = (Integer) kpiEducateConfig.get("document_id");
				//要求最少播放时长
				Integer play_time_less_than = (Integer) kpiEducateConfig.get("play_time_less_than");
				//要求最少播放次数
				Integer play_nunmer_less_than = (Integer) kpiEducateConfig.get("play_nunmer_less_than");
				//实际播放次数
				sql.delete(0, sql.length());
				sql.append("select COUNT(*) from educate where (datediff(s,play_start_time,play_end_time)/60)>=")
								.append(play_time_less_than).append(" and  employee_id = ")
								.append(employeeId).append(" and document_id = ").append(document_id)
								.append(" and convert(char(7),play_start_time,120) = ")
								.append(String.format("'%d-%02d'", year, month));
				Integer playNumber = (Integer) dbHelper.selectOneValues(sql.toString());
				if (playNumber == null) {
					playNumber = 0;
				}
				//计算播放比值
				Double value = BigDecimalArithUtils.add(playNumber.doubleValue(), play_nunmer_less_than.doubleValue());
				resultList.add(value);


				Double minRatio = getMinRatio("播放次数");

				//记录播放次数得分记录
				kPIEducateScore educateScore = kPIEducateScoreFactory.getInstance().getNewObject(null);
				educateScore.set("document_id", document_id);
				educateScore.set("employee_id", employeeId);
				educateScore.set("year", year);
				educateScore.set("month", month);
				educateScore.set("require_play_number", play_nunmer_less_than);
				educateScore.set("play_number", playNumber);
				educateScore.set("require_ratio", minRatio);
				educateScore.set("actual_ratio", value);
				educateScore.flash();
			}

			//计算平均比值
			for (Double value : resultList) {
				ratio += BigDecimalArithUtils.add(ratio, value);
			}
			ratio = BigDecimalArithUtils.div(ratio, resultList.size());
			return computeScoreByRatio(ratio, "播放次数");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}


	/***
	 * 计算陈列面,陈列数,平均加权价得分
	 *
	 * @return
	 */
	private List<Double> computeDataScore() {
		List<Double> result = computeCountRatio();
		return result;
	}


	/***
	 * 计算一个产品在所有连锁门店陈列面,陈列数,平均加权价(平均值)
	 */
	private List<Double> computeCountRatioByData(Integer goods_id) {
		if (null == customers || customers.size() < 1) {
			return null;
		}
		List<Double> resultList = new ArrayList<>();
		Map<String, List<Double>> dataMap = new HashMap<>();//门店Id:值List
		Double display_surface_ratio = 0.0;//陈列面比值
		Double display_number_ratio = 0.0;//陈列数比值
		Double weighted_price_ratio = 0.0;//平均加权价比值
		Integer count = 0;//记录需要计算的门店数量

		for (Customer customer : customers) {
			List<Double> values = computeOneGoodsByOneCustomerDisplaySurface(customer.get("id"), goods_id);
			// 没有设置要求值,不做计算
			List<Double> dataList = new ArrayList<>();
			for (int i = 0; i < values.size(); i++) {
				if (i == 0) {
					display_surface_ratio += BigDecimalArithUtils.add(display_surface_ratio, values.get(i));
					dataList.add(values.get(i));
				} else if (i == 1) {
					display_number_ratio += BigDecimalArithUtils.add(display_number_ratio, values.get(i));
					dataList.add(values.get(i));
				} else if (i == 2) {
					weighted_price_ratio += BigDecimalArithUtils.add(weighted_price_ratio, values.get(i));
					dataList.add(values.get(i));
				}
			}

			if (values.size() > 0) {
				++count;
			}
			dataMap.put(customer.get("id").toString(), dataList);
		}

		logger.trace("一个产品在所有连锁门店陈列面,陈列数,平均加权价:" + dataMap);
		logger.trace("记录需要计算的门店数量:" + count);
		if (count > 0) {
			resultList.add(BigDecimalArithUtils.div(display_surface_ratio, count));
			resultList.add(BigDecimalArithUtils.div(display_number_ratio, count));
			resultList.add(BigDecimalArithUtils.div(weighted_price_ratio, count));
		}
		logger.trace("一个产品在所有连锁门店陈列面平均数,陈列数平均数,平均加权价的比值:" + resultList);
		return resultList;
	}

	/***
	 * 计算所有产品在所有门店陈列面,陈列数比值和平均加权价得分
	 */
	private List<Double> computeCountRatio() {
		if (null == goodsIdsList || goodsIdsList.size() < 1) {
			return null;
		}
		List<Double> resultList = new ArrayList<>();
		Map<String, List<Double>> map = new HashMap<>();
		Double display_surface_ratio = 0.0;//陈列面比值
		Double display_number_ratio = 0.0;//陈列数比值
		Double weighted_price_ratio = 0.0;//平均加权价比值
		Integer count = 0;//记录需要计算的产品数量
		for (Integer goodsId : goodsIdsList) {
			List<Double> dataList = new ArrayList<>();
			List<Double> values = computeCountRatioByData(goodsId);
			for (int i = 0; i < values.size(); i++) {
				if (i == 0) {
					display_surface_ratio += BigDecimalArithUtils.add(display_surface_ratio, values.get(i));
					dataList.add(values.get(i));
				} else if (i == 1) {
					display_number_ratio += BigDecimalArithUtils.add(display_number_ratio, values.get(i));
					dataList.add(values.get(i));
				} else if (i == 2) {
					weighted_price_ratio += BigDecimalArithUtils.add(weighted_price_ratio, values.get(i));
					dataList.add(values.get(i));
				}
			}

			if (values.size() > 0) {
				++count;
			}
			map.put(goodsId.toString(), dataList);
		}

		logger.trace("所有产品在所有门店陈列面,陈列数比值,平均加权价比值：" + map);
		logger.trace("需要计算的产品总数：" + count);
		if (count > 0) {
			resultList.add(BigDecimalArithUtils.add(display_surface_ratio, count));
			resultList.add(BigDecimalArithUtils.add(display_number_ratio, count));
			resultList.add(BigDecimalArithUtils.add(weighted_price_ratio, count));
		}

		scoreDetail.append("所有产品在所有门店陈列面,陈列数,平均加权价比值:").append(resultList).append("/n");
		logger.trace("所有产品在所有门店陈列面,陈列数比值,平均加权价比值:" + resultList);

		List<Double> newResultList = new ArrayList<>();
		String[] params = {"陈列面", "陈列数", "平均加权价"};
		for (int i = 0; i < resultList.size(); i++) {
			newResultList.add(computeScoreByRatio(resultList.get(i), params[i]));
		}
		return newResultList;
	}

	/****
	 * 查询一个产品在所有门店陈列面,陈列数，标签价(一个月的时间)
	 * 0陈列面 1陈列数 2标签价
	 */
	private Map<String, Object> queryGoodsOnCustomerData(Integer goods_id) {
		ResultSet rs = null;
		try {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Calendar calendar = Calendar.getInstance();
			calendar.set(year, month - 1, 1);
			String startTimeDate = sdf.format(calendar.getTime());
			calendar.add(Calendar.MONTH, +1);
			String endTimeDate = sdf.format(calendar.getTime());
			StringBuilder sql = new StringBuilder();
			sql.append("select t.*,c.id customer_id  from customer_visits_detail t ")
							.append(" left join customer_visits b")
							.append(" on t.visits_id = b.id")
							.append(" left join customer c")
							.append(" on c.id = b.customer_id")
							.append(" where")
							.append(" sign_in_time ")
							.append(" between ").append(dbHelper.getString(startTimeDate))
							.append(" and  ").append(dbHelper.getString(endTimeDate))
							.append(" and t.goods_id =").append(goods_id)
							.append(" and ")
							.append(" visits_employee_id  = ").append(employeeId)
							.append(" order by id asc ");

			rs = dbHelper.select(sql.toString());

			Map<String, Object> dataMap = new HashMap<>();// 产品ID:dataList
			List<Map<String, Object>> dataList = new ArrayList<>();// map
			while (rs.next()) {
				Integer customer_id = rs.getInt("customer_id");
				Map<String, Object> map = new HashMap<>();// 客户ID:values
				List<String> values = new ArrayList<>();//0 陈列面 1 陈列数 2标签价
				values.add(rs.getObject("display_surface").toString());
				values.add(rs.getObject("display_number").toString());
				values.add(rs.getObject("tag_price").toString());
				if (customer_id != null) {
					map.put(customer_id.toString(), values);
				}
				dataList.add(map);
			}

			dataMap.put(goods_id.toString(), dataList);
			return dataMap;
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			dbHelper.close(rs);
		}
		return null;
	}

	/***
	 * 获取一个产品在一个门店陈列面,陈列数,标签价
	 * 0 陈列面
	 * 1 陈列数
	 * 2标签价
	 * @return
	 */
	private List<String> getOneGoodsOneCustomerData(Integer goods_id, Integer customer_id) {
		Map<String, Object> dataMap = queryGoodsOnCustomerData(goods_id);
		for (String key : dataMap.keySet()) {// 产品ID:dataList
			List<Map<String, Object>> dataList = (List<Map<String, Object>>) dataMap.get(key);
			for (Map<String, Object> map : dataList) {// 客户ID:values
				if (map.containsKey(customer_id.toString())) {
					List<String> resultList = (List<String>) map.get(customer_id.toString());
					return resultList;
				}
			}
		}
		return null;
	}

	/***
	 * 计算一个产品在一个门店陈列面,陈列数,加权价比值
	 * @return
	 */
	private List<Double> computeOneGoodsByOneCustomerDisplaySurface(Integer customer_id, Integer goods_id) {
		List<Double> resultList = new ArrayList<>();
		// 获取一个产品在一个门店陈列面,陈列数的实际值
		List<String> values = getOneGoodsOneCustomerData(goods_id, customer_id);
		logger.trace("一个产品在一个门店陈列面,陈列数,加权价的实际值:" + values);
		scoreDetail.append("一个产品在一个门店的陈列面,加权价实际值:" + values);
		if (values == null) {
			logger.trace("获取一个产品在一个门店陈列面,陈列数,加权价的实际值失败");
			return resultList;
		}
		// 获取一个产品在一个门店陈列面,陈列数要求值
		logger.trace("获取一个产品在一个门店的门店陈列面,陈列数,加权价的要求值...");
		Customer customer = CustomerFactory.getInstance().getObject("id", customer_id);
		List<String> requireValList = getChainRequireVal(customer.get("attributes_id"), goods_id);
		logger.trace("一个产品在一个门店的门店陈列面,陈列数,加权价要求值:" + requireValList);
		if (requireValList != null) {
			logger.trace("一个产品在一个门店的门店陈列面,陈列数,加权价要求值:" + requireValList);
			scoreDetail.append("一个产品在一个门店的门店陈列面,陈列数,加权价要求值:" + requireValList);
			for (int i = 0; i < values.size(); i++) {
				Double result = BigDecimalArithUtils.div(Double.valueOf(values.get(i)), Double.valueOf(requireValList.get(i)));
				resultList.add(result);
			}

			try {
				Double display_surface_require_ratio = getMinRatio("陈列面");
				Double display_number_require_ratio = getMinRatio("陈列数");
				Double weighted_price_require_ratio = getMinRatio("平均加权价");

				//记录KPI计算记录
				KPIGoodCumsotrScore goodCumsotrScore = KPIGoodCumsotrScoreFactory.getInstance().getNewObject(null);
				goodCumsotrScore.set("goods_id", goods_id);
				goodCumsotrScore.set("customer_id", customer_id);
				goodCumsotrScore.set("display_surface", values.get(0));
				goodCumsotrScore.set("display_number", values.get(1));
				goodCumsotrScore.set("weighted_price", values.get(2));

				goodCumsotrScore.set("require_display_surface", requireValList.get(0));
				goodCumsotrScore.set("require_display_number", requireValList.get(1));
				goodCumsotrScore.set("require_weighted_price", requireValList.get(2));
				goodCumsotrScore.set("display_surface_require_ratio", display_surface_require_ratio);
				goodCumsotrScore.set("display_number_require_ratio", display_number_require_ratio);
				goodCumsotrScore.set("weighted_price_require_ratio", weighted_price_require_ratio);
				goodCumsotrScore.set("display_surface_ratio", resultList.get(0));
				goodCumsotrScore.set("display_number_ratio", resultList.get(1));
				goodCumsotrScore.set("weighted_price_ratio", resultList.get(2));

				goodCumsotrScore.set("employee_id", employeeId);
				goodCumsotrScore.set("month", month);
				goodCumsotrScore.set("year", year);
				goodCumsotrScore.flash();
			} catch (WriteValueException e) {
				logger.error("出现异常", e);
			}


		} else {
			logger.trace("获取一个产品在一个门店的门店陈列面,陈列数,加权价的要求值失败，没有设置");
		}

		logger.trace("一个产品在一个门店陈列面,陈列数,加权价比值:" + resultList);
		return resultList;
	}


	/***
	 * 根据比值计算得分 比较最低比值算得分
	 *
	 * @return
	 */
	private Double computeScoreByRatio(Double ratio, String paramName) {
		logger.trace("开始根据比值计算得分...");
		logger.trace("当前参数名称：{}", paramName);
		logger.trace("当前比值：{}", ratio);
		KPIParameter kpiParameter = getParameter(paramName);
		if (kpiParameter != null) {
			// 最低比值
			Double minRatio = kpiParameter.get("paul_at_the_end");
			logger.trace("最低比值:" + minRatio);
			// 最高分数
			Double maxScore = kpiParameter.get("max_score");
			logger.trace("最高分数:" + maxScore);
			Double total = 0.0;// 最终结果
			if (ratio > 1) {// 大于超过目标记 100%
				total = BigDecimalArithUtils.mul(1, maxScore);
				logger.trace("大于超过目标记 100%");
			} else if (ratio < minRatio) {// 小于最低比值
				total = 0.0;
				logger.trace("小于最低比值");
			} else {
				total = BigDecimalArithUtils.mul(ratio, maxScore);
			}
			logger.trace("得分:" + total);
			logger.trace("根据比值计算得分结束...");
			return total;
		} else {
			logger.trace("没有找到得分设置!");
			return 0.0;
		}
	}


	/***
	 * 获取一个产品在一个门店的要求值 0门店陈列面,1陈列数,2加权价比值
	 *
	 * @return
	 */
	private List<String> getChainRequireVal(Integer attribute_id, Integer goods_id) {
		List<String> valueList = (List<String>) customerTargetMap.get(attribute_id + "," + goods_id);
		return valueList;
	}


	/***
	 * 得到员工对应的门店拜访录入的所有产品ID的字符串. 
	 * 以1，2，4的形式给出。
	 * @return
	 */
	private static String getGoodsIds() {
		ResultSet rs = null;
		StringBuilder goodsIds = new StringBuilder();
		try {
			List<Integer> stringGoodsIds = new ArrayList<>();
			StringBuilder sql = new StringBuilder();
			sql.append("select a.goods_id from customer_visits_detail a ")
							.append(" left join customer_visits b ")
							.append(" on a.visits_id = b.id ")
							.append(" left join customer c ")
							.append(" on c.id = b.customer_id ")
							.append(" where ")
							.append(" visits_employee_id = ").append(employeeId)
							.append(" and ")
							.append(" convert(char(7),sign_in_time,120) = ")
							.append(String.format("'%d-%02d'", year, month))
							.append(" group by goods_id ");
			rs = dbHelper.select(sql.toString());
			while (rs.next()) {
				goodsIds.append(rs.getInt("goods_id") + ",");
				stringGoodsIds.add(rs.getInt("goods_id"));
			}

			if (goodsIds.length() > 0) {
				goodsIds.delete(goodsIds.length() - 1, goodsIds.length());
			}
			goodsIdsList = stringGoodsIds;

		} catch (Exception e) {
			logger.error("发生异常...", e);
		} finally {
			dbHelper.close(rs);
		}

		return goodsIds.toString();
	}

	/*****
	 * 获取门店的考核设置
	 * 0  陈列面
	 * 1 陈列数
	 * 2 加权价
	 * @param target
	 * @return
	 */
	private static Map<String, Object> getTarget(List<KPICustomerTarget> target) {
		Map<String, Object> kpiSaleTargetMap = new HashMap<>();
		for (KPICustomerTarget customerTarget : target) {
			Integer attributes_id = customerTarget.get("attributes_id");
			Integer good_id = customerTarget.get("good_id");
			Integer display_surface = customerTarget.get("display_surface");// 陈列面
			Integer display_number = customerTarget.get("display_number");// 陈列数
			Double weighted_price = customerTarget.get("weighted_price");// 加权价
			List<String> values = new ArrayList<>();
			values.add(display_surface.toString());
			values.add(display_number.toString());
			values.add(weighted_price.toString());
			kpiSaleTargetMap.put(attributes_id + "," + good_id, values);
		}
		return kpiSaleTargetMap;
	}

	/***
	 * 得到员工对应的门店ID的字符串 以1，2，4的形式给出。
	 *
	 * @return
	 */
	private static String getCustomeIds(List<Customer> list) {
		StringBuilder customeIds = new StringBuilder();
		for (Customer customer : list) {
			customeIds.append(customer.get("id") + ",");
		}

		if (customeIds.length() > 0) {
			customeIds.delete(customeIds.length() - 1, customeIds.length());
		}
		return customeIds.toString();
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
