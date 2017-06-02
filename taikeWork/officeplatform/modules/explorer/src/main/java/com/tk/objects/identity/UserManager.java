package com.tk.objects.identity;

				import com.tk.common.util.StringUtil;
				import org.activiti.engine.ActivitiException;
				import org.activiti.engine.identity.User;
				import org.activiti.engine.impl.persistence.entity.UserEntityManager;

public class UserManager extends UserEntityManager {
	private static final EmployeeFactory factory = EmployeeFactory.getInstance();

	@Override
	public User createNewUser(String userId) {
		throw new ActivitiException("不支持此操作。");
	}

	@Override
	public void insertUser(User user) {
		throw new ActivitiException("不支持此操作。");
	}

	@Override
	public void updateUser(User user) {
		throw new ActivitiException("不支持此操作。");
	}

	@Override
	public void deleteUser(String loginName) {
		throw new ActivitiException("不支持此操作。");
	}


	@Override
	public Boolean checkPassword(String loginName, String password) {
		Employee employee = factory.getObject("login_name", loginName);
		return StringUtil.matchPasswd(password, employee.get("password"));
	}
}
