var Filters = {
	_data : {
		visible : "delayed/cancelled/unknown",
		train_layer : "",
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
		tracking : null
	},

	/**
	 * Set a property, or a liste of properties. A 'change' event will be
	 * triggered.
	 * 
	 * Exemples :
	 * 
	 * Filters.set('zoom',6);
	 * 
	 * Filters.set({'zoom':6,'num':'56781'});
	 * 
	 * @param obj
	 *            'String' : Name of the property to set. 'Object' à list of
	 *            property/value to set.
	 * @param value
	 *            Value to be set when a string obj argument is defined. Nothing
	 *            if you provide an object as first arg.
	 */
	set : function(obj, value) {
		if (typeof obj === 'string') {
			if (value != Filters._data[obj]) {
				var oldValue = {};
				oldValue[obj] = Filters._data[obj];

				Filters._data[obj] = value;

				var newValue = {};
				newValue[obj] = value;

				Filters.trigger("change", newValue,oldValue, Filters._data);
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
				Filters.trigger("change", newValues, oldValues, Filters._data);
			}

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