$(document).ready(function () {

	// llamo a la API con la keyword de búsqueda que extraigo mediante la función getUrlParameter

  $.get("/api/items?q=" + myFunctions.getUrlParameter("search"), function (res) {

  	// BREADCRUMB DE CATEGORIAS
  	
  	var categories = '';

  	for (var i = 0; i < res.categories.length; i++){
  		if (i == res.categories.length - 1) {
  			categories +='<li>' + res.categories[i] + '</li>';
  		} else {
  			categories +='<li>' + res.categories[i] + '</li><i>></i>';
  		}
  	}
  	
  	$('#breadcrumb-path').html(categories);

  	// MAIN SECTION: RESULTADOS DE BUSQUEDA

  	// el loop for repite la operación para los primeros 4 items detallados en el JSON
  	
  	for (var j = 0; j < 4; j++) {
  		var currency = myFunctions.currencySymbol(res.items[j].price.currency);
  		var price = res.items[j].price.amount.toLocaleString();
	  	var resultado = '';

	  	// acá construyo el div de cada resultado de la búsqueda y lo appendeo.

	  	resultado += '<article class="result">';
	  	resultado += '<figure class="item-image"><a href="/items/' + res.items[j].id + '"><img class="item-thumb" src="' + res.items[j].picture +'"></a></figure>';
	  	resultado += '<div class="item-basicdata"><div class="item-price"><span class="price">' + currency + ' ' + price;
	  	if (res.items[j].price.decimals !== 0) {resultado += '<sup>' + res.items[j].price.decimals + '</sup></span>';} else {resultado += '</span>';}
	  	if (res.items[j].free_shipping) {resultado += '<div class="free-shipping" title="Envío gratis a todo el país"></div>';}
	  	resultado += '</div><div class="item-title"><p class="title"><a href="/items/' + res.items[j].id + '">' + res.items[j].title + '</a><p></div></div>';
	  	resultado += '<div class="item-place"><span class="place">' + res.items[j].location + '</span><div>';
	  	resultado += '</article>';

	  	$('#search-results').append(resultado);
  	}

  	// activo el div bottom

  	$('#bottom').addClass('.bottom');
	
  });
});