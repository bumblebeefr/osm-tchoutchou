// Template of Schedulable Operation that can be managed by the scheduler.
function DataSource(options){
	observable(this);
	_.extend(this,options);
};
_.extend(DataSource.prototype, {

	// Called by the web worker before ajax request
	// - params : ajax request's paramaeters
	preProcess : function(params) {
		console.warn('Preprocess not implemented on ' + this.constructor.name);
	},

	// Called by the webworker after having received data from the request
	// - data : JSON decoded data from the ajax request to the datasource
	// - filters : Object containing filters used to get the data
	// - checksum : String containing checsum of raw data
	postProcess : function(data) {
		console.warn('Postprocess not implemented on ' + this.constructor.name);
	},

	// called by the scheduler when Filters hcange, in order to know if the
	// modification of filters have impact on this datatSource.
	isConcernedByFilterChanges : function(newFilters, oldFilter) {
		console.warn('isConcernedByFilterChanges not implemented on ' + this.constructor.name);
		return false;
	}
});