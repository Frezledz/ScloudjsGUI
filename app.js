const express = require("express");
const app = express();
const scloudjs = require("scloudjs");
const port = 3000;
app.use("/",express.static(__dirname+"/src"))
app.use(express.json());

app.listen(port,()=>{
    console.log(`Application launched.\nOpen your browser and access to localhost:${port}`);
});

let adata = {
    username:"",
    password:"",
    projectid:"",
    process:"",
    clouddatas:""
}

app.post('/login', async (req, res)=> {
    const data = req.body;
    adata.username = data.username;
    adata.password=data.password;
    scloudjs.setdatas(adata.username,adata.password,"",process,_clouddatas);
    scloudjs.login().then(()=>{
        res.sendStatus(200);
    }).catch(result=>{
        res.sendStatus(403);
    });
  });

  let _clouddatas = new Object();
  const process = (data)=>{
    const temp = scloudjs.parsedata(data,_clouddatas);
    _clouddatas = temp.clouddatas;
    const changedlists = temp.changedlists;
    wss.clients.forEach(client=>{
        client.send(JSON.stringify({clouddatas:temp.clouddatas,changedlists:changedlists}));
    });
 };
app.get('/connect', (req, res)=> {
    scloudjs.connect().then(result=>{
        res.sendStatus(200);
    })
  });

const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 3001 });

app.post("/handshake",async(req,res)=>{
    const data=req.body;
    adata.projectid=data.projectid;
    scloudjs.setdatas(adata.username,adata.password,adata.projectid,process,_clouddatas);
    await scloudjs.handshake();
    res.sendStatus(200);
})

app.post("/change",async(req,res)=>{
    const data=req.body;
    const name = data.name;
    const val = data.value;
    scloudjs.sendtocloud(name,val);
    res.send(val);
});