package cc.joymaker.app.saas.utils;

import java.security.InvalidAlgorithmParameterException;
import java.security.Key;
import java.security.SecureRandom;
import java.security.spec.AlgorithmParameterSpec;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.DESKeySpec;
import javax.crypto.spec.IvParameterSpec;

import org.apache.commons.codec.binary.Base64;
import org.springframework.util.Base64Utils;

/**
 * @author zhang baozhe
 *
 * @version 2016年11月23日
 */
public class DES {
	// 算法名称
	public static final String KEY_ALGORITHM = "DES";
	// 算法名称/加密模式/填充方式
	public static final String ALGORITHM_DES = "DES/ECB/PKCS5Padding";
	// 算法名称/加密模式/填充方式
	public static final String ALGORITHM_DES2 = "DES/CBC/PKCS5Padding";

	public static void main(String args[]) {
		// 待加密内容
		String str = "aid=1001&appid=ynzy-33i1&code=ttcFtvleWIMmq109&geo=MzkuOTA0MDMsMTE2LjQwNzUyNiwwLOWMl+S6rCws5Lic5Z+O5Yy6&mobile=18600467611&nc=27784312&openid=oHeTtwC9t45H4m5GUAjoWzPaSpUw&pdn=%E7%A1%AC%E7%8E%89%E6%BA%AA-%E6%9D%A1%E7%9B%92&point=0&ts=1494672881477";
		// 密码，长度要是8的倍数
		String password = "grtH45ui";

		String res2 = encrypt2(str, password);
		System.out.println("加密后：" + res2);

		// 直接将如上内容解密
		try {
			// res2 =
			// "ZDeZdU4/KfAY3Wg73TMvqxHNigLdDHboIXLIOzozVvJWRMCpYpfZtrSk9FizTdhEvZMdWuGUHBzOZU4H/mzLPnrGqekFVz7dwq7eop1lKTm5r+VTkqmgbXSTQoz3nDhGl0/L9cPRhlyW/UL+tjWrSbnho+229/g56hp0wOeFv7+2wM2gzi/B5cTjnpQnRRwg9XMwd+sJVPb0PCtUP68bLN2pHK1PrbzvKQk/XjPjDILH68T1uu8wMCDxh71tZI5HFdFSwt9lQv056TarOro0/9xgDk0Jm370qQ8qH4KDC5xAUzsx2pEKGt/tF3byRQxdzFYVwydXe6g=";
			res2 = "/7gCTFyYmnpeuuGEMzEPCX+VU6vZWabLXkAQJZ0OiJ8=";
			System.out.println("解密后2：" + decrypt2(res2, password));
		} catch (Exception e1) {
			e1.printStackTrace();
		}

	}

	private static Key keyGenerator(String key) throws Exception {

		// 创建一个DESKeySpec对象
		DESKeySpec desKey = new DESKeySpec(key.getBytes());
		// 创建一个密匙工厂
		SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(KEY_ALGORITHM);
		// 将DESKeySpec对象转换成SecretKey对象
		SecretKey securekey = keyFactory.generateSecret(desKey);
		return securekey;
	}

