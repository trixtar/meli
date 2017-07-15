var express = require('express');
var request = require('request');
//var https = require('https');
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
    
    /*
    for (var j = 0; j < body.results.length; j++) {
    	var resultados = body.results[j];
    	
    	if ()

    };
    */
    console.log(misResultados);

    res.send(body);
  });
});


/* var persona = body.data[i];
				persona.full_name = persona.first_name + ' ' + persona.last_name;
				body.data[i] = persona; 

				var persona = body.data[i];
				var personaNueva = {};
				personaNueva.avatar = persona.avatar;
				personaNueva.id = persona.id;
				personaNueva.full_name = persona.first_name + ' ' + persona.last_name;
				body.data[i] = personaNueva;
*/

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});