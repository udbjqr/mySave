package com.tk.common.util;

import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;

import javax.servlet.http.HttpSession;
import java.io.*;
import java.net.URL;
import java.net.URLConnection;
import java.util.Map;
import java.util.UUID;

/**
 * 项目名称: OTC <br/>
 * 类名称 : weixinUtils.java<br/>
 * 类描述 : 微信工具类<br/>
 *
 * @author huzehua <br/>
 * @version 2.0
 * @apiNote 2016/11/01 代码抽取优化
 */
public class WeixinUtils {

	//企业号
	private static final String corpId = "wxbbfff10e577b27a7";
	//企业密钥
	private static final String corpSecret = "Z_Dil3VBdilqoYqwYb_efSTGERI6SETF5cMjNwO4uXaLWIw3HNpxZVfZDYE5RjQe";

	/**
	 * HttpClient 接口获取数据
	 *
	 * @param url       传输地址
	 * @param postType  提交类型（get,post）
	 * @param paramJson （post 提交参数）
	 * @return 返回数据
	 */
	public static JSONObject getReturnObject(String url, String postType, JSONObject paramJson) {
		if (StringUtils.isEmpty(url)) {
			return null;
		}
		CloseableHttpClient httpclient;
		HttpPost httpPost;
		ResponseHandler<JSONObject> responseHandler;
		JSONObject responseBody;
		try {
			httpclient = HttpClients.createDefault();
			httpPost = new HttpPost(url);
			//POST提交参数
			if ("post".equals(postType)) {
				if (null == paramJson) {
					return null;
				}
				StringEntity myEntity = new StringEntity(paramJson.toString());
				myEntity.setContentEncoding("UTF-8");
				myEntity.setContentType("application/json");
				//设置需要传递的数据
				httpPost.setEntity(myEntity);
			}
			responseHandler = new ResponseHandler<JSONObject>() {
				//成功调用连接后，对返回数据进行的操作
				public JSONObject handleResponse(
								final HttpResponse response) throws IOException {
					int status = response.getStatusLine().getStatusCode();
					if (status >= 200 && status < 300) {
						//获得调用成功后  返回的数据
						HttpEntity entity = response.getEntity();
						if (null != entity) {
							String result = EntityUtils.toString(entity);
							//根据字符串生成JSON对象
							JSONObject resultObj = JSONObject.parseObject(result);
							System.out.println("resultObj：   " + resultObj);
							return resultObj;
						} else {
							return null;
						}
					} else {
						throw new ClientProtocolException("未知的请求状态: " + status);
					}
				}
			};
			//获得返回结果
			responseBody = httpclient.execute(httpPost, responseHandler);
			return responseBody;
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
	}

	/**
	 * 从session 中 获得 access_token
	 */
	public static String getTokenBySession(HttpSession session) {
		String access_token;
		String deadLine;
		//session 中获取token 数据
		JSONObject assTokenInfo = (JSONObject) session.getAttribute("token_info");
		if (null == assTokenInfo) {
			assTokenInfo = new JSONObject();
			access_token = getToken();
			deadLine = DateUtil.countSecond(DateUtil.getTime(), 7000);
			assTokenInfo.put("access_token", access_token);
			//设置 access_token过期时间
			assTokenInfo.put("deadLine", deadLine);
			session.setAttribute("token_info", assTokenInfo);
			return access_token;
		}
		access_token = (String) assTokenInfo.get("access_token");
		deadLine = (String) assTokenInfo.get("deadLine");
		//获取时间差
		long timeDiffer = DateUtil.getSecond(DateUtil.getTime(), deadLine);
		//如果未过期
		if (timeDiffer > 0) {
			return access_token;
		}
		assTokenInfo = new JSONObject();
		access_token = getToken();
		deadLine = DateUtil.countSecond(DateUtil.getTime(), 7000);
		assTokenInfo.put("access_token", access_token);
		//设置 access_token过期时间
		assTokenInfo.put("deadLine", deadLine);
		session.setAttribute("token_info", assTokenInfo);
		return access_token;
	}

	/**
	 * 从session 中 获得 jsapi_ticket
	 */
	public static String getJsapiTicketBySession(HttpSession session) {
		String jsapi_ticket;
		String deadLine;
		String accessToken;
		//session 中获取 jsapi_ticket 数据
		JSONObject ticketInfo = (JSONObject) session.getAttribute("ticketInfo");
		if (null == ticketInfo) {
			ticketInfo = new JSONObject();
			//获得token
			accessToken = getTokenBySession(session);
			jsapi_ticket = getJsapiTicket(accessToken, session);
			//获取失败
			if (null == jsapi_ticket) {
				return null;
			}
			deadLine = DateUtil.countSecond(DateUtil.getTime(), 7000);
			ticketInfo.put("jsapi_ticket", jsapi_ticket);
			//设置jsapi_ticket过期时间
			ticketInfo.put("deadLine", deadLine);
			session.setAttribute("ticketInfo", ticketInfo);
			return jsapi_ticket;
		}
		jsapi_ticket = (String) ticketInfo.get("jsapi_ticket");
		deadLine = (String) ticketInfo.get("deadLine");
		//获取时间差
		long timeDiffer = DateUtil.getSecond(DateUtil.getTime(), deadLine);
		//如果未过期
		if (timeDiffer > 0) {
			return jsapi_ticket;
		}
		ticketInfo = new JSONObject();
		//获得token
		accessToken = getTokenBySession(session);
		jsapi_ticket = getJsapiTicket(accessToken, session);
		//获取失败
		if (null == jsapi_ticket) {
			return null;
		}
		deadLine = DateUtil.countSecond(DateUtil.getTime(), 7000);
		ticketInfo.put("jsapi_ticket", jsapi_ticket);
		//设置 access_token过期时间
		ticketInfo.put("deadLine", deadLine);
		session.setAttribute("ticketInfo", ticketInfo);
		return jsapi_ticket;
	}

	/**
	 * 获得 access_token
	 */
	public static String getToken() {
		//返回结果
		JSONObject responseBody;
		String access_token;
		String url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=" + corpId + "&corpsecret=" + corpSecret;
		try {
			responseBody = getReturnObject(url, "get", null);
			access_token = (String) responseBody.get("access_token");
			return access_token;
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 获得 jsapi_ticket
	 */
	public static String getJsapiTicket(String accessToken, HttpSession session) {
		//获得Token
		if (StringUtils.isEmpty(accessToken)) {
			accessToken = getTokenBySession(session);
		}
		if (accessToken == null) {
			return null;
		}
		String api_ticket;
		//返回结果
		JSONObject responseBody;
		String url = "https://qyapi.weixin.qq.com/cgi-bin/get_jsapi_ticket?access_token=" + accessToken;
		try {
			responseBody = getReturnObject(url, "get", null);
			api_ticket = (String) responseBody.get("ticket");
			return api_ticket;
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 根据code获取到成员UserId
	 *
	 * @param accessToken token
	 * @param weChatCode  微信Code
	 * @return
	 */
	public static String getUserId(String accessToken, String weChatCode, HttpSession session) {
		//非空判断
		if (StringUtils.isEmpty(weChatCode)) {
			return null;
		}
		//返回结果
		JSONObject responseBody;
		String userId = null;
		try {
			//获得Token
			if (StringUtils.isEmpty(accessToken)) {
				accessToken = getTokenBySession(session);
			}
			if (accessToken == null) {
				return null;
			}
			//提交地址
			String url = "https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo?access_token=" + accessToken + "&code=" + weChatCode;
			responseBody = getReturnObject(url, "get", null);
			if (null == responseBody) {
				return null;
			}
			for (Map.Entry<String, Object> entry : responseBody.entrySet()) {
				if (entry.getKey().toUpperCase().equals("USERID") || entry.getKey().toUpperCase().equals("OPENID")) {
					userId = (String) entry.getValue();
					break;
				} else if (entry.getKey().toUpperCase().equals("ERRCODE")) {
					return null;
				}
			}
			return userId;
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 根据成员的userId和token 获取OpenId
	 *
	 * @param accessToken
	 * @param userId      成员的用户Id
	 * @return
	 */
	public static String getOpenId(String accessToken, String userId, HttpSession session) {
		//返回结果
		JSONObject responseBody;
		//access_token
		String openid;
		try {
			//获得Token
			if (StringUtils.isEmpty(accessToken)) {
				accessToken = getTokenBySession(session);
			}
			if (accessToken == null) {
				return null;
			}
			String url = "https://qyapi.weixin.qq.com/cgi-bin/user/convert_to_openid?access_token=" + accessToken;
			//发送json格式的数据
			JSONObject paramJson = new JSONObject();
			paramJson.put("userid", userId);
			responseBody = getReturnObject(url, "post", paramJson);
			//获取到openId
			openid = (String) responseBody.get("openid");
			return openid;
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 根据企业号成员的userId获取企业用户信息
	 *
	 * @param userId 成员的用户Id
	 * @return
	 */
	public static JSONObject getLoginUserInfo(String accessToken, String userId, HttpSession session) {
		//非空判断
		if (StringUtils.isEmpty(userId)) {
			return null;
		}
		//返回结果
		JSONObject responseBody;
		try {
			//获得Token
			if (StringUtils.isEmpty(accessToken)) {
				accessToken = getTokenBySession(session);
			}
			if (accessToken == null) {
				return null;
			}
			//提交地址
			String url = "https://qyapi.weixin.qq.com/cgi-bin/user/get?access_token=" + accessToken + "&userid=" + userId;
			responseBody = getReturnObject(url, "get", null);
			if (null == responseBody) {
				return null;
			}
			return responseBody;
		} catch (Exception e) {
			return null;
		}
	}

	/**
	 * 把微信图片下载到本地服务器
	 *
	 * @param imageurl 微信头像服务器地址
	 * @param savepath 保存地址
	 * @return 图片保存位置
	 */
	public static String saveImageByUrl(String imageurl, String savepath) {
		// 输入流
		InputStream is = null;
		// 输出的文件流
		OutputStream os = null;
		URLConnection con = null;
		try {
			// 构造URL
			URL url = new URL(imageurl);

			// 打开连接
			for (int i = 0; i < 10; i++) {
				con = url.openConnection();
				if (con != null) {
					break;
				}
			}
			// 输入流
			is = con.getInputStream();
			// 1K的数据缓冲
			byte[] bs = new byte[1024];
			// 读取到的数据长度
			int len;
			File file = new File(savepath);
			if (!file.exists()) {
				file.mkdirs();
			}
			//保存图片名
			String fileName = UUID.randomUUID().toString().replaceAll("-", "") + ".jpg";
			//图片保存位置
			String realPath = savepath + fileName;
			// 输出的文件流
			os = new FileOutputStream(realPath);
			// 开始读取
			while ((len = is.read(bs)) != -1) {
				os.write(bs, 0, len);
			}
			// 完毕，关闭所有链接
			os.close();
			is.close();
			return realPath;
		} catch (IOException e) {
			return null;
		} catch (Exception e) {
			return null;
		} finally {
			try {
				// 完毕，关闭所有链接
				os.close();
				is.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

}
