package com.tk;

import com.tk.common.Constant;
import org.activiti.engine.cfg.AbstractProcessEngineConfigurator;
import org.activiti.engine.impl.cfg.ProcessEngineConfigurationImpl;

/**
 *
 */
public class ActivitiConfig extends AbstractProcessEngineConfigurator {
	public void configure(ProcessEngineConfigurationImpl processEngineConfiguration) {
		Constant.processEngineConfiguration = processEngineConfiguration;
		Constant.commandContextFactory = processEngineConfiguration.getCommandContextFactory();
	}
}
