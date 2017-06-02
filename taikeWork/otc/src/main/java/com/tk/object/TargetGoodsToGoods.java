package com.tk.object;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.AbstractPersistenceFactory;

/**
 * 对方产品与本系统产品对应对象.
 */


public class TargetGoodsToGoods extends AbstractPersistence {
	protected TargetGoodsToGoods(TargetGoodsToGoodsFactory goodsToMyGoodsFactory) {
		super(goodsToMyGoodsFactory);
	}
}
