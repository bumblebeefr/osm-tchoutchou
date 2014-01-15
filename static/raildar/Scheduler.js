//Scheduller, initalized in the view.

var Scheduler = {

	timers : {

	},

	// Could be managed by the leaflet LayerControls, or we do our own ?
	baseLayers : {},

	// Layers groups used for eache dataSource
	dataLayers : {},

	// initialize the Scheduling system.
	init : function() {
		for (k in Scheduler.config) {
			Scheduler.timers[k] = null;
		}
		for (k in Scheduler.config) {
			Scheduler.dataLayers[k] = L.featureGroup();
		}

		Scheduler.worker = new Worker('./static/raildar/MainWorker.js');
		Scheduler.worker.addEventListener("message", function(event) {
			if (event.data.cmd in Scheduler.workerCallbacks) {
				Scheduler.workerCallbacks[event.data.cmd](event.data.parameters);
			} else {
				logger.warn('No callbacks for', event.data.cmd);
			}
		});
	}

};
observable(Scheduler);



Scheduler.on('dataReceive' ,function(data) {
	// TODO : Do something with the data
	if(data != null){
		DataSourceConfig[data.datasource].obj.display(data);
	}
	Scheduler.onDataComplete(data.datasource);
});
Scheduler.on('dataError',function(datasource, e) {
	// TODO :Do something with the error
	Scheduler.onDataComplete(data.datasource);
});
Scheduler.on('dataComplete',function(data) {
	// TODO : relaunch timer if needed;
});


Filters.on('valueChange',function(namme,value){
	Scheduler.worker.postMessage(new WorkerMessage('set_filter', { name : name, value:value}));
	//TODO check which datatSource have to be updated/activated
});









Scheduler.workerCallbacks = {
	// Console events
	console_log : function(args) {
		console.log.apply(window, args);
	},
	console_error : function(args) {
		console.error.apply(window, args);
	},
	console_info : function(args) {
		console.info.apply(window, args);
	},
	console_debug : function(args) {
		console.debug.apply(window, args);
	},

	// Data events
	data_received : function(data) {
		console.debug(data);
		Scheduler.trigger('dataReceived',data);
	},
	data_error : function(data) {
		console.debug(data);
		Scheduler.trigger('dataError',data);
	},
};