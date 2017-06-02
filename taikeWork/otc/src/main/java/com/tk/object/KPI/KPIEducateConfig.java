package com.tk.object.KPI;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.AbstractPersistenceFactory;

/**
 * KPI参数表，记录KPI的公式以及每项的分值等信息.
 */
public class KPIEducateConfig extends AbstractPersistence{

	protected KPIEducateConfig(KPIEducateConfigFactory factory) {
		super(factory);
	}
}
