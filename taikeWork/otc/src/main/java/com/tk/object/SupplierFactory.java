package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;


public class SupplierFactory extends AbstractPersistenceFactory<Supplier> {
  private static final SupplierFactory instance = new SupplierFactory();

  public static SupplierFactory getInstance() {
    return instance;
  }

  @Override
  protected Supplier createObject(User user) {
    return new Supplier(this);
  }

  private SupplierFactory() {
    this.tableName = "supplier";

    addField("id", -1, Integer.class, null, true, true);
    addField("supplier_name", 500, String.class, null, true, false);
    addField("flag", 10, Integer.class, 0, true, false);
    addField("remark", 3000, String.class, null, false, false);
 
    init();
  }
}
