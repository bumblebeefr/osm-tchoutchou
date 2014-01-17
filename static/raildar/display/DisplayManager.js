var DisplayManager = {

	/** ************ Config ************* */
	displays : {
		"trains" : new TrainDisplay(),
		"stats" : new StatsDisplay()
	},

	// Layers groups used by dataSources
	dataLayers : {
		"trains" : {
			"national" : L.featureGroup(),
			"regional" : L.featureGroup(),
			"idf" : L.featureGroup(),
			"toulouse" : L.featureGroup()
		}
	},

	// count number of datasource loading
	loading : 0,

	/** *********** Methods ************ */
	addLoading : function(nb) {
		DisplayManager.loading += nb;
		if (DisplayManager.loading > 0) {
			$("#icon").addClass("loading");
		} else {
			$("#icon").removeClass("loading");
		}
	},
	display : function(dataSourceName, data) {
		console.debug("Displaying data from ", dataSourceName, data);
		for ( var k in data) {
			if (k in DisplayManager.displays) {
				DisplayManager.displays[k].display(data[k], dataSourceName);
			} else {
				logger.warn('No display defined for ' + k);
			}
		}
		DisplayManager.trigger("display", dataSourceName, data);
	},

	getLayer : function(group, name) {
		return get(get(DisplayManager.dataLayers, group, {}), name, null);
	},
	getLayerForDataSource : function(dataSourceName) {
		return DisplayManager.getLayer(DataSourceConfig[dataSourceName].layerGroup, DataSourceConfig[dataSourceName].layerName);
	},

	showLayer : function(group, name) {
		console.debug("Show layer", group, name);
		var layer = DisplayManager.getLayer(group, name);
		if (layer) {
			if (!map.hasLayer(layer)) {
				layer.addTo(map);
			}
		}
	},

	hideLayer : function(group, name) {
		console.debug("Hide layer", group, name);
		var layer = DisplayManager.getLayer(group, name);
		if (layer) {
			if (map.hasLayer(layer)) {
				map.removeLayer(layer);
			}
		}
	},

	doTheFilterMagic : function(newValues, oldValues, allFilters) {
		console.debug("Filter magick with trains_layer " + newValues['train_layer']);
		var loaded = [];// avoid to load a source multiple times

		// Show/hide train layers
		if ('train_layer' in newValues) {
			var ok = false;
			_.each(DataSourceConfig.getNamesBy('layerGroup',"trains"), function(name) {
				if (newValues['train_layer'] == name) {
					Scheduler.load(name);
					loaded.push(name);
					ok = true;
				} else {
					Scheduler.stop(name);
				}
			});
			if (!ok) {
				Scheduler.load('national');
				loaded.push(name);
			}
		}

		// Refesh all active datasource concerned by the filters and that does
		// not alread have be refreshed
		for (k in DataSourceConfig) {
			if (Scheduler.sourceArctive[k]) {
				if (!_.contains(loaded, k) && DataSourceConfig[k].isConcernedByFilterChanges(_.keys(allFilters))) {
					console.log("refresh archive", k);
					Scheduler.load(k);
				}
			}
		}
	}
};
observable(DisplayManager);

Scheduler.on('start', function(dataSourceName) {
	// autozoom
	console.debug("Start dataSource "+dataSourceName);
	if (DataSourceConfig[dataSourceName].layerGroup == 'trains') {
		var dataSource = DataSourceConfig[dataSourceName];
		var z = map.getZoom();
		console.debug("Checkin zoom (current,min,max)",z,dataSource.minZoom,dataSource.maxZoom);
		if (dataSource.minZoom && dataSource.minZoom > z) {
			console.debug("Zooming to minZoom ",dataSource.minZoom);
			if(dataSource.center){
				map.setView(dataSource.center,dataSource.minZoom, {animate:false});
			}else{
				map.setZoom(dataSource.minZoom);
			}
		} 
		if (dataSource.maxZoom && dataSource.maxZoom < z) {
			console.debug("Zooming to maxZoom ",dataSource.maxZoom);
			if(dataSource.center){
				map.setView(dataSource.center,dataSource.maxZoom, {animate:false});
			}else{
				map.setZoom(dataSource.maxZoom);
			}
		}
		console.log(dataSource.center);
		if(dataSource.center && !map.getBounds().contains(L.latLng(dataSource.center.lat,dataSource.center.lng))){
			console.debug("Recenter");
			map.panTo(dataSource.center, {animate:false});
		}
		console.debug("Checkin zoom (current,min,max)",z,dataSource.minZoom,dataSource.maxZoom);
	};
});
Scheduler.on('load', function(dataSourceName) {
	var ds = DataSourceConfig[dataSourceName];
	if (ds.layerGroup != null && ds.layerName != null) {
		DisplayManager.showLayer(ds.layerGroup, ds.layerName);
	}
	DisplayManager.addLoading(1);
});
Scheduler.on('stop', function(dataSourceName) {
	var ds = DataSourceConfig[dataSourceName];
	if (ds.layerGroup != null && ds.layerName != null) {
		DisplayManager.hideLayer(ds.layerGroup, ds.layerName);
	}
});
Scheduler.on('dataComplete', function() {
	DisplayManager.addLoading(-1);
});
