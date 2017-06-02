package com.tk.object.KPI;

import com.tk.common.persistence.WriteValueException;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.object.Employee;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * 计算KPI的类,此类将独立计算每一个人的KPI.
 *
 * @author zhengyimin
 */

public class KPICustomCompute {
	private static final Logger logger = LogManager.getLogger(KPICustomCompute.class.getName());
	private static final KPIGoodCumsotrScoreFactory CUMSOTR_SCORE_FACTORY = KPIGoodCumsotrScoreFactory.getInstance();
	private final Employee employee;
	private final DBHelper dbHelper;
	private final int year;
	private final int month;
	private Map<String, Double> score = new HashMap<>();
	private List<KPIGoodCumsotrScore> detail = new ArrayList<>();
	private Map<Integer, Integer> goodsDistribution = new HashMap<>();
	private Map<Integer, Record> displayNumberMap = new HashMap<>();
	private Map<Integer, Record> displaySurfaceMap = new HashMap<>();
	private Map<Integer, WeightedPriceRecord> weightedPriceMap = new HashMap<>();

	public KPICustomCompute(Employee employee, int year, int month) {
		this.employee = employee;
		this.year = year;
		this.month = month;

		this.dbHelper = DBHelperFactory.getDBHelper();

		logger.trace("为用户:{}构造KPI计算对象,年:{},月:{}", employee.get("real_name"), year, month);
	}

	/**
	 * 实际执行计算的方法.
	 * <p>
	 * 通过调用此方法获得计算后的值
	 * <p>
	 * 调用此方法后,通过getScore()方法获得分值.
	 */
	public void calculate() {
		score.clear();
		goodsDistribution.clear();
		detail.clear();
		displayNumberMap.clear();
		displaySurfaceMap.clear();
		weightedPriceMap.clear();

		int customId, claimDisplaySurface, claimDisplayNumber, customAmount = 0, planId, customType,
			goodId, actualDisplaySurface, actualDisplayNumber, actualCount = 0, visitsId;
		double claimWeightedPrice, actualWeightedPrice;
		int employeeId = employee.get("id");

		ResultSet customSet = null, visitsSet;
		String sql;

		try {
			//删除上次数据库数据,并且将List当中数据flush进入数据库中.
			sql = String.format("delete from kpi_goods_customer_score where employee_id = %d and year = %d and month = %d", employeeId, year, month);
			dbHelper.update(sql);

			sql = String.format("select id as plan_id,custom_id,customer_type from customer_visits_plan where employee_id = %1$d and plan_in_time between '%2$d-%3$d-01 00:00:00' and '%2$d-%4$d-01 00:00:00' and flag = 1", employeeId, year, month, month + 1);

			//获得此操作员所有的客户对象以及定义的条件值
			customSet = dbHelper.select(sql);
			while (customSet.next()) {
				customAmount++;
				planId = customSet.getInt("plan_id");
				customId = customSet.getInt("custom_id");
				customType = customSet.getInt("customer_type");

				//判断是否存在拜访记录,如果不存在返回 -1
				sql = String.format("select top 1 * from ( select id from customer_visits v WHERE v.visits_employee_id = %1$d and sign_in_time BETWEEN '%2$d-%3$d-01 00:00:00' and '%2$d-%4$d-01 00:00:00' and v.plan_id = %5$d union ALL SELECT -1) a order by 1 desc", employeeId, year, month, month + 1, planId);

				visitsId = dbHelper.selectOneValues(sql);
				if (visitsId == -1) {
					continue; //未拜访,直接下一个.
				} else {
					//实际拜访数增加
					actualCount++;
				}

				//得到门店的拜访记录
				visitsSet = dbHelper.select("select * from customer_visits_detail where visits_id = " + visitsId);
				while (visitsSet.next()) {
					goodId = visitsSet.getInt("goods_id");
					actualDisplaySurface = visitsSet.getInt("display_surface");
					actualDisplayNumber = visitsSet.getInt("display_number");
					actualWeightedPrice = visitsSet.getDouble("tag_price");

					sql = String.format("select coalesce(e.display_number,c.display_number) as display_number,coalesce(e.display_surface,c.display_surface) as display_surface,coalesce(e.weighted_price,c.weighted_price) as weighted_price from (select good_id,attributes_id,display_number,display_surface,weighted_price from kpi_good_employee_target where employee_id = %1$d and flag = 1 and good_id = %2$d and kpi_good_employee_target.attributes_id = %3$d) e  RIGHT JOIN (select good_id,attributes_id,display_number,display_surface,weighted_price from kpi_good_customer_target ct where  flag = 1 and good_id = %2$d and ct.attributes_id = %3$d) c on e.good_id = c.good_id", employeeId, goodId, customType);

					//得到当前产品当前门店的要求值.
					ResultSet set = dbHelper.select(sql);
					if (set.next()) {
						claimDisplaySurface = customSet.getInt("display_surface");
						claimDisplayNumber = customSet.getInt("display_number");
						claimWeightedPrice = customSet.getDouble("weighted_price");
					} else {
						logger.error("未为产品:{},门店:{},门店类型:{} 设置条件.跳过", goodId, customId, customType);
						continue;
					}

					//记录铺点数
					if (goodsDistribution.containsKey(goodId)) {
						goodsDistribution.put(goodId, goodsDistribution.get(goodId) + 1);
					} else {
						goodsDistribution.put(goodId, 1);
					}

					//累加陈列面、陈列数
					cumulative(goodId, claimDisplaySurface, actualDisplaySurface, displaySurfaceMap);
					cumulative(goodId, claimDisplayNumber, actualDisplayNumber, displayNumberMap);
					cumulativeWeightedPrice(goodId, claimWeightedPrice, actualWeightedPrice, customType, weightedPriceMap);

					//生成KPI明细表,并记录
					KPIGoodCumsotrScore cumsotrScore = CUMSOTR_SCORE_FACTORY.getNewObject(null);

					try {
						cumsotrScore.set("goods_id", goodId);
						cumsotrScore.set("customer_id", customId);
						cumsotrScore.set("year", year);
						cumsotrScore.set("month", month);
						cumsotrScore.set("employee_id", employeeId);

						cumsotrScore.set("require_display_surface", claimDisplaySurface);
						cumsotrScore.set("display_surface", actualDisplaySurface);
						cumsotrScore.set("require_display_number", claimDisplayNumber);
						cumsotrScore.set("display_number", actualDisplayNumber);
						cumsotrScore.set("require_weighted_price", claimWeightedPrice);
						cumsotrScore.set("weighted_price", actualWeightedPrice);
						cumsotrScore.set("display_surface_ratio", actualDisplaySurface / claimDisplaySurface);
						cumsotrScore.set("display_number_ratio", actualDisplayNumber / claimDisplayNumber);
						cumsotrScore.set("weighted_price_ratio", actualWeightedPrice / claimWeightedPrice);

						//写入KPI明细记录.
						cumsotrScore.flash();

						detail.add(cumsotrScore);
					} catch (WriteValueException e) {
						logger.error("设置值出现异常:", e);
					}
				}

				dbHelper.close(visitsSet);
			}
		} catch (SQLException e) {
			logger.error("查询出现异常:" + e);
		} finally {
			dbHelper.close(customSet);
		}

		calculateDisplay(displayNumberMap, "陈列数");
		calculateDisplay(displaySurfaceMap, "陈列面");
		calculateWeightedPrice(weightedPriceMap, "平均加权价");
		calculateDistribution(goodsDistribution, customAmount, "铺点数");
	}

