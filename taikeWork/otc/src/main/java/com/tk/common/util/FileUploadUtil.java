package com.tk.common.util;

import java.io.File;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;

import org.apache.commons.lang.StringUtils;

import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

public class FileUploadUtil {

	/**
	 * 根据请求头解析出文件名 请求头的格式：火狐和google浏览器下：form-data; name="file";
	 * filename="snmp4j--api.zip" IE浏览器下：form-data; name="file";
	 * filename="E:\snmp4j--api.zip"
	 * 
	 * @param header
	 *          请求头
	 * @return 文件名
	 */
	public static String getFileName(String header) {
		/**
		 * String[] tempArr1 =
		 * header.split(";");代码执行完之后，在不同的浏览器下，tempArr1数组里面的内容稍有区别
		 * 火狐或者google浏览器下：tempArr1={form-data,name="file",filename=
		 * "snmp4j--api.zip"}
		 * IE浏览器下：tempArr1={form-data,name="file",filename="E:\snmp4j--api.zip"}
		 */
		String[] tempArr1 = header.split(";");
		/**
		 * 火狐或者google浏览器下：tempArr2={filename,"snmp4j--api.zip"}
		 * IE浏览器下：tempArr2={filename,"E:\snmp4j--api.zip"}
		 */
		String fileName = "";
		if (tempArr1.length > 2) {
			String[] tempArr2 = tempArr1[2].split("=");
			// 获取文件名，兼容各种浏览器的写法
			fileName = tempArr2[1].substring(tempArr2[1].lastIndexOf("\\") + 1).replaceAll("\"", "");
		}
		return fileName;
	}

	/****
	 * 文件上传方法
	 * 
	 * @param request
	 * @return
	 * @throws Exception
	 */
	public static List<Map<String,Object>> fileUpload(HttpServletRequest request, PrintWriter writer,
			List<String> fileTypeList, String savePath) throws Exception {
		List<Map<String,Object>> fileInfoList = new ArrayList<>();
		boolean isResult = false;
		// 获取保存路径
		Collection<Part> parts = null;
		try {
			parts = request.getParts();
		} catch (ServletException e) {
			return fileInfoList;// if this request is not of type multipart/form-data
		}

		List<String> fileImageType = new ArrayList<>();
		fileImageType.add("jpg");
		fileImageType.add("jpeg");
		fileImageType.add("bmp");
		fileImageType.add("png");
		fileImageType.add("gif");

		Integer fileSizeValue = Integer.valueOf(Config.getInstance().getProperty("maxFileSize"));
		String directory = Config.getInstance().getProperty("otherDoucumentDirectory");
		for (Part part : parts) {
			// 获取请求头，请求头的格式：form-data; name="file"; filename="snmp4j--api.zip"
			String header = part.getHeader("content-disposition");
			// 获取文件名
			String fileName = getFileName(header);
			if (StringUtils.isBlank(fileName)) {
				continue;
			}
			String type = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length());

			if (!fileTypeList.contains(type.toLowerCase())) {
				isResult = true;
				writer.println(ErrorCode.FILETYPE_ERROR);
				return fileInfoList;
			} else if (fileImageType.contains(type.toLowerCase())) {
				fileSizeValue = Integer.valueOf(Config.getInstance().getProperty("maxImageSize"));
				directory = Config.getInstance().getProperty("imageDoucumentDirectory");
			}

			long fileSize = part.getSize();
			if (fileSize > fileSizeValue.longValue() * 1024) {
				isResult = true;
				writer.println(ErrorCode.FILEUPLOAD_FIEL_TOO_BiG);
				return fileInfoList;
			}
		}

		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMdd");
		String date = sdf.format(new Date());
		StringBuilder path = new StringBuilder();
		for (Part part : parts) {
			path.delete(0, path.length());
			path.append(savePath);
			Map<String,Object> fileInfoMap = new HashMap<>();
			// 获取请求头，请求头的格式：form-data; name="file"; filename="snmp4j--api.zip"
			String header = part.getHeader("content-disposition");
			// 获取文件名
			String fileName = getFileName(header);
			if (StringUtils.isBlank(fileName)) {
				continue;
			}

			String type = fileName.substring(fileName.lastIndexOf(".") + 1, fileName.length());
			StringBuilder webFilePath = new StringBuilder();
			String newFileName = UUID.randomUUID().toString().replaceAll("-", "") + "." + type;

			path.append(directory).append(date).append("/");

			File f = new File(path.toString());
			if (!f.exists()) {// 如果目标文件所在的目录不存在，则创建父目录
				f.mkdirs();
			}

			path.append(newFileName);
			// 把文件写到指定路径
			part.write(path.toString());
			
			//保存文件路径和大小
			long fileSize = part.getSize();
			double size = ObjectUtil.convert(fileSize / 1024.0 / 1024.0);
			String filePath = webFilePath.append("upload/").append(directory).append(date).append("/").append(newFileName).toString();
			request.getSession().setAttribute(filePath, size + "M");
			fileInfoMap.put("filePath", filePath);
			fileInfoList.add(fileInfoMap);
		}
		
		if(!isResult){
			writer.println(new SuccessJSON("data",fileInfoList));
		}
		return fileInfoList;
	}
}
