package com.tk.objects.expression;

import org.junit.Test;

import static com.tk.objects.expression.UserExpressionTransform.USER_EXPRESSION_TRANSFORM;

public class TestValeTransform {

	@Test
	public void testtransformUser() {
		System.out.println(USER_EXPRESSION_TRANSFORM.transformUser("USERSD5R1"));
		//System.out.println(USER_EXPRESSION_TRANSFORM.transformUser("USERR2"));
		//System.out.println(USER_EXPRESSION_TRANSFORM.transformUser("USERR3"));
	}
}
