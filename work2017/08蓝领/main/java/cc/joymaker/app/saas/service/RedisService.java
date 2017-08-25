package cc.joymaker.app.saas.service;

public interface RedisService {

	String BATCH = "batch";
	String PRODUCT = "pdt";
	String RULE = "rule";
	String STRATEGY = "stgy";

	void put(String type, String key, String value, int expire);

	String get(String type, String key);

	/**
	 * @param type
	 * @param key
	 */
	void delete(String type, String key);

	Long incr(String type, String key);

	Long decr(String type, String key);

	boolean expire(String type, String key, int expire);
}
