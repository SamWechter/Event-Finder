<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<title>Sam Wechter's Event Finder</title>
	<link rel="stylesheet" type="text/css" href="styles.css"/>
	<link rel="stylesheet" type="text/css" href="proj3styles.css"/>
   <link href='../../css/styles.css' rel='stylesheet' type='text/css'>
	<script src="https://maps.googleapis.com/maps/api/js?v=3.exp&amp;sensor=false"></script>
	<script src="proj3script.js"></script>
</head>
<body>
<?php
	 include "../../includes/webdev_nav.php";
?>
    <h1>Project 3: Mashing maps and API's together</h1>
	 <p id="uriHolder"></p>
	 <div id="contentArea">
		  <div id="mapCanvas"></div>
		  <div id="controls">
				<input type="button" value="Load map" onclick="init()"/>
				<input type="button" value="Search for music events" onclick="buildMusicEventsQuery()"/>
				<input type="button" value="Search for social events" onclick="buildSocialEventsQuery()"/>
				<a href="proj3about.html">About this project</a>
		  </div>
		  <div id="eventsDiv">
				<p class="eventDiv">This is where search results will go.</p>
		  </div>
		  <div id="aboutDiv"></div>
	 </div>
</body>
</html>