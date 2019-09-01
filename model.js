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
        {long:42.123123,lat:34.321321},
        {long:44.123123,lat:36.321321},
        {long:45.123123,lat:31.321321},
        {long:46.123123,lat:37.321321}
    ],
    tsiFfm:{
        work:[
            {
                name_1:'Зона відповідальності оператора',
                name_2:'Заміна плати/обладнання',
                id_1:'3f19ea49-b276-469d-826f-9a0b7f3d96e7',
                id_2:'5ced2699-030a-46e0-e053-710c000ad5f7'
            },
            {
                name_1:'Зона відповідальності оператора',
                name_2:'Виконано чистку обладнання',
                id_1:'3f19ea49-b276-469d-826f-9a0b7f3d96e7',
                id_2:'9852844c-1149-424c-9217-24c2ae228f47'
            },
            {
                name_1:'Зона відповідальності оператора',
                name_2:'Виконано в рамках АВР',
                id_1:'3f19ea49-b276-469d-826f-9a0b7f3d96e7',
                id_2:'5ced2699-0306-46e0-e053-710c000ad5f7'
            },
            {
                name_1:'Зона відповідальності абонента',
                name_2:'Надана технічна консультація',
                id_1:'b4c2fbe0-6d41-46c8-a099-6c7aa37be832',
                id_2:'5835d5b0-5983-4d2c-be03-e57caa6a6f49'
            },
            {
                name_1:'Зона відповідальності абонента',
                name_2:'Рекомендовано заміну',
                id_1:'b4c2fbe0-6d41-46c8-a099-6c7aa37be832',
                id_2:'5ced2699-0302-46e0-e053-710c000ad5f7'
            },
            {
                name_1:'Зона відповідальності оператора',
                name_2:'Включено',
                id_1:'3f19ea49-b276-469d-826f-9a0b7f3d96e7',
                id_2:'5ced2699-0309-46e0-e053-710c000ad5f7'
            },
            {
                name_1:'Зона відповідальності оператора',
                name_2:'Виконано кросування',
                id_1:'3f19ea49-b276-469d-826f-9a0b7f3d96e7',
                id_2:'1b18bcf9-7790-4e02-a5a3-b9c7274bd72b'
            },
            {
                name_1:'Зона відповідальності абонента',
                name_2:'Виконано діагностику. Очікування дій абонента',
                id_1:'b4c2fbe0-6d41-46c8-a099-6c7aa37be832',
                id_2:'ec2da8fe-8d6c-4786-831d-11b7a6b7ccb1'
            }
        ],
        res:[
            {
                name_1:'Кабельна мережа доступу',
                name_2:'Розподільча мережа доступу',
                id_1:'12a5ec07-9bbd-4054-8d20-1f7605c470f3',
                id_2:'a5380df5-64ec-4841-9930-8a48defd6572'
            },
            {
                name_1:'Електрообладнання постійного струму',
                name_2:'Електроживильні установки',
                id_1:'2281dab0-468a-458b-a2b7-fc0a809377bb',
                id_2:'276d9445-d246-4208-9c75-3a0bf6b29e66'
            },
            {
                name_1:'Кабельна мережа доступу',
                name_2:'Магістральна мережа доступу',
                id_1:'12a5ec07-9bbd-4054-8d20-1f7605c470f3',
                id_2:'79d44c14-703a-4fc1-8853-96002fdc5648'
            },
            {
                name_1:'Кінцеве пакетне обладнання',
                name_2:'xDSL-модеми',
                id_1:'8bffc6c9-294c-4c9d-bc52-2212f694f31a',
                id_2:'536a1e92-3159-418e-939a-0b0c5f1f3d46'
            },
            {
                name_1:'Кабельна мережа доступу',
                name_2:'Абонентський ввід',
                id_1:'12a5ec07-9bbd-4054-8d20-1f7605c470f3',
                id_2:'58e051fd-8d95-4d96-9b0a-87b72db3f374'
            },
            {
                name_1:'Кінцеві кабельні пристрої',
                name_2:'Розподільча коробка',
                id_1:'7dccd565-1253-4fc0-a62c-d8a588ed0b83',
                id_2:'25cc0589-f90f-4c9e-86cc-cf87018b2192'
            },
            {
                name_1:'Кінцеві кабельні пристрої',
                name_2:'Розподільча шафа',
                id_1:'7dccd565-1253-4fc0-a62c-d8a588ed0b83',
                id_2:'451bbfff-57d1-44d6-8812-6ed52ada92d8'
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
                // let readableData = JSON.stringify(answer.d.results).replace(/(,")/g, ',\n"');
                // fs.writeFile('data.json', readableData , function (err) {
                //     if (err) throw err;
                //     console.log('Saved!');
                // });
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
                l(cookie);
                l(csrftoken);
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
                        ProcessListeners: 0,
                        TsiActivityStatusId: '394d4b84-58e6-df11-971b-001d60e938c6',
                        TsiActivityId:activityarr[i].Id,
                        TsiDateCreatedOn: new Date()   
                    },
                    metadata:{
                        action:'Подтверждена'
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
                            ProcessListeners: 0,
                            TsiActivityStatusId: '9dea4d63-6beb-4211-abd9-db4c90eb6496',
                            TsiActivityId:activityarr[i].Id,
                            TsiDateCreatedOn: new Date()   
                        },
                        metadata:{
                            action:'В Пути'
                        }
                    }
                }
                console.log('Acc to in time left: ' +  ((profile.intervals.aTob * 60 * 1000) - (nowDate - actDate)));
                return ('Acc to in time left: ' +  ((profile.intervals.aTob * 60 * 1000) - (nowDate - actDate)));
               
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
                            ProcessListeners: 0,
                            TsiActivityStatusId: '7fa82408-d9f1-41d6-a56d-ce3746701a46',
                            TsiActivityId:activityarr[i].Id,
                            TsiDateCreatedOn: new Date()   
                        },
                        metadata:{
                            action:'На обьекте'
                        }
                    }
                }
                return ('in to on time left: ' +  (Math.floor((profile.intervals.bToc) - ((nowDate - actDate) / 1000 / 60))));
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
                            TsiFFMWorkCategoryId:getRandomWork.id_1,
                            TsiFFMWorkCategoryL2Id:getRandomWork.id_2,
                            TsiFFMResCategoryId:getRandomRes.id_1,
                            TsiFFMResCategoryL2Id:getRandomRes.id_2

                        },
                        tsiVisit:{
                            Id:Math.random().toString(12).substring(2, 10)
                             + "-2ab0-476d-8cf1-" 
                             + Math.random().toString(12).substring(2, 14),
                            CreatedOn: new Date(),
                            ModifiedOn: new Date(),
                            ProcessListeners: 0,
                            TsiActivityStatusId: '4bdbb88f-58e6-df11-971b-001d60e938c6',
                            TsiActivityId:activityarr[i].Id,
                            TsiDateCreatedOn: new Date()   
                        },
                        metadata:{
                            cookie:profile.data.cookie,
                            csrftoken:profile.data.bpmcsrf,
                            action:'Выполнена',
                            TsiFFMWorkCategoryId:getRandomWork.name_1,
                            TsiFFMWorkCategoryL2Id:getRandomWork.name_2,
                            TsiFFMResCategoryId:getRandomRes.name_1,
                            TsiFFMResCategoryL2Id:getRandomRes.name_2
                        }
                    }
                }
                
                return ('on to close time left: ' +  (Math.floor((profile.intervals.cTod) - ((nowDate - actDate) / 1000 / 60))));  
                
            }
        }
        // return 'Nothnt to process';
        let getRandomRes = profile.tsiFfm.res[Math.floor(Math.random()*profile.tsiFfm.res.length)]
        let getRandomWork = profile.tsiFfm.work[Math.floor(Math.random()*profile.tsiFfm.work.length)]
        return {
            activity:{
                Id:'582ec0d0-b519-48a8-8961-0aba3868d2e5',
                Title:"Полёт на марс",
                TsiSymptoms:"Cho-choo!",
                TsiAddress:"Longer then my"

            },
            tsiVisit:{
                Id:Math.random().toString(12).substring(2, 10)
                 + "-2ab0-476d-8cf1-" 
                 + Math.random().toString(12).substring(2, 14),
                CreatedOn: new Date(),
                ModifiedOn: new Date(),
                ProcessListeners: 0,
                TsiActivityStatusId: '9dea4d63-6beb-4211-abd9-db4c90eb6496',
                TsiActivityId:'582ec0d0-b519-48a8-8961-0aba3868d2e5',
                TsiDateCreatedOn: new Date()   
            },
            metadata:{
                login:profile.login,
                password:profile.password,
                cookie:profile.data.cookie,
                csrftoken:profile.data.bpmcsrf,
                action:'Выполнена',
                TsiFFMWorkCategoryId:getRandomWork.name_1,
                TsiFFMWorkCategoryL2Id:getRandomWork.name_2,
                TsiFFMResCategoryId:getRandomRes.name_1,
                TsiFFMResCategoryL2Id:getRandomRes.name_2
            }
        }
        // profile.data.activity
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
                l(JSON.parse(a.data))
                let answer = JSON.parse(a.data);
                if(answer.d == undefined){
                    reject(JSON.parse(a.data).error.message.value)
                    throw '0'
                }
                resolve ('Activity changed');
            })
            .catch(a => reject(a)); 
        }) 
    }
    updateLocation(key,data){
        const profile = this.arr.find(item => item.key === key);
        let getRandomLocation = profile.gpsPattern[Math.floor(Math.random()*profile.gpsPattern.length)]
        l(getRandomLocation);
        return new Promise(function(resolve,reject){
            client.postPromise(globalSettings.url + "/0/ServiceModel/EntityDataService.svc/LocationHistoryCollection",
            {
                data: JSON.stringify({
                    Date:new Date(),
                    Id:Math.random().toString(12).substring(2, 10)
                     + "-65ff-4033-8f1b-" 
                     + Math.random().toString(12).substring(2, 14),
                    Longitude:"Lorem ipsum",
                    Latitude:"dolor sit amet"
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
        this.tsiFfm = (data.tsiFfm !== undefined ? data.tsiFfm : globalSettings.tsiFfm);
        this.data = {};
    }
    showdata(){
        return this.data
    }
}


module.exports = {
    Model,
    Profile
};

