package com.tk.objects.identity;

import org.activiti.engine.ActivitiException;
import org.activiti.engine.identity.Group;
import org.activiti.engine.impl.persistence.entity.GroupEntityManager;

/**
 */
public class GroupManager extends GroupEntityManager {
	@Override
	public Group createNewGroup(String groupId) {
		throw new ActivitiException("不支持此操作。");
	}

	@Override
	public void insertGroup(Group group) {
		throw new ActivitiException("不支持此操作。");
	}

	@Override
	public void updateGroup(Group group) {
		throw new ActivitiException("不支持此操作。");
	}

	@Override
	public void deleteGroup(String groupId) {
		throw new ActivitiException("不支持此操作。");
	}
}
