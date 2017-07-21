var express = require('express');
var request = require('request');
var app = express();

// hago los paths que voy a usar para uso interno y externo, y especifico las vistas 

app.use('/lib', express.static(__dirname + '/node_modules'));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
  console.log(req.query);
});

app.get('/items/:id', function (req, res) {
  res.sendFile(__dirname + '/public/views/detalle.html');
});

app.get('/items', function (req, res) {
  res.sendFile(__dirname + '/public/views/busqueda.html');
});

// en la última llamada a la api nesteo 3 requests para obtener los datos del item, la descripción y la categoría

app.get('/api/items/:id', function (req, res) {
	request('https://api.mercadolibre.com/items/​' + req.params.id, function (error, response, body) {
	  	var itemBasic = JSON.parse(body);

	  	request('https://api.mercadolibre.com/items/' + req.params.id + '/description', function (error, response, body) {
			var itemDescription = JSON.parse(body);

			// para obtener la categoría necesito la ID de categoría en el JSON de la primera request

			request('https://api.mercadolibre.com/categories/' + itemBasic.category_id, function (error, response, body) {
				var itemCategory = JSON.parse(body);

				// fabrico el JSON que le voy a pasar al browser con los datos ya parseados

				var miItem = {};

				//AUTOR
			    miItem.author = {name: 'Rita', lastname: 'Gonzalez Hesaynes'};

			    //ITEM
			    miItem.item = {};
			    miItem.item.id = itemBasic.id;
			    miItem.item.title = itemBasic.title;
			    miItem.item.price = {};
			   	miItem.item.price.currency = itemBasic.currency_id;
			    if (Number.isInteger(itemBasic.price)) {
			    	miItem.item.price.amount = itemBasic.price;
			    	miItem.item.price.decimals = 0;
			    } else {
			    	miItem.item.price.amount = Math.floor(itemBasic.price);
			    	miItem.item.price.decimals = parseInt(itemBasic.price.toString().split('.')[1]);
			    }
			    miItem.item.picture = itemBasic.pictures[0].secure_url;
			    miItem.item.condition = itemBasic.condition;
			    miItem.item.free_shipping = itemBasic.shipping.free_shipping;
			    miItem.item.sold_quantity = itemBasic.sold_quantity;
			    if (itemDescription.plain_text == '') {
			    	miItem.item.description = itemDescription.text;
			    } else {miItem.item.description = itemDescription.plain_text;}

			    //CATEGORIA ITEM

			    miItem.item.categories = [];
			    for (var i = 0; i < itemCategory.path_from_root.length; i++) {
			    	miItem.item.categories.push(itemCategory.path_from_root[i].name);
			    }
				
				res.send(miItem);

			});
		});
	});
});


// llamo a la API con la keyword de búsqueda que extraje en busqueda.js

app.get('/api/items', function (req, res) {
  request('https://api.mercadolibre.com/sites/MLA/search?q=' + req.query.q, function (error, response, body) {

  	// parseo la respuesta y fabrico el JSON que voy a pasarle al browser

    var body = JSON.parse(body);
    var misResultados = {};

    //AUTOR
    misResultados.author = {name: 'Rita', lastname: 'Gonzalez Hesaynes'};

    //CATEGORIAS
    misResultados.categories = [];

    if (body.filters.length == 0) {
    	misResultados.categories.push(body.available_filters[0].values[0].name);
    } else {
    	var cat = body.filters[0].values[0].path_from_root;
    	for (var i = 0; i < cat.length; i++) {
    		misResultados.categories.push(cat[i].name);
    	}
    }

    //ITEMS
    misResultados.items = [];

    for (var j = 0; j < body.results.length; j++) {
    	var temp = {};

    	temp.id = body.results[j].id;
    	temp.title = body.results[j].title;
    	temp.price = {};
    	temp.price.currency = body.results[j].currency_id;
    	if (Number.isInteger(body.results[j].price)) {
    		temp.price.amount = body.results[j].price;
    		temp.price.decimals = 00;
    	} else {
    		temp.price.amount = Math.floor(body.results[j].price);
    		temp.price.decimals = parseInt(body.results[j].price.toString().split('.')[1]);
    	}
    	temp.picture = body.results[j].thumbnail;
    	temp.condition = body.results[j].condition;
    	temp.free_shipping = body.results[j].shipping.free_shipping;
    	temp.location = body.results[j].address.state_name;  //Agrego key para poder insertar la provincia en los resultados
    	
    	misResultados.items.push(temp);
    };

    res.send(misResultados);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});