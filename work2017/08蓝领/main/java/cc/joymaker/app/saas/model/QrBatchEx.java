package cc.joymaker.app.saas.model;

import java.util.List;

import com.fasterxml.jackson.databind.JsonNode;

public class QrBatchEx {

	private JsonNode batch;
	
	private JsonNode activities;

	public JsonNode getBatch() {
		return batch;
	}

	public void setBatch(JsonNode batch) {
		this.batch = batch;
	}
public JsonNode getActivities() {
	return activities;
}

public void setActivities(JsonNode activities) {
	this.activities = activities;
}
	
	
	
}
