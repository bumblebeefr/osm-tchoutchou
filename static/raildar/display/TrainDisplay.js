var TrainDisplay = {
	markers : {}, // FIXME, devrai etre séparé par datasour/layer
	icons : {
		green : L.divIcon({
			className : 'circle-icon circle-icon-green',
			iconSize : L.point(22, 22),
			html : '<div class="img">&nbsp;</div>'
		}),
		yellow : L.divIcon({
			className : 'circle-icon circle-icon-yellow',
			iconSize : L.point(22, 22),
			html : '<div class="img">&nbsp;</div>'
		}),
		orange : L.divIcon({
			className : 'circle-icon circle-icon-orange',
			iconSize : L.point(22, 22),
			html : '<div class="img">&nbsp;</div>'
		}),
		red : L.divIcon({
			className : 'circle-icon circle-icon-red',
			iconSize : L.point(22, 22),
			html : '<div class="img">&nbsp;</div>'
		}),
		black : L.divIcon({
			className : 'circle-icon circle-icon-black',
			iconSize : L.point(22, 22),
			html : '<div class="img">&nbsp;</div>'
		}),
		blue : L.divIcon({
			className : 'circle-icon circle-icon-blue',
			iconSize : L.point(22, 22),
			html : '<div class="img">&nbsp;</div>'
		})
	},
	getTitle : function(train) {
		return train.brand + " n°" + train.num + " en direction de " + train.terminus;
	},

	// get HTML content to disaplay the popup of a train.
	getPopup : function(id_mission) {
		return HandlebarsUtil.render('train_popup', Trains.missions[id_mission]);
	},

	// Update the angle of a
	updateAngle : function(train) {
		if (train.id_mission in TrainDisplay.markers) {
			if (train.id_depart != train.id_next_gare ){//}&& train.minutes_to_next_gare > 0) {
				var angle = (180 + parseInt(train.heading)) % 360;
				$(TrainDisplay.markers[train.id_mission]._icon).addClass("circle-arrow-icon");
				var marker = $(TrainDisplay.markers[train.id_mission]._icon.firstChild);
				marker.css({
					"transform" : "rotate(" + angle + "deg)",
					"display" : "block"
				});
			} else {
				$(TrainDisplay.markers[train.id_mission]._icon).removeClass("circle-arrow-icon");
			}
		}
	},

	// Show, update hide a train marker
	drawMarker : function(train, dataSourceName) {
		var mapLayer = DisplayManager.getDataLayerForDataSource("trains", dataSourceName).mapLayer;
		if (train.id_mission in TrainDisplay.markers) {
			// update du marker visible
			TrainDisplay.markers[train.id_mission].setLatLng(L.latLng(train.lat, train.lng));
			TrainDisplay.markers[train.id_mission].setIcon(TrainDisplay.icons[train.type]);
			if (TrainDisplay.markers[train.id_mission].getPopup()) {
				TrainDisplay.markers[train.id_mission].setPopupContent(this.getPopup(train.mission_id));
			}
			TrainDisplay.markers[train.id_mission].update();

		} else {
			// ajout du marker si visible
			TrainDisplay.markers[train.id_mission] = L.marker(L.latLng(train.lat, train.lng), {
				icon : TrainDisplay.icons[train.type],
				title : this.getTitle(train),
			}).addTo(mapLayer);
			TrainDisplay.markers[train.id_mission].on('mouseover', function() {
				$("#mission_detail").html(TrainDisplay.getPopup(train.id_mission)).show();
				$("#mission_detail_help").hide();
			}).on('mouseout', function() {
				$("#mission_detail").html("").hide();
				$("#mission_detail_help").show();
			}).on('click', function() {
				if (!TrainDisplay.markers[train.id_mission].getPopup()) {
					TrainDisplay.markers[train.id_mission].bindPopup(TrainDisplay.getPopup(train.id_mission)).openPopup();
				}
			}).on('popupclose', function() {
				TrainDisplay.markers[train.id_mission].unbindPopup();
			}).on('remove', function() {
				delete (train);
			});
		}
		TrainDisplay.updateAngle(train);
	},

	remove : function(id_mission, dataSourceName) {
		if (id_mission in TrainDisplay.markers) {
			DisplayManager.getDataLayerForDataSource("trains", dataSourceName).mapLayer.removeLayer(TrainDisplay.markers[id_mission]);
			delete (TrainDisplay.markers[id_mission]);
		}
	},
	
	showInfoLigne : function(idMission){
		//id=idMission.substr("mission".length)
		jQuery.ajax("http://www.raildar.fr/json/convert?url=get_mission",{
				async : true,
				cache : false,
				data : {"id_mission":idMission},	
				error : function(jqXHR,textStatus,errorThrown){
						if(console && console.error){
							console.error("Error when loading #jstchouchou data ",jqXHR);
						}
						bootbox.alert("Erreur de récupération des données de la mission ("+jqXHR.status+")", function() {});
				},
				success : function(data, textStatus, jqXHR){
					var mission=Trains.missions[idMission];
					data["txtInfoTrain"]=mission.brand+" - "+mission.num ;
					var nextGareAtteinte=false;
					
					
					$.each(data.arrets.arret,function(index,arret){
						//determine ou on en est dans le circuit
						arret["arret_depasse"]=true;
						if (! nextGareAtteinte && arret.id_gare== mission.id_next_gare){
							nextGareAtteinte=true;
							arret["is_next_gare"]=true;
							arret["human_time_to_gare"]="(dans "+mission.human_time_to_next_gare+")";								;
							arret["arret_depasse"]=false;
							arret["minutes_to_gare"]=mission.minutes_to_next_gare
						}
						if (nextGareAtteinte){
							arret["arret_depasse"]=false;
						}
						
													
						if (arret.minutes_retard<0){
							arret["classe_retard"]="arret_black";
						} else if (arret.minutes_retard<5){
							arret["classe_retard"]="arret_green"
						} else if (arret.minutes_retard<15){
							arret["classe_retard"]="arret_yellow"
						} else if (arret.minutes_retard<30){
							arret["classe_retard"]="arret_orange"
						} else {
							arret["classe_retard"]="arret_red"
						}
						
						if (arret["time_theorique"]){
							var retard=0;
							if (arret["minutes_retard"] && arret["minutes_retard"]>=0){
								retard=moment.duration(parseInt( arret["minutes_retard"]),"minutes");
							}
							arret["horaire"]=moment(arret["time_theorique"]).add(retard).format("HH:mm");		
							arret["horaireTheorique"]=moment(arret["time_theorique"]).format("HH:mm");		
						} else {
							arret["horaire"]="NC";
						}
					});
					
					bootbox.alert(HandlebarsUtil.render('mission',data), function() {});
				}
		});
		
	}
	

};

