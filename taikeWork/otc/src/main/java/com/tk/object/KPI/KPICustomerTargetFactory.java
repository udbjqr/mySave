package com.tk.object.KPI;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;


public class KPICustomerTargetFactory extends AbstractPersistenceFactory<KPICustomerTarget> {
  private static final KPICustomerTargetFactory instance = new KPICustomerTargetFactory();

  public static KPICustomerTargetFactory getInstance() {
    return instance;
  }

  @Override
  protected KPICustomerTarget createObject(User user) {
    return new KPICustomerTarget(this);
  }

  private KPICustomerTargetFactory() {
    this.tableName = "kpi_good_customer_target";

    addField("good_id", 10, Integer.class, null, true, true);
    addField("attributes_id", 10, Integer.class, null, true, true);
    addField("display_surface", 10, Integer.class, null, true, false);
    addField("weighted_price", 15, Double.class, null, true, false);
    addField("display_number", 10, Integer.class, null, true, false);
    addField("flag", 2, Integer.class, null, true, false);

    setWhetherAddToList(false);
    init();
  }
}
