const fetch = require('node-fetch');

const body = {UserName:'vkomelkov',UserPassword:'Qwer5555'};
 
fetch('https://ffm.ukrtelecom.net/ServiceModel/AuthService.svc/Login', {
        method: 'post',
        body:    JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => {
        let csrftoken = res.headers.raw()['set-cookie'][3].slice(8, -8)
        let cookie = res.headers.get('set-cookie')
        // console.log(cookie)
        // console.log(csrftoken)
        return res
    })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => {console.log(err)})