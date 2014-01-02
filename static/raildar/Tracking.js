// Communication avec les workers
function WorkerMessage(cmd, parameter) {
	this.cmd = cmd;
	this.parameter = parameter;
}

var Tracking = {
	marker : null,
	running : 0, // Indicate running state of the tracking 0 : desactvated, 1 configration ,2 running
	started : false, // indicate if gps tracking is started
	latlng : null,
	id_mission : null,
	loadingMessage : bootbox.dialog({
		message : "Chargement ...",
		closeButton : false,
		show:false
	}),
	interval : null,
	worker : new Worker('./static/raildar/TrackingWorker.js'),
	init : function() {
		map.on('locationfound', Tracking.onLocationFound);
		map.on('locationerror', Tracking.onLocationError);
		
		//INTERVAL LOOP TO FORCE TRACKING REFRESH
		Tracking.interval = setInterval(function(){
			map.locate({
				maxZoom : 12,
				enableHighAccuracy : true,
				timeout : 500
			});
		},5000);
		map.locate({
			maxZoom : 12,
			enableHighAccuracy : true,
			timeout : 500,
			watch:true
		});
		
		Tracking.auto_userid = Tracking.username();
		
		// On lance le worker de tracking
		Tracking.worker.postMessage( new WorkerMessage('init', null) );
		Tracking.worker.addEventListener("message", function (event) {
			var infos = event.data.split("&");
			$("#tracking_info").html("<strong>Tracking : "+infos[0]+"</strong> relevés, dont "+infos[1]+" encore en cache.");
		});
		
	},
	username : function(){
		var username=getCookie("auto_userid");
		if (username!=null && username!="") { return username; }
		else
		{
			username=randomString(24);
			setCookie("auto_userid",username,365);
			return username;
		}
	}, 
	start : function() {
		Tracking.started = true;
		id_mission = null;
		$("#tracking_button").addClass("enabled");
		if(Tracking.latlng == null){
			if(Tracking.locationError != null){
				switch(Tracking.locationError.code) {
					case 1 : 
						alert('Vous devez autoriser la localisation de votre appareil, sinon le tracking ne peut fonctionner.');break;
					default:
						alert("Aucune localisation :  le gps est inactif ou pas encore fixé, le tracking ne peut être lancé.");break;
				}
			}else{
				alert("Aucune localisation :  le gps est inactif ou pas encore fixé, le tracking ne peut être lancé.");
			}
			Tracking.stop();
		}else{
			Tracking.onStartTracking();
		}
		$("#tracking_info").text('Démarrage du tracking...').show();
	},
	stop : function() {
		Tracking.running = 0;
		Tracking.started = false;
		Tracking.id_mission = null;
		$("#tracking_button").removeClass("enabled");
		map.stopLocate();
		Missions.redrawMarkers();
		$("#tracking_info").hide();
	},
	//Start sending fixes to the mspecified mission
	run : function(id_mission){
		if(id_mission != null && id_mission.length>0){
			Tracking.running = 2;
			Tracking.id_mission = id_mission;
			Missions.redrawMarkers();
			console.log('Start sending fixes for mission ',id_mission);
		}else{
			console.error("Unable to start tracking for this mission",id_mission);
			Tracking.stop();
		}
	},
	onStartTracking : function(){
		Tracking.running = 1;
		Tracking.askDeparture();
	},
	askDeparture : function(){
		Tracking.loadingMessage.show();

		var args = {url : 'gares', lat : Tracking.latlng.lat,lng:Tracking.latlng.lng};
		$.get("http://www.raildar.fr/json/convert",args,function(data){
			Tracking.loadingMessage.hide();
			console.log(data);
			
			
			if(!$.isArray(data.markers.marker) && $.isPlainObject(data.markers.marker)){
				data.markers.marker = [data.markers.marker];
			}

			var html = $("<fieldset />").css({
				"max-height" : ($(window).height()*8/10)+"px",
				"overflow" : "auto"
			}).render('tracking_gares',data);

			
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
			var args = {url : "next_missions", id_gare : id_gare};
			$.get("http://www.raildar.fr/json/convert",args,function(data){
				Tracking.loadingMessage.hide();
				console.log(data);
				
				if(!$.isArray(data.missions.mission) && $.isPlainObject(data.missions.mission)){
					data.missions.mission = [data.missions.mission];
				}
				
				var html = $("<fieldset />").css({
					"max-height" : ($(window).height()*8/10)+"px",
					"overflow" : "auto"
				}).render('tracking_gare_missions',data);
				
				bootbox.dialog({
					message : html,
					title : "Selectionner un train au départ",
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
								Tracking.run($("input[name='tracking_mission']:checked").val());
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
		var args = {lat : Tracking.latlng.lat,lng:Tracking.latlng.lng,dist:50};
		$.get("http://www.raildar.fr/xml/get_near_missions",args,function(data){
			Tracking.loadingMessage.hide();
			console.log(data);
			
			if(!$.isArray(data.missions.mission) && $.isPlainObject(data.missions.mission)){
				data.missions.mission = [data.missions.mission];
			}
			
			var html = $("<fieldset />").css({
				"max-height" : ($(window).height()*8/10)+"px",
				"overflow" : "auto"
			}).render('tracking_near_missions',data);
			
			bootbox.dialog({
				message : html,
				title : "Selectionner un train pres de vous",
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
							Tracking.run($("input[name='tracking_mission']:checked").val());
						}
					}
				}
			});
		}).error(function(){
			alert('Impossible de recuperer la liste des trains. Merci de re-essayer.');
			
		});
	},
	
	onLocationFound : function(e) {
		Tracking.locationError = null;
		if(Tracking.latlng == null || Tracking.latlng.lat != e.latlng.lat || Tracking.latlng.lng != e.latlng.lng){
			Tracking.latlng = e.latlng;
			
			console.info("Localisation : ",e.latlng);
			if(Tracking.marker != null){
				Tracking.marker.setLatLng(e.latlng).update();
			}else{
				Tracking.marker = L.marker(e.latlng).addTo(map);
			}
			
			if(Tracking.started ){
				if (Tracking.running == 2) {
					// /locator/gps_fix?auto_userid='+auto_userid+'&lat='+params[1]+'&lng='+params[2]+'&accur='+params[3]+'&alt='+params[4]+'&speed='+params[5]+'&heading='+params[6]+'&id_mission='+params[7]+'&timestamp='+params[8]
//					var data = {
//						lat : e.latlng.lat,
//						lng : e.latlng.lng,
//						accur : e.accuracy,
//						alt : e.altitude,
//						speed : e.speed,
//						heading : e.heading,
//						id_mission : Tracking.id_mission
//					};
					if(Tracking.id_mission != null){
						var epoch_now = Math.floor(new Date() / 1000);
						var worker_arguements = Tracking.auto_userid+'&'+e.latlng.lat+'&'+e.latlng.lng+'&'+ e.accuracy+'&'+e.altitude+'&'+e.speed+'&'+e.heading+'&'+Tracking.id_mission+'&'+epoch_now;
						Tracking.worker.postMessage( new WorkerMessage('fix', worker_arguements));
					}
					//console.log("GPS FIX", data);
					
					//$.get("/position.dummy?", data, function() {});
				}
			}
		}
	},
	onLocationError : function(e) {
		console.error("Erreur de la localisation",e);
		Tracking.locationError = e;
	}
};



