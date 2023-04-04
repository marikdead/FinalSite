const input_login = document.getElementById("login");
const input_password = document.getElementById("password");
const body = document.getElementById("bodycont");


async function POST_autor(){
    const log = input_login.value;
    const pass = input_password.value;
    let response = await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({
            login: log,
            password: pass
        })
      });
      console.log(response)
      if (response.status == '200'){
        let token = await response.json();
        console.log(token);
        localStorage.setItem(token['id'],log)
        alert('Вход выполнен');
        const resp = await (await fetch('/table')).text();
        body.innerHTML = resp;
      }
      else{
        alert("Ошибка данных");
      }

}

async function getData(){
  const table = document.getElementById('table1');
  const tr2 = document.createElement('tr')
    const td1 = document.createElement('td')
    const td2 = document.createElement('td')
    const td3 = document.createElement('td')
  let response = await fetch('/getTableData');
  let jsontableData = await response.json();
  let countID = 1;
  console.log(jsontableData)
  for (i of jsontableData){
    console.log(i)
    const tr2 = document.createElement('tr')
    const td1 = document.createElement('td')
    const td2 = document.createElement('td')
    const td3 = document.createElement('td')
    td1.textContent = countID;
    td2.textContent = i.FIO;
    td3.textContent = i.login;
    countID++;
    tr2.appendChild(td1);
    tr2.appendChild(td2);
    tr2.appendChild(td3);
    table.appendChild(tr2);
  }
}

async function to_add_form(){
  let response = await (await fetch('/new')).text();
  body.innerHTML = response;
}

async function addUser(){
  const user_login = document.getElementById("login").value;
  const user_password = document.getElementById("password").value;
  const user_fio = document.getElementById("full_name").value;
  let response = await fetch('/addUser', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      'Authorization': "Token_stamp"
    },
    body: JSON.stringify({
        FIO: user_fio,
        login: user_login,
        password: user_password,
    })
  });
  console.log('Прошло',response)
  const resp = await (await fetch('/table')).text();
  body.innerHTML = resp;
}