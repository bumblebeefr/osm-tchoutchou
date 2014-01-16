//=========================================
		var GraphsRegions={
				isActive : false,
				url:"http://www.raildar.fr/json/convert?url=get_circulation.json&regions=yes",
				markers:{},
				regions:{},
				add:function(region){
					GraphsRegions.regions[region.id_region] = region;
					GraphsRegions.drawMarker(region,true);
					return region;
				},
				drawMarker:function(region,forceUpdate){
					if(region.id_region in GraphsRegions.markers){
						if (forceUpdate){					
							GraphsRegions.refresh(GraphsRegions.markers[region.id_region]);
						}
					} else {
						//iconSize doit correspondre a width et heigh du css .camembert_region pour que tout soit centré.
						// la hauteur + petite donne la taille du camebert
						// la largeur plus grande permet d'afficher le nom region sur plus large
						var myIcon= L.divIcon({className: '',iconSize:L.point(130,80), html:"<div id='statRegionIcon_"+region.id_region+"' class='statRegionIcon'><div class='region_titre'>"+region.name+"</div><div  class='camembert_region' id='camembert_region_"+region.id_region+"'></div></div>"});
						var mark=L.marker(region["latLgn"], {icon: myIcon});
						GraphsRegions.markers[region.id_region]=mark;
						mark.addTo(map);
						//graphsRegionsLayerGroup.add(mark);
						makeCamembertStat("camembert_region_"+region.id_region,region.dataGraph);
						if(console && console.error){
							console.log("camembert calculé pour "+ region.id_region +"-"+region.name )
						}
					}
				},
				remove : function(id_region){
					if(id_region in GraphsRegions.markers){
						//graphsRegionsLayerGroup.remove(region);
						map.removeLayer(GraphsRegions.markers[id_region]);
						delete(GraphsRegions.markers[id_region]);
						delete(GraphsRegions.regions[id_region]);
						$("statRegionIcon_"+id_region).remove();
						
					}
				},
				getMarkers:function(){
					return GraphsRegions.markers;
				},
				show:function(layerGroup){
					GraphsRegions.isActive = true;
					$("#icon").addClass("loading");
					$.ajax(GraphsRegions.url,{
						async : true,
						cache : false,
						error : function(jqXHR,textStatus,errorThrown){
							
							if(console && console.error){
								console.error("Error when loading statistiques regions",jqXHR);
							}
							$("#tmp_camemberts").html("<div class='error centered'>Erreur de récupération des stats region ("+jqXHR.status+") <br>"+ errorThrown+"</div>")
							traiteDelaiHisto();
						},
						success : function(data, textStatus, jqXHR){
							$.each(data.markers.region,function(index,region){							
								/*var southWest = L.latLng(region.lat_sw,region.lng_sw);
								var northEast = L.latLng(region.lat_ne, region.lng_ne);
								var bounds = L.latLngBounds(southWest, northEast);
								region["bbox"]=bounds;
								*/
								region["latLgn"]=L.latLng(region.lat,region.lng);
								
								var dataGraph ={"green":0,"yellow":0,"orange":0,"red":0,"black":0};
								if (! (region.trains instanceof Array) ){
									region.trains=[region.trains]
								}
								$.each(region.trains,function(index,retardCount){
									var r=0;
									var c=0;									
									r=retardCount.retard;
									c=parseInt(retardCount.count);
									if (r<0) {
										dataGraph["black"]+=c;
									} else if (r<5) {
										dataGraph["green"]+=c;
									} else if (r<15) {
										dataGraph["yellow"]+=c;
									} else if (r<30) {
										dataGraph["orange"]+=c;
									} else {
										dataGraph["red"]+=c;
									}
								});
								
								region["dataGraph"]=dataGraph;
 								
								GraphsRegions.add(region);
 								
							});
						},
						complete : function(jqXHR, textStatus){
							$("#icon").removeClass("loading");
						}
							
					});
				},
				refresh : function(region){
					if(region.id_region in GraphsRegions.markers){
						GraphsRegions.regions[region.id_region]=region;
						makeCamembertStat("camembert_region_"+region.id_region,region.dataGraph);
					} else {
						
					}

				},
				clear : function(){
					GraphsRegions.isActive = false;
					for(k in GraphsRegions.regions){
						GraphsRegions.remove(k);							
					}	
					//GraphsRegions.markers=[];
				}
		}