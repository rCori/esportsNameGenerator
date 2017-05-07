//Read a json file.
var fs = require('fs');
var express = require('express');
var path = require('path');
var pug = require('pug');

var nameArray = new Array();

var firstNameArray = new Array();
var lastNameArray = new Array();
var connectorArray = new Array();
var composedNameArrayRead = false;

var myAppServer = express();
var nameArrayRead = false;

function jsonNameRead(err,data){
  if(err) throw err;
  var jsonNameArrayObj = JSON.parse(data);
  nameArray = jsonNameArrayObj.nameArray;
  nameArrayRead = true;
}

function jsonNameComposedRead(err,data){
  if(err) throw err;
  var jsonComposedNameArrayObj = JSON.parse(data);
  firstNameArray = jsonComposedNameArrayObj.firstNames;
  lastNameArray = jsonComposedNameArrayObj.lastNames;
  connectorArray = jsonComposedNameArrayObj.connectors;
  composedNameArrayRead = true;
}

//Get a random name from the name array
function getRandomName(){
  var selection = Math.floor(Math.random() *  nameArray.length);
  return nameArray[selection];
}

function getRandomComposedName(){
  var firstName = firstNameArray[Math.floor(Math.random() *  firstNameArray.length)];
  var lastName = lastNameArray[Math.floor(Math.random() *  lastNameArray.length)];
  var connector = connectorArray[Math.floor(Math.random() *  connectorArray.length)];
  var allCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  var sponser = "";
  for(var i = 0; i < 3; i++){
    sponser += allCharacters.charAt(Math.floor(Math.random() * allCharacters.length));
  }
  return "["+sponser+"]"+firstName+connector+lastName;
}

fs.readFile('resources/json/fullNames.json','utf8',jsonNameRead);
fs.readFile('resources/json/nameParts.json','utf8',jsonNameComposedRead);

var compiledEsportsTemplate = pug.compileFile(__dirname + '/resources/pugfiles/index.pug');

myAppServer.get('/esports',function(req,res){
  //If the name array is array then send one
  if(composedNameArrayRead){
    var returnName = getRandomComposedName();
    var esportsTemplateOutput = compiledEsportsTemplate({name:returnName});
    res.send(esportsTemplateOutput);
  }
  //If not just a debug message
  else {
    res.send("NOT READY");
  }
})

var server = myAppServer.listen(process.env.PORT || 8081, function(){

});
