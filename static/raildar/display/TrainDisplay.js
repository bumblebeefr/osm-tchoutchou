var TrainDisplay = {
	markers : {}, // FIXME, devrai etre séparé par datasour/layer
	icons : {
		green : L.divIcon({
			className : 'circle-icon circle-icon-green',
			iconSize : L.point(22, 22),
			html : '<img src="./static/images/fleche_green.png" />'
		}),
		yellow : L.divIcon({
			className : 'circle-icon circle-icon-yellow',
			iconSize : L.point(22, 22),
			html : '<img src="./static/images/fleche_yellow.png" />'
		}),
		orange : L.divIcon({
			className : 'circle-icon circle-icon-orange',
			iconSize : L.point(22, 22),
			html : '<img src="./static/images/fleche_orange.png" />'
		}),
		red : L.divIcon({
			className : 'circle-icon circle-icon-red',
			iconSize : L.point(22, 22),
			html : '<img src="./static/images/fleche_red.png" />'
		}),
		black : L.divIcon({
			className : 'circle-icon circle-icon-black',
			iconSize : L.point(22, 22),
			html : '<img src="./static/images/fleche_black.png" />'
		})
	},
	getTitle : function(train) {
		return train.brand + " n°" + train.num + " en direction de " + train.terminus;
	},

	// get HTML content to disaplay the popup of a train.
	getPopup : function(train) {
		return HandlebarsUtil.render('train_popup', train);
	},

	// Update the angle of a
	updateAngle : function(train) {
		if (train.id_mission in TrainDisplay.markers) {
			var angle = (180 + parseInt(train.heading)) % 360;
			var marker = $(TrainDisplay.markers[train.id_mission]._icon.firstChild);
			marker.css({
				"transform" : "rotate(" + angle + "deg)",
				"display" : "block"
			});
		}
	},

	// Show, update hide a train marker
	drawMarker : function(train, dataSourceName, forceUpdate) {
		var mapLayer = DisplayManager.getDataLayerForDataSource("trains",dataSourceName).mapLayer;
		if (train.id_mission in TrainDisplay.markers) {
			// update du marker visible
			if (forceUpdate) {
				TrainDisplay.markers[train.id_mission].setLatLng(L.latLng(train.lat, train.lng));
				TrainDisplay.markers[train.id_mission].setIcon(TrainDisplays.icons[train.type]);
				if (TrainDisplay.markers[train.id_mission].getPopup()) {
					TrainDisplay.markers[train.id_mission].setPopupContent(this.getPopup(train));
				}
				this.updateAngle(train);
				TrainDisplay.markers[train.id_mission].update();
			}
		} else {
			// ajout du marker si visible
			TrainDisplay.markers[train.id_mission] = L.marker(L.latLng(train.lat, train.lng), {
				icon : TrainDisplay.icons[train.type],
				title : this.getTitle(train),
			}).addTo(mapLayer);
			TrainDisplay.markers[train.id_mission].on('mouseover', function() {
				$("#mission_detail").html(TrainDisplay.getPopup(train)).show();
				$("#mission_detail_help").hide();
			}).on('mouseout', function() {
				$("#mission_detail").html("").hide();
				$("#mission_detail_help").show();
			}).on('click', function() {
				if (!TrainDisplay.markers[train.id_mission].getPopup()) {
					TrainDisplay.markers[train.id_mission].bindPopup(TrainDisplay.getPopup(train)).openPopup();
				}
			}).on('popupclose', function() {
				TrainDisplay.markers[train.id_mission].unbindPopup();
			}).on('remove', function() {
				delete (train);
			});
			TrainDisplay.updateAngle(train);
		}
		TrainDisplay.markers[train.id_mission].mission = train;
		TrainDisplay.markers[train.id_mission].dataSource = dataSourceName;
	},

	remove : function(id_mission,dataSourceName) {
		if (id_mission in TrainDisplay.markers) {
			DisplayManager.getDataLayerForDataSource("trains",dataSourceName).mapLayer.removeLayer(TrainDisplay.markers[id_mission]);
			delete (TrainDisplay.markers[id_mission]);
		}
	},


};

Trains.on("add", function(mission_id, train, dataSourceName) {
	TrainDisplay.drawMarker(train, dataSourceName);
});

Trains.on("remove", function(id_mission, dataSourceName) {
	TrainDisplay.remove(id_mission,dataSourceName);
});

//Autozoom, autopan
DisplayManager.on('showLayer', function(layerGroup,layerName) {
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
				map.setView(dataLayer.cedataLayerSource.maxZoom, {
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
	};
});