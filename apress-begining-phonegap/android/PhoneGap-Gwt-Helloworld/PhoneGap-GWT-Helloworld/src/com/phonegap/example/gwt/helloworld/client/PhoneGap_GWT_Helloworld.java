package com.phonegap.example.gwt.helloworld.client;

import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Grid;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.RootPanel;

import de.kurka.phonegap.client.PhoneGap;
import de.kurka.phonegap.client.PhoneGapAvailableEvent;
import de.kurka.phonegap.client.PhoneGapAvailableHandler;
import de.kurka.phonegap.client.PhoneGapTimeoutEvent;
import de.kurka.phonegap.client.PhoneGapTimeoutHandler;
import de.kurka.phonegap.client.device.Device;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class PhoneGap_GWT_Helloworld implements EntryPoint {
	
	/**
	 * This is the entry point method.
	 */
	public void onModuleLoad() {
		final PhoneGap phoneGap = GWT.create(PhoneGap.class);

        phoneGap.addHandler(new PhoneGapAvailableHandler() {

                
                public void onPhoneGapAvailable(PhoneGapAvailableEvent event) {
                	Device device = phoneGap.getDevice();
                	
                	
                	Grid grid = new Grid(5, 2);

                	//Add a row mentioning Name Property of Device
                	grid.setWidget(0, 0, new Label("Name"));
                	grid.setWidget(0, 1, new Label(device.getName()));
                	
                	//Add a row mentioning Platform Property of Device
                	grid.setWidget(1, 0, new Label("Platform"));
                	grid.setWidget(1, 1, new Label(device.getPlatform()));
                	
                	//Add a row mentioning Version Property of Device
                	grid.setWidget(2, 0, new Label("Version"));
                	grid.setWidget(2, 1, new Label(device.getVersion()));
                	
                	//Add a row mentioning Name Property of Device
                	grid.setWidget(3, 0, new Label("PhoneGapVersion"));
                	grid.setWidget(3, 1, new Label(device.getPhoneGapVersion()));

                	//Add a row mentioning Name Property of Device
                	grid.setWidget(4, 0, new Label("UUID"));
                	grid.setWidget(4, 1, new Label(device.getUuid()));

                	grid.setBorderWidth(1);
                	
                	RootPanel.get().add(grid);

                }
        });

        phoneGap.addHandler(new PhoneGapTimeoutHandler() {

                
                public void onPhoneGapTimeout(PhoneGapTimeoutEvent event) {
                        Window.alert("can not load phonegap");

                }
        });

        phoneGap.initializePhoneGap();
		
	}
}
