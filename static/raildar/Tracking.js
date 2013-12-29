var Tracking = {
		marker : null,
		running :false, //Indicate if staking is started by the user
		started : false, //indicate if gps tracking is started
		start : function(){
			Tracking.started = true;
			map.on('locationfound', Tracking.onLocationFound);
			map.on('locationerror', Tracking.onLocationError);
			map.locate({setView: true, maxZoom: 12,enableHighAccuracy:true,enableHighAccuracy:true,watch:true});
			$("#tracking_button").addClass("enabled");
			
		},
		stop : function(){
			Tracking.running = false;
			Tracking.started = false;
			$("#tracking_button").removeClass("enabled");
			map.off('locationfound', Tracking.onLocationFound);
			map.off('locationerror', Tracking.onLocationError);
			map.stopLocate();
			if(Tracking.marker != null){
				map.removeLayer(Tracking.marker);
			}
			Tracking.marker = null;
		},
 		onLocationFound : function(e) {
			Tracking.running = true;
			if(Tracking.marker == null){
				Tracking.marker = L.marker(e.latlng).addTo(map);
			}else{
				Tracking.marker.setLatLng(e.latlng).update();
			}
			///locator/gps_fix?auto_userid='+auto_userid+'&lat='+params[1]+'&lng='+params[2]+'&accur='+params[3]+'&alt='+params[4]+'&speed='+params[5]+'&heading='+params[6]+'&id_mission='+params[7]+'&timestamp='+params[8]
			var data = {
					lat : e.latlng.lat,
					lng : e.latlng.lng,
					accur : e.accuracy,
					alt : e.altitude,
					speed : e.speed,
					heading : e.heading
			}
			console.log("GPS FIX",data);
			$.get("/position.dummy?",data,function(){});
 		},
 		onLocationError : function(e) {
 			if(!Tracking.running){
 				alert("Erreur de la localisation. Le GPS doit être actif pour pouvoir utiliser le tracking");
 				Tracking.stop();
 			}
		}
}