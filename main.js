//Read a json file.
var fs = require('fs');
var express = require('express');
var path = require('path');
var pug = require('pug');
var MongoClient = require('mongodb').MongoClient;

var mongoUrl = "mongodb://heroku_85s4rvsf:m0iea2ibvu2o3tdp0p92gndq05@ds133291.mlab.com:33291/heroku_85s4rvsf";

var nameArray = new Array();

var firstNameArray = new Array();
var lastNameArray = new Array();
var connectorArray = new Array();
var composedNameArrayRead = false;

var myAppServer = express();
var nameArrayRead = false;

var compiledEsportsTemplate = pug.compileFile(__dirname + '/resources/pugfiles/index.pug');

myAppServer.get('/',function(req,res){
  //If the name array is array then send one
  var firstName = "";
  var lastName = "";
  var connector = "";
  var esportsTemplateOutput = "";
  MongoClient.connect(mongoUrl,function(err,db){
    if(err){
      console.log(err);
    }
    var firstNameCollection = db.collection('firstNames');
    firstNameCollection.count(function(err,count){

      //console.log("firstName collection count: " + count.toString());
      var firstNameCollectionIndex = Math.floor(Math.random() * count);
      firstNameCollection.find({"index":firstNameCollectionIndex.toString()}).toArray(function(err,docs){
        firstName = docs[0]['firstName'];

        var lastNameCollection = db.collection('lastNames');
        lastNameCollection.count(function(err,count){

          //console.log("lastName collection count: " + count.toString());
          var lastNameCollectionIndex = Math.floor(Math.random() * count);
          lastNameCollection.find({"index":lastNameCollectionIndex.toString()}).toArray(function(err,docs){
            lastName = docs[0]['lastName'];

            var connectorCollection = db.collection('connectors');
            connectorCollection.count(function(err,count){
              //console.log("connector collection count: " + count.toString());
              var connectorCollectionIndex = Math.floor(Math.random() * count);
              connectorCollection.find({"index":connectorCollectionIndex.toString()}).toArray(function(err,docs){
                connector = docs[0]['connector'];

                var allCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
                var sponser = "";
                for(var i = 0; i < 3; i++){
                  sponser += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
                }
                var returnName = "["+sponser+"]"+firstName+connector+lastName;
                //return "["+sponser+"]"+firstName+connector+lastName;
                esportsTemplateOutput = compiledEsportsTemplate({name:returnName});

                res.send(esportsTemplateOutput);
                db.close();
              });
            });
          });
        });
      });
    });
  });
})

var server = myAppServer.listen(process.env.PORT || 8081, function(){

});
