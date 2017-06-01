var express = require('express');
var app = express();
var jwt = require('express-jwt');
var cors = require('cors');

app.use(cors());

// will setup some checks before the request is passed to the resource
// instead of checking it explictly at the two endpoints that they ave valid jwt
// setup a middleware first and then connect it with the two end-points 
// setup a jwt package which has the configuration object
// secret key comes from Auth0
// this middleware can be applied anywhere we want

const authCheck = jwt({ 
   // secret: new Buffer('vtYAu-A_BmOlPnM-3rt7nzN0rZ8Lo5D3ub7WqMHkF0bmj5fYjpWRXnESsSucrbJU', 'base64'),
    secret: 'vtYAu-A_BmOlPnM-3rt7nzN0rZ8Lo5D3ub7WqMHkF0bmj5fYjpWRXnESsSucrbJU',
    audience: 'ZQE8w9pVHDaYpB5bUlgGtWWr7T5ZxtFX'  //ClientID
});

// public end point
app.get('/api/public', function(req, res){
    res.json({ message: "Hello from a public endpoint !! You don't need to be authenticated to see this !!!"});
});

// private end point
// this will be protected by the authCheck middleware and it requires that there is an
// authorization header present before it allows the user to get through to this endpoint
app.get('/api/private', authCheck, function(req, res){
    res.json({ message: "Hello from a private endpoint !! You DO need to be authenticated to see this !!!"});
});

app.listen(3001);
console.log('Listening to http://localhost:3001');

