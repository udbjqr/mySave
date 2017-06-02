package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.ControlType;
import com.tk.common.result.ResultCode;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.DateUtil;
import com.tk.objects.identity.*;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static com.tk.common.Constant.dbHelper;

/**
 * 部门管理
 */
@WebServlet("/department.do")
public class DepartmentServlet extends BaseServlet {
	// 获取到部门工厂类
	private static DepartmentFactory departmentFactory = DepartmentFactory.getInstance();
	//角色工厂类
	private static RoleFactory roleFactory = RoleFactory.getInstance();
	//人员工厂类
	private static EmployeeFactory employeeFactory = EmployeeFactory.getInstance();
	//部门角色关联表
	private static DeptLinkRoleFactory deptLinkRoleFactory = DeptLinkRoleFactory.getInstance();
	//部门角色人员关联表
	private static DeptLinkRoleLinkEmployeeFactory deptLinkRoleLinkEmployeeFactory = DeptLinkRoleLinkEmployeeFactory.getInstance();

	private static Logger log = LogManager.getLogger(DepartmentServlet.class.getName());

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
			case getAllDeptByTree:
				getAllDeptByTree(request, writer);
				return true;
			case getRoleByDeptId:
				getRoleByDeptId(request, writer);
				return true;
			case getUserByDeptAndrole:
				getUserByDeptAndrole(request, writer);
				return true;
			case getSingleFloorByTree:
				getSingleFloorByTree(request, writer);
				return true;
			case checkRoleExistOnDept:
				checkRoleExistOnDept(request, writer);
				return true;
			case getEmployeeByDeptAndrole:
				getEmployeeByDeptAndrole(request, writer);
				return true;
			case updateDeptLinkRole:
				updateDeptLinkRole(request, writer);
				return true;
			case updateDeptAndRolelinkEmployee:
				updateDeptAndRolelinkEmployee(request, writer);
				return true;
			default:
				return false;
		}
	}

	@Override
	protected void query(HttpServletRequest request, PrintWriter writer) {
		log.trace("获取部门列表信息初始...");
//		User employee = (User) request.getSession().getAttribute(Constant.sessionUserAttrib);
		List<Department> departmentList = null;
		JSONArray jsonArray = new JSONArray();
		try {
			departmentList = departmentFactory.getAllObjects(null);
			if (null != departmentList && departmentList.size() > 0) {
				for (Department department : departmentList) {
					JSONObject object = new JSONObject();
					object.put("dept_id", department.get("id"));
					object.put("dept_name", department.get("dept_name"));
					object.put("administrator_id", department.get("administrator_id"));
					object.put("parent_id", department.get("parent_id"));
					object.put("create_time", DateUtil.formatDate(department.get("create_time"), Constant.DATEFORMAT));
					object.put("dept_type", department.get("dept_type"));
					object.put("revision", department.get("revision"));
					object.put("remark", department.get("remark"));
					jsonArray.add(object);
				}
			}
			log.trace("获取部门列表信息结束...");
			writer.print(new ResultCode(true, jsonArray));
		} catch (Exception e) {
			log.error("获取部门列表信息异常:{}！", e);
			writer.print(ResultCode.QUERY_ERROR);
		}
	}

	@Override
	protected void add(HttpServletRequest request, PrintWriter writer) {
		log.trace("新增部门信息初始...");
//		User employee = (User) request.getSession().getAttribute(Constant.sessionUserAttrib);
		JSONObject dataJson = getParam(request);
		//部门名称
		String deptName;
		//参数名称
		Integer parentId;
		Integer administratorId;
		//
		String revision;

		String deptType;
		//备注
		String remark;
		try {
			administratorId = dataJson.getInteger("administrator_id");
			parentId = dataJson.getInteger("parent_id");
//			revision = dataJson.getString("revision");
			deptType = dataJson.getString("deptType");
			deptName = dataJson.getString("dept_name");
			remark = dataJson.getString("remark");
		} catch (Exception e) {
			log.error("获取新增部门信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(deptName)) {
			log.trace("获取新增部门信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		if (0 == parentId) {
			parentId = null;
		}
		try {
			Department department = departmentFactory.getNewObject(null);
			department.set("administrator_id", administratorId);
//			department.set("revision", revision);
			department.set("dept_type", deptType);
			department.set("dept_name", deptName);
			department.set("parent_id", parentId);
			department.set("create_time", new Date(System.currentTimeMillis()));
			department.set("remark", remark);
			department.set("flag", 1);
			department.flush();
			log.trace("新增部门信息结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("新增部门信息发生异常，异常描述:{}", e);
			writer.print(ResultCode.ADD_ERROR);
		}
	}

	@Override
	protected void update(HttpServletRequest request, PrintWriter writer) {
		log.trace("修改部门信息初始...");
		JSONObject dataJson = getParam(request);
		//部门名称
		String deptName;
		Integer deptId;
		//参数名称
		Integer parentId;
		Integer administratorId;
		//
		String revision;
		//部门类型
		String deptType;
		//备注
		String remark;
		try {
			deptId = dataJson.getInteger("dept_id");
			deptName = dataJson.getString("dept_name");
			parentId = dataJson.getInteger("parent_id");
			administratorId = dataJson.getInteger("administrator_id");
			deptType = dataJson.getString("dept_type");
//			revision = dataJson.getString("revision");
			remark = dataJson.getString("remark");
		} catch (Exception e) {
			log.error("获取修改数据字典信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == deptId || StringUtils.isEmpty(deptName)) {
			log.trace("获取修改部门参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Department department = departmentFactory.getObject("id", deptId);
		if (null == department) {
			log.trace("部门ID为：{} 的信息未找到！", deptId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		try {
			department.set("dept_name", deptName);
			department.set("administrator_id", administratorId);
//			department.set("revision", revision);
			department.set("dept_type", deptType);
			department.set("parent_id", parentId);
			department.set("remark", remark);
			department.flush();
			log.trace("修改部门信息结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("修改部门发生异常，异常描述:{}", e);
			writer.print(ResultCode.UPDATE_ERROR);
		}
	}

	/**
	 * 更新部门角色对应表
	 *
	 * @param request
	 * @param writer
	 */
	protected void updateDeptLinkRole(HttpServletRequest request, PrintWriter writer) {
		log.trace("修改部门对应角色初始...");
		JSONObject dataJson = getParam(request);
		//部门选中角色
		String roleIds;
		Integer deptId;
		try {
			deptId = dataJson.getInteger("dept_id");
			roleIds = dataJson.getString("roleIds");
		} catch (Exception e) {
			log.error("获取修改数据字典信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == deptId) {
			log.trace("获取修改部门参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Department department = departmentFactory.getObject("id", deptId);
		if (null == department) {
			log.trace("部门ID为：{} 的信息未找到！", deptId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}

		/**
		 * 这边，因存在角色部门人员表，假如如要更新角色部门表
		 * 1、先删除 角色人员部门里面的同一个部门，却不存在勾选的角色的人员绑定信息
		 * 2，循环角色ID
		 */

		try {

			//先删除部门角色关联表
			dbHelper.update("DELETE FROM link_department_role where department_id= " + deptId);

			//如果未勾选角色，直接返回成功
			if (StringUtils.isEmpty(roleIds)) {
				//删除部门角色人员关联表
				dbHelper.update("DELETE FROM link_department_role_employee where department_id= " + deptId);
				writer.print(ResultCode.NORMAL);
				return;
			}
			//先删除部门角色人员关联表
			dbHelper.update("DELETE FROM link_department_role_employee where role_id not in (" + roleIds + ") ");

			//否则更新部门角色表
			String[] roleArr = roleIds.split(",");
			if (roleArr.length > 0) {
				for (String roleId : roleArr) {
					DeptLinkRole deptLinkRole = deptLinkRoleFactory.getNewObject(null);
					deptLinkRole.set("department_id", deptId);
					deptLinkRole.set("role_id", Integer.parseInt(roleId));
					deptLinkRole.flush();
				}
			}
			log.trace("修改部门角色信息结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("修改部门角色发生异常，异常描述:{}", e);
			writer.print(ResultCode.UPDATE_ERROR);
		}
	}

	/**
	 * 修改部门
	 *
	 * @param request
	 * @param writer
	 */
	protected void updateDeptAndRolelinkEmployee(HttpServletRequest request, PrintWriter writer) {
		log.trace("修改部门信息初始...");
		JSONObject dataJson = getParam(request);
		Integer deptId;
		//参数名称
		Integer roleId;
		String employeeIds;
		try {
			deptId = dataJson.getInteger("dept_id");
			roleId = dataJson.getInteger("role_id");
			employeeIds = dataJson.getString("employeeIds");
		} catch (Exception e) {
			log.error("获取修改部门角色绑定人员发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == deptId || null == roleId) {
			log.trace("获取修改修改部门角色绑定人员参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Department department = departmentFactory.getObject("id", deptId);
		if (null == department) {
			log.trace("部门ID为：{} 的信息未找到！", deptId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		Role role = roleFactory.getObject("id", roleId);
		if (null == role) {
			log.trace("角色ID为：{} 的信息未找到！", deptId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		try {
			//清空部门角色关联人员
			dbHelper.update("DELETE FROM link_department_role_employee where department_id= " + deptId + " and role_id =" + roleId);
//			dbHelper.update("DELETE FROM link_department_role where department_id= " + deptId + " and role_id =" + roleId);
			//如果未勾选角色，直接返回成功
			if (StringUtils.isEmpty(employeeIds)) {
				writer.print(ResultCode.NORMAL);
				return;
			}
			//否则插入新数据
			String[] userArr = employeeIds.split(",");
			if (userArr.length > 0) {
				for (String userId : userArr) {
					//新增角色部门人员关联信息
					DeptLinkRoleLinkEmployee deptLinkRoleLinkEmployee = deptLinkRoleLinkEmployeeFactory.getNewObject(null);
					deptLinkRoleLinkEmployee.set("department_id", deptId);
					deptLinkRoleLinkEmployee.set("role_id", roleId);
					deptLinkRoleLinkEmployee.set("employee_id", Integer.parseInt(userId));
					deptLinkRoleLinkEmployee.flush();
				}
			}
			log.trace("修改部门角色所属人员信息结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("修改部门角色所属人员发生异常，异常描述:{}", e);
			writer.print(ResultCode.UPDATE_ERROR);
		}
	}

	@Override
	protected void load(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询部门信息初始...");
		JSONObject dataJson = getParam(request);
		//部门ID
		Integer departmentId;
		try {
			departmentId = dataJson.getInteger("dept_id");
		} catch (Exception e) {
			log.error("获取查询部门参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == departmentId) {
			log.trace("获取查询部门信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Department department = departmentFactory.getObject("id", departmentId);
		if (null == department) {
			log.trace("部门ID为{} 的信息未找到！", departmentId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		Integer administratorId = department.get("administrator_id");
		JSONObject object = new JSONObject();
		object.put("dept_id", department.get("id"));
		object.put("dept_name", department.get("dept_name"));
		object.put("parent_id", department.get("parent_id"));
		object.put("administrator_id", administratorId);
		object.put("administrator_name", administratorId == null ? "" : employeeFactory.getObject("id", administratorId).get("real_name"));
		object.put("create_time", department.get("create_time"));
		object.put("dept_type", department.get("dept_type"));
		object.put("revision", department.get("revision"));
		object.put("remark", department.get("remark"));
		log.trace("查询部门信息结束...");
		writer.print(new ResultCode(true, object));
	}

	/**
	 * 删除部门信息
	 *
	 * @param request
	 * @param writer
	 */
	@Override
	protected void delete(HttpServletRequest request, PrintWriter writer) {
		log.trace("删除部门信息初始...");
		JSONObject dataJson = getParam(request);
		Integer departmentId;
		try {
			departmentId = dataJson.getInteger("dept_id");
		} catch (Exception e) {
			log.error("获取删除部门信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == departmentId) {
			log.trace("获取删除部门操作信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		//先查询是否有子节点，如果有的话，不能直接删除
		List<Department> departmentList;
		try {
			departmentList = departmentFactory.getObjectsForString(" where t.parent_id=" + departmentId, null);
			if (!departmentList.isEmpty()) {
				log.trace("删除部门失败，非末节点不能删除！");
				writer.print(ResultCode.OBJECT_CAN_NOT_DELETE);
				return;
			}
		} catch (Exception e) {
			log.error("根据部门查询是否有子部门发生异常，异常描述：{}", e);
		}
		Department department = departmentFactory.getObject("id", departmentId);
		if (null == department) {
			log.trace("部门ID为{} 的信息未找到！", departmentId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		//todo 查询是否有跟角色人员相关联
		try {
			List<DeptLinkRoleLinkEmployee> deptLinkRoleLinkEmployees = deptLinkRoleLinkEmployeeFactory.getObjectsForString(" where t.department_id= " + departmentId, null);
			List<DeptLinkRole> deptLinkRoles = deptLinkRoleFactory.getObjectsForString(" where t.department_id =" + departmentId, null);
			if (deptLinkRoleLinkEmployees.size() > 0 || deptLinkRoles.size() > 0) {
				log.trace("此部门已绑定相关信息，请清除绑定信息后再执行删除操作！");
				writer.print(ResultCode.OBJECT_CAN_NOT_DELETE);
				return;
			}
		} catch (Exception e) {
			log.error("查询部门角色人员关联出现异常，异常描述:{}", e);
		}


		department.delete();
		log.trace("删除部门信息结束...");
		writer.print(ResultCode.NORMAL);
	}

	/**
	 * @param request
	 * @param writer
	 */
	protected void getAllDeptByTree(HttpServletRequest request, PrintWriter writer) {
		log.trace("获取部门树初始...");
		Integer deptId;
		String deptName;
		//这个是整个树型结构最外层
		JSONObject rootObject = new JSONObject();
		rootObject.put("id", 0);
		rootObject.put("name", "公司部门组织结构");
		//先获取所有父节点为空的部门当作根节点
		List<Department> deptList;
		try {
			deptList = departmentFactory.getObjectsForString(" where t.flag=1 and t.parent_id = 0", null);
			//如果没有配置部门，直接返回空
			if (null == deptList || deptList.size() < 1) {
				writer.print(new ResultCode(true, rootObject));
				return;
			}
			//循环父类
			JSONArray rootArr = new JSONArray();
			for (Department dept : deptList) {
				//处理父类的数据
				JSONObject parentObject = new JSONObject();
				deptId = dept.get("id");
				deptName = dept.get("dept_name");
				parentObject.put("id", deptId);
				parentObject.put("name", deptName);
				//处理子类的数据
				JSONObject child = getDeptByParentId(deptId);
				if (child != null)
					parentObject.put("child", child);
				//添加进数组
				rootArr.add(parentObject);
			}
			//处理结束，添加进root
			rootObject.put("root", rootArr);
			writer.print(new ResultCode(true, rootObject));
		} catch (Exception e) {
			writer.print(ResultCode.QUERY_ERROR);
			log.error("查询部门数结构出现异常:{}！", e);
		}
	}

	/**
	 * 根据父id获取单层树
	 *
	 * @param request
	 * @param writer
	 */
	protected void getSingleFloorByTree(HttpServletRequest request, PrintWriter writer) {
		log.trace("根据部门父ID获取单层部门树初始...");
		JSONObject dataJson = getParam(request);
		Integer parentDeptId;
		try {
			parentDeptId = dataJson.getInteger("parent_id");
		} catch (Exception e) {
			log.error("获取部门父ID发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}

		//先获取所有父节点为空的部门当作根节点
		JSONObject rootObject = new JSONObject();
		JSONArray childArry = new JSONArray();
		List<Department> deptList;
		try {
			//如果父id或为0，说明请求的是最外层
			Department parentDept = departmentFactory.getObject("id", parentDeptId);
			if (null == parentDept) {
				log.trace("部门ID为{} 的信息未找到！", parentDeptId);
				writer.print(ResultCode.OBJECT_NOT_FOUND);
				return;
			}
			rootObject.put("id", parentDeptId);
			rootObject.put("type", "dept");
			rootObject.put("name", parentDept.get("dept_name"));
			deptList = departmentFactory.getObjectsForString(" where t.flag=1 and t.parent_id =" + parentDeptId, null);

			//这边查询所属此部门的角色
			JSONArray roleArray = getRoleByDeptId(parentDeptId);
			deptList.forEach((dept) -> {
				JSONObject childObject = new JSONObject();
				childObject.put("id", dept.get("id"));
				childObject.put("name", dept.get("dept_name"));
				childObject.put("type", "dept");
				//添加进数组
				childArry.add(childObject);
			});

			if (roleArray != null) {
				childArry.addAll(roleArray);
			}

			//处理结束，添加进root
			rootObject.put("child", childArry);
			writer.print(new ResultCode(true, rootObject));
		} catch (Exception e) {
			writer.print(ResultCode.QUERY_ERROR);
			log.error("根据部门父ID获取单层部门树出现异常:{}！", e);
		}
	}

	/**
	 * 根据部门和角色获取所属人员
	 *
	 * @param request
	 * @param writer
	 */
	protected void getUserByDeptAndrole(HttpServletRequest request, PrintWriter writer) {
		Integer deptId;
		Integer roleId;
		JSONObject dataJson = getParam(request);
		try {
			deptId = dataJson.getInteger("dept_id");
			roleId = dataJson.getInteger("role_id");
		} catch (Exception e) {
			log.error("获取根据部门角色查询所属人员参数异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == deptId || roleId == null) {
			log.trace("获取根据部门角色查询所属人员参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}

		List<Employee> employeeList;
		JSONArray childArray = new JSONArray();
		JSONObject rootObject = new JSONObject();
		try {
			//如果父id或为0，说明请求的是最外层
			Role role = roleFactory.getObject("id", roleId);
			if (null == role) {
				log.trace("角色ID为{} 的信息未找到！", roleId);
				writer.print(ResultCode.OBJECT_NOT_FOUND);
				return;
			}
			rootObject.put("id", roleId);
			rootObject.put("type", "role");
			rootObject.put("name", role.get("role_name"));

			employeeList = employeeFactory.getObjectsForString(" inner join link_department_role_employee ld on t.id =ld.employee_id where ld.department_id =" + deptId + " and ld.role_id =" + roleId, null);
			if (employeeList == null || employeeList.size() < 1) {
				writer.print(new ResultCode(true, ""));
				return;
			}
			//循环角色信息
			for (Employee user : employeeList) {
				JSONObject userObject = new JSONObject();
				userObject.put("id", user.get("id"));
				userObject.put("type", "user");
				userObject.put("name", user.get("real_name"));
				childArray.add(userObject);
			}
			rootObject.put("child", childArray);
			writer.print(new ResultCode(true, rootObject.toJSONString()));
		} catch (Exception e) {
			writer.print(ResultCode.QUERY_ERROR);
			log.error("根据部门角色查询所属人员发生异常:{}", e);
		}
	}


	/**
	 * 根据父类ID(循环迭代)获取子类的数据
	 *
	 * @param parentDeptId 父部门ID
	 * @return
	 */
	private JSONObject getDeptByParentId(Integer parentDeptId) {
		if (null == parentDeptId) {
			return null;
		}
		List<Department> deptList;
		JSONObject resObject = new JSONObject();
		try {
			deptList = departmentFactory.getObjectsForString(" where t.flag=1 and t.parent_id = " + parentDeptId, null);
			//如果没有配置部门，直接返回空
			if (null == deptList || deptList.size() < 1) {
				return null;
			}
			JSONArray deptArr = new JSONArray();
			for (Department dept : deptList) {
				//处理父类的数据
				JSONObject childObject = new JSONObject();
				Integer deptId = dept.get("id");
				String deptName = dept.get("dept_name");
				childObject.put("id", deptId);
				childObject.put("name", deptName);
				//处理子类的数据
				JSONObject child = getDeptByParentId(deptId);
				if (child != null)
					childObject.put("child", child);
				//添加进数组
				deptArr.add(childObject);
			}
			resObject.put("parent", deptArr);
			return resObject;
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 根据部门获取角色列表
	 *
	 * @param request
	 * @param writer
	 */
	protected void getRoleByDeptId(HttpServletRequest request, PrintWriter writer) {
		Integer deptId;
		JSONObject dataJson = getParam(request);
		try {
			deptId = dataJson.getInteger("dept_id");
		} catch (Exception e) {
			log.error("获取查询角色信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == deptId) {
			log.trace("获取查询角色操作信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		JSONArray jsonArray = getRoleByDeptId(deptId);
		writer.print(new ResultCode(true, jsonArray));
	}

	/**
	 * 根据部门获取
	 *
	 * @param deptId
	 * @return
	 */
	private JSONArray getRoleByDeptId(Integer deptId) {
		if (null == deptId) {
			return null;
		}
		List<Role> roleList;
		JSONArray jsonArray = new JSONArray();
		try {
			roleList = roleFactory.getObjectsForString(" inner join link_department_role ld on t.id =ld.role_id where ld.department_id =" + deptId, null);
			if (roleList == null || roleList.size() < 1) {
				return null;
			}
			for (Role role : roleList) {
				JSONObject roleObject = new JSONObject();
				roleObject.put("id", role.get("id"));
				roleObject.put("type", "role");
				roleObject.put("name", role.get("role_name"));
				jsonArray.add(roleObject);
			}
			return jsonArray;

		} catch (Exception e) {
			log.error("根据部门查询角色列表发生异常:{}", e);
			return null;
		}
	}

	/**
	 * 根据部门和角色获取所属人员
	 *
	 * @param request
	 * @param writer
	 */

	protected void getEmployeeByDeptAndrole(HttpServletRequest request, PrintWriter writer) {
		Integer deptId;
		Integer roleId;
		JSONObject dataJson = getParam(request);
		try {
			deptId = dataJson.getInteger("dept_id");
			roleId = dataJson.getInteger("role_id");
		} catch (Exception e) {
			log.error("获取根据部门角色查询所属人员参数异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == deptId || roleId == null) {
			log.trace("获取根据部门角色查询所属人员参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}

		List<Employee> employeeList;
		JSONArray childArray = new JSONArray();
		List<String> employeeIds = new ArrayList<>();
		try {
			//如果父id或为0，说明请求的是最外层
			Role role = roleFactory.getObject("id", roleId);
			if (null == role) {
				log.trace("角色ID为{} 的信息未找到！", roleId);
				writer.print(ResultCode.OBJECT_NOT_FOUND);
				return;
			}

			employeeList = employeeFactory.getObjectsForString(" inner join link_department_role_employee ld on t.id =ld.employee_id where ld.department_id =" + deptId + " and ld.role_id =" + roleId, null);
			if (employeeList == null || employeeList.size() < 1) {
				writer.print(new ResultCode(true, ""));
				return;
			}
			//循环角色信息
			for (Employee user : employeeList) {
				employeeIds.add(user.get("id"));
			}
			writer.print(new ResultCode(true, employeeIds));
		} catch (Exception e) {
			writer.print(ResultCode.QUERY_ERROR);
			log.error("根据部门角色查询所属人员发生异常:{}", e);
		}
	}

	/**
	 * 根据查询部门中是否已存在此角色
	 *
	 * @param request
	 * @param writer
	 */
	protected void checkRoleExistOnDept(HttpServletRequest request, PrintWriter writer) {
		Integer deptId;
		Integer roleId;
		JSONObject dataJson = getParam(request);
		try {
			deptId = dataJson.getInteger("dept_id");
			roleId = dataJson.getInteger("role_id");
		} catch (Exception e) {
			log.error("获取查询部门是否存在相同角色参数异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == deptId || roleId == null) {
			log.trace("获取查询部门是否存在相同角色信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		//查询部门是否已经存在与此角色绑定
		ResultSet resultSet = null;
		try {
			String sql = " select * from link_department_role where ld.department_id =" + deptId + " and role_id =" + roleId;
			resultSet = dbHelper.select(sql);
			if (null == resultSet) {
				writer.print(ResultCode.NORMAL);
				return;
			}
			writer.print(ResultCode.OBJECT_AREADY_EXIST);
		} catch (Exception e) {
			writer.print(ResultCode.QUERY_ERROR);
			log.error("根据查询部门是否存在相同角色发生异常:{}", e);
		} finally {
			dbHelper.close(resultSet);
		}
	}
}
