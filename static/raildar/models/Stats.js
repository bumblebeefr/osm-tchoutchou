var Stats = {
	stats : {},
	newData : function(data,dataSourceName) {
		Stats.stats = data;
		Stats.trigger("change",data,dataSourceName);
	}
};
observable(Stats);