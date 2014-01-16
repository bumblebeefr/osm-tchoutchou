var DisplayManager = {
		
	/************** Config **************/
	displays : {
		"trains" : new TrainDisplay(),
		"stats" : new StatsDisplay()
	},

	// Could be managed by the leaflet LayerControls, or we do our own ?
	baseLayers : {},

	// Layers groups used for eache dataSource
	dataLayers : {},
	
	
	/************* Methods *************/
	display : function(dataSourceName,data){
		console.debug("Displaying data from ",dataSourceName,data);
		for(var k in data){
			if(k in DisplayManager.displays){
				DisplayManager.displays[k].display(data[k],data);
			}else{
				logger.warn('No display defined for '+k);
			}
		}
		DisplayManager.trigger("display",dataSourceName,data);
	}
};
observable(DisplayManager);
