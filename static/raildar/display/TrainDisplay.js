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
			if (train.id_depart != train.id_next_gare && train.minutes_to_next_gare > 0) {
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
				TrainDisplay.markers[train.id_mission].setPopupContent(this.getPopup(train.id_mission));
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
					Trains.trigger("popup",TrainDisplay.getPopup(train.id_mission),train);
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
	}
	


};

// #######################  EVENEMENTS  ########################


//var brands = {};
Trains.on("add", function(mission_id, train, dataSourceName) {
//	if(! (train.brand in brands)){
//		brands[train.brand] = true;
//		console.log(brands);
//	}
	TrainDisplay.drawMarker(train, dataSourceName);
});

Trains.on("remove", function(id_mission, dataSourceName) {
	TrainDisplay.remove(id_mission, dataSourceName);
});

Trains.on("popup",function(popup,train){
	//affiche le trajet et les gares	
	var target=$(".showTrajet");
	var idMission=train.id_mission;			
	var trajet=new Trajet(Trains.missions[idMission]);
	DisplayManager.smallLoading(target, trajet);

});

// Autozoom, autopan
DisplayManager.on('showLayer', function(layerGroup, layerName) {
	if (layerGroup == 'trains') {
		trajetsLayerGroup.clearLayers();
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
		if (dataLayer.center && !map.getBounds().contains(L.latLng(dataLayer.center.lat, dataLayer.center.lng))) {
			console.debug("Recenter");
			map.panTo(dataLayer.center, {
				animate : false
			});
		}
	};
	

	
});

$(function(){
	//gère le click sur le train dans la popup -> affiche l'infoligne
	$("#map").on("click", ".infoLigne", function(event){
		var target=$(event.target);
		var idMission=target.attr("id").substr("infoLigne".length);			
		var infoLigne=new InfoLigne(Trains.missions[idMission]);
		DisplayManager.smallLoading(target.parent(), infoLigne);
	}); 
});