var express = require('express');
var request = require('request');
var app = express();

app.use('/lib', express.static(__dirname + '/node_modules'));
app.use('/public', express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
  console.log(req.query);
});

app.get('/items', function (req, res) {
  res.sendFile(__dirname + '/public/views/busqueda.html');
});

app.get('/items/:id', function (req, res) {
  res.sendFile(__dirname + '/public/views/detalle.html');
});

app.get('/api/items/:id', function (req, res) {
  request('https://api.mercadolibre.com/items/​' + req.params.id, function (error, response, body) {
  	var body = JSON.parse(body);
  	
  	var miItem = {};

  	console.log(body);

  	//AUTOR
    miItem.author = {name: 'Rita', lastname: 'Gonzalez Hesaynes'};

    //ITEM
    miItem.item = {};
    miItem.item.id = body.id;
    miItem.item.title = body.title;
    miItem.price = {};
   	miItem.price.currency = body.currency_id;
    if (Number.isInteger(body.price)) {
    	miItem.price.amount = body.price;
    	miItem.price.decimals = 00;
    } else {
    	miItem.price.amount = Math.floor(body.price);
    	miItem.price.decimals = parseInt(body.price.toString().split('.')[1]);
    }
    miItem.picture = body.secure_thumbnail;
    miItem.condition = body.condition;
    miItem.free_shipping = body.shipping.free_shipping;
    miItem.sold_quantity = body.sold_quantity;
    miItem.description = 'FALTA';
	

  	res.send(body);
  });
/*
		request('https://api.mercadolibre.com/items/​' + req.params.id + '/description', function (error, response, body) {
  		var description = JSON.parse(body);

  		res.send(description);
  		});
 */
});

app.get('/api/items', function (req, res) {
  request('https://api.mercadolibre.com/sites/MLA/search?q=' + req.query.q, function (error, response, body) {

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
    	
    	misResultados.items.push(temp);
    };

    res.send(misResultados);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});