Trains.on("add", function(mission_id, train, dataSourceName) {
	TrainDisplay.drawMarker(train, dataSourceName);
});

Trains.on("remove", function(id_mission, dataSourceName) {
	TrainDisplay.remove(id_mission, dataSourceName);
});

// Autozoom, autopan
DisplayManager.on('showLayer', function(layerGroup, layerName) {
	if (layerGroup == 'trains') {
		var dataLayer = DisplayManager.dataLayers[layerGroup][layerName];
		var z = map.getZoom();
		console.debug("Checkin zoom (current,min,max)", z, dataLayer.minZoom, dataLayer.maxZoom);
		if (dataLayer.minZoom && dataLayer.minZoom > z) {
			console.debug("Zooming to minZoom ", dataLayer.minZoom);
			if (dataLayer.center) {
				map.setView(dataLayer.center, dataLayer.minZoom, {
					animate : false
				});
			} else {
				map.setZoom(dataLayer.minZoom);
			}
		}
		if (dataLayer.maxZoom && dataLayer.maxZoom < z) {
			console.debug("Zooming to maxZoom ", dataLayer.maxZoom);
			if (dataLayer.center) {
				map.setView(dataLayer.center, dataLayer.maxZoom, {
					animate : false
				});
			} else {
				map.setZoom(dataLayer.maxZoom);
			}
		}
		console.log(dataLayer.center);
		if (dataLayer.center && !map.getBounds().contains(L.latLng(dataLayer.center.lat, dataLayer.center.lng))) {
			console.debug("Recenter");
			map.panTo(dataLayer.center, {
				animate : false
			});
		}
		console.debug("Checkin zoom (current,min,max)", z, dataLayer.minZoom, dataLayer.maxZoom);
	}
	;
});