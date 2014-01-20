var DisplayManager = {

	/** ************ Config ************* */

	// Layers groups used to disaplay data
	dataLayers : {
		"trains" : {
			"national" : {
				mapLayer : L.featureGroup(),
				dataSources : [ "national" ],
				'center' : {
					'lat' : 46.81,
					'lng' : 6.88
				},
				'minZoom' : 5,
				'maxZoom' : 8
			},
			"regional" : {
				mapLayer : L.featureGroup(),
				dataSources : [ "regional" ],
				'center' : {
					'lat' : 46.81,
					'lng' : 6.88
				},
				'minZoom' : 5,
				'maxZoom' : 8
			},
			"idf" : {
				mapLayer : L.featureGroup(),
				dataSources : [ "idf" ],
				'center' : {
					'lat' : 48.854,
					'lng' : 2.348
				},
				'minZoom' : 7,
				'maxZoom' : null
			},
			"toulouse" : {
				mapLayer : L.featureGroup(),
				dataSources : [ "toulouse" ],
				'center' : {
					'lat' : 43.621,
					'lng' : 1.472
				},
				'minZoom' : 7,
				'maxZoom' : null
			}
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

	// layer management
	getDataLayer : function(group, name) {
		return get(get(DisplayManager.dataLayers, group, {}), name, {});
	},
	/**
	 * Get The layer used to display the specified dataSource.
	 * 
	 * @param layerGroup
	 * @param dataSourceName
	 * @returns Return one datalayer (cf datalayers) or null. Can't return
	 *          multiple layers.
	 */
	getDataLayerForDataSource : function(layerGroup, dataSourceName) {
		var name = DisplayManager.getDataLayerNameForSource(layerGroup, dataSourceName);
		if (name  == null) {
			return null;
		} else {
			return DisplayManager.dataLayers[layerGroup][name];
		}
	},

	/**
	 * Get name of the layer used to display the specified dataSource.
	 * 
	 * @param layerGroup
	 * @param dataSourceName
	 * @returns The name of the layer (String), null if no one found, the first
	 *          found if there is multiple matches.
	 */
	getDataLayerNameForSource : function(layerGroup, dataSourceName) {
		var names = [];
		if (layerGroup in DisplayManager.dataLayers) {
			for (k in DisplayManager.dataLayers[layerGroup]) {
				if ("dataSources" in DisplayManager.dataLayers[layerGroup][k]) {
					if (_.contains(DisplayManager.dataLayers[layerGroup][k].dataSources, dataSourceName)) {
						names.push(k);
					}
				}
			}
		} else {
			console.error("No layerGroup " + layerGroup + " found in DisplayManager.dataLayers");
		}
		if (names.length == 0) {
			logger.warning("There is no layer on group " + layerGroup + " matching datasource " + layerGroup);
			return null;
		} else {
			if (names.length > 1)
				logger.warning("There is more than one layer on group " + layerGroup + " matching datasource " + layerGroup);
			return names[0];
		}
	},
	showLayer : function(group, name) {
		console.debug("Show layer", group, name);
		var mapLayer = DisplayManager.getDataLayer(group, name).mapLayer;
		if (mapLayer) {
			if (!map.hasLayer(mapLayer)) {
				mapLayer.addTo(map);
				DisplayManager.trigger('showLayer', group, name);
			}
		}
	},
	hideLayer : function(group, name) {
		console.debug("Hide layer", group, name);
		var mapLayer = DisplayManager.getDataLayer(group, name).mapLayer;
		if (mapLayer) {
			if (map.hasLayer(mapLayer)) {
				map.removeLayer(mapLayer);
				DisplayManager.trigger('hideLayer', group, name);
			}
		}
	},

	// Start/Stop datasource depending on user filters.
	doTheFilterMagic : function(newValues, oldValues, allFilters) {
		console.debug("Filter magick with trains_layer " + newValues['train_layer']);
		var toReload = [];// avoid to load a source multiple times
		var toStop = [];

		// Show/hide train layers
		if ('train_layer' in newValues) {
			var ok = false;
			_.each(DisplayManager.dataLayers.trains, function(value, key) {
				if (newValues['train_layer'] == key) {
					_.each(DisplayManager.dataLayers.trains[key].dataSources, function(name) {
						toReload.push(name);
					});
					ok = true;
				} else {
					_.each(DisplayManager.dataLayers.trains[key].dataSources, function(name) {
						toStop.push(name);
					});
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
				if (!_.contains(toStop, k) && DataSourceConfig[k].isConcernedByFilterChanges(_.keys(allFilters))) {
					console.log("refresh archive", k);
					toReload.push(k);
				}
			}
		}

		// load and stop what have to be.
		console.debug("load : ", _.uniq(toReload));
		_.each(_.uniq(toReload), function(dataSourceName) {
			Scheduler.load(dataSourceName);
		});

		console.debug("stop : ", _.uniq(_.difference(toStop, toReload)));
		_.each(_.uniq(_.difference(toStop, toReload)), function(dataSourceName) {
			Scheduler.stop(dataSourceName);
		});
	}
};
observable(DisplayManager);


Scheduler.on('load', function(dataSourceName) {
	for(layerGroup in DisplayManager.dataLayers){
		var layerName = DisplayManager.getDataLayerNameForSource(layerGroup, dataSourceName);
		if(layerName != null){
			DisplayManager.showLayer(layerGroup, layerName);
		}
	}
	DisplayManager.addLoading(1);
});
Scheduler.on('stop', function(dataSourceName) {
	for(layerGroup in DisplayManager.dataLayers){
		var layerName = DisplayManager.getDataLayerNameForSource(layerGroup, dataSourceName);
		if(layerName != null){
			DisplayManager.hideLayer(layerGroup, layerName);
		}
	}
});
Scheduler.on('dataComplete', function() {
	DisplayManager.addLoading(-1);
});
