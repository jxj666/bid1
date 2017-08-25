package cc.joymaker.app.saas.interceptor;

import java.io.IOException;
import java.net.URL;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import cc.joymaker.app.base.utils.JsonUtils;
import cc.joymaker.app.base.utils.Result;
import cc.joymaker.app.saas.utils.IgnoreReferer;

/**
 * 请求Referer检查，防CSRF
 * @author zhangyuxin85@gmail.com
 *
 */
public class RefererInterceptor implements HandlerInterceptor {

	@Override
	public void afterCompletion(HttpServletRequest arg0, HttpServletResponse arg1, Object arg2, Exception arg3)
			throws Exception {
		// TODO Auto-generated method stub

	}

	@Override
	public void postHandle(HttpServletRequest arg0, HttpServletResponse arg1, Object obj, ModelAndView mv)
			throws Exception {
	}

	@Override
	public boolean preHandle(HttpServletRequest req, HttpServletResponse resp, Object obj) throws Exception {

		HandlerMethod m = (HandlerMethod) obj;

		if (m.getMethodAnnotation(IgnoreReferer.class) != null) {
			return true;
		} else {
			String referer = req.getHeader("Referer");
			String serverName = req.getServerName();

			if (StringUtils.isEmpty(referer) || StringUtils.isBlank(referer)) {
				sendError(403, "非法请求", resp);
			}

			URL url = new URL(referer);
			if (!StringUtils.equalsIgnoreCase(serverName, url.getHost())) {
				sendError(403, "非法请求", resp);
			}

			return false;
		}
	}

	private static void sendError(int code, String msg, HttpServletResponse resp) {
		Result error = Result.error(msg);
		error.setCode(code);
		try {
			resp.getWriter().write(JsonUtils.formBean(error));
			resp.flushBuffer();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
