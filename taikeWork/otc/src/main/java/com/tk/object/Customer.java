package com.tk.object;

/**
 * @author tyc
 */
public class Customer extends Store {
	Customer(CustomerFactory customerFactory) {
		super(customerFactory);
	}

	@Override
	public boolean flash() {
		boolean result = super.flash();
		EmployeeFactory factory = EmployeeFactory.getInstance();

		//更新负责人数据
		Employee employee = factory.getObject("id", get("employee_id"));
		if (employee != null) {
			employee.refreshLookOverPermission();
		}
		//更新主管数据
		employee = factory.getObject("id", get("person_in_charge_id"));
		if (employee != null) {
			employee.refreshLookOverPermission();
		}
		return result;
	}
}
