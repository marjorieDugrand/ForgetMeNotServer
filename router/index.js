var tasks_routes = require('./routes/tasks');
var users_routes = require('./routes/users');
var contexts_routes = require('./routes/contexts');

module.exports = function(app){
	app.use('/api/v1/tasks', tasks_routes);
	app.use('/api/v1/users', users_routes);
	app.use('/api/v1/contexts', contexts_routes);
	app.get('/', function (req, res) { res.send('Hello World!'); });
};
