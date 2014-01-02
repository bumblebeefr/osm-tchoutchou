

var visitorLat;
var visitorLng;
var auto_userid;
var oldvisitorLat = 0;
var oldvisitorLng = 0;
var gpsFixCount = 0;
var fixStore = [];

function visitorIsMooving(event) {
	var messages = event.data;

	switch (messages.cmd) {
		case 'init':
			auto_userid = messages.parameter;
			setInterval(storageTask, 500);
//			console.log('gps worker firered !');
				break;
		case 'fix':
			var params = messages.parameter.split("&");
			//console.log('gps worker got a message : '+messages.parameter);
			auto_userid = params[0];
			var visitorLat = params[1];
			var visitorLng = params[2];

			if ( ( ( Math.abs(visitorLat - oldvisitorLat) > 0.0003 ) && ( Math.abs(visitorLng - oldvisitorLng) > 0.0003 ) || ( oldvisitorLat == 0 ) ) ) {
//				console.log('store new position : '+messages.parameter);
				fixStore.push(messages.parameter);
				gpsFixCount++;
				oldvisitorLat = visitorLat;
				oldvisitorLng = visitorLng;
			}
			this.postMessage(fixStore.length+'&'+gpsFixCount);
			break;
	}
}

this.addEventListener('message', visitorIsMooving, false);

function storageTask() {
	if ( fixStore.length > 0 ) {
		var sorted = [];
		for (var key in fixStore) {
			if (fixStore.hasOwnProperty(key) && !isNaN(key)) { sorted.push(key); }
		}
		sorted.sort(function(a, b) { return a.localeCompare(b); });
		var key = sorted[0];
		var str = fixStore[key];
		var params = str.split("&");
//		console.log(str);
		var result = httpGet('/locator/gps_fix?auto_userid='+auto_userid+'&lat='+params[1]+'&lng='+params[2]+'&accur='+params[3]+'&alt='+params[4]+'&speed='+params[5]+'&heading='+params[6]+'&id_mission='+params[7]+'&timestamp='+params[8]);

//		console.log(result);
		if ( result.indexOf("OK - ") > -1 ) {
			fixStore.splice(0, 1);
//			console.log('element '+key+' sent to server. delete');
			this.postMessage(fixStore.length+'&'+gpsFixCount);
		}
	}
}

function httpGet(theUrl) {
	var xhr = new XMLHttpRequest();
	xhr.timeout = 3000;
	xhr.open('GET', theUrl, false);
	xhr.send();
	return xhr.responseText;
}
