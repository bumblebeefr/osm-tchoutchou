var worker = this;

importScripts('./WorkerConsole.js','./DataSourceConfig.js', './Schedulable.js','./Train.js', '../spark-md5.min.js', '../moment.min.js', '../moment.fr.js', '../underscore-min.js');

moment.lang('fr');



//Hold filters
var Filters = {};
var OldFilters = {};

var commands = {
	update_filters : function(filters) {
		if(JSON.stringify(filters) != JSON.stringify(Filters)){
			OldFilters = Filters;
			Filters = filters;
		}
	},
	get_data : function(options){
		if(options.datasource in DataSourceConfig){
			
		}else{
			console.error("No datasource named",options.datasource);
		}
	}
	
	
};

//Handle message events. A message (see Workermessage in libray.js) have to properties :
// - cmd : Name of the command to execute, key in commands object
// - parameter : Object containing parameters to the function.
this.addEventListener('message', function(e) {
	if (e.data.cmd in commands) {
		commands[e.data.cmd](e.data.parameter);
	} else {
		console.error("No handler defined for cmd " + e.cmd);
	}
}, false);