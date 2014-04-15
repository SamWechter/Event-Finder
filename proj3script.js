//This is the container for my google map object
var map;

//This is my lastFM API key from a throwaway account for this specific project and should NOT be stored here ideally
var lastFMAPIKey = "b26e843b370e599dd936a01b8e7735b4";

//This is my Eventful API key from a throwaway account for this specific project and also should not go here normally
var eventfulAPIKey = "spwxHjTsPRbtfW7Q";

//This is the URI of the PHP proxy script that professor Jeffrey Sonstein provided for this project
var proxyURI = "proj3proxy.php?url=";

function init() {
	 var mapOptions = {
		  zoom: 13,
		  mapTypeId: google.maps.MapTypeId.ROADMAP
	 };
	 // Creates a new map and places it in mapCanvas
	 map = new google.maps.Map( document.getElementById( 'mapCanvas' ), mapOptions );
	 // Checks if geolocation is enabled and then places a marker and centers the map at the user's location
	 if( navigator.geolocation ) {
		  navigator.geolocation.getCurrentPosition( function( position ) {
				var pos = new google.maps.LatLng(
						  position.coords.latitude,
						  position.coords.longitude );
				var newInfoWindowDesc = '<p>latitude: ' + position.coords.latitude + "<br/>longitude: " + position.coords.longitude +"</p>";
				//createInfoWindow( position.coords.latitude, position.coords.longitude, newInfoWindowDesc);
				map.setCenter( pos );
				createMarker( position.coords.latitude, position.coords.longitude );
		  }, function() {
				handleNoGeolocation( true );
		  } );
	 } else {
		  // Geolocation not supported
		  handleNoGeolocation( false );
	 }
}
// Creates an InfoWindow on the map that states the geoLocation-related error that occurred
function handleNoGeolocation( errorFlag ) {
	 if( errorFlag ) {
		  var errorText = 'Error: Geolocation service has failed.';
	 } else {
		  var errorText = 'Error: Your browser doesn\'t support Geolocation.';
	 }
	 var options = {
		  map: map,
		  position: new google.maps.LatLng( 43.1547, 77.6158 ),
		  content: errorText
	 };
	 var infoWindow = new google.maps.InfoWindow( options );
	 map.setCenter( options.position );
}
// Creates a marker then returns it
function createMarker( aLat, aLong ) {
	 var markerLat = aLat;
	 var markerLong = aLong;
	 var markerPos = new google.maps.LatLng(
						  markerLat,
						  markerLong );
	 var newMarker = new google.maps.Marker( {
					 position: markerPos,
					 map: map
				} );
	 return newMarker;
}
// Creates an InfoWindow at the specified latitude and longitude and places a block of text in it
function createInfoWindow( bLat, bLong, bDesc ) {
	 var infoWindowLat = bLat;
	 var infoWindowLong = bLong;
	 var infoWindowDesc = bDesc;
	 var infoWindowPos = new google.maps.LatLng(
						  infoWindowLat,
						  infoWindowLong );
	 var infoWindow = new google.maps.InfoWindow( {
		  map: map,
		  position: infoWindowPos,
		  content: infoWindowDesc 
	 } );
}
// Builds a LastFM query to retrieve upcoming local music events
function buildMusicEventsQuery() {
	 if( navigator.geolocation ) {
		  navigator.geolocation.getCurrentPosition( function( position ) {
				var myGeoLat = position.coords.latitude;
				var myGeoLong = position.coords.longitude;
				var lastFMQueryURI = "http://ws.audioscrobbler.com/2.0/?method=geo.getevents&lat=" + 
						  myGeoLat + "&long=" + myGeoLong + "&limit=20" + "&api_key=" + lastFMAPIKey;
				// The URI must be encoded for so the proxy will understand it
				var encodedLastFMQueryURI = encodeURIComponent( lastFMQueryURI );
				var completedMusicURI = proxyURI + encodedLastFMQueryURI;
				
				// The line below is only used for proxy testing
				// document.getElementById('uriHolder').appendChild( document.createTextNode( completedMusicURI ) );
				
				loadSomething( completedMusicURI, "lastFM" );
		  }, function() {
				alert( "Geolocation music search failed." );
		  } );
	 } else {
		  // Geolocation not supported
		  alert( "Geolocation is not supported by your browswer." );
	 }
}
// Builds an Eventful query to retrieve upcoming local events
function buildSocialEventsQuery() {
	 if( navigator.geolocation ) {
		  navigator.geolocation.getCurrentPosition( function( position ) {
				var myGeoLat = position.coords.latitude;
				var myGeoLong = position.coords.longitude;
				var eventfulQueryURI = "http://api.eventful.com/rest/events/search?app_key=" +
					 eventfulAPIKey + "&where=" + myGeoLat + "," + myGeoLong + "&within=25";
				// The URI must be encoded for so the proxy will understand it
				var encodedEventfulQueryURI = encodeURIComponent( eventfulQueryURI );
				var completedEventfulURI = proxyURI + encodedEventfulQueryURI;
				
				// The line below is only used for proxy testing
				// document.getElementById('uriHolder').appendChild( document.createTextNode( completedEventfulURI ) );
				
				loadSomething( completedEventfulURI, "eventful" );
		  }, function() {
				alert( "Geolocation event search failed." );
		  } );
	 } else {
		  // Geolocation not supported
		  alert( "Geolocation is not supported by your browswer." );
	 }
}
// Sends a request based on the passed URI string and passes along the request type to doneLoading()
function loadSomething( aUriString, requestType ) {
	 var newRequest = null;
	 if ( window.XMLHttpRequest ) {
		  newRequest = new XMLHttpRequest();
	 }
	 else if ( window.ActiveXObject ) {
		  newRequest = new ActiveXObject( "Microsoft.XMLHTTP" );
	 }
	 if ( newRequest != null ) {
		  newRequest.onreadystatechange = function() {
			  doneLoading( newRequest, requestType );
		  }
		  newRequest.open( "GET", aUriString, true );
		  newRequest.send( "" );
	 }
	 else {
		  alert("Request error!");
	 }
}
// Handles a successful request by giving the result and type of request to parseXMLResult()
function doneLoading( aRequest, aRequestType ) {
	 if ( aRequest.readyState == 4 ) {
		  if ( aRequest.status == 200) {
				if( aRequestType == "lastFM" ) {
					 //parseMusicXML( aRequest );
					 parseXMLResult( aRequest, aRequestType );
				}
				if( aRequestType == "eventful" ) {
					 //parseSocialXML( aRequest );
					 parseXMLResult( aRequest, aRequestType );
				}
		  }
	 }
}
// Parses the responseXML from the query and then places its information in divs and appends those to eventsDiv
function parseXMLResult( whatXMLResponse, whatRequestType ) {
	 // Both LastFM and Eventful use the tag names 'events' and 'event'
	 var eventXML = whatXMLResponse.responseXML.getElementsByTagName( 'events' )[ 0 ].getElementsByTagName( 'event' );
	 // Finds eventsDiv and empties it
	 var targetDiv = document.getElementById('eventsDiv');
	 removeChildren( targetDiv );
	 // Loops through all <event> elements in <events>
	 for( var i=0; i<eventXML.length; i++ ) {
		  var newLi = document.createElement( 'li' );
		  var newDiv = document.createElement( 'div' );
		  // Pulls information from the LastFM responseXML
		  // This differs from the Eventful parsing in that it also gets an image of the event headliner
		  if( whatRequestType == "lastFM" ) {
				var tmpTitleText = eventXML[i].getElementsByTagName( 'title' )[0].childNodes[0].nodeValue;
				var tmpVenueText = eventXML[i].getElementsByTagName( 'venue' )[0].getElementsByTagName( 'name' )[0].childNodes[0].nodeValue;
				var tmpEventStartText = eventXML[i].getElementsByTagName( 'startDate' )[0].childNodes[0].nodeValue;
				//var tmpEventDescText = "No description available.";
				// The street address is not always available in LastFM's responseXML
				if ( eventXML[i].getElementsByTagName( 'venue' )[0].getElementsByTagName( 'location' )[0].getElementsByTagName( 'street' )[0].childNodes[0] ) {
					 var tmpVenueAddressString = eventXML[i].getElementsByTagName( 'venue' )[0].getElementsByTagName( 'location' )[0].getElementsByTagName( 'street' )[0].childNodes[0].nodeValue;
				} else {
					 var tmpVenueAddressString = "Street address unavailable.";
				}
				var tmpVenueLocStem = eventXML[i].getElementsByTagName( 'venue' )[0].getElementsByTagName( 'location' )[0].childNodes[9];
				var tmpVenueLat = tmpVenueLocStem.childNodes[1].firstChild.nodeValue;
				var tmpVenueLong = tmpVenueLocStem.childNodes[3].firstChild.nodeValue;
				var tmpAnchorURI = eventXML[i].getElementsByTagName( 'url' )[1].childNodes[0].nodeValue;
				var tmpAnchorText = "Check it out on LastFM";
				
				var tmpImgUri;
				var tmpImgArray = eventXML[i].getElementsByTagName( 'image' );
				for( var f=0; f < tmpImgArray.length; f++ ) {
					 var currentImg = tmpImgArray[f];
					 var currentImgType = currentImg.getAttribute( 'size' );
					 if(( currentImgType == "extralarge" ) && ( currentImg.childNodes[0] )) {
						  //alert(currentImg.childNodes[0].nodeValue);
						  tmpImgUri = currentImg.childNodes[0].nodeValue;
					 }
				}
				var tmpImg = document.createElement( 'img' );
				tmpImg.setAttribute('src', tmpImgUri);
				newDiv.appendChild(tmpImg);
		  }
		  // Pulls information from the Eventful responseXML
		  // This differs from the LastFM parsing in that it gets the event's description and
		  //		also gets information from multiple elements to get the event venue's street address
		  else if( whatRequestType == "eventful" ) {
				var tmpTitleText = eventXML[i].getElementsByTagName( 'title' )[0].childNodes[0].nodeValue;
				var tmpVenueText = eventXML[i].getElementsByTagName( 'venue_name' )[0].childNodes[0].nodeValue;
				var tmpEventStartText = eventXML[i].getElementsByTagName( 'start_time' )[0].childNodes[0].nodeValue;
				if( (eventXML[i].getElementsByTagName( 'venue_address' )[0].childNodes[0])
					&& (eventXML[i].getElementsByTagName( 'city_name' )[0].childNodes[0])
					&& (eventXML[i].getElementsByTagName( 'region_name' )[0].childNodes[0]) ) {
						  var tmpVenueAddressString = eventXML[i].getElementsByTagName( 'venue_address' )[0].childNodes[0].nodeValue + ", " +
																	 eventXML[i].getElementsByTagName( 'city_name' )[0].childNodes[0].nodeValue + ", " +
																	 eventXML[i].getElementsByTagName( 'region_name' )[0].childNodes[0].nodeValue;
				}
				if( eventXML[i].getElementsByTagName( 'description' )[0].childNodes[0] ) {
					 var tmpEventDescText = eventXML[i].getElementsByTagName( 'description' )[0].childNodes[0].nodeValue.replace(/(<([^>]+)>)/ig,"");;
					 tmpEventDescText = tmpEventDescText.replace( new RegExp("<br>", "g"), "" );
					 var tmpEventDesc = document.createElement( 'div' );
					 tmpEventDesc.appendChild( document.createTextNode( tmpEventDescText ) );
					 newDiv.setAttribute( "eventDesc", tmpEventDescText );
				}
				var tmpVenueLat = eventXML[i].getElementsByTagName( 'latitude' )[0].childNodes[0].nodeValue;
				var tmpVenueLong = eventXML[i].getElementsByTagName( 'longitude' )[0].childNodes[0].nodeValue;
				var tmpAnchorURI = eventXML[i].getElementsByTagName( 'url' )[0].childNodes[0].nodeValue;
				var tmpAnchorText = "Check it out on Eventful";
				
		  }
		  else {
				alert( "An unknown error has occurred. Please try again later." );
		  }
		  
		  var tmpEventTitle = document.createElement( 'div' );
		  tmpEventTitle.appendChild( document.createTextNode( tmpTitleText ) );
		  tmpEventTitle.setAttribute( "class", "eventTitle" );
		  newDiv.setAttribute( "headliner", tmpTitleText );
		  
		  var tmpEventVenue = document.createElement( 'div' );
		  tmpEventVenue.appendChild( document.createTextNode( tmpVenueText ) );
		  tmpEventVenue.setAttribute( "class", "eventVenue" );
		  newDiv.setAttribute( "venue", tmpVenueText );
		  
		  var tmpEventStartDate = document.createElement( 'div' );
		  tmpEventStartDate.appendChild( document.createTextNode( tmpEventStartText ) );
		  newDiv.setAttribute( "startDateTime", tmpEventStartText );
		  
		  var tmpVenueAddress = document.createElement( 'div' );
		  tmpVenueAddress.appendChild( document.createTextNode( tmpVenueAddressString ) );
		  newDiv.setAttribute( "venueAddress", tmpVenueAddressString );
		  
		  var tmpAnchor = document.createElement( 'a' );
		  tmpAnchor.setAttribute( "href", tmpAnchorURI );
		  tmpAnchor.appendChild( document.createTextNode( tmpAnchorText ) );
		  
		  var tmpButton = document.createElement( 'input' );
		  tmpButton.setAttribute( "type", "button");
		  tmpButton.setAttribute( "value", "Display event on map" );
		  tmpButton.setAttribute( "onclick", "displayVenue(event)" );
		  tmpButton.style.float = "right";
		  tmpButton.style.marginLeft = "2em";
		  
		  newDiv.setAttribute( "geoLatData", tmpVenueLat );
		  newDiv.setAttribute( "geoLongData", tmpVenueLong );
		  
		  // Adds the newly-created elements to newDiv
		  newDiv.appendChild(tmpEventTitle);
		  newDiv.appendChild(tmpEventVenue);
		  newDiv.appendChild(tmpVenueAddress);
		  newDiv.appendChild(tmpEventStartDate);
		  if(tmpEventDesc) {
				newDiv.appendChild(tmpEventDesc);
		  }
		  newDiv.appendChild(tmpAnchor);
		  newDiv.appendChild(tmpButton);
		  
		  newDiv.setAttribute( "class", "eventDiv" );
		  // newDiv floats left so multiple music events can be shown on the same line
		  newDiv.style.float = "left";
		  
		  targetDiv.appendChild(newDiv);
	 }
}
// Removes all children from the specified container
function removeChildren( aContainer ) {
	 while( aContainer.hasChildNodes() ) {
		  aContainer.removeChild( aContainer.firstChild );
	 }
 }