	//计算铺点数
	private void calculateDistribution(Map<Integer, Integer> distributionMap, int customAmount, String name) {
		final Integer[] amount = {0, 0};

		distributionMap.forEach((k, v) -> {
			amount[0] += v;
			amount[1] += customAmount;

		});

		writeScore(name, amount[0] / amount[1]);
	}

	//计算加权平均价
	private void calculateWeightedPrice(Map<Integer, WeightedPriceRecord> priceMap, String name) {
		final double[] amount = {0.0, 0.0}; //第一个数为比例,第二个数为累加计数器

		weightedPriceMap.forEach((key, record) -> {
			record.accumulatorActual.forEach((customType, priceMoney) -> {
				amount[1]++;
				amount[0] += priceMoney / record.claim.get(customType);
			});
		});

		writeScore(name, amount[0] / amount[1]);
	}

	private void calculateDisplay(Map<Integer, Record> displayMap, String name) {
		final Integer[] amount = {0, 0};

		displayMap.forEach((key, value) -> {
			amount[0] += value.actual;
			amount[1] += value.claim;
		});

		writeScore(name, amount[0] / amount[1]);
	}

	private void writeScore(String name, double ratio) {
		KPIParameter parameter = KPIParameterFactory.getInstrance().getObject("parameter_name", name);

		ratio = ratio < (double) parameter.get("paul_at_the_end") ? 0 : ratio;
		ratio = ratio > 1 ? 1 : ratio;

		score.put(name, ratio * (double) parameter.get("max_score"));
	}


	private void cumulativeWeightedPrice(int goodId, double claimWeightedPrice, double actualWeightedPrice, int customType, Map<Integer, WeightedPriceRecord> map) {
		if (map.containsKey(goodId)) {
			WeightedPriceRecord record = map.get(goodId);

			//要求值同一个客户类型不变,不同即增加
			record.claim.put(customType, claimWeightedPrice);
			//实际值一直累加,并增加记数
			if (record.accumulatorActual.containsKey(customType)) {
				record.accumulatorActual.put(customType, record.accumulatorActual.get(customType) + actualWeightedPrice);
				record.count++;
			} else {
				record.accumulatorActual.put(customType, actualWeightedPrice);
			}

			map.put(goodId, record);
		} else {
			map.put(goodId, new WeightedPriceRecord(customType, claimWeightedPrice, actualWeightedPrice));
		}
	}

	private void cumulative(int goodId, int claim, int actual, Map<Integer, Record> map) {
		if (map.containsKey(goodId)) {
			Record record = map.get(goodId);
			record.actual += actual;
			record.claim += claim;
			map.put(goodId, record);
		} else {
			map.put(goodId, new Record(actual, claim));
		}
	}

	public Double getScore(String name) {
		return score.get(name);
	}

	public Map<String, Double> getScore() {
		return score;
	}

	//保存陈列面、陈列数
	private class Record {
		int actual;
		int claim;

		Record(int actual, int claim) {
			this.actual = actual;
			this.claim = claim;
		}
	}

	//保存价格
	private class WeightedPriceRecord {
		Map<Integer, Double> claim = new HashMap<>();
		Map<Integer, Double> accumulatorActual = new HashMap<>();//这个值是累加的数值.
		int count;

		WeightedPriceRecord(int customType, Double claimWeightedPrice, Double actualWeightedPrice) {
			this.claim.put(customType, claimWeightedPrice);
			this.accumulatorActual.put(customType, actualWeightedPrice);
			this.count = 1;
		}
	}
}
