
MustacheTemplate = {
	loaded: false,
	templates: '',
	getTemplate: function(id) {
		return $(MustacheTemplate.templates).filter('#'+id).html();
	},
	load: function(templateURL) {
		templateURL = templateURL || '/templates/mustacheTemplates.htm';
		$.ajax({
			url: templateURL,
			async: false,
			success: function(templates) {
				MustacheTemplate.templates = templates;
				MustacheTemplate.loaded = true;
			}
		});	
	},
	loadMultiple: function(templatesArray) {
		if(templatesArray && templatesArray.length > 0) {
			$.each(templatesArray, function(idx, templateURL) {
				$.ajax({
					url: templateURL,
					async: false,
					success: function(templates) {
						MustacheTemplate.templates += templates;
					}
				});
			})
			MustacheTemplate.loaded = true;
		}
	}
};