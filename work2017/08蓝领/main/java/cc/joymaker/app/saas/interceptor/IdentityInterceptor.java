package cc.joymaker.app.saas.interceptor;

import java.util.Map;
import java.util.UUID;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.servlet.HandlerInterceptor;

import com.aliyun.openservices.shade.org.apache.commons.codec.digest.DigestUtils;

import cc.joymaker.app.base.utils.CookieUtils;

/**
 * 如果没有客户端追踪id， 那么设置一个
 * @author zhangyuxin85@gmail.com
 *
 */
public class IdentityInterceptor implements HandlerInterceptor {

	public static final String TRACE_ID = "guid";
	
	@Override
	public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {
		// TODO Auto-generated method stub

	}

	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2,
			org.springframework.web.servlet.ModelAndView arg3) throws Exception {
	};

	@Override
	public boolean preHandle(HttpServletRequest req, HttpServletResponse resp, Object arg2) throws Exception {
		Map<String, Cookie> cookies = CookieUtils.readCookieMap(req);

		Cookie traceId = cookies.get(TRACE_ID);
		if (traceId == null) {
			CookieUtils.setCookie(TRACE_ID, DigestUtils.md5Hex(UUID.randomUUID().toString()), 86400 * 30, true, true,
					req, resp);
		}
		return true;
	}
}
