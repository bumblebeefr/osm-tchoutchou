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


var Train = function(mission){
	this.lng = mission.geometry.coordinates[0];
	this.lat = mission.geometry.coordinates[1];
	
	for(k in mission.properties){
		this[k] = mission.properties[k];
	}
	
	if(this.type in statuses){
		this.status = statuses[this.type];
	}else{
		this.status = "unknown";
	}
	
	if(this.brand in train_types){
		this.train_type = train_types[this.brand];
	}else{
		this.train_type = "unknown";
	}
		
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
		if( Tracking && Tracking.running == 2 ){ //when tracking : hide other trains
			return Tracking.id_mission == this.num;
			
		}else
		 if($.trim($("#number_filter").val()).length >0){ //if filtering on train number show only matchin trains
			if(this.num.indexOf($.trim($("#number_filter").val()))>-1){
				return true;
			}
			
		}else{//filtering on train types and status
			if(this.lat > b._southWest.lat && this.lat < b._northEast.lat){
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
		var angleRad=angle/360*2*Math.PI;
		var cosA=Math.cos(angleRad);
                var cosAmirror=-cosA;
		var sinA=Math.sin(angleRad);
                var sinAmirror=-sinA
 		var marker=$(Missions.markers[this.id_mission]._icon.firstChild);
		if (angle>90 && angle < 270 ) {
                         marker.css({"transform":"matrix("+cosA+", "+sinA+", "+sinA+", "+(-cosA)+", 0, 0)","display":"block"});
			//marker.css({"transform":"matrix("+(cosA)+", "+(sinA)+", "+(-sinA)+", "+(cosA)+", 0, 0)","display":"block"});

                } else {
			marker.css({"transform":"matrix("+cosA+", "+sinA+", "+(-sinA)+", "+cosA+", 0, 0)","display":"block"});
		}
		//marker.css({"transform":"rotate("+angle+"deg)","display":"block"});
	}
};


//Show, update hide a train marker
Train.prototype.drawMarker = function(forceUpdate){
	if(this.id_mission in Missions.markers){
		if(this.isVisible()){
			//update du marker visible
			if(forceUpdate){
				Missions.markers[this.id_mission].setLatLng(L.latLng(this.lat,this.lng));
				Missions.markers[this.id_mission].setIcon(Missions.icons[this.type]);
				if(Missions.markers[this.id_mission].getPopup()){
					Missions.markers[this.id_mission].setPopupContent(this.getPopup());
				}
				this.updateAngle();
				Missions.markers[this.id_mission].update();
			}
		}else{
			//supression du marker puisque non visible
			this.removeMarker();
		}
	}else{
		if(this.isVisible()){
			
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
			this.updateAngle();
		}
	}
};

Train.prototype.removeMarker = function(){
	if(this.id_mission in Missions.markers){
		map.removeLayer(Missions.markers[this.id_mission]);
		delete(Missions.markers[this.id_mission]);
	}
};
