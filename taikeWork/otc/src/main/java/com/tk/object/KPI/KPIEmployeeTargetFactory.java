package com.tk.object.KPI;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;


public class KPIEmployeeTargetFactory extends AbstractPersistenceFactory<KPIEmployeeTarget> {
  private static final KPIEmployeeTargetFactory instance = new KPIEmployeeTargetFactory();

  public static KPIEmployeeTargetFactory getInstance() {
    return instance;
  }

  @Override
  protected KPIEmployeeTarget createObject(User user) {
    return new KPIEmployeeTarget(this);
  }

  private KPIEmployeeTargetFactory() {
    this.tableName = "kpi_good_employee_target";

    addField("good_id", 10, Integer.class, null, true, true);
    addField("employee_id", 10, Integer.class, null, true, true);
    addField("display_surface", 10, Integer.class, null, true, false);
    addField("display_number", 10, Integer.class, null, true, false);
    addField("weighted_price", 10, Double.class, null, true, false);
    addField("attributes_id", 2, Integer.class, null, true, false);
    addField("flag", 2, Integer.class, null, true, false);

    setWhetherAddToList(false);
    init();
  }
}
