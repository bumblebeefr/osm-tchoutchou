var Train = function(mission){
	this.updated =true;
	for(k in mission){
		this[k] = mission[k];
	}
}

Train.prototype.getTitle = function(){
	return this.brand+" n°"+this.num+" en direction de "+this.terminus;
}
Train.prototype.getPopup = function(){
	return HandlebarsUtil.render('train_popup',this);
}
Train.prototype.isVisible = function(){
	var b = map.getBounds();
	if(this.lng > b._southWest.lng && this.lng < b._northEast.lng){

		if($.trim($("#number_filter").val()).length >0){
			if(this.num.indexOf($.trim($("#number_filter").val()))>-1){
				return true;
			}
		}else{
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
}

Train.prototype.updateAngle = function(){
	if('angle' in this && this.id_mission in Missions.markers){
		$(Missions.markers[this.id_mission]._icon).find("img").css({"transform":"rotate("+this.angle+"deg)","display":"block"});
	}else{
		$(Missions.markers[this.id_mission]._icon).find("img").css({"display":"none"});
	}
}
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
}
Train.prototype.removeMarker = function(){
	if(this.id_mission in Missions.markers){
		map.removeLayer(Missions.markers[this.id_mission]);
		delete(Missions.markers[this.id_mission]);
	}
}