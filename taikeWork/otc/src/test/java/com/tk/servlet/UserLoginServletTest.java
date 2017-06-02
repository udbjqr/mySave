package com.tk.servlet;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.util.Config;
import com.tk.common.util.DateUtil;
import com.tk.common.util.WeixinUtils;
import org.junit.Test;

import java.text.SimpleDateFormat;
import java.util.Date;

public class UserLoginServletTest {
	@Test
	public void testSendReqMsg() {
//		UserLoginServlet servlet = new UserLoginServlet();
//		JSONObject userId = servlet.getUserId("a1a76dddb88b102db0fbf4b21e27393b");
//		System.out.println("获得userId :" + userId);
//		String userId = WeixinUtils.getUserId("");
//		System.out.println("userId :" + userId);
		String weChatUrl = null;
		JSONObject userInfo = WeixinUtils.getLoginUserInfo(null, "huzehua", null);
		//获取到微信图像地址
		try {
			weChatUrl = (String) userInfo.get("avatar");
			System.out.println("weChatUrl+++++++++++++" + weChatUrl);
		} catch (Exception e) {
			e.printStackTrace();
		}
		String weChatImg = weChatUrl.substring(0, weChatUrl.lastIndexOf("/"));
		System.out.println(" weChatImg+++++++++++++ " + weChatImg);
		//获取系统配置
//		Config config = Config.getInstance();
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
		String date = df.format(new Date());
		//保存路径
//		String savePath = config.getProperty("fileUploadPath") + config.getProperty("headImageDirectory") + date;
		String savePath = "d:/WebContent/upload/headImage/" + date + "/";
		System.out.println("savePath +++++++++++++ " + savePath);
		//实际保存路径
//		String realPath = WeixinUtils.saveImageByUrl("http://192.168.10.187/otc/images/logo.png", savePath);
		String realPath = WeixinUtils.saveImageByUrl(weChatUrl, savePath);
		System.out.println("realPath +++++++++++++ " + realPath);


//		java.text.DecimalFormat df = new java.text.DecimalFormat("#.##");
//		double d = 5553.14359;
		/*System.out.println(df.format(d));*/

//		System.out.println(convert(d));

//		double size = 307200l / 1024.0 / 1024.0;


//		System.out.println(convert(size));


	}


	static double convert(double value) {
		long l1 = Math.round(value * 100);   //四舍五入
		double ret = l1 / 100.0;               //注意：使用   100.0   而不是   100
		return ret;
	}

	@Test
	public void getheadImgTest() {
//		Date date=new Date(1479528115346L);
		System.out.print(DateUtil.getTime(1479528115346L));
	}
}
