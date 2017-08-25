package cc.joymaker.app.saas.service;

import org.apache.http.Header;
import org.apache.http.HttpHost;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.client.methods.HttpUriRequest;
import org.apache.http.conn.ssl.SSLContextBuilder;
import org.apache.http.conn.ssl.TrustStrategy;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonNode;

import cc.joymaker.app.base.service.HttpResult;
import cc.joymaker.app.base.service.HttpService;
import cc.joymaker.app.base.utils.JsonUtils;
import cc.joymaker.app.saas.model.RemoteWechatUser;

import javax.net.ssl.SSLContext;
import java.io.IOException;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.HashMap;
import java.util.Map;

@Service("saasWechatPlatform")
public class WechatPlatformServiceImpl implements WechatPlatformService {
	Logger log = LoggerFactory.getLogger(WechatPlatformServiceImpl.class);

	final String AUTH_URL = "https://api.weixin.qq.com/sns/oauth2/component/access_token?appid=%s&code=%s&grant_type=authorization_code&component_appid=%s&component_access_token=%s";
	final String USER_URL = "https://api.weixin.qq.com/sns/userinfo?access_token=%s&openid=%s&lang=zh_CN";

	@Value("#{cfg['http.proxy.host']}")
	private String proxyHost = "proxy.hmtx.cc";

	@Value("#{cfg['http.proxy.port']}")
	private Integer proxyPort = 3128;

	@Autowired
	private HttpService httpService;

	@Override
	public RemoteWechatUser getRemoteUser(String authAppid, String compAppid, String compAccessToken, String code) {

		String url = String.format(AUTH_URL, authAppid, code, compAppid, compAccessToken);
		try {
			HttpResult hr = httpService.get(url, null);
			String json = hr.getBody();

			JsonNode root = JsonUtils.getNode(json);
			if (root.has("errcode") && root.has("errmsg")) {
				log.warn("AuthError::" + json);
			}

			String accessToken = root.path("access_token").asText();
			String refreshToken = root.path("refresh_token").asText();
			String openid = root.path("openid").asText();

			String urlUser = String.format(USER_URL, accessToken, openid);
			HttpResult hrUser = httpService.get(urlUser, null);
			String userJson = hrUser.getBody();

			log.info("oauth-user:" + userJson);
			RemoteWechatUser u = JsonUtils.toBean(userJson, RemoteWechatUser.class);

			return u;

		} catch (Exception ex) {
			log.error(url + "|" + ex.getMessage(), ex);
			return null;
		}
	}

	@Override
	public String getBaseOpenid(String authAppid, String compAppid, String compAccessToken, String code) {

		String url = String.format(AUTH_URL, authAppid, code, compAppid, compAccessToken);
		try {
			HttpResult hr = httpService.get(url, null);
			String json = hr.getBody();
			JsonNode root = JsonUtils.getNode(json);
			if (root.has("errcode") && root.has("errmsg")) {
				log.warn("AuthError::" + json);
			}

			String accessToken = root.path("access_token").asText();
			String refreshToken = root.path("refresh_token").asText();
			String openid = root.path("openid").asText();
			return openid;
		} catch (Exception e) {
			log.error(e.getMessage());
			return null;
		}
	}

	@Override
	public String request(String url, String body, Map<String, String> header, WechatMediaCallback callback)
			throws KeyManagementException, NoSuchAlgorithmException, KeyStoreException, IOException {

		log.info("[remote]" + url);
		HttpClientBuilder builder = HttpClients.custom();
		if (proxyHost != null && proxyPort > 0) {
			builder.setProxy(new HttpHost(proxyHost, proxyPort));
		}

		if (url.startsWith("https")) {
			SSLContext sslContext = new SSLContextBuilder().loadTrustMaterial(null, new TrustStrategy() {

				@Override
				public boolean isTrusted(X509Certificate[] arg0, String arg1) throws CertificateException {
					return true;
				}
			}).build();
			builder.setSslcontext(sslContext);
		}
		CloseableHttpClient client = builder.build();

		HttpUriRequest req = null;
		if (body == null) {
			req = new HttpGet(url.toString());
		} else {
			HttpPost post = new HttpPost(url.toString());
			post.setEntity(new StringEntity(body));
			req = post;
		}

		try {
			HttpResponse resp = client.execute(req);
			int code = resp.getStatusLine().getStatusCode();
			if (code == 200) {
				if (callback != null) {
					Map<String, String> respHeaders = new HashMap<String, String>();
					for (Header h : resp.getAllHeaders()) {
						respHeaders.put(h.getName(), h.getValue());
					}
					return callback.save(respHeaders, resp.getEntity().getContent());
				} else {
					String result = EntityUtils.toString(resp.getEntity(), "utf-8");
					// return EntityUtils.toString(resp.getEntity());
					log.info("req|" + url + "|" + result);
					return result;
				}
			}
		} finally {
			client.close();
		}
		return null;

	}
}