	/**
	 * 加密
	 * 
	 * @param datasource
	 *            byte[]
	 * @param password
	 *            String
	 * @return byte[]
	 */
	public static String encrypt(String datasource, String password) {
		try {
			return Base64.encodeBase64String(encrypt(datasource.getBytes("UTF-8"), password));
		} catch (Throwable e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 加密
	 * 
	 * @param datasource
	 *            byte[]
	 * @param password
	 *            String
	 * @return byte[]
	 */
	public static byte[] encrypt(byte[] datasource, String key) {
		try {

			Key deskey = keyGenerator(new String(key));

			SecureRandom random = new SecureRandom();
			// Cipher对象实际完成加密操作
			Cipher cipher = Cipher.getInstance(ALGORITHM_DES);

			// 用密匙初始化Cipher对象
			cipher.init(Cipher.ENCRYPT_MODE, deskey, random);
			// 现在，获取数据并加密
			// 正式执行加密操作
			return cipher.doFinal(datasource);
		} catch (Throwable e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 解密
	 * 
	 * @param src
	 *            byte[]
	 * @param password
	 *            String
	 * @return byte[]
	 * @throws Exception
	 */
	public static String decrypt(String src, String password) throws Exception {

		return new String(decrypt(Base64.decodeBase64(src), password));
	}

	/**
	 * 解密
	 * 
	 * @param src
	 *            byte[]
	 * @param password
	 *            String
	 * @return byte[]
	 * @throws Exception
	 */
	public static byte[] decrypt(byte[] src, String key) throws Exception {
		Key deskey = keyGenerator(new String(key));
		// DES算法要求有一个可信任的随机数源
		SecureRandom random = new SecureRandom();
		// Cipher对象实际完成解密操作
		Cipher cipher = Cipher.getInstance(ALGORITHM_DES);
		// 用密匙初始化Cipher对象
		cipher.init(Cipher.DECRYPT_MODE, deskey, random);
		// 真正开始解密操作
		return cipher.doFinal(src);
	}

	/**
	 * 将二进制转换成16进制
	 * 
	 * @param buf
	 * @return
	 */
	private static String parseByte2HexStr(byte buf[]) {
		StringBuffer sb = new StringBuffer();
		for (int i = 0; i < buf.length; i++) {
			String hex = Integer.toHexString(buf[i] & 0xFF);
			if (hex.length() == 1) {
				hex = '0' + hex;
			}
			sb.append(hex.toUpperCase());
		}
		return sb.toString();
	}

	/**
	 * 将16进制转换为二进制
	 * 
	 * @param hexStr
	 * @return
	 */
	private static byte[] parseHexStr2Byte(String hexStr) {
		if (hexStr.length() < 1)
			return null;
		byte[] result = new byte[hexStr.length() / 2];
		for (int i = 0; i < hexStr.length() / 2; i++) {
			int high = Integer.parseInt(hexStr.substring(i * 2, i * 2 + 1), 16);
			int low = Integer.parseInt(hexStr.substring(i * 2 + 1, i * 2 + 2), 16);
			result[i] = (byte) (high * 16 + low);
		}
		return result;
	}

	/**
	 * DES算法，加密
	 *
	 * @param data
	 *            待加密字符串
	 * @param key
	 *            加密私钥，长度不能够小于8位
	 * @return 加密后的字节数组，一般结合Base64编码使用
	 * @throws InvalidAlgorithmParameterException
	 * @throws Exception
	 */
	public static String encrypt2(String data, String key) {
		if (data == null)
			return null;
		try {
			DESKeySpec dks = new DESKeySpec(key.getBytes());
			SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(KEY_ALGORITHM);
			// key的长度不能够小于8位字节
			Key secretKey = keyFactory.generateSecret(dks);
			Cipher cipher = Cipher.getInstance(ALGORITHM_DES2);
			IvParameterSpec iv = new IvParameterSpec(key.substring(0, 8).getBytes());
			AlgorithmParameterSpec paramSpec = iv;
			cipher.init(Cipher.ENCRYPT_MODE, secretKey, paramSpec);
			byte[] bytes = cipher.doFinal(data.getBytes());
			return Base64Utils.encodeToString(bytes);
		} catch (Exception e) {
			e.printStackTrace();
			return data;
		}
	}

	/**
	 * DES算法，解密
	 *
	 * @param data
	 *            待解密字符串
	 * @param key
	 *            解密私钥，长度不能够小于8位
	 * @return 解密后的字节数组
	 * @throws Exception
	 *             异常
	 */
	public static String decrypt2(String data, String key) {
		if (data == null)
			return null;
		try {
			DESKeySpec dks = new DESKeySpec(key.getBytes());
			SecretKeyFactory keyFactory = SecretKeyFactory.getInstance(KEY_ALGORITHM);
			// key的长度不能够小于8位字节
			Key secretKey = keyFactory.generateSecret(dks);
			Cipher cipher = Cipher.getInstance(ALGORITHM_DES2);
			IvParameterSpec iv = new IvParameterSpec(key.substring(0, 8).getBytes());
			AlgorithmParameterSpec paramSpec = iv;
			cipher.init(Cipher.DECRYPT_MODE, secretKey, paramSpec);

			// return new
			// String(cipher.doFinal(hex2byte(data.getBytes("GB2312"))));
			return new String(cipher.doFinal(Base64Utils.decodeFromString(data)));
		} catch (Exception e) {
			e.printStackTrace();
			return data;
		}
	}

	/**
	 * 二行制转字符串
	 * 
	 * @param b
	 * @return
	 */
	private static String byte2hex(byte[] b) {
		StringBuilder hs = new StringBuilder();
		String stmp;
		for (int n = 0; b != null && n < b.length; n++) {
			stmp = Integer.toHexString(b[n] & 0XFF);
			if (stmp.length() == 1)
				hs.append('0');
			hs.append(stmp);
		}
		return hs.toString().toUpperCase();
	}

	private static byte[] hex2byte(byte[] b) {
		if ((b.length % 2) != 0)
			throw new IllegalArgumentException();
		byte[] b2 = new byte[b.length / 2];
		for (int n = 0; n < b.length; n += 2) {
			String item = new String(b, n, 2);
			b2[n / 2] = (byte) Integer.parseInt(item, 16);
		}
		return b2;
	}

}
