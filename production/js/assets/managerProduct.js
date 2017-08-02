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


		function getParameterByName(name) {
		    var url = window.location.href;

		    name = name.replace(/[\[\]]/g, "\\$&");
		    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		        results = regex.exec(url);
		    if (!results) return null;
		    if (!results[2]) return '';
		    return decodeURIComponent(results[2].replace(/\+/g, " "));
		}

		function sendForm(e) {

			e.preventDefault();
			$('.btn').attr('disabled', true);


			var form = new FormData();

			for(var i in $('#categories').val()) {
				form.append('categories[]', $('#categories').val()[i]);
			}

			form.append('name', $('#name').val());
			form.append('price', $('#price').val());

			var id = $('#productUpdate').val();

			var url = '/products';

			if ($('#fileProduct')[0].files[0]) {
				form.append('picture', $('#fileProduct')[0].files[0]);
			}

			if (!isNaN(id)) {
				var url = '/products/'+id;
			}

			var request = send(form, 'POST', url);

			request.done(function(response) {
				swal({
				  title: 'Sucesso',
				  text: "Produto Salvo com sucesso !",
				  type: 'success',
				  confirmButtonColor: '#3085d6',
				  cancelButtonColor: '#d33',
				  confirmButtonText: 'OK!',
				  allowOutsideClick: false
				}).then(function () {
				  window.location = 'produtos.html';
				});
			});

			request.fail(function(response) {
				$('.btn').attr('disabled', false);

				var html = "";

				for(var i in response.responseJSON) {
					html += "<li>"+response.responseJSON[i][0]+"</li>";
				}

				swal('Ops..',html, 'error');
			});
		}

	    function validateImage(image) {
	        return ([
	            "image/png",
	            "image/jpg",
	            "image/jpeg"
	        ].indexOf(image.type) !== -1);
	    }

		function readURL(input) {
			if(!validateImage(input.files[0])) {
				swal(
	                'Oops...',
	                "Arquivo "+input.files[0].type+" não permitido.",
	                'error'
            	);
            	return;
			}

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

	          	var idUpdate = getParameterByName('id');

	          	if (!isNaN(idUpdate) && idUpdate != null) {
	          		$('#productUpdate').val(idUpdate);
	          		getProduct(idUpdate);
	          	}
			});

			request.fail( function(response) {
				setToken(false);
	        });
		}

		function getProduct(id) {
			var request = sendDefault({includes: 'categories'}, 'GET', '/products/'+id);

			request.done( function(response) {
				if (response.length == 0) {
					window.location = 'produtos.html';
					return;
				}

				$.each(response.categories, function(i,e) {
				    $("#categories option[value='" + e.id + "']").prop("selected", true);
				});

				$('#name').val(response.name);
				$('#price').val(response.price);
				$('#imgProduct').attr({src: response.picture_url});

			});

			request.fail( function(response) {
				console.log("ERRO", response);
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
				console.log("ERRO", response);
			});
		}
	}
)()
