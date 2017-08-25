package cc.joymaker.app.saas.model;

public class AwardItem {

	private String skuId;

	private Integer addQuantity;

	private Boolean needHelp;

	private Double rate;

	public String getSkuId() {
		return skuId;
	}

	public void setSkuId(String skuId) {
		this.skuId = skuId;
	}

	public Integer getAddQuantity() {
		return addQuantity;
	}

	public void setAddQuantity(Integer addQuantity) {
		this.addQuantity = addQuantity;
	}

	public Boolean getNeedHelp() {
		return needHelp;
	}

	public void setNeedHelp(Boolean needHelp) {
		this.needHelp = needHelp;
	}

	public Double getRate() {
		return rate;
	}
	
	public void setRate(Double rate) {
		this.rate = rate;
	}

}
