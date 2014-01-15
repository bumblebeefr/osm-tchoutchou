// Template of Schedulable Operation that can be managed by the scheduler.
// These Operations should inherit this Object by calling
// _.defaults(Schedulable, Train) for example.
var Schedulable = function(){
	observable(this);
};
_.extend(Schedulable.protoype, {

	// Called by the web worker before ajax request
	// - params : ajax request's paramaeters
	// some value when having kind of inheritance between Schedulable Objects.
	// (see
	// _.default)
	preProcess : function(params) {
		logger.error('Preprocess not implemented');
	},

	// Called by the webworker after having received data from the request
	// - data : JSON decoded data from the ajax request to the datasource
	// some value when having kind of inheritance between Schedulable Objects.
	// (see
	// _.default)
	postProcess : function(data) {
		logger.error('Postprocess not implemented');
	},

	// Called by the view to refresh or display the visualization of data.
	// - data return from the worker, mainly managed by the postProcess()
	// method.
	// _.default)
	display : function(data) {
		logger.error('Display not implemented');
	},

	// called by the scheduler when Filters hcange, in order to know if the
	// modification of filters have impact on this datatSource.
	isConcernedByFilterChanges : function(newFilters, oldFilter) {
		logger.error('isConcernedByFilterChanges not implemented');
		return false;
	}
});