package com.tk.common.sql;

import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * 数据操作对象，此对象直接对相关数据库进行操作.
 */
public interface DBHelper {
	/**
	 * 执行一个更新或者删除操作.
	 *
	 * @param sql 要执行的sql语句.
	 * @return 成功影响的条数
	 */
	int update(String sql) throws SQLException;


	/**
	 * 执行一个只返回单个值的select语句,此操作不需要关闭动作.
	 *
	 * @param sql 需要执行的sql语句
	 * @param <T> 需要返回的结果集数据。
	 * @return 执行结果的一个单独的值
	 */
	<T> T selectOneValues(String sql) throws SQLException;

	/**
	 * 执行一个查询过程,使用完毕必须使用close()来关闭.
	 * <p>
	 * 必须使用{@link #close(ResultSet)}方法将得到的数据集关闭。未关闭将导致数据连接一直存在而无法提供相应的服务。
	 *
	 * @param sql 需要执行的查询语句.
	 * @return 一个结果集.用完此结果集需要调用close()过程进行关闭操作.
	 */
	ResultSet select(String sql) throws SQLException;

	/**
	 * 关闭一个结果集对应的所有对象.
	 * <p>
	 * 见{@link #select(String)}
	 *
	 * @param set 本对象返回的结果集.
	 */
	void close(ResultSet set);

	/**
	 * 执行一系列sql语句.
	 * <p>
	 * 此方法将采用事务保证数据的一致性。
	 *
	 * @param sqlStrings 需要执行的sql语句集合，数组每一个元素存储一条语句。
	 */
	void execBatchSql(String[] sqlStrings) throws SQLException;

	/**
	 * 执行一系列sql语句,并且返回一个单一的值.
	 * <p>
	 * 此方法将采用事务保证数据的一致性。
	 * <p>
	 * 调用此方法需要保证传入的sql语句大于等于2条。
	 * <p>
	 * 调用此方法需要保证传入的sql语句前几句都不返回值，最后一条返回一个int值。
	 *
	 * @param sqlStrings 需要执行的sql语句集合，数组每一个元素存储一条语句。
	 */
	<T> T execBatchSqlWithOneValue(String[] sqlStrings) throws SQLException;

	/**
	 * 将对象转换成sql语句支持的格式
	 *
	 * @param obj
	 * @return
	 */
	String getString(Object obj);
}
