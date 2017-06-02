package com.tk.common.persistence;

import com.tk.common.PermissionEnum;
import com.tk.object.Employee;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Date;

/**
 * 用户日志对象工厂类.
 */
public class HandleLogFactory extends AbstractPersistenceFactory<HandleLog> {
	private static final Logger logger = LogManager.getLogger(HandleLogFactory.class.getName());
	private static final HandleLogFactory instance = new HandleLogFactory();

	public static HandleLogFactory getInstance() {
		return instance;
	}

	private HandleLogFactory() {
		this.tableName = "handle_log";
		this.sequenceField = addField("id", -1, Integer.class, "nextval('seq_handle_log')", true, true);
		sequenceField.setSerial("seq_handle_log");

		addField("create_time", 20, Date.class, "now()", true, false);
		addField("log_text", Integer.MAX_VALUE, String.class, null, true, false);
		addField("handle_man", 10, Integer.class, null, true, false);
		addField("real_name", 20, String.class, null, true, false, true);

		init();
		//不记录缓冲区
		super.setWhetherAddToList(false);
	}

	@Override
	protected void init() {
		this.wherePrimaryKeys = "";
		this.updateStr = "";
		this.deleteStr = "";
		this.selectStr = "select l.*,e.real_name from  handle_log l inner join employee e on l.handle_man = e.id";

		setInsertStr();
	}

	@Override
	public HandleLog getNewObject(User user) {
		logger.error("不支持此方法的调用,请使用addHandleLog方法。");
		return null;
	}

	@Override
	protected HandleLog createObject(User user) {
		return new HandleLog(this);
	}

	/**
	 * 得到一个日志记录对象，并将此对象记入数据持久层.
	 *
	 * @param employee   操作员对象，表示执行此操作的操作员。
	 * @param permission 操作权限对象。
	 * @param object     操作的数据对象
	 * @return 已经写入持久层的日志对象。
	 */
	public HandleLog addHandleLog(Employee employee, PermissionEnum permission, Persistence object) {
		HandleLog handleLog = createObject(employee);

		try {
			handleLog.set("handle_man", employee.get("id"));
			handleLog.set("real_name", employee.get("real_name"));
			if (object == null) {
				handleLog.set("log_text", permission.getHandleName());
			} else {
				handleLog.set("log_text", object.getHandleLogValue(permission));
			}

			handleLog.flash();
		} catch (WriteValueException e) {
			logger.error("写入数据有误.", e);
		}

		return handleLog;
	}

	@Override
	protected void setWhetherAddToList(boolean addToList) {
		logger.warn("不支持此方法的调用。");
	}
}
