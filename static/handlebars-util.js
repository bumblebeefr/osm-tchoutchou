var HandlebarsUtil = {
		base : "/static/templates/",
		templates:{},
		render:function(template,context){
				var out = "";
				if(HandlebarsUtil.templates[template] == null){
					var url = HandlebarsUtil.base+template+".tpl";
					jQuery.ajax(url,{
						async : false,
						cache : false,
						error : function(e){if(console && console.error){
							console.error("error when loading template "+url,e);
						}},
						success : function(data, textStatus, jqXHR){
							out = jqXHR.responseText;
						}
					});
					HandlebarsUtil.templates[template] = Handlebars.compile(out);
				}
				return HandlebarsUtil.templates[template](context);

		}
}
jQuery.fn.render = function(template,context){
	$(this).html(HandlebarsUtil.render(template,context));
	return $(this);
}