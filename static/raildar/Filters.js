var visible_filter = "ok/delayed/cancelled/unknown";
if (typeof L != 'undefined') {
	if (L.Browser.mobile || L.Browser.touch)
		visible_filter = "delayed/cancelled/unknown";
}
var cpt = 0;
var Filters = {
	_initialized : false,
	_data : {
		visible : visible_filter,
		train_layer : "national",
		num_train : "",
		id_gare : "", //id de la gare sur laquelle filtrer les trains
		map : {
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
			}
		},
		tracking : null,

	},
	_equals : function(val1, val2) {
		return ((typeof val1 == typeof val2) && (JSON.stringify(val1) == JSON.stringify(val2)));
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
		//c = "["+(cpt++)+"]";
		//console.debug(c+" -- Set filters on " + (typeof document == 'undefined' ? 'WebWorker' : 'Main UI Thread'));
		var from = arguments[arguments.length - 1];
		if (from != 'ui' && from != 'hash') {
			console.warn("Unknown change from '" + from + "' asume it's 'ui'");
			from = 'ui';
		}
		if (typeof obj === 'string') {
			if (!Filters._equals(value, Filters._data[obj])) {
				//console.debug(c+' -- filter changes');
				var oldValues = {};
				oldValues[obj] = Filters._data[obj];

				Filters._data[obj] = value;
				Filters._data['_t'] = new Date().getTime();

				var newValues = {};
				newValues[obj] = value;

				if (Filters._initialized) {
					setTimeout(function() {
						Filters.trigger("change", newValues, oldValues, Filters._data, from);
					});
				}
			} else {
				//console.debug(c+' -- filter does not change');
			}
		} else if (typeof obj === 'object') {
			var changed = false;
			var oldValues = {};
			var newValues = {};
			for (k in obj) {
				if (!Filters._equals(obj[k], Filters._data[k])) {
					changed = true;
					oldValues[k] = Filters._data[k];
					newValues[k] = obj[k];
					Filters._data[k] = obj[k];
				}
			}
			if (changed) {
				//console.debug(c+' -- filter changes');
				if (Filters._initialized) {
					setTimeout(function() {
						Filters.trigger("change", newValues, oldValues, Filters._data, from);
					}, 0);
				}
			} else {
				//console.debug(c+' -- filter does not change');
			}

		}

	},
	init : function(obj) {
		Filters.trigger("init", Filters._data);
		console.debug("Initialising Filters");
		Filters.set(obj, 'hash');
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
		// console.debug('trigger "'+from + '-change:'+ k+'" event');
		Filters.trigger(from + '-change:' + k, newValues[k], oldValues[k], from);
		// console.debug('trigger "change:'+ k+'" event');
		Filters.trigger('change:' + k, newValues[k], oldValues[k], from);
	}
});
