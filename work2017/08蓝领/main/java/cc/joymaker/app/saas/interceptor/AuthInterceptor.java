package cc.joymaker.app.saas.interceptor;

import java.util.Map;
import java.util.Set;
import java.util.regex.Pattern;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import cc.joymaker.app.base.utils.CookieUtils;
import cc.joymaker.app.base.utils.JsonUtils;
import cc.joymaker.app.base.utils.Result;
import cc.joymaker.app.base.utils.Sys;
import cc.joymaker.app.saas.utils.DES;
import cc.joymaker.app.saas.utils.IgnoreLoginCheck;

public class AuthInterceptor implements HandlerInterceptor {
	Logger log = LoggerFactory.getLogger(AuthInterceptor.class);

	@Value("#{cfg['login.secret']}")
	private String loginDesSecret;

	private Set<String> whitelists;

	public void setWhitelists(Set<String> whitelists) {
		this.whitelists = whitelists;
	}

	private boolean isOutOfCheck(String uri) {

		for (String pattern : whitelists) {
			if (Pattern.compile(pattern).matcher(uri).matches()) {
				return true;
			}
		}
		return false;
	}

	@Override
	public boolean preHandle(HttpServletRequest req, HttpServletResponse resp, Object handler) throws Exception {
		String uri = req.getRequestURI();

		if (isOutOfCheck(uri)) {
			return true;
		}

		try {
			log.info(req.getMethod() + "|" + req.getRequestURI().toString() + "?" + getParams(req));
			HandlerMethod m = (HandlerMethod) handler;

			if (m.getMethodAnnotation(IgnoreLoginCheck.class) != null) {

				return true;
			} else {

				// 检查登录状态 Map<String, Cookie> cookies =
				Map<String, Cookie> cookies = CookieUtils.readCookieMap(req);
				Cookie cju = cookies.get("cju");
				if (cju == null) {
					Result r = Result.error("您没有登录");
					r.setCode(403);
					resp.setContentType("application/x-json;charset=UTF-8");
					resp.getOutputStream().write(JsonUtils.formBean(r).getBytes());
					resp.flushBuffer();
					return false;
				} else {
					try {
						String value = DES.decrypt(cju.getValue(), loginDesSecret);
						if (value == null) {
							Result r = Result.error("您没有登录");
							r.setCode(403);
							resp.getWriter().write(JsonUtils.formBean(r));
							resp.flushBuffer();
							return false;
						} else {
							String[] values = value.split("[|]");
							String userid = values[0];
							String username = values[1];
							String org = values[2];
							String nickname = values[3];
							String openid = values[4];
							String phone = values[5];
							String email = values[6];

							Sys.set(Sys.USERID, userid);
							Sys.set(Sys.USERNAME, username);
							Sys.set(Sys.ORGID, org);
							Sys.set(Sys.NICKNAME, nickname);
							Sys.set(Sys.OPENID, openid);
							Sys.set(Sys.PHONE, phone);
							Sys.set(Sys.EMAIL, email);
							return true;
						}
					} catch (Exception ex) {
						Result r = Result.error("您没有登录");
						r.setCode(403);
						resp.getWriter().write(JsonUtils.formBean(r));
						resp.flushBuffer();
						return false;
					}
				}

			}
		} catch (Exception ex) {
			log.error(ex.getMessage(), ex);
			log.warn(handler.getClass().getCanonicalName());

			Result r = Result.error("您没有登录");
			r.setCode(403);
			resp.getWriter().write(JsonUtils.formBean(r));
			resp.flushBuffer();
			return false;
		}

	}

	@Override
	public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {
		// TODO Auto-generated method stub

	}

	@Override
	public void postHandle(HttpServletRequest req, HttpServletResponse resp, Object obj, ModelAndView mv)
			throws Exception {
		// TODO Auto-generated method stub

	}

	private String getParams(HttpServletRequest request) {
		Map<String, String[]> params = request.getParameterMap();
		String queryString = "";
		if (params != null && !params.isEmpty()) {
			for (String key : params.keySet()) {
				String[] values = params.get(key);
				for (int i = 0; i < values.length; i++) {
					String value = values[i];
					queryString += key + "=" + value + "&";
				}
			}
		}
		// 去掉最后一个空格
		if (queryString.length() > 1) {
			queryString = queryString.substring(0, queryString.length() - 1);
		}

		return queryString;
	}
}
