package com.tk.object.KPI;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;


public class kPIEducateScoreFactory extends AbstractPersistenceFactory<kPIEducateScore> {
  private static final kPIEducateScoreFactory instance = new kPIEducateScoreFactory();

  public static kPIEducateScoreFactory getInstance() {
    return instance;
  }

  @Override
  protected kPIEducateScore createObject(User user) {
    return new kPIEducateScore(this);
  }

  private kPIEducateScoreFactory() {
    this.tableName = "kpi_educate_score";
    this.sequenceField = addField("id", -1, Integer.class, null, true, true);
    sequenceField.setSerial("");

    addField("document_id", 10, Integer.class, null, true, false);
    addField("employee_id", 10, Integer.class, null, true, false);
    addField("year", 10, Integer.class, null, true, false);
    addField("month", 10, Integer.class, null, true, false);
    addField("require_play_number", 10, Integer.class, null, true, false);
    addField("play_number", 10, Integer.class, null, true, false);
    addField("require_ratio", 15, Double.class, null, true, false);
    addField("actual_ratio", 15, Double.class, null, true, false);

    setWhetherAddToList(false);
    init();
  }
}
