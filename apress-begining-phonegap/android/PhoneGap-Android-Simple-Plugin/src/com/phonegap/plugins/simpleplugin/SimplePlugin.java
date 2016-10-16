/**
 * 
 */
package com.phonegap.plugins.simpleplugin;

import java.util.Date;

import org.json.JSONArray;
import org.json.JSONException;

import com.phonegap.api.Plugin;
import com.phonegap.api.PluginResult;
import com.phonegap.api.PluginResult.Status;

/**
 * @author rohit
 * 
 */
public class SimplePlugin extends Plugin {

	public static String ACTION_HELLO="hello";
	
	/*
	 * (non-Javadoc)
	 * 
	 * @see com.phonegap.api.Plugin#execute(java.lang.String,
	 * org.json.JSONArray, java.lang.String)
	 */
	@Override
	public PluginResult execute(String action, JSONArray data, String callbackId) {
		PluginResult pluginResult = null;
		if (ACTION_HELLO.equals(action)) {

			String name;
			try {
				name = data.getString(0);

				String result = "Hello " + name + "! The time is "
						+ (new Date()).toString();

				pluginResult = new PluginResult(Status.OK, result);

				return pluginResult;
			} catch (JSONException e) {
				pluginResult = new PluginResult(Status.JSON_EXCEPTION, "missing argument name");
			}
		} else {
			pluginResult = new PluginResult(Status.INVALID_ACTION,
					"Allowed actions is hello");
		}
		return pluginResult;
	}
	
}
