var visible_filter = "ok/delayed/cancelled/unknown";
if(typeof L != 'undefined'){
	if(L.Browser.mobile || L.Browser.touch) visible_filter = "delayed/cancelled/unknown";
}
var Filters = {
	_initialized : false,
	_data : {
		visible : visible_filter,
		train_layer : "national",
		num_train : "",
		bounds : {
			_southWest : {
				lat : -200,
				lng : -200,
			},
			_northEast : {
				lat : 200,
				lng : 200,
			}
		},
		zoom : 0,
		center : {
			lat : 0,
			lng : 0
		},
		tracking : null,

	},

	/**
	 * Set a property, or a liste of properties. A 'change' event will be
	 * triggered.
	 * 
	 * Exemples :
	 * 
	 * Filters.set('zoom',6,'ui');
	 * 
	 * Filters.set({'zoom':6,'num':'56781'},'hash');
	 * 
	 * The change events commes withe 4 parameters : - newValue : an object
	 * containing only chendes new values - oldValue : an object containing for
	 * all filed in the newValue, the value before the modification - allValues :
	 * anobject containing all the fileters values. - from : string to knfrom
	 * from where the modfication of the filters commes from : 'ui' or 'hash'
	 * 
	 * @param obj
	 *            'String' : Name of the property to set. 'Object' à list of
	 *            property/value to set.
	 * @param value
	 *            Value to be set when a string obj argument is defined. Nothing
	 *            if you provide an object as first arg.
	 * @param from
	 *            Indicate if the value is changed form 'ui' or from 'hash'.
	 */
	set : function(obj, value, from) {
		var from = arguments[arguments.length - 1];
		if (from != 'ui' && from != 'hash') {
			console.error("Unknown change from '" + from + "' asume it's 'ui'");
			from = 'ui';
		}
		if (typeof obj === 'string') {
			if (value != Filters._data[obj]) {
				var oldValue = {};
				oldValue[obj] = Filters._data[obj];

				Filters._data[obj] = value;

				var newValue = {};
				newValue[obj] = value;

				if (Filters._initialized) {
					Filters.trigger("change", newValue, oldValue, Filters._data, from);
				}
			}
		} else if (typeof obj === 'object') {
			var changed = false;
			var oldValues = {};
			var newValues = {};
			for (k in obj) {
				if (obj[k] != Filters._data[k]) {
					changed = true;
					oldValues[k] = Filters._data[k];
					newValues[k] = obj[k];
					Filters._data[k] = obj[k];
				}
			}
			if (changed) {
				if (Filters._initialized) {
					Filters.trigger("change", newValues, oldValues, Filters._data, from);
				}
			}

		}
	},
	init : function(obj) {
		Filters.trigger("init", Filters._data);
		console.debug("Initialising Filters");	
		Filters.set(obj,'hash');
		if (!Filters._initialized) {
			Filters._initialized = true;
			Filters.trigger("change", Filters._data, {}, Filters._data, 'hash');
		}
	},

	get : function(name) {
		if (typeof name === "string") {
			return Filters._data[name];
		} else {
			return Filters._data;
		}
		return Filters._data;
	}
};
observable(Filters);
Filters.on("change", function(newValues, oldValues, AllValues, from) {
	for (k in newValues) {
		Filters.trigger(from + '-change:' + k, newValues[k], oldValues[k], from);
		Filters.trigger('change:' + k, newValues[k], oldValues[k], from);
	}
});