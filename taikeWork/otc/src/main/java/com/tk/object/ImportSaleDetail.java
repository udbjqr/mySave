package com.tk.object;

import com.tk.common.persistence.AbstractPersistence;
import com.tk.common.persistence.HandleLogFactory;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.util.HashMap;
import java.util.Map;


/**
 * 
 * 导入销售情况对象
 * @author tyc
 */
public class ImportSaleDetail extends AbstractPersistence {
	ImportSaleDetail(ImportSaleDetailFactory importSaleDetailFactory) {
		super(importSaleDetailFactory);
	}


}
