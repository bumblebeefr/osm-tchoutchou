//Configration of each datasource
var DataSourceConfig = {
	'national' : new TrainDataSource({
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'source' : 'garesenmouvement'
		},
		'center' : {
			'lat' : 46.81,
			'lng' : 6.88
		},
		'minZoom' : 5,
		'maxZoom' : null,
		'refreshDelay' : 10*1000
	}),
//	'regional' : {

//
//	},
//	'idf' : {

//
//	},
//	'toulouse' : {

//	},
//	'stats' : {
//
//	}
};