//Read a json file.
var fs = require('fs');
var express = require('express');
var path = require('path');
var pug = require('pug');

var nameArray = new Array();

var myAppServer = express();
var nameArrayRead = false;

function jsonNameRead(err,data){
  if(err) throw err;
  var jsonNameArrayObj = JSON.parse(data);
  nameArray = jsonNameArrayObj.nameArray;
  nameArrayRead = true;
}


//Get a random name from the name array
function getRandomName(){
  var selection = Math.floor(Math.random() *  nameArray.length);
  return nameArray[selection];
}

fs.readFile('resources/json/fullNames.json','utf8',jsonNameRead);

var compiledEsportsTemplate = pug.compileFile(__dirname + '/resources/pugfiles/index.pug');

myAppServer.get('/esports',function(req,res){
  //If the name array is array then send one
  if(nameArrayRead){
    var returnName = getRandomName();
    var esportsTemplateOutput = compiledEsportsTemplate({name:returnName});
    res.send(esportsTemplateOutput);
  }
  //If not just a debug message
  else {
    res.send("NOT READY");
  }
})

var server = myAppServer.listen(process.enc.PORT || 8081, function(){

});
