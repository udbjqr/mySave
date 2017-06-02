package com.tk.object;



import java.util.Date;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;


public class VipCustomerFactory extends AbstractPersistenceFactory<VipCustomer> {
  private static final VipCustomerFactory instance = new VipCustomerFactory();

  public static VipCustomerFactory getInstance() {
    return instance;
  }

  @Override
  protected VipCustomer createObject(User user) {
    return new VipCustomer(this);
  }

  private VipCustomerFactory() {
    this.tableName = "vip_customer";
    this.sequenceField = addField("id", -1, Integer.class, null, true, true);
    sequenceField.setSerial("");
    addField("customer_id", 200, Integer.class, null, true, false);
    addField("real_name", 200, String.class, null, false, false);
    addField("position", 10, String.class, null, true, false);
    addField("birthday", 20, Date.class, null, true, false);
    addField("customer_type", 10, Integer.class, null, true, false);
    addField("phone_number", 10, String.class, null, false, false);
    addField("address", 2000, String.class, null, false, false);
    addField("email", 10, String.class, null, false, false);
    addField("relation_count", 10, Integer.class, 0, false, false);
    addField("flag", 10, Integer.class, 1, false, false);

    setWhetherAddToList(false);
    init();
  }
  
}
