package cc.joymaker.app.saas.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

public class ActivityRate {

	private Integer id;

	private Integer groupId;

	private String pid;
	private Double rate;
	private boolean needHelp;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}


	public Integer getGroupId() {
		return groupId;
	}
	
	public void setGroupId(Integer groupId) {
		this.groupId = groupId;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public Double getRate() {
		return rate;
	}

	public void setRate(Double rate) {
		this.rate = rate;
	}

	public boolean isNeedHelp() {
		return needHelp;
	}

	public void setNeedHelp(boolean needHelp) {
		this.needHelp = needHelp;
	}

	
}
