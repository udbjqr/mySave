package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.ResultSet;
import java.sql.SQLException;

public class ChainCustomerFactory extends AbstractPersistenceFactory<ChainCustomer> {

	private static final ChainCustomerFactory instance = new ChainCustomerFactory();
	private static Logger logger = LogManager.getLogger(ChainCustomerFactory.class.getName());

	public static ChainCustomerFactory getInstance() {
		return instance;
	}

	@Override
	protected ChainCustomer createObject(User user) {
		return new ChainCustomer(this);
	}

	private ChainCustomerFactory() {
		this.tableName = "chain_customer";

		addField("id", -1, Integer.class, null, true, true);
		addField("area_id", -1, Integer.class, null, true, false);
		addField("employee_id", -1, Integer.class, null, true, false);
		addField("china_customer_name", 300, String.class, null, true, false);
		addField("flag", 10, Integer.class, 0, true, false);
		addField("custom_type", 2, Integer.class, 1, true, false);
		addField("location", 200, String.class, null, false, false);
		addField("address", 200, String.class, null, false, false);
		addField("buyer", 20, String.class, null, false, false);
		addField("buyer_phone", 40, String.class, null, false, false);

		setWhetherAddToList(false);
		init();
	}


	/**
	 * 查询所属用户的连锁客户
	 *
	 * @param employeeId
	 * @return
	 */
	public String loadChainCustomers(int employeeId) {
		StringBuilder builder = new StringBuilder();

		String sql = "select DISTINCT  c.id from chain_customer c inner join customer c2 " +
						"on c.id = c2.chain_customer_id where employee_id = " + employeeId;
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
			logger.error("读连锁店信息异常：" + sql, e);
		} catch (Exception e) {
			logger.error("发生未知异常。", e);
		} finally {
			dbHelper.close(resultSet);
		}
		return builder.toString();
	}

}
