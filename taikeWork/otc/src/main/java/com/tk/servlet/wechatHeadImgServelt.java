package com.tk.servlet;

import com.alibaba.fastjson.JSONObject;
import com.tk.common.util.Config;
import com.tk.common.util.StringUtil;
import com.tk.common.util.WeixinUtils;
import com.tk.servlet.result.ErrorCode;
import com.tk.servlet.result.SuccessJSON;
import org.apache.commons.lang.StringUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.servlet.annotation.WebServlet;
import java.text.SimpleDateFormat;
import java.util.Date;

@WebServlet("/wechatGetImg.do")
public class wechatHeadImgServelt extends BaseServlet {
	protected static Logger logger = LogManager.getLogger(wechatHeadImgServelt.class.getName());

	@Override
	protected void setHandlePermission() {

	}

	@Override
	protected void handle() {
		logger.trace("获取微信头像初始...");
		if (null == employee) {
			logger.trace("session 中无用户信息，跳转登录页面！");
			writer.print(ErrorCode.NOT_LOGIN);
			return;
		}
		//如果未传递参数
		if (null == dataJson) {
			logger.warn("获取前端数据失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		//获取到前端weChatCode
		String weChatCode;
		String weChatUrl;
		try {
			weChatCode = dataJson.getString("code");
		} catch (Exception e) {
			logger.error("获取前端微信Code异常：{}！", e);
			writer.print(ErrorCode.REQUEST_PARA_ERROR);
			return;
		}
		if (StringUtils.isEmpty(weChatCode)) {
			logger.info("获取前端微信Code失败！");
			writer.print(ErrorCode.GET_FONT_END_INFO_ERROR);
			return;
		}
		SuccessJSON success = new SuccessJSON();
		//获取到微信Token
		String token = WeixinUtils.getTokenBySession(session);
		//获取token失败，直接返回空的头像地址
		if (StringUtils.isEmpty(token)) {
			logger.info("获取token为空！");
			success.put("imgUrl", null);
			writer.print(success);
			return;
		}
		//获取到微信userId
		String userId = WeixinUtils.getUserId(token, weChatCode,session);
		if (StringUtils.isEmpty(userId)) {
			logger.info("获取当前用户微信userId为空！");
			success.put("imgUrl", null);
			writer.print(success);
			return;
		}
		//获取到微信头像地址
		JSONObject userJson = WeixinUtils.getLoginUserInfo(token, userId,session);
		if (null == userJson) {
			logger.info("获取当前用户微信信息失败！");
			success.put("imgUrl", null);
			writer.print(success);
			return;
		}
		//获取到微信图像地址
		try {
			weChatUrl = (String) userJson.get("avatar");
		} catch (Exception e) {
			logger.error("获取微信头像异常：{}！", e);
			success.put("imgUrl", null);
			writer.print(success);
			return;
		}
		if (StringUtils.isEmpty(weChatUrl)) {
			logger.info("获取微信头像为空！");
			success.put("imgUrl", null);
			writer.print(success);
			return;
		}
		//获取系统配置
		Config config = Config.getInstance();
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");
		String date = df.format(new Date());
		//保存路径
		String savePath = config.getProperty("fileUploadPath") + config.getProperty("headImageDirectory") + date + "/";
		//实际保存路径
		String realPath = WeixinUtils.saveImageByUrl(weChatUrl, savePath);
		if (StringUtils.isEmpty(realPath)) {
			logger.info("保存微信头像失败！");
			success.put("imgUrl", null);
			writer.print(success);
			return;
		}

		//路径保存至数据库
		String dataPath;
		try {
			dataPath = realPath.substring(realPath.indexOf("upload"), realPath.length());
			employee.set("head_portrait", dataPath);
			employee.flash();
		} catch (Exception e) {
			logger.error("保存头像路径至数据库发生异常！");
			success.put("imgUrl", null);
			writer.print(success);
			return;
		}
		logger.trace("获取微信头像结束...");
		success.put("imgUrl", dataPath);
		writer.print(success);
	}
}
