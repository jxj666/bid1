package cc.joymaker.app.saas.service.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import cc.joymaker.app.saas.service.RedisService;
import cc.joymaker.app.saas.utils.JedisUtil;
import redis.clients.jedis.Jedis;

//@Service("redisService")
@Service
public class AliyunRedisService implements RedisService {

	private static final Logger log = Logger.getLogger(AliyunRedisService.class);

	@Value("#{cfg['scope']}")
	private String condition;

	@Autowired
	private JedisUtil jedisUtil;

	public void put(String type, String key, String value, int expire) {
		if ("test".equals(condition.toLowerCase())) {
			type = "TST-" + type;
		}
		String tkey = type + "-" + key;
		Jedis client = jedisUtil.getJedis();
		try {
			client.set(tkey, value);
			if (expire > 0) {
				client.expire(tkey, expire);
			}
		} catch (Exception e) {
			e.printStackTrace();
			log.error(e.getMessage(), e);
		} finally {
			client.close();
		}
	}

	public void put(String type, String key, String value) {
		put(type, key, value, -1);
	}

	public String get(String type, String key) {
		if ("test".equals(condition.toLowerCase())) {
			type = "TST-" + type;
		}
		String tkey = type + "-" + key;
		Jedis client = jedisUtil.getJedis();
		try {
			return client.get(tkey);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			e.printStackTrace();
			return null;
		} finally {
			client.close();
		}
	}

	public void delete(String type, String key) {
		if ("test".equals(condition.toLowerCase())) {
			type = "TST-" + type;
		}
		String tkey = type + "-" + key;
		Jedis client = jedisUtil.getJedis();
		try {
			client.del(tkey);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			e.printStackTrace();
		} finally {
			client.close();
		}
	}

	@Override
	public Long incr(String type, String key) {
		if ("test".equals(condition.toLowerCase())) {
			type = "TST-" + type;
		}
		String tkey = type + "-" + key;
		Jedis client = jedisUtil.getJedis();
		try {
			return client.incr(tkey);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			e.printStackTrace();
		} finally {
			client.close();
		}
		return null;
	}

	@Override
	public Long decr(String type, String key) {
		if ("test".equals(condition.toLowerCase())) {
			type = "TST-" + type;
		}
		String tkey = type + "-" + key;
		Jedis client = jedisUtil.getJedis();
		try {
			return client.decr(tkey);
		} catch (Exception e) {
			log.error(e.getMessage(), e);
			e.printStackTrace();
		} finally {
			client.close();
		}
		return null;
	}

	@Override
	public boolean expire(String type, String key, int expire) {
		if ("test".equals(condition.toLowerCase())) {
			type = "TST-" + type;
		}
		String tkey = type + "-" + key;
		Jedis client = jedisUtil.getJedis();
		try {
			long x = client.expire(tkey, expire);
			return x > 0 ? true : false;

		} catch (Exception e) {
			log.error(e.getMessage(), e);
			return false;
		} finally {
			client.close();
		}
	}
}
