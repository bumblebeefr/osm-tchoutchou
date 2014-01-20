//Scheduller, initalized in the view.

var Scheduler = {

	timers : {

	},
	sourceArctive : {

	},

	// initialize the Scheduling system.
	init : function() {
		if (Scheduler.worker == null) {
			for (k in DataSourceConfig) {
				Scheduler.timers[k] = null;
				Scheduler.sourceArctive[k] = false;
			}

			Scheduler.worker = new Worker('./static/raildar/MainWorker.js');

			// Handle messages from webworker. A message (see WorkermMessage in
			// libray.js) have to
			// properties :
			// - cmd : Name of the command to execute, key in commands object
			// - parameter : Object containing parameters to the function.
			Scheduler.worker.addEventListener("message", function(event) {
				if (event.data.cmd in Scheduler.workerCallbacks) {
					Scheduler.workerCallbacks[event.data.cmd](event.data.parameters);
				} else {
					logger.warn('No callbacks for', event.data.cmd);
				}
			});

		}
		Scheduler.trigger('init');
	},

	load : function(dataSourceName) {
		console.debug('Loading datasource loading',dataSourceName);
		var start = !Scheduler.sourceArctive[dataSourceName];
		if(start){
			Scheduler.trigger('start', dataSourceName);
		}
		clearTimeout(Scheduler.timers[dataSourceName]);
		
		Scheduler.sourceArctive[dataSourceName] = true;
		Scheduler.worker.postMessage(new WorkerMessage('get_data', {
			dataSourceName : dataSourceName
		}));
		Scheduler.trigger('load', dataSourceName);
	},

	stop : function(dataSourceName) {
		if(Scheduler.sourceArctive[dataSourceName]){
			console.debug('Stoping datasource loading',dataSourceName);
			clearTimeout(Scheduler.timers[dataSourceName]);
			Scheduler.sourceArctive[dataSourceName] = false;
			Scheduler.trigger('stop', dataSourceName);
		}
	},
	
	isActive : function(dataSourceName){
		return Scheduler.sourceArctive[dataSourceName];
	}

};
observable(Scheduler);
Scheduler.init();
Scheduler.on('dataReceived', function(workerData) {
	//try {
		if (workerData.data != null && Scheduler.sourceArctive[workerData.dataSourceName]) {
			for ( var k in workerData.data) {
				if (k in window ) {
					if('newData' in window[k]){
						var f = window[k].newData;
						var args = [workerData.data[k], workerData.dataSourceName];
						setTimeout(function(){
							f.apply(window,args);
						},0);
						window[k].newData(workerData.data[k], workerData.dataSourceName);
					}else{
						console.warn('Object ' + k + 'have no newData() method !');
					}
				} else {
					console.warn('No model object ' + k);
				}
			}
		}
//	} catch (e) {
//		console.error("Error on computing data",e, e.message, "on File '"+e.fileName+"', line "+e.lineNumber);
//	}
	Scheduler.trigger('dataComplete', workerData.dataSourceName);
});
Scheduler.on('dataError', function(workerData, e) {
	// TODO :Do something with the error
	Scheduler.trigger('dataComplete', workerData.dataSourceName);
});
Scheduler.on('dataComplete', function(dataSourceName) {
	clearTimeout(Scheduler.timers[dataSourceName]);
	if(Scheduler.sourceArctive[dataSourceName]){
		Scheduler.timers[dataSourceName] = setTimeout(function() {
			Scheduler.load(dataSourceName);
		}, DataSourceConfig[dataSourceName].refreshDelay);
	}
});

// update filters on Webworker's side
Filters.on('change', function(newValues, oldValues, allFilters) {
	console.log("filterchanges", arguments);
	Scheduler.worker.postMessage(new WorkerMessage('set_filter', {
		newValues : newValues,
		oldValues : oldValues
	}));
	DisplayManager.doTheFilterMagic(newValues, oldValues, allFilters);
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
	data_received : function(workerData) {
		Scheduler.trigger('dataReceived', workerData);
	},
	data_error : function(workerData) {
		Scheduler.trigger('dataError', workerData);
	},
};