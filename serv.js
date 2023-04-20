const http = require('http')
const path = require("path")
const fs = require("fs")
const rout = require('./router.js')
const pool = require('./db.js')
const host = 'localhost'
const port = 8000

const dotenv = require("dotenv")
const { log } = require('console')

//const tableData = [{FIO: 'Скворцов Марк Владимирович', login:'marikdead'},{FIO: 'Смородин Валерий Русланович', login:'T0r1n'},{FIO: 'Евдокимов Ростислав Алексеевич', login:'FIDR1707'},{FIO: 'Поляков Михаил Михайлович', login:'GhostProkaznik'}]

function indexPagehandler(request, response){
    return 'autorization.html';
}

function tablePagehandler(request, response){
    return "Inner/innerTable.html";
}

function newUserPagehandler(request, response){
    return 'Inner/innerAdd.html';
}

async function getTableDataHandler(request, response){
    const res = await pool.query('SELECT * FROM Users')
    const tableData = [{}]
    for (i of res.rows){
        userdata = {
            FIO: i['full_name'],
            login: i["username"]
        }
        tableData.push(userdata)
    }
    response.end(JSON.stringify(tableData.map(i => ({FIO: i.FIO, login:i.login})))); return;
}

router = rout.getInst();



http.createServer((request, response)=>{
    console.log(request.method,request.url)

    router.appendRoute('GET','/',indexPagehandler)
    router.appendRoute('POST','/login',getparam)
    router.appendRoute('GET','/table',tablePagehandler)
    router.appendRoute('GET','/new',newUserPagehandler)
    router.appendRoute('GET','/getTableData',getTableDataHandler)
    router.appendRoute('POST','/addUser',user_add)

    //staticpath = path.join(process.cwd(),'./static')

    response.setHeader('content-type', 'text/html')    
    //const method = request.method
    const url = request.url

    let name = ''
    if (url.endsWith('.css')){
        response.setHeader('content-type', 'text/css');
    }
    else if (url.endsWith('.js')){
        response.setHeader('content-type', 'text/javascript');
    }
    
    name = router.serverRoute(request, response);
    if (typeof name == 'string'){
    const sait = fs.createReadStream(path.join(process.cwd(),name))
    sait.on('error',err=>{console.log(err.message)})
    sait.pipe(response)}
}).listen(port, host, ()=>{console.log("Server online")})

const usermap = new Map();

async function auth(login, password, request, response){
    loginauth = 0
    const res = await pool.query('SELECT * FROM Users')
    for (i of res.rows){
        if ((i['username'] == login) && (i['password'] == password)) { loginauth++}
    }
    if (loginauth > 0) {
        response.statusCode = '200';
        const token = {id:generate_token(10)};
        console.log(usermap);
        usermap.set(token,login)
        response.end(JSON.stringify(token));}
    else {
        response.statusCode = '401';
        response.end();}
}

function generate_token(length){
    var a = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890".split("");
    var b = [];  
    for (var i=0; i<length; i++) {
        var j = (Math.random() * (a.length-1)).toFixed(0);
        b[i] = a[j];
    }
    return b.join("");
}

async function Add(user, response){
    const res = await pool.query("INSERT INTO Users (full_name,username, password) VALUES ('"+user.FIO+"', '"+user.login+"', '"+user.password+"')")
    response.end()
}

function user_add(request, response){
    let data = []
    request.on('data', dat2a=>{
        data.push(dat2a)     
    })

    request.on('end', ()=>{
        console.log(request.headers.authorization);
        const user = JSON.parse(data.join());
        Add(user,response)
    })
}


async function getparam(request, response){
    
    let data = []
    request.on('data', dat2a=>{
        data.push(dat2a)     
    })
    
    request.on('end',()=>{
        const account = JSON.parse(data.join());
        auth(account.login, account.password, request, response)
    })

}