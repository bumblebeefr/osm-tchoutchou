var TrainsClass = function() {
	this.__proto__.constructor();
	this.trains = {};
	this.lastCirculationMD5 = null;
};
TrainsClass.prototype = new Scheduler();

/** Methodes de l'objet * */

// Create a simple object with all train informations from a geoson object
TrainsClass.prototype.createTrain = function(mission) {
	var train = {};
	train.lng = mission.geometry.coordinates[0];
	train.lat = mission.geometry.coordinates[1];

	_.extends(train, mission.properties);

	if (train.retard < 0) {
		train.type = "black";
	} else if (train.retard < 5) {
		train.type = "green";
	} else if (train.retard < 15) {
		train.type = "yellow";
	} else if (train.retard < 30) {
		train.type = "orange";
	} else {
		train.type = "red";
	}
	train.status = statuses[train.type];

	if (train.brand in train_types) {
		train.train_type = train_types[train.brand];
	} else {
		train.train_type = "unknown";
	}

	train.lib_pos_type = position_type[train.pos_type];
	train.human_last_check = (train.last_check) ? moment(train.last_check).format("LLL") : "Inconnue";
	var minutes = parseInt(train.minutes_to_next_gare);
	train.human_time_to_next_gare = moment.duration(minutes, "minutes").humanize();

};
// get the title of a train
TrainsClass.prototype.getTitle = function(train) {
	return train.brand + " n°" + train.num + " en direction de " + train.terminus;
};

// get HTML content to disaplay the popup of a train.
TrainsClass.prototype.getPopup = function(train) {
	return HandlebarsUtil.render('train_popup', train);
};

// check if this train is visible or not according to filters
TrainsClass.prototype.isVisible = function(train) {
	var b = TrainFilters.bounds;
	if (train.lng > b._southWest.lng && train.lng < b._northEast.lng) {
		if (train.lat > b._southWest.lat && train.lat < b._northEast.lat) {
			// si filtre est une regexp
			if (TrainFilters.num_train.length > 0) {
				var regexp = new RegExp(TrainFilters.num_train, "i");
				if (regexp.test(train.num)) {
					return true;
				}
			} else {
				if (_.contains(TrainFilters.visible, train.train_type)) {
					if (_.contains(TrainFilters.visible, train.status)) {
						return true;
					}
				}
			}
		}
	}
	return false;
};

// Update the angle of a
TrainsClass.prototype.updateAngle = function(train) {
	if (train.id_mission in Missions.markers) {
		var angle = (180 + parseInt(train.heading)) % 360;
		var marker = $(Missions.markers[train.id_mission]._icon.firstChild);
		marker.css({
			"transform" : "rotate(" + angle + "deg)",
			"display" : "block"
		});
	}
};

// Show, update hide a train marker
TrainsClass.prototype.drawMarker = function(train, forceUpdate) {
	if (train.id_mission in Missions.markers) {
		// update du marker visible
		if (forceUpdate) {
			Missions.markers[train.id_mission].setLatLng(L.latLng(train.lat, train.lng));
			Missions.markers[train.id_mission].setIcon(Missions.icons[train.type]);
			if (Missions.markers[train.id_mission].getPopup()) {
				Missions.markers[train.id_mission].setPopupContent(Train.getPopup(train));
			}
			Train.updateAngle(train);
			Missions.markers[train.id_mission].update();
		}
	} else {
		// ajout du marker si visible
		Missions.markers[train.id_mission] = L.marker(L.latLng(train.lat, train.lng), {
			icon : Missions.icons[train.type],
			title : Train.getTitle(train),
		}).addTo(map);
		Missions.markers[train.id_mission].on('mouseover', function() {
			$("#mission_detail").html(Train.getPopup(train)).show();
			$("#mission_detail_help").hide();
		}).on('mouseout', function() {
			$("#mission_detail").html("").hide();
			$("#mission_detail_help").show();
		}).on('click', function() {
			if (!Missions.markers[train.id_mission].getPopup()) {
				Missions.markers[train.id_mission].bindPopup(Train.getPopup(train)).openPopup();
			}
		}).on('popupclose', function() {
			Missions.markers[train.id_mission].unbindPopup();
		}).on('remove', function() {
			delete (train);
		});
		Train.updateAngle(train);
	}
};

// Called by the web worker before ajax request
// - params : ajax request's paramaeters
// some value when having kind of inheritance between Schedulable Objects.
// (see
// _.default)
TrainsClass.protoype.preProcess = function(params,filters) {
	_.extend(params,{
		zoom : filters.zoom,
		lat : filters.center.lat,
		lng : filters.center.lng
	});
};

// Called by the webworker after having received data from the request
// - data : JSON decoded data from the ajax request to the datasource
// some value when having kind of inheritance between Schedulable Objects.
// (see
// _.default)
TrainsClass.protoype.postProcess = function(data,filters) {
	var md5 = SparkMD5.hash(jqXHR.responseText);
	if(md5 != this.lastCirculationMD5 || filtersUpdated) {
		this.lastCirculationMD5 = md5;
		var missions = [];
		var trains = {};
		var stats = {ttl:0};
		for(var i = 0; i< data.features.length; i++){
			var mission = new Train(data.features[i]);
			
			if(!(mission.status in stats)){
				//console.info("Nouveau type : ",mission.type);
				stats[mission.status] = 1;
			}else{
				stats[mission.status]  += 1;
			}
			if(!(mission.type in stats)){
				//console.info("Nouveau type : ",mission.type);
				stats[mission.type] = 1;
			}else{
				stats[mission.type]  += 1;
			}
			stats['ttl']  += 1;
			
			if(Train.isVisible(mission,TrainFilters) || 'id_mission' in options.data){
				missions.push(mission);
				trains[mission.id_mission] = true;
				delete(Trains[mission.id_mission]);
			}else{
				delete(mission);
			}
		}
		var output = _.clone({
			missions : missions,
			remove : Trains,
			stats : stats
		});
		delete(Trains);
		Trains = trains;
		delete(stats);
		return output;
	}else{
		return null;
	}
};

// Called by the view to refresh or display the visualization of data.
// - data return from the worker, mainly managed by the postProcess()
// method.
// _.default)
TrainsClass.protoype.display = function(data,filters) {
	
};

// called by the scheduler when Filters hcange, in order to know if the
// modification of filters have impact on this datatSource.
TrainsClass.protoype.isConcernedByFilterChanges = function(newFilters, oldFilter) {
	logger.error('isConcernedByFilterChanges not implemented');
	return false;
};

var Trains = new TrainsClass();