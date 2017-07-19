$(document).ready(function () {
  $.get("/api/items?q=" + myFunctions.getUrlParameter("search"), function (res) {
  	console.log(res);
  	
  	var categories = '';

  	for (var i = 0; i < res.categories.length; i++){
  		if (i == res.categories.length - 1) {
  			categories +='<li>' + res.categories[i] + '</li>';
  		} else {
  			categories +='<li>' + res.categories[i] + '</li><i>></i>';
  		}
  	}
  	
  	$('#search-path').html(categories);
  	
  	for (var j = 0; j < 4; j++) {
  		var currency = myFunctions.currencySymbol(res.items[j].price.currency);
  		var price = res.items[j].price.amount.toLocaleString();
	  	var resultado = '';

	  	resultado += '<article class="result">';
	  	resultado += '<figure><a href="/items/' + res.items[j].id + '"><img class="item-thumb" src="' + res.items[j].picture +'"></a></figure>';
	  	resultado += '<div class="item-basicdata"><div class="item-price"><span class="price">' + currency + ' ' + price;
	  	if (res.items[j].price.decimals !== 0) {resultado += '<sup>' + res.items[j].price.decimals + '</sup></span>';} else {resultado += '</span>';}
	  	if (res.items[j].free_shipping) {resultado += '<div class="free-shipping"></div>';}
	  	resultado += '</div><div class="item-title"><p class="title"><a href="/items/' + res.items[j].id + '">' + res.items[j].title + '</a><p></div></div>';
	  	resultado += '<div class="item-place"><span class="place">' + res.items[j].location + '</span><div>';
	  	resultado += '</article>';

	  	$('#search-results').append(resultado);
  	}
	
  });
});