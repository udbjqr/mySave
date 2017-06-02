package com.tk.object;

/**
 * 控制是否显示字段枚举。
 */
enum ControlViewField {
	cost_price1(1), cost_price2(2), cost_price3(3), selling_price(4), NULL(5);

	private final int index;

	ControlViewField(int index) {
		this.index = index;
	}

	//是否包含枚举项
	public static boolean contains(String name) {
		//所有的枚举值
		ControlViewField[] fields = values();
		//遍历查找
		for (ControlViewField s : fields) {
			if (s.name().equals(name)) {
				return true;
			}
		}

		return false;
	}

	public int getIndex() {
		return index;
	}
}