// Places a Marker at an event's venue and adds a click event listener to it
//			When the Marker is clicked, an InfoWindow opens with information about the event
function displayVenue(e) {
	 var targetDiv = e.target.parentNode;
	 var tmpLat = targetDiv.getAttribute( 'geoLatData' );
	 var tmpLong = targetDiv.getAttribute( 'geoLongData' );
	 var myMarker = createMarker( tmpLat, tmpLong );
	 
	 var tmpHeadliner = targetDiv.getAttribute( 'headliner' );
	 var tmpVenue = targetDiv.getAttribute( 'venue' );
	 var tmpVenueAddress = targetDiv.getAttribute( 'venueAddress' );
	 var tmpStartDateTime = targetDiv.getAttribute( 'startDateTime' );
	 
	 var tmpInfoWindowText = "<strong>" + tmpHeadliner + "</strong><br/>" + tmpVenue + "<br/>" + tmpVenueAddress +
										  "<br/>" + tmpStartDateTime;
	 createInfoWindow( tmpLat, tmpLong, tmpInfoWindowText );
	 
	 google.maps.event.addListener(myMarker, 'click', function() {
		  // Converts the result of getPosition() to an array then splits it into strings
		  var markerLatLng = myMarker.getPosition().toUrlValue(5);
		  var tmpLocArray = markerLatLng.split(",");
		  var markerLat = tmpLocArray[0];
		  var markerLong = tmpLocArray[1];
		  //alert("Lat is " + markerLat + " and Long is " + markerLong);
		  createInfoWindow( markerLat, markerLong, tmpInfoWindowText );
	});
}
google.maps.event.addDomListener(window, 'load', init);