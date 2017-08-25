package cc.joymaker.app.saas.view;

import java.util.Iterator;

import org.apache.commons.configuration.PropertiesConfiguration;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import freemarker.ext.beans.BeansWrapper;
import freemarker.template.Configuration;
import freemarker.template.TemplateHashModel;
import freemarker.template.TemplateModel;

public class ExtFreemarkerConfig implements ApplicationContextAware {

	private static final Logger log = LoggerFactory.getLogger(ExtFreemarkerConfig.class);

	@Autowired
	private FreeMarkerConfigurer configure;

	@Override
	public void setApplicationContext(ApplicationContext context) throws BeansException {

		if (configure == null) {
			throw new RuntimeException("FreeMarkerConfigurer not exists.");
		}

		Configuration config = configure.getConfiguration();

		BeansWrapper wrapper = new BeansWrapper();
		wrapper.setExposureLevel(BeansWrapper.EXPOSE_ALL);

		try {
			org.apache.commons.configuration.Configuration methodsConfig = new PropertiesConfiguration("static-methods.properties");

			for (Iterator it = methodsConfig.getKeys(); it.hasNext();) {
				String key = (String) it.next();
				String value = methodsConfig.getString(key);
				TemplateHashModel staticModels = wrapper.getStaticModels();
				Object bean = null;
				if (value.indexOf("spring:") > -1) {
					bean = context.getBean(value.substring("spring:".length()));
				} else {
					Class clazz = Class.forName(value);
					if (TemplateModel.class.isAssignableFrom(clazz)) {
						bean = clazz.newInstance();
					} else {
						bean = staticModels.get(value);
					}
				}
				if (bean == null) {
					continue;
				}

				log.info("Add " + bean + " To Freemarker Shared Variables");
				if (bean instanceof TemplateModel) {
					config.setSharedVariable(key, (TemplateModel) bean);
				} else {
					config.setSharedVariable(key, bean);
				}
			}
		} catch (Exception ex) {
			log.error(ex.getMessage(), ex);
		}
	}

}
