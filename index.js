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

				// extraigo datos y fabrico el JSON que le voy a pasar al browser con los datos ya parseados

                //CATEGORIA ITEM

                categoriasItem = [];
                for (var i = 0; i < itemCategory.path_from_root.length; i++) {
                    categoriasItem.push(itemCategory.path_from_root[i].name);
                }
				
				// DATOS DEL ITEM
				// primero proceso los datos del precio para extraer el valor entero y los decimales
				var precio = {};
				precio.currency = itemBasic.currency_id;
			    if (Number.isInteger(itemBasic.price)) {
			    	precio.amount = itemBasic.price;
			    	precio.decimals = 0;
			    } else {
			    	precio.amount = Math.floor(itemBasic.price);
			    	precio.decimals = parseInt(itemBasic.price.toString().split('.')[1]);
			    }

			    /* proceso la descripción para que si no tiene datos en plain text me devuelva HTML
			    (al html lo uso como texto sin formato porque las especificaciones de diseño
			    no parecían contemplar el insertar descripciones en formato HTML*/
			    var descripcion = '';
			    if (itemDescription.plain_text == '') {
			    	descripcion = itemDescription.text;
			    } else {descripcion = itemDescription.plain_text;}

			    //JSON FINAL
				var itemData = {
			    	author: {
			    		name: 'Rita',
			    		lastname: 'Gonzalez Hesaynes'
			    	},

			    	item: {
			    		id: itemBasic.id,
			    		title: itemBasic.title,
			    		price: precio,
			    		picture: itemBasic.pictures[0].secure_url,
			    		condition: itemBasic.condition,
			    		free_shipping: itemBasic.shipping.free_shipping,
			    		sold_quantity: itemBasic.sold_quantity,
			    		categories: categoriasItem,
			    		description: descripcion
			    		}
			    	};


			    	
			    	res.send(itemData);
		    });

		});
	});
});


// llamo a la API con la keyword de búsqueda que extraje en busqueda.js

app.get('/api/items', function (req, res) {
  request('https://api.mercadolibre.com/sites/MLA/search?q=' + req.query.q, function (error, response, body) {

  	// parseo la respuesta y fabrico el JSON que voy a pasarle al browser

    var body = JSON.parse(body);

    // CATEGORIAS
    categorias = [];

    if (body.filters.length == 0) {
    	categorias.push(body.available_filters[0].values[0].name);
    } else {
    	var cat = body.filters[0].values[0].path_from_root;
    	for (var i = 0; i < cat.length; i++) {
    		categorias.push(cat[i].name);
    	}
    }

    // ITEMS
    itemsBusqueda = [];
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
    	
    	itemsBusqueda.push(temp);
    };

    // JSON FINAL

    var resultadosBusqueda = {
    	author: {
    		name: 'Rita',
    		lastname: 'Gonzalez Hesaynes'
    	},

    	categories: categorias,

    	items: itemsBusqueda
    }

    res.send(resultadosBusqueda);
  });
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});