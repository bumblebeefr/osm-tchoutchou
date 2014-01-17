// Template of Schedulable Operation that can be managed by the scheduler.
// These Operations should inherit this Object by calling
// _.defaults(Schedulable, Train) for example.
function Display(options){
	observable(this);
	_.extend(this, options);
};
_.extend(Display.prototype, {
	// Called by the view to refresh or display the visualization of data.
	// - data return from the worker, mainly managed by the postProcess()
	// method.
	// _.default)
	display : function(data) {
		console.warn('display() function not implemented on ',this.constructor.name);
	},
});