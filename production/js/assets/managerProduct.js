(
	function () {
        'use strict';

		$(document).ready(function(){
			authorized();

			$('#imgProduct').on('click', function() {
				$('#fileProduct').click();
			})

			$('#btn-logout').on('click', logout);

			$('#fileProduct').on('change', function(e) {
				 readURL(this);
			})

			$('#demo-form2').on('submit', sendForm);
		} );

		function sendForm(e) {
			e.preventDefault();

			var form = new FormData();

			for(var i in $('#categories').val()) {
				form.append('categories[]', $('#categories').val()[i]);
			}

			form.append('name', $('#name').val());
			form.append('price', $('#price').val());
			form.append('picture', $('#fileProduct')[0].files[0]);

			var request = send(form, 'POST', '/products');

			request.done(function(response) {
				swal('Sucesso', 'Produto Salvo com sucesso', 'success');
			});

			request.fail(function(response) {
				console.log("ERRO", response);
				swal('Ops..', 'Ocorreu um erro ao salvar o produto', 'error');
			});
		}



		function readURL(input) {
		    if (input.files && input.files[0]) {
		        var reader = new FileReader();

		        reader.onload = function (e) {
		            $('#imgProduct').attr('src', e.target.result);
		        }

		        reader.readAsDataURL(input.files[0]);
		    }
		}

		function logout() {
			var request = send(null, 'POST', '/auth/logout');

			request.done(function(response) {
				setToken(false);
			});

			request.fail(function(response) {
				setToken(false);
			});
		}

		function authorized() {
			var request = send(null, 'GET', '/auth/authorized');

			request.done( function(response) {
				var name = response.user['name'];
				var pictureUrl = response.user['picture_url'];

				$('.name-user').html(name);
				$('.img-user').attr('src', pictureUrl);
	            setToken(response.token);

	          	getCategories();
			});

			request.fail( function(response) {
				setToken(false);
	        });
		}

		function getCategories() {
			var request = send(null, 'GET', '/products/categories');

			request.done(function(response) {
				var data = response.data;
				var html =  "";

				for(var i in data) {
					html += "<option value='"+data[i].id+"'>"+data[i].description+"</option>";
				}
				$('#categories').html(html)
			});

			request.fail(function(response) {
				//Todo
			});
		}
	}
)()
