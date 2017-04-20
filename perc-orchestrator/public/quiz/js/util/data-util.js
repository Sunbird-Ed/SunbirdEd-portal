var loadData = function(url, input, type) {
	console.dir(input);
	var result = "";
	if(type == ""){
		type = "POST";
	}
	
	// jQuery.support.cors = true;
	$.ajax({
		url : url,
		type : type,
		data : input,
		async : false,
		success : function(data) {
			result = data;
		},
		error : function(xhr, ajaxOptions, thrownError) {
			result = ASSESSMENT_TECHNICAL_ERROR;
		}
	});
	return result;
};

var loadDataPerc = function(url, input, type) {
	console.dir(input);
	var result = "";
	if(type == ""){
		type = "POST";
	}

	// input = JSON.stringify(input);

	url="http://" + document.location.host + "/private/learner_middleware/?url="+encodeURIComponent(url);
	
	// jQuery.support.cors = true;
	$.ajax({
		url : url,
		type : type,
		data : input,
		async : false,
		success : function(data) {
			result = data;
			console.log("After Success");
		},
		error : function(xhr, ajaxOptions, thrownError) {
			result = ASSESSMENT_TECHNICAL_ERROR;
		}
	});

	console.log("Just Before Return");
	return result;
};

