package cc.joymaker.app.saas.controller;

import cc.joymaker.app.base.model.AppConfig;
import cc.joymaker.app.base.service.ApiService;
import cc.joymaker.app.base.service.AppConfigService;
import cc.joymaker.app.base.service.SaasDomainService;
import cc.joymaker.app.base.service.StorageService;
import cc.joymaker.app.base.utils.AuthInvokeUtils;
import cc.joymaker.app.base.utils.HttpUtils;
import cc.joymaker.app.base.utils.JsonUtils;
import cc.joymaker.app.base.utils.Result;
import cc.joymaker.app.saas.service.RedisService;
import cc.joymaker.app.saas.service.WechatPlatformService;
import cc.joymaker.app.saas.utils.IgnoreLoginCheck;
import cc.joymaker.app.saas.utils.IgnoreReferer;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;

@Controller
@RequestMapping("/io")
public class StorageAction {
    Logger log = LoggerFactory.getLogger(StorageAction.class);

    // String fileKey = "QR_FILE/" + batch.getOrgId() + "/" +
    // batch.getSerialNo() + "/" + batch.getBatchNo() + ".zip";

    private static final long MAX_SIZE = 10 * 1024 * 1024;

    @Autowired
    private RedisService redis;

    @Autowired
    private ApiService api;

    @Autowired
    private AppConfigService config;

    @Autowired
    private SaasDomainService saas;

    @Autowired
    private StorageService storage;

    @Autowired
    private WechatPlatformService wechatPlatformService;

    @Value("#{cfg['http.proxy.host']}")
    private String proxyHost = "proxy.hmtx.cc";

    @Value("#{cfg['http.proxy.port']}")
    private Integer proxyPort = 3128;

    @Value("#{cfg['saas.bucket.public']}")
    private String saasPublicBucket;

    @Value("#{cfg['saas.bucket.private']}")
    private String saasPrivateBucket;

    @Value("#{cfg['wechat.cj.appid']}")
    private String cjAppid;

    @Value("#{cfg['wechat.cj.compAppid']}")
    private String cjCompAppid;

    @Value("#{cfg['open.cj.appid']}")
    private String cjOpenAppid;

    @Value("#{cfg['scope']}")
    private String scope;

    private SimpleDateFormat fmt = new SimpleDateFormat("yyyyMMdd");

    @RequestMapping("/upload")
    public @ResponseBody
    Result upload(@RequestParam(value = "file") MultipartFile file) {
        String originalFileName = file.getOriginalFilename();
        String extName = originalFileName.substring(originalFileName.lastIndexOf('.') + 1, originalFileName.length());
        String date = fmt.format(new Date());
        String key = "weiop/" + scope + "/" + date + "/" + DigestUtils.md5Hex(UUID.randomUUID().toString()) + "."
                + extName;

        try {
            String r = storage.put(saasPublicBucket, key, file.getInputStream());
            return Result.success(r);
        } catch (IOException e) {
            return Result.error(e.getMessage());
        }

    }


    @RequestMapping("/upload/fwx")
    public @ResponseBody
    Result uploadFromWechat(@RequestParam(value = "mediaId") final String mediaId, HttpServletRequest req) {

        AppConfig cfg = config.getAppConfig(cjOpenAppid);

        if (cfg == null) {
            return Result.error("参数错误");
        }
        String data = null;
        Map<String, Object> headers = AuthInvokeUtils.getClientHeaders(req);
        headers.put("client-ip", HttpUtils.getRemortIP(req));

        Map<String, Object> reqParams = new HashMap<>();
        reqParams.put("appid", cjAppid);
        reqParams.put("comp_appid", cjCompAppid);


        try {

            data = api.get(cfg.getAppid(), cfg.getAppSecret(), "acms", "GetWechatHosting", reqParams,
                    headers);

            if (org.apache.commons.lang.StringUtils.isNotBlank(data)) {
                JsonNode rconfig = JsonUtils.readValue(data, new TypeReference<JsonNode>() {
                });

                if (rconfig != null && rconfig.get("code").asInt() == 1) {

                    JsonNode host = rconfig.get("context");
                    String url = "https://api.weixin.qq.com/cgi-bin/media/get?access_token=" + host.get("authorizerAccessToken").asText()
                            + "&media_id=" + mediaId;

                    String ukey =   wechatPlatformService.request(url, null, null, new WechatPlatformService.WechatMediaCallback() {

                        @Override
                        public String save(Map<String, String> headers, InputStream is) {
                            String fileExtName = headers.get("Content-disposition").split("\"")[1].split("\\.")[1];
                            String date = fmt.format(new Date());
                            String key = "weiop/" + scope + "/" + date + "/" + mediaId + "."
                                    + fileExtName;

                            String r = storage.put(saasPublicBucket, key, is);
                            log.info("file|upload|" + fileExtName + "|" + key + "|" + date + "|" + mediaId);

                            return r;
                        }
                    });
                    return Result.success(ukey);
                }else {
                    return Result.error("获取授权公号解析失败");
                }
            }else {
                return Result.error("获取授权公号失败");
            }

        } catch (Exception e) {
            return Result.error(e.getMessage());
        }

    }

