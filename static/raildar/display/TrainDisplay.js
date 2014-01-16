function TrainDisplay() {
	Display.call(this);
	_.extend(this, {
		markers : {},
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
		}
	});
};
_.extend(TrainDisplay.prototype ,Display.prototype);

// get the title of a train
TrainDisplay.prototype.getTitle = function(train) {
	return train.brand + " n°" + train.num + " en direction de " + train.terminus;
};

// get HTML content to disaplay the popup of a train.
TrainDisplay.prototype.getPopup = function(train) {
	return HandlebarsUtil.render('train_popup', train);
};

// Update the angle of a
TrainDisplay.prototype.updateAngle = function(train) {
	var self = this;
	if (train.id_mission in self.markers) {
		var angle = (180 + parseInt(train.heading)) % 360;
		var marker = $(self.markers[train.id_mission]._icon.firstChild);
		marker.css({
			"transform" : "rotate(" + angle + "deg)",
			"display" : "block"
		});
	}
};

// Show, update hide a train marker
TrainDisplay.prototype.drawMarker = function(train, forceUpdate) {
	var self = this;
	if (train.id_mission in self.markers) {
		// update du marker visible
		if (forceUpdate) {
			self.markers[train.id_mission].setLatLng(L.latLng(train.lat, train.lng));
			self.markers[train.id_mission].setIcon(selfs.icons[train.type]);
			if (self.markers[train.id_mission].getPopup()) {
				self.markers[train.id_mission].setPopupContent(this.getPopup(train));
			}
			this.updateAngle(train);
			self.markers[train.id_mission].update();
		}
	} else {
		// ajout du marker si visible
		self.markers[train.id_mission] = L.marker(L.latLng(train.lat, train.lng), {
			icon : self.icons[train.type],
			title : this.getTitle(train),
		}).addTo(map);
		self.markers[train.id_mission].on('mouseover', function() {
			$("#mission_detail").html(self.getPopup(train)).show();
			$("#mission_detail_help").hide();
		}).on('mouseout', function() {
			$("#mission_detail").html("").hide();
			$("#mission_detail_help").show();
		}).on('click', function() {
			if (!self.markers[train.id_mission].getPopup()) {
				self.markers[train.id_mission].bindPopup(self.getPopup(train)).openPopup();
			}
		}).on('popupclose', function() {
			self.markers[train.id_mission].unbindPopup();
		}).on('remove', function() {
			delete (train);
		});
		self.updateAngle(train);
	}
};


TrainDisplay.prototype.remove = function(id_mission) {
	var _self = this;
	if (id_mission in _self.markers) {
		map.removeLayer(_self.markers[id_mission]);
		delete (_self.markers[id_mission]);
	}
};

TrainDisplay.prototype.clean = function(remove) {
	var self = this;
	if (remove.length > 0) {
		console.log("removing " + remove.length + " missions");
	}
	for (id_mission in remove) {
		self.remove(id_mission);
	}
	delete (remove);
};

// Called by the disaplay manager to display data
TrainDisplay.prototype.display = function(data) {
	var self = this;
	// netoyage des mission terminées
	self.clean(data.remove);

	console.log("show",data);
	// affichage/maj des autres markers
	$.each(data.missions, function() {
		//try {
			self.drawMarker(this);
		//} catch (e) {
		//	console.error("Oups ya un probleme avec le point là ", this, e);
		//}
	});
};