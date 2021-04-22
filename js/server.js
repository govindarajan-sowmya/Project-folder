
  
let express = require("express");
let app = express();

//var app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;




var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());



const dummyProject={
  author:'sowmya',
  imageUrl:'https://getwallpapers.com/wallpaper/full/f/3/a/807159-download-funny-cats-wallpapers-1920x1200-meizu.jpg',
  videoUrl:'https://youtu.be/SkgTxQm9DWM',
  uniqueID:'4',
  description:'W',
  title:'Food app'
}
let dummyData=[dummyProject,dummyProject]

//serve projects data to the requestor 
app.get('/api/projects',(req,res)=>{
  console.log('projects requested')
  
  // get projects from database
  getProjects(res)

})

app.post('/api/projects',(req,res)=>{
  console.log('New project posted')
  console.log('body',req.body)
  let project=req.body;
  insertProject(project,res)

})


app.get("/test", function (request, response) {
  var user_name = request.query.user_name;
  response.end("Hello " + user_name + "!");
});


//socket test
io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  setInterval(()=>{
    socket.emit('number', parseInt(Math.random()*10));
  }, 1000);

});


http.listen(port,()=>{
  console.log("Listening on port ", port);
});






//this is only needed for Cloud foundry 
require("cf-deployment-tracker-client").track();




/// DATABASE Connections
//database connection 
const uri = mongo "mongodb+srv://cluster0.qiqrp.mongodb.net/myFirstDatabase" --username govindarajans"
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
