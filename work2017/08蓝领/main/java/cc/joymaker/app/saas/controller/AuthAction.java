package cc.joymaker.app.saas.controller;

import cc.joymaker.app.base.model.AppConfig;
import cc.joymaker.app.base.service.ApiService;
import cc.joymaker.app.base.service.AppConfigService;
import cc.joymaker.app.base.service.SaasDomainService;
import cc.joymaker.app.base.utils.*;
import cc.joymaker.app.saas.model.RemoteWechatUser;
import cc.joymaker.app.saas.service.RedisService;
import cc.joymaker.app.saas.service.WechatPlatformService;
import cc.joymaker.app.saas.utils.DES;
import cc.joymaker.app.saas.utils.GenToken;
import cc.joymaker.app.saas.utils.IgnoreLoginCheck;
import cc.joymaker.app.saas.utils.IgnoreReferer;
import com.fasterxml.jackson.databind.JsonNode;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.HashMap;
import java.util.Map;

/**
 * 本接口组用于登录认证使用
 *
 * @author zhangyuxin85@gmail.com
 */
@Controller
@RequestMapping("/auth")
public class AuthAction {

    Logger log = LoggerFactory.getLogger(AuthAction.class);
    private static final String OPENID_AUTH_TOKEN_KEY = "_OPENID_AUTH_TOKEN_KEY";
    private static final String AUTH_ENDPOINT = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=%s&redirect_uri=%s&response_type=code&scope=%s&state=%s&component_appid=%s#wechat_redirect";

    @Autowired
    private ApiService api;

    @Autowired
    private SaasDomainService saas;

    @Autowired
    private AppConfigService config;

    @Autowired
    private RedisService redis;

    @Autowired
    private WechatPlatformService wechatPlatformService;

    @Value("#{cfg['login.secret']}")
    private String loginDesSecret;

    @Value("#{cfg['scope']}")
    private String systemConditon;

    private String cjmobileAppid = "cjmobile";
    private String cjmobileOrgid = "cjmobile";
    private String cjmobileSecret = "IzSNk7yEOQNnxHVg";

    @Value("#{cfg['wechat.cj.appid']}")
    private String cjAppid;

    @Value("#{cfg['wechat.cj.compAppid']}")
    private String cjCompAppid;

    /**
     * 使用手机号、密码登录页面展示
     *
     * @return
     */
    @RequestMapping(value = "login", method = RequestMethod.GET)
    @IgnoreLoginCheck // 不检查登录状态
    @IgnoreReferer // 不检查Referer
    @GenToken("_login_token") // 生成有一个名为 _login_token的token，嵌入到页面里
    public ModelAndView preLogin() {
        ModelAndView mv = new ModelAndView();
        return mv;
    }

    public @ResponseBody
    Result sendVcode(@RequestParam("mobile") String mobile) {
        Map<String, Object> params = new HashMap<>();
        params.put("mobile", mobile);
        return Result.SUCCESS;
    }

