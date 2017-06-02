package com.tk.servlet;

import com.google.code.kaptcha.Constants;
import com.tk.common.Constant;
import com.tk.object.EmployeeFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

import javax.servlet.annotation.WebServlet;

import org.apache.commons.lang.StringUtils;


/**
 * 后台用户登录操作.
 */
@WebServlet("/mangerLogin.do")
public class MangerLogin extends BaseServlet {
	@Override
	protected void handle() {
		String name, password, validateCode;

		try {
			name = dataJson.get("loginName").toString();
			password = dataJson.get("passWord").toString();
			validateCode = dataJson.get("validateCode").toString();
			String validateCodeValue = (String) request.getSession().getAttribute(Constants.KAPTCHA_SESSION_KEY);

			if (StringUtils.isBlank(validateCode)) {
				writer.print(ErrorCode.VALIDTE_CODE_IS_BANK);
				return;
			} else if (StringUtils.isBlank(validateCodeValue) || !validateCodeValue.equalsIgnoreCase(validateCode)) {
				writer.print(ErrorCode.VALIDTE_CODE_ERROR);
				return;
			}

			if (employee != null) {
				logger.warn("已经有用户登录,请先退出!");
				writer.print(ErrorCode.SESSION_HAS_USER_LOGIN);
				return;
			}


			employee = EmployeeFactory.getInstance().getObject("login_name", name);
			if (employee == null || !employee.login(password)) {
				logger.info("用户名或密码错!");
				writer.print(ErrorCode.ACCOUNT_PASSWORD_DOES_NOT_MATCH);
				return;
			}

			Integer flag = employee.get("flag");
			//判断是否停用
			if (0 == flag) {
				logger.info("当前用户已停用！!");
				writer.print(ErrorCode.USER_DISABLE);
				return;
			}

			session.setAttribute(Constant.sessionUserAttrib, employee);

			//返回数据
			SuccessJSON success = new SuccessJSON();
			success.put("employeeId", employee.get("id"));
			success.put("realName", employee.get("real_name"));
			writer.print(success);
		} catch (NullPointerException e) {
			logger.error("获得参数错误:", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
		} catch (Exception e) {
			logger.error("出现未知错误", e);
			writer.print(ErrorCode.UNKNOWN_ERROE);
		}
	}


	@Override
	protected void setHandlePermission() {

	}

	@Override
	protected void queryAll() {

	}

	@Override
	protected void delete() {

	}

	@Override
	protected void update() {

	}

	@Override
	protected void query() {

	}

	@Override
	protected void load() {

	}

	@Override
	protected void add() {

	}
}
