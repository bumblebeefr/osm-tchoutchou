// Template of Schedulable Operation that can be managed by the scheduler.
// These Operations should inherit this Object by calling
// _.defaults(Schedulable, Train) for example.
var Schedulable = {
	// Called by the web worker before ajax request
	preProcess : function(params	) {
		logger.error('Preprocess not implemented');
	},

	// Called after having received data from the request
	postProcess : function(data) {
		logger.error('Postprocess not implemented');
	},
	
	// Called by the view to refresh or display the visualization of data.
	display : function(data) {
		logger.error('Display not implemented');
	}
};