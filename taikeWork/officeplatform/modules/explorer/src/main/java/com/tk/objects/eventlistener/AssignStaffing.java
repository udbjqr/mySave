package com.tk.objects.eventlistener;

import com.tk.objects.identity.Employee;
import org.activiti.engine.delegate.event.ActivitiEvent;
import org.activiti.engine.delegate.event.impl.ActivitiEntityEventImpl;
import org.activiti.engine.impl.persistence.entity.TaskEntity;

import java.sql.SQLException;

import static com.tk.common.Constant.dbHelper;
import static com.tk.common.Constant.taskService;

/**
 * 根据当前任务,判断是否存在操作的用户,并进行相关处理.
 * <p>
 * 判定当前节点是否设定操作人或者候选人
 * 此节点是否已经存在操作人?
 * 是 取此操作人做为当前操作人
 * 否 取上个节点的操作人员来选择操作人
 * <p>
 * 此操作需要事件当中的实体为TaskEntity.
 *
 * @author zhengyimin
 */

public class AssignStaffing extends AbstractListenerHandler {
	private final static AssignStaffing instance = new AssignStaffing();

	public static AssignStaffing getInstance() {
		return instance;
	}

	@Override
	public void run(ActivitiEvent event, Employee employee) {
		TaskEntity taskEntity;
		Object obj = ((ActivitiEntityEventImpl) event).getEntity();
		if (obj instanceof TaskEntity) {
			taskEntity = (TaskEntity) obj;
		} else {
			logger.error("错误:事件实体非TaskEntity,需要此对象的实例.{}", obj);
			return;
		}

		//当前存在操作者或者候选人
		if ((taskEntity.getAssignee() != null && !taskEntity.getAssignee().isEmpty())
			|| !taskEntity.getCandidates().isEmpty()) {
			return;
		}

		try {
			//判断此任务是否已经操作过并且指定了操作人.""为未找到对应记录
			String employeeId = dbHelper.selectOneValues(String.format("SELECT COALESCE((SELECT employee_id from process_detail_data where execution_id = %s and task_name = %s order by id desc limit 1),'')",
				dbHelper.getString(event.getExecutionId()), dbHelper.getString(taskEntity.getName())));
			if (employeeId.equals("")) {//否 取上个节点的操作人员来选择操作人
				dbHelper.update(String.format("INSERT INTO to_set_assignee(employee_id, task_name, execution_id) VALUES (%s,%s,%s)",
					dbHelper.getString(employee.getId()),
					dbHelper.getString(taskEntity.getName()),
					dbHelper.getString(event.getExecutionId())));
			} else { // 是 取此操作人做为当前操作人
				taskService.setAssignee(taskEntity.getId(), employeeId);
			}

		} catch (SQLException e) {
			logger.error("发生异常:", e);
		}
	}
}
