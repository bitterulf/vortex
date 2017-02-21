'use strict';

const fs = require('fs');
const Hapi = require('hapi');
const jwt = require('jsonwebtoken');
const unirest = require('unirest');
const auth = require('basic-auth');

const server = new Hapi.Server({});

var NodeRSA = require('node-rsa');
var key = new NodeRSA({b: 512});

var privateKey = key.exportKey('pkcs1-sha256-private-pem');
var publicKey = key.exportKey('pkcs1-sha256-public-pem');

server.connection({
  port: 4000
});

server.route({
    method: 'POST',
    path: '/generate',
    handler: function (request, reply) {
		const user = auth(request);
		console.log(user.name, user.pass);
		reply(jwt.sign(request.payload, privateKey, {algorithm: 'RS256', expiresIn: '1m'}));
    }
});

server.route({
    method: 'GET',
    path: '/publicKey',
    handler: function (request, reply) {
		reply(publicKey);
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
        const token = response.body;
        unirest.get('http://localhost:4000/publicKey')
            .end(function (response) {
                console.log(jwt.verify(token, response.body));
            });
	});
