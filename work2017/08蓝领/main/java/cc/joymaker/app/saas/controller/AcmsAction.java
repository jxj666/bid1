package cc.joymaker.app.saas.controller;

import cc.joymaker.app.base.model.AppConfig;
import cc.joymaker.app.base.service.ApiService;
import cc.joymaker.app.base.service.AppConfigService;
import cc.joymaker.app.base.service.SaasDomainService;
import cc.joymaker.app.base.utils.AuthInvokeUtils;
import cc.joymaker.app.base.utils.JsonUtils;
import cc.joymaker.app.base.utils.Result;
import cc.joymaker.app.base.utils.Sys;
import cc.joymaker.app.saas.model.*;
import com.fasterxml.jackson.databind.JsonNode;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.*;
import java.util.Map.Entry;

@Controller
@RequestMapping("/func/acms")
public class AcmsAction {

	private static final Logger log = Logger.getLogger(AcmsAction.class);

	@Autowired
	private ApiService api;

	@Autowired
	private AppConfigService config;

	@Autowired
	private SaasDomainService saas;

	@Value("#{cfg['activity.url']}")
	private String activityUrl = "https://act.deepintouch.com/a/p/%s.html?activityId=%s";

	// @RequestMapping("/award/add")
	// public @ResponseBody Result addAward(@RequestParam("activity_id") String
	// activityId,
	// @RequestParam("sku_id") String skuId, @RequestParam("quantity") Integer
	// planQuantity,
	// HttpServletRequest req) {
	// Sys.set(Sys.ORGID, "cjmobile");
	// AppConfig cfg = config.getAppConfig(saas.getCurrentAppid());
	// Map<String, Object> params = new HashMap<>();
	// // params.put("userid", Sys.get(Sys.USERID));
	// params.put("activity_id", activityId);
	// try {
	// // 获取活动对应的奖池
	// String result = api.get(cfg.getAppid(), cfg.getAppSecret(), "order",
	// "GetActivityPlan", params,
	// AuthInvokeUtils.getClientHeaders(req));
	// JsonNode node = JsonUtils.getNode(result).get("context");
	//
	// String planId = null;
	//
	// if (node.has("plan") && node.has("activity_plan")) {
	//
	// if (node.has("items")) {
	// JsonNode items = node.get("items");
	// // 判断是不是已经加入过了
	// Iterator<JsonNode> it = items.iterator();
	// while (it.hasNext()) {
	// JsonNode item = it.next();
	// String itemSkuID = item.get("productId").asText();
	// if (StringUtils.equals(itemSkuID, skuId)) {
	//
	// // ---------
	// return Result.error(skuId + "已经存在");
	// }
	// }
	// }
	// // 找到PlanID
	// JsonNode planNode = node.get("plan");
	// planId = planNode.get("planId").asText();
	//
	// } else {
	// // 没有加入资源计划
	// // 自动创建一个
	// String r1 = api.post(cfg.getAppid(), cfg.getAppSecret(), "order",
	// "CreatePlan", "",
	// AuthInvokeUtils.getClientHeaders(req));
	//
	// JsonNode rNode = JsonUtils.getNode(r1).get("context");
	// planId = rNode.get("planId").asText();
	//
	// if (!StringUtils.isEmpty(planId)) {
	// // 加入活动
	// Map<String, Object> p2 = new HashMap<>();
	// p2.put("activity_id", activityId);
	// p2.put("plan_id", planId);
	// p2.put("creator", Sys.getString(Sys.USERID));
	// api.post(cfg.getAppid(), cfg.getAppSecret(), "order",
	// "JoinActivityToPlan", JsonUtils.formBean(p2),
	// AuthInvokeUtils.getClientHeaders(req));
	// // 启用计划
	// Map<String, Object> p3 = new HashMap<>();
	// p3.put("plan_id", planId);
	// api.post(cfg.getAppid(), cfg.getAppSecret(), "order", "EnablePlan",
	// JsonUtils.formBean(p3),
	// AuthInvokeUtils.getClientHeaders(req));
	// }
	// }
	//
	// // 向奖池中加入这个新的SKU
	// // 1、获取SKU的信息
	// JsonNode sku = getSKU(skuId, cfg, req);
	// // 2、获取供应商库存配置
	// Map<String, Object> supplierParams = new HashMap<>();
	// supplierParams.put("supplier_id", sku.get("supplierId").asText());
	// supplierParams.put("sku_id", skuId);
	// String supplierQuantity = api.get(cfg.getAppid(), cfg.getAppSecret(),
	// "order", "GetSupplierQuantity",
	// supplierParams, AuthInvokeUtils.getClientHeaders(req));
	// JsonNode supplierQuantityNode =
	// JsonUtils.getNode(supplierQuantity).get("context");
	// if (supplierQuantityNode == null) {
	// // ---------
	// return Result.error("供应商库存未配置，请联系管理员设置供应商库存");
	// }
	// // 3、添加新的SKU
	// Map<String, Object> addItemParams = new HashMap<>();
	// addItemParams.put("plan_id", planId);
	// addItemParams.put("product_id", skuId);
	// addItemParams.put("supplier_id", sku.get("supplierId").asText());
	// addItemParams.put("plan_quantity", planQuantity);
	// addItemParams.put("price", sku.get("price").asDouble());
	// addItemParams.put("product_name", sku.get("productName").asText());
	// addItemParams.put("product_type", sku.get("product_type").asInt());
	// api.post(cfg.getAppid(), cfg.getAppSecret(), "order", "AddItemToPlan",
	// JsonUtils.formBean(addItemParams),
	// AuthInvokeUtils.getClientHeaders(req));
	//
	// return Result.SUCCESS;
	// } catch (Exception ex) {
	// log.error(ex.getMessage(), ex);
	// return Result.error(ex.getMessage());
	// }
	// }

