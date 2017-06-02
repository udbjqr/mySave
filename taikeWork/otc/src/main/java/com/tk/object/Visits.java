package com.tk.object;

import com.tk.common.persistence.AbstractPersistence;

import java.util.ArrayList;
import java.util.List;


/**
 * @author huzehua
 */
public class Visits extends AbstractPersistence {
	List<VisitDetail> details = new ArrayList<>();
	//产品工厂类
	private static GoodsFactory goodsFactory = GoodsFactory.getInstance();
	//获取到拜访明细工厂类
	private static VisitDetailFactory visitDetailFactory = VisitDetailFactory.getInstance();

	Visits(VisitsFactory visitsFactory) {
		super(visitsFactory);
	}


	/**
	 * 实例对象的初始化动作，只在有数据被加载时进行.
	 */
	@Override
	public void init() {
		details = visitDetailFactory.getMultipleObjects("visits_id", get("id"), user);
	}

	public List<VisitDetail> getDetails() {
		return details;
	}
}