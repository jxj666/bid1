package cc.joymaker.app.saas.interceptor;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import cc.joymaker.app.base.utils.CookieUtils;
import cc.joymaker.app.base.utils.JsonUtils;
import cc.joymaker.app.base.utils.Result;
import cc.joymaker.app.saas.service.RedisService;
import cc.joymaker.app.saas.utils.CheckToken;
import cc.joymaker.app.saas.utils.GenToken;

public class TokenInterceptor implements HandlerInterceptor {
	
	@Autowired
	private RedisService redis;
	
	@Value("#{cfg['web.tokencheck.enabled']}")
	private Boolean enabled = false;
	
	private static final String TOKEN_REDIS_KEY = "_SAAS_TOKEN";

	@Override
	public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {
		// TODO Auto-generated method stub

	}

	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object obj, ModelAndView mv)
			throws Exception {
		// 视图渲染之前写入一个token
		HandlerMethod handler = (HandlerMethod) obj;
		GenToken genToken = handler.getMethodAnnotation(GenToken.class);
		if (genToken != null && mv != null) {
			
			String tokenParam = genToken.value();
			String token = DigestUtils.md5Hex(UUID.randomUUID().toString());
			mv.addObject(tokenParam, token);
			
			String tokenKey = tokenParam + token;
			redis.put(TOKEN_REDIS_KEY, tokenKey, "1",  genToken.expire());
		}
	}

	@Override
	public boolean preHandle(HttpServletRequest req, HttpServletResponse resp, Object obj) throws Exception {

		HandlerMethod handler = (HandlerMethod) obj;
		
		CheckToken tokenChacker = handler.getMethodAnnotation(CheckToken.class);

		if (tokenChacker != null) {
			String tokenParam = tokenChacker.value();
			String token = req.getParameter(tokenParam);
			
			String tokenKey = tokenParam + token;
			
			String value = redis.get(TOKEN_REDIS_KEY, tokenKey);
			if (value != null) {
				redis.delete(TOKEN_REDIS_KEY, tokenKey);
				return true;
			} else {
				sendError(403, "异常访问，已被拦截", resp);
				return false;
			}
		}
		
		return true;
	}
	
	private static void sendError(int code, String msg, HttpServletResponse resp) {
		Result error  = Result.error(msg);
		error.setCode(code);
		try {
			resp.getWriter().write(JsonUtils.formBean(error));
			resp.flushBuffer();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
