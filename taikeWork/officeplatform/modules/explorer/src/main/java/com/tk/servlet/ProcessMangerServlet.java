package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.tk.common.Constant;
import com.tk.common.ControlType;
import com.tk.common.result.ResultCode;
import com.tk.objects.identity.Employee;
import com.tk.objects.module.Module;
import com.tk.objects.module.ModuleFactory;
import org.activiti.bpmn.converter.BpmnXMLConverter;
import org.activiti.bpmn.model.BpmnModel;
import org.activiti.editor.language.json.converter.BpmnJsonConverter;
import org.activiti.engine.ActivitiException;
import org.activiti.engine.repository.Deployment;
import org.activiti.engine.repository.Model;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.apache.batik.transcoder.TranscoderInput;
import org.apache.batik.transcoder.TranscoderOutput;
import org.apache.batik.transcoder.image.PNGTranscoder;
import org.apache.commons.io.IOUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.tk.common.Constant.*;
import static com.tk.objects.expression.UserExpressionTransform.USER_EXPRESSION_TRANSFORM;

/**
 * 流程配置管理
 */
@WebServlet("/processManger.do")
public class ProcessMangerServlet extends BaseServlet {
	private static Logger log = LogManager.getLogger(ProcessMangerServlet.class.getName());
	//获取到功能的工厂类
	private static ModuleFactory moduleFactory = ModuleFactory.getInstance();
	private static ObjectMapper objectMapper = new ObjectMapper();

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
			case loadStencilset:
				loadStencilset(request, writer);
				return true;
			case queryFlowField:
				queryFlowField(request, writer);
				return true;
			case suspend:
				suspend(request, writer);
				return true;
			case activate:
				activate(request, writer);
				return true;
			case deploy:
				deploy(request, writer);
				return true;
			case viewProcessPicture:
				viewProcessPicture(request, writer);
				return true;
			case queryProcess:
				queryProcess(request, writer);
				return true;
			case startProcess:
				startProcess(request, writer);
				return true;
			case deleteProcess:
				deleteProcess(request, writer);
				return true;
			case loadObjectByExpression:
				loadObjectByExpression(request, writer);
				return true;
			default:
				return false;
		}
	}

	/**
	 * 查询流程管理数据列表
	 *
	 * @param request
	 * @param writer
	 */
	@Override
	protected void query(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询流程管理数据列表初始...");
		//获得模型列表
		//		List<Model> resultList =  repositoryService.createNativeModelQuery().sql("sql").list(); //原生查询
		//查询sql
		StringBuilder sql = new StringBuilder();
		sql.append(" SELECT  m.id_ model_id, m.name_ model_name, p.id_ def_id, ");
		sql.append(" p.key_  deployment_name, p.description_ description,l.deployment_id, ");
		sql.append(" 1 isDeoloy FROM act_re_model m INNER JOIN link_model_deployment l ON l.model_id = m.id_ ");
		sql.append(" INNER JOIN act_re_procdef p ON l.deployment_id = p.deployment_id_ UNION ALL SELECT ");
		sql.append(" m.id_  model_id, m.name_ model_name, '' def_id, '' deployment_name, '' deployment_id, ");
		sql.append(" '' description, 0 isDeoloy FROM act_re_model m WHERE NOT ");
		sql.append(" exists(SELECT 1 FROM link_model_deployment l WHERE m.id_ = l.model_id); ");
		//存储数据
		JSONArray jsonArray = new JSONArray();
		ResultSet set = null;

		try {
			set = dbHelper.select(sql.toString());
			while (set.next()) {
				JSONObject object = new JSONObject();
				//模版id
				object.put("model_id", set.getString("model_id"));
				//模版名
				object.put("model_name", set.getString("model_name"));
				//流程版本ID
				object.put("def_id", set.getString("def_id"));
				//流程名
				object.put("deployment_name", set.getString("deployment_name"));
				//描述
				object.put("description", set.getString("description"));
				//流程id
				object.put("deployment_id", set.getString("deployment_id"));
				//是否已部署
				object.put("isDeoloy", set.getString("isDeoloy"));
				jsonArray.add(object);
			}
			log.trace("查询流程管理数据列表结束...");
			writer.print(new ResultCode(true, jsonArray));
		} catch (SQLException e) {
			logger.error("查询流程管理数据列表出现异常，异常描述：{}", e);
			writer.print(ResultCode.QUERY_ERROR);
		} finally {
			dbHelper.close(set);
		}
	}

	/**
	 * 点击新增的时候默认新增一个模型
	 *
	 * @param request
	 * @param writer
	 */
	@Override
	protected void add(HttpServletRequest request, PrintWriter writer) {
		try {
			ObjectNode editorNode = objectMapper.createObjectNode();
			editorNode.put("id", "canvas");
			editorNode.put("resourceId", "canvas");
			ObjectNode stencilSetNode = objectMapper.createObjectNode();
			stencilSetNode.put("namespace", "http://b3mn.org/stencilset/bpmn2.0#");
			editorNode.put("stencilset", stencilSetNode);
			Model modelData = repositoryService.newModel();

			ObjectNode modelObjectNode = objectMapper.createObjectNode();
			//默认名为“new Model”
			modelObjectNode.put("name", "new Model");
			modelObjectNode.put("revision", 1);
			modelObjectNode.put("description", "");
			modelData.setMetaInfo(modelObjectNode.toString());
			modelData.setName("new Model");
			//新增一个模型
			repositoryService.saveModel(modelData);
			repositoryService.addModelEditorSource(modelData.getId(), editorNode.toString().getBytes("utf-8"));

			JSONObject object = new JSONObject();
			object.put("model_id", modelData.getId());
			object.put("model_Name", "new Model");
			log.error("初始化新增流程定义信息结束。");
			writer.print(new ResultCode(true, object));
		} catch (Exception e) {
			log.error("初始化新增流程定义信息结束发生异常，异常描述:{}", e);
			writer.print(ResultCode.ADD_ERROR);
		}
	}

	//修改模型文件
	@Override
	protected void update(HttpServletRequest request, PrintWriter writer) {
		log.trace("修改流程定义文件操作初始...");
		JSONObject dataJson = getParam(request);
		//流程名称
		String modelId;
		String modelName;
		String description;
		String jsonXml;
		String svgXml;
		try {
			modelId = dataJson.getString("model_id");
			jsonXml = request.getParameter("json_xml");
			svgXml = request.getParameter("svg_xml");
			modelName = request.getParameter("model_name");
			description = request.getParameter("description");
		} catch (Exception e) {
			log.error("获取流程定义信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(modelId) || StringUtils.isEmpty(jsonXml) || StringUtils.isEmpty(svgXml)) {
			log.trace("获取修改操作信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}

		try {
			Model model = repositoryService.getModel(modelId);

			ObjectNode modelJson = (ObjectNode) objectMapper.readTree(model.getMetaInfo());
			modelJson.put("name", modelName);
			modelJson.put("description", description);
			model.setMetaInfo(modelJson.toString());
			model.setName(modelName);
			repositoryService.saveModel(model);
			repositoryService.addModelEditorSource(model.getId(), jsonXml.getBytes("utf-8"));
			InputStream svgStream = new ByteArrayInputStream(svgXml.getBytes("utf-8"));
			TranscoderInput input = new TranscoderInput(svgStream);
			PNGTranscoder transcoder = new PNGTranscoder();
			//设置输出流
			ByteArrayOutputStream outStream = new ByteArrayOutputStream();
			TranscoderOutput output = new TranscoderOutput(outStream);
			// Do the transformation
			transcoder.transcode(input, output);
			final byte[] result = outStream.toByteArray();
			repositoryService.addModelEditorSourceExtra(model.getId(), result);
			outStream.close();
			log.trace("修改流程定义文件操作结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("修改流程定义信息发生异常，异常描述:{}", e);
			writer.print(ResultCode.UPDATE_ERROR);
		}
	}

	protected void loadStencilset(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询流程定义文件信息初始...");
		InputStream stencilsetStream = this.getClass().getClassLoader().getResourceAsStream("stencilset.json");
		try {
			writer.print(IOUtils.toString(stencilsetStream, "utf-8"));
		} catch (Exception e) {
			throw new ActivitiException("Error while loading stencil set", e);
		}
		log.trace("查询流程定义文件信息结束...");
	}

	@Override
	protected void load(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询流程文件信息初始...");
		JSONObject dataJson = getParam(request);
		String modelId;
		try {
			modelId = dataJson.getString("model_id");
		} catch (Exception e) {
			log.error("获取查询流程文件信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(modelId)) {
			log.trace("获取查询流程文件信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		ObjectNode modelNode = null;

		Model model = repositoryService.getModel(modelId);
		if (model != null) {
			try {
				if (StringUtils.isNotEmpty(model.getMetaInfo())) {
					modelNode = (ObjectNode) objectMapper.readTree(model.getMetaInfo());
				} else {
					modelNode = objectMapper.createObjectNode();
					modelNode.put("model_name", model.getName());
				}
				modelNode.put("model_id", model.getId());
				ObjectNode editorJsonNode = (ObjectNode) objectMapper.readTree(
								new String(repositoryService.getModelEditorSource(model.getId()), "utf-8"));
				modelNode.put("model", editorJsonNode);
			} catch (Exception e) {
				log.error("查询流程定义信息发生异常，异常描述:{}", e);
				writer.print(ResultCode.LOAD_ERROR);
				return;
			}
		}
		log.trace("查询流程定义文件信息结束...");
		writer.print(new ResultCode(modelNode));
	}

	/**
	 * 根据表达式获取对象信息
	 *
	 * @param request
	 * @param writer
	 */
	protected void loadObjectByExpression(HttpServletRequest request, PrintWriter writer) {
		log.trace("根据表达式获取相关信息（部门，角色，人员）开始...");
		JSONObject dataJson = getParam(request);
		//表达式
		String nameExpression;
		try {
			nameExpression = dataJson.getString("name_expression");
		} catch (Exception e) {
			log.error("获取表达式信息信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(nameExpression)) {
			log.trace("获取查询表达式参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		if (!nameExpression.startsWith("USER")) {
			logger.error("传入的参数格式错误，请检查，{}，参数必须以USER 开头，并以_ 分隔。", nameExpression);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}

		//存储回填的部门，角色，人员信息
		List<JSONObject> jsonList;
		try {
			JSONObject resultObject = USER_EXPRESSION_TRANSFORM.transformObject(nameExpression);
			if (!(boolean) resultObject.get("success")) {
				writer.print(ResultCode.GET_FRONT_END_INFO_ERROR.addAdditionalMessage("msg", (String) resultObject.get("msg")));
				return;
			}
			jsonList = (List<JSONObject>) resultObject.get("jsonList");
			log.trace("根据表达式获取相关信息（部门，角色，人员）结束...");
			writer.print(new ResultCode(true, jsonList));
		} catch (Exception e) {
			log.error("查询流程定义信息发生异常，异常描述:{}", e);
			writer.print(ResultCode.LOAD_ERROR);
		}
	}

	/**
	 * 根据流程定义key 查看流程图片
	 *
	 * @param request
	 * @param writer
	 */
	protected void viewProcessPicture(HttpServletRequest request, PrintWriter writer) {
		log.trace("查看流程图片信息初始...");
		JSONObject dataJson = getParam(request);
		String processKey;
		try {
			processKey = dataJson.getString("process_key");
		} catch (Exception e) {
			log.error("获取查看流程图片信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(processKey)) {
			log.trace("获取查看流程图片信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}

		try {
			ProcessDefinition processDefinition = repositoryService.createProcessDefinitionQuery()
							.processDefinitionKey(processKey)
							.singleResult();
			String diagramResourceName = processDefinition.getDiagramResourceName();
			InputStream imageStream = repositoryService.getResourceAsStream(
							processDefinition.getDeploymentId(), diagramResourceName);
			writer.print(new ResultCode(true, imageStream));
			log.trace("查询流程图片信息结束...");
		} catch (Exception e) {
			log.error("查询流程图片信息发生异常，异常描述:{}", e);
			writer.print(ResultCode.LOAD_ERROR);
		}
	}

	/**
	 * 删除流程文件信息
	 *
	 * @param request
	 * @param writer
	 */
	@Override

	protected void delete(HttpServletRequest request, PrintWriter writer) {
		log.trace("删除流程文件初始...");
		JSONObject dataJson = getParam(request);
		String modelId;
		try {
			modelId = dataJson.getString("model_id");
		} catch (Exception e) {
			log.error("获取删除流程文件操作信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == modelId) {
			log.trace("获取删除流程文件操作信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		repositoryService.deleteModel(modelId);
		log.trace("删除流程文件结束...");
		writer.print(ResultCode.NORMAL);
	}

	/**
	 * 根据选择的功能ID获取字段，用来增加约束条件
	 *
	 * @param request
	 * @param writer
	 */
	protected void queryFlowField(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询约束字段初始...");
		JSONObject dataJson = getParam(request);
		String moduleIds;
		try {
			moduleIds = dataJson.getString("moduleIds");
		} catch (Exception e) {
			log.error("获取功能id组发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(moduleIds)) {
			log.trace("获取查询约束条件字段信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		String[] idArr = moduleIds.split(",");

		Map<String, JSONObject> resMap = new HashMap<>();
		for (String id : idArr) {
			Module module = moduleFactory.getObject("id", Integer.parseInt(id));
			if (null == module) {
				continue;
			}
			//获取到表单json
			JSONObject formObject = module.getFormStructure();
			if (null == formObject) {
				continue;
			}
			//获取到里面的json组
			JSONArray formJsonArry = formObject.getJSONArray("formArr");
			if (null == formJsonArry || formJsonArry.size() == 0) {
				continue;
			}
			for (Object object : formJsonArry) {
				JSONObject json = (JSONObject) object;
				//保存字段信息
				JSONObject fieldObject = new JSONObject();
				fieldObject.put(json.getString("id"), json.get("title"));
				fieldObject.put("fieldType", json.get("title"));
				resMap.put(json.getString("id"), fieldObject);
			}
		}
		log.trace("查询约束字段结束...");
		writer.print(new ResultCode(resMap));
	}

	/**
	 * 导出流程定义文件
	 *
	 * @param request
	 * @param writer
	 */
	@Override
	protected void exportFile(HttpServletRequest request, PrintWriter writer, HttpServletResponse response) {
		log.trace("导出流程文件初始...");
		JSONObject dataJson = getParam(request);
		String modelId;
		try {
			modelId = dataJson.getString("model_id");
		} catch (Exception e) {
			log.error("获取导出流程文件操作信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == modelId) {
			log.trace("获取导出流程文件操作信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		response.setCharacterEncoding("UTF-8");
		response.setContentType("application/json; charset=utf-8");
		try {
			Model modelData = repositoryService.getModel(modelId);
			BpmnJsonConverter jsonConverter = new BpmnJsonConverter();
			JsonNode editorNode = new
							ObjectMapper().readTree(repositoryService.getModelEditorSource(modelData.getId()));
			BpmnModel bpmnModel = jsonConverter.convertToBpmnModel(editorNode);
			BpmnXMLConverter xmlConverter = new
							BpmnXMLConverter();
			byte[] bpmnBytes = xmlConverter.convertToXML(bpmnModel);
			ByteArrayInputStream in = new
							ByteArrayInputStream(bpmnBytes);
			IOUtils.copy(in, response.getOutputStream());
			String filename = bpmnModel.getMainProcess().getId() + ".bpmn20.xml";
			response.setHeader("Content-Disposition", "attachment; filename=" + filename);
			response.flushBuffer();
			log.trace("导出流程文件结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("导出流程文件发生异常，异常描述:{}", e);
			writer.print(ResultCode.EXPORT_ERROR);
		}
	}

	//部署流程
	protected void deploy(HttpServletRequest request, PrintWriter writer) {
		log.trace("部署流程操作初始...");
		JSONObject dataJson = getParam(request);
		String modelId;
		try {
			modelId = dataJson.getString("model_id");
		} catch (Exception e) {
			log.error("获取流程文件ID发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(modelId)) {
			log.trace("获取流程文件ID参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		try {
			Model modelData = repositoryService.getModel(modelId);
			ObjectNode modelNode = (ObjectNode) new ObjectMapper().readTree(repositoryService.getModelEditorSource(modelData.getId()));
			byte[] bpmnBytes = null;
			BpmnModel model = new BpmnJsonConverter().convertToBpmnModel(modelNode);
			bpmnBytes = new BpmnXMLConverter().convertToXML(model);
			String processName = modelData.getName() + ".bpmn20.xml";
			Deployment deployment = repositoryService.createDeployment().name(modelData.getName()).addString(processName, new String(bpmnBytes, "utf-8")).deploy();
			System.out.println("部署ID：" + deployment.getId());//1
			System.out.println("部署时间：" + deployment.getDeploymentTime());
			log.trace("部署流程操作结束...");
			//更新模版表
			dbHelper.update(String.format("INSERT INTO link_model_deployment(model_id, deployment_id) VALUES (%s,%s);"
							, dbHelper.getString(modelId), dbHelper.getString(deployment.getId())));
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("部署流程发生异常，异常描述:{}", e);
			writer.print(ResultCode.ADD_ERROR);
		}
	}

	/**
	 * 查询流程列表
	 *
	 * @param request
	 * @param writer
	 */
	protected void queryProcess(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询流程定义列表初始...");
		List<ProcessDefinition> list = repositoryService.// 与流程定义和部署对象先相关的service
						createProcessDefinitionQuery()// 创建一个流程定义的查询
						/** 指定查询条件，where条件 */
						// .deploymentId(deploymentId) //使用部署对象ID查询
						// .processDefinitionId(processDefinitionId)//使用流程定义ID查询
						// .processDefinitionNameLike(processDefinitionNameLike)//使用流程定义的名称模糊查询

            /* 排序 */
						.latestVersion()
						// .orderByProcessDefinitionVersion().desc()
						/* 返回的结果集 */
						.list();// 返回一个集合列表，封装流程定义
		if (null == list || list.size() == 0) {
			log.trace("未查询到相关流程定义信息...");
			writer.print(ResultCode.NORMAL);
			return;
		}
		JSONArray jsonArray = new JSONArray();
		for (ProcessDefinition process : list) {
			JSONObject object = new JSONObject();
			object.put("process_id", process.getId());
			object.put("process_name", process.getName());
			object.put("process_key", process.getKey());
			object.put("version", process.getVersion());
			object.put("description", process.getDescription());
			object.put("diagram_resource_name", process.getDiagramResourceName());
			object.put("process_bpmn", process.getResourceName());
			object.put("process_png", process.getDiagramResourceName());
			object.put("deployment_id", process.getDeploymentId());
			jsonArray.add(object);
		}
		log.trace("查询流程定义列表初始...");
		writer.print(new ResultCode(true, jsonArray));
	}

	/**
	 * 启动流程
	 *
	 * @param request
	 * @param writer
	 */
	protected void startProcess(HttpServletRequest request, PrintWriter writer) {
		log.trace("启动一个流程实例初始...");
		JSONObject dataJson = getParam(request);
		Employee employee = (Employee) request.getSession().getAttribute(Constant.sessionUserAttrib);
		//流程定义的key
		String processKey;
		try {
			processKey = dataJson.getString("processKey");
		} catch (Exception e) {
			log.error("获取流程key发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(processKey)) {
			log.trace("获取修改操作信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		//设置执行人
		identityService.setAuthenticatedUserId(employee.get("login_name"));
		ProcessInstance pi = runtimeService//与正在执行的流程实例和执行对象相关的Service
						.startProcessInstanceByKey(processKey);//使用流程定义的key启动流程实例，key对应helloworld.bpmn文件中id的属性值，使用key值启动，默认是按照最新版本的流程定义启动
		System.out.println("流程实例ID:" + pi.getId());//流程实例ID
		System.out.println("流程定义ID:" + pi.getProcessDefinitionId());//流程定义ID
		writer.print(ResultCode.NORMAL);
		log.trace("启动一个流程实例结束...");
	}

	/**
	 * 暂停已部署流程
	 *
	 * @param request
	 * @param writer
	 */
	protected void suspend(HttpServletRequest request, PrintWriter writer) {
		log.trace("暂停流程定义初始...");
		JSONObject dataJson = getParam(request);
		String deploymentId;
		try {
			deploymentId = dataJson.getString("deployment_id");
		} catch (Exception e) {
			log.error("获取部署ID发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(deploymentId)) {
			log.trace("获取流程ID 缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		ProcessDefinition definition = repositoryService
						.createProcessDefinitionQuery()
						.deploymentId(deploymentId).singleResult();
		repositoryService.suspendProcessDefinitionByKey(definition.getKey());
		System.out.println("暂停流程成功！");
		writer.print(ResultCode.NORMAL);
	}

	/**
	 * 激活已暂停流程
	 *
	 * @param request
	 * @param writer
	 */
	protected void activate(HttpServletRequest request, PrintWriter writer) {
		log.trace("激活流程定义初始...");
		JSONObject dataJson = getParam(request);
		String deploymentId;
		try {
			deploymentId = dataJson.getString("deployment_id");
		} catch (Exception e) {
			log.error("获取部署ID发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(deploymentId)) {
			log.trace("获取流程ID 缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		ProcessDefinition definition = repositoryService
						.createProcessDefinitionQuery()
						.deploymentId(deploymentId).singleResult();
		repositoryService.activateProcessDefinitionByKey(definition.getKey());
		System.out.println("激活流程成功！");
		writer.print(ResultCode.NORMAL);
	}

	/**
	 * 删除已部署流程（已停止的流程）
	 *
	 * @param request
	 * @param writer
	 */
	protected void deleteProcess(HttpServletRequest request, PrintWriter writer) {
		log.trace("删除流程定义初始...");
		JSONObject dataJson = getParam(request);
		String deploymentId;
		try {
			deploymentId = dataJson.getString("deployment_id");
		} catch (Exception e) {
			log.error("获取流程定义ID发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(deploymentId)) {
			log.trace("获取流程定义ID 缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		repositoryService///与流程定义和部署对象相关的Service
						.deleteDeployment(deploymentId, true);
		System.out.println("删除成功");
		writer.print(ResultCode.NORMAL);
	}
}
