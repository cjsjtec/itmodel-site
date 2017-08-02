(
	function () {
		'use strict';
		$(document).ready(function(){
			authorized()
		} );

		$('.btn-logout').on('click', logout);

		function logout() {
			var request = send(null, 'POST', '/auth/logout');
			request.done(responseSuccessLogout);
			request.fail(responseFailLogout);
		}

		var responseSuccessLogout = function(response) {
			setToken(false);
		}

		var responseFailLogout = function(response) {
			console.log("Problema ao fazer logout", response);
			setToken(false);
		}

		function authorized() {
			var request = send(null, 'GET', '/auth/authorized');
			request.done(responseSuccessAuthorized);
			request.fail(responseFailAuthorized);
		}

		var responseSuccessAuthorized = function(response) {
			var name = response.user['name'];
			var pictureUrl = response.user['picture_url'];

			$('.name-user').html(name);
			$('.img-user').attr('src', pictureUrl);
			setToken(response.token);
		}

		var responseFailAuthorized = function(response) {
			setToken(false);
		}
	}
)()