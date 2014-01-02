var window = {
		location :"",
		document : {
			documentElement : {},
			createElement : function(){}
		}
};
var document = window.document;

importScripts('./Train.js','../moment.min.js','../underscore-min.js');

var train = {
	"geometry" : {
		"coordinates" : [ 2.4667, 49.1679 ],
		"type" : "Point"
	},
	"type" : "Feature",
	"properties" : {
		"next_gare" : "Compiegne",
		"id_mission" : "154696",
		"num" : "2315",
		"last_update" : "2014-01-02 17:54:06",
		"heading" : "145",
		"brand" : "Intercite",
		"retard" : "0",
		"minutes_to_next_gare" : "20",
		"pos_type" : "1",
		"id_next_gare" : "1271",
		"last_check" : "2014-01-02 17:51:01",
		"terminus" : "Cambrai Ville",
		"id_terminus" : "1077"
	}
};
var handlers = {
	updateFilters : function(options) {
		
	},
	
	//options.params : parametre de la requete ajax
	get_circulation : function(options){
//		jQuery.ajax("http://www.raildar.fr/json/get_circulation.json",{
//			async : true,
//			cache : false,
//			data : options.params,	
//			error : function(jqXHR,textStatus,errorThrown){
//				this.postMessage({
//					type : "error",
//					data : {
//						'jqXHR' : jqXHR,
//						'textStatus' : textStatus,
//						'errorThrown' : errorThrown
//					}
//				});
//			},
//			success : function(data, textStatus, jqXHR){
//				this.postMessage({
//					type : "circulation",
//					data : data
//				});
//				
//			}
//		});
	}	
};
this.addEventListener('message', function(e) {
	console.log(e.data.cmd);
//	var t = new Train(train);
//	this.postMessage({
//		train : t
//	});
	if(e.data.cmd in handlers){
		handlers[e.data.cmd](e.data.parameter);
	}else{
		console.error("No handler defined for cmd "+e.cmd);
	}
}, false);