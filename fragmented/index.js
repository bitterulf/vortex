'use strict';

const Primus = require('primus');
const substream = require('substream');

const primus = Primus.createServer(function connection(spark) {
    const fragmentA = spark.substream('fragmentA');

    fragmentA.on('data', console.log);

    console.log('client connected');

    fragmentA.write('all is fine!');
}, { port: 8080, transformer: 'websockets' });

primus.plugin('substream', substream);

primus.save(__dirname +'/primus.js');
