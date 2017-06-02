package com.tk.objects.expression;

import org.activiti.engine.delegate.VariableScope;
import org.activiti.engine.impl.bpmn.data.ItemInstance;
import org.activiti.engine.impl.el.ReadOnlyMapELResolver;
import org.activiti.engine.impl.el.VariableScopeElResolver;
import org.activiti.engine.impl.javax.el.*;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.Map;

/**
 * 自己定义的表达式控制类，通过此类扩展数据表达式的值
 */
public class ExpressionManager extends org.activiti.engine.impl.el.ExpressionManager {
	private static Logger logger = LogManager.getLogger(ExpressionManager.class.getName());

	public ExpressionManager() {
		super(null);
	}

	public ExpressionManager(boolean initFactory) {
		super(null, false);
	}

	public ExpressionManager(Map<Object, Object> beans) {
		super(beans, true);
	}

	public ExpressionManager(Map<Object, Object> beans, boolean initFactory) {
		super(beans, initFactory);
	}

	/**
	 * 这里是获得表达式解析器的方法，在这方法里增加自己的表达式解析器！
	 * @param variableScope 需要解析的对象
	 */
	@Override
	protected ELResolver createElResolver(VariableScope variableScope) {
		logger.debug("看到这个标志我自己写的表达式控制器已经启动。" + variableScope);
		CompositeELResolver elResolver = new CompositeELResolver();

		elResolver.add(new TKResolver(variableScope));
		elResolver.add(new VariableScopeElResolver(variableScope));

		if(beans != null) {
			elResolver.add(new ReadOnlyMapELResolver(beans));
		}

		elResolver.add(new ArrayELResolver());
		elResolver.add(new ListELResolver());
		elResolver.add(new MapELResolver());
		elResolver.add(new JsonNodeELResolver());
		elResolver.add(new DynamicBeanPropertyELResolver(ItemInstance.class, "getFieldValue", "setFieldValue"));
		elResolver.add(new BeanELResolver());
		return elResolver;
	}
}
