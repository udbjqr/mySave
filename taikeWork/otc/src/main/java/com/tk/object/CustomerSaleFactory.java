package com.tk.object;

import java.util.Date;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

public class CustomerSaleFactory extends AbstractPersistenceFactory<CustomerSale>  {

	private static final CustomerSaleFactory instance = new CustomerSaleFactory();
	public static CustomerSaleFactory getInstance() {
		return instance;
	}

	@Override
	protected CustomerSale createObject(User user) {
		return new CustomerSale(this);
	}

	private CustomerSaleFactory() {
		this.tableName = "customer_sale";

		this.sequenceField = addField("id", -1, Integer.class, null, true, true);
		this.sequenceField.setSerial("");
		addField("customer_id", -1, Integer.class, null, true, false);
		addField("goods_id", -1, Long.class, null, true, false);
		addField("goods_num", -1, Integer.class, null, true, false);
		addField("goods_price", -1, Double.class, 0, true, false);
		addField("goods_saleMoney", -1, Double.class, 1, true, false);
		addField("sale_time", -1, Date.class, 1, true, false);
		

		init();
	}
}
