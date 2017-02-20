'use strict';

const Hapi = require('hapi');
const jwt = require('jsonwebtoken');
const unirest = require('unirest');
const auth = require('basic-auth');

const server = new Hapi.Server({});

const secret = 'i am so secret';

server.connection({
  labels: ['api'],
  port: 4000
});

server.route({
    method: 'POST',
    path: '/generate',
    handler: function (request, reply) {
		const user = auth(request);
		console.log(user.name, user.pass);
		reply(jwt.sign(request.payload, secret, { expiresIn: '1m' }));
    }
});

server.start((err) => {
    if (err) {
        throw err;
    }

    console.log('server start');
});

unirest.post('http://localhost:4000/generate')
	.headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
	.auth('server', 'password', true)
	.send({ "parameter": 23, "foo": "bar" })
	.end(function (response) {
		console.log(jwt.verify(response.body, secret));
	});
