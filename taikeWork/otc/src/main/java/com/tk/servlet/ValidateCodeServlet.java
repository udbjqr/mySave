package com.tk.servlet;


import javax.servlet.annotation.WebInitParam;
import javax.servlet.annotation.WebServlet;

import com.google.code.kaptcha.servlet.KaptchaServlet;


/***
 * 验证码Servlet
 * @author Administrator
 *
 */
@WebServlet(value="/validate.do",initParams={
		@WebInitParam(name="kaptcha.border",value="yes"),//设置是否有边框 
		@WebInitParam(name="kaptcha.border.color",value="105,179,90"),//设置边框颜色
		@WebInitParam(name="kaptcha.textproducer.font.color",value="black"),//设置字体颜色
		@WebInitParam(name="kaptcha.image.width",value="130"),//设置验证码宽度
		@WebInitParam(name="kaptcha.image.height",value="50"),//设置验证码高度 
		@WebInitParam(name="kaptcha.textproducer.font.size",value="43"),//设置字体大小
		@WebInitParam(name="kaptcha.textproducer.char.length",value="4"),//设置字体个数
		@WebInitParam(name="kaptcha.textproducer.font.names",value="宋体,楷体,黑体"),//设置字体样式 
		@WebInitParam(name="kaptcha.obscurificator.impl",value="com.google.code.kaptcha.impl.ShadowGimpy"),
		@WebInitParam(name="kaptcha.noise.color",value="white"),
		@WebInitParam(name="kaptcha.textproducer.char.string",value="0123456789")
})
public class ValidateCodeServlet extends KaptchaServlet{
	
}
