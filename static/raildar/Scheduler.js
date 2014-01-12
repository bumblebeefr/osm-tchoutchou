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
			if(event.data.cmd in Scheduler.workerCallbacks){
				Scheduler.workerCallbacks[event.data.cmd](event.data.parameters);
			}else{
				logger.warn('No callbacks for',event.data.parameters);
			}
		});
	},
};

Scheduler.workerCallbacks = {
		console_log : function(args){
			console.log.apply(window,args);
		},
		console_error : function(args){
			console.error.apply(window,args);
		},
		console_info : function(args){
			console.info.apply(window,args);
		},
		console_debug : function(args){
			console.debug.apply(window,args);
		}  
};