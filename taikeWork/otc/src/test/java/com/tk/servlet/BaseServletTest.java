package com.tk.servlet;

import com.alibaba.fastjson.JSONObject;
import org.junit.Test;

import com.tk.servlet.result.ErrorCode;

public class BaseServletTest {

	@Test
	public void testErrorCode() {
		System.out.print(ErrorCode.CALL_SERVLET_ERROR);
	}

	@Test
	public void testTime() {
		/*String time="2016-09-12 12:48:13.797";

		System.out.print(time.substring(11,13));*/
		
	  /*byte[] buffer = new BASE64Decoder().decodeBuffer(base64Code);
	  FileOutputStream out = new FileOutputStream(targetPath);
	  out.write(buffer);
	  out.close();*/

//		Boolean overStep = GeoUtils.getDistance(115.85718,28.695905, 115.857319,28.69585, 30);
//		System.out.print("skdjh+++++++++++++++" + overStep);

//		String reqStr = "<?xml version=\"1.0\" encoding=\"GBK\"?><request><params><param><curDate>20101010</curDate></param></params></request>";
	}
}