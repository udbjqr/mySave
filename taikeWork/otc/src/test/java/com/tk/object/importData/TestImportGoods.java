package com.tk.object.importData;

import java.sql.ResultSet;
import java.sql.SQLException;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.core.Logger;
import org.junit.Test;

import com.tk.common.persistence.WriteValueException;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.object.Employee;
import com.tk.object.EmployeeFactory;
import com.tk.object.Goods;
import com.tk.object.GoodsFactory;
import com.tk.object.Supplier;
import com.tk.object.SupplierFactory;

public class TestImportGoods {
	

	@Test
	public void test(){
		/*Integer goodsId[] = {106418, 20260, 971458, 117521, 117522, 106406, 106405, 978451, 117621, 978373, 115615, 115616,
				115614, 115674, 34902, 115617, 115618, 115673, 115676, 106768, 977225, 977229, 977230, 977231, 976398, 976414,
				117639, 2904, 117638, 7100, 98920, 2903, 972406, 2590, 102055, 103885, 99235, 972723, 116104, 110167, 110169,
				119033, 2909, 104710, 25463, 43928, 30242, 114934, 114938, 102581, 702278, 88203, 95506, 100701, 107037, 4523,
				109741, 37563, 40883, 100663, 120868, 974667, 9700, 96281, 95346, 87161, 972688, 976425, 972179, 976422, 976419,
				120870, 120741, 96820, 24042, 35753, 104170, 88747, 121443, 98063, 98062, 1694, 1695, 3061, 2787, 3107, 2919,
				7080, 95756, 95757, 3105, 687746, 2599, 121183, 114729, 976732, 89129, 89128, 1759, 108886, 977577, 977513,
				1761, 89130, 1760, 29042, 40885, 88304, 977510, 977511, 977512, 978166};
		
		  //importGoods(goodsId);
		test01();*/
		
	}
	
	public static void test01(){
		DBHelper dbHelper = DBHelperFactory.getSecondDBHelper("2");
		String sql = "select salesdtlid,credate,customid,customname,entryid,goodsid,goodsname,"
				+ "goodstype,factoryid,factoryname,goodsunit,goodsqty,unitprice,costprice,"
				+ "total_line,goodsqty*COSTPRICE from import_sale_detail";
		ResultSet rs = null;
		try {
			rs = dbHelper.select(sql);
			while(rs.next()){
				Object goodsId = rs.getObject("goodsid");
				System.out.println(goodsId);
			}
			dbHelper.close(rs);
		} catch (SQLException e) {
			e.printStackTrace();
			dbHelper.close(rs);
		}
	}
	
	
	public static void importGoods(Integer goodsId[]){
		DBHelper dbHelper = DBHelperFactory.getSecondDBHelper("2");
		ResultSet rs = null;
		try {
			
			for (Integer id : goodsId) {
				StringBuilder sql = new StringBuilder();
				sql.append("select goodsid,goodsname,goodstype,factoryid,factoryname,goodsunit,wholeprice,stgoodsqty from import_inventory ");
				sql.append(" where  goodsid = "+id);
				
				rs = dbHelper.select(sql.toString());
				if (!rs.next()){
					return;
				}
				
				Employee employee = EmployeeFactory.getInstance().getObject("id", 1);
				Integer supplierId  = rs.getInt("factoryid");//供应商Id
				String factoryName = rs.getString("factoryname");//供应商名称
				String goodsName = rs.getString("goodsname");//产品名称
				String goodsType = rs.getString("goodstype");//规格
				
				dbHelper.close(rs);
				
				Supplier supplier = SupplierFactory.getInstance().getObject("id", supplierId);
				if(supplier==null){
					
					Supplier newSupplier = SupplierFactory.getInstance().getNewObject(employee);
					newSupplier.set("id", supplierId);
					newSupplier.set("supplier_name", factoryName);
					newSupplier.flash();
				}
				
				Goods oldGoods = GoodsFactory.getInstance().getObject("id", id);
				if(oldGoods!=null){
					continue;
				}
				Goods goods = GoodsFactory.getInstance().getNewObject(employee);
				
				goods.set("id", id);
				goods.set("goods_name", goodsName);
				goods.set("specification", goodsType);
				goods.set("supplier_id", supplierId);//供应商Id
				goods.set("is_assess", 0);//是否考核
				goods.set("flag", 0);//状态
				
				goods.flash();
				System.out.println("新增产品成功！");
			}
			
		}catch (Exception e) {
			e.printStackTrace();
		} finally {
				dbHelper.close(rs);
		}
	}
	
}
