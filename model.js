var client = require('node-rest-client-promise').Client();
var fs = require('fs');


function l(a){
    console.log("\nModel:")
    console.log(a)
    console.log("\n")
}
l('model run')



//  Variables


const globalSettings = {
    url:"https://ffm.ukrtelecom.net",
    intervals:{
        aTob:30,
        bToc:30,
        cTod:30
    },
    gpsPattern:[
        {lat:50.7505281,long:26.0437981},
        {lat:59.1861081,long:39.3101441},
        {lat:-1.6027451,long:12.3030921},
        {lat:56.7562581,long:60.4282631}
    ],
    gpsSettings:{
        randomSorting:true,
        randomizePosition:true,
        currentPosition:0
    },
    tsiFfm:{
        work:[
            {
                name_1:'Зона відповідальності оператора',
                name_2:'Заміна плати/обладнання',
                id_1:'3f19ea49-b276-469d-826f-9a0b7f3d96e7',
                id_2:'5ced2699-030a-46e0-e053-710c000ad5f7'
            }
        ],
        res:[
            {
                name_1:'Кабельна мережа доступу',
                name_2:'Розподільча мережа доступу',
                id_1:'12a5ec07-9bbd-4054-8d20-1f7605c470f3',
                id_2:'a5380df5-64ec-4841-9930-8a48defd6572'
            }
        ]
    }
}


// Model


