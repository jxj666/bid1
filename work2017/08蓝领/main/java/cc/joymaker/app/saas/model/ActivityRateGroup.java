package cc.joymaker.app.saas.model;

import java.util.List;


public class ActivityRateGroup {

	private Integer id;
	
	private String groupName;
	
	private String groupTitle;
	
	private String activityId;
	
	private boolean defaultConfig;
	
	public Integer getId() {
		return id;
	}
	
	public void setId(Integer id) {
		this.id = id;
	}
	
	public boolean isDefaultConfig() {
		return defaultConfig;
	}
	
	public void setDefaultConfig(boolean defaultConfig) {
		this.defaultConfig = defaultConfig;
	}
	
	public String getActivityId() {
		return activityId;
	}
	
	public String getGroupName() {
		return groupName;
	}
	
	public String getGroupTitle() {
		return groupTitle;
	}
	
	public void setActivityId(String activityId) {
		this.activityId = activityId;
	}
	
	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
	
	public void setGroupTitle(String groupTitle) {
		this.groupTitle = groupTitle;
	}
	
	private List<ActivityRate> rates;
	
	public List<ActivityRate> getRates() {
		return rates;
	}
	
	public void setRates(List<ActivityRate> rates) {
		this.rates = rates;
	}
	
}
