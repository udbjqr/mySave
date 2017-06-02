package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;


public class TargetCustomerToCustomerFactory extends AbstractPersistenceFactory<TargetCustomerToCustomer> {
  private static final TargetCustomerToCustomerFactory instance = new TargetCustomerToCustomerFactory();

  public static TargetCustomerToCustomerFactory getInstance() {
    return instance;
  }

  @Override
  protected TargetCustomerToCustomer createObject(User user) {
    return new TargetCustomerToCustomer(this);
  }

  private TargetCustomerToCustomerFactory() {
    this.tableName = "target_customer_to_customer";
    this.sequenceField = addField("id", -1, Integer.class, null, true, true);
    sequenceField.setSerial("");
    
    addField("customer_id", -1, Integer.class, null, true, false);
    addField("target_customer_id", 3000, String.class, null, true, false);

    init();
  }
}
