const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

const PORT = 7777;
const HOST = 'localhost';

users = [];
connections = []; 

server.listen(PORT, HOST, function(){
	console.log('Server started on PORT:', PORT);
});


app.get('/', function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/icon'));


io.sockets.on('connection', function (socket){
	connections.push(socket);
	console.log('Connected: %s socket connected', connections.length);


	//Disconnecte 
	socket.on('disconnect', function (data){

		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s socket cinnected', connections.length);
	});

	//Send Message
	socket.on('send message', function (data){
		console.log(socket.username + ": " + data);
		io.sockets.emit('new message', {msg: data, user: socket.username});
	});


	//New User
	socket.on('new user', function (data, callback){
		callback(true);
		socket.username = data;
		users.push(socket.username);
		updateUsernames();
	});

	function updateUsernames(){
		io.sockets.emit('get users', {users, you: socket.username})
	}
});

