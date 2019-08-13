var client = require('node-rest-client-promise').Client();
var fs = require('fs');


function l(a){
    console.log("\nModel:")
    console.log(a)
    console.log("\n")
}
l('model run')


const globalSettings = {
    url:"https://ffm.ukrtelecom.net",
    intervals:{
        aTob:25,
        bToc:30
    },
    gpsPattern:[
        {long:42.123123,lat:34.321321},
        {long:44.123123,lat:36.321321},
        {long:45.123123,lat:31.321321},
        {long:46.123123,lat:37.321321}
    ]
}


class Model{
    constructor(){
        this.arr = [];
    }
    additem(data){
        this.arr.push(data)
    }
    getarr(){
        return this.arr;
    }
    getitem(key){
       return this.arr.find(item => item.key === key);
    }
    updateitem(key,data){
        const item = this.getitem(key);
        l(item)
        for(let o in item){
            data[o] !== undefined ?  item[o] = data[o] : undefined;
        }
        l(item)
    }
    removeitem(key){
        const index = this.arr.findIndex(item => item.key == key);
        this.arr.splice(index, 1)
    }
    loadActivityData(key){
        const profile = this.arr.find(item => item.key === key);

        return new Promise(function(resolve,reject){
            client.postPromise(
                globalSettings.url + "/ServiceModel/AuthService.svc/Login",
                {
                    data: JSON.stringify({UserName:profile.login,UserPassword:profile.password}),
                    headers: { "Content-Type": "application/json" }
                }
            )
            .then(a => {
                // resolve(a.data)
                if(a.data.Code !== 0){
                    reject(a.data.Message)
                    throw '0'
                }
                // profile.data = a.data;
                let cookie = a.response.headers['set-cookie'];
                return a;
                
            })
            .then(a => {
                let cookie = a.response.headers['set-cookie'];
                let csrftoken =  cookie[3].slice(8,-8);
                l(cookie);
                l(csrftoken);
                let getargs = {
                    headers: { "Content-Type": "application/json;odata=verbose" , "Accept": "application/json;odata=verbose" , "Cookie": cookie ,  "BPMCSRF": csrftoken }
                }
                return client.getPromise(globalSettings.url + "/0/ServiceModel/EntityDataService.svc/ActivityCollection?$filter=Owner/TsiLogin%20eq%20'" + profile.login + "'&$orderby=CreatedOn%20desc&$top=6&$select=Title,StatusId,OwnerId,CreatedOn,StartDate,Id",getargs)
            })
            .then(a => {
                let answer = JSON.parse(a.data).d.results
                profile.data.avtivity = answer;
                let readableData = JSON.stringify(answer).replace(/(,")/g, ',\n"');
                fs.writeFile('data.json', readableData , function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
                resolve ('Data downloaded');
            })
            .catch(a => reject(a));            


        })
    }
}

const model = new Model();

class Profile{
    constructor(data){
        this.key = data.login;
        this.login = data.login;
        this.password = data.password;
        this.intervals = (data.intervals !== undefined ? data.intervals : globalSettings.intervals);
        this.gpsPattern = (data.gpsPattern !== undefined ? data.gpsPattern : globalSettings.gpsPattern);
        this.data = {};
    }
    showdata(){
        return this.data
    }

}

console.log(new Date(1565708289905))
console.log(new Date(1565684632696))
jsonDate = "/Date(1565684632696)/"
var date = eval(jsonDate.replace(/\/Date\((\d+)\)\//gi, "new Date($1)"));
console.log(new Date(1565724084181))
console.log(new Date(1565724084181))

console.log((new Date(1565684632696)) < (new Date(1565708289905)))



// model.loadActivityData('vkomelkov').then(a => {
//     l(model.getitem('vkomelkov').showdata());
// }).catch(a => l("error " + a));



module.exports = {
    Model,
    Profile
};
