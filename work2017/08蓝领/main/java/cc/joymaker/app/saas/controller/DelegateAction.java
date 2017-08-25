package cc.joymaker.app.saas.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.fasterxml.jackson.databind.JsonNode;

import cc.joymaker.app.base.model.AppConfig;
import cc.joymaker.app.base.service.ApiService;
import cc.joymaker.app.base.service.AppConfigService;
import cc.joymaker.app.base.service.SaasDomainService;
import cc.joymaker.app.base.service.StorageService;
import cc.joymaker.app.base.utils.AuthInvokeUtils;
import cc.joymaker.app.base.utils.HttpUtils;
import cc.joymaker.app.base.utils.JsonUtils;
import cc.joymaker.app.base.utils.Result;
import cc.joymaker.app.base.utils.Sys;

@Controller
@RequestMapping("/api")
public class DelegateAction {

	private static final Logger log = Logger.getLogger(DelegateAction.class);

	@Autowired
	private ApiService api;

	@Autowired
	private AppConfigService config;

	@Autowired
	private SaasDomainService saas;

	@Value("#{cfg['scope']}")
	private String scope;

	@Value("#{cfg['aliyun.oss.bucket']}")
	private String bucket;

	@Autowired
	private StorageService storageService;

	@RequestMapping("/v1/{module}/{api}")
	// @IgnoreReferer
	public @ResponseBody Object invoke(@PathVariable("module") String module, @PathVariable("api") String inf,
			HttpServletRequest req, HttpServletResponse resp) {

		Map<String, String[]> params = req.getParameterMap();
		Map<String, Object> reqParams = new HashMap<>();
		for (Entry<String, String[]> entry : params.entrySet()) {
			reqParams.put(entry.getKey(), entry.getValue()[0]);
		}

		String method = req.getMethod();

		AppConfig cfg = config.getAppConfig(saas.getCurrentAppid());

		// String appid = "cjmobile";
		//
		// if ("order".equalsIgnoreCase(module)) {
		// appid = "taozuitianxia";
		// }
		// if ("user".equalsIgnoreCase(module)) {
		// appid = "yunnanzhongyan";
		// }
		//
		// AppConfig cfg = config.getAppConfig(appid);
		if (cfg == null) {
			return Result.error("参数配置错误，未找到对应的app");
		}

		try {
			String data = null;
			Map<String, Object> headers = AuthInvokeUtils.getClientHeaders(req);
			// headers.put("userid", Sys.get("userid"));
			headers.put("userid", "test");
			headers.put("client-ip", HttpUtils.getRemortIP(req));
			if ("es".equalsIgnoreCase(module)) {
				reqParams.put("userid", Sys.get(Sys.USERID));
				reqParams.put("uid", Sys.get(Sys.USERID));
			}

			if (StringUtils.equalsIgnoreCase(method, "POST")) {

				reqParams.put("operator", Sys.get(Sys.USERNAME));
				data = api.post(cfg.getAppid(), cfg.getAppSecret(), module, inf, JsonUtils.formBean(reqParams),
						headers);
				log.info("POST:" + data);
			} else {
				data = api.get(cfg.getAppid(), cfg.getAppSecret(), module, inf, reqParams, headers);
				log.info("GET:" + data);
			}

			if (StringUtils.isBlank(data)) {
				return Result.ERROR_SYSTEM;
			}

			JsonNode node = JsonUtils.getNode(data);

			return node;
		} catch (Exception ex) {
			log.error(ex.getMessage(), ex);
			return Result.error(ex.getMessage());
		}
	}
}
