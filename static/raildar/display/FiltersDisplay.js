//fist hashchange event have to be managed, even if is from inside the ap, in order to initialize the context.
var hashInitilized = false;

// get bounds filters object.
function getMapBoundsFilters() {
	return{
		bounds : map.getBounds(),
		zoom : map.getZoom(),
		center : map.getCenter()
	};
}

// Update bounds filters as 'map' key in filters.
function setMapBoundsFilters() {
	Filters.set('map',getMapBoundsFilters(), 'ui');
}



$(function() {
	/**
	 * ====================================================================================================================================
	 * Form Hash args to Filters : Update filters when hash changes
	 * ====================================================================================================================================
	 */
	$("body").on("hashchange", function(event, args, old_args, external, changedValues) {
		if (external || !hashInitilized) {
			console.log("Hash has changed ", (external ? "from outside" : "from inside"), args, old_args, changedValues);
			hashInitilized = true;
			var newFilters = _.omit(changedValues, 'zoom', 'lat', 'lng');

			if ('zoom' in changedValues || 'lat' in changedValues || 'lng' in changedValues) {
				newFilters['map'] = getMapBoundsFilters();
			}

			if (!('train_layer' in args)) {
				newFilters.train_layer = $("input.train_layer:checked").val();
			} else {
				if ($("input.train_layer[value=" + args.train_layer + "]").length > 0) {
					$("input.train_layer[value=" + args.train_layer + "]").prop('checked', true);
				} else {
					$("input.train_layer[value=national]").prop('checked', true);
				}
				newFilters.train_layer = args.train_layer;
			}

			$.each(_.keys(DisplayManager.dataLayers.trains), function(i, v) {
				var val = v + "_types";
				if (val in args && args[val] != old_args[val]) {
					newFilters[val] = args[val];
				}
			});

			if ('visible' in args) {
				if (args.visible != old_args.visible) {
					var visible = args.visible.split("/");
					if (!_.contains(visible, 'ok') && !_.contains(visible, 'delayed') && !_.contains(visible, 'cancelled')) {
						visible.push('ok', 'delayed', 'cancelled');
					}
					newFilters.visible = visible.join("/");
				}
			}

			// Filtre par n° de train
			if (args.num != old_args.num) {
				newFilters.num_train = args.num;
			}

			// Gestion du nocontrol
			// FIXME a mettre ailleur
			if (args.nocontrol != old_args.nocontrol) {
				if ('nocontrol' in args && args['nocontrol'] != null) {
					DEBUG.refreshMissions = false;
					$("body").addClass('nocontrols');
					$(".button").hide();
					$("#detail_block").hide();
					$("#histo_block").hide();
					$("#type_selection").hide();
					$("#about	").hide();
					$('#sidebar').show();
					try {
						layersControl.removeFrom(map);
						scaleControl.removeFrom(map);
						attributionControl.removeFrom(map);
						zoomControl.removeFrom(map);
					} catch (e) {
					}
				} else {
					DEBUG.refreshMissions = true;
					$("body").removeClass('nocontrols');
					$(".button").show();
					$("#histo_block").show();
					$("#type_selection").show();
					$("#about").show();
					try {
						layersControl.addTo(map);
						scaleControl.addTo(map);
						attributionControl.addTo(map);
						zoomControl.addTo(map);
					} catch (e) {
					}
					if (!L.Browser.touch && !!L.Browser.mobile) {
						$("#detail_block").show();
					}
				}
			}

			if(Filters._initialized){
				Filters.set(newFilters, 'hash');
			}else{
				Filters.init(newFilters);
			}	

		};
	});
	/**
	 * ====================================================================================================================================
	 * From UI to filters : Update filters from User Interface interaction
	 * ====================================================================================================================================
	 */


	map.on('zoomend', setMapBoundsFilters).on('dragend', setMapBoundsFilters).on('moveend', setMapBoundsFilters);
	$(window).resize(setMapBoundsFilters);

	$("input.train_layer").change(function() {
		var train_layer = $("input.train_layer:checked").val();
		Filters.set("train_layer", train_layer, 'ui');
	});

	$("input[type=checkbox].filter").change(function() {
		var arr = [];
		$("input[type=checkbox].filter:checked").each(function() {
			arr.push($(this).attr("value"));
		});
		Filters.set("visible", arr.join('/'), 'ui');
	});

	$("#number_filter").change(function() {
		var num_train = $.trim($(this).val());
		if (num_train.length > 0) {
			Filters.set("num_train", num_train, 'ui');
		} else {
			Filters.set("num_train", null, 'ui');
		}
	});

	$("input.train_filter").change(function() {
		var name = $(this).attr('name');
		var visible = [];
		$("input[name=" + name + "]:checked").each(function() {
			visible.push($(this).attr('value'));
		});
		Filters.set(name, visible.join("/"), 'ui');
	});
});

/**
 * ====================================================================================================================================
 * From Filters to UI : Update the User Interface from filter, especially when
 * the changes comes from a hash modification.
 * ====================================================================================================================================
 */
Filters.on('ui-change:train_layer hash-change:train_layer', function(evt,newValue, oldValue, from) {
	console.debug("train_layer change", newValue, oldValue, from);
	if (newValue != null) {
		$("fieldset.train_types").hide();
		$("#" + newValue + "_train_layer fieldset.train_types").show();
	}
});

Filters.on('hash-change:visible', function(newValue, oldValue, from) {
	$("input[type=checkbox].filter").each(function() {
		if (_.contains(newValue.split('/'), 'all') || _.contains(newValue.split('/'), $(this).attr('value'))) {
			this.checked = true;
		} else {
			this.checked = false;
		}
	});
});

Filters.on('hash-change:num_train', function(newValue, oldValue, from) {
	$("#number_filter").val(newValue);
});

// Filtres de chaque type de train
$.each(_.keys(DisplayManager.dataLayers.trains), function(i, v) {
	var name = v + "_types";
		Filters.on('hash-change:' + name, function(newValue, oldValue, from) {
		var arr = newValue.split("/");
		$("input[name=" + name + "]").each(function() {
			$(this).attr('checked', ( _.contains(arr, 'all') || _.contains(arr, $(this).attr('value'))));
		});
	});
});

/**
 * ====================================================================================================================================
 * From filters to Hash : Update the URL from filter, especially when the
 * changes comes from User Interface.
 * ====================================================================================================================================
 */
Filters.on('ui-change:train_layer', function(newValue, oldValue, from) {
	L.Hash.setArg("train_layer", newValue);
});

Filters.on('ui-change:visible', function(newValue, oldValue, from) {
	L.Hash.setArg("visible", newValue);
});

Filters.on('ui-change:num_train', function(newValue, oldValue, from) {
	if (newValue != null) {
		L.Hash.setArg("num_train", newValue);
	} else {
		L.Hash.removeArg("num_train");
	}
});

// Filtres de chaque type de train
$.each(_.keys(DisplayManager.dataLayers.trains), function(i, v) {
	var name = v + "_types";
	Filters.on('ui-change:' + name, function(newValue, oldValue, from) {
		L.Hash.setArg(name, newValue);
	});
});
