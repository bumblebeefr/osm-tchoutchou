var Tracking = {
	marker : null,
	running : 0, // Indicate running state of the tracking
	started : false, // indicate if gps tracking is started
	latlng : null,
	start : function() {
		Tracking.started = true;
		map.on('locationfound', Tracking.onLocationFound);
		map.on('locationerror', Tracking.onLocationError);
		map.locate({
			setView : true,
			maxZoom : 12,
			enableHighAccuracy : true,
			enableHighAccuracy : true,
			watch : true
		});
		$("#tracking_button").addClass("enabled");

	},
	stop : function() {
		Tracking.running = 0;
		Tracking.started = false;
		$("#tracking_button").removeClass("enabled");
		map.off('locationfound', Tracking.onLocationFound);
		map.off('locationerror', Tracking.onLocationError);
		map.stopLocate();
		if (Tracking.marker != null) {
			map.removeLayer(Tracking.marker);
		}
		Tracking.marker = null;
		Tracking.latlng = null;
	},
	onLocationFound : function(e) {
		if (Tracking.running == 0) {
			Tracking.running = 1;
			Tracking.marker = L.marker(e.latlng).addTo(map);
			console.log(e.latlng);
			var args = {lat : e.latlng.lat,lng:e.latlng.lng,dist:20};
			// ON demande a l'utilisateur de choisir son train et sa gare

			var tmpMessage = bootbox.dialog({
				message : "chargement ...",
				title : "Chargement des gares",
				closeButton : false
			});
			$.get("http://raildar.fr/xml/gares",args,function(data){
				bootbox.hideAll();
				delete(tmpMessage);
				console.log(data);
				
				var html = $("<fieldset />");
				var i=0;
				$(data).find("marker").each(function(){
					html.append("<label><input name='tracking_gare' type='radio' "+(i == 0 ? "checked='checked' ":"")+"/> "+$(this).attr("name")+"</label><br/>");
					i++;
				});
				
				bootbox.dialog({
					message : html,
					title : "Selectionner une gare",
					buttons : {
						cancel : {
							label : "Annuler",
							className : "btn-inverted",
							callback : function() {
								Tracking.stop();
							}
						},
						ok : {
							label : "Ok",
							className : "btn-danger",
							callback : function() {
								bootbox.alert('Not yet implemented !');
								Tracking.stop();
							}
						}
					}
				});
			});

		} else if (Tracking.running == 1) {
			// rien a faire on est en cours de parametrage
		} else if (Tracking.running == 2) {
			Tracking.running = true;
			Tracking.marker.setLatLng(e.latlng).update();
			// /locator/gps_fix?auto_userid='+auto_userid+'&lat='+params[1]+'&lng='+params[2]+'&accur='+params[3]+'&alt='+params[4]+'&speed='+params[5]+'&heading='+params[6]+'&id_mission='+params[7]+'&timestamp='+params[8]
			var data = {
				lat : e.latlng.lat,
				lng : e.latlng.lng,
				accur : e.accuracy,
				alt : e.altitude,
				speed : e.speed,
				heading : e.heading
			}
			console.log("GPS FIX", data);
			$.get("/position.dummy?", data, function() {
			});
		}
	},
	onLocationError : function(e) {
		if (Tracking.running == 0) {
			alert("Erreur de la localisation. Le GPS doit être actif pour pouvoir utiliser le tracking");
			Tracking.stop();
		}
	}
}