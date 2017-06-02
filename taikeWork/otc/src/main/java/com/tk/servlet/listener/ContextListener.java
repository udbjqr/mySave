package com.tk.servlet.listener;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.tk.common.util.scheduler.SchedulerManager;

import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

@WebListener()
public class ContextListener implements ServletContextListener{
	private static final Logger logger = LogManager.getLogger(ContextListener.class.getName());
	@Override
	public void contextInitialized(ServletContextEvent servletContextEvent) {
		logger.info("OTC服务正式启动");
		SchedulerManager.getInstance().start();
	}

	@Override
	public void contextDestroyed(ServletContextEvent servletContextEvent) {
		logger.info("OTC服务正式关闭。");
	}
}
