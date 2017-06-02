package com.tk.object;


import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;


/****
 * 员工地区工厂类
 * @author tyc
 *
 */
public class AreaDivisionFactory extends AbstractPersistenceFactory<AreaDivision> {
  private static final AreaDivisionFactory instance = new AreaDivisionFactory();

  public static AreaDivisionFactory getInstance() {
    return instance;
  }

  @Override
  protected AreaDivision createObject(User user) {
    return new AreaDivision(this);
  }

  private AreaDivisionFactory() {
    this.tableName = "area_division";
    this.sequenceField = addField("id", -1, Integer.class, null, true, true);
    sequenceField.setSerial("");

    addField("area_name", 200, String.class, null, true, false);
    addField("flag", 0, Integer.class, 0, true, false);
    addField("remark", 2000, String.class, null, false, false);
    
    init();
  }
}
