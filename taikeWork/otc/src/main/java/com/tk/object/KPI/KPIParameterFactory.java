package com.tk.object.KPI;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

public class KPIParameterFactory extends AbstractPersistenceFactory<KPIParameter> {
	private static KPIParameterFactory instrance = new KPIParameterFactory();

	public static KPIParameterFactory getInstrance() {
		return instrance;
	}

	private KPIParameterFactory() {
		this.tableName = "kpi_parameter";
		this.sequenceField = addField("id", -1, Integer.class, null, true, true);
		sequenceField.setSerial("");
		addField("parameter_name", 500, String.class, null, true, true);
		addField("max_score", 10, Double.class, null, true, false);
		addField("formulas", 500, String.class, null, true, false);
		addField("paul_at_the_end", 10, Double.class, null, true, false);
		addField("flag", 0, Integer.class, 0, true, false);

		init();

		getAllObjects(null);
	}

	@Override
	protected KPIParameter createObject(User user) {
		return new KPIParameter(this);
	}
}
