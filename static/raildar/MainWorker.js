var worker = this;
importScripts('../riot.js','../spark-md5.min.js', '../moment.min.js', '../moment.fr.js', '../underscore-min.js');
importScripts('./Static.js','./WorkerConsole.js','./Filters.js', './DataSourceConfig.js', './Schedulable.js', './Train.js');

moment.lang('fr');

// Hold filters
var runningXHR = {};

var commands = {

	set_filter : function(args) {
		Filters.set(args.name,args.value);
	},

	// Load data from a specified datatsource
	// option :
	// - datasource : name of the datasouce to call
	// -
	get_data : function(options) {
		if (options.datasource in DataSourceConfig) {
			if (options.datasource in runningXHR) {
				runningXHR[options.datasource].abort();
			}
			var obj = DataSourceConfig[options.datasource].obj;
			var args = _.clone(DataSourceConfig[options.datasource].args);
			obj.preprocess(args,Filters.get());
			getJSON(DataSourceConfig[options.datasource].url, {
				data : args,
				cache : false,
				error : function(jqXHR, textStatus, errorThrown) {
					console.log("Error occurs when getting loading data from " + datatsource + "datasource", textStatus, errorThrown);
					worker.sendMessage(new WorkerMessage("data_error", {
						datasource : datasource,
						textStatus : textStatus,
						error : errorThrown ? errorThrown.message : null
					}));
				},
				success : function(data, textStatus, jqXHR) {
					worker.sendMessage(new WorkerMessage("data_received", {
						datasource : datasource,
						data : obj.prostProcess(data,Filters.get())
					}));
				}
			});
		} else {
			console.error("No datasource named", options.datasource);
		}
	}

};

// Handle message events. A message (see Workermessage in libray.js) have to
// properties :
// - cmd : Name of the command to execute, key in commands object
// - parameter : Object containing parameters to the function.
this.addEventListener('message', function(e) {
	if (e.data.cmd in commands) {
		commands[e.data.cmd](e.data.parameter);
	} else {
		console.error("No handler defined for cmd " + e.cmd);
	}
}, false);