	private JsonNode getSKU(String skuId, AppConfig cfg, HttpServletRequest req) throws Exception {
		Map<String, Object> skuParams = new HashMap<>();
		skuParams.put("product_id", skuId);
		String skuResult = api.get(cfg.getAppid(), cfg.getAppSecret(), "sku", "GetSKU", skuParams,
				AuthInvokeUtils.getClientHeaders(req));
		JsonNode sku = JsonUtils.getNode(skuResult).get("context");
		return sku;
	}

	private JsonNode getSKUs(Set<String> skuIds, AppConfig cfg, HttpServletRequest req) throws Exception {
		Map<String, Object> skuParams = new HashMap<>();
		skuParams.put("product_ids", StringUtils.join(skuIds, ","));
		String skuResult = api.get(cfg.getAppid(), cfg.getAppSecret(), "sku", "BatchGetSKU", skuParams,
				AuthInvokeUtils.getClientHeaders(req));
		log.info("[DEBUG]" + skuResult);
		JsonNode sku = JsonUtils.getNode(skuResult).get("context");
		return sku;
	}

	/**
	 * 删除奖品
	 * 
	 * @return
	 */
	// @RequestMapping("/award/remove")
	// public @ResponseBody Result removeAward(@RequestParam("activity_id")
	// String activityId,
	// @RequestParam("sku_id") String skuId, HttpServletRequest req) {
	//
	// // TEST
	// Sys.set(Sys.ORGID, "cjmobile");
	//
	// AppConfig cfg = config.getAppConfig(saas.getCurrentAppid());
	// // 获取奖池配置
	// Map<String, Object> params = new HashMap<>();
	// // params.put("userid", Sys.get(Sys.USERID));
	// params.put("activity_id", activityId);
	// try {
	// String result = api.get(cfg.getAppid(), cfg.getAppSecret(), "order",
	// "GetActivityPlan", params,
	// AuthInvokeUtils.getClientHeaders(req));
	// JsonNode node = JsonUtils.getNode(result).get("context");
	// if (node.has("plan") && node.has("activity_plan")) {
	// String planId = node.get("plan").get("planId").asText();
	// // SKU
	// JsonNode sku = getSKU(skuId, cfg, req);
	// // 清空计划库存
	// Map<String, Object> body = new HashMap<>();
	// body.put("plan_id", planId);
	// body.put("product_id", skuId);
	// body.put("supplier_id", sku.get("supplierId").asText());
	//
	// api.post(cfg.getAppid(), cfg.getAppSecret(), "order",
	// "RemoveItemFromPlan", JsonUtils.formBean(body),
	// AuthInvokeUtils.getClientHeaders(req));
	// return Result.SUCCESS;
	// } else {
	// return Result.error("没有库存");
	// }
	//
	// } catch (Exception ex) {
	// log.error(ex.getMessage(), ex);
	// return Result.error(ex.getMessage());
	// }
	// }

