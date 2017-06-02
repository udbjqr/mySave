package com.tk.object.KPI;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;


public class KPIGoodCumsotrScoreFactory extends AbstractPersistenceFactory<KPIGoodCumsotrScore> {
  private static final KPIGoodCumsotrScoreFactory instance = new KPIGoodCumsotrScoreFactory();

  public static KPIGoodCumsotrScoreFactory getInstance() {
    return instance;
  }

  @Override
  protected KPIGoodCumsotrScore createObject(User user) {
    return new KPIGoodCumsotrScore(this);
  }

  private KPIGoodCumsotrScoreFactory() {
    this.tableName = "kpi_goods_customer_score";
    this.sequenceField = addField("id", -1, Integer.class, null, true, true);
    sequenceField.setSerial("");

    addField("goods_id", 10, Integer.class, null, true, false);
    addField("customer_id", 10, Integer.class, null, true, false);
    addField("require_display_number", 10, Integer.class, null, true, false);
    addField("display_number", 10, Integer.class, null, true, false);
    addField("require_display_surface", 10, Integer.class, null, true, false);
    addField("display_surface", 10, Integer.class, null, true, false);
    addField("require_weighted_price", 10, Double.class, null, true, false);
    addField("weighted_price", 10, Double.class, null, true, false);
    addField("display_surface_require_ratio", 10, Double.class, null, true, false);
    addField("display_surface_ratio", 10, Double.class, null, true, false);
    addField("display_number_require_ratio", 10, Double.class, null, true, false);
    addField("display_number_ratio", 10, Double.class, null, true, false);
    addField("weighted_price_require_ratio", 10, Double.class, null, true, false);
    addField("weighted_price_ratio", 10, Double.class, null, true, false);
    addField("employee_id", 15, Integer.class, null, true, false);
    addField("year", 15, Integer.class, null, true, false);
    addField("month", 15, Integer.class, null, true, false);
    setWhetherAddToList(false);
    init();
  }
}
