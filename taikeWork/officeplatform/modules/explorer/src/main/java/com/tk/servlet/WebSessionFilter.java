package com.tk.servlet;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

import static com.tk.common.Constant.threadHttpSessionLink;

/**
 * 此过滤在所有请求过来时将当前线程与Session对应起来。
 */
@WebFilter(filterName = "WebSessionFilter", urlPatterns = "*.do")
public class WebSessionFilter implements Filter {
	public void destroy() {
	}

	public void doFilter(ServletRequest req, ServletResponse resp, FilterChain chain) throws ServletException, IOException {
		threadHttpSessionLink.put(Thread.currentThread(), ((HttpServletRequest) req).getSession());
		chain.doFilter(req, resp);
		threadHttpSessionLink.remove(Thread.currentThread());
	}

	public void init(FilterConfig config) throws ServletException {

	}

}
