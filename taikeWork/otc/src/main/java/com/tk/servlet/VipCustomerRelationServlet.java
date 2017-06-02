package com.tk.servlet;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.annotation.WebServlet;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.common.util.DateUtil;
import com.tk.object.Customer;
import com.tk.object.CustomerFactory;
import com.tk.object.Department;
import com.tk.object.DepartmentFactory;
import com.tk.object.Employee;
import com.tk.object.EmployeeFactory;
import com.tk.object.VipCustomerRelation;
import com.tk.object.VipCustomerRelationFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

@WebServlet("/vipCustomerRelation.do")
public class VipCustomerRelationServlet extends BaseServlet {

	private static Logger log = LogManager.getLogger(VipCustomerRelationServlet.class.getName());
	private VipCustomerRelationFactory vipCustomerRelationFactory = VipCustomerRelationFactory.getInstance();
	
	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.add, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.query, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.queryUserTree, PermissionEnum.NOT_USE_PERMISSION);
	}
	
	
	@Override
	protected void add() {
		log.trace("开始添加vip客户维系情况...");
		try {
			String time = dataJson.getString("time");//yyyy-MM-dd hh:mm:ss
			String title = dataJson.getString("title");
			String content = dataJson.getString("content");
			Integer vip_customer_id = dataJson.getInteger("vip_customer_id");
			if(StringUtils.isBlank(time) || StringUtils.isBlank(title) || StringUtils.isBlank(content) || vip_customer_id==null){
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}
			VipCustomerRelation vipCustomerRelation = vipCustomerRelationFactory.getNewObject(employee);
			vipCustomerRelation.set("time", DateUtil.stringToDate(time));
			vipCustomerRelation.set("title", title);
			vipCustomerRelation.set("content", content);
			vipCustomerRelation.set("vip_customer_id", vip_customer_id);
			StringBuilder sql = new StringBuilder();
			sql.append(" select t.* from customer t inner join vip_customer a on t.id = a.customer_id ")
			.append(" where a.id = ").append(vip_customer_id);
			List<Customer> list = CustomerFactory.getInstance().getObjectsForString(sql.toString(), employee);
			if(list.size()>0){
				vipCustomerRelation.set("employee_id", list.get(0).get("employee_id"));
			}else{
				writer.print(ErrorCode.ADD_ERROR);
				return;
			}
			vipCustomerRelation.flash();
			writer.print(new SuccessJSON("msg","添加vip客户维系情况成功！"));
		} catch (Exception e) {
			log.error("发生异常！", e);
			writer.print(ErrorCode.ADD_ERROR);
		}
		log.trace("添加vip客户维系情况结束...");
	}
	
	@Override
	protected void query() {
		log.trace("开始查询vip客户维系情况...");
		try {
			Integer vip_customer_id = dataJson.getInteger("vip_customer_id");
			StringBuilder sql = new StringBuilder(" where 1 = 1 ");
			if(vip_customer_id==null){
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}
			
			sql.append(" and vip_customer_id = ").append(vip_customer_id);
			sql.append(" order by time asc ");
			List<VipCustomerRelation> list = vipCustomerRelationFactory.getObjectsForString(sql.toString(), employee);
			List<JSONObject> dataList = new ArrayList<>();
			for (VipCustomerRelation vipCustomerRelation : list) {
				JSONObject object = new JSONObject();
				Integer employee_id = vipCustomerRelation.get("employee_id");
				Employee emp = EmployeeFactory.getInstance().getObject("id", employee_id);
				if(emp!=null){
					object.put("principa", emp.get("real_name"));//负责人
					object.put("head_portrait", emp.get("head_portrait")==null?"":emp.get("head_portrait"));//头像
				}
				object.put("title", vipCustomerRelation.get("title"));//标题
				object.put("content", vipCustomerRelation.get("content"));//内容
				object.put("time", DateUtil.formatDate(vipCustomerRelation.get("time"), "yyyy-MM-dd"));//时间
				dataList.add(object);
			}
			writer.print(new SuccessJSON("list",dataList));
		} catch (Exception e) {
			log.error("发生异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
		log.trace("查询vip客户维系情况结束...");
	}

}
