package com.tk.object;



import java.util.Date;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;


public class VipCustomerRelationFactory extends AbstractPersistenceFactory<VipCustomerRelation> {
  private static final VipCustomerRelationFactory instance = new VipCustomerRelationFactory();

  public static VipCustomerRelationFactory getInstance() {
    return instance;
  }

  @Override
  protected VipCustomerRelation createObject(User user) {
    return new VipCustomerRelation(this);
  }

  private VipCustomerRelationFactory() {
    this.tableName = "vip_customer_relation";
    this.sequenceField = addField("id", -1, Integer.class, null, true, true);
    sequenceField.setSerial("");
    addField("employee_id", -1, Integer.class, null, true, false);
    addField("vip_customer_id", 200, Integer.class, null, true, false);
    addField("title", 200, String.class, null, false, false);
    addField("content", 10, String.class, null, true, false);
    addField("time", 20, Date.class, null, true, false);
    addField("flag", 10, Integer.class, 1, false, false);

    setWhetherAddToList(false);
    init();
  }
  
}
