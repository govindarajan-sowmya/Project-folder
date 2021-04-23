
let express = require("express");
let app = express();
const http =  require('http')
const fs = require('fs')
const port = 3000
const MongoClient = require('mongodb').MongoClient
const server = http.createServer(function(req,res){
  res.writeHead(200,{'Content-Type':'text/html'})
  fs.readFile('index.html',function(error,data){
    if (error) {
      res.writeHead(404)
      res.write('error')
    } else {
      res.write(data)
    }
    res.end()
  })
  
  });
  var tables = [];
var waitlist = [];

// Routes
// =============================================================

// Basic route that sends the user first to the AJAX Page
app.get("/Reserve.html", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Basic route that sends the user to the page for making reservations.
app.get("/reserve.html", function(req, res) {
  res.sendFile(path.join(__dirname, "Reserve.html"));
});



// Route to send current data (as JSON) on reserved and waitlisted parties.

// Creates new table reservations.
app.post("/reserve", function(req, res) {
  var newtable = req.body;
  newtable.routeName = newtable.name.replace(/\s+/g, "").toLowerCase();

  console.log(newtable);

  if (tables.length>4) {
    waitlist.push(newtable);
  }
  else {
    tables.push(newtable);
  }

  res.json(newtable);
});
server.listen(port, function(error){
  if (error){
    console.log('something went wrong',error)
  }else {
    console.log('server running on port '+port)
  }
});



const uri = "mongodb+srv://sit725:sit725@sit725.xjiqt.mongodb.net/reckoning?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true,useUnifiedTopology: true });

let projectsCollection;

// this function is used to open the connection 
const openConnection = (message) => {
  client.connect((err,db) => {
    projectsCollection = client.db("deakinCrowds").collection("projects");
    if(!err){
      console.log('Database Connected')
    }
  });
}


// insert project into the db
// takes a project entry, add date to it and pushes into the collection
const insertProject=(project,res)=>{
  // insert into collection
  projectsCollection.insert(project,(err,result)=>{
    console.log('Project Inserted',result)
    res.send({result:200})
  }) 
}

// retrieve all projects
const getProjects=(res)=>{
  projectsCollection.find().toArray(function(err, result) {
    if (err) throw err;
    res.send(result)
  })
}

openConnection()

