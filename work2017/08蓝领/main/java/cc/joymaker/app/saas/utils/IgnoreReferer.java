package cc.joymaker.app.saas.utils;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 在Controller的Method上标记后， 该method请求将不会被检查Referer
 * @author zhangyuxin85@gmail.com
 *
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface IgnoreReferer {

}
