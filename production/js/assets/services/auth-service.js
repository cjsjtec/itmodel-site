function getTokenName() {
	return 'idTk';
}

function setToken(token) {
	var tokenName = getTokenName();

	if (token) {
	  localStorage.setItem(tokenName, token);
	} else {
			localStorage.removeItem(tokenName);
  		window.location = 'login.html';
	}
}

function getToken() {
	return localStorage.getItem(getTokenName());
}
