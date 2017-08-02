(
	function() {
		'use strict';

		$('#form').on('submit', function(event) {
			event.preventDefault();

			var email = $('#email').val();
			var password = $('#password').val();

			if(!isEmail(email)) {
				swal('Oops...','Preencha o E-Mail corretamente','error');
				return;
			}

			var data = new FormData()
			data.append('email', email);
			data.append('password', password);
			var request = send(data, 'POST', '/auth/login');
			request.done(responseSuccess);
			request.fail(responseFail);

		});

		var responseSuccess = function(response) {
			setToken(response.token);
			window.location = 'index.html';
		}

		var responseFail = function(response) {
			swal('Oops...','Ocorreu um erro ao efetar o login','error');
		}

		var isEmail = function(email) {
		  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		  return regex.test(email);
		}
	}
)();


