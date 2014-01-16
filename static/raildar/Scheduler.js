//Scheduller, initalized in the view.

var Scheduler = {

	timers : {

	},

	// initialize the Scheduling system.
	init : function() {
		for (k in Scheduler.config) {
			Scheduler.timers[k] = null;
		}
		for (k in Scheduler.config) {
			Scheduler.dataLayers[k] = L.featureGroup();
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

		// FIXME demarrage pour tester
		Scheduler.show("national");
	},

	show : function(datatSourceName) {
		Scheduler.worker.postMessage(new WorkerMessage('get_data', {
			dataSourceName : datatSourceName
		}));
	}

};
observable(Scheduler);

Scheduler.on('dataReceived', function(workerData) {
	console.log(workerData);
	// TODO : Do something with the data
	if (workerData.data != null) {
		DisplayManager.display(workerData.dataSourceName,workerData.data);
	}
	Scheduler.trigger('dataComplete',workerData.dataSourceName);
});
Scheduler.on('dataError', function(workerData, e) {
	// TODO :Do something with the error
	Scheduler.trigger('dataComplete',workerData.dataSourceName);
});
Scheduler.on('dataComplete', function(dataSourceName) {
	// TODO : relaunch timer if needed;
	Scheduler.timers['trains'] = setTimeout(function() {
		Scheduler.show(dataSourceName);
	}, DataSourceConfig[dataSourceName].refreshDelay);
});

Filters.on('change', function(newValues, oldValues, allFilters) {
	Scheduler.worker.postMessage(new WorkerMessage('set_filter', {
		newValues : newValues,
		oldValues : oldValues
	}));
	// TODO check which datatSource have to be updated/activated
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