var jwt = require('jsonwebtoken');
var token = jwt.sign({ foo: 'bar' }, 'shhhhh', { expiresIn: '1s' });

console.log(jwt.verify(token, 'shhhhh'));

setTimeout(function() {
    try {
        jwt.verify(token, 'shhhhh');
    } catch (err) {
        console.log(err);
    }
}, 5000);
