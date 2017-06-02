package com.tk.objects.handle;


import com.alibaba.fastjson.JSONObject;
import com.tk.common.persistence.User;
import com.tk.common.result.ResultCode;
import com.tk.objects.ProcessData;
import com.tk.objects.module.Module;
import org.activiti.engine.task.Task;

/**
 * 操作接口.
 * <p>
 * 所有从此接口继承的实体类都必须有一个无参数构造函数。
 */
public interface Handle {

	//设置返回页面
	abstract void setUrl(String url);

	//得到返回页面
	abstract String getUrl();
	/**
	 * 由流程调用此方法,操作的入口.
	 *
	 * @param module      指定的模块
	 * @param task        指定的任务
	 * @param processData 流程数据对象，此对象保存所有流程的数据
	 * @param jsonData    此次需要操作的数据
	 * @return 返回一个错误提示，正常结束返回
	 */
	ResultCode run(User user, Task task, Module module, ProcessData processData, JSONObject jsonData);

	/**
	 * 对操作做回退操作
	 */
	void undo();

	/**
	 * 返回此操作的ID号.
	 *
	 * @return id号码
	 */
	int getId();
}