	@RequestMapping("/rate/update")
	public @ResponseBody Result updateAward(@RequestParam("award_config") String json, HttpServletRequest req) {

		// TEST
		//Sys.set(Sys.ORGID, "cjmobile");

		AppConfig cfg = config.getAppConfig(saas.getCurrentAppid());

		AwardConfig awardConfig = JsonUtils.toBean(json, AwardConfig.class);

		Map<String, Object> params = new HashMap<>();
		params.put("activity_id", awardConfig.getActivityId());
		params.put("group_name", awardConfig.getGroup());
		params.put("awards", awardConfig.getAwards());

		try {
			// 更新奖池概率
			api.post(cfg.getAppid(), cfg.getAppSecret(), "acms", "UpdateActivityRates", JsonUtils.formBean(params),
					AuthInvokeUtils.getClientHeaders(req));
		} catch (Exception e) {
			return Result.error(e.getMessage());
		}
		/**
		 * 遍历配置
		 */
		// 更新库存
		if (awardConfig.getAwards() != null) {
			// 获取活动对应的Plan
			Map<String, Object> planParams = new HashMap<String, Object>();
			planParams.put("activity_id", awardConfig.getActivityId());
			try {
				String planResult = api.get(cfg.getAppid(), cfg.getAppSecret(), "order", "GetActivityPlan", planParams,
						AuthInvokeUtils.getClientHeaders(req));
				JsonNode ctx = JsonUtils.getNode(planResult).get("context");
				String planId = null;
				if (ctx != null && ctx.has("plan") && ctx.has("activity_plan")) {

					planId = ctx.get("activity_plan").get("planId").asText();
				} else {
					// 没有加入资源计划
					// 自动创建一个
					String r1 = api.post(cfg.getAppid(), cfg.getAppSecret(), "order", "CreatePlan", "",
							AuthInvokeUtils.getClientHeaders(req));

					JsonNode rNode = JsonUtils.getNode(r1).get("context");
					planId = rNode.get("planId").asText();

					if (!StringUtils.isEmpty(planId)) {
						// 加入活动
						Map<String, Object> p2 = new HashMap<>();
						p2.put("activity_id", awardConfig.getActivityId());
						p2.put("plan_id", planId);
						p2.put("creator", Sys.getString(Sys.USERID));
						api.post(cfg.getAppid(), cfg.getAppSecret(), "order", "JoinActivityToPlan",
								JsonUtils.formBean(p2), AuthInvokeUtils.getClientHeaders(req));
						// 启用计划
						Map<String, Object> p3 = new HashMap<>();
						p3.put("plan_id", planId);
						api.post(cfg.getAppid(), cfg.getAppSecret(), "order", "EnablePlan", JsonUtils.formBean(p3),
								AuthInvokeUtils.getClientHeaders(req));
					}
				}

				for (AwardItem item : awardConfig.getAwards()) {
					// 1、获取sku信息
					JsonNode skuNode = getSKU(item.getSkuId(), cfg, req);

					String supplierId = skuNode.get("supplierId").asText();
					String image = skuNode.get("image").asText();
					String name = skuNode.get("productName").asText();
					Integer type = skuNode.get("type").asInt();
					Double price = skuNode.get("price").asDouble();
					// 2、向计划中增加库存
					Map<String, Object> plusParams = new HashMap<>();
					plusParams.put("plan_id", planId);
					plusParams.put("product_id", item.getSkuId());
					plusParams.put("supplier_id", supplierId);
					plusParams.put("plan_quantity", item.getAddQuantity());
					plusParams.put("product_image", image);
					plusParams.put("product_type", type);
					plusParams.put("product_name", name);
					plusParams.put("price", price);
					api.post(cfg.getAppid(), cfg.getAppSecret(), "order", "PlusPlanItemQuantity",
							JsonUtils.formBean(plusParams), AuthInvokeUtils.getClientHeaders(req));
				}
			} catch (Exception ex) {
				log.error(ex.getMessage(), ex);
				return Result.error(ex.getMessage());
			}
		}
		return Result.SUCCESS;
	}

