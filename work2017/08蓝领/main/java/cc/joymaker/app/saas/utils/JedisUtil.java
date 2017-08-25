package cc.joymaker.app.saas.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Repository;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;

@Repository
public class JedisUtil implements InitializingBean {
	
	protected static final Logger log = LoggerFactory.getLogger(JedisUtil.class);

	@Value("#{cfg['redis.host']}")
	private String host;
	@Value("#{cfg['redis.port']}")
	private int port;
	@Value("#{cfg['redis.passwd']}")
	private String password;
	@Value("#{cfg['redis.max.wait']}")
	private long maxWaitMillis;
	@Value("#{cfg['redis.max.total']}")
	private int maxTotal;
	@Value("#{cfg['redis.max.idle']}")
	private int maxIdle;
	@Value("#{cfg['redis.timeout']}")
	private int timeout;
	
	private JedisPool pool;
	
	@Override
	public void afterPropertiesSet() throws Exception {
		log.info("Jedis init :" + host + ":" + port + ";******");
		JedisPoolConfig config = new JedisPoolConfig();
		config.setMaxTotal(maxTotal);
		config.setMaxIdle(maxIdle);
		config.setMaxWaitMillis(maxWaitMillis);
		config.setTestOnBorrow(false);
		config.setTestOnReturn(true);
		pool = new JedisPool(config, host, port, timeout, password);
	}

	public JedisPool getPool() {
		return pool;
	}

	/**
	 * 获取Redis实例.
	 * 
	 * @return Redis工具类实例
	 */
	public Jedis getJedis() {
		Jedis jedis = null;
		int count = 0;
		do {
			try {
				jedis = getPool().getResource();
			} catch (Exception e) {
				log.error("get redis master1 failed!", e);
				getPool().close();
			}
			count++;
		} while (jedis == null && count < 3);
		return jedis;
	}

	/**
	 * 释放redis实例到连接池.
	 * 
	 * @param jedis
	 *            redis实例
	 */
	public void closeJedis(Jedis jedis, String ip, int port) {
		if (jedis != null) {
			getPool().close();
		}
	}
}