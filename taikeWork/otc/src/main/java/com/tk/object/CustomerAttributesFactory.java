package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;


public class CustomerAttributesFactory extends AbstractPersistenceFactory<CustomerAttributes> {
  private static final CustomerAttributesFactory instance = new CustomerAttributesFactory();

  public static CustomerAttributesFactory getInstance() {
    return instance;
  }

  @Override
  protected CustomerAttributes createObject(User user) {
    return new CustomerAttributes(this);
  }

  private CustomerAttributesFactory() {
    this.tableName = "customer_attributes";
    this.sequenceField = addField("id", -1, Integer.class, null, true, true);
    sequenceField.setSerial("");

    addField("attributes_name", 200, String.class, null, true, false);
    addField("remark", 2000, String.class, null, false, false);
    addField("flag", 10, Integer.class, 0, true, false);

    init();
  }
}
