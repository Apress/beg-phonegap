var mapdata = { destination: new google.maps.LatLng(59.3327881, 18.064488100000062) };

// Start page
$('#page-home').live("pagecreate", function() {
	$('#map_square').gmap(
	        { 'center' : mapdata.destination, 
	          'zoom' : 12, 
	          'mapTypeControl' : false, 
	          'navigationControl' : false,
	          'streetViewControl' : false, 
	          'callback' : function(map) {
	              $('#map_square').gmap('addMarker', 
	                  { 'position' : map.getCenter(), 
	                    'animation' : google.maps.Animation.DROP
	                   });
	         }
	    });
	
    $('#map_square').click( function() { 
        $.mobile.changePage('#page-map', 'slide');
    });
});

//Create the fullscreen map, request display of directions
var toggleval = true; // used for test case: static locations
$('.refresh').live("click", function() {
    $('#map_canvas').gmap({
        'callback' : function(map) {
            // START: Tracking location with device geolocation
/*            if ( navigator.geolocation ) { 
                navigator.geolocation.getCurrentPosition ( 
                    function(position) {
                        $('#map_canvas').gmap('displayDirections', 
                        { 'origin' : new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
                          'destination' : mapdata.destination, 'travelMode' : google.maps.DirectionsTravelMode.DRIVING},
                        { 'panel' : document.getElementById('dir_panel')},
                              function (success, result) {
                                  if (success) {
                                      var center = result.routes[0].bounds.getCenter();
                                      $('#map_canvas').gmap('option', 'center', center);
                                      $($('#map_canvas').gmap('getMap')).triggerEvent('resize');
                                  } else {
                                    alert('Unable to get route');
                                  }
                              }
                           );         
                    }, 
                    function(){ 
                        alert('Unable to get location');
                        $.mobile.changePage('#page-home', 'slide'); 
                    }); 
                }            
*/            // END: Tracking location with device geolocation

            // START: Tracking location with test lat/long coordinates
            // Toggle between two origins to test refresh, force new route to be calculated
            var position = {};
            if (toggleval) {
                toggleval = false;
                position = { coords: { latitude: 57.6969943, longitude: 11.9865 } }; // Gothenburg
            } else {
                toggleval = true;
                position = { coords: { latitude: 58.5365967, longitude: 15.0373319 } }; // Motala
            }
            $('#map_canvas').gmap('displayDirections', 
                { 'origin' : new google.maps.LatLng(position.coords.latitude, position.coords.longitude), 
                  'destination' : mapdata.destination, 
                  'travelMode' : google.maps.DirectionsTravelMode.DRIVING},
                  { 'panel' : document.getElementById('dir_panel')},
                  function (success, result) {
                      if (success) {
                          var center = result.routes[0].bounds.getCenter();
                          $('#map_canvas').gmap('option', 'center', center);
                          $($('#map_canvas').gmap('getMap')).triggerEvent('resize');
                      } else {
                          alert('Unable to get route');
                      }
                  });
            // END: Tracking location with test lat/long coordinates
        }
    });
    return false;
});

// Map page
$('#page-map').live("pagecreate", function() {
    $('.refresh').trigger('click');
});

// Go to map page to see instruction detail (zoom) on map page
$('#dir_panel').live("click", function() {
    $.mobile.changePage('#page-map', 'slide');
});

// Briefly show hint on using instruction tap/zoom
$('#page-dir').live("pageshow", function() {
    $("<div class='ui-loader ui-overlay-shadow ui-body-e ui-corner-all'><h1>"
            + "Tap any instruction" + "<br>" + "to see details on map" +"</h1></div>")
    .css({ "display": "block", "opacity": 0.9, "top": $(window).scrollTop() + 100 })
    .appendTo( $.mobile.pageContainer )
    .delay( 1400 )
    .fadeOut( 700, function(){
        $(this).remove();
   });
});

