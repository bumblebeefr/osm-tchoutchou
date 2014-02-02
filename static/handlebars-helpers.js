//Format a date using moment.js. 
//If date is null or empty sting, current date will be used.
Handlebars.registerHelper('date', function(date, format) {
	if (date == null || date == "") {
		date = new Date();
	}
	if (typeof (date) == 'number') {
		date = new Date(date);
	}
	return new Handlebars.SafeString(moment(date).format(format));
});

// Display a date as moment.js fromNow values (3day ago, 2s ago, ...)
Handlebars.registerHelper('fromNow', function(date) {
	if (date) {
		if (typeof (date) == 'number') {
			date = new Date(date);
		}
		return new Handlebars.SafeString(moment(date).fromNow());
	}
});

// Escape (with javascript escape function) a string.
Handlebars.registerHelper('escape', function(str) {
	return new Handlebars.SafeString(escape(str));
});



Handlebars.registerHelper('safe', function(str) {
	if (str){
		return new Handlebars.SafeString(str);
	} else {
		return str;
	}
});

// allow to disaplay a default value if the specifieed property value is
// unedefined false or null.
Handlebars.registerHelper('default', function(val, defaultvalue) {
	if (!val || Handlebars.Utils.isEmpty(val)) {
		return new Handlebars.SafeString(defaultvalue);
	} else {
		return new Handlebars.SafeString(val);
	}
});

// allow to disaplay a default value if the specifieed property value is
// unedefined false or null.
Handlebars.registerHelper('percent', function(val, ttl) {
	var pct = Math.round(1.0 * val / ttl * 1000) / 10;
	return new Handlebars.SafeString((isNaN(pct) ? 0:pct) + "%");
});

// Translate a message with i18next.js lib.
Handlebars.registerHelper('i18n', function(i18n_key, options) {
	if (options.hash.prefix) {
		i18n_key = options.hash.prefix + "." + i18n_key;
	}
	var result = i18n.t(i18n_key, options.hash);
	if (options.hash.escape) {
		return result;
	} else {
		return new Handlebars.SafeString(result);
	}
});

// Sort of if that can comare two values. only equals and nequals(not equals)
// are implementd for now.
// exemple {{#when a equals=1}}a=1{{else}}a != 1{{/when}}
Handlebars.registerHelper('when', function(value, options) {
	if ('equals' in options.hash) {
		if (value == options.hash.equals) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	} else if ('nequals' in options.hash) {
		if (value == options.hash.nequals) {
			return options.inverse(this);
		} else {
			return options.fn(this);
		}
	}
});

Handlebars.registerHelper('foreach', function(context, options) {

	var trim = false;
	if (typeof context == 'string') {
		var separator = ",";
		if (options.hash && options.hash.separator) {
			separator = options.hash.separator;
		}
		context = context.split(separator);
		trim = true;
	}
	var ret = "";

	for ( var i = 0, j = context.length; i < j; i++) {
		if (trim && jQuery) {
			ret = ret + jQuery.trim(options.fn(context[i]));
		} else {
			ret = ret + options.fn(context[i]);
		}
	}

	return ret;
});

// get the first element of an array context .
Handlebars.registerHelper('first', function(context,options) {
	return options.fn(context[0]);		
});


//get the 'index' or 'i' element of an array of items.
//if position is negative, start to the end of the array of items
//example : 
//{{#indexOf data.arrayOfFoo i=2}}{{bar}}{{/indexOf}}  
//--> return data.arrayOfFoo[2].bar
Handlebars.registerHelper('indexOf', function(items, options) {
	var ind=0;
	if( 'i' in options.hash){
		ind=options.hash.i;
	} else 	if( 'index' in options.hash){
		ind=options.hash.index;
	}
	
	var index = ind < 0 ? items.length + ind : ind;
	if(index >=0 && index < items.length){
		return options.fn(items[index]);
		
	}
});