    public @ResponseBody
    Result uploadWechatResource() {
        return Result.SUCCESS;
    }

    @RequestMapping(value = "qr/download/check")
    @IgnoreLoginCheck
    @IgnoreReferer
    public @ResponseBody
    Object downloadTest(@RequestParam("orgId") String orgId,
                        @RequestParam("batchNo") String batchNo, @RequestParam("secret") String secret, HttpServletRequest req,
                        HttpServletResponse resp) {

        try {
            AppConfig cfg = config.getAppConfig(saas.getAppid(orgId));

            if (cfg == null) {
                return Result.error("参数错误");
            }
            String data = null;
            Map<String, Object> headers = AuthInvokeUtils.getClientHeaders(req);
            headers.put("client-ip", HttpUtils.getRemortIP(req));

            Map<String, String[]> params = req.getParameterMap();
            Map<String, Object> reqParams = new HashMap<>();
            for (Entry<String, String[]> entry : params.entrySet()) {
                reqParams.put(entry.getKey(), entry.getValue()[0]);
            }

            data = api.post(cfg.getAppid(), cfg.getAppSecret(), "qr", "DownloadQrBatch", JsonUtils.formBean(reqParams),
                    headers);

            if (StringUtils.isNotBlank(data)) {
                JsonNode node = JsonUtils.getNode(data);

                JsonNode file = node.get("context").get("file");
                if (StringUtils.isBlank(secret) || node == null || !file.get("fileSecret").asText().equals(secret)) {
                    return Result.error("秘钥不正确");
                }

                return Result.SUCCESS.copyThis();

            }

            return Result.error("不正确的文件或内部服务异常");
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);
            return Result.error(ex.getMessage());
        }

    }

    @RequestMapping(value = "qr/download")
    @IgnoreLoginCheck
    @IgnoreReferer
    public void download(@RequestParam("orgId") String orgId, @RequestParam("batchNo") String batchNo,
                         @RequestParam("secret") String secret, HttpServletRequest req, HttpServletResponse resp) {

        try {
            AppConfig cfg = config.getAppConfig(saas.getAppid(orgId));

            if (cfg == null) {
                resp.setContentType("text/html;charset=utf-8");
                resp.getOutputStream().write("参数错误".getBytes());
                return;
            }
            String data = null;
            Map<String, Object> headers = AuthInvokeUtils.getClientHeaders(req);
            headers.put("client-ip", HttpUtils.getRemortIP(req));

            Map<String, String[]> params = req.getParameterMap();
            Map<String, Object> reqParams = new HashMap<>();
            for (Entry<String, String[]> entry : params.entrySet()) {
                reqParams.put(entry.getKey(), entry.getValue()[0]);
            }

            data = api.post(cfg.getAppid(), cfg.getAppSecret(), "qr", "DownloadQrBatch", JsonUtils.formBean(reqParams),
                    headers);

            if (StringUtils.isNotBlank(data)) {
                JsonNode node = JsonUtils.getNode(data);

                JsonNode file = node.get("context").get("file");
                JsonNode batch = node.get("context").get("batch");
                if (StringUtils.isBlank(secret) || node == null || !file.get("fileSecret").asText().equals(secret)) {

                    resp.setContentType("text/html;charset=utf-8");
                    resp.getOutputStream().write("参数错误".getBytes());
                    return;
                }

                resp.addHeader("Content-Disposition",
                        "attachment;filename=" + new String((batch.get("serialNo").asText() + ".zip").getBytes()));
                resp.setContentType("application/octet-stream;charset=utf-8");

                storage.download(file.get("bucket").asText(), file.get("key").asText(), resp.getOutputStream());

            }
        } catch (Exception ex) {
            log.error(ex.getMessage(), ex);

        }

    }


}
