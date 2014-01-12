//Configration of each datasource
var DataSourceConfig = {
	'national' : {
		'url' : 'http://raildar.fr/json/get_circulation',
		'params' : {
			'source' : 'garesenmouvement'
		},
		'center' : {
			'lat' : 46.81,
			'lng' : 6.88
		},
		'minZoom' : 5,
		'maxZoom' : null,
		'obj' : Train,
		'refreshDelay' : 10
	},
	'regional' : {
		'url' : 'http://raildar.fr/json/get_circulation',
		'params' : {
			'source' : 'infolignes'
		},
		'center' : {
			'lat' : 46.81,
			'lng' : 6.88
		},
		'minZoom' : 5,
		'maxZoom' : null,
		'obj' : Train,
		'refreshDelay' : 10

	},
	'idf' : {
		'url' : 'http://raildar.fr/json/get_circulation',
		'params' : {
			'source' : 'transilien'
		},
		'center' : {
			'lat' : 46.81,
			'lng' : 6.88
		},
		'minZoom' : 5,
		'maxZoom' : null,
		'obj' : Train,
		'refreshDelay' : 10

	},
	'toulouse' : {
		'url' : 'http://raildar.fr/json/get_circulation',
		'params' : {
			'source' : 'tisseo'
		},
		'center' : {
			'lat' : 46.81,
			'lng' : 6.88
		},
		'minZoom' : 5,
		'maxZoom' : null,
		'obj' : Train,
		'refreshDelay' : 10

	},
	'stats' : {

	}
};