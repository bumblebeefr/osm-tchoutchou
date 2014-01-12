//Scheduller, initalized in the view.

var Scheduler = {

	timers : {
		
	},
	
	//Could be managed by the leaflet LayerControls, or we do our own ?
	baseLayers:{},
	
	//Layers groups used for eache dataSource
	dataLayers : {},
	
	//initialize the Scedulling system.
	init : function(){
		for (k in Scheduler.config){
			Scheduler.timers[k] = null;
		}
		for (k in Scheduler.config){
			Scheduler.dataLayers[k] = L.featureGroup();
		}
		
		Scheduler.worker = new Worker('./static/raildar/MainWorker.js');
		Scheduler.worker.addEventListener("message", function (event) {
			if(event.data.type in Scheduler.workerCallbacks){
				Scheduler.workerCallbacks[event.data.type](event.data.data);
			}else{
				logger.warn('No callbacks for',event.data.type);
			}
		});
	},
};

Scheduler.workerCallbacks = {
};