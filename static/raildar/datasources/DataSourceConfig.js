//Configration of each datasource
var DataSourceConfig = {
	'national' : new TrainDataSource({
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '2'
		},
		'refreshDelay' : 100*1000,
	}),
	'regional' : new TrainDataSource({
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '1'
		},
		'refreshDelay' : 100*1000
	}),
	'idf' : new TrainDataSource({
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '3'
		},
		'refreshDelay' : 100*1000
	}),
	'toulouse'  : new TrainDataSource({
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '4'
		},
		'refreshDelay' : 100 * 1000
	}),
};
