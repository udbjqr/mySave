                package com.tk.servlet;


import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.PermissionEnum;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.common.util.DateUtil;
import com.tk.common.util.PageUtil;
import com.tk.object.AreaDivision;
import com.tk.object.AreaDivisionFactory;
import com.tk.object.Customer;
import com.tk.object.CustomerFactory;
import com.tk.object.Employee;
import com.tk.object.EmployeeFactory;
import com.tk.object.VipCustomer;
import com.tk.object.VipCustomerFactory;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

/**
 * 客户管理
 */
@WebServlet("/vipCustomer.do")
public class VipCustomerServlet extends BaseServlet {
	
	private Integer pageSize;
	private Integer pageNumber;
	private VipCustomerFactory vipCustomerFactory = VipCustomerFactory.getInstance();
	private CustomerFactory customerFactory = CustomerFactory.getInstance();
	private EmployeeFactory employeeFactory = EmployeeFactory.getInstance();
	private static Logger log = LogManager.getLogger(VipCustomerServlet.class.getName());

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.add, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.query, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.delete, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.load, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.update, PermissionEnum.NOT_USE_PERMISSION);
		handlePermission.put(ControlType.fileExport, PermissionEnum.NOT_USE_PERMISSION);
	}
	
	@Override
	protected void fileUpload(HttpServletRequest request, HttpServletResponse response) {
		try{
			log.trace("开始导出vip客户列表...");
			StringBuilder sql = new StringBuilder(" where 1 = 1 ");
			Integer type = employee.get("employee_type");
			if(type==1){//判断是否代表
				sql.append(" and exists(select 1 from customer b ")
				 .append(" where t.customer_id = b.id")
				 .append(" and b.employee_id = ")
				 .append(employee.getId())
				.append(")");
			}
			
			List<VipCustomer> vipCustomerList = vipCustomerFactory.getObjectsForString(sql.toString(), employee);
			List<Map<String,Object>> dataList = new ArrayList<>();
			for (VipCustomer vipCustomer : vipCustomerList) {
				Map<String,Object> object = new HashMap<>();
				object.put("编号", vipCustomer.get("id"));
				Customer customer = customerFactory.getObject("id", vipCustomer.get("customer_id"));
				if(customer!=null){
					object.put("客户名称", customer.get("customer_name"));//客户名称
					Employee employee = employeeFactory.getObject("id", customer.get("employee_id"));
					object.put("负责人", employee!=null?employee.get("real_name"):"");//负责人
					AreaDivision areaDivision = AreaDivisionFactory.getInstance().getObject("id", customer.get("area_id"));
					object.put("区域", areaDivision!=null?areaDivision.get("area_name"):"");//区域
					Employee employee2 = employeeFactory.getObject("id", customer.get("person_in_charge_id"));
					object.put("责任主管", employee2!=null?employee2.get("real_name"):"");//责任主管
				}else{
					object.put("客户名称", "");
					object.put("负责人", "");//负责人
					object.put("区域", "");//区域
					object.put("责任主管", "");//责任主管
				}
				object.put("地址", vipCustomer.get("address"));//地址
				object.put("客户姓名", vipCustomer.get("real_name"));//客户姓名
				object.put("客户类型", vipCustomer.get("customer_type"));//客户类型 1:一星 2：二星
				object.put("联系次数", vipCustomer.get("relation_count"));//联系次数
				dataList.add(object);
			}
			
			if (dataList.size() > 0) {
				exportListData(dataList);
				log.trace("导出列表数据结束...");
			}else {
				log.trace("暂无数据！");
				writer.print(new SuccessJSON("msg", "暂无数据！"));
			}
		}catch (Exception e) {
			log.error("发生异常！", e);
			writer.print(ErrorCode.EXPORT_FILE_FAIL);
		}
		log.trace("导出vip客户列表结束...");
	}
	
	
	@Override
	protected void delete() {
		log.trace("开始删除vip客户...");
		try {
			Integer id = dataJson.getInteger("id");
			VipCustomer vipCustomer = vipCustomerFactory.getObject("id", id);
			if(vipCustomer==null){
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}
			vipCustomer.delete();
			writer.print(new SuccessJSON("msg","删除vip客戶成功！"));
		} catch (Exception e) {
			log.error("发生异常！", e);
			writer.print(ErrorCode.UPDATE_ERROR);
		}
		log.trace("删除vip客户结束...");
	}
	
	@Override
	protected void add() {
		log.trace("开始添加vip客户...");
		try {
			Integer customer_id = dataJson.getInteger("customer_id");
			Integer customer_type = dataJson.getInteger("customer_type");
			String real_name = dataJson.getString("real_name");
			String position = dataJson.getString("position");
			String birthday = dataJson.getString("birthday");
			String phone_number = dataJson.getString("phone_number");
			String email = dataJson.getString("email");
			String address = dataJson.getString("address");
			VipCustomer vipCustomer = vipCustomerFactory.getObject("customer_id", customer_id);
			if(vipCustomer!=null){
				writer.print(ErrorCode.RECODE_AlREADY_EXIST);
				return;
			}
			
			if(StringUtils.isBlank(birthday) || customer_id==null || customer_type==null||
				StringUtils.isBlank(phone_number)||	StringUtils.isBlank(email)||	
				StringUtils.isBlank(address)|| StringUtils.isBlank(real_name) || StringUtils.isBlank(position)){
				writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
				return;
			}
	
			vipCustomer = vipCustomerFactory.getNewObject(employee);
			vipCustomer.set("customer_id", customer_id);
			vipCustomer.set("real_name", real_name);
			vipCustomer.set("position", position);
			vipCustomer.set("birthday", DateUtil.stringToDate(birthday));
			vipCustomer.set("phone_number", phone_number);
			vipCustomer.set("relation_count", 0);
			vipCustomer.set("email", email);
			vipCustomer.set("customer_type", customer_type);
			vipCustomer.set("address", address);
			vipCustomer.flash();
			writer.print(new SuccessJSON("msg","添加vip客戶成功！"));
		} catch (Exception e) {
			log.error("发生异常！", e);
			writer.print(ErrorCode.ADD_ERROR);
		}
		log.trace("添加vip客户结束...");
	}
	
	@Override
	protected void update() {
		log.trace("开始修改vip客户信息...");
		try {
			Integer id = dataJson.getInteger("id");
			String real_name = dataJson.getString("real_name");
			String position = dataJson.getString("position");
			String birthday = dataJson.getString("birthday");//yyyy-MM-dd hh:mm:ss
			String customer_name = dataJson.getString("customer_name");
			Integer area_id = dataJson.getInteger("area_id");
			String phone_number = dataJson.getString("phone_number");
			Integer principalId = dataJson.getInteger("principal_id");
			String email = dataJson.getString("email");
			String address = dataJson.getString("address");
			Integer customer_type = dataJson.getInteger("customer_type");
			
			VipCustomer vipCustomer = vipCustomerFactory.getObject("id", id);
			if(vipCustomer==null){
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}
			
			if(customer_type!=null){
				vipCustomer.set("customer_type", customer_type);
			}
			
			if (StringUtils.isNotBlank(real_name)) {
				vipCustomer.set("real_name", real_name);
			}
			
			if (StringUtils.isNotBlank(position)) {
				vipCustomer.set("position", position);
			}

			if (StringUtils.isNotBlank(birthday)) {
				vipCustomer.set("birthday", DateUtil.stringToDate(birthday));
			}
			
			if (StringUtils.isNotBlank(customer_name) || area_id!=null || principalId!=null) {
				Customer customer = customerFactory.getObject("id", vipCustomer.get("customer_id"));
				if(customer!=null){
					if(area_id!=null){
						customer.set("area_id", area_id);
					}
					
					if(principalId!=null){
						customer.set("employee_id", principalId);
					}
					
					if (StringUtils.isNotBlank(customer_name)){
						customer.set("customer_name", customer_name);
					}
					customer.flash();
				}
			}
			
			if(StringUtils.isNotBlank(address)){
				vipCustomer.set("address", address);
			}
			
			if(StringUtils.isNotBlank(email)){
				vipCustomer.set("email", email);
			}
			
			if(StringUtils.isNotBlank(phone_number)){
				vipCustomer.set("phone_number", phone_number);
			}
			vipCustomer.flash();
			writer.print(new SuccessJSON("msg","修改vip客戶成功！"));
		} catch (Exception e) {
			log.error("发生异常！", e);
			writer.print(ErrorCode.UPDATE_ERROR);
		}
		log.trace("修改vip客户信息结束...");
	}
	
	@Override
	protected void load() {
		log.trace("开始查询vip客户详情...");
		try {
			Integer id = dataJson.getInteger("id");
			VipCustomer vipCustomer = vipCustomerFactory.getObject("id", id);
			if(vipCustomer==null){
				writer.print(ErrorCode.OBJECT_NOT_EXIST);
				return;
			}
			JSONObject object = new JSONObject();
			object.put("id", vipCustomer.get("id"));
			Customer customer = customerFactory.getObject("id", vipCustomer.get("customer_id"));
			if(customer!=null){
				object.put("customer_name", customer.get("customer_name"));//客户名称
				Employee employee = employeeFactory.getObject("id", customer.get("employee_id"));
				object.put("principal", employee!=null?employee.get("real_name"):"");//负责人
				AreaDivision areaDivision = AreaDivisionFactory.getInstance().getObject("id", customer.get("area_id"));
				object.put("area_name", areaDivision!=null?areaDivision.get("area_name"):"");//区域
			}else{
				object.put("customer_name", "");
			}
			object.put("position", vipCustomer.get("position"));//职位
			object.put("birthday", vipCustomer.get("birthday"));//生日
			object.put("real_name", vipCustomer.get("real_name"));//客户姓名
			object.put("phone_number", vipCustomer.get("phone_number"));//手机号码
			object.put("customer_type", vipCustomer.get("customer_type"));
			object.put("email", vipCustomer.get("email"));//邮箱
			object.put("address", vipCustomer.get("address"));//地址
			writer.print(new SuccessJSON("data",object));
		} catch (Exception e) {
			log.error("发生异常！", e);
			writer.print(ErrorCode.LOAD_ERROR);
		}
		log.trace("查询vip客户详情结束...");
	}
	
	
	@Override
	protected void query() {
		try{
			log.trace("开始查询vip客户列表...");
			DBHelper dbHelper = DBHelperFactory.getDBHelper();
			StringBuilder sql = new StringBuilder(" where 1 = 1 ");
			String area_id = dataJson.getString("area_id");//区域ID
			String principal_id = dataJson.getString("principal_id");//负责人ID
			Integer customer_type = dataJson.getInteger("customer_type");//客户类型
			String name = dataJson.getString("name");
			pageNumber = dataJson.getInteger("pageNumber");
			pageSize = dataJson.getInteger("pageSize");
			Integer type = employee.get("employee_type");
			if(StringUtils.isNotBlank(area_id) || StringUtils.isNotBlank(principal_id)){
				sql.append(" and exists(select 1 from customer a ")
					 .append(" where t.customer_id = a.id");
				if(StringUtils.isNotBlank(area_id)){
					sql.append(" and a.area_id in (").append(area_id).append(")");
				}
				
				if(StringUtils.isNotBlank(principal_id)){
					sql.append(" and a.employee_id in (").append(principal_id).append(")");
				}
				sql.append(")");
			}
			
			if(type==1){//判断是否代表
				sql.append(" and exists(select 1 from customer b ")
				 .append(" where t.customer_id = b.id")
				 .append(" and b.employee_id = ")
				 .append(employee.getId())
				.append(")");
			}
			
			if(customer_type!=null){
				sql.append(" and customer_type = ").append(customer_type);
			}
			
			if(StringUtils.isNotBlank(name)){
				
				sql.append(" and exists(select 1 from customer c ")
					 .append(" where t.customer_id = c.id and c.customer_name like ")
					 .append(dbHelper.getString("%"+name+"%")).append(")");
			}
			
			List<VipCustomer> vipCustomerList = vipCustomerFactory.getObjectsForString(sql.toString(), employee);
			List<VipCustomer> pageList = PageUtil.getPageList(pageNumber, pageSize, vipCustomerList);
			List<JSONObject> dataList = new ArrayList<>();
			for (VipCustomer vipCustomer : pageList) {
				JSONObject object = new JSONObject();
				object.put("id", vipCustomer.get("id"));
				object.put("customer_id", vipCustomer.get("customer_id"));
				Customer customer = customerFactory.getObject("id", vipCustomer.get("customer_id"));
				if(customer!=null){
					object.put("customer_name", customer.get("customer_name"));//客户名称
					Employee employee = employeeFactory.getObject("id", customer.get("employee_id"));
					object.put("principal", employee!=null?employee.get("real_name"):"");//负责人
					AreaDivision areaDivision = AreaDivisionFactory.getInstance().getObject("id", customer.get("area_id"));
					object.put("area_name", areaDivision!=null?areaDivision.get("area_name"):"");//区域
					Employee employee2 = employeeFactory.getObject("id", customer.get("person_in_charge_id"));
					object.put("person_in_charge_name", employee2!=null?employee2.get("real_name"):"");//责任主管
					object.put("position", employee!=null?employee.get("position"):"");//员工职位
				}else{
					object.put("customer_name", "");
				}
				
				//客户生日提醒
				Date birthday = (Date)vipCustomer.get("birthday");
				if(birthday!=null){
					Calendar calendar = Calendar.getInstance();
					Integer current_month = calendar.get(Calendar.MONTH);//当前时间的月份
					Integer current_day = calendar.get(Calendar.DATE);//当前时间的日
					calendar.setTime(birthday);
					Integer birthday_month = calendar.get(Calendar.MONTH);//生日的月份
					Integer birthday_day = calendar.get(Calendar.DATE);//生日的日
					if(current_month.intValue()==birthday_month.intValue() && 
							birthday_day.intValue()-current_day.intValue()<=3 && 
							birthday_day.intValue()-current_day.intValue()>=0){
						object.put("birthdayStatus", "true");
					}else{
						object.put("birthdayStatus", "false");
					}
				}else{
					object.put("birthdayStatus", "false");
				}
				
				object.put("address", vipCustomer.get("address"));//地址
				object.put("real_name", vipCustomer.get("real_name"));//客户姓名
				Integer customer_type2 = vipCustomer.get("customer_type");
				if(customer_type2!=null){
					object.put("customer_type", customer_type2==1?"一星 ":"二星");//客户类型 1:一星 2：二星
				}else{
					object.put("customer_type","");//客户类型 1:一星 2：二星
				}
				object.put("relation_count", vipCustomer.get("relation_count"));//联系次数
				dataList.add(object);
			}
			
			SuccessJSON successJSON = new SuccessJSON("list",dataList);
			successJSON.put("count", vipCustomerList.size());
			writer.print(successJSON);
		}catch (Exception e) {
			log.error("发生异常！", e);
			writer.print(ErrorCode.GET_LIST_INFO_ERROR);
		}
		log.trace("查询vip客户列表结束...");
	}
	
	
		

}
