package cc.joymaker.app.saas.model;

public class AcmsAwardItemDTO {

	private String image;

	private int quantity;
	
	private int planQuantity;

	private boolean needHelp;

	private double defaultRate;

	private String skuId;
	
	private String skuName;
	
	private int allQuantity;
	
	public int getAllQuantity() {
		return allQuantity;
	}
	
	public void setAllQuantity(int allQuantity) {
		this.allQuantity = allQuantity;
	}
	
	public String getSkuName() {
		return skuName;
	}
	
	public void setSkuName(String skuName) {
		this.skuName = skuName;
	}
	
	public int getPlanQuantity() {
		return planQuantity;
	}
	
	public void setPlanQuantity(int planQuantity) {
		this.planQuantity = planQuantity;
	}

	public String getImage() {
		return image;
	}

	public void setImage(String image) {
		this.image = image;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
	}

	public boolean isNeedHelp() {
		return needHelp;
	}

	public void setNeedHelp(boolean needHelp) {
		this.needHelp = needHelp;
	}

	public double getDefaultRate() {
		return defaultRate;
	}

	public void setDefaultRate(double defaultRate) {
		this.defaultRate = defaultRate;
	}

	public String getSkuId() {
		return skuId;
	}

	public void setSkuId(String skuId) {
		this.skuId = skuId;
	}

}
