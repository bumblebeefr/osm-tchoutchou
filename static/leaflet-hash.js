(function(window) {
	var HAS_HASHCHANGE = (function() {
		var doc_mode = window.documentMode;
		return ('onhashchange' in window) &&
			(doc_mode === undefined || doc_mode > 7);
	})();

	L.Hash = function(map) {
		this.onHashChange = L.Util.bind(this.onHashChange, this);

		if (map) {
			this.init(map);
		}
	};
	L.Hash.args = {};
	L.Hash.deserialize = function(hash){
		var output = {};
		if(hash == undefined || hash == null || hash.length == 0 || hash == "#"){
			hash = document.location.hash;
		}
		if(hash){
			if(hash.indexOf('#') === 0) {
				hash = hash.substr(1);
			}
			var h = hash.split("&");
			for(i in h){
				var prop = h[i].split("=");
				if(prop.length == 2){
					output[unescape(prop[0])] = unescape(prop[1]);
				}else{
					if(prop.length == 1){
						output[unescape(prop[0])] = "";
					}
				}
			}
		}
		return output;
	};

	L.Hash.serialize = function(o){
		var h = "#";
		for(k in o){
			if(h != "#"){
				h += "&";
			}
			h += escape(k)+ "=" + escape(o[k]);
		}
		return h;
	};

	L.Hash.setArg = function(name,value){
		var args = L.Hash.deserialize();
		args[name] = value;
		L.Hash.replace(args);
		
	};
	
	L.Hash.removeArg = function(name){
		var args = L.Hash.deserialize();
		delete(args[name]);
		L.Hash.replace(args);
	};
	
	L.Hash.replace = function(args){
		var hash = L.Hash.serialize(args);
		location.replace(hash);
		L.Hash.args = args;
		L.Hash.lastSetHash = hash;
	};
	
	L.Hash.parseHash = function(hash) {
		var args = L.Hash.deserialize();
		if (('lat' in args) && ('lng' in args) && ('zoom' in args)) {
			var zoom = parseInt(args.zoom, 10),
			lat = parseFloat(args.lat),
			lon = parseFloat(args.lng);
			if (isNaN(zoom) || isNaN(lat) || isNaN(lon)) {
				return false;
			} else {
				return {
					center: new L.LatLng(lat, lon),
					zoom: zoom
				};
			}
		} else {
			return false;
		}
	};

	L.Hash.formatHash = function(map) {
		var center = map.getCenter(),
		    zoom = map.getZoom(),
		    precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2));

		var args = L.Hash.deserialize();
		args['lat'] = center.lat.toFixed(precision);
		args['lng'] = center.lng.toFixed(precision);
		args['zoom'] = zoom;
		
		return L.Hash.serialize(args);
	},

	L.Hash.prototype = {
		map: null,
		lastHash: null,

		parseHash: L.Hash.parseHash,
		formatHash: L.Hash.formatHash,

		init: function(map) {
			this.map = map;

			// reset the hash
			this.lastHash = null;
			this.onHashChange();

			if (!this.isListening) {
				this.startListening();
			}
		},

		removeFrom: function(map) {
			if (this.changeTimeout) {
				clearTimeout(this.changeTimeout);
			}

			if (this.isListening) {
				this.stopListening();
			}
			this.map = null;
		},

		onMapMove: function() {
			// bail if we're moving the map (updating from a hash),
			// or if the map is not yet loaded

			if (this.movingMap || !this.map._loaded) {
				return false;
			}

			var hash = this.formatHash(this.map);
			if (this.lastHash != hash) {
				L.Hash.replace(L.Hash.deserialize(hash));
				this.lastHash = hash;
			}
		},

		movingMap: false,
		update: function() {
			var hash = location.hash;
			if (hash === this.lastHash) {
				return;
			}
			var parsed = this.parseHash(hash);
			if (parsed) {
				this.movingMap = true;

				this.map.setView(parsed.center, parsed.zoom);

				this.movingMap = false;
			} else {
				this.onMapMove(this.map);
			}
		},

		// defer hash change updates every 100ms
		changeDefer: 100,
		changeTimeout: null,
		onHashChange: function() {
			var args =  L.Hash.deserialize();
			if(typeof $ == 'function'){
				var changedValues = {};
				for(k in args){
					if(args[k] != L.Hash.args[k]){
						changedValues[k] = args[k];
					}
				}
				var deleted = _.omit(L.Hash.args,_.keys(args));
				for(k in deleted ){
					changedValues[k] = null;
				}
				$("body").trigger( "hashchange", [args,L.Hash.args,L.Hash.lastSetHash != location.hash,changedValues] );
			}
			L.Hash.args = args;
			// throttle calls to update() so that they only happen every
			// `changeDefer` ms
			if (!this.changeTimeout) {
				var that = this;
				this.changeTimeout = setTimeout(function() {
					that.update();
					that.changeTimeout = null;
				}, this.changeDefer);
			}
		},

		isListening: false,
		hashChangeInterval: null,
		startListening: function() {
			this.map.on("moveend", this.onMapMove, this);

			if (HAS_HASHCHANGE) {
				L.DomEvent.addListener(window, "hashchange", this.onHashChange);
			} else {
				clearInterval(this.hashChangeInterval);
				this.hashChangeInterval = setInterval(this.onHashChange, 50);
			}
			this.isListening = true;
		},

		stopListening: function() {
			this.map.off("moveend", this.onMapMove, this);

			if (HAS_HASHCHANGE) {
				L.DomEvent.removeListener(window, "hashchange", this.onHashChange);
			} else {
				clearInterval(this.hashChangeInterval);
			}
			this.isListening = false;
		}
	};
	L.hash = function(map) {
		return new L.Hash(map);
	};
	L.Map.prototype.addHash = function() {
		this._hash = L.hash(this);
	};
	L.Map.prototype.removeHash = function() {
		this._hash.removeFrom();
	};
})(window);
	