//Configration of each datasource
var DataSourceConfig = {
	'national' : new TrainDataSource({
		'name' : 'national',
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '2'
		},
		'refreshDelay' : 10*1000,
	}),
	'regional' : new TrainDataSource({
		'name' : 'regional',
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '1'
		},
		'refreshDelay' : 10*1000
	}),
	'idf' : new TrainDataSource({
		'name' : 'idf',
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '3'
		},
		'refreshDelay' : 10*1000
	}),
	'toulouse'  : new TrainDataSource({
		'name' : 'toulouse',
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '4'
		},
		'refreshDelay' : 10 * 1000
	}),
	'irishrail'  : new TrainDataSource({
		'name' : 'irishrail',
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '7'
		},
		'refreshDelay' : 10 * 1000
	}),
};
