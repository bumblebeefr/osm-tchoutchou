//Configration of each datasource
var DataSourceConfig = {
	'national' : {
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
		'dataSouceObject' : new TrainDataSource(),
		'refreshDelay' : 10
	},
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