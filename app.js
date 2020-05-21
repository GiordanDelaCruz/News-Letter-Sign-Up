//jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

// Create an instance of express
const app = express();

// Allow Express to use static files
app.use(express.static("public"));
// Enable express to use parse data
app.use(bodyParser.urlencoded({extended:true}));

// Specify the home route
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

// Handle POST request on from the home route
app.post("/", function(req, res){
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  // Create data for a new subscriber
  const data ={
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  // Convert the JavaScript data into a JSON string
  const jsonData = JSON.stringify(data);

  // Create the options for our request
  const url = "https://us8.api.mailchimp.com/3.0/lists/b352ff3486";
  const options = {
    method: "POST",
    auth: "giordan1:a38f4d561c25b59872bc873e3e678d6f-us8"
  };

  // Create a POST request send user data to the server. After, read the response from the
  // mailchimp server
  const request = https.request(url, options, function(response){

    // Direct a user to a particular page based on if the user was able to signup to the newletter
    if( response.statusCode === 200){
      res.sendFile( __dirname + "/success.html");
    }else{
      res.sendFile( __dirname + "/failure.html");
    }

    response.on("data", function(data){
      console.log(JSON.parse(data));
    });

  });

  // Write to the mailchimp server
  request.write(jsonData);
  request.end();

});


// Handle POST request on from the failure route
app.post("/failure", function(req, res){
  res.redirect("/");
});


// Start server localy on port 3000 or a paticular port on Heroku
 app.listen(process.env.PORT || 3000, function(){
   console.log("Server is running on port 3000");
 });

// API KEY
// a38f4d561c25b59872bc873e3e678d6f-us8

// Audience id
// b352ff3486
