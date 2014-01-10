var statuses = {
    "green": "ok",
    "yellow": "delayed",
    "orange": "delayed",
    "red": "delayed",
    "black": 'cancelled'
};

var train_types = {
    'TGV/ICE': 'tgv',
    'TGV': 'tgv',
    'iDTGV': 'tgv',
    'Unknown': 'unknown',
    'TER/IC': 'simple',
    'Thalys': 'thalys',
    'TGV LYRIA': 'tgv',
    'Lunea': 'simple',
    'LER': 'simple',
    'Intercite': 'simple',
    'TER': 'simple',
    'Eurostar': 'eurostar',
    'RER' : 'rer',
    'RATP' : 'rer',
    'Train' : 'transilien'
};

var position_type = {
	1:"GPS théorique",
	2:"extrapolée"	
};


var Train = function(mission){
	this.lng = mission.geometry.coordinates[0];
	this.lat = mission.geometry.coordinates[1];
	
	for(k in mission.properties){
		this[k] = mission.properties[k];
	}
	
	if(this.retard < 0 ){
		this.type="black";
	} else if(this.retard < 5 ){
		this.type="green";
	} else if(this.retard < 15 ){
		this.type="yellow";
	} else if(this.retard < 30 ){
		this.type="orange";
	} else {
		this.type="red";
	} 
	this.status = statuses[this.type];
	
	if(this.brand in train_types){
		this.train_type = train_types[this.brand];
	}else{
		this.train_type = "unknown";
	}
	
	this.lib_pos_type=position_type[this.pos_type];
	this.human_last_check=(this.last_check)?moment(this.last_check).format("LLL"):"Inconnue";	
	var minutes=parseInt(this.minutes_to_next_gare);
	this.human_time_to_next_gare=moment.duration(minutes,"minutes").humanize();
};

Train.getTitle = function(train){
	return train.brand+" n°"+train.num+" en direction de "+train.terminus;
};

Train.getPopup = function(train){
	return HandlebarsUtil.render('train_popup',train);
};

Train.isVisible = function(train){
	var b = TrainFilters.bounds;
	if(train.lng > b._southWest.lng && train.lng < b._northEast.lng){
		if(train.lat > b._southWest.lat && train.lat < b._northEast.lat){
			if(TrainFilters.num_train.length >0){
				if(train.num.indexOf(TrainFilters.num_train)>-1){
					return true;
				}
			}else{
				if(_.contains(TrainFilters.visible,train.train_type)){
					if(_.contains(TrainFilters.visible,train.status)){
						return true;
					}
				}
			}
		}
	}
	return false;
};



Train.updateAngle = function(train){
	if(train.id_mission in Missions.markers){
		var angle = (180+parseInt(train.heading))%360;
//		var angleRad=angle/360*2*Math.PI;
//		var cosA=Math.cos(angleRad);
//                var cosAmirror=-cosA;
//		var sinA=Math.sin(angleRad);
//                var sinAmirror=-sinA
 		var marker=$(Missions.markers[train.id_mission]._icon.firstChild);
//		if (angle>90 && angle < 270 ) {
//                         marker.css({"transform":"matrix("+cosA+", "+sinA+", "+sinA+", "+(-cosA)+", 0, 0)","display":"block"});
//			//marker.css({"transform":"matrix("+(cosA)+", "+(sinA)+", "+(-sinA)+", "+(cosA)+", 0, 0)","display":"block"});
//
//                } else {
//			marker.css({"transform":"matrix("+cosA+", "+sinA+", "+(-sinA)+", "+cosA+", 0, 0)","display":"block"});
//		}
		marker.css({"transform":"rotate("+angle+"deg)","display":"block"});
		//marker.css({"transform":"rotateZ("+angle+"deg)","display":"block"});
	}
};

//Show, update hide a train marker
Train.drawMarker = function(train,forceUpdate){
	if(train.id_mission in Missions.markers){
		//update du marker visible
		if(forceUpdate){
			Missions.markers[train.id_mission].setLatLng(L.latLng(train.lat,train.lng));
			Missions.markers[train.id_mission].setIcon(Missions.icons[train.type]);
			if(Missions.markers[train.id_mission].getPopup()){
				Missions.markers[train.id_mission].setPopupContent(Train.getPopup(train));
			}
			Train.updateAngle(train);
			Missions.markers[train.id_mission].update();
		}
	}else{
		//ajout du marker si visible
		Missions.markers[train.id_mission] = L.marker(L.latLng(train.lat,train.lng),{
			icon:Missions.icons[train.type],
			title : Train.getTitle(train),
		}).addTo(map);
		var train = train;
		Missions.markers[train.id_mission].on('mouseover',function(){
			$("#mission_detail").html(Train.getPopup(train)).show();
			$("#mission_detail_help").hide();
		}).on('mouseout',function(){
			$("#mission_detail").html("").hide();	
			$("#mission_detail_help").show();
		}).on('click',function(){
			if(!Missions.markers[train.id_mission].getPopup()){
				Missions.markers[train.id_mission].bindPopup(Train.getPopup(train)).openPopup(); 
			}
		}).on('popupclose',function(){
			Missions.markers[train.id_mission].unbindPopup(); 
		}).on('remove',function(){
			delete(train);
		});
		Train.updateAngle(train);
	}
};


