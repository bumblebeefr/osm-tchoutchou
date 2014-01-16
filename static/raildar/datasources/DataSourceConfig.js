//Configration of each datasource
var DataSourceConfig = {
	'national' : new TrainDataSource({
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '1'
		},
		'center' : {
			'lat' : 46.81,
			'lng' : 6.88
		},
		'minZoom' : 5,
		'maxZoom' : null,
		'refreshDelay' : 10*1000
	}),
	'regional' : new TrainDataSource({
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '2'
		},
		'center' : {
			'lat' : 46.81,
			'lng' : 6.88
		},
		'minZoom' : 5,
		'maxZoom' : null,
		'refreshDelay' : 10*1000
	}),


	'idf' : new TrainDataSource({
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '3'
		},
		'center' : {
			'lat' : 48.854,
			'lng' : 2.348
		},
		'minZoom' : 7,
		'maxZoom' : null,
		'refreshDelay' : 10*1000
	}),
	'toulouse'  : new TrainDataSource({
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '4'
		},
		'center' : {
			'lat' : 43.621,
			'lng' : 1.472
		},
		'minZoom' : 7,
		'maxZoom' : null,
		'refreshDelay' : 10*1000
	}),
//	'stats' : {
//
//	}
};