package com.tk.objects.expression;

import org.activiti.engine.delegate.VariableScope;
import org.activiti.engine.impl.javax.el.ELContext;
import org.activiti.engine.impl.javax.el.ELResolver;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.beans.FeatureDescriptor;
import java.util.Iterator;

import static com.tk.objects.expression.FormExpressionTransform.FORM_EXPRESSION_TRANSFORM;
import static com.tk.objects.expression.UserExpressionTransform.USER_EXPRESSION_TRANSFORM;

/**
 * 对接Activiti的表达式解析器，将所有流程内需要用到的数据均从此对象获得。
 * <p>
 * 对应解析器的是
 */
public class TKResolver extends ELResolver {
	private static Logger logger = LogManager.getLogger(ExpressionManager.class.getName());
	protected VariableScope variableScope;

	public TKResolver(VariableScope variableScope) {
		this.variableScope = variableScope;
	}

	public Object getValue(ELContext context, Object base, Object property) {
		//这里获得自己处理表达式得到值的入口，并且取值由这里获得.
		logger.trace("请求表达式值：variableScope:{},context:{},base:{},property:{}", variableScope, context, base, property);
		//当请求的是人员时候的处理：
		String condition = property.toString();


		//提供指定用户的变量
		if (condition.startsWith("USER")) {
			context.setPropertyResolved(true);
			return USER_EXPRESSION_TRANSFORM.transformUser(condition);
		}

		//提供指定为流程表单数据,以FV开头.
		if(condition.startsWith("FV")){
			context.setPropertyResolved(true);
			Object result = FORM_EXPRESSION_TRANSFORM.transform(condition,variableScope);
			if(result == null){
				logger.error("未能找到对应的记录.请检查表单或者变量名.",condition);
			}
			return result;
		}

		return null;
	}

	public boolean isReadOnly(ELContext context, Object base, Object property) {
		return true;
	}

	public void setValue(ELContext context, Object base, Object property, Object value) {
		logger.error("请使用写流程数据方式进行填写相应值,此处只允许进行读取");
	}

	public Class<?> getCommonPropertyType(ELContext context, Object base) {
		return Object.class;
	}

	public Iterator<FeatureDescriptor> getFeatureDescriptors(ELContext context, Object base) {
		return null;
	}

	public Class<?> getType(ELContext context, Object base, Object property) {
		return Object.class;
	}

}
