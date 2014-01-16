function TrainDataSource(options) {
	DataSource.call(this,options);
	this.trains = {};
	this.lastCirculationChecksum = null;
};
_.extend(TrainDataSource.prototype,DataSource.prototype);

// Create a simple object with all train informations from a geoson object
TrainDataSource.prototype.createTrain = function(mission) {
	var train = {};
	train.lng = mission.geometry.coordinates[0];
	train.lat = mission.geometry.coordinates[1];

	_.extend(train, mission.properties);

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
	
	return train;
};

TrainDataSource.prototype.isVisible = function(train){
	//FIXME
	return true;
	var filters = Filters.get();
	var b = filters.bounds;
	if(train.lng > b._southWest.lng && train.lng < b._northEast.lng){
		if(train.lat > b._southWest.lat && train.lat < b._northEast.lat){
			//si filtre est une regexp
			if(filters.num_train.length >0){
				var regexp=new RegExp(filters.num_train,"i");
				if( regexp.test(train.num)){
					return true;
				}
			} else {
				if(_.contains(filters.visible,train.train_type)){
					if(_.contains(filters.visible,train.status)){
						return true;
					}
				}
			}
		}
	}
	return false;
};

// Called by the web worker before ajax request
// - params : ajax request's paramaeters
// some value when having kind of inheritance between Schedulable Objects.
// (see
// _.default)
TrainDataSource.prototype.preProcess = function(params, filters) {
	_.extend(params, {
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
// - params : Url parameters object send to the datasource
// - filters : Object containing filters used to get the data
// - checksum : 
TrainDataSource.prototype.postProcess = function(data, params, filters, checksum) {
	var self = this;
	if (checksum != this.lastCirculationChecksum ) { //FIXME des fois il faut reparser le données meme avec le meme md5 (Filtre changés).
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

			if (self.isVisible(mission) || 'id_mission' in params) {
				missions.push(mission);
				trains[mission.id_mission] = true;
				delete (self.trains[mission.id_mission]);
			} else {
				delete (mission);
			}
		}
		var output = _.clone({
			trains : {
				missions : missions,
				remove : self.trains,
			},
			stats : stats
		});
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
TrainDataSource.prototype.isConcernedByFilterChanges = function(newFilters, oldFilter) {
	logger.error('isConcernedByFilterChanges not implemented');
	return false;
};
