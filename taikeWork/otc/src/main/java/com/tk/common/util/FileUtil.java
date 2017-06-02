package com.tk.common.util;

import org.apache.commons.codec.binary.Base64;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;

public class FileUtil {
	private static final Logger logger = LogManager.getLogger(FileUtil.class.getName());

	/**
	 * 根据给定的编码，从文件中读取字符串
	 *
	 * @param configURL URL地址
	 * @param code      指定文件的编码格式
	 * @return 读取到的字符串
	 */
	public static String getProperties(URL configURL, String code) {
		logger.debug("Reading configuration from URL {}", configURL);
		InputStream stream;
		URLConnection uConn;
		BufferedReader reader;
		StringBuilder builder = new StringBuilder();

		try {
			uConn = configURL.openConnection();
			uConn.setUseCaches(false);
			stream = uConn.getInputStream();
			InputStreamReader inputStreamReader = new InputStreamReader(stream, code);
			reader = new BufferedReader(inputStreamReader);
			String tempString;
			while ((tempString = reader.readLine()) != null) {
				builder.append(tempString).append(StringUtil.NEWLINE);
			}
			reader.close();

			return builder.toString();
		} catch (Exception e) {
			logger.error("{} error", configURL, e);
			return null;
		}
	}


	public static Properties getPropertiesFromString(String config){
		Properties properties = new Properties();
		try{
			properties.load(new StringReader(config));
		}catch (Exception e){
			logger.error("配置转换出错：",e);
		}
		return properties;
	}
	
	/****
	 * 文件转Base64
	 * @param file
	 * @return
	 * @throws Exception
	 */
	public static String getFileByteString(File file) throws Exception {
		Base64 b64 = new Base64();
		FileInputStream fis = new FileInputStream(file);
		System.out.print(file.length());
		byte[] buffer = new byte[(int) file.length()];
		System.out.print(buffer.length);
		fis.read(buffer);
		fis.close();

		return b64.encodeToString(buffer);
	}

	
	/**
	 * 获得可上传的文件类型
	 *
	 * @return
	 */
	public static List<String> getFileTypeList() {
		List<String> fileTypeList = new ArrayList<String>();
		fileTypeList.add("jpg");
		fileTypeList.add("jpeg");
		fileTypeList.add("bmp");
		fileTypeList.add("png");
		fileTypeList.add("gif");
		return fileTypeList;
	}

	/****
	 * Base64转文件
	 */
	public static void getFileByString(String string, String target) throws Exception{
		String fileBase64Str = string.substring(string.indexOf(",")+1, string.length()-1);
		Base64 b64 = new Base64();
		byte[] buffer = b64.decode(fileBase64Str);
		FileOutputStream fos = new FileOutputStream(target);
		fos.write(buffer);
		fos.close();
	}
	
	/***
	 * 文件大小校验
	 * @param target
	 * @param fileSizeKey
	 * @return
	 */
	public static boolean checkFileSize(String string,String fileSizeKey){
		String fileBase64Str = string.substring(string.indexOf(",")+1, string.length()-1);
		Base64 b64 = new Base64();
		byte[] buffer = b64.decode(fileBase64Str);
		Integer fileSizeValue = Integer.valueOf(Config.getInstance().getProperty(fileSizeKey));
		if(buffer.length>fileSizeValue.intValue()*1024){
			return false;
		}
		return true;
	}
	
	
	
	public static void main(String[] args) {
		try {
			String byteString = getFileByteString(new File("C:\\Users\\Administrator\\Desktop\\产品导入模板.xls"));
			System.out.println("byteString:"+byteString);

			String target = "D:/456.xls";
			getFileByString(byteString, target);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	

}