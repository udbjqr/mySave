package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * 对方产品与本系统产品对应
 */
public class TargetGoodsToGoodsFactory extends AbstractPersistenceFactory<TargetGoodsToGoods> {
	private static final TargetGoodsToGoodsFactory instance = new TargetGoodsToGoodsFactory();
	private static Logger logger = LogManager.getLogger(TargetGoodsToGoodsFactory.class.getName());

	public static TargetGoodsToGoodsFactory getInstance() {
		return instance;
	}

	@Override
	protected TargetGoodsToGoods createObject(User user) {
		return new TargetGoodsToGoods(this);
	}

	private TargetGoodsToGoodsFactory() {
		this.tableName = "target_goods_to_goods";

		this.sequenceField = addField("id", -1, Integer.class, null, true, true);
		this.sequenceField.setSerial("");
		
		addField("chain_customer_id", -1, Integer.class, null, true, false);
		addField("goods_id", -1, Integer.class, null, true, false);
		addField("target_goods_id", 3000, String.class, null, true, false);

		init();
	}

	/**
	 * 得到所有考核产品ID的字符串.
	 * <p>
	 * 以（1，2，4）的形式给出。
	 */
	public String loadGoodsString() {
		StringBuilder builder = new StringBuilder();

		String sql = "select id from goods g where g.is_assess=1 ;";
		ResultSet resultSet = null;
		try {
			resultSet = dbHelper.select(sql);

			builder.append("(");
			while (resultSet.next()) {
				builder.append(resultSet.getString(1)).append(",");
			}

			if (builder.length() > 1) {
				builder.delete(builder.length() - 1, builder.length()).append(")");
			}
		} catch (SQLException e) {
			logger.error("读考核产品信息异常：" + sql, e);
		} catch (Exception e) {
			logger.error("发生未知异常。", e);
		} finally {
			dbHelper.close(resultSet);
		}
		return builder.toString();
	}

	/**
	 * 得到所有考核产品ID的列表.
	 */
	public List<Integer> loadGoodsList() {
		ArrayList<Integer> goods = new ArrayList<>();
		String sql = "select id from goods g where g.is_assess=1 ;";
		ResultSet resultSet = null;
		try {
			resultSet = dbHelper.select(sql);

			while (resultSet.next()) {
				goods.add(resultSet.getInt(1));
			}
		} catch (SQLException e) {
			logger.error("读考核产品信息异常：" + sql, e);
		} finally {
			dbHelper.close(resultSet);
		}

		return goods;
	}

	/**
	 * 查询用户管理的表记录数
	 *
	 * @param employeeId 用户ID
	 * @return 查询出来的整数值
	 */
	public int getQuerySize(Integer employeeId) throws SQLException {
		return dbHelper.selectOneValues("select count(*) from " + tableName + " where is_assess = 1 ");
	}
}
