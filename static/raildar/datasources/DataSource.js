// Template of Schedulable Operation that can be managed by the scheduler.
function DataSource(options) {
	observable(this);
	_.extend(this, options);
};
_.extend(DataSource.prototype, {

	// Called by the web worker before ajax request. You can here modify the
	// params object to add revelant request parameters.
	// - params : ajax request's paramaeters
	// - filter : Current filters that can be used to construc request params
	preProcess : function(params, filter) {
		console.warn('Preprocess not implemented on ' + this.constructor.name);
	},

	// Called by the webworker after having received data from the request
	// - data : JSON decoded data from the ajax request to the datasource
	// - filters : Object containing filters used to get the data
	// - checksum : String containing checsum of raw data
	postProcess : function(data) {
		console.warn('Postprocess not implemented on ' + this.constructor.name);
	},

	// called by the scheduler when Filters changes, in order to know if the
	// modification of filters have impact on this dataSource.
	// - changedKeys : Array of the changed filters names.
	// Return : true is this datasource have to be refresh to take one or more of
	// the specified changes in account.
	isConcernedByFilterChanges : function(changedKeys) {
		console.warn('isConcernedByFilterChanges not implemented on ' + this.constructor.name);
		return false;
	}
});