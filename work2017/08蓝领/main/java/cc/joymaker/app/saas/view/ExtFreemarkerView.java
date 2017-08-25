package cc.joymaker.app.saas.view;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.springframework.web.servlet.view.freemarker.FreeMarkerView;


public class ExtFreemarkerView extends FreeMarkerView {

	@Override
	protected void exposeHelpers(Map<String, Object> model,
			HttpServletRequest request) throws Exception {
		super.exposeHelpers(model, request);
		model.put("base", request.getContextPath());
		//model.put("cdn", "http://7xsea2.com2.z0.glb.qiniucdn.com/");
		model.put("cdn", request.getContextPath());
		//model.put("_ToJson", new ToJsonMethod());
	}
}
