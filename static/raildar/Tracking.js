var Tracking = {
	marker : null,
	running : 0, // Indicate running state of the tracking
	started : false, // indicate if gps tracking is started
	latlng : null,
	id_mission : null,
	loadingMessage : bootbox.dialog({
		message : "Chargement ...",
		closeButton : false,
		show:false
	}),
	init : function() {
		map.on('locationfound', Tracking.onLocationFound);
		map.on('locationerror', Tracking.onLocationError);
		map.locate({
			maxZoom : 12,
			enableHighAccuracy : true,
			enableHighAccuracy : true,
			watch : true
		});
	},
	start : function() {
		Tracking.started = true;
		id_mission = null;
		$("#tracking_button").addClass("enabled");
		if(Tracking.latlng == null){
			alert("Aucune localisation :  le gps est inactif ou pas encore fixé, le tracking ne peut être lancé.");
			Tracking.stop();
		}else{
			Tracking.onStartTracking();
		}
	},
	stop : function() {
		Tracking.running = 0;
		Tracking.started = false;
		$("#tracking_button").removeClass("enabled");
		map.stopLocate();
		Tracking.marker = null;
		Missions.redrawMarkers();
	},
	onStartTracking : function(){
		Tracking.running = 1;
		Tracking.askDeparture();
	},
	askDeparture : function(){
		Tracking.loadingMessage.show();

		var args = {lat : Tracking.latlng.lat,lng:Tracking.latlng.lng,dist:20};
		$.get("http://raildar.fr/xml/gares",args,function(data){
			Tracking.loadingMessage.hide();
			console.log(data);

			var html = $("<fieldset />").css({
				"max-height" : ($(window).height()*8/10)+"px",
				"overflow" : "auto"
			});
			var i=0;
			$(data).find("marker").each(function(){
				html.append("<label><input name='tracking_gare' type='radio' "+(i == 0 ? "checked='checked' ":"")+" value='"+$(this).attr("id_gare")+"'/> "+$(this).attr("name")+"</label><br/>");
				i++;
			});
			
			bootbox.dialog({
				message : html,
				title : "Selectionner une gare",
				closeButton : false,
				buttons : {
					cancel : {
						label : "Annuler",
						className : " btn-default",
						callback : function() {
							Tracking.stop();
						}
					},
					neighbor : {
						label : "Trains proches de ma position.",
						className : " btn-primary",
						callback : function() {
							alert('Pas encore implémenté');
							Tracking.askNeighborMission();
						}
					},
					ok : {
						label : "Ok",
						className : "btn-success",
						callback : function() {
							Tracking.askMissionNumber($("input[name='tracking_gare']:checked").val());
						}
					}
				}
			});
		}).error(function(){
			alert('Impossible de recuperer la liste des gares proches. Merci de re-essayer.');
			
		});;
	},
	askMissionNumber : function(id_gare){
		if(id_gare){
			Tracking.loadingMessage.show();
			console.log("Seaching mission",id_gare);
			var args = { id_gare : id_gare};
			$.get("http://www.raildar.fr/xml/next_missions",args,function(data){
				Tracking.loadingMessage.hide();
				console.log(data);
				
				var html = $("<fieldset />").css({
					"max-height" : ($(window).height()*8/10)+"px",
					"overflow" : "auto"
				});
				var i=0;
				$(data).find("mission").each(function(){
					html.append("<label><input name='tracking_mission' type='radio' "+(i == 0 ? "checked='checked' ":"")+" value='"+$(this).attr("id_mission")+"'/> "+$(this).attr("num_train")+" départ à"+$(this).attr('time_reel')+"</label><br/>");
					i++;
				});
				
				bootbox.dialog({
					message : html,
					title : "Selectionner un train",
					closeButton : false,
					buttons : {
						cancel : {
							label : "Annuler",
							className : " btn-default",
							callback : function() {
								Tracking.stop();
							}
						},
						ok : {
							label : "Ok",
							className : "btn-success",
							callback : function() {
								Tracking.id_mission = $("input[name='tracking_mission']:checked").val();
								Tracking.running = 2;
								Missions.redrawMarkers();
							}
						}
					}
				});
			}).error(function(){
				alert('Impossible de recuperer la liste des trains. Merci de re-essayer.');
				
			});
		}else{
			Tracking.stop()
		}
	},
	askNeighborMission : function(id_gare){
		Tracking.loadingMessage.show();
		console.log("Seaching mission",id_gare);
		var args = {lat : Tracking.latlng.lat,lng:Tracking.latlng.lng,dist:20};
		$.get("http://www.raildar.fr/xml/get_near_missions",args,function(data){
			Tracking.loadingMessage.hide();
			console.log(data);
			
			var html = $("<fieldset />").css({
				"max-height" : ($(window).height()*8/10)+"px",
				"overflow" : "auto"
			});
			var i=0;
			$(data).find("mission").each(function(){
				html.append("<label><input name='tracking_mission' type='radio' "+(i == 0 ? "checked='checked' ":"")+" value='"+$(this).attr("id_mission")+"'/> "+$(this).attr("num_train")+" départ à"+$(this).attr('time_reel')+"</label><br/>");
				i++;
			});
			
			bootbox.dialog({
				message : html,
				title : "Selectionner un train",
				closeButton : false,
				buttons : {
					cancel : {
						label : "Annuler",
						className : " btn-default",
						callback : function() {
							Tracking.stop();
						}
					},
					ok : {
						label : "Ok",
						className : "btn-success",
						callback : function() {
							Tracking.id_mission = $("input[name='tracking_mission']:checked").val();
							Tracking.running = 2;
							Missions.redrawMarkers();
						}
					}
				}
			});
		}).error(function(){
			alert('Impossible de recuperer la liste des trains. Merci de re-essayer.');
			
		});
	},
	
	onLocationFound : function(e) {
		Tracking.latlng = e.latlng;
		console.info("Localisation : ",e.latlng);
		if(Tracking.marker != null){
			Tracking.marker.setLatLng(e.latlng).update();
		}else{
			Tracking.marker = L.marker(e.latlng).addTo(map);
		}
		
		if(Tracking.started ){
			if (Tracking.running == 2) {
				Tracking.running = true;
				// /locator/gps_fix?auto_userid='+auto_userid+'&lat='+params[1]+'&lng='+params[2]+'&accur='+params[3]+'&alt='+params[4]+'&speed='+params[5]+'&heading='+params[6]+'&id_mission='+params[7]+'&timestamp='+params[8]
				var data = {
					lat : e.latlng.lat,
					lng : e.latlng.lng,
					accur : e.accuracy,
					alt : e.altitude,
					speed : e.speed,
					heading : e.heading
				};
				
				console.log("GPS FIX", data);
				
				//$.get("/position.dummy?", data, function() {});
			}
		}
	},
	onLocationError : function(e) {
		console.error("Erreur de la localisation");		
		if (Tracking.marker != null) {
			map.removeLayer(Tracking.marker);
		}
	}
};



