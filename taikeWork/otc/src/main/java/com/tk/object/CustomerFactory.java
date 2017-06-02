package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.sql.SQLException;


public class CustomerFactory extends AbstractPersistenceFactory<Customer> {
  private static final CustomerFactory instance = new CustomerFactory();

  public static CustomerFactory getInstance() {
    return instance;
  }

  @Override
  protected Customer createObject(User user) {
    return new Customer(this);
  }

  private CustomerFactory() {
    this.tableName = "customer";
    this.sequenceField = addField("id", -1, Integer.class, null, true, true);
    sequenceField.setSerial("");

    addField("customer_name", 200, String.class, null, true, false);
    addField("remark", 200, String.class, null, false, false);
    addField("flag", 10, Integer.class, 0, true, false);
    addField("area_id", 20, Integer.class, null, true, false);
    addField("employee_id", 10, Integer.class, null, true, false);
    addField("attributes_id", 10, Integer.class, null, false, false);
    addField("address", 2000, String.class, null, false, false);
    addField("person_in_charge_id", 10, Integer.class, null, false, false);
    addField("buyer", 30, String.class, null, false, false);
    addField("buyer_phone", 50, String.class, null, false, false);
    addField("visits_number", 10, Integer.class, null, false, false);
    addField("location", 200, String.class, null, true, false);
    addField("chain_customer_id", 10, Integer.class, null, false, false);
    addField("area_manager", 10, Integer.class, null, false, false);
    addField("gener_manager", 10, Integer.class, null, false, false);

    setWhetherAddToList(false);
    init();
  }

  /**
   * 查询用户管理的表记录数
   *
   * @param employeeId  用户ID
   * @return 查询出来的整数值
   */
  public int getQuerySize(Integer employeeId) throws SQLException {
    return dbHelper.selectOneValues("select count(*) from " + tableName + " where employee_id =" + employeeId);
  }
}
