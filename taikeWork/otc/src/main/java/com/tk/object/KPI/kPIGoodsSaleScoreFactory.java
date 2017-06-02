package com.tk.object.KPI;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;


public class kPIGoodsSaleScoreFactory extends AbstractPersistenceFactory<kPIGoodsSaleScore> {
  private static final kPIGoodsSaleScoreFactory instance = new kPIGoodsSaleScoreFactory();

  public static kPIGoodsSaleScoreFactory getInstance() {
    return instance;
  }

  @Override
  protected kPIGoodsSaleScore createObject(User user) {
    return new kPIGoodsSaleScore(this);
  }

  private kPIGoodsSaleScoreFactory() {
    this.tableName = "kpi_goods_sale_score";
    this.sequenceField = addField("id", -1, Integer.class, null, true, true);
    sequenceField.setSerial("");

    addField("goods_id", 10, Integer.class, null, true, false);
    addField("customer_type", 10, Integer.class, null, true, false);
    addField("customer_id", 10, Integer.class, null, true, false);
    addField("require_build_sell_count", 10, Integer.class, null, true, false);
    addField("build_sell_count", 10, Integer.class, null, true, false);
    addField("build_sell_count_require_ratio", 10, Double.class, null, true, false);
    addField("build_sell_count_actual_ratio", 10, Double.class, null, true, false);
    addField("require_number", 10, Integer.class, null, true, false);
    addField("number", 10, Integer.class, null, true, false);
    addField("number_require_ratio", 10, Double.class, null, true, false);
    addField("number_actual_ratio", 10, Double.class, null, true, false);
    addField("require_money", 10, Double.class, null, true, false);
    addField("money", 10, Double.class, null, true, false);
    addField("money_require_ratio", 10, Double.class, null, true, false);
    addField("money_actual_ratio", 10, Double.class, null, true, false);
    addField("employee_id", 15, Integer.class, null, true, false);
    addField("year", 15, Integer.class, null, true, false);
    addField("month", 15, Integer.class, null, true, false);
    setWhetherAddToList(false);
    init();
  }
}
