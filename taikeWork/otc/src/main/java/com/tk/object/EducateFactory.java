package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.sql.SQLException;
import java.util.Date;


public class EducateFactory extends AbstractPersistenceFactory<Educate> {
	private static final EducateFactory instance = new EducateFactory();

	public static EducateFactory getInstance() {
		return instance;
	}

	@Override
	protected Educate createObject(User user) {
		return new Educate(this);
	}

	private EducateFactory() {
		this.tableName = "educate";
		this.sequenceField = addField("id", -1, Integer.class, null, true, true);
		sequenceField.setSerial("");

		addField("document_id", 10, Integer.class, null, true, false);
		addField("employee_id", 10, Integer.class, null, true, false);
		addField("play_start_time", 20, Date.class, "new Date()", true, false);
		addField("play_end_time", 20, Date.class, null, true, false);
		addField("flag", 10, Integer.class, null, true, false);

		setWhetherAddToList(false);
		init();
	}

	/**
	 * 查询用户管理的表记录数
	 *
	 * @param employeeId 用户ID
	 * @return 查询出来的整数值
	 */
	public int getQuerySize(Integer employeeId) throws SQLException {
		return dbHelper.selectOneValues("select count(*) from " + tableName + " where employee_id =" + employeeId);
	}
}
