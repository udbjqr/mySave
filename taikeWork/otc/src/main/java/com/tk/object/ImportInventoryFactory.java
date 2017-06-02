package com.tk.object;

import com.tk.common.persistence.AbstractPersistenceFactory;
import com.tk.common.persistence.User;

/**
 * 导入销售情况对象的工厂类。
 */
public class ImportInventoryFactory extends AbstractPersistenceFactory<ImportInventory> {
	private static final ImportInventoryFactory instance = new ImportInventoryFactory();

	public static ImportInventoryFactory getInstance() {
		return instance;
	}

	@Override
	protected ImportInventory createObject(User user) {
		return new ImportInventory(this);
	}

	private ImportInventoryFactory() {
		this.tableName = "import_inventory";

		addField("goodsid", -1, Integer.class, null, true, true);
		addField("goodsname", 3000, String.class, null, false, false);
		addField("goodstype", 2000, String.class, null, false, false);
		addField("factoryname", 2000, String.class, null, false, false);
		addField("goodsunit", 200, String.class, null, false, false);
		addField("wholeprice", 10, Double.class, null, false, false);
		addField("stgoodsqty", 10, Double.class, null, false, false);


		init();
	}
}