	// 已经存在的SKU配置
	private Map<String, AcmsAwardItemDTO> buildExistsAwards(AppConfig cfg, String activityId, HttpServletRequest req,
			JsonNode allSku) throws Exception {
		// 列出全部库存
		Map<String, Integer> skuQunatity = new HashMap<>();
		if (allSku.get("code").asInt() == 1) {
			JsonNode ctx = allSku.get("context");
			if (ctx != null && ctx.isArray()) {
				Iterator<JsonNode> it = ctx.iterator();
				while (it.hasNext()) {
					JsonNode sku = it.next();
					String skuId = sku.get("productId").asText();
					int allQuantity = sku.get("quantity").asInt();
					skuQunatity.put(skuId, allQuantity);
				}
			}
		}

		// 先取得activity，再获取资源计划
		Map<String, Object> actParams = new HashMap<>();
		actParams.put("activity_id", activityId);
		actParams.put("with_rates", true);
		actParams.put("cache", false);
		String actResult = api.get(cfg.getAppid(), cfg.getAppSecret(), "acms", "GetActivity", actParams,
				AuthInvokeUtils.getClientHeaders(req));

		JsonNode actJson = JsonUtils.getNode(actResult);

		Map<String, AcmsAwardItemDTO> result = new LinkedHashMap<>();

		Set<String> skuIds = new HashSet<>();

		if (actJson.get("code").asInt() == 1 && actJson.get("context") != null
				&& actJson.get("context").has("activity")) {
			JsonNode rates = actJson.get("context").get("rates");

			if (rates != null) {

				Map<String, Object> r = JsonUtils.toMap(rates.toString());

				// ActivityRateGroup[] groups =
				// JsonUtils.toBean(rates.toString(),
				// ActivityRateGroup[].class);

				// for (ActivityRateGroup group : groups) {

				for (Entry<String, Object> j : r.entrySet()) {
					ActivityRateGroup group = JsonUtils.toBean(JsonUtils.formBean(j.getValue()),
							ActivityRateGroup.class);

					List<ActivityRate> rates1 = group.getRates();
					for (ActivityRate rate : rates1) {
						AcmsAwardItemDTO dto = new AcmsAwardItemDTO();
						dto.setSkuId(rate.getPid());
						dto.setDefaultRate(rate.getRate());
						dto.setNeedHelp(rate.isNeedHelp());
						dto.setAllQuantity(skuQunatity.get(rate.getPid()));
						result.put(dto.getSkuId(), dto);
						skuIds.add(rate.getPid());
					}
				}
				// 整合实时库存和图片
				// 先获取活动所有库存
				// 获取活动关联的资源计划
				Map<String, Object> planParams = new HashMap<>();
				planParams.put("activity_id", activityId);
				String planResult = api.get(cfg.getAppid(), cfg.getAppSecret(), "order", "GetActivityPlan", planParams,
						AuthInvokeUtils.getClientHeaders(req));

				JsonNode planJson = JsonUtils.getNode(planResult);
				// log.info("========");
				// log.info(planJson.toString());
				if (planJson != null && planJson.get("code").asInt() == 1 && planJson.get("context").has("plan")) {
					JsonNode planItems = planJson.get("context").get("items");
					// 查实际库存用
					if (planItems != null && planItems.isArray()) {
						Iterator<JsonNode> it = planItems.iterator();
						while (it.hasNext()) {
							JsonNode item = it.next();
							String image = item.get("productImage").asText();
							Integer quantity = item.get("quantity").asInt();
							Integer planQuantity = item.get("planQuantity").asInt();
							String skuId = item.get("productId").asText();
							String skuName = item.get("productName").asText();

							AcmsAwardItemDTO dto = result.get(skuId);
							if (dto != null) {
								dto.setImage(image);
								dto.setQuantity(quantity);
								dto.setSkuName(skuName);
								dto.setPlanQuantity(planQuantity);
							}
						}
					}
				}
			}

		}
		return result;

	}

	// 企业下所有的SKU
	private List<AcmsAwardItemDTO> buildOtherSKUInOrg(AppConfig cfg, HttpServletRequest req,
			Map<String, AcmsAwardItemDTO> exists, JsonNode node) throws Exception {

		Map<String, AcmsAwardItemDTO> res = new LinkedHashMap<>();
		if (node.get("code").asInt() == 1) {
			JsonNode ctx = node.get("context");
			if (ctx != null && ctx.isArray()) {
				Iterator<JsonNode> it = ctx.iterator();
				while (it.hasNext()) {
					JsonNode sku = it.next();
					String skuId = sku.get("productId").asText();
					if (!exists.containsKey(skuId)) {
						AcmsAwardItemDTO dto = new AcmsAwardItemDTO();
						dto.setSkuName(sku.get("productName").asText());
						dto.setSkuId(skuId);
						dto.setQuantity(sku.get("quantity").asInt());
						res.put(dto.getSkuId(), dto);
					}
				}
				// 查找图片
				JsonNode skus = getSKUs(res.keySet(), cfg, req);
				if (skus != null && skus.isArray()) {
					Iterator<JsonNode> it2 = skus.iterator();
					while (it2.hasNext()) {
						JsonNode sku = it2.next();
						String skuId = sku.get("productId").asText();
						String image = sku.get("image").asText();
						AcmsAwardItemDTO dto = res.get(skuId);
						if (dto != null) {
							dto.setImage(image);
						}
					}
				}
			}
		}

		return new ArrayList<>(res.values());
	}

