$(document).ready(function () {

  //extraigo la ID del item de la URL
  
  var url = window.location.pathname;
  var id = url.substring(url.lastIndexOf('/') + 1);

  // Llamo a la API

  $.get("/api/items/" + id, function (res) {
    console.log(res);
    
    // BREADCRUMB DE CATEGORIAS

    var categoriasItem = [];

    for (var i = 0; i < res.item.categories.length; i++){
      if (i == res.item.categories.length - 1) {
        categoriasItem +='<li>' + res.item.categories[i] + '</li>';
      } else {
        categoriasItem +='<li>' + res.item.categories[i] + '</li><i>></i>';
      }
    }
    
    $('#breadcrumb-path').html(categoriasItem);

    // MAIN SECTION: DATOS DEL ITEM

    var listingLeft = '';
    var listingRight = '';
    var condition = myFunctions.itemCondition(res.item.condition);
    var soldquantity = myFunctions.soldQuantity(res.item.sold_quantity);
    var currency = myFunctions.currencySymbol(res.item.price.currency);
    var price = res.item.price.amount.toLocaleString();

    //acá fabrico el div izquierdo donde va la imagen y la descripción. Luego lo appendeo al div contenedor.

    listingLeft += '<figure class="listing-image">';
    listingLeft += '<img class="listing-img" src="' + res.item.picture + '" alt="' + res.item.title + '" title="' + res.item.title + '" />';
    listingLeft += '</figure><div id="listing-description" class="listing-description">';
    listingLeft += '<span class="description-title">Descripción del producto</span>';
    listingLeft += '<div id="description-full" class="description-full"></div></div>';

    $('#listing-left').html(listingLeft);

    /* A la descripción pongo en modo texto porque la descripción en formato HTML
    no parece estar contemplada en las especificaciones de diseño. */

    $('#description-full').text(res.item.description);

    // fabrico el div derecho donde van los datos del producto y el botón de comprar, y appendeo al div contenedor.

    listingRight += '<span class="condition-sold">' + condition + ' - ' + soldquantity + '</span>';
    listingRight += '<p class="listing-title">' + res.item.title + '</p>';
    listingRight += '<p class="listing-price">' + currency + ' ' + price;
    if (res.item.price.decimals == 0) {listingRight += '<sup>00</sup>';} else {listingRight += '<sup>' + res.item.price.decimals + '</sup>';}
    if (res.item.free_shipping) {listingRight += '<i class="free-shipping-big" title="Envío gratis a todo el país"></i>';}
    listingRight += '</p><button tabindex="3" class="btn-buy">Comprar</button>';

    $('#listing-right').html(listingRight);

    // activo el div bottom

    $('#bottom').addClass('.bottom');

    });

});


