/**
 * 
 * @return Instance of SimplePlugin
 */
var SimplePlugin = function() {

}

/**
 * @param name
 *            The name passed in
 * @param successCallback
 *            The callback which will be called when simple plugin runs 
 *            successfully
 * @param failureCallback
 *            The callback which will be called when simple plugin
 *            fails
 */
SimplePlugin.prototype.hello = function(name, successCallback, failureCallback) {

	return PhoneGap.exec(successCallback, // Success Callback
						failureCallback,  // Failure Callback
						'SimplePlugin',   // Registered Plugin name
						'hello', 		  // Action
						[ name ]);        // Argument passed in
};

/**
 * <ul>
 * <li>Register the Simple Listing Javascript plugin.</li>
 * <li>Also register native call which will be called when this plugin runs</li>
 * </ul>
 */
PhoneGap.addConstructor(function() {
	// Register the javascript plugin with PhoneGap
	PhoneGap.addPlugin('simpleplugin', new SimplePlugin());

	// Register the native class of plugin with PhoneGap
	PluginManager.addService("SimplePlugin",
			"com.phonegap.plugins.simpleplugin.SimplePlugin");
});