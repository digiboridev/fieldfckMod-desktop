const fetch = require('node-fetch');

const body = {UserName:'vkomelkov',UserPassword:'Qwer5555'};
 
let gres,gresheaders;

fetch('https://ffm.ukrtelecom.net/ServiceModel/AuthService.svc/Login', {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => {
        // let csrftoken = res.headers.raw()['set-cookie'][3].slice(8, -8)
        gres = res.headers.get('set-cookie');
        gresheaders = res.headers.raw()['set-cookie'];
        let cookie = res.headers.get('set-cookie');
        // console.log(csrftoken)
        console.log(cookie)
        return res
    })
    .then(res => res.json())
    .then(json => {
        console.log(json)
        console.log(gresheaders[0])
    })
    .catch(err => {console.log(err)})