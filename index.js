var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');

var myUser = {
  userId: '1',
  name: 'Gautam Rizwani',
  email: 'gr@gr.com',
  password: 'task5'
};

var app = express();
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.get('/', function(request, response) {
	console.log(myUser.name);
	response.sendFile(path.join(__dirname + '/Home_page.html'));
});

app.get('/log', function(request, response) {
	response.sendFile(path.join(__dirname + '/Login_page.html'));
});

app.get('/relog', function(request, response) {
	response.sendFile(path.join(__dirname + '/Er_Login_page.html'));
});

app.post('/auth', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	if (username && password) {
		if (myUser.email===username && myUser.password===password) {
				request.session.loggedin = true;
				request.session.username = myUser.name;
				response.redirect('/home');
			} else {
				response.redirect('/relog');
			}			
			response.end();
		
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

app.get('/home', function(request, response) {
	if (request.session.loggedin) {
		var name = 'Welcome ' + request.session.username;
		response.render(__dirname + "/Profile_page.html", {name:name});
	} else {
		response.send('Please login to view this page!');
	}
	response.end();
});

app.listen(3000);