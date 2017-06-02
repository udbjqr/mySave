package com.tk.servlet;

import com.tk.common.PermissionEnum;
import com.tk.common.persistence.WriteValueException;
import com.tk.object.ImportSaleDetail;
import com.tk.object.ImportSaleDetailFactory;
import com.tk.servlet.result.SuccessJSON;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.SQLException;
import java.util.List;

import javax.servlet.annotation.WebServlet;

@WebServlet("/importSaleDetail.do")
public class ImportSaleDetailServlet extends BaseServlet{
	
	private static Logger log = LogManager.getLogger(ImportSaleDetailServlet.class.getName());

	@Override
	protected boolean handleChilder() {
		// TODO Auto-generated method stub
		return false;
	}

	@Override
	protected void setHandlePermission() {
		handlePermission.put(ControlType.update, PermissionEnum.NOT_USE_PERMISSION);
	}

	@Override
	protected void queryAll() {
		// TODO Auto-generated method stub
		
	}

	@Override
	protected void delete() {
		// TODO Auto-generated method stub
		
	}

	@Override
	protected void update() {
		Integer salesdtlid = dataJson.getInteger("salesdtlid");
		ImportSaleDetail importSaleDetail = ImportSaleDetailFactory.getInstance().getObject("salesdtlid", salesdtlid);
		try {
			if(importSaleDetail!=null){
				importSaleDetail.set("costprice2", dataJson.getString("costprice2"));
				importSaleDetail.set("costprice3", dataJson.getString("costprice3"));
			}
		} catch (WriteValueException e) {
			log.error("写入数据值异常！", e);
		}
		importSaleDetail.flash();
		writer.print(new SuccessJSON().put("msg","修改成功！"));
	}

	@Override
	protected void query() {
		
	}

	@Override
	protected void load() {
		// TODO Auto-generated method stub 
		
	}

	@Override
	protected void add() {
		// TODO Auto-generated method stub
		
	}

}
