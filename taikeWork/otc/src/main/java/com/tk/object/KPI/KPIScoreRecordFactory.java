package com.tk.object.KPI;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.util.Date;


public class KPIScoreRecordFactory extends AbstractPersistenceFactory<KPIScoreRecord> {
	private static final KPIScoreRecordFactory instance = new KPIScoreRecordFactory();

	public static KPIScoreRecordFactory getInstance() {
		return instance;
	}

	@Override
	protected KPIScoreRecord createObject(User user) {
		return new KPIScoreRecord(this);
	}

	private KPIScoreRecordFactory() {
		this.tableName = "kpi_score_record";

		addField("employee_id", 10, Integer.class, null, true, true);
		addField("year", 10, Integer.class, null, true, false);
		addField("month", 10, Integer.class, null, true, false);
		addField("display_surface_score", 10, Double.class, null, false, false);
		addField("display_number_score", 10, Double.class, null, false, false);
		addField("weighted_price_score", 10, Double.class, null, false, false);
		addField("customer_sale_score", 10, Double.class, null, false, false);
		addField("play_number_score", 10, Double.class, null, false, false);
		addField("chain_customer_sale_score", 10, Double.class, null, false, false);
		addField("build_sell_count_score", 10, Double.class, null, false, false);
		addField("score", 10, Double.class, null, false, false);
		addField("create_time", 20, Date.class, " getdate() ", true, false);
		addField("remark", 2, String.class, null, false, false);
		addField("flag", 2, String.class, null, false, true);

		setWhetherAddToList(false);
		init();
	}
}
