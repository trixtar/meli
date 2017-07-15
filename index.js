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
    res.send(body);
  });
});


/*
app.get('/api/items', function(req, res) { 
	https.get('https://api.mercadolibre.com/sites/MLA/search' + req.params.QUEVAACA, function(response) {
		var body='';
		response.on('data', function(d) {
			body += d;
		});
		response.on('end', function() {
			body = JSON.parse(body); //convierte la data string en json y la consolea en el back
			 
			for (var i=0; i < body.data.length; i++) {
				/* var persona = body.data[i];
				persona.full_name = persona.first_name + ' ' + persona.last_name;
				body.data[i] = persona; 

				var persona = body.data[i];
				var personaNueva = {};
				personaNueva.avatar = persona.avatar;
				personaNueva.id = persona.id;
				personaNueva.full_name = persona.first_name + ' ' + persona.last_name;
				body.data[i] = personaNueva;

			}
			
			res.send(body);
		}); 
	});
});
*/

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});