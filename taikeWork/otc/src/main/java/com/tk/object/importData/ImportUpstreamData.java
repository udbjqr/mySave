package com.tk.object.importData;

import com.tk.common.persistence.WriteValueException;
import com.tk.common.sql.DBHelper;
import com.tk.common.sql.DBHelperFactory;
import com.tk.object.Goods;
import com.tk.object.GoodsFactory;
import com.tk.object.Supplier;
import com.tk.object.SupplierFactory;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.*;
import java.util.List;

/**
 * 此对象用来导入南华上游数据之用.
 * <p>
 * 针对药业操作的方式获得相对应的数据。
 */
public class ImportUpstreamData {
	private static ImportUpstreamData instance = new ImportUpstreamData();

	private static final Logger logger = LogManager.getLogger(ImportUpstreamData.class.getName());
	private final DBHelper oracle = DBHelperFactory.getSecondDBHelper("2");
	private final DBHelper selfDB = DBHelperFactory.getDBHelper();

	public static ImportUpstreamData getInstance() {
		return instance;
	}

	private ImportUpstreamData() {

	}

	/**
	 * 导入销售数据记录
	 */
	private boolean importSellDetail() {
		//TODO 从oracle数据库读取数据
		//TODO 将读入的数据进行处理
		//TODO 写入数据库当中
		return false;
	}

	/**
	 * 导入产品信息
	 */
	boolean importGoods() {
		//select goodsid 药品编号,goodsname 药品名称,goodstype 药品规格,factoryname 生产企业,goodsunit 单位,wholeprice 批发价,stgoodsqty 库存数
		//from nherpuser.zx_pub_goods_price_qty_v
		//where usestatus=1 and goodsid=''

		List<Goods> goodses = GoodsFactory.getInstance().getAllObjects(null);

		//读到的数据
		ResultSet readData = null;

		String sql = "select goodsid,goodsname,goodstype,factoryid,factoryname,goodsunit,wholeprice,stgoodsqty " +
						"from nherpuser.zx_pub_goods_price_qty_v where usestatus = 1 ";
		//String sql = "select goodsid,goodsname,goodstype,factoryid,factoryname,goodsunit,wholeprice,stgoodsqty " +
		//				"from import_inventory";
		String insertGoods = "insert INTO goods(id, goods_name, specification, supplier_id, is_assess)" +
						" values(%d,%s,%s,%d,0);";
		String insertImportInventory = "insert into import_inventory(goodsid, goodsname, goodstype,factoryid, factoryname, " +
						"goodsunit, wholeprice, stgoodsqty) VALUES (%d,%s,%s,%d,%s,%s,%s,%s);";

		int jumpCount = 0, newCount = 0;
		try {
			readData = oracle.select(sql);

			while (readData.next()) {
				//供应商Id或者规格为null 直接不增加
				if (readData.getObject("factoryid") == null || readData.getObject("goodstype") == null) {
					jumpCount++;
					continue;
				}

				//增加供应商
				Supplier supplier = SupplierFactory.getInstance().getObject("id", readData.getString("factoryid"));
				if (supplier == null) {
					supplier = SupplierFactory.getInstance().getNewObject(null);
					try {
						supplier.set("id", readData.getInt("factoryid"));
						supplier.set("supplier_name", readData.getString("factoryname"));
					} catch (WriteValueException e) {
						logger.error("", e);
					}

					supplier.flash();
				}

				boolean find = false;
				//增加到产品表
				for (Goods goods : goodses) {
					if ((long) goods.get("id") == readData.getLong("goodsid")) {
						find = true;
						break;
					}
				}

				if (!find) {
					newCount++;
					selfDB.update(String.format(insertGoods, readData.getLong("goodsid"), selfDB.getString(readData.getString("goodsname")),
									selfDB.getString(readData.getString("goodstype")), supplier.get("id")));
					//增加到导入表
					selfDB.update(String.format(insertImportInventory, readData.getLong("goodsid")
									, selfDB.getString(readData.getString("goodsname")), selfDB.getString(readData.getString("goodstype")),
									readData.getInt("factoryid"),
									selfDB.getString(readData.getString("factoryname")), selfDB.getString(readData.getString("goodsunit")),
									readData.getString("wholeprice"), readData.getString("stgoodsqty")));
				}
			}
		} catch (SQLException e) {
			logger.error("select语句异常,sql:" + sql, e);
			return false;
		} finally {
			oracle.close(readData);
		}

		logger.info("执行完成，共获得新记录{}条，跳过{}条。", newCount, jumpCount);
		return true;
	}

}
