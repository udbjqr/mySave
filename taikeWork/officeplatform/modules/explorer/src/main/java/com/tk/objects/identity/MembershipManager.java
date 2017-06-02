package com.tk.objects.identity;


import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import org.activiti.engine.delegate.event.ActivitiEventType;
import org.activiti.engine.delegate.event.impl.ActivitiEventBuilder;
import org.activiti.engine.impl.persistence.entity.MembershipEntityManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.SQLException;

/**
 * 自定义员工与部门对应关系的数据操作方式.
 */
public class MembershipManager extends MembershipEntityManager{
	private final DBHelper dbHelper = DBHelperFactory.getDBHelper();
	private static final Logger logger = LogManager.getLogger(MembershipManager.class.getName());

	@Override
	public void createMembership(String userId, String groupId) {
		try {
			dbHelper.update(String.format("insert into link_department_employee(department_id,employee_id) values(%s,%s)", groupId, userId));
		} catch (SQLException e) {
			logger.error("执行sql语句出现异常.userid:{},depid:{}", userId, groupId, e);
			return;
		}

		if (getProcessEngineConfiguration().getEventDispatcher().isEnabled()) {
			getProcessEngineConfiguration().getEventDispatcher().dispatchEvent(
							ActivitiEventBuilder.createMembershipEvent(ActivitiEventType.MEMBERSHIP_CREATED, groupId, userId));
		}
	}

	@Override
	public void deleteMembership(String userId, String groupId) {
		try {
			dbHelper.update(String.format("delete link_department_employee where department_id = %s and employee_id = %s", groupId, userId));
		} catch (SQLException e) {
			logger.error("执行sql语句出现异常.userid:{},depid:{}", userId, groupId, e);
			return;
		}

		if (getProcessEngineConfiguration().getEventDispatcher().isEnabled()) {
			getProcessEngineConfiguration().getEventDispatcher().dispatchEvent(
							ActivitiEventBuilder.createMembershipEvent(ActivitiEventType.MEMBERSHIP_DELETED, groupId, userId));
		}
	}
}
