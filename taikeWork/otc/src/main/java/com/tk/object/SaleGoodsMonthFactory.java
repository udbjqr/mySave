package com.tk.object;

import java.util.Date;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;


/****
 * 产品销售工厂类
 * @author tyc
 *
 */
public class SaleGoodsMonthFactory extends AbstractPersistenceFactory<SaleGoodsMonth> {
  private static final SaleGoodsMonthFactory instance = new SaleGoodsMonthFactory();

  public static SaleGoodsMonthFactory getInstance() {
    return instance;
  }

  @Override
  protected SaleGoodsMonth createObject(User user) {
    return new SaleGoodsMonth(this);
  }

  private SaleGoodsMonthFactory() {
    this.tableName = "sale_goods_month";

    addField("useyear", -1, Integer.class, null, true, false);
    addField("usemonth", -1, Integer.class, null, true, false);
    addField("goodsid", -1, Integer.class, null, true, false);
    addField("factoryid", -1, Integer.class, null, false, false);
    addField("total", -1, Double.class, null, false, false);
    addField("entryid", -1, Integer.class, null, false, false);
    addField("goodsqty", -1, Double.class, null, false, false);
    
    
    init();
  }
}
