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
    await fetch("./html/cloud.html").then(res=>res.text()).then(res=>{document.body.getElementsByTagName("div")[0].innerHTML=res});
    const changes = document.getElementsByClassName("changes")[0].getElementsByTagName("p");
    changes[0].getElementsByTagName("span")[0].innerHTML=`<a href ="https://scratch.mit.edu/users/${info.username}/">${info.username}</a>`;
}