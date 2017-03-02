'use strict';

const fs = require('fs');
const Hapi = require('hapi');
const jwt = require('jsonwebtoken');
const unirest = require('unirest');
const auth = require('basic-auth');

unirest.post('http://accreditor.spielstand.net/generate')
	.headers({'Accept': 'application/json', 'Content-Type': 'application/json'})
	.auth('userService', '', true)
	.send({ "parameter": 23, "foo": "bar" })
	.end(function (response) {
        const token = response.body;
        unirest.get('http://accreditor.spielstand.net/publicKey')
            .end(function (response) {
                console.log(jwt.verify(token, response.body));
            });
	});
