function randomString(len, charSet) {
	charSet = charSet || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	var randomString = '';
	for (var i = 0; i < len; i++) {
		var randomPoz = Math.floor(Math.random() * charSet.length);
		randomString += charSet.substring(randomPoz,randomPoz+1);
	}
	return randomString;
}

function setCookie(c_name,value,exdays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
	document.cookie=c_name + "=" + c_value + "; path=/";
}

function getCookie(c_name)
{
	var c_value = document.cookie;
	var c_start = c_value.indexOf(" " + c_name + "=");
	if (c_start == -1) { c_start = c_value.indexOf(c_name + "="); }
	if (c_start == -1) { c_value = null; }
	else
	{
		c_start = c_value.indexOf("=", c_start) + 1;
		var c_end = c_value.indexOf(";", c_start);
		if (c_end == -1) { c_end = c_value.length; }
		c_value = unescape(c_value.substring(c_start,c_end));
	}
	return c_value;
}

function checkCookie()
{
	var username=getCookie("auto_userid");
	if (username!=null && username!="") { return username; }
	else
	{
		username=randomString(24);
		setCookie("auto_userid",username,365);
		return username;
	}
}

var getJSON = function(url, _options) {
	var options  = {
		data : {},
		cache:true,
	};
	for(var k in _options){
		options[k] = _options[k];
	}
	
	if(options.cache == false){
		options.data['_'] = (new Date()).getTime();
	}
	
	for (k in options.data) {
		url += (url.indexOf("?") == -1) ? "?" : "&";
		url += encodeURIComponent(k);
		url += "=";
		url += encodeURIComponent(options.data[k]);
	}

	var req = new XMLHttpRequest();
	try{
		req.open('GET', url, true);
		//req.responseType = "json";
		req.onreadystatechange = function(aEvt) {
			if (req.readyState == 4) {
				if (req.status == 200) {
					if(typeof options.success == 'function'){
						options.success(JSON.parse(req.response),req.statusText,req);
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
		//console.error(e);
	}
};

//Communication avec les workers
function WorkerMessage(cmd, parameters) {
	this.cmd = cmd;
	this.parameters = parameters;
}