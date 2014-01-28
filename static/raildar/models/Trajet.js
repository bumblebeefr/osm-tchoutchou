/*
 * ObjetTrajet (polyligne suivie théoriquement par le train)
 */

function Trajet(train) {
	var self = this;
	self.train = train;
	self.idTrain = train.id_train;
	self.data = null;

	self.get = function() {
		var idTrain = self.idTrain;
		if (idTrain) {
			DisplayManager.addLoading(1);
			jQuery.ajax("http://www.raildar.fr/json/show_trajet", {
				async : true,
				cache : false,
				data : {
					"id_train" : idTrain
				},
				complete : function() {
					self.trigger("complete");
					DisplayManager.addLoading(-1);
				},
				error : function(jqXHR, textStatus, errorThrown) {
					if (console && console.error) {
						console.error("Error when loading Trajet for Train  " + idTrain, jqXHR);
					}
					self.trigger("error", jqXHR, self.idTrain);
				},
				success : function(data, textStatus, jqXHR) {
					self.data = data;
					self.trigger("load", data, self.idTrain);

				}
			});
		}
	};

	self.errorDisplay = function(status) {
		bootbox.alert("Erreur de récupération des données de la mission (" + jqXHR.status + ")");
	};

	self.errorGarePopupDisplay = function(status) {
		bootbox.alert("Erreur de récupération des données de la gare (" + jqXHR.status + ")");
	};

	self.getGarePopup = function(circle, feature) {
		var idGare = feature.properties.id_gare;
		if (idGare) {
			jQuery.ajax("http://www.raildar.fr/json/next_missions", {
				async : true,
				cache : false,
				data : {
					"id_gare" : idGare
				},
				complete : function() {
					self.trigger("complete");
					DisplayManager.addLoading(-1);
				},
				error : function(jqXHR, textStatus, errorThrown) {
					if (console && console.error) {
						console.error("Error when loading Gare Popup (next_missions) for Gare  " + idGare, jqXHR);
					}
					self.trigger("gare.error", jqXHR, self.idGare);
				},
				success : function(data, textStatus, jqXHR) {
					var newData = {};
					newData["trains"] = data;
					$.each(newData.trains, function(index, train) {
						if (train.minutes_retard < 0) {
							train["classe_retard"] = "arret_black";
						} else if (train.minutes_retard < 5) {
							train["classe_retard"] = "arret_green"
						} else if (train.minutes_retard < 15) {
							train["classe_retard"] = "arret_yellow"
						} else if (train.minutes_retard < 30) {
							train["classe_retard"] = "arret_orange"
						} else {
							train["classe_retard"] = "arret_red"
						}

						if (train["time_theorique"]) {
							var retard = 0;
							if (train["minutes_retard"] && train["minutes_retard"] >= 0) {
								retard = moment.duration(parseInt(train["minutes_retard"]), "minutes");
							}
							train["horaire"] = moment(train["time_theorique"]).add(retard).format("HH:mm");
							train["horaireTheorique"] = moment(train["time_theorique"]).format("HH:mm");
						} else {
							train["horaire"] = "NC";
						}
					});
					newData.gare = feature.properties;

					self.trigger("gare.load", newData, circle);
				}
			});
		}

	};
	self.displayGarePopup = function(data, circle) {
		var popup_contenu = HandlebarsUtil.render('gare_popup', data);
		circle.bindPopup(popup_contenu);
	};

	self.display = function(data) {

		trajetsLayerGroup.clearLayers();

		var ligneStyle = {
			color : '#000',
			weight : 5,
			opacity : 0.8
		};
		var gareStyle = {
			radius : 12,
			fillColor : "#c000FF",
			color : "#c000FF",
			weight : 4,
			opacity : 0.8,
			fillOpacity : 0.2
		};

		// calcul un rayon de cercle pour les gares en fonction du zoom de la
		// carte
		var getRadiusFromZoom = function() {
			return (map.getZoom() * map.getZoom() / 5);
		};

		var style = function(feature) {
			switch (feature.geometry.type) {
			case 'LineString':
				return ligneStyle;
			case 'Point': {
				gareStyle.radius = getRadiusFromZoom();
				return gareStyle;
			}
			}
		};

		var ligne = L.geoJson(data.features, {
			style : style,
			pointToLayer : function(feature, latlng) {
				var circle = L.circleMarker(latlng);
				$(circle).on("click", function() {
					self.getGarePopup(circle, feature);
				});

				map.on('zoomend', function() {
					console.log([ "new radius", getRadiusFromZoom() ].join(":"));
					circle.setRadius(getRadiusFromZoom());
				});
				return circle;
			}
		});

		trajetsLayerGroup.addLayer(ligne);
		ligne.bringToFront();

		/*
		 * var gares=[]; $.each(data.markers.marker,function (index,pt){ var
		 * cercle = L.circle( L.latLng(pt.lat,pt.lng),
		 * 100,{color:"#c000FF",fillcolor:'#c000FF',weight:12,opacity:0.8} );
		 * trajetsLayerGroup.addLayer(cercle); cercle.bringToFront();
		 * gares.push( cercle); });
		 */

		// var popup_contenu=HandlebarsUtil.render('verif_trajet_popup',data);
		// trajetsLayerGroup.bindPopup(popup_contenu);
		// TrajetsLigne={};
		// TrajetsLignes[idTrain]={"ligne":ligne,"gares":gares};
		// //succes = suppression du bouton de demande de trajet
		// if(btnSource) {$(btnSource).remove();}
	};

	// Enable MVP pattern
	observable(self);

	// display infoligne on load
	self.on("load", function(data, idTrain) {
		self.display(data);
	});

	// display error on error
	self.on("error", function(jqXHR) {
		self.errorDisplay(jqXHR);
	});

	// display infoligne on load
	self.on("gare.load", function(data, circle) {
		self.displayGarePopup(data, circle);
	});

	// display error on error
	self.on("gare.error", function(jqXHR) {
		self.errorGarePopupDisplay(jqXHR);
	});

	// à la création d'une InfoLigne, on charge les données directement
	self.get();

}
