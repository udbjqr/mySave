package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.util.Date;

/**
 * 销售记录信息的工厂类
 */
public class SaleDetailFactory extends AbstractPersistenceFactory<SaleDetail> {
	private static SaleDetailFactory instance = new SaleDetailFactory();

	public static SaleDetailFactory getInstance() {
		return instance;
	}

	private SaleDetailFactory() {
		this.tableName = "sale_detail";

		addField("id", 20, Long.class, null, true, true);
		addField("sale_time", 20, Date.class, "getdate()", true, false);
		addField("goods_id", 20, Long.class, null, true, false);
		addField("unit", 200, String.class, null, true, false);
		addField("sales_volume", 500, Double.class, null, true, false);
		addField("selling_price", 500, Double.class, null, true, false);
		addField("cost_price1", 500, Double.class, null, true, false);
		addField("cost_price2", 500, Double.class, null, true, false);
		addField("cost_price3", 500, Double.class, null, true, false);
		addField("selling_money", 500, Double.class, null, true, false);
		addField("cost_money1", 500, Double.class, null, true, false);
		addField("cost_money2", 500, Double.class, null, true, false);
		addField("cost_money3", 500, Double.class, null, true, false);
		addField("modify_prices", 10, Integer.class, null, false, false);
		addField("operator_id", 10, Integer.class, null, false, false);
		addField("operator_time", 20, Date.class, "getdate()", false, false);

		setWhetherAddToList(false);

		init();
	}

	@Override
	protected SaleDetail createObject(User user) {
		return new SaleDetail(this, user);
	}
}
