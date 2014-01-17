//Configration of each datasource
var DataSourceConfig = {
	'national' : new TrainDataSource({
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '2'
		},
		'refreshDelay' : 100*1000,
		'center' : {
			'lat' : 46.81,
			'lng' : 6.88
		},
		'minZoom' : 5,
		'maxZoom' : 8,
		'layerName' : 'national'
	}),
	'regional' : new TrainDataSource({
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '1'
		},
		'refreshDelay' : 100*1000,
		'center' : {
			'lat' : 46.81,
			'lng' : 6.88
		},
		'minZoom' : 5,
		'maxZoom' : 8,
		'layerName' : 'regional'
	}),


	'idf' : new TrainDataSource({
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '3'
		},
		'refreshDelay' : 100*1000,
		'center' : {
			'lat' : 48.854,
			'lng' : 2.348
		},
		'minZoom' : 7,
		'maxZoom' : null,
		'layerName' : 'idf'
	}),
	'toulouse'  : new TrainDataSource({
		'url' : 'http://raildar.fr/json/get_circulation',
		'urlParams' : {
			'id_source' : '4'
		},
		'refreshDelay' : 100 * 1000,
		'center' : {
			'lat' : 43.621,
			'lng' : 1.472
		},
		'minZoom' : 7,
		'maxZoom' : null,
		'layerName' : 'toulouse'
	}),
};

DataSourceConfig.getNamesBy = function(fieldName,values){
	if(!_.isArray(values)){
		values = [values];
	}
	return _.reduce(DataSourceConfig,function(memo,datasource,name){
			if(_.contains(values,datasource[fieldName])) memo.push(name);
			return memo;
		},[]);
};