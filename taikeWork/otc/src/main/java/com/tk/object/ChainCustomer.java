package com.tk.object;

public class ChainCustomer extends Store{

	protected ChainCustomer(ChainCustomerFactory factory) {
		super(factory);
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

		return result;
	}
}
