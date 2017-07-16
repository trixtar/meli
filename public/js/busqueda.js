$(document).ready(function () {
  $.get("/api/items?q=" + myFunctions.getUrlParameter("search"), function (res) {
  	console.log(res);
  	
  	for (var i = 0; i < 4; i++) {
  	var resultado = '';
  	resultado += '<div class="resultado">';
  	resultado += '<a href="/items/' + res.items[i].id + '"><img src="' + res.items[i].picture +'"></a>';
  	resultado += res.items[i].title;
  	resultado += '</div'>

  	$("#ml-response").append(resultado);
  	}
	
  });
});