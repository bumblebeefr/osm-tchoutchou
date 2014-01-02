importScripts('./Train.js','../moment.min.js')

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
this.addEventListener('message', function(e) {
	console.log(e.data);
	var t = new Train(train);
	this.postMessage({
		train : t
	});
}, false);