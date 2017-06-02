package com.tk.common.util;

import java.util.List;

/****
 * 分页方法
 * @author Administrator
 *
 */
public class PageUtil {


	/****
	 * 分页方法
	 * @param currentPage 当前页
	 * @param showRow 显示的行数
	 * @param list
	 * @return
	 */
	public static <T> List<T> getPageList(int currentPage, int showRow, List<T> list) {
		//列表总条数
		int total = list.size();
		if (total == 0) {
			return list;
		}
		//计算总条数
		int count = showRow * currentPage;

		//如果计算值大于数据长度,取最后一页的数据
		if (count > total) {
			count = total;
			//获取能取到的最大页数
			int pageTmp;
			if (count % showRow > 0) {
				pageTmp = count / showRow + 1;
			}else{
				pageTmp = count / showRow;
			}
			if (pageTmp < currentPage) {
				currentPage = pageTmp;
			}
		}
		List<T> subList = list.subList(showRow * (currentPage - 1), count);
		return subList;
	}

}
