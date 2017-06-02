package com.tk.servlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import com.tk.common.util.Config;
import com.tk.common.util.FileUploadUtil;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;

@WebServlet("/fileUpload.do")
@MultipartConfig // 标识Servlet支持文件上传
public class FileUploadServlet extends HttpServlet{
	
	private static Logger log = LogManager.getLogger(EmployeeServlet.class.getName());
	
	@Override
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.trace("开始上传文件...");
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		response.setContentType("text/html;charset=UTF-8");
		PrintWriter writer = response.getWriter();
		List<String> fileTypeList = new ArrayList<>();
		fileTypeList.add("ppt");
		fileTypeList.add("pptx");
		fileTypeList.add("doc");
		fileTypeList.add("docx");
		fileTypeList.add("pdf");
		fileTypeList.add("xlsx");
		fileTypeList.add("xls");
		fileTypeList.add("html");
		fileTypeList.add("jpg");
		fileTypeList.add("jpeg");
		fileTypeList.add("bmp");
		fileTypeList.add("png");
		fileTypeList.add("gif");
		
		// 获取保存路径
		String configPath = Config.getInstance().getProperty("fileUploadPath");
		try {
			FileUploadUtil.fileUpload(request,writer,fileTypeList, configPath);
			log.trace("上传文件结束...");
		} catch (Exception e) {
			log.error(ErrorCode.FILEUPLOAD_FAIL,e);
			writer.println(ErrorCode.FILEUPLOAD_FAIL);
		}
		
	}
	
	
}
