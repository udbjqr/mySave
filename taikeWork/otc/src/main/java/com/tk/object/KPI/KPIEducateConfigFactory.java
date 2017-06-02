package com.tk.object.KPI;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

public class KPIEducateConfigFactory extends AbstractPersistenceFactory<KPIEducateConfig> {
	private static KPIEducateConfigFactory instrance = new KPIEducateConfigFactory();

	public static KPIEducateConfigFactory getInstance() {
		return instrance;
	}

	private KPIEducateConfigFactory() {
		this.tableName = "kpi_educate_config";

		addField("document_id", 10, Integer.class, null, true, true);
		addField("employee_id", 10, Integer.class, null, true, true);
		addField("play_nunmer_less_than", 10, Integer.class, null, false, false);
		addField("play_time_less_than", 10, Integer.class, null, false, false);
		addField("flag", 2, Integer.class, 0, true, false);

		setWhetherAddToList(false);
		init();
	}

	@Override
	protected KPIEducateConfig createObject(User user) {
		return new KPIEducateConfig(this);
	}
}
