var DisplayManager = {

	/** ************ Config ************* */

	// Layers groups used to disaplay data
	dataLayers : {
		"trains" : {
			"national" : {
				mapLayer : L.featureGroup(),
				dataSources : [ "national" ],
				'center' : {
					'lat' : 46.774,
					'lng' : 1.967
				},
				'minZoom' : 5,
				'maxZoom' : 7
			},
			"regional" : {
				mapLayer : L.featureGroup(),
				dataSources : [ "regional" ],
				'center' : {
					'lat' : 46.774,
					'lng' : 1.967
				},
				'minZoom' : 5,
				'maxZoom' : 7
			},
			"idf" : {
				mapLayer : L.featureGroup(),
				dataSources : [ "idf" ],
				'center' : {
					'lat' : 48.854,
					'lng' : 2.348
				},
				'minZoom' : 9,
				'maxZoom' : 10
			},
			"toulouse" : {
				mapLayer : L.featureGroup(),
				dataSources : [ "toulouse" ],
				'center' : {
					'lat' : 43.621,
					'lng' : 1.472
				},
				'minZoom' : 7,
				'maxZoom' : 8
			},
			"irishrail" : {
				mapLayer : L.featureGroup(),
				dataSources : [ "irishrail" ],
				'center' : {
					'lat' : 53.550,
					'lng' : -7.657
				},
				'minZoom' : 6,
				'maxZoom' : 7
			},
		/*	"networkrail" : {
				mapLayer : L.featureGroup(),
				dataSources : [ "networkrail" ],
				'center' : {
					'lat' : 53.130,
					'lng' : -1.241
				},
				'minZoom' : 7,
				'maxZoom' : null
			},
		*/	"finlande" : {
				mapLayer : L.featureGroup(),
				dataSources : [ "finlande" ],
				'center' : {
					'lat' : 64.039,
					'lng' : 28.477
				},
				'minZoom' : 5,
				'maxZoom' : 6
			},
			"danemark" : {
				mapLayer : L.featureGroup(),
				dataSources : [ "danemark" ],
				'center' : {
					'lat' : 56.081,
					'lng' : 10.931
				},
				'minZoom' : 7,
				'maxZoom' : 8
			}
		}
	},

	// count number of datasource loading
	loading : 0,

	/** *********** Methods ************ */
	addLoading : function(nb) {
		DisplayManager.loading += nb;
		if (DisplayManager.loading > 0) {
			$("body").addClass("loadingCursor");
			$("#icon").addClass("loading");
		} else {
			$("#icon").removeClass("loading");
			$("body").removeClass("loadingCursor");
		}
	},
	//gestion d'un icone de chargement sur une "iconTarget" fournie (par ex le bouton qui a lancé l'action)
	//l'icone de chargement est enlevé quand le "loadingObject" renvoie l'evenement "complete"
	smallLoading : function(iconTarget,loadingObject ) {
		iconTarget.addClass("loading");		
		loadingObject.on("complete", function(){
			iconTarget.removeClass("loading");
		});
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
			console.error("There is no layer on group " + layerGroup + " matching datasource " + dataSourceName);
			return null;
		} else {
			if (names.length > 1)
				logger.error("There is more than one layer on group " + layerGroup + " matching datasource " + layerGroup);
			return names[0];
		}
	},
	showLayer : function(group, name) {
		var mapLayer = DisplayManager.getDataLayer(group, name).mapLayer;
		if (mapLayer) {
			if (!map.hasLayer(mapLayer)) {
				console.debug("Show layer", group, name);
				mapLayer.addTo(map);
				DisplayManager.trigger('showLayer', group, name);
			}
		}
	},
	hideLayer : function(group, name) {
		var mapLayer = DisplayManager.getDataLayer(group, name).mapLayer;
		if (mapLayer) {
			if (map.hasLayer(mapLayer)) {
				console.debug("Hide layer", group, name);
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
				toReload.push(name);
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

//Show layers concerned by the dataSource when a datasource is loaded by the Scheduler.
Scheduler.on('load', function(dataSourceName) {
	for(layerGroup in DisplayManager.dataLayers){
		var layerName = DisplayManager.getDataLayerNameForSource(layerGroup, dataSourceName);
		if(layerName != null){
			DisplayManager.showLayer(layerGroup, layerName);
		}
	}
	DisplayManager.addLoading(1);
});

//Hide layers when all his datasources are stopped.
Scheduler.on('stop', function(dataSourceName) {
	for(layerGroup in DisplayManager.dataLayers){
		var layerName = DisplayManager.getDataLayerNameForSource(layerGroup, dataSourceName);
		if(layerName != null){
			if(DisplayManager.dataLayers[layerGroup][layerName].dataSources && DisplayManager.dataLayers[layerGroup][layerName].dataSources.length >0){
				var hide = true;
				_.each(DisplayManager.dataLayers[layerGroup][layerName].dataSources,function(dataSourceName){
					if(Scheduler.isActive(dataSourceName)){
						hide = false;
						return false;
					}
				});
				if(hide){
					DisplayManager.hideLayer(layerGroup, layerName);
				}
			}
		}
	}
});

Scheduler.on('dataComplete', function() {
	DisplayManager.addLoading(-1);
});

Filters.on('change', function(newValues, oldValues, allFilters, from) {
	console.debug("Disaplay manager detect a change on filters, will execute filtermagic", arguments);
	DisplayManager.doTheFilterMagic(newValues, oldValues, allFilters);
});
