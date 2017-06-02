package com.tk.servlet;

import com.tk.common.PermissionEnum;

import javax.servlet.annotation.WebServlet;

/**
 * 手机端客户管理
 */
@WebServlet("/customerMobile.do")
public class CustomerMobileServlet extends CustomerServlet {

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.load, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.update, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.getCustomerInfo, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.query, PermissionEnum.NOT_USE_PERMISSION);
	}
}
