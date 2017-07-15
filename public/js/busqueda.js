$(document).ready(function () {
  $.get("/api/items?q=" + QueryParameters.getUrlParameter("q"), function (res) {
  	$("#ml-response").html(res);
  });
});


/*
$.get("/api/items/" + parametros.search, function(data) {
  console.log(data);
  	var usuariounico = "";

    usuariounico += '<div class="usuariounico">';
    usuariounico += '<h3>' + data.data.full_name + '</h3>'; //el 1er data es el parámetro de la fc, el 2do esta en el json
    usuariounico += '<img src="' + data.data.avatar + '"/></a>';
    usuariounico += '</div>'; 

    $('#detalles').append(usuariounico);
    $('#cargando').hide();
});
*/