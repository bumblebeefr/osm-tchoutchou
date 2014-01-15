var Filters = {
	_data : {},
	
	set : function(name, value) {
		if(value != Filters._data[name]){
			var oldValue = Filters._data[name];
			Filters._data[name] = value;
			Filters.trigger("changeValue", value, oldValue, Filters._data);
		}
	},
	
	get : function(name) {
		if(typeof name === "string"){
			return Filters._data[name];
		}else{
			return Filters._data;
		}
		return Filters._data;
	}
};
observable(Filters);