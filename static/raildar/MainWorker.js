 var worker = this;
importScripts('../spark-md5.min.js', '../moment.min.js', '../moment.fr.js', '../underscore.js');
importScripts('./library.js', './Static.js', './WorkerConsole.js');
importScripts('./datasources/DataSource.js', './datasources/TrainDataSource.js', './datasources/DataSourceConfig.js');

// Hold filters
var runningXHR = {};

var commands = {


	// Load data from a specified datatsource
	// parameters :
	// - dataSourceName : name of the datasouce to call
	// -
	get_data : function(parameters) {
		//console.debug("Worker loading data "+JSON.stringify(parameters));
		if (parameters.dataSourceName in DataSourceConfig) {
			if (parameters.dataSourceName in runningXHR) {
				runningXHR[parameters.dataSourceName].abort();
			}
			var dataSourceObject = DataSourceConfig[parameters.dataSourceName];
			var urlParams = _.clone(DataSourceConfig[parameters.dataSourceName].urlParams);
			dataSourceObject.preProcess(urlParams, parameters.filters);
			
			getJSON(DataSourceConfig[parameters.dataSourceName].url, {
				data : urlParams,
				cache : false,
				error : function(jqXHR, textStatus, errorThrown) {
					console.log("Error occurs when getting loading data from " + parameters.dataSourceName + "datasource : "+textStatus+" --- "+errorThrown, textStatus, errorThrown);
					worker.postMessage(new WorkerMessage("data_error", {
						dataSourceName : parameters.dataSourceName,
						textStatus : textStatus,
						error : errorThrown ? errorThrown.message : null
					}));
				},
				success : function(data, textStatus, jqXHR) {
					var md5 = SparkMD5.hash(jqXHR.responseText);
					worker.postMessage(new WorkerMessage("data_received", {
						dataSourceName : parameters.dataSourceName,
						data : dataSourceObject.postProcess(data, urlParams, parameters.filters, md5)
					}));
				}
			});
		} else {
			console.error("No datasource named " + parameters.dataSourceName);
		}
	}

};

// Handle message events. A message (see WorkermMessage in libray.js) have to
// properties :
// - cmd : Name of the command to execute, key in commands object
// - parameter : Object containing parameters to the function.
this.addEventListener('message', function(e) {
	if (e.data.cmd in commands) {
		//console.debug("Received command "+e.data.cmd);
		commands[e.data.cmd](e.data.parameters);
	} else {
		console.error("No handler defined for cmd " + e.cmd);
	}
}, false);