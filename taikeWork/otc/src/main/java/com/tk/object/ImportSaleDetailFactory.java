package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

import java.util.Date;

/**
 * 导入销售情况对象的工厂类。
 */
public class ImportSaleDetailFactory extends AbstractPersistenceFactory<ImportSaleDetail> {
  private static final ImportSaleDetailFactory instance = new ImportSaleDetailFactory();

  public static ImportSaleDetailFactory getInstance() {
    return instance;
  }

  @Override
  protected ImportSaleDetail createObject(User user) {
    return new ImportSaleDetail(this);
  }

  private ImportSaleDetailFactory() {
    this.tableName = "import_sale_detail";
    this.sequenceField = addField("salesdtlid", -1, Integer.class, "nextval('seq_employee')", true, true);
    sequenceField.setSerial("seq_employee");

    addField("salesdtlid", 20, Integer.class, null, false, false);
    addField("credate", -1, Date.class, null, false, false);
    addField("custom_id", 10, Integer.class, null, false, false);
    addField("customname", 2000, String.class, null, false, false);
    addField("goodsid", 10, Integer.class, null, false, false);
    addField("goodsname", 300, String.class, null, false, false);
    addField("goodstype", 2000, String.class, null, false, false);
    addField("factoryid", 10, Integer.class, null, false, false);
    addField("factoryname", 2000, String.class, null, false, false);
    addField("goodsunit", 30, String.class, null, false, false);
    addField("goodsqty", 10, Double.class, null, false, false);
    addField("unitprice", 10, Double.class, null, false, false);
    
    addField("costprice1", 10, Double.class, null, false, false);
    addField("costprice2", 10, Double.class, null, false, false);
    addField("costprice3", 10, Double.class, null, false, false);
    addField("total_line", 10, Double.class, null, false, false);
    addField("costtotal1", 10, Double.class, null, false, false);
    addField("costtotal2", 10, Double.class, null, false, false);
    addField("costtotal3", 10, Double.class, null, false, false);
    
    init();
  }
}
