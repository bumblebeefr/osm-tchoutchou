var Trains = {
	missions : {},
	newData : function(data, dataSourceName){
		Trains.trigger("haveNewData",data,dataSourceName);
		if(data.remove){
			for(k in data.remove){
				delete(Trains.missions[k]);
				Trains.trigger("remove",k,dataSourceName);
			}
		}

		if(data.missions){
			for(k in data.missions){
				Trains.missions[data.missions[k].id_mission] = data.missions[k];
				Trains.trigger("add",data.missions[k].id_mission,data.missions[k],dataSourceName);
			}
		}
	} 
};
observable(Trains);