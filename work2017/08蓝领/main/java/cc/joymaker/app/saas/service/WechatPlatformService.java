package cc.joymaker.app.saas.service;

import cc.joymaker.app.saas.model.RemoteWechatUser;

import java.io.IOException;
import java.io.InputStream;
import java.security.KeyManagementException;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.util.Map;

public interface WechatPlatformService {

	RemoteWechatUser getRemoteUser(String authAppid, String compAppid, String compAccessToken, String code);

	String getBaseOpenid(String authAppid, String compAppid, String compAccessToken, String code);

    String request(String url, String body, Map<String, String> header, WechatMediaCallback callback)
			throws KeyManagementException, NoSuchAlgorithmException, KeyStoreException, IOException;

    interface WechatMediaCallback {
		String save(Map<String, String> headers, InputStream stream);
	}
}
