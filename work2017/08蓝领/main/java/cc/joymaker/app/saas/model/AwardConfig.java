package cc.joymaker.app.saas.model;

import java.util.List;

public class AwardConfig {

	private String activityId;
	
	private String group;
	
	public String getGroup() {
		return group;
	}
	
	public void setGroup(String group) {
		this.group = group;
	}
	
	private List<AwardItem> awards;
	
	public String getActivityId() {
		return activityId;
	}
	
	public List<AwardItem> getAwards() {
		return awards;
	}
	
	public void setActivityId(String activityId) {
		this.activityId = activityId;
	}
	
	public void setAwards(List<AwardItem> awards) {
		this.awards = awards;
	}
}
