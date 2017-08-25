package cc.joymaker.app.saas.controller;

import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.JsonNode;

import cc.joymaker.app.base.model.AppConfig;
import cc.joymaker.app.base.service.ApiService;
import cc.joymaker.app.base.service.AppConfigService;
import cc.joymaker.app.base.service.SaasDomainService;
import cc.joymaker.app.base.utils.AuthInvokeUtils;
import cc.joymaker.app.base.utils.JsonUtils;
import cc.joymaker.app.base.utils.Result;
import cc.joymaker.app.base.utils.Sys;
import cc.joymaker.app.saas.service.RedisService;

/**
 * 本接口组用于获取和修改用户信息
 * 
 * @author zhangyuxin85@gmail.com
 * 
 */
@RequestMapping("/user")
@Controller
public class UserAction {

	@Autowired
	private ApiService api;

	@Autowired
	private AppConfigService config;

	@Autowired
	private SaasDomainService saas;

	@Autowired
	private RedisService redis;

	/**
	 * 获取登录用户信息
	 * 
	 * @return
	 */
	@RequestMapping(value = "/get", method = RequestMethod.GET)
	public @ResponseBody Result getUser(HttpServletRequest req) {
		AppConfig cfg = config.getAppConfig(saas.getCurrentAppid());
		Map<String, Object> params = new HashMap<>();
		params.put("userid", Sys.get(Sys.USERID));
		try {
			String result = api.get(cfg.getAppid(), cfg.getAppSecret(), "es", "GetUser", params,
					AuthInvokeUtils.getClientHeaders(req));
			JsonNode node = JsonUtils.getNode(result);
			return Result.success(node);
		} catch (Exception ex) {
			return Result.error(ex.getMessage());
		}
	}

	/**
	 * 修改密码
	 * 
	 * @return
	 */
	@RequestMapping(value = "/pwd/update", method = RequestMethod.POST)
	public @ResponseBody Result updatePwd(@RequestParam("name") String name, @RequestParam("oldpwd") String password,
			@RequestParam("newpwd") String newpassword, HttpServletRequest req) {
		AppConfig cfg = config.getAppConfig(saas.getCurrentAppid());
		Map<String, Object> params = new HashMap<>();

		params.put("username", name);
		params.put("old_password", password);
		params.put("new_password", newpassword);

		try {
			String data = api.post(cfg.getAppid(), cfg.getAppSecret(), "es", "UpdatePassword",
					JsonUtils.formBean(params), AuthInvokeUtils.getClientHeaders(req));

			JsonNode node = JsonUtils.getNode(data);
			int code = node.get("code").asInt();
			if (code == 1) {
				return Result.SUCCESS;
			} else {
				String msg = node.get("msg").asText();
				return Result.error(msg);
			}

		} catch (Exception ex) {
			return Result.error(ex.getMessage());
		}
	}

	/**
	 * 找回密码
	 * 
	 * @return
	 */
	@RequestMapping(value = "/pwd/reset", method = RequestMethod.POST)
	public @ResponseBody Result resetPwd(@RequestParam("mobile") String mobile, @RequestParam("pin") String vcode,
			@RequestParam("password") String pwd, HttpServletRequest req) {
		Map<String, Object> params = new HashMap<>();
		params.put("mobile", mobile);
		params.put("vcode", vcode);
		params.put("new_password", pwd);
		AppConfig cfg = config.getAppConfig(saas.getCurrentAppid());

		try {
			String result = api.post(cfg.getAppid(), cfg.getAppSecret(), "es", "ResetPassword",
					JsonUtils.formBean(params), AuthInvokeUtils.getClientHeaders(req));
			JsonNode node = JsonUtils.getNode(result);
			int code = node.get("code").asInt();
			if (code == 1) {
				return Result.SUCCESS;
			} else {
				return Result.error(node.get("msg").asText());
			}
		} catch (Exception ex) {
			return Result.error(ex.getMessage());
		}
	}

	/**
	 * 发送验证码
	 * 
	 * @return
	 */
	@RequestMapping(value = "/pwd/sendpin", method = RequestMethod.POST)
	public @ResponseBody Result sendPin(@RequestParam("mobile") String mobile, HttpServletRequest req) {
		Map<String, Object> params = new HashMap<>();
		params.put("mobile", mobile);
		AppConfig cfg = config.getAppConfig(saas.getCurrentAppid());

		try {
			String result = api.post(cfg.getAppid(), cfg.getAppSecret(), "es", "SendVCode", JsonUtils.formBean(params),
					AuthInvokeUtils.getClientHeaders(req));
			JsonNode node = JsonUtils.getNode(result);
			int code = node.get("code").asInt();
			if (code == 1) {
				return Result.SUCCESS;
			} else {
				return Result.error(node.get("msg").asText());
			}
		} catch (Exception ex) {
			return Result.error(ex.getMessage());
		}
	}

	@RequestMapping(value = "/wechat/bind", method = RequestMethod.POST)
	public @ResponseBody Result bindWechat(@RequestParam("token") String token,
			@RequestParam(value = "avatar", required = false) String avatar,
			@RequestParam(value = "nickname", required = false) String nickname, HttpServletRequest req) {

		String bindkey = "_OPENID_BIND_TOKEN_KEY";
		String data = redis.get(bindkey, token);
		if (StringUtils.isBlank(data)) {
			return Result.error("未找到授权信息");
		}

		AppConfig cfg = config.getAppConfig(saas.getCurrentAppid());

		try {
			Map<String, Object> params = new HashMap<>();
			params.put("userid", Sys.get(Sys.USERID));
			params.put("openid", data);
			params.put("nickname", URLDecoder.decode(nickname, "UTF-8"));
			params.put("avatar", URLDecoder.decode(avatar, "UTF-8"));
			String result = api.post(cfg.getAppid(), cfg.getAppSecret(), "es", "BindOpenid", JsonUtils.formBean(params),
					AuthInvokeUtils.getClientHeaders(req));
			JsonNode node = JsonUtils.getNode(result);

			redis.delete(bindkey, token);
			return Result.success(node);

		} catch (Exception ex) {
			return Result.error(ex.getMessage());
		}
	}

	/**
	 * 获取邀请链接
	 * 
	 * @return
	 */
	@RequestMapping(value = "/invite")
	public @ResponseBody Result invite() {
		return Result.SUCCESS;
	}

	/**
	 * 注册用户
	 * 
	 * @return
	 */
	@RequestMapping(value = "/register")
	public @ResponseBody Result register() {
		return Result.SUCCESS;
	}
}
