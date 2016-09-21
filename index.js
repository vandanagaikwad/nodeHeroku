var express = require('express');
var app = express();
var request = require('request');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/userList', function (req, res) {

var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + req.query.lat + ',' + req.query.long + '&radius=10000&type=restaurant&name='+req.query.resto+'&key=AIzaSyC5bgeYLqZPkwXZbFLXtXufclOW3u7y9K4'
    request(url, function (error, response, body) {
      
        if (!error && response.statusCode == 200) {
            res.end(body);
         }
    })
})

app.get('/userListByCity', function (req, res) {
	var url = 'https://maps.googleapis.com/maps/api/place/textsearch/json?query='+ req.query.resto + req.query.city + '&key=AIzaSyC5bgeYLqZPkwXZbFLXtXufclOW3u7y9K4'
    request(url, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            res.end(body);
         }
    })
})

app.get('/getCityList', function (req, res) {
	var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+req.query.input+'&types=(cities)&location='+req.query.lat+','+req.query.lng+'&radius=500&key=AIzaSyDIGYoa4P7zNtqP-3i0q8y9mqAWmJuIaeE'
    request(url, function (error, response, body) {

        if (!error && response.statusCode == 200) {
            var data = (JSON.parse(body));
            var arr = [];
            var arrCity = [];
            
            for(var i=0; i<data.predictions.length; i++){
                var city = {};
                
                city.cityName = data.predictions[i].terms[0].value;
                arrCity.push(city);

            }
            arr.push(arrCity);
            res.status(200).json({ myData: arrCity });
            res.end();
         }
    })
})




app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});


