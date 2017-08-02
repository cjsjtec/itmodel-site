function send(data, method, route) {
	var baseUrl = 'http://api.itmodel.dev/api';

	return $.ajax({
		url: baseUrl + route,
		data: data,
		crossDomain: true,
		processData: false,
        contentType: false,
        headers: getHeaders(),
		method: method,
		dataType: 'json'
	});
}

function sendDefault(data, method, route) {
	var baseUrl = 'http://api.itmodel.dev/api';

	return $.ajax({
		url: baseUrl + route,
		data: data,
		crossDomain: true,
		headers: getHeaders(),
		method: method,
		dataType: 'json'
	});
}

function getHeaders() {
	return {
		"Authorization": 'Bearer ' + getToken()
	}
}

