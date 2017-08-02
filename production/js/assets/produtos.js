(
	function () {
        'use strict';

		$(document).ready(function(){
			authorized()
		} );

		$('#btn-logout').on('click', logout);

		function logout() {
			var request = send(null, 'POST', '/auth/logout');
			request.done(responseSuccessLogout);
			request.fail(responseFailLogout);
		}

		var responseSuccessLogout = function(response) {
			setToken(false);
		}

		var responseFailLogout = function(response) {
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

          getProducts();
		}

		var responseFailAuthorized = function(response) {
			setToken(false);
        }

        function getProducts() {
            var request = send({includes: 'categories'}, 'GET', '/products');
            request.done(mountTable);

            request.fail(function(response) {
            	console.log("ERRO", response);
            })
        }


        function mountTable(response) {
        	var data = response.data;
        	var html = "";

        	for(var i in data) {
        		var tdCategory = "";

        		for(var category in data[i].categories) {
        			tdCategory += data[i].categories[category].description + ', ';
        		}


        		html += "<tr>" +
                          "<th scope='row'>"+data[i].id+"</th>" +
                          "<td>"+data[i].name+"</td>"+
                          "<td>"+data[i].price+"</td>"+
                          "<td>"+tdCategory.substring(0, tdCategory.length -2)+"</td>"+
                          "<td style='text-align: right;'>"+
                            "<i class='fa fa-pencil-square-o  icon-menager-product text-info '></i>"+
                            "<i class='fa fa-trash icon-menager-product text-danger gap-left-15' data-id="+data[i].id+"></i>"+
                          "</td>"+
                        "</tr>";
        	}

        	$('#tb-products tbody').html(html);
        	$('.fa-trash').on('click', deleteProduct)
        }

        function deleteProduct(event) {
        	swal({
			  title: 'Você tem certeza?',
			  text: "Você perderá as informações desse produto!",
			  type: 'warning',
			  showCancelButton: true,
			  confirmButtonColor: '#3085d6',
			  cancelButtonColor: '#d33',
			  confirmButtonText: 'Sim, remover!',
			  cancelButtonText: 'Cancelar'
			}).then(function () {
				var $target = $(event.target);

				var id = $target.data('id');

				var request = send(null, 'DELETE', '/products/' + id);

				request.done(function(response) {
					 swal(
					    'Removido!',
					    'Produto removido com sucesso.',
					    'success'
					  )


        			$target.closest('tr').remove();
            	});

	            request.fail(function(response) {
	            	console.log("ERRO", response);
	            });

			});
        }
	}
)()