    @Deprecated
    // @RequestMapping(value = "wechat/login")
    @IgnoreLoginCheck // 不检查登录状态
    public void wechatAuthLogin(HttpServletRequest req, HttpServletResponse resp) {

        Map<String, Cookie> mc = CookieUtils.readCookieMap(req);

        Cookie ssopenid = mc.get(CookieUtils.OPENID);
        if (ssopenid == null || StringUtils.isBlank(ssopenid.getValue())) {
            // 如果没有OPENID或者appid和OPENID不匹配，需要跳去授权
            String scope = "snsapi_userinfo";

            String redirect = System.getProperty("system.protocol", "https") + "://" + req.getServerName()
                    + "/auth/wechat/" + cjCompAppid + "/" + cjAppid;

            try {
                String url = req.getRequestURL().toString();
                if (req.getQueryString() != null) {
                    url += "?" + req.getQueryString();
                }

                Cookie cookie = new Cookie(CookieUtils.LAST_URL, Base64Utils.encodeToString(url.getBytes()));
                cookie.setDomain(HttpUtils.getCookieDomainFromServerName(req.getServerName()));
                cookie.setPath("/");
                cookie.setMaxAge(-1);
                String condition = systemConditon;
                boolean canSecure = false;
                if (StringUtils.isNotBlank(condition) && "release".equalsIgnoreCase(condition)
                        && System.getProperty("system.protocol", "https").equals("https")) {
                    canSecure = true;
                }
                cookie.setSecure(canSecure);

                cookie.setHttpOnly(true);
                resp.addCookie(cookie);

                Cookie cookie2 = new Cookie("wscope", scope);
                cookie2.setDomain(HttpUtils.getCookieDomainFromServerName(req.getServerName()));
                cookie2.setPath("/");
                cookie2.setMaxAge(-1);
                cookie2.setSecure(canSecure);
                resp.addCookie(cookie2);

                String endpoint = String.format(AUTH_ENDPOINT, cjAppid, redirect, scope, CookieUtils.LAST_URL,
                        cjCompAppid);
                resp.sendRedirect(endpoint);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }

    }

    /**
     * 微信auth回调
     *
     * @return
     */
    @Deprecated
    // @RequestMapping(value =
    // "wechat/{compAppid:[a-zA-Z0-9]+}/{appid:[a-zA-Z0-9]+}")
    @IgnoreLoginCheck // 不检查登录状态
    @IgnoreReferer // 不检查Referer
    public void wechatAuth(@RequestParam("state") String state, @RequestParam("code") String code,
                           @PathVariable("appid") String authAppid, @PathVariable("compAppid") String compAppid,
                           HttpServletRequest req, HttpServletResponse resp) {

        Map<String, Cookie> mc = CookieUtils.readCookieMap(req);

        Cookie scopeCookie = mc.get("wscope");

        String appid = cjmobileAppid; // 当前域账号绑定的APPID
        AppConfig app = config.getAppConfig(appid); // 当前APPID对应的认证配置

        try {

            Map<String, Object> params = new HashMap<String, Object>();
            params.put("comp_appid", cjAppid);
            params.put("appid", cjCompAppid);

            String result = api.get(appid, app.getAppSecret(), "acms", "GetPlatform", params,
                    AuthInvokeUtils.getClientHeaders(req));

            JsonNode node = JsonUtils.getNode(result);
            int nc = node.get("code").asInt();
            if (nc == 1) {
                JsonNode context = node.get("context");
                if (context != null) {

                    String accessToken = context.get("compAccessToken").asText();

                    RemoteWechatUser user = null;
                    if (scopeCookie != null && "snsapi_base".equals(scopeCookie.getValue())) {
                        String openid = wechatPlatformService.getBaseOpenid(authAppid, compAppid, accessToken, code);
                        user = new RemoteWechatUser();
                        user.setOpenid(openid);
                    } else {
                        user = wechatPlatformService.getRemoteUser(authAppid, compAppid, accessToken, code);

                    }
                    if (user != null) {
                        Cookie cookie = new Cookie(CookieUtils.OPENID, user.getOpenid());
                        cookie.setDomain(HttpUtils.getCookieDomainFromServerName(req.getServerName()));
                        cookie.setPath("/");
                        cookie.setMaxAge(-1);
                        String condition = systemConditon;
                        boolean canSecure = false;
                        if (StringUtils.isNotBlank(condition) && "release".equalsIgnoreCase(condition)
                                && System.getProperty("system.protocol", "https").equals("https")) {
                            canSecure = true;
                        }
                        cookie.setSecure(canSecure);

                        cookie.setHttpOnly(true);
                        resp.addCookie(cookie);

                        resp.setContentType("text/html;charset=UTF-8");
                        resp.getOutputStream().write(JsonUtils.writeValueAsString(user).getBytes());

                        return;
                    }
                }

            } else {
            }

        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
        }

    }

    /**
     * 用户名和密码登录接口
     *
     * @param username
     * @param password
     * @param orgid
     * @param req
     * @param resp
     * @return
     */
    @RequestMapping(value = "login", method = RequestMethod.POST)
    @IgnoreLoginCheck // 不检查登录状态
    // @CheckToken("_login_token") // 检查 _login_token的合法性
    public @ResponseBody
    Result login(@RequestParam("name") String username, @RequestParam("password") String password,
                 @RequestParam("orgid") String orgid, HttpServletRequest req, HttpServletResponse resp) {
        Map<String, Object> params = new HashMap<>();
        params.put("username", username);
        params.put("password", password);
        params.put("org_id", orgid);

        try {
            String appid = saas.getAppid(orgid); // 当前域账号绑定的APPID
            if (StringUtils.isBlank(appid)) {
                Result res = Result.error("未找到企业账号");
                res.setCode(12000);
                return res;
            }
            AppConfig app = config.getAppConfig(appid); // 当前APPID对应的认证配置
            if (app == null) {
                Result res = Result.error("未找到企业账号");
                res.setCode(12000);
                return res;
            }

            String result = api.post(appid, app.getAppSecret(), "es", "CheckUser", JsonUtils.formBean(params),
                    AuthInvokeUtils.getClientHeaders(req));

            JsonNode node = JsonUtils.getNode(result);
            int code = node.get("code").asInt();
            if (code == 1) {
                JsonNode context = node.get("context");
                JsonNode user = context.get("user");
                String uid = user.get("userid").asText();
                String org = user.get("orgId").asText();
                String nickname = user.get("nickname") != null ? user.get("nickname").asText() : "";
                String openid = user.get("openid") != null ? user.get("openid").asText() : "";
                String phone = user.get("phone") != null ? user.get("phone").asText() : "";
                String email = user.get("email") != null ? user.get("email").asText() : "";

                setAuthCookie(uid, username, org, nickname, openid, phone, email, req, resp);
                return Result.success(node);
            } else {
                // 验证失败
                Result res = Result.ERROR;
                res.setCode(node.get("code").asInt());
                res.setMsg(node.get("msg").asText());
                return res;
            }

        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            return Result.error(ex.getMessage());
        }
    }

    private final void setAuthCookie(String uid, String username, String org, String nickname, String openid,
                                     String phone, String email, HttpServletRequest req, HttpServletResponse resp) {
        String timestamp = System.currentTimeMillis() + "";
        String cju = uid + "|" + username + "|" + org + "|" + nickname + "|" + openid + "|" + phone + "|" + email + "|"
                + timestamp;
        // oK，设置登录cOOKIE.

        String encoded = DES.encrypt(cju, loginDesSecret);
        CookieUtils.setCookie("cju", encoded, 7 * 86400, true, true, req, resp);
    }

    /**
     * 一个openid只能绑定一个企业账号
     *
     * @param openid
     * @param appid
     * @param compAppid
     * @param sign
     * @return
     */
    @RequestMapping(value = "/wechat/login", method = RequestMethod.POST)
    @IgnoreLoginCheck
    public @ResponseBody
    Result authInWechat(@RequestParam("orgid") String orgid, @RequestParam("token") String token,
                        HttpServletRequest req, HttpServletResponse resp) {

        String data = redis.get(OPENID_AUTH_TOKEN_KEY, token);
        if (StringUtils.isNotBlank(data)) {
            // 微信认证成功，远程获取用户身份并写入cookie
            // 从redis里删除
            redis.delete(OPENID_AUTH_TOKEN_KEY, token);
            String app = saas.getAppid(orgid);
            AppConfig cfg = config.getAppConfig(app);
            Map<String, Object> params = new HashMap<>();
            params.put("openid", data);
            try {
                String json = api.get(cfg.getAppid(), cfg.getAppSecret(), "es", "GetUserByOpenid", params,
                        AuthInvokeUtils.getClientHeaders(req));
                JsonNode node = JsonUtils.getNode(json);
                int code = node.get("code").asInt();
                if (code == 1) {
                    JsonNode context = node.get("context");
                    JsonNode user = context.get("user");
                    String uid = user.get("userid").asText();
                    String username = user.get("username").asText();
                    String org = user.get("orgId").asText();
                    String nickname = user.get("nickname") != null ? user.get("nickname").asText() : "";
                    String openid = user.get("openid") != null ? user.get("openid").asText() : "";
                    String phone = user.get("phone") != null ? user.get("phone").asText() : "";
                    String email = user.get("email") != null ? user.get("email").asText() : "";

                    setAuthCookie(uid, username, org, nickname, openid, phone, email, req, resp);
                    return Result.success(node);
                } else {
                    String msg = node.get("msg").asText();
                    return Result.error(msg);
                }
            } catch (Exception e) {
                return Result.error(e.getMessage());
            }
        } else {
            return Result.NOT_AUTHED;
        }
    }

    /**
     * 获取用户绑定的企业
     *
     * @param openid
     * @param appid
     * @param compAppid
     * @param sign
     * @return
     */
    @RequestMapping(value = "/wechat/getorgsByToken", method = RequestMethod.GET)
    @IgnoreLoginCheck
    public @ResponseBody
    Result getOrgsByToken(@RequestParam("token") String token, HttpServletRequest req) {

        String openid = redis.get(OPENID_AUTH_TOKEN_KEY, token);
        if (StringUtils.isBlank(openid)) {
            return Result.error("授权错误，未检测到token");
        }

        Map<String, Object> params = new HashMap<>();
        params.put("openid", openid);
        try {
            String result = api.get(cjmobileAppid, cjmobileSecret, "es", "GetOrgsByOpenid", params,
                    AuthInvokeUtils.getClientHeaders(req));
            JsonNode node = JsonUtils.getNode(result);
            return Result.success(node);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }

    }

    /**
     * 获取用户绑定的企业
     *
     * @param openid
     * @param appid
     * @param compAppid
     * @param sign
     * @return
     */
    @RequestMapping(value = "/wechat/getorgs", method = RequestMethod.GET)
    @IgnoreLoginCheck
    public @ResponseBody
    Result getOrgs(@RequestParam("openid") String openid, HttpServletRequest req) {

        Map<String, Object> params = new HashMap<>();
        params.put("openid", openid);
        try {
            String result = api.get(cjmobileAppid, cjmobileSecret, "es", "GetOrgsByOpenid", params,
                    AuthInvokeUtils.getClientHeaders(req));
            JsonNode node = JsonUtils.getNode(result);
            return Result.success(node);
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }

    }

    @RequestMapping("/logout")
    public @ResponseBody
    Result logout(HttpServletResponse resp, HttpServletRequest req) {
        CookieUtils.setCookie("cju", "", 1, true, true, req, resp);
        return Result.SUCCESS;
    }

    /**
     * 找回密码
     *
     * @return
     */
    @RequestMapping(value = "/m/verify", method = RequestMethod.POST)
    public @ResponseBody
    Result verify(@RequestParam("mobile") String mobile, @RequestParam("pin") String vcode,
                  @RequestParam("password") String pwd, HttpServletRequest req, HttpServletResponse resp) {
        Map<String, Object> params = new HashMap<>();
        params.put("mobile", mobile);
        params.put("vcode", vcode);
        AppConfig cfg = config.getAppConfig(saas.getCurrentAppid());

        try {
            String result = api.post(cfg.getAppid(), cfg.getAppSecret(), "es", "CheckUserWithMobileAndVCode",
                    JsonUtils.formBean(params), AuthInvokeUtils.getClientHeaders(req));
            JsonNode node = JsonUtils.getNode(result);
            int code = node.get("code").asInt();
            if (code == 1) {
                JsonNode user = node.get("user");
                JsonNode org = node.get("org");

                String userid = user.get("userid").asText();
                String username = user.get("username").asText();
                String nickname = user.get("nickname").asText("未命名");
                String openid = user.get("openid").asText("");
                String phone = user.get("phone").asText("");
                String email = user.get("email").asText("");
                String orgid = user.get("orgId").asText("");
                setAuthCookie(userid, username, orgid, nickname, openid, phone, email, req, resp);
                return Result.success(node.get("context"));
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
    @RequestMapping(value = "/m/sendpin", method = RequestMethod.POST)
    public @ResponseBody
    Result sendPin(@RequestParam("mobile") String mobile, HttpServletRequest req) {
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
}
