var worker = this;

importScripts('./Train.js', '../moment.min.js', '../underscore-min.js');

var getJSON = function(url, options) {
	if (options == null) {
		options = {};
	}
	if (!('data' in options) || options.data == undefined) {
		options.data = {};
	}
	options.data['_'] = (new Date()).getTime();
	for (k in options.data) {
		url += (url.indexOf("?") == -1) ? "?" : "&";
		url += encodeURIComponent(k);
		url += "=";
		url += encodeURIComponent(options.data[k]);
	}

	var req = new XMLHttpRequest();
	try{
		req.open('GET', url, true);
		req.responseType = "json";
		req.onreadystatechange = function(aEvt) {
			if (req.readyState == 4) {
				if (req.status == 200) {
					if(typeof options.success == 'function'){
						options.success(req.response,req.statusText,req);
					}
				} else {
					if(typeof options.error == 'function'){
						options.error(req.statusText,req,null);
					}
				}
				if(typeof options.complete == 'function'){
					options.complete(req,req.statusText);
				}
			}
		};
		req.send(null);
	}catch(e){
		if(typeof options.error == 'function'){
			options.error(req.statusText, req,e);
		}
		console.error(e);
	}
};

var handlers = {
	updateFilters : function(options) {

	},

	// options.params : parametre de la requete ajax
	get_circulation : function(options) {
		 getJSON("http://www.raildar.fr/json/get_circulation.json", {
			data : options.data,
			error : function(jqXHR, textStatus, errorThrown) {
				worker.postMessage({
					type : "circulation_error",
					data : {
						'textStatus' : textStatus,
						'errorThrown' : errorThrown.toString()
					}
				});
			},
			success : function(data, textStatus, jqXHR) {
				worker.postMessage({
					type : "circulation_success",
					data : data
				});

			},
			complete : function(jqXHR, textStatus) {
				worker.postMessage({
					type : "circulation_complete",
					data : {textStatus : textStatus}
				});

			}
		});
	}
};
this.addEventListener('message', function(e) {
	if (e.data.cmd in handlers) {
		handlers[e.data.cmd](e.data.parameter);
	} else {
		console.error("No handler defined for cmd " + e.cmd);
	}
}, false);