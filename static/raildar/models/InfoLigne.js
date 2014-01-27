/*
 * Objet Infoligne (liste des arrets et retards eventuels d'un train)
 * train : l'objet Train dont on récupère la liste des arrêts
 */
function InfoLigne(train){
	var self=this;
	self.train=train;
	self.idMission=train.id_mission;
	self.data=null;
	

	self.get=function(){
		
		jQuery.ajax("http://www.raildar.fr/json/get_mission",{
				async : true,
				cache : false,
				data : {"id_mission":self.idMission},	
				error : function(jqXHR,textStatus,errorThrown){
					if(console && console.error){
						console.error("Error when loading Infoligne for mission : "+self.idMission,jqXHR);
					}
					self.trigger("error",jqXHR,self.idMission);
						
				},
				success : function(data, textStatus, jqXHR){
					self.data=data;
					self.trigger("load",data , self.idMission);
				},
				complete : function(){
					self.trigger("complete");
				}
		});
	};
	
	self.errorDisplay=function(jqXHR){
		bootbox.alert("Erreur de récupération des données de la mission ("+jqXHR.status+")");
	}
	
	self.display=function(data){
		var mission=self.train;
		data["txtInfoTrain"]=mission["txtInfoTrain"];
		var nextGareAtteinte=false;
		
		
		$.each(data.arrets,function(index,arret){
			//determine ou on en est dans le circuit
			arret["arret_depasse"]=true;
			if (! nextGareAtteinte && arret.id_gare== mission.id_next_gare){
				nextGareAtteinte=true;
				arret["is_next_gare"]=true;
				arret["human_time_to_gare"]="(dans "+mission.human_time_to_next_gare+")";								;
				arret["arret_depasse"]=false;
				arret["minutes_to_gare"]=mission.minutes_to_next_gare
			}
			if (nextGareAtteinte){
				arret["arret_depasse"]=false;
			}
			
										
			if (arret.minutes_retard<0){
				arret["classe_retard"]="arret_black";
			} else if (arret.minutes_retard<5){
				arret["classe_retard"]="arret_green"
			} else if (arret.minutes_retard<15){
				arret["classe_retard"]="arret_yellow"
			} else if (arret.minutes_retard<30){
				arret["classe_retard"]="arret_orange"
			} else {
				arret["classe_retard"]="arret_red"
			}
			
			if (arret["time_theorique"]){
				var retard=0;
				if (arret["minutes_retard"] && arret["minutes_retard"]>=0){
					retard=moment.duration(parseInt( arret["minutes_retard"]),"minutes");
				}
				arret["horaire"]=moment(arret["time_theorique"]).add(retard).format("HH:mm");		
				arret["horaireTheorique"]=moment(arret["time_theorique"]).format("HH:mm");		
			} else {
				arret["horaire"]="NC";
			}
		});
		
		bootbox.alert(HandlebarsUtil.render('infoLigne',data), function() {});
	}
	
	// Enable MVP pattern
	observable(self);
	 
	// display infoligne on load
	self.on("load", function(data,idMIssion) {
		self.display(data);
	})
	
	//display error on error
	self.on("error", function(jqXHR) {
		self.errorDisplay(jqXHR);
	})
	
	// à la création d'une InfoLigne, on charge les données directement
	self.get();
};
	
	
