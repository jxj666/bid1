package cc.joymaker.app.saas.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
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
import cc.joymaker.app.saas.model.QrBatchEx;

@Controller
@RequestMapping("/func/qr")
public class QrAction {

	private static final Logger log = Logger.getLogger(AcmsAction.class);

	@Autowired
	private ApiService api;

	@Autowired
	private AppConfigService config;

	@Autowired
	private SaasDomainService saas;

	@RequestMapping("/list/batch")
	public @ResponseBody Result getBatchList(@RequestParam(value = "beginTime", required = false) Long beginTime,
			@RequestParam(value = "endTime", required = false) Long endTime,
			@RequestParam(value = "page", defaultValue = "1") Integer page,
			@RequestParam(value = "size", defaultValue = "20") Integer size,
			@RequestParam(value = "status", defaultValue = "-1") Integer status,
			@RequestParam(value = "productId", required = false) String productId,
			@RequestParam(value = "orderType", required = false) String orderType,
			@RequestParam(value = "orderBy", required = false) String orderBy, HttpServletRequest req) {
		// Sys.set(Sys.ORGID, "cjmobile");
		AppConfig cfg = config.getAppConfig(saas.getCurrentAppid());

		Map<String, Object> p1 = new HashMap<>();
		p1.put("beginTime", beginTime);
		p1.put("endTime", endTime);
		p1.put("page", page);
		p1.put("size", size);
		p1.put("productId", productId);
		p1.put("orderType", orderType);
		p1.put("orderBy", orderBy);
		p1.put("status", status);

		try {
			String qrBatches = api.get(cfg.getAppid(), cfg.getAppSecret(), "qr", "ListQrBatch", p1,
					AuthInvokeUtils.getClientHeaders(req));
			JsonNode node = JsonUtils.getNode(qrBatches);
			List<QrBatchEx> results = new ArrayList<>();
			if (node.get("code").asInt() == 1) {
				JsonNode ctx = node.get("context");
				if (ctx != null && ctx.get("batchList") != null && ctx.get("batchList").isArray()) {
					Iterator<JsonNode> it = ctx.get("batchList").iterator();
					while (it.hasNext()) {
						JsonNode n = it.next(); // 码包
						QrBatchEx ex = new QrBatchEx();
						ex.setBatch(n);
						results.add(ex);
						// 获取码包的投放信息

						String batchNo = n.get("batchNo").asText();
						Map<String, Object> p2 = new HashMap<>();
						p2.put("batch_no", batchNo);
						String plan = api.get(cfg.getAppid(), cfg.getAppSecret(), "qr", "GetPlanByBatch", p2,
								AuthInvokeUtils.getClientHeaders(req));
						JsonNode planResult = JsonUtils.getNode(plan);
						Set<String> activityIds = new HashSet<>();
						if (planResult != null && planResult.get("code").asInt() == 1) {
							// 获取码包关联的活动
							if (planResult.get("context") != null && planResult.get("context").isArray()) {
								Iterator<JsonNode> planIt = planResult.get("context").iterator();
								while (planIt.hasNext()) {
									JsonNode planNode = planIt.next();
									activityIds.add(planNode.get("activityId").asText());
								}
							}
						}
						// log.info("--------debug-------" +
						// StringUtils.join(activityIds, ","));
						if (activityIds.size() > 0) {
							String activityIdsParam = StringUtils.join(activityIds, ",");
							Map<String, Object> p3 = new HashMap<>();
							p3.put("activity_ids", activityIdsParam);
							String activitiesResult = api.get(cfg.getAppid(), cfg.getAppSecret(), "acms",
									"BatchGetActivity", p3, AuthInvokeUtils.getClientHeaders(req));

							JsonNode actsNode = JsonUtils.getNode(activitiesResult);

							if (actsNode.get("code").asInt() == 1 && actsNode.get("context") != null) {
								ex.setActivities(actsNode.get("context"));
							}
						}
					}
				}
			}
			return Result.success(results);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return Result.error(e.getMessage());
		}
	}
}
