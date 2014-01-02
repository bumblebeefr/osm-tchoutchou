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
