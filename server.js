const express = require('express');
const axios = require('axios');
const app = express();

require('dotenv').config();

app.set('view engine' , 'ejs');

var access_token = "";

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;

app.get('/', function(req, res) {
  res.render('pages/index',{client_id: clientID});
});

//Declaring the callback route
app.get('/github/callback' , (req,res) => {
    //The req.query object has the query params that were sent to this route.
    const requestToken = req.query.code

    axios({
        method:'post',
        url:`https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
        // Set the content type header, so that we get the response in JSON
        headers: {
            accept: 'application/json'
        }
    }).then((response) => {
        access_token = response.data.access_token;
        res.redirect('/success');
    });
});


app.get('/success' , (req,res) => {
    axios({
        method:'get',
        url:`https://api.github.com/user`,
        headers:{
            Authorization:'token ' + access_token 
        }
    }).then((response) => {
        console.log(response.data);
        res.render('pages/success' , {userData:response.data});
    });
});

const port = process.env.PORT || 8000;
app.listen(port , () => console.log('App listening on port ' + port));