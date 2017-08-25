package cc.joymaker.app.saas.controller;

import java.io.File;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.TreeMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang3.RandomUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;

import cc.joymaker.app.base.model.AppConfig;
import cc.joymaker.app.base.service.ApiService;
import cc.joymaker.app.base.service.AppConfigService;
import cc.joymaker.app.base.service.SaasDomainService;
import cc.joymaker.app.base.service.StorageService;
import cc.joymaker.app.base.utils.AuthInvokeUtils;
import cc.joymaker.app.base.utils.HttpUtils;
import cc.joymaker.app.base.utils.JsonUtils;
import cc.joymaker.app.base.utils.QRCodeUtil;
import cc.joymaker.app.base.utils.Result;
import cc.joymaker.app.base.utils.Sys;

/**
 * 本接口组用于登录认证使用
 * 
 * @author zhangyuxin85@gmail.com
 *
 */
@Controller
@RequestMapping("/opauth")
public class WechatPlatformAction {

	Logger log = LoggerFactory.getLogger(WechatPlatformAction.class);
	private static final String OPENID_AUTH_TOKEN_KEY = "_OPENID_AUTH_TOKEN_KEY";
	private static final String AUTH_ENDPOINT = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=%s&state=%s&component_appid=%s#wechat_redirect";

	@Value("#{cfg['wechat.auth.url']}")
	private String wechatAuthUrl;

	@Value("#{cfg['scope']}")
	private String systemConditon;

	@Value("#{cfg['wechat.cj.appid']}")
	private String cjAppid;

	@Value("#{cfg['wechat.cj.compAppid']}")
	private String cjCompAppid;

	@Value("#{cfg['open.cj.appid']}")
	private String cjOpenAppid;

	@Value("#{cfg['saas.bucket.public']}")
	private String bucket;

	@Value("#{cfg['system.protocol']}")
	private String protocol;

	@Autowired
	private ApiService api;

	@Autowired
	private AppConfigService config;

	@Autowired
	private SaasDomainService saas;

	@Autowired
	private StorageService storageService;

	@RequestMapping(value = "/app", method = RequestMethod.POST)
	public @ResponseBody Result authApp(HttpServletResponse resp, HttpServletRequest req) {

		Result r = Result.SUCCESS;
		Map<String, Object> d = new HashMap<String, Object>();

		String orgId = Sys.getString(Sys.ORGID);
		String url = wechatAuthUrl + "?orgId=" + orgId;
		d.put("orginUrl", url);

		File f = new File("/tmp/" + orgId + "/auth.png");
		try {
			// FileOutputStream fos = new FileOutputStream(f);
			if (!f.exists()) {
				f.mkdirs();
			}
			QRCodeUtil.encode(url, f);
			// fos.close();

			String key = "weauth/" + orgId + "/auth.png";
			String qrUrl = storageService.upload(bucket, key, f);
			// r.setData(qrUrl);
			d.put("orginUrl", url);
			d.put("targetUrl", qrUrl);
			// .f.deleteOnExit();
			r.setData(d);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}

		return r;
	}

	@RequestMapping(value = "/jssdk", method = RequestMethod.POST)
	public @ResponseBody Result authJsSdk(HttpServletResponse resp, HttpServletRequest req) {

		Result r = Result.SUCCESS;
		Map<String, Object> d = new HashMap<String, Object>();

		// String orgId = Sys.getString(Sys.ORGID);

		try {
			AppConfig cfg = config.getAppConfig(cjOpenAppid);

			if (cfg == null) {
				return Result.error("参数错误");
			}
			String data = null;
			Map<String, Object> headers = AuthInvokeUtils.getClientHeaders(req);
			headers.put("client-ip", HttpUtils.getRemortIP(req));

			Map<String, String[]> params = req.getParameterMap();
			Map<String, Object> reqParams = new HashMap<>();
			for (Entry<String, String[]> entry : params.entrySet()) {
				reqParams.put(entry.getKey(), entry.getValue()[0]);
			}
			reqParams.put("appid", cjAppid);
			reqParams.put("comp_appid", cjCompAppid);

			data = api.get(cfg.getAppid(), cfg.getAppSecret(), "acms", "GetWechatHosting", reqParams, headers);
			if (StringUtils.isNotBlank(data)) {
				JsonNode rconfig = JsonUtils.readValue(data, new TypeReference<JsonNode>() {
				});

				if (rconfig != null && rconfig.get("code").asInt() == 1) {
					d.put("jssdk", buildCommonParams(req, cjAppid, rconfig.get("context")));
					r.setData(d);
				}
			}

		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}

		return r;
	}

	/**
	 * 1，微信JSSDK类相关参数 2，用户 3，
	 * 
	 * @param req
	 * @return
	 * @throws URISyntaxException
	 */
	protected Map<String, Object> buildCommonParams(HttpServletRequest req, String appid, JsonNode config)
			throws URISyntaxException {

		String referer = req.getHeader("referer");
		if (StringUtils.isBlank(referer)) {
			return Collections.emptyMap();
		}
		//URI uri = new URI(referer);
		//String url = protocol + "://" + uri.getHost() + uri.getPath();
		//String queryStr = uri.getQuery();

		String noncestr = "" + System.currentTimeMillis() + RandomUtils.nextInt(1000, 10000);

		long timestamp = System.currentTimeMillis();

		Map<String, String> params = new TreeMap<String, String>();

		params.put("noncestr", noncestr);
		params.put("jsapi_ticket", config.get("jsTicket").asText());
		params.put("timestamp", timestamp / 1000 + "");
		params.put("url", referer);

		// if (StringUtils.isNotBlank(queryStr))
		// params.put("url", url + "?" + queryStr);
		// else
		// params.put("url", url);

		List<String> paramsList = new ArrayList<String>();

		for (Entry<String, String> entry : params.entrySet()) {
			paramsList.add(entry.getKey() + "=" + entry.getValue());
		}

		String base = StringUtils.join(paramsList, '&');

		String sign = DigestUtils.sha1Hex(base);
		params.put("appId", appid);

		Map<String, Object> commonParams = new HashMap<String, Object>();
		commonParams.put("jssdk_sign", sign);
		commonParams.putAll(params);

		return commonParams;
	}

	public static void main(String[] args) throws URISyntaxException {
		System.out.println(new URI("https://www.baidu.com/a/p?xsdf=sdf&sfer=345").getQuery());
	}
}
