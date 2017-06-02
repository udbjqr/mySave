package com.tk.object.KPI;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;


public class KPISaleTargetFactory extends AbstractPersistenceFactory<KPISaleTarget> {
  private static final KPISaleTargetFactory instance = new KPISaleTargetFactory();

  public static KPISaleTargetFactory getInstance() {
    return instance;
  }

  @Override
  protected KPISaleTarget createObject(User user) {
    return new KPISaleTarget(this);
  }

  private KPISaleTargetFactory() {
    this.tableName = "kpi_goods_sale_target";
    this.sequenceField = addField("id", -1, Integer.class, null, true, true);
    sequenceField.setSerial("");

    addField("good_id", 10, Integer.class, null, true, false);
    addField("custom_type", 2, Integer.class, null, true, false);
    addField("customer_id", 10, Integer.class, null, false, false);
    addField("attributes_id", 10, Integer.class, null, false, false);
    addField("build_sell_count", 10, Integer.class, null, false, false);
    addField("number", 10, Integer.class, null, false, false);
    addField("money", 15, Double.class, null, false, false);
    addField("flag", 2, String.class, null, false, false);

    setWhetherAddToList(false);
    init();
  }
}
