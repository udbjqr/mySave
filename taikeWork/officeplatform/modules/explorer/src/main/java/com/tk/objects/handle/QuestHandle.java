package com.tk.objects.handle;

/**
 * 此虚拟类指明查询列表对象的操作.
 * <p>
 * 所有操作类型为1的实现实均应从此类继承.
 * <p>
 * create by 17/2/10.
 *
 * @author zhengyimin
 */

public abstract class QuestHandle  extends AbstractHandle{

	protected QuestHandle(String url) {
		super(url);
	}

	/**
	 * 根据名称和表单ID,给出对应的表单的值.
	 *
	 * 此接口由所有实现类继承并实现,实现类自己知道数据存储位置以及存储方式.
	 * @param name 需要查找的表单项名称
	 * @param formId 表单的Id
	 * @return 实际的表单对象.
	 */
	public abstract Object getFormValue(String name,int formId);
}
