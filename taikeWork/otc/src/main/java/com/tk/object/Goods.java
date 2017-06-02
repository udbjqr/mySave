package com.tk.object;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.HandleLogFactory;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashMap;
import java.util.Map;


/**
 * 商品对象
 *
 * @author tyc
 */
public class Goods extends AbstractPersistence {

	Goods(GoodsFactory goodsFactory) {
		super(goodsFactory);
	}



}
