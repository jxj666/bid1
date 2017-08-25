package cc.joymaker.app.saas.controller;

import cc.joymaker.app.base.utils.DateUtils;
import cc.joymaker.app.base.utils.HttpUtils;
import cc.joymaker.app.saas.utils.IgnoreLoginCheck;
import cc.joymaker.app.saas.utils.IgnoreReferer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;

@RequestMapping("/")
@Controller
public class MainAction {

    Logger log = LoggerFactory.getLogger(MainAction.class);
    static Logger requestLog = LoggerFactory.getLogger("saas.trace");

    @RequestMapping("")
    @IgnoreLoginCheck
    @IgnoreReferer
    public void root(@RequestParam(value = "rc", defaultValue = "0", required = false) String rc,
                     HttpServletRequest request, HttpServletResponse response) throws IOException {
        String spt = "\t";
        String ip = HttpUtils.getRemortIP(request);
        String ua = request.getHeader("User-Agent");

        requestLog.info(DateUtils.parse(new Date()) + spt + rc + spt + ip + spt + ua);
        response.sendRedirect(HttpUtils.getDomain(request) + "/html/marketing/index.html");
    }
}
