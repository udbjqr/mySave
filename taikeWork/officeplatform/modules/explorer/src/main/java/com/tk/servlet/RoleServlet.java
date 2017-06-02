package com.tk.servlet;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.Constant;
import com.tk.common.ControlType;
import com.tk.common.persistence.User;
import com.tk.common.result.ResultCode;
import com.tk.objects.Dict;
import com.tk.objects.DictFactory;
import com.tk.objects.identity.Employee;
import com.tk.objects.identity.EmployeeFactory;
import com.tk.objects.identity.Role;
import com.tk.objects.identity.RoleFactory;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 角色管理
 */
@WebServlet("/role.do")
public class RoleServlet extends BaseServlet {
	// 获取到角色工厂类
	private static RoleFactory roleFactory = RoleFactory.getInstance();

	private static Logger log = LogManager.getLogger(RoleServlet.class.getName());

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
			case getEmployeeIdListByDeptIdAndRoleId:
				getEmployeeIdListByDeptIdAndRoleId(request, writer);
				return true;
			default:
				return false;
		}
	}

	@Override
	protected void query(HttpServletRequest request, PrintWriter writer) {
		log.trace("获取角色列表信息初始...");
//		User employee = (User) request.getSession().getAttribute(Constant.sessionUserAttrib);
		List<Role> roleList = null;
		JSONArray jsonArray = new JSONArray();
		try {
			roleList = roleFactory.getAllObjects(null);
			if (null != roleList && roleList.size() > 0) {
				for (Role role : roleList) {
					Integer parentId = role.get("parent_id");
					JSONObject object = new JSONObject();
					object.put("role_id", role.get("id"));
					object.put("role_name", role.get("role_name"));
					object.put("parent_name", parentId == null ? "" : roleFactory.getObject("id", parentId).get("role_name"));
					object.put("remark", role.get("remark"));
					jsonArray.add(object);
				}
			}
			log.trace("获取角色列表信息结束...");
			writer.print(new ResultCode(true, jsonArray));
		} catch (Exception e) {
			log.error("获取角色列表信息异常:{}！", e);
			writer.print(ResultCode.QUERY_ERROR);
		}
	}

	//添加数据字典
	@Override
	protected void add(HttpServletRequest request, PrintWriter writer) {
		log.trace("新增角色信息初始...");
//		User employee = (User) request.getSession().getAttribute(Constant.sessionUserAttrib);
		JSONObject dataJson = getParam(request);
		//功能名称
		String roleName;
		//父角色
		Integer parentId;
		//备注
		String remark;
		try {
			parentId = dataJson.getInteger("parent_id");
			roleName = dataJson.getString("role_name");
			remark = dataJson.getString("remark");
		} catch (Exception e) {
			log.error("获取新增角色信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (StringUtils.isEmpty(roleName)) {
			log.trace("获取新增角色信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		try {
			Role role = roleFactory.getNewObject(null);
			role.set("role_name", roleName);
			role.set("parent_id", parentId);
			role.set("create_time", new Date(System.currentTimeMillis()));
			role.set("remark", remark);
			role.set("flag", 1);
			role.flush();
			log.trace("新增角色信息结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("新增角色信息发生异常，异常描述:{}", e);
			writer.print(ResultCode.ADD_ERROR);
		}
	}

	@Override
	protected void update(HttpServletRequest request, PrintWriter writer) {
		log.trace("修改角色信息初始...");
		JSONObject dataJson = getParam(request);
		//角色名称
		String roleName;
		Integer roleId;
		//参数名称
		String parentId;
		//备注
		String remark;
		try {
			roleId = dataJson.getInteger("role_id");
			roleName = dataJson.getString("role_name");
			parentId = dataJson.getString("parent_id");
			remark = dataJson.getString("remark");
		} catch (Exception e) {
			log.error("获取修改数据字典信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == roleId || StringUtils.isEmpty(roleName)) {
			log.trace("获取修改角色参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Role role = roleFactory.getObject("id", roleId);
		if (null == role) {
			log.trace("角色ID为：{} 的信息未找到！", roleId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		try {
			role.set("role_name", roleName);
			role.set("parent_id", parentId);
			role.set("remark", remark);
			role.flush();
			log.trace("修改角色信息结束...");
			writer.print(ResultCode.NORMAL);
		} catch (Exception e) {
			log.error("修改角色发生异常，异常描述:{}", e);
			writer.print(ResultCode.UPDATE_ERROR);
		}
	}

	@Override
	protected void load(HttpServletRequest request, PrintWriter writer) {
		log.trace("查询角色信息初始...");
		JSONObject dataJson = getParam(request);
		//角色ID
		Integer roleId;
		try {
			roleId = dataJson.getInteger("role_id");
		} catch (Exception e) {
			log.error("获取查询角色参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == roleId) {
			log.trace("获取查询角色信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Role role = roleFactory.getObject("id", roleId);
		if (null == role) {
			log.trace("角色ID为{} 的字典信息未找到！", roleId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		JSONObject object = new JSONObject();
		object.put("role_id", role.get("id"));
		object.put("role_name", role.get("role_name"));
		object.put("parent_id", role.get("parent_id"));
		object.put("remark", role.get("remark"));
		log.trace("查询角色信息结束...");
		writer.print(new ResultCode(true, object));
	}

	/**
	 * 删除角色信息
	 *
	 * @param request
	 * @param writer
	 */
	@Override
	protected void delete(HttpServletRequest request, PrintWriter writer) {
		log.trace("删除角色信息初始...");
		JSONObject dataJson = getParam(request);
		Integer roleId;
		try {
			roleId = dataJson.getInteger("role_id");
		} catch (Exception e) {
			log.error("获取删除角色信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == roleId) {
			log.trace("获取删除角色操作信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}
		Role role = roleFactory.getObject("id", roleId);
		if (null == role) {
			log.trace("角色ID为{} 的信息未找到！", roleId);
			writer.print(ResultCode.OBJECT_NOT_FOUND);
			return;
		}
		role.delete();
		log.trace("删除角色信息结束...");
		writer.print(ResultCode.NORMAL);
	}

	/**
	 * 根据角色ID获取属于这个角色的所有用户的ID list
	 *
	 * @param request
	 * @param writer
	 */
	protected void getEmployeeIdListByDeptIdAndRoleId(HttpServletRequest request, PrintWriter writer) {
		log.trace("根据部门和角色获取查询人员Id组初始...");
		Integer deptId;
		Integer roleId;
		JSONObject dataJson = getParam(request);
		try {
			deptId = dataJson.getInteger("dept_id");
			roleId = dataJson.getInteger("role_id");
		} catch (Exception e) {
			log.error("根据部门和角色获取查询人员信息参数发生异常，异常描述:{}", e);
			writer.print(ResultCode.GET_FRONT_END_INFO_ERROR);
			return;
		}
		if (null == roleId || deptId == null) {
			log.trace("根据部门和角色获取查询人员信息参数缺失！");
			writer.print(ResultCode.MISS_FRONT_PARAM);
			return;
		}

		List<Employee> employeeList;
		List<Integer> employeeIdList = new ArrayList<>();
		try {
			employeeList = EmployeeFactory.getInstance().getObjectsForString(" inner join link_department_role_employee ld on t.id =ld.employee_id where ld.department_id =" + deptId + " and ld.role_id =" + roleId, null);
			if (employeeList == null || employeeList.size() < 1) {
				writer.print(new ResultCode(true, ""));
				return;
			}
			for (Employee employeeTmp : employeeList) {
				employeeIdList.add(employeeTmp.get("id"));
			}
			log.trace("根据部门和角色获取查询人员Id组结束...");
			writer.print(new ResultCode(true, employeeIdList));
		} catch (Exception e) {
			writer.print(ResultCode.QUERY_ERROR);
			log.error("根据部门和角色获取查询人员Id组发生异常:{}", e);
		}
	}
}
