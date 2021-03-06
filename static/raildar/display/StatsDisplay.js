var StatsDisplay = {
	display : function(data, dataSourceName) {
		$("#stats").html(HandlebarsUtil.render('stats', data));

		var pcts = {
			"green" : 0,
			"yellow" : 0,
			"orange" : 0,
			"red" : 0,
			"black" : 0,
			"blue" : 0
		};
		for (k in pcts) {
			if (k in data) {
				pcts[k] = Math.round(data[k] / data.ttl * 1000) / 10;
			}
		}
		makeCamembertStat("camembert", {
			"green" : data["green"],
			"yellow" : data["yellow"],
			"orange" : data["orange"],
			"red" : data["red"],
			"black" : data["black"],
		    "blue" : data["blue"]
		});

	}
};

Stats.on('change',function(stats,dataSourceName){
	StatsDisplay.display(stats, dataSourceName);
});