const express = require("express");
const app = express();
const scloudjs = require("scloudjs");
const port = 3000;
// テンプレートエンジンの指定
app.use("/",express.static(__dirname+"/src"))
app.use(express.json());

app.listen(port,()=>{
    console.log(`Application hosted on localhost:${port}`);
});


let adata = {
    username:"",
    password:"",
    projectid:"",
    process:"",
    clouddata:""
}
const process = (data)=>{
    const temp = scloudjs.parsedata(data,clouddatas);
    clouddatas = temp.cloudatas;
    const changedlists = temp.changedlists;
 };

let cloudata = new Object();
app.post('/login', async (req, res)=> {
    const data = req.body;
    adata.username = data.username;
    adata.password=data.password;
    scloudjs.setdatas(adata.username,adata.password,"",process,cloudata);
    scloudjs.login().then(()=>{
        res.sendStatus(200);
    }).catch(result=>{
        res.sendStatus(403);
    });
  });

app.get('/connect', async (req, res)=> {
    scloudjs.connect().then(result=>{
        res.sendStatus(200);
    })
  });