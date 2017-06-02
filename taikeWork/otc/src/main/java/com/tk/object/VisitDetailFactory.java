package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.math.BigInteger;
import java.util.Date;


public class VisitDetailFactory extends AbstractPersistenceFactory<VisitDetail> {
	private static final VisitDetailFactory instance = new VisitDetailFactory();

	public static VisitDetailFactory getInstance() {
		return instance;
	}

	@Override
	protected VisitDetail createObject(User user) {
		return new VisitDetail(this);
	}

	private VisitDetailFactory() {
		this.tableName = "customer_visits_detail";
		this.sequenceField = addField("id", -1, Integer.class, null, true, true);
		this.sequenceField.setSerial("");

		addField("visits_id", 10, Integer.class, null, false, true);
		addField("flag", 2, Integer.class, null, true, false);
		addField("goods_id", 10, Integer.class, null, false, false);
		addField("real_stock", 10, Integer.class, null, false, false);
		addField("display_surface", 10, Integer.class, null, false, false);
		addField("tag_price", 15, Double.class, null, false, false);
		addField("weighted_price", 15, Double.class, null, false, false);
		addField("display_number", 10, Integer.class, null, false, false);
		addField("purchase_number", 10, Integer.class, null, false, false);
		addField("purchase_source", 2000, String.class, null, false, false);
		addField("batch_number", 15, String.class, null, false, false);
		addField("sail_number", 10, Integer.class, null, false, false);
		addField("image_urls", 2000, String.class, null, false, false);
		addField("shop_point", 10, Integer.class, null, false, false);
		addField("sail_total", 15, Double.class, null, false, false);
		addField("remark", 2000, String.class, null, false, false);

		setWhetherAddToList(false);
		init();
	}
}
