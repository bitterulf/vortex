'use strict';

var Primus = require('primus');

var Rooms = require('primus-rooms');

var primus = Primus.createServer(function connection(spark) {
    spark.on('data', function(data) {
        var room = 'lounge';
        // joining does not seems to work
        spark.join(room, function () {

            // send message to this client
            spark.write('you joined room ' + room);

            // send message to all clients except this one
            spark.room(room).except(spark.id).write(spark.id + ' joined room ' + room);
        });
        console.log(data);
    });
    console.log('client connected');
}, { port: 8080, transformer: 'websockets' });

primus.plugin('rooms', Rooms);

primus.authorize(function (req, done) {
    if (req.query.token != 'acdc') {
        return done('wrong token!');
    }
    done();
});

var client = new primus.Socket('http://localhost:8080?token=acdc');
client.on('open', function (spark) {
    client.id(function (id) {
        console.log(id);
    });
    client.write({ foo: 'bar' });
});
