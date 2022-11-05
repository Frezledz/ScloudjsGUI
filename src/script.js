let info={username:"",projectid:"",}
const loginfunc = async()=>{
    await fetch("./html/login.html").then(res=>res.text()).then(res=>{document.body.getElementsByTagName("div")[0].innerHTML=res});
    const loginbox = document.getElementById("loginbox");
    const loginstatus = document.getElementsByClassName("box")[2];
    const loginbutton = loginstatus.getElementsByClassName("loginbutton")[0];
    loginbutton.addEventListener("click",()=>{
        const username = loginbox.getElementsByClassName("username")[0].value;
        info.username=username;
        const password = loginbox.getElementsByClassName("password")[0].value;
        fetch("/login",{
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({username:username,password:password}),
        }).then(res=>{
            if(res.status==200){
                loginstatus.getElementsByClassName("status")[0].innerText = "Login succeeded! Connecting to the cloud server...";
                cloudfunc();
            }else{
                loginstatus.getElementsByClassName("status")[0].innerText = "try again";
                setTimeout(() => {
                    
                loginstatus.getElementsByClassName("status")[0].innerText = null;
                }, 2000);
    
            }
        })

    })

}
loginfunc();

const cloudfunc = async ()=>{
    await fetch("/connect");
    await fetch("./html/cloud.html").then(res=>res.text()).then(res=>{document.getElementsByTagName("div")[0].innerHTML=res});
    const util = document.getElementsByClassName("util")[0];
    const table = document.getElementsByClassName("table")[0];
    const changes = document.getElementsByClassName("changes")[0].getElementsByTagName("p");  
    const changeval = document.getElementsByClassName("changeval")[0];
    const pconnect = document.getElementsByClassName("projectconnect")[0];  
    const changevals = {
        choice:changeval.getElementsByClassName("choice")[0],
        input:changeval.getElementsByClassName("projectid")[0],
        button:changeval.getElementsByClassName("button")[0],
    };
    changes[0].getElementsByTagName("span")[0].innerHTML=`<a href ="https://scratch.mit.edu/users/${info.username}/">${info.username}</a>`;
    const projectconnect = {
        input:pconnect.getElementsByClassName("projectid")[0],
        button:pconnect.getElementsByClassName("projectbutton")[0]
    };
    
    projectconnect.input.addEventListener("change",()=>{
        projectconnect.input.value=projectconnect.input.value.match(/[0-9]/g).toString().replace(/,/g,"");;
    });
    projectconnect.button.addEventListener("click",()=>{
        if(projectconnect.input.value !==""){
            info.projectid = projectconnect.input.value;
            fetch("/handshake",{
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({projectid:info.projectid}),
            }).then(()=>{
                changes[1].getElementsByTagName("span")[0].innerHTML=`<a href ="https://scratch.mit.edu/projects/${info.projectid}/">https://scratch.mit.edu/projects/${info.projectid}/</a>`;
                const ws = new WebSocket('ws://localhost:3001');
                ws.onmessage=e=>{
                    const data = JSON.parse(e.data);
                    const clouddatas = data.clouddatas;
                    const changedlists = data.changedlists;
                    const cloudkeys = Object.keys(clouddatas);
                    let str=`<tr class="title"><th>variable names</th><th>value</th></tr>`;
                    let str2="";
                    for(c of cloudkeys){
                        str = str+`<tr class="${c}"><td>${c}</td><td>${clouddatas[c].value}</td></tr>`;
                        str2=str2+`<option value="${c}">${c}</option>`
                    }
                    table.getElementsByTagName("table")[0].innerHTML=str;
                    changevals.choice.innerHTML=str2;
                    changes[2].getElementsByTagName("span").innerText=changedlists.toString();
                    
                }
            })
        }
    })
    changevals.input.addEventListener("change",()=>{
        changevals.input.value=changevals.input.value.match(/[0-9]/g).toString().replace(/,/g,"");
    });
    changevals.button.addEventListener("click",()=>{
        fetch("/change",{
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({name:changevals.choice.value,value:changevals.input.value}),
        }).then(res=>{
            table.getElementsByTagName("table")[0].getElementsByClassName(changevals.choice.value)[0].getElementsByTagName("td")[1].innerText=changevals.input.value;
        })
    })
}