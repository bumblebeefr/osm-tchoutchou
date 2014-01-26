function TrainDataSource(options) {
	DataSource.call(this, options);
	this.trains = {};
	this.lastCirculationChecksum = null;
};
_.extend(TrainDataSource.prototype, DataSource.prototype);

// Create a simple object with all train informations from a geoson object
TrainDataSource.prototype.createTrain = function(mission) {
	var train = {};
	train.lng = mission.geometry.coordinates[0];
	train.lat = mission.geometry.coordinates[1];

	_.extend(train, mission.properties);
	
	// separateur brand - num en fonction de nu (est ce un nombre ou nom)
	var sep=(isNaN(mission.properties.num))?" ":" n°"
	train.txtInfoTrain=[mission.properties.brand,sep,mission.properties.num].join("") ;

	if (train.last_check=="") {
		train.type = "blue";
	} else if (train.retard < 0) {
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

	return train;
};

TrainDataSource.prototype.isVisible = function(train) {
	var filters = Filters.get();
	if (filters.tracking) {
		return true; // only one train tracked, always visible
	}
	var b = filters.bounds;
	if (train.lng > b._southWest.lng && train.lng < b._northEast.lng) {
		if (train.lat > b._southWest.lat && train.lat < b._northEast.lat) {
			// si filtre est une regexp
			if (filters.num_train && filters.num_train.length > 0) {
				var regexp = new RegExp(filters.num_train, "i");
				if (regexp.test(train.num)) {
					return true;
				}
			} else {
				// if(_.contains(filters.visible,train.train_type)){
				if (_.contains(filters.visible.split("/"), train.status)) {
					return true;
				}
				// }
			}
		}
	}
	return false;
};

// Called by the web worker before ajax request.
// - params : ajax request's parameters
// - filter : Current filters that can be used to construc request params
TrainDataSource.prototype.preProcess = function(params, filters) {
	_.extend(params, {
		zoom : filters.zoom,
		lat : filters.center.lat,
		lng : filters.center.lng
	});
	if (filters.tracking) {
		params['id_mission'] = filters.tracking;
	}
};

// Called by the webworker after having received data from the request
// - data : JSON decoded data from the ajax request to the datasource
// - params : Url parameters object send to the datasource
// - filters : Object containing filters used to get the data
// - checksum :
TrainDataSource.prototype.postProcess = function(data, params, filters, checksum) {
	var self = this;
	if (true || checksum != this.lastCirculationChecksum) {
		// FIXME des fois il faut
		// reparser le données meme
		// avec le meme md5 (Filtre
		// changés).
		this.lastCirculationChecksum = checksum;
		var missions = [];
		var trains = {};
		var stats = {
			ttl : 0
		};
		for ( var i = 0; i < data.features.length; i++) {
			var mission = self.createTrain(data.features[i]);
			if (!(mission.status in stats)) {
				// console.info("Nouveau type : ",mission.type);
				stats[mission.status] = 1;
			} else {
				stats[mission.status] += 1;
			}
			if (!(mission.type in stats)) {
				// console.info("Nouveau type : ",mission.type);
				stats[mission.type] = 1;
			} else {
				stats[mission.type] += 1;
			}
			stats['ttl'] += 1;

			if (stats['hour'] == null) {
				var dayStart = moment().startOf('day');
				var dayEnd = moment().endOf('day');
				var d = moment(mission.last_update);
				if (d.isBefore(dayEnd) && d.isAfter(dayStart)) {
					stats['hour'] = "Aujourd'hui à " + d.format("HH:mm:ss");
				} else {
					stats['hour'] = d.format('LLLL');
				}
			}

			if (self.isVisible(mission) || 'id_mission' in params) {
				missions.push(mission);
				trains[mission.id_mission] = true;
				delete (self.trains[mission.id_mission]);
			} else {
				delete (mission);
			}
		}
		var output = {};
		output['Stats'] = stats;
		output['Trains'] = {
			missions : missions,
			remove : self.trains,
		};
		delete (Trains);
		self.trains = trains;
		delete (stats);
		return output;
	} else {
		return null;
	}
};

// called by the scheduler when Filters hcange, in order to know if the
// modification of filters have impact on this datatSource.
TrainDataSource.prototype.isConcernedByFilterChanges = function(changedKeys) {
	return _.intersection(changedKeys, [ 'visible', 'num_train', 'bounds', 'tracking' ]).length > 0;
};
