$(document).ready(function () {
  
  var url = window.location.pathname;
  var id = url.substring(url.lastIndexOf('/') + 1);

  $.get("/api/items/" + id, function (res) {
    console.log(res);
    
    // BREADCRUMB DE CATEGORIAS

    var categories = '';

    for (var i = 0; i < res.item.categories.length; i++){
      if (i == res.item.categories.length - 1) {
        categories +='<li>' + res.item.categories[i] + '</li>';
      } else {
        categories +='<li>' + res.item.categories[i] + '</li><i>></i>';
      }
    }
    
    $('#breadcrumb-path').html(categories);

    // MAIN SECTION: DATOS DEL ITEM

    var listingData = '';
    var condition = myFunctions.itemCondition(res.item.condition);
    var soldquantity = myFunctions.soldQuantity(res.item.sold_quantity);
    var currency = myFunctions.currencySymbol(res.item.price.currency);
    var price = res.item.price.amount.toLocaleString();

    $('#listing-img').attr({'src': res.item.picture, 'alt': res.item.title, 'title': res.item.title}); // IMAGEN DEL ITEM

    listingData += '<span class="condition-sold">' + condition + ' - ' + soldquantity + '</span>';
    listingData += '<p class="listing-title">' + res.item.title + '</p>';
    listingData += '<p class="listing-price">' + currency + ' ' + price;
    if (res.item.price.decimals == 0) {listingData += '<sup>00</sup>';} else {listingData += '<sup>' + res.item.price.decimals + '</sup>';}
    if (res.item.free_shipping) {listingData += '<i class="free-shipping-big" title="Envío gratis a todo el país"></i>';}
    listingData += '</p><button class="btn-buy" role="button">Comprar</button>';

    $('#listing-right').html(listingData);

    $('#description-full').text(res.item.description);

    /* A la descripción pongo en modo texto porque la descripción en formato HTML
    no parece estar contemplada en las especificaciones de diseño. */

    $('#bottom').addClass('.bottom');

    });

});