	/**
	 * 列出所有的奖品奖池还有概率
	 * 
	 * @param activityId
	 * @param req
	 * @return
	 */
	@RequestMapping("/award/list")
	public @ResponseBody Result getAwards(@RequestParam("activity_id") String activityId, HttpServletRequest req) {
		// TEST
		//Sys.set(Sys.ORGID, "cjmobile");
		AppConfig cfg = config.getAppConfig(saas.getCurrentAppid());

		Map<String, Object> result = new HashMap<>();
		try {

			String r1 = api.get(cfg.getAppid(), cfg.getAppSecret(), "order", "GetOrgQuantity",
					new HashMap<String, Object>(), AuthInvokeUtils.getClientHeaders(req));

			JsonNode node = JsonUtils.getNode(r1);

			Map<String, AcmsAwardItemDTO> r = buildExistsAwards(cfg, activityId, req, node);
			result.put("exists", r.values());
			result.put("not_added", buildOtherSKUInOrg(cfg, req, r, node));

			return Result.success(result);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return Result.error(e.getMessage());
		}

	}

	/**
	 * 获取活动关联码包
	 * 
	 * @return
	 */
	@RequestMapping("/qrbatches/list")
	public @ResponseBody Result getQrBatches(@RequestParam("activity_id") String activityId, HttpServletRequest req) {
		try {
			//Sys.set(Sys.ORGID, "cjmobile");

			Map<String, Object> params = new HashMap<>();
			params.put("activity_id", "activityId");
			params.put("distinct", true);
			AppConfig cfg = config.getAppConfig(saas.getCurrentAppid());

			String result = api.get(cfg.getAppid(), cfg.getAppSecret(), "qr", "GetQrStrategies", params,
					AuthInvokeUtils.getClientHeaders(req));
			JsonNode r = JsonUtils.getNode(result);
			return Result.success(r.get("context"));
		} catch (Exception ex) {
			log.error(ex.getMessage(), ex);
			return Result.error(ex.getMessage());
		}
	}
	//
	// /**
	// * 新增关联码包
	// *
	// * @return
	// */
	// @RequestMapping(value = "/qrbatches/add", method = RequestMethod.POST)
	// public @ResponseBody Result addQrBatch(@RequestParam("activity_id")
	// String activityId,
	// @RequestParam("batch_no") String batchId, HttpServletRequest req) {
	// try {
	// Sys.set(Sys.ORGID, "cjmobile");
	// AppConfig cfg = config.getAppConfig(saas.getCurrentAppid());
	// JsonNode page = getActivityFirstPage(activityId, cfg, req);
	// String pageId = page.get("pageId").asText();
	//
	// String url = String.format(activityUrl, pageId, activityId);
	//
	// Map<String, Object> params = new HashMap<>();
	// params.put("activity_id", "activityId");
	// params.put("channel_id", batchId);
	// params.put("channel_type", 2); // 2 - 二维码批次 1 - 产品
	// params.put("activity_url", url);
	//
	// String result = api.post(cfg.getAppid(), cfg.getAppSecret(), "qr",
	// "BindQrActivityStrategy",
	// JsonUtils.formBean(params), AuthInvokeUtils.getClientHeaders(req));
	// JsonNode r = JsonUtils.getNode(result);
	// return Result.success(r.get("context"));
	// } catch (Exception ex) {
	// log.error(ex.getMessage(), ex);
	// return Result.error(ex.getMessage());
	// }
	// }

	private JsonNode getActivityFirstPage(String activityId, AppConfig cfg, HttpServletRequest req) throws Exception {
		Map<String, Object> params = new HashMap<>();
		params.put("activity_id", activityId);
		params.put("idx", 0);
		String result = api.get(cfg.getAppid(), cfg.getAppSecret(), "acms", "GetPageByIndex", params,
				AuthInvokeUtils.getClientHeaders(req));
		JsonNode node = JsonUtils.getNode(result).get("context");
		return node;
	}
}
