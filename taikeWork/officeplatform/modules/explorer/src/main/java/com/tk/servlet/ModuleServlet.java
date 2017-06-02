package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.ControlType;
import com.tk.common.persistence.User;
import com.tk.common.result.ResultCode;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.PingYinUtil;
import com.tk.objects.handle.*;
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

/**
 * 功能管理
 */
@WebServlet("/module.do")
public class ModuleServlet extends BaseServlet {
	// 获取到功能信息工厂类
	private static ModuleFactory moduleFactory = ModuleFactory.getInstance();
	//操作数据工厂类
	private static HandleDataFactory handleDataFactory = HandleDataFactory.getInstance();
	//获得数据库操作类
	DBHelper dbHelper = DBHelperFactory.getDBHelper();
	//功能绑定操作工厂类
	private static ModuleLinkHandleFactory moduleLinkHandleFactory = ModuleLinkHandleFactory.getInstance();

	private static Logger log = LogManager.getLogger(ModuleServlet.class.getName());

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
			case getHandles:
				getHandles(request, writer);
				return true;
			case queryHandelsByModuleId:
				queryHandelsByModuleId(request, writer);
				return true;
			case bindHandle:
				bindHandle(request, writer);
				return true;
			default:
				return false;
		}
	}

	@Override
	protected void query(HttpServletRequest request, PrintWriter writer) {
		log.trace("获取功能列表信息初始...");
		User employee = (User) request.getSession().getAttribute(Constant.sessionUserAttrib);
		List<Module> moduleList = null;
		JSONArray jsonArray = new JSONArray();
		try {
//			moduleList = moduleFactory.getAllObjects(employee);
			moduleList = moduleFactory.getAllObjects(null);
			if (null == moduleList || moduleList.size() == 0) {
				log.trace("未查询到相关数据");
				writer.print(ResultCode.NORMAL);
				return;
			}
			for (Module module : moduleList) {
				JSONObject object = new JSONObject();
				object.put("module_id", module.get("id"));
				object.put("module_name", module.get("module_name"));
				object.put("handle_name", getHandleNames(module.get("id")));
				object.put("create_user", module.get("create_user"));
				object.put("create_time", module.get("create_time"));
				object.put("remark", module.get("remark"));
				jsonArray.add(object);
			}
			log.trace("获取功能列表信息结束...");
			writer.print(new ResultCode(true, jsonArray));
		} catch (Exception e) {
			log.error("获取功能列表信息异常:{}！", e);
			writer.print(ResultCode.QUERY_ERROR);
		}
	}

	/**
	 * 根据功能Id获取操作列表
	 *
	 * @param request
	 * @param writer
	 */
	protected void queryHandelsByModuleId(HttpServletRequest request, PrintWriter writer) {
		log.trace("根据功能获取操作列表信息初始...");
		JSONObject dataJson = getParam(request);
		Integer moduleId;
		try {
			moduleId = dataJson.getInteger("module_id");
		} catch (Exception e) {
			log.error("获取功能id发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == moduleId) {
			log.trace("获取功能id参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		JSONArray jsonArray = new JSONArray();
		List<HandleData> dataList = null;
		try {
			dataList = handleDataFactory.getObjectsForString(" right join link_module_handle l on l.handle_id=t.id where l.module_id = " + moduleId, null);
			if (null == dataList || dataList.size() < 1) {
				writer.print(new ResultCode(true, jsonArray));
				return;
			}
			for (HandleData handle : dataList) {
				JSONObject object = new JSONObject();
				object.put("handle_id", handle.get("id"));
				object.put("handle_name", handle.get("view_name"));
				jsonArray.add(object);
			}
			log.trace("根据功能获取操作列表信息结束...");
			writer.print(new ResultCode(true, jsonArray));
		} catch (Exception e) {
			log.error("根据功能获取操作列表信息异常:{}！", e);
			writer.print(ResultCode.QUERY_ERROR);
		}
	}

	/**
	 * 根据功能Id 获取操作名
	 *
	 * @param moduleId
	 * @return
	 */
	private String getHandleNames(Integer moduleId) {
		log.trace("根据功能Id 获取操作名初始...");
		if (null == moduleId) {
			return null;
		}
		List<HandleData> dataList = null;
		StringBuffer handNames = new StringBuffer();
		try {
			dataList = handleDataFactory.getObjectsForString(" right join link_module_handle l on l.handle_id=t.id where l.module_id = " + moduleId, null);
			if (null == dataList || dataList.size() < 1) {
				return null;
			}
			for (int i = 0; i < dataList.size(); i++) {
				if (i < dataList.size() - 1) {
					handNames.append(dataList.get(i).getToString("view_name") + "、");
				} else {
					handNames.append(dataList.get(i).getToString("view_name"));
				}
			}
			log.trace("根据功能Id 获取操作名初始...");
			return handNames.toString();
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 获得操作列表（可绑定的与已绑定的列表）
	 *
	 * @param request
	 * @param writer
	 */
	protected void getHandles(HttpServletRequest request, PrintWriter writer) {
		log.trace("获取操作列表信息初始...");
		User employee = (User) request.getSession().getAttribute(Constant.sessionUserAttrib);
		JSONObject dataJson = getParam(request);
		Integer moduleId;
		try {
			moduleId = dataJson.getInteger("module_id");
		} catch (Exception e) {
			log.error("获取新增功能信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == moduleId) {
			log.trace("获取新增功能信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		//可选的
		List<HandleData> unHandleList;
		//已选的
		List<HandleData> handleList;
		JSONArray unHandArray = new JSONArray();
		JSONObject json = new JSONObject();
		try {
			//未选，可选的
			unHandleList = handleDataFactory.getObjectsForString(" where not exists( select 1 from link_module_handle l where l.handle_id = t.id and l.module_id = " + moduleId + ") or t.is_default = 1;", null);
			if (null != unHandleList && unHandleList.size() > 0) {
				for (HandleData data : unHandleList) {
					JSONObject object = new JSONObject();
					object.put("key", data.get("id"));
					object.put("title", data.get("view_name"));
					unHandArray.add(object);
				}
			}
			json.put("unHandArray", unHandArray);
			//已选的
			StringBuffer keys = new StringBuffer();
			handleList = handleDataFactory.getObjectsForString(" right join link_module_handle l on l.handle_id = t.id where l.module_id = " + moduleId, null);
			if (null != handleList && handleList.size() > 0) {
				for (int i = 0; i < handleList.size(); i++) {
					if (i < handleList.size() - 1) {
						keys.append(handleList.get(i).get("id") + ",");
					} else {
						keys.append(handleList.get(i).getToString("id"));
					}
				}
			}
			json.put("HandArray", keys.toString());
			log.trace("获取操作列表信息结束...");
			writer.print(new ResultCode(true, json));
		} catch (Exception e) {
			log.error("获取操作列表信息异常:{}！", e);
			writer.print(ResultCode.QUERY_ERROR);
		}
	}

	//添加功能
	@Override
	protected void add(HttpServletRequest request, PrintWriter writer) {
		log.trace("新增功能信息初始...");
//		User employee = (User) request.getSession().getAttribute(Constant.sessionUserAttrib);
		JSONObject dataJson = getParam(request);
		//功能名称
		String moduleName;
		//表单信息
		JSONObject form_structure;
		//备注
		String remark;
		try {
			moduleName = dataJson.getString("module_name");
			form_structure = dataJson.getJSONObject("form_structure");
			remark = dataJson.getString("remark");
		} catch (Exception e) {
			log.error("获取新增功能信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(moduleName)) {
			/*moduleName = "请假流程";
			remark = "看见好看撒计划";*/
			log.trace("获取新增功能信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		try {
			Module module = moduleFactory.getNewObject(null);
			module.set("module_name", moduleName);
			module.set("form_structure", form_structure);
			module.set("remark", remark);
			module.set("flag", 1);
			module.flush();
			log.trace("新增功能信息结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("新增功能信息发生异常，异常描述:{}", e);
			writer.print(ResultCode.ADD_ERROR);
		}
	}

	//绑定操作
	protected void bindHandle(HttpServletRequest request, PrintWriter writer) {
		log.trace("绑定功能操作信息初始...");
//		User employee = (User) request.getSession().getAttribute(Constant.sessionUserAttrib);
		JSONObject dataJson = getParam(request);
		//功能名称
		Integer moduleId;
		//操作
		String handIds;
		try {
			moduleId = dataJson.getInteger("module_id");
			handIds = dataJson.getString("handIds");
		} catch (Exception e) {
			log.error("获取绑定操作信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == moduleId || StringUtils.isEmpty(handIds)) {
			log.trace("获取绑定功能操作信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		String[] handIdArr = handIds.split(",");
		try {
			if (handIdArr.length > 0) {
				//先删除，再插入
				dbHelper.update("DELETE FROM link_module_handle WHERE module_id = " + moduleId);
				for (int i = 0; i < handIdArr.length; i++) {
					ModuleLinkHandle moduleLinkHandle = moduleLinkHandleFactory.getNewObject(null);
					moduleLinkHandle.set("module_id", moduleId);
					moduleLinkHandle.set("handle_id", Integer.valueOf(handIdArr[i]));
					moduleLinkHandle.flush();
				}
			}
			log.trace("绑定功能操作信息结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("绑定功能操作发生异常，异常描述:{}", e);
			writer.print(ResultCode.ADD_ERROR);
		}
	}

	@Override
	protected void update(HttpServletRequest request, PrintWriter writer) {
		log.trace("修改功能信息初始...");
		JSONObject dataJson = getParam(request);
		//功能名称
		String moduleName;
		Integer moduleId;
		//表单信息
		JSONObject formJson;
		//备注
		String remark;
		try {
			moduleId = dataJson.getInteger("module_id");
			moduleName = dataJson.getString("module_name");
			formJson = dataJson.getJSONObject("form_structure");
			remark = dataJson.getString("remark");
		} catch (Exception e) {
			log.error("获取修改功能信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == moduleId || StringUtils.isEmpty(moduleName)) {
			log.trace("获取新增功能信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Module module = moduleFactory.getObject("id", moduleId);
		if (null == module) {
			log.trace("功能ID为{} 的信息未找到！", moduleId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		//创建一个临时保存json组
		JSONArray formArrTmp = new JSONArray();
		//找到表单的json
		if (null != formJson) {
			JSONArray formArr = formJson.getJSONArray("formArr");
			Boolean isChange = false;
			//找到所有字段
			if (null != formArr && formArr.size() > 0) {
				for (Object object : formArr) {
					JSONObject json = (JSONObject) object;
					String id = json.getString("id");
					if (StringUtils.isNotEmpty(id)) {
						formArrTmp.add(json);
						continue;
					}
					//设置ID
					json.put("id", moduleId + "_" + PingYinUtil.getFullSpell(json.getString("title")));
					//新的字段存储进去
					formArrTmp.add(json);
					isChange = true;
				}
			}
			if (isChange) {
				formJson.remove("formArr");
				formJson.put("formArr", formArrTmp);
			}
		}

		try {
			module.set("module_name", moduleName);
			module.set("form_structure", formJson);
			module.set("remark", remark);
			module.flush();
			log.trace("修改功能信息结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("修改功能信息发生异常，异常描述:{}", e);
			writer.print(ResultCode.UPDATE_ERROR);
		}
	}

	@Override
	protected void load(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询功能信息初始...");
		JSONObject dataJson = getParam(request);
		//功能名称
		Integer moduleId;
		try {
			moduleId = dataJson.getInteger("module_id");
		} catch (Exception e) {
			log.error("获取查询功能信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == moduleId) {
			log.trace("获取查询新增功能信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Module module = moduleFactory.getObject("id", moduleId);
		if (null == module) {
			log.trace("功能ID为{} 的信息未找到！", moduleId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		JSONObject object = new JSONObject();
		object.put("module_id", module.get("id"));
		object.put("module_name", module.get("module_name"));
		object.put("form_structure", module.get("form_structure"));
		object.put("remark", module.get("remark"));
		log.trace("查询功能信息结束...");
		writer.print(new ResultCode(true, object));
	}

	@Override
	protected void delete(HttpServletRequest request, PrintWriter writer) {
		log.trace("删除功能信息初始...");
		JSONObject dataJson = getParam(request);
		//功能名称
		Integer moduleId;
		try {
			moduleId = dataJson.getInteger("module_id");
		} catch (Exception e) {
			log.error("获取删除功能信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == moduleId) {
			log.trace("获取删除新增功能信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Module module = moduleFactory.getObject("id", moduleId);
		if (null == module) {
			log.trace("功能ID为{} 的信息未找到！", moduleId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		//删除功能与操作关联表
		List<ModuleLinkHandle> linkHandleList;
		try {
			linkHandleList = moduleLinkHandleFactory.getObjectsForString(" where t.module_id =" + moduleId, null);
			if (null != linkHandleList && linkHandleList.size() > 0) {
				for (ModuleLinkHandle moduleLinkHandle : linkHandleList) {
					moduleLinkHandle.delete();
				}
			}
		} catch (Exception e) {
			log.trace("根据功能ID删除功能操作关联表发生异常，异常描述:{}", e);
		}
		module.delete();
		writer.print(ResultCode.NORMAL);
	}
}
