Ext.setup({
    tabletStartupScreen: 'tablet_startup.png',
    phoneStartupScreen: 'phone_startup.png',
    icon: 'icon.png',
    glossOnIcon: false,
    onReady: function(){ 
    	var lastPanelId = 0;
      
    	var SEARCHPAGE=0;
    	var TABPAGE=1;
    	var FAVPAGE=2;
    	var DETAILSPAGE=3;

		var cachedDetails=null;
        
        var searchPanel = new Ext.form.FormPanel({
            layout: 'fit',
            fullscreen: true,
            scroll: 'vertical',
            standardSubmit: false,
            //Adding form field
            items: [{
                xtype: 'fieldset',
                title: 'Local Search',
                items: [{
                    xtype: 'textfield',
                    name: 'search',
                    label: 'Search',
                    value: 'Pizza',
                    useClearIcon: true,
                    autoCapitalize: false
                }, {
                    xtype: 'sliderfield',
                    name: 'range',
                    label: 'Range (0-10 Kms)',
                    value: 5,
                    minValue: 0,
                    maxValue: 10
                }]
            }]            //Docking a toolbar at bottom			
            ,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    xtype: 'spacer'
                }, {
                    text: 'Search',
                    iconCls: 'search',
                    title: 'Search',
                    iconMask: true,
                    ui: 'round',
                    ui: 'confirm',
                    handler: function(){
                        lastPanelId=TABPAGE;
                        fetchFromGoogle();
						mainPanel.dockedItems.items[0].setTitle('Search Results');
                        mainPanel.setActiveItem(lastPanelId);
                    }
                }]
            }]
        });
        
    	var detailClickHandler = function(event){
		   var reference = event.getTarget(".place").id;
           fetchDetails(reference);
		   mainPanel.dockedItems.items[0].setTitle('Details');
           mainPanel.setActiveItem(DETAILSPAGE, "slide");
        }
        
        var result = new Ext.Component({
        
            title: 'Search Result',
            iconMask: true,
            iconCls: 'organize',
            cls: 'timeline',
            scroll: 'vertical',
            tpl: [	'<tpl for=".">', 
						'<div class="place" id="{reference}">', 
							'<div class="icon"><img  src="{icon}" /></div>', 
							'<div>', 
								'<h2 >{name}</h2>', 
								'<p>{vicinity}</p>', 
							'</div>', 
						'</div>', 
					'</tpl>'
					
					],
			listeners: {
     				   el: {
            				tap: detailClickHandler,
            				delegate: '.place'
            				
        					}
   					 }
				
        });
		
        var favorites = new Ext.Component({
            title: 'Favotites',
            iconMask: true,
            iconCls: 'organize',
            
            cls: 'timeline',
            scroll: 'vertical',
            tpl: [	'<tpl for=".">', 
					'<div class="place" id="{reference}">', 
						'<div class="icon"><img  src="{icon}" /></div>', 
						'<div>', 
							'<h2>{name}</h2>', 
							'<p>{vicinity}</p>', 
						'</div>', 
					'</div>', 
				'</tpl>'],
			listeners: {
     				   el: {
            				tap: detailClickHandler,
            				delegate: '.place'
            				
        					}
   					 }
			
        });
        
        var map = new Ext.Map({
            iconMask: true,
            iconCls: 'maps',
            title: 'Map', // Name that appears on this tab
            fullscreen:true,
            mapOptions: { // Used in rendering map
                zoom: 12
            }
        });
        
        var tabResultPanel = new Ext.TabPanel({
            layout: 'fit',
            tabBar: {
                dock: 'bottom',
                layout: {
                    pack: 'center'
                }
            },
            items: [result, map],
        
        
        });
        
        var placeDetailsPanel = new Ext.Panel({
            //layout: 'fit',
            tpl: [	'<table>',
					'<tr>', 
					   '<td>',					   
					   '</td>',
					   '<td>',					   
					      '<h1 class="bold">Business Details</h1>',
					   '</td>',
					   
					'</tr>', 						
					'<tr>', 
					   '<td>',					   
					   	'<h1 class="bold">Name</h1>',
					   '</td>',
					   '<td>',					   
					      '<h1>{name}</h1>',
					   '</td>',
					   
					'</tr>', 						
					'<tr>', 
					   '<td>',					   
					   	'<h1 class="bold">Address</h1>',
					   '</td>',
					   '<td>',					   
					      '<h1>{formatted_address}</h1>',
					   '</td>',
					   
					'</tr>', 						
					'<tr>', 
					   '<td>',					   
					   	'<h1 class="bold">Phone</h1>',
					   '</td>',
					   '<td>',					   
					      '<h1>{formatted_phone_number}</h1>',
					   '</td>',
					   
					'</tr>', 						
					'<tr>', 
					   '<td>',					   
					   	'<h1 class="bold">Rating</h1>',
					   '</td>',
					   '<td>',					   
					      '<h1>{rating}</h1>',
					   '</td>',
					'</tr>', 						
					'<tr>', 
					   '<td>',					   
					   	'<h1 class="bold">Home Page</h1>',
					   '</td>',
					   '<td>',					   
					      '<a href="{url}" target="_blank">Home Page</a>',
					   '</td>',
					'</tr>',
					'</table>'
				
			]
		});
		
        var resultDetailPanel = new Ext.Panel({
            layout: {
            	type: 'vbox',
            },
            items:[
            	placeDetailsPanel,
            	{
            		xtype:'button',
            		text: 'Add to Favorite',
            		handler:function(button,event){
						if(button.text=="Add to Favorite"){
							addCurrentToFav();
							button.setText("Remove from Favorite");
						}
						else{
							removeCurrentFromFav();
							button.setText("Add to Favorite");							
						}
						
            		}
            		
            	}
            ],
        	dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [
                	{ 
                    ui: 'round',
                    text: 'Back',
                    handler: function(){
							
                                if(lastPanelId==0){
                                	mainPanel.dockedItems.items[0].setTitle('Home Page');
                                }
                                else if(lastPanelId==1){
                                    mainPanel.dockedItems.items[0].setTitle('Search Results');
                                }
                                else if(lastPanelId==2){
                                    fetchFromDB();
                                    mainPanel.dockedItems.items[0].setTitle('Favourites');                                
                                }
                                else if(lastPanelId==3){
                                    //Shouldn't happen
                                    mainPanel.dockedItems.items[0].setTitle('Details');                                
                                }
                           
                    	    	mainPanel.setActiveItem(lastPanelId, {type: 'slide', direction: 'right'});
                    		}
                    
                	}	
                ]
            }]
        
        });
        
        //Main Panel with CardLayout
        var mainPanel = new Ext.Panel({
            layout: 'card',
            fullscreen: true,
            items: [searchPanel, tabResultPanel, favorites, resultDetailPanel],
            dockedItems: [{
                xtype: 'toolbar',
                title: 'Local Search',
                dock: 'top',
                items: [{
                
                    iconMask: true,
                    ui: 'round',
                    iconCls: 'home',
                    handler: function(){
                        lastPanelId = SEARCHPAGE;
						
                        mainPanel.dockedItems.items[0].setTitle('Home Page');
                        mainPanel.setActiveItem(lastPanelId, "slide");
                    }
                    
                }, {
                    xtype: 'spacer'
                }, {
                
                    iconMask: true,
                    ui: 'round',
                    iconCls: 'star',
                    handler: function(){
                    	fetchFromDB();
                    	lastPanelId = FAVPAGE;
                    	mainPanel.dockedItems.items[0].setTitle('Favourites');
                        mainPanel.setActiveItem(lastPanelId, "slide");
                    }
                    
                }]
            }]
        });
		
		// These are all Google Maps APIs
        var addMarker = function(name,reference,position) {
           
				var marker = new google.maps.Marker({
					map: map.map,
					position: position,
					clickable: true,
					optimized: true,
					title: name
				});
				google.maps.event.addListener(marker, 'click', function(){
					fetchDetails(reference);
					mainPanel.dockedItems.items[0].setTitle('Details');
           			mainPanel.setActiveItem(DETAILSPAGE, "slide");

				});
			

        };

        var fetchFromGoogle = function(){

        	var keyword = searchPanel.items.items[0].items.items[0].value;
        	var range = searchPanel.items.items[0].items.items[1].value * 1000;
            navigator.geolocation.getCurrentPosition(
            	function(position){
					var lat = position.coords.latitude;
					var lng = position.coords.longitude;
					
					
					map.update({
								latitude: lat,
								longitude: lng
							});
					
            	    var googlePlaceUrl='https://maps.googleapis.com/maps/api/place/search/json?location='+lat+','+lng+'&radius='+range+'&types=food&name='+keyword+'&sensor=false&key=AIzaSyC4vCfT_Knq1SGuNMahZqyrmZFiTuBsdlY';
		            Ext.Ajax.request({
        		        url: googlePlaceUrl,
                		success: function(response, opts){


                    		var obj = Ext.decode(response.responseText);
                    		
                    		result.update(obj.results);
							var data = obj.results;
					 		for (var i = 0, ln = data.length; i < ln; i++) { // Loop to add points to the map
          						var place = data[i];                           

          					if (place.geometry && place.geometry.location) {      
            					var position = new google.maps.LatLng( place.geometry.location.lat, place.geometry.location.lng);  
            					addMarker(place.name,place.reference,position);                  // Call addMarker function with new data
          					}
        				}

                	},
                	failure: function(response, opts){
                    	console.log('server-side failure with status code ' + response.status);
                               
                	}
                },
                function(err){
	                console.log('Failed to get geo location from phonegap '+err);
                }
            );
            })
        }
        
        var fetchFromDB = function(){

            var db = window.openDatabase("Favourites", "1.0", "Favourites", 200000);
            try {
                db.transaction(function(tx){
                	tx.executeSql('SELECT * FROM Favourite', [], 
                		function(tx, results){
                		    var arr = [];
                			for(var i=0;i<results.rows.length;i++){
                			    var data = results.rows.item(i)
								arr[i]=data;								
							}

                        	favorites.update(arr);
                        
                    	}, 
                    	function(error){
                        	console.log("Got error fetching favourites " + error.code + " " + error.message);
                    	}
                    );
                });
            } 
            catch (err) {
                console.log("Got error while reading favourites " + err);
            }

        }
        
        
        
        var fetchDetails = function (reference){
            placeDetailsPanel.update({name:"",formatted_address:"",formatted_phone_number:"",rating:"",url:""});
       		Ext.Ajax.request({
                url: 'https://maps.googleapis.com/maps/api/place/details/json?reference=' + reference + '&sensor=false&key=AIzaSyC4vCfT_Knq1SGuNMahZqyrmZFiTuBsdlY',
                success: function(response, opts){
                    var obj = Ext.decode(response.responseText);
                    cachedDetails = obj.result; 
                    isFav(obj.result, function(result){
                       if(result){
							resultDetailPanel.items.items[1].setText("Remove from Favorite");
	                   }
	                   else{
							resultDetailPanel.items.items[1].setText("Add to Favorite");
	                   }
	                   placeDetailsPanel.update(obj.result);
                    });
                    
                   
                },
                failure: function(response, opts){
                    console.log('server-side failure with status code ' + response.status);
                }
            })
        }
    
    
    /**
     * Ensure we have the table before we use it
     * @param {Object} tx
     */
    var ensureTableExists=function(tx){
        tx.executeSql('CREATE TABLE IF NOT EXISTS Favourite (id unique, reference, name,address,phone,rating,icon,vicinity)');
    }
 
    var addCurrentToFav = function(){
      addToFavorite(cachedDetails);
    }
    
    var removeCurrentFromFav = function(){
      removeFromFavorite(cachedDetails);
    }

    /**
     * Add current business data to favourite
     * @param {Object} data
     */
    var addToFavorite = function(data){
        var db = window.openDatabase("Favourites", "1.0", "Favourites", 20000000);
        
        db.transaction(function(tx){
            ensureTableExists(tx);
            var id = (data.id != null) ? ('"' + data.id + '"') : ('""');
			var reference = (data.reference != null) ? ('"' + data.reference + '"') : ('""');
            var name = (data.name != null) ? ('"' + data.name + '"') : ('""');
            var address = (data.formatted_address != null) ? ('"' + data.formatted_address + '"') : ('""');
            var phone = (data.formatted_phone_number != null) ? ('"' + data.formatted_phone_number + '"') : ('""');
            var rating = (data.rating != null) ? ('"' + data.rating + '"') : ('""');
            var icon = (data.icon != null) ? ('"' + data.icon + '"') : ('""');
            var vicinity = (data.vicinity != null) ? ('"' + data.vicinity + '"') : ('""');
            var insertStmt = 'INSERT INTO Favourite (id,reference, name,address,phone,rating,icon,vicinity) VALUES (' + id + ',' + reference+ ',' + name + ',' + address + ',' + phone + ',' + rating + ',' + icon + ',' + vicinity + ')';
            tx.executeSql(insertStmt);

        }, function(error){
            console.log("Data insert failed " + error.code + "   " + error.message);

        }, function(){
            console.log("Data insert successful");

        });
        
    }
    
    
    /**
     * Remove current business data from favourite
     * @param {Object} data
     */
    var removeFromFavorite = function(data){
        try {
            var db = window.openDatabase("Favourites", "1.0", "Favourites", 20000000);
            
            db.transaction(function(tx){
                ensureTableExists(tx);
                var deleteStmt = "DELETE FROM Favourite WHERE id = '" + data.id + "'";
                console.log(deleteStmt);
                tx.executeSql(deleteStmt);
                
            }, function(error){
                console.log("Data Delete failed " + error.code + "   " + error.message);
            }, function(){
                console.log("Data Delete successful");
            });
        } 
        catch (err) {
            console.log("Caught exception while deleting favourite " + data.name);
        }
        
    }
    
    /**
     *
     * @param {Object} reference
     * @return true if place is favourite else false
     */
    var isFav = function(data, callback){

        var db = window.openDatabase("Favourites", "1.0", "Favourites", 200000);

        try {
            db.transaction(function(tx){
                ensureTableExists(tx);
                
                var sql = "SELECT * FROM Favourite where id='" + data.id + "'";

                tx.executeSql(sql, [], function(tx, results){
                    var result = (results != null && results.rows != null && results.rows.length > 0);

                    callback(result);
                }, function(tx, error){
                    console.log("Got error in isFav error.code =" + error.code + " error.message = " + error.message);
                    callback(false);

                    
                      
                });
            });

        } 
        catch (err) {
            console.log("Got error in isFav " + err);
            callback(false);

            
        }
        
        
    }
        
    }
});


      
	
  