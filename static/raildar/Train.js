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
    'TER': 'simple'
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
		this.train_type = train_types[this.brand]
	}else{
		this.train_type = "unknown"
	}
	
	this.lib_pos_type=position_type[this.pos_type];
	this.human_last_check=(this.last_check)?moment(this.last_check).format("LLL"):"Inconnue";	
	var minutes=parseInt(this.minutes_to_next_gare);
	this.human_time_to_next_gare=moment.duration(minutes,"minutes").humanize();
};

Train.prototype.getTitle = function(){
	return this.brand+" n°"+this.num+" en direction de "+this.terminus;
};

Train.prototype.getPopup = function(){
	return HandlebarsUtil.render('train_popup',this);
};

Train.prototype.isVisible = function(){
	var b = map.getBounds();
	if(this.lng > b._southWest.lng && this.lng < b._northEast.lng){
		if(this.lat > b._southWest.lat && this.lat < b._northEast.lat){
			if(Tracking.running == 2 && Tracking.id_mission !=null){
				return this.id_mission == Tracking.id_mission;
			}else if($.trim($("#number_filter").val()).length >0){
				if(this.num.indexOf($.trim($("#number_filter").val()))>-1){
					return true;
				}
			}else{
				if(($("input[name='"+this.train_type+"']:checked").length >0)){
					if(($("input[name='"+this.status+"']:checked").length >0)){
						return true;
					}
				}
			}
		}
	}
	return false;
};



Train.prototype.updateAngle = function(){
	if(this.id_mission in Missions.markers){
		var angle = (180+parseInt(this.heading))%360;
//		var angleRad=angle/360*2*Math.PI;
//		var cosA=Math.cos(angleRad);
//                var cosAmirror=-cosA;
//		var sinA=Math.sin(angleRad);
//                var sinAmirror=-sinA
 		var marker=$(Missions.markers[this.id_mission]._icon.firstChild);
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
Train.prototype.drawMarker = function(forceUpdate){
	if(this.id_mission in Missions.markers){
		if(Train.isVisible(this)){
			//update du marker visible
			if(forceUpdate){
				Missions.markers[this.id_mission].setLatLng(L.latLng(this.lat,this.lng));
				Missions.markers[this.id_mission].setIcon(Missions.icons[this.type]);
				if(Missions.markers[this.id_mission].getPopup()){
					Missions.markers[this.id_mission].setPopupContent(this.getPopup());
				}
				Train.updateAngle(this);
				Missions.markers[this.id_mission].update();
			}
		}else{
			//supression du marker puisque non visible
			Train.removeMarker(this);
		}
	}else{
		if(Train.isVisible(this)){
			//ajout du marker si visible
			Missions.markers[this.id_mission] = L.marker(L.latLng(this.lat,this.lng),{
				icon:Missions.icons[this.type],
				title : this.getTitle(),
			}).addTo(map);
			var train = this;
			Missions.markers[train.id_mission].on('mouseover',function(){
				$("#mission_detail").html(train.getPopup()).show();
				$("#mission_detail_help").hide();
			}).on('mouseout',function(){
				$("#mission_detail").html("").hide();	
				$("#mission_detail_help").show();
			}).on('click',function(){
				if(!Missions.markers[train.id_mission].getPopup()){
					Missions.markers[train.id_mission].bindPopup(train.getPopup()).openPopup(); 
				}
			}).on('popupclose',function(){
				Missions.markers[train.id_mission].unbindPopup(); 
			}).on('remove',function(){
				delete(train);
			});
			Train.updateAngle(this);
		}
	}
};

Train.prototype.removeMarker = function(){
	if(this.id_mission in Missions.markers){
		map.removeLayer(Missions.markers[this.id_mission]);
		delete(Missions.markers[this.id_mission]);
	}
};



//Permet d'appeler les methodes d'instace sur un objet qui ne les a pas de facon 
// 'statique' en passant l'objet en premier argument. Le but est de pouvoir facilement 
// recuperer dans la pages des Train instanciés dans un webwoker, et d'appeler ses methode en faisant
// par exemple Train.drawMarker(montrain,true); au lieu de montrain.drawMarker(true);

function addTrainStaticMethod(methodName){
	Train[methodName] = function(){
		var _this = arguments[0];
		var _arguments = [];
		for(var i=1;i<arguments.length;i++){
			_arguments[i-1] = arguments[i];
		}
		return Train.prototype[methodName].apply(_this,_arguments);
	};	
}

for(method in Train.prototype){
	addTrainStaticMethod(method);
}