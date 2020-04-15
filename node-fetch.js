// const fetch = require('node-fetch');

const nodeFetch = require('node-fetch')
const tough = require('tough-cookie')
const fetchCookie = require('fetch-cookie')
const fetch = fetchCookie(nodeFetch, new tough.CookieJar())

const body = { UserName: 'vkomelkov', UserPassword: 'Qwer5555' };

login = () => {
    return new Promise((resolve, reject) => {
        fetch('https://ffm.ukrtelecom.net/ServiceModel/AuthService.svc/Login', {
            method: 'post',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(res => res.json())
            .then(json => {
                console.log(json)
                if (json.Code) {
                    reject(json.Message)
                    throw '0'
                }
                resolve('authentifycado');
            })
            .catch(err => reject(err))
    })
}


load = () => {
    return new Promise((resolve, reject) => {

        fetch("https://ffm.ukrtelecom.net/0/ServiceModel/EntityDataService.svc/TsiVisitStatusHistoryCollection", {
            method: 'get',
            headers: { "Content-Type": "application/json;odata=verbose" , "Accept": "application/json;odata=verbose"},
        })
            .then(res => {
                console.log(res.headers)
                return res
            })
            .then(res => res.json())
            .then(json => console.log(json));
    })
}

// login()
//     .then(a => console.log(a))
//     .then(a => load())
//     .catch(err => console.log(err))


