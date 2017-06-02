package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.ControlType;
import com.tk.common.persistence.User;
import com.tk.common.result.ResultCode;
import com.tk.objects.Dict;
import com.tk.objects.DictFactory;
import com.tk.objects.module.Module;
import com.tk.objects.module.ModuleFactory;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.util.List;

import static com.tk.common.Constant.repositoryService;

/**
 * 数据字典管理
 */
@WebServlet("/dict.do")
public class DictServlet extends BaseServlet {
	// 获取到数据字典工厂类
	private static DictFactory dictFactory = DictFactory.getInstance();

	private static Logger log = LogManager.getLogger(DictServlet.class.getName());

	/**
	 * servlet 初始化的时候设置权限
	 *
	 * @throws ServletException
	 */
	@Override
	public void init() throws ServletException {
//		handlePermission.put(ControlType.add, PermissionEnum.GOODS_ADD);
	}

	@Override
	protected boolean handleChilder(HttpServletRequest request, PrintWriter writer, HttpServletResponse response) {
		//获得操作类型
		ControlType controlType = (ControlType) request.getAttribute("controlType");
		if (null == controlType) {
			return false;
		}
		switch (controlType) {
			case export:
//				add();
				return true;
			default:
				return false;
		}
	}

	@Override
	protected void query(HttpServletRequest request, PrintWriter writer) {
		log.trace("获取数据字典列表信息初始...");
		User employee = (User) request.getSession().getAttribute(Constant.sessionUserAttrib);
		List<Dict> dictList = null;
		JSONArray jsonArray = new JSONArray();
		try {
//			dictList = dictFactory.getAllObjects(employee);
			dictList = dictFactory.getAllObjects(null);
			if (null != dictList && dictList.size() > 0) {
				for (Dict dict : dictList) {
					JSONObject object = new JSONObject();
					object.put("dict_id", dict.get("id"));
					object.put("dict_name", dict.get("dict_name"));
					object.put("para_name", dict.get("para_name"));
					object.put("para_value", dict.get("para_value"));
					object.put("remark", dict.get("remark"));
					jsonArray.add(object);
				}
			}
			log.trace("获取数据字典列表信息结束...");
			writer.print(new ResultCode(true, jsonArray));
		} catch (Exception e) {
			log.error("获取数据字典列表信息异常:{}！", e);
			writer.print(ResultCode.QUERY_ERROR);
		}
	}

	//添加数据字典
	@Override
	protected void add(HttpServletRequest request, PrintWriter writer) {
		log.trace("新增数据字典信息初始...");
//		User employee = (User) request.getSession().getAttribute(Constant.sessionUserAttrib);
		JSONObject dataJson = getParam(request);
		//功能名称
		String dictName;
		//参数名称
		String paraName;
		String paraValue;
		//备注
		String remark;
		try {
			dictName = dataJson.getString("dict_name");
			paraName = dataJson.getString("para_name");
			paraValue = dataJson.getString("para_value");
			remark = dataJson.getString("remark");
		} catch (Exception e) {
			log.error("获取新增数据字典信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(dictName) || StringUtils.isEmpty(paraName) || StringUtils.isEmpty(paraValue)) {
			/*moduleName = "请假流程";
			remark = "看见好看撒计划";*/
			log.trace("获取新增数据字典信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		try {
			Dict dict = dictFactory.getNewObject(null);
			dict.set("dict_name", dictName);
			dict.set("para_name", paraName);
			dict.set("para_value", paraValue);
			dict.set("remark", remark);
			dict.set("flag", 1);
			dict.flush();
			log.trace("新增数据字典信息结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("新增数据字典信息发生异常，异常描述:{}", e);
			writer.print(ResultCode.ADD_ERROR);
		}
	}

	@Override
	protected void update(HttpServletRequest request, PrintWriter writer) {
		log.trace("修改数据字典信息初始...");
		JSONObject dataJson = getParam(request);
		//数据字典名称
		String moduleName;
		String dictName;
		Integer dictId;
		//参数名称
		String paraName;
		String paraValue;
		//备注
		String remark;
		try {
			dictId = dataJson.getInteger("dict_id");
			dictName = dataJson.getString("dict_name");
			paraName = dataJson.getString("para_name");
			paraValue = dataJson.getString("para_value");
			remark = dataJson.getString("remark");
		} catch (Exception e) {
			log.error("获取修改数据字典信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == dictId || StringUtils.isEmpty(dictName) || StringUtils.isEmpty(paraName) || StringUtils.isEmpty(paraValue)) {
			log.trace("获取修改数据字典参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Dict dict = dictFactory.getObject("id", dictId);
		if (null == dict) {
			log.trace("数据ID为{} 的字典信息未找到！", dictId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		try {
			dict.set("dict_name", dictName);
			dict.set("para_name", paraName);
			dict.set("para_value", paraValue);
			dict.set("remark", remark);
			dict.flush();
			log.trace("修改数据字典信息结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("修改字典信息发生异常，异常描述:{}", e);
			writer.print(ResultCode.UPDATE_ERROR);
		}
	}

	@Override
	protected void load(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询数据字典信息初始...");
		JSONObject dataJson = getParam(request);
		//功能名称
		Integer dictId;
		try {
			dictId = dataJson.getInteger("dict_id");
		} catch (Exception e) {
			log.error("获取查询字典信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == dictId) {
			log.trace("获取查询字典信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Dict dict = dictFactory.getObject("id", dictId);
		if (null == dict) {
			log.trace("数据ID为{} 的字典信息未找到！", dictId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		JSONObject object = new JSONObject();
		object.put("dict_id", dict.get("id"));
		object.put("dict_name", dict.get("dict_name"));
		object.put("para_name", dict.get("para_name"));
		object.put("para_value", dict.get("para_value"));
		object.put("remark", dict.get("remark"));
		log.trace("查询数据字典信息结束...");
		writer.print(new ResultCode(true, object));
	}

	/**
	 * 删除流程文件信息
	 *
	 * @param request
	 * @param writer
	 */
	@Override
	protected void delete(HttpServletRequest request, PrintWriter writer) {
		log.trace("删除数据字典信息初始...");
		JSONObject dataJson = getParam(request);
		Integer dictId;
		try {
			dictId = dataJson.getInteger("dict_id");
		} catch (Exception e) {
			log.error("获取删除数据字典操作信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == dictId) {
			log.trace("获取删除数据字典操作信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Dict dict = dictFactory.getObject("id", dictId);
		if (null == dict) {
			log.trace("数据ID为{} 的字典信息未找到！", dictId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		dict.delete();
		log.trace("删除数据字典信息结束...");
		writer.print(ResultCode.NORMAL);
	}
}
