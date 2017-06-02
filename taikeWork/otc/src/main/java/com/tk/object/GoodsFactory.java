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
 * 商品对象的工厂类。
 */
public class GoodsFactory extends AbstractPersistenceFactory<Goods> {
	private static final GoodsFactory instance = new GoodsFactory();
	private static Logger logger = LogManager.getLogger(GoodsFactory.class.getName());

	public static GoodsFactory getInstance() {
		return instance;
	}

	@Override
	protected Goods createObject(User user) {
		return new Goods(this);
	}

	private GoodsFactory() {
		this.tableName = "goods";

		addField("id", -1, Long.class, null, true, true);
		addField("goods_name", 200, String.class, null, true, false);
		addField("specification", 2000, String.class, null, true, false);
		addField("image_URL", 2000, String.class, null, false, false);
		addField("supplier_id", 10, Integer.class, null, true, false);
		addField("manual", -1, String.class, null, false, false);
		addField("is_assess", 10, Integer.class, null, true, false);
		addField("flag", 10, Integer.class, null, false, false);

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