class Model{
    constructor(){
        this.arr = [];
    }
    additem(data){
        this.arr.push(new Profile(data))
    }
    getarr(){
        return this.arr;
    }
    getitem(key){
       return this.arr.find(item => item.key === key);
    }
    getsomeitem(){
        return this.getitem('vkomelkov')
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
    checkAuthData(login,password){
        return new Promise(function(resolve,reject){
            client.postPromise(globalSettings.url + "/ServiceModel/AuthService.svc/Login",
            {
                data: JSON.stringify({UserName:login,UserPassword:password}),
                headers: { "Content-Type": "application/json" }
            })
            .then(a => {
                if(a.data.Code !== 0){
                    reject(a.data.Message)
                    throw '0'
                }
                let cookie = a.response.headers['set-cookie'];
                let csrftoken =  cookie[3].slice(8,-8);
                l(cookie);
                l(csrftoken);
                return client.getPromise(globalSettings.url + "/0/ServiceModel/EntityDataService.svc/ContactCollection?$filter=TsiLogin%20eq%20'" + login + "'&$select=Id,Name,JobTitle,MobilePhone,HomePhone,TsiContactPhone,Email",{
                    headers: { "Content-Type": "application/json;odata=verbose" , "Accept": "application/json;odata=verbose" , "Cookie": cookie ,  "BPMCSRF": csrftoken }
                })
            })
            .then(a => {
                let answer = JSON.parse(a.data)
                if(answer.d == undefined){
                    reject(JSON.parse(a.data).error.message.value)
                    throw '0'
                }
                let newProfile = {
                    login,
                    password,
                    id:answer.d.results[0].Id,
                    name:answer.d.results[0].Name,
                    job:answer.d.results[0].JobTitle,
                    email:answer.d.results[0].Email,
                    mobile:answer.d.results[0].TsiContactPhone
                }
                let readableData = JSON.stringify(answer.d.results).replace(/(,")/g, ',\n"');
                fs.writeFile('contact.json', readableData , function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
                resolve (newProfile);
            })
            .catch(a => reject(a))
        })
    }
    login(key){
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
                if(a.data.Code !== 0){
                    reject(a.data.Message)
                    throw '0'
                }
                let cookie = a.response.headers['set-cookie'];
                let csrftoken =  cookie[3].slice(8,-8);
                // l(cookie);
                // l(csrftoken);
                profile.data.cookie = cookie;
                profile.data.bpmcsrf = csrftoken;
                resolve('authentifycado');
                
            })
            .catch(a => {
                reject (a);
            })
        })
    }
    loadActivityData(key){
        const profile = this.arr.find(item => item.key === key);

        return new Promise(function(resolve,reject){
            client.getPromise(globalSettings.url + "/0/ServiceModel/EntityDataService.svc/ActivityCollection?$filter=Owner/TsiLogin%20eq%20'" + profile.login + "'&$orderby=CreatedOn%20desc&$top=6" + "&$select=Title,StatusId,OwnerId,CreatedOn,Id,ModifiedOn,TsiSymptoms,TsiFFMWorkCategoryId,TsiFFMWorkCategoryL2Id,TsiFFMResCategoryId,TsiFFMResCategoryL2Id,TsiSymptoms,TsiDescription",
            {
                headers: { "Content-Type": "application/json;odata=verbose" , "Accept": "application/json;odata=verbose" , "Cookie": profile.data.cookie ,  "BPMCSRF": profile.data.bpmcsrf }
            })
            .then(a => {
                let answer = JSON.parse(a.data)
                if(answer.d == undefined){
                    reject(JSON.parse(a.data).error.message.value)
                    throw '0'
                }
                profile.data.activity = answer.d.results;
                let readableData = JSON.stringify(answer.d.results).replace(/(,")/g, ',\n"');
                fs.writeFile('data.json', readableData , function (err) {
                    if (err) throw err;
                    console.log('Saved!');
                });
                resolve ('Data downloaded');
            })
            .catch(a => reject(a));            
        })
    }
    processActivityData(key){
        const profile = this.arr.find(item => item.key === key);
        let activityarr = profile.data.activity;
        for (let i = activityarr.length - 1 ; i >= 0; i--) {
            console.log(activityarr[i].Id);
            let getRandomRes = profile.tsiFfm.res[Math.floor(Math.random()*profile.tsiFfm.res.length)]
            let getRandomWork = profile.tsiFfm.work[Math.floor(Math.random()*profile.tsiFfm.work.length)]

            
            // return {
            //     activity:{
            //         Id:'02f43d27-034d-4556-b05e-57ed7f003479',
            //         StatusId:"9dea4d63-6beb-4211-abd9-db4c90eb6496"
            //     },
            //     tsiVisit:{
            //         Id:Math.random().toString(12).substring(2, 10)
            //          + "-2ab0-476d-8cf1-" 
            //          + Math.random().toString(12).substring(2, 14),
            //         CreatedOn: new Date(),
            //         ModifiedOn: new Date(),
            //         TsiActivityStatusId: '9dea4d63-6beb-4211-abd9-db4c90eb6496',
            //         TsiActivityId:'02f43d27-034d-4556-b05e-57ed7f003479',
            //         TsiDateCreatedOn: new Date()   
            //     },
            //     metadata:{
            //         login:profile.login,
            //         password:profile.password,
            //         cookie:profile.data.cookie,
            //         csrftoken:profile.data.bpmcsrf,
            //         action:'Выполнена',
            //         TsiFFMWorkCategoryId:getRandomWork.name_1,
            //         TsiFFMWorkCategoryL2Id:getRandomWork.name_2,
            //         TsiFFMResCategoryId:getRandomRes.name_1,
            //         TsiFFMResCategoryL2Id:getRandomRes.name_2
            //     }
            // }
            



            if(activityarr[i].StatusId == '384d4b84-58e6-df11-971b-001d60e938c6'){
                return {
                    activity:{
                        Id:activityarr[i].Id,
                        StatusId:'394d4b84-58e6-df11-971b-001d60e938c6',
                        ModifiedOn: new Date(),
                        TsiCommonStatusId:'394d4b84-58e6-df11-971b-001d60e938c6',
                        TsiRespondedOn: new Date()
                    },
                    tsiVisit:{
                        Id:Math.random().toString(12).substring(2, 10)
                         + "-2ab0-476d-8cf1-" 
                         + Math.random().toString(12).substring(2, 14),
                        CreatedOn: new Date(),
                        ModifiedOn: new Date(),
                        TsiActivityStatusId: '394d4b84-58e6-df11-971b-001d60e938c6',
                        TsiActivityId:activityarr[i].Id,
                        TsiDateCreatedOn: new Date()   
                    },
                    metadata:{
                        action:'Подтверждена',
                        login:profile.login,
                        password:profile.password,
                        cookie:profile.data.cookie,
                        csrftoken:profile.data.bpmcsrf
                    }

                }
            }
            if(activityarr[i].StatusId == '394d4b84-58e6-df11-971b-001d60e938c6'){
                let actDate = (Number(activityarr[i].ModifiedOn.substring(6,19)) + (new Date().getTimezoneOffset()) * 60 * 1000);
                let nowDate = Date.parse(new Date())
                if (nowDate - actDate > profile.intervals.aTob * 60 * 1000){
                    return {
                        activity:{
                            Id:activityarr[i].Id,
                            StatusId:'9dea4d63-6beb-4211-abd9-db4c90eb6496',
                            ModifiedOn: new Date(),
                            TsiCommonStatusId:'9dea4d63-6beb-4211-abd9-db4c90eb6496'
                        },
                        tsiVisit:{
                            Id:Math.random().toString(12).substring(2, 10)
                             + "-2ab0-476d-8cf1-" 
                             + Math.random().toString(12).substring(2, 14),
                            CreatedOn: new Date(),
                            ModifiedOn: new Date(),
                            TsiActivityStatusId: '9dea4d63-6beb-4211-abd9-db4c90eb6496',
                            TsiActivityId:activityarr[i].Id,
                            TsiDateCreatedOn: new Date()   
                        },
                        metadata:{
                            action:'В Пути',
                            login:profile.login,
                            password:profile.password,
                            cookie:profile.data.cookie,
                            csrftoken:profile.data.bpmcsrf
                        }
                    }
                }
                l('Acc to in time left: ' +  (Math.floor((profile.intervals.cTod) - ((nowDate - actDate) / 1000 / 60))));
                return ('w8');
               
            }
            if(activityarr[i].StatusId == '9dea4d63-6beb-4211-abd9-db4c90eb6496'){
                let actDate = (Number(activityarr[i].ModifiedOn.substring(6,19)) + (new Date().getTimezoneOffset()) * 60 * 1000);
                let nowDate = Date.parse(new Date())
                if (nowDate - actDate > profile.intervals.bToc * 60 * 1000){
                    return {
                        activity:{
                            Id:activityarr[i].Id,
                            StatusId:'7fa82408-d9f1-41d6-a56d-ce3746701a46',
                            ModifiedOn: new Date(),
                            TsiCommonStatusId:'7fa82408-d9f1-41d6-a56d-ce3746701a46'
                        },
                        tsiVisit:{
                            Id:Math.random().toString(12).substring(2, 10)
                             + "-2ab0-476d-8cf1-" 
                             + Math.random().toString(12).substring(2, 14),
                            CreatedOn: new Date(),
                            ModifiedOn: new Date(),
                            TsiActivityStatusId: '7fa82408-d9f1-41d6-a56d-ce3746701a46',
                            TsiActivityId:activityarr[i].Id,
                            TsiDateCreatedOn: new Date()   
                        },
                        metadata:{
                            action:'На обьекте',
                            login:profile.login,
                            password:profile.password,
                            cookie:profile.data.cookie,
                            csrftoken:profile.data.bpmcsrf
                        }
                    }
                }
                l('in to on time left: ' +  (Math.floor((profile.intervals.bToc) - ((nowDate - actDate) / 1000 / 60))));
                return ('w8');
            }
            if(activityarr[i].StatusId == '7fa82408-d9f1-41d6-a56d-ce3746701a46'){
                let actDate = (Number(activityarr[i].ModifiedOn.substring(6,19)) + (new Date().getTimezoneOffset()) * 60 * 1000);
                let nowDate = Date.parse(new Date())
                if (nowDate - actDate > profile.intervals.cTod * 60 * 1000){
                    let getRandomRes = profile.tsiFfm.res[Math.floor(Math.random()*profile.tsiFfm.res.length)]
                    let getRandomWork = profile.tsiFfm.work[Math.floor(Math.random()*profile.tsiFfm.work.length)]
                    console.log(getRandomRes);
                    console.log(getRandomWork);
                    return {
                        activity:{
                            Id:activityarr[i].Id,
                            StatusId:'4bdbb88f-58e6-df11-971b-001d60e938c6',
                            ModifiedOn: new Date(),
                            TsiCommonStatusId:'4bdbb88f-58e6-df11-971b-001d60e938c6',
                            TsiTaskCategoryId:"826d6e5a-94aa-41ea-8634-638b52d7149e",
                            TsiResponsibilityAreaId:"4af25e7d-c713-4178-8434-9277060b9d9c",
                            TsiResCategoryId:"5c896492-8f0b-46d7-9087-4e7dc6cdf87a"

                        },
                        tsiVisit:{
                            Id:Math.random().toString(12).substring(2, 10)
                             + "-2ab0-476d-8cf1-" 
                             + Math.random().toString(12).substring(2, 14),
                            CreatedOn: new Date(),
                            ModifiedOn: new Date(),
                            TsiActivityStatusId: '4bdbb88f-58e6-df11-971b-001d60e938c6',
                            TsiActivityId:activityarr[i].Id,
                            TsiDateCreatedOn: new Date()   
                        },
                        metadata:{
                            action:'Выполнена',
                            login:profile.login,
                            password:profile.password,
                            cookie:profile.data.cookie,
                            csrftoken:profile.data.bpmcsrf
                        }
                    }
                }
                
                l('on to close time left: ' +  (Math.floor((profile.intervals.cTod) - ((nowDate - actDate) / 1000 / 60))));
                return ('w8');
                
            }
        }
        return 'Nothnt';
    }
    sendTsiVisit(data){
        return new Promise(function(resolve,reject){
            client.postPromise(globalSettings.url + "/0/ServiceModel/EntityDataService.svc/TsiVisitStatusHistoryCollection",
            {
                data: JSON.stringify(data.tsiVisit),
                headers: { "Content-Type": "application/json;odata=verbose" , "Accept": "application/json;odata=verbose" , "Cookie": data.metadata.cookie ,  "BPMCSRF": data.metadata.csrftoken }
            })
            .then(a => {
                l(JSON.parse(a.data))
                let answer = JSON.parse(a.data);
                if(answer.d == undefined){
                    reject(JSON.parse(a.data).error.message.value)
                    throw '0'
                }
                resolve ('TsivisitAdded');
            })
            .catch(a => reject(a)); 
        })
    }
    changeActivityState(data){
        return new Promise(function(resolve,reject){
            let link = globalSettings.url + "/0/ServiceModel/EntityDataService.svc/ActivityCollection(guid'" + data.activity.Id + "')";
            l(link);
            
            client.putPromise(link,
            {
                data: JSON.stringify(data.activity),
                headers: { "Content-Type": "application/json;odata=verbose" , "Accept": "application/json;odata=verbose" , "Cookie": data.metadata.cookie ,  "BPMCSRF": data.metadata.csrftoken }
            })
            .then(a => {
                l(a.response.statusCode);
                if(a.response.statusCode !== 204){
                    reject(JSON.parse(a.data).error.message.value)
                    throw '0'
                }
                resolve ('Activity changed');
            })
            .catch(a => reject(a)); 
        }) 
    }
    updateLocation(key){
        const profile = this.getitem(key);
        const getRandomLocation = profile.getgps();
        l(getRandomLocation);
        return new Promise(function(resolve,reject){
            client.postPromise(globalSettings.url + "/0/ServiceModel/EntityDataService.svc/LocationHistoryCollection",
            {
                data: JSON.stringify({
                    Date:new Date(),
                    Id:Math.random().toString(12).substring(2, 10)
                     + "-65ff-4033-8f1b-" 
                     + Math.random().toString(12).substring(2, 14),
                    Longitude:getRandomLocation.long,
                    Latitude:getRandomLocation.lat
                }),
                headers: { "Content-Type": "application/json;odata=verbose" , "Accept": "application/json;odata=verbose" , "Cookie": profile.data.cookie ,  "BPMCSRF": profile.data.bpmcsrf }
            })
            .then(a => {
                l(JSON.parse(a.data))
                let answer = JSON.parse(a.data);
                if(answer.d == undefined){
                    reject(JSON.parse(a.data).error.message.value)
                    throw '0'
                }
                resolve ('Location added');
            })
            .catch(a => reject(a));
        })

    }
}


// Profile class

class Profile{
    constructor(data){
        this.key = data.login;
        this.login = data.login;
        this.id = data.id;
        this.name = data.name;
        this.job = data.job;
        this.email = data.email;
        this.mobile = data.mobile;
        this.password = data.password;
        this.intervals = (data.intervals !== undefined ? data.intervals : globalSettings.intervals);
        this.gpsPattern = (data.gpsPattern !== undefined ? data.gpsPattern : globalSettings.gpsPattern);
        this.gpsSettings = (data.gpsSettings !== undefined ? data.gpsSettings : globalSettings.gpsSettings);
        this.tsiFfm = (data.tsiFfm !== undefined ? data.tsiFfm : globalSettings.tsiFfm);
        this.data = {cookie:{},bpmcsrf:{},activity:{}};
    }
    showdata(){
        return this.data;
    }
    getgps(){
        let lat = 0;
        let long = 0;
        l(this.gpsPattern)
        if (this.gpsSettings.randomSorting) {
            l('random sorting')
            let randObj = this.gpsPattern[Math.floor(Math.random()*this.gpsPattern.length)];
            lat = randObj.lat;
            long = randObj.long;
        } else {
            l('sort by order')
            l(this.gpsSettings.currentPosition)
            if (this.gpsSettings.currentPosition == this.gpsPattern.length) {
                this.gpsSettings.currentPosition = 0;
            }
            let randObj = this.gpsPattern[this.gpsSettings.currentPosition];
            lat = randObj.lat;
            long = randObj.long;
            this.gpsSettings.currentPosition++
        }
        
        if (this.gpsSettings.randomizePosition) {
            lat = (lat + (Math.floor(Math.random() * 100 - Math.random() * 100) / 10000)).toFixed(7);
            long = (long + (Math.floor(Math.random() * 100 - Math.random() * 100) / 10000)).toFixed(7);
            l('Position randomized')
        }
        return {lat:lat,long:long};
    }
}


module.exports = {
    Model,
    Profile
};

