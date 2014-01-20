var Trains = {
	missions : {},
	newData : function(data, dataSourceName){
		console.debug("Trains : new Data from "+dataSourceName);
		Trains.trigger("haveNewData",data,dataSourceName);
		if(data.remove){
			for(k in data.remove){
				console.debug("remove : ",k);
				delete(Trains.missions[k]);
				Trains.trigger("remove",k,dataSourceName);
			}
		}

		if(data.missions){
			for(k in data.missions){
				Trains.missions[k] = data.missions[k];
				Trains.trigger("add",k,data.missions[k],dataSourceName);
			}
		}
	} 
};
observable(Trains);