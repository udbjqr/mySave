package com.tk.servlet;

import com.tk.common.PermissionEnum;

import javax.servlet.annotation.WebServlet;

/**
 * 手机端商业客户管理
 */
@WebServlet("/chainCustomerMobile.do")
public class ChainCustomerMobileServlet extends ChainCustomerServlet {

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.load, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.update, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.getCustomerInfo, PermissionEnum.NOT_USE_PERMISSION);
	}
}
