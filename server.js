var express = require('express');
var app = express();
var path = require('path');


var server = require('http').createServer(app);
var io = require('socket.io')(server);
// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;


// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/'));

// set the home page route
app.get('/', function(req, res) {
    // ejs render automatically looks in the views folder
    res.sendFile(path.join(__dirname + '/index.html'));
});

server.listen(port, function() {
    console.log('Server listening at port %d', port);
});

// Soket.io connection
io.on('connection', function(socket) {

    // when the client emits 'play note', this listens and executes
    socket.on('note on', function(data) {
        // we tell the client to execute 'note on'
        socket.broadcast.emit('note on', {
            note: data
        });
        // we tell the client to execute 'note off'
        socket.broadcast.emit('note off', {
            note: data
        });
    });

    // when the user disconnects.. perform this
    socket.on('disconnect', function() {

    });

});