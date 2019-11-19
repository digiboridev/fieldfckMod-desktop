// // This file is required by the index.html file and will
// // be executed in the renderer process for that window.
// // All of the Node.js APIs are available in this process.
// 'use strict';
// function l(a){
//     console.log("\nRenderer:")
//     console.log(a)
//     console.log("\n")
// }


// var el = require('electron')
// const { ipcRenderer } = require('electron');
// var fs = require('fs')
// const path = require('path')

// const activityStatusCollection = JSON.parse(fs.readFileSync(path.join(__dirname, 'ActivityStatusCollection.json'))).results;
// const tsiResCategory = JSON.parse(fs.readFileSync(path.join(__dirname, 'TsiResourceTypeTTCollection.json')));
// const tsiTaskCategory = JSON.parse(fs.readFileSync(path.join(__dirname, 'TsiTaskCategoryCollection.json')));


// l("run");

// // Page workers

// function addListToProfiles(){
//     var btns = document.querySelectorAll('.card');
//     for (var i = 0; i < btns.length; i++) {
//       btns[i].addEventListener("click", function() {
//       var current = document.querySelectorAll('.card.active');
//       current[0] == undefined ? {} : current[0].className = current[0].className.replace(" active", "");
//       this.className += " active";

//       var current = document.querySelectorAll('.event-cards.active');
//       current[0] == undefined ? {} : current[0].className = current[0].className.replace(" active", "");
//       document.querySelector(`.event-cards[login=${this.attributes[1].value}]`).className += " active";
//       });
//     }
//     document.querySelector('.add-card').addEventListener("click", function() {   
//         document.querySelector('.popup').className += " active";

//     })
// }

// addListToProfiles()

// function addListToPoppup(){
//     document.querySelector('.popup_close').addEventListener("click",() => {
//         document.querySelector('.popup').className = "popup";
//         document.querySelector('.popup_add').disabled = true; 
//         document.querySelector('.popup [type=text]').value = "";
//         document.querySelector('.popup [type=password]').value ="";
//         document.querySelector('.form-status').innerHTML = "";
//     })

//     document.querySelector('.popup_add').addEventListener("click", () => {
//         add();
//         document.querySelector('.popup_add').disabled = true; 
//         document.querySelector('.popup [type=text]').value = "";
//         document.querySelector('.popup [type=password]').value ="";
//         document.querySelector('.form-status').innerHTML = "";
//     })

//     let answerData = {};

//     function add(){
//         el.remote.getGlobal('sharedObject').addUser({
//             login:answerData.login,
//             password:answerData.password
//         })
//         view.updateUsers()
//         view.updateActivityes()
//     }

//     document.querySelector('.popup_find').addEventListener("click",() => {
//         let login = document.querySelector('.popup [type=text]').value;
//         let password = document.querySelector('.popup [type=password]').value;
//         l(login + password)
//         document.querySelector('.form-status').className += " loading";
//         document.querySelector('.form-status').innerHTML = "Загрузка";
//         el.remote.getGlobal('sharedObject').modelFinder(login,password)
//         .then((a) => {
//             console.log(a)
//             answerData = a;
//             document.querySelector('.form-status').className = "form-status";
//             document.querySelector('.form-status').innerHTML = a.name
//             document.querySelector('.popup_add').disabled = false;            
//         })
//         .catch((a) => {
//             console.log(a)
//             document.querySelector('.form-status').className = "form-status";
//             document.querySelector('.form-status').innerHTML = a;
//             document.querySelector('.popup_add').disabled = true
//         })
//     })
// }

// addListToPoppup()

// function addActionstoP(){
//     document.querySelectorAll('.close').forEach(function (e){
//         e.addEventListener("click", function(ev) {
//             let key = ev.path[1].attributes[1].value;
//             l(key)
//             el.remote.getGlobal('sharedObject').removeUser(key)
//             view.updateUsers()
//         });
//     })
// }
// addActionstoP()


// let loopStatus = false;

// document.querySelector('.start-button').addEventListener("click", function() {
//     if (loopStatus) {
//         l('already started')
//     } else {
//         loopStatus = true;       
//         ipcRenderer.send('loop-start' , {});
//         document.querySelector('.start-button').className += " active";
//         document.querySelector('.stop-button').disabled = false;
//     }
// })
// document.querySelector('.stop-button').addEventListener("click", function() {
//     loopStatus = false;       
//     ipcRenderer.send('loop-stop' , {});
//     document.querySelector('.start-button').className = document.querySelector('.start-button').className.replace(" active", "");
//     document.querySelector('.stop-button').disabled = true;
// })
// document.querySelector('.process-button').addEventListener("click", function() {   
//     ipcRenderer.send('processNow' , {});
// })
// document.querySelector('.update-button').addEventListener("click", function() {   
//     ipcRenderer.send('updateNow' , {});
// })


// //


// class View {
//     constructor () {
//         this.data = el.remote.getGlobal('sharedObject').modelArray;

//     }
//     showAll(){
//         return this.data;
//     }
//     showOne(){
//         return this.data[0];
//     }
//     updateUsers(){
//         this.data = el.remote.getGlobal('sharedObject').modelArray;
//         let usersCollection = '';
//         let eventCardsUsers = '';
//         this.data.forEach(element => {
//             usersCollection += `
//                 <li class="card" login="${element.login}">
//                     <h3 class="card-header">${element.login}</h3>
//                     <div class="card-info">
//                         <p>${element.nowOn}</p>

//                         <p>${element.status}</p>
//                     </div>
//                     <div class="close"></div>
//                     <div class="info"></div>
//                 </li>
//             `
//             eventCardsUsers += `
//                 <div class="event-cards" login="${element.login}"></div>
//             `
//         });
//         usersCollection += `
//             <li class="add-card">
//                 <div class="add"></div>
//             </li>
//         `
//         document.querySelector('.profiles > ul').innerHTML = usersCollection;
//         document.querySelector('.data-container').innerHTML = eventCardsUsers;
//         setTimeout(() => {
//             document.querySelector('.card').click();
//         }, 2000);
//         addListToProfiles();
//         addActionstoP();
//         return usersCollection

//     }
//     updateUsersData(){
//         this.data.forEach(element => {
//             document.querySelectorAll(`[login=${element.login}] > .card-info > p`)[0].innerHTML = element.nowOn;
//             document.querySelectorAll(`[login=${element.login}] > .card-info > p`)[1].innerHTML = element.status;
//         });
//     }
//     updateActivityes(){

//         for (var i = this.data.length - 1; i >= 0; i--) {
//             let activity = '';
//             let profile = this.data[i];
//             if (profile.data.activity[0] == null) {
//                 continue
//             }

//             for (var iAct = 0; iAct <= profile.data.activity.length - 1; iAct++) {
//                 let act = profile.data.activity[iAct];

//                 let statusId = '';
//                 for (var iSt = activityStatusCollection.length - 1; iSt >= 0; iSt--) {
//                     if (activityStatusCollection[iSt].Id == act.StatusId) {
//                         statusId = activityStatusCollection[iSt].Name
//                     }
//                 }

//                 let tsiResCategoryId = '';

//                 for (var iRes = tsiResCategory.length - 1; iRes >= 0; iRes--) {
//                     if (tsiResCategory[iRes].Id == act.TsiResCategoryId) {
//                         tsiResCategoryId = tsiResCategory[iRes].Name
//                     }
//                 }

//                 let tsiTaskCategoryId = '';
//                 for (var iTask = tsiTaskCategory.length - 1; iTask >= 0; iTask--) {
//                     if (tsiTaskCategory[iTask].Id == act.TsiTaskCategoryId) {
//                         tsiTaskCategoryId = tsiTaskCategory[iTask].Name
//                     }
//                 }

//                 let createdDate = (Number(act.CreatedOn.substring(6,19)) + (new Date().getTimezoneOffset()) * 60 * 1000);
//                 let modifiedDate = (Number(act.ModifiedOn.substring(6,19)) + (new Date().getTimezoneOffset()) * 60 * 1000);

//                 activity += `
//                     <div class="event-card ${statusId !== 'Завершена' ? 'updating' : {}}">
//                     <p class="event-name">${act.Title}</p>
//                     <p class="event-status">${statusId}</p>
//                     <p class="event-created">Создана: ${(new Date(createdDate).toString())}</p>
//                     <p class="event-modifyed">Последнее изменение: ${(new Date(modifiedDate).toTimeString()).substring(0,5)}</p>
//                     <p class="event-simptoms">${act.TsiSymptoms}</p>
//                     <p class="event-adress">${act.TsiAddress}</p>
//                     <p class="event-info">${act.TsiDescription}</p>
//                     <p class="event-categorys">${tsiResCategoryId == '' ? 'x3' : tsiResCategoryId}</p>
//                     <p class="event-categorys">${tsiTaskCategoryId == '' ? 'x3' : tsiTaskCategoryId}</p>
//                     </div>
//                     `

//             }

//             document.querySelector(`.event-cards[login=${profile.login}]`).innerHTML = activity;
//         }

//         // this.data.forEach(profile => {
//         //     let activity = '';
//         //     if (profile.data.activity[0] == null) {
//         //         return
//         //     }
//         //     profile.data.activity.forEach(act => {

//         //         // let activityStatusCollection = JSON.parse(fs.readFileSync('ActivityStatusCollection.json')).results;
//         //         let statusId = '';
//         //         activityStatusCollection.forEach(element => {
//         //             if (element.Id == act.StatusId) {
//         //                 statusId = element.Name
//         //             }
//         //         });

//         //         // let tsiResCategory = JSON.parse(fs.readFileSync('TsiResourceTypeTTCollection.json'));
//         //         let tsiResCategoryId = '';
//         //         tsiResCategory.forEach(element => {
//         //             if (element.Id == act.TsiResCategoryId) {
//         //                 tsiResCategoryId = element.Name
//         //             }
//         //         });

//         //         // let tsiTaskCategory = JSON.parse(fs.readFileSync('TsiTaskCategoryCollection.json'));
//         //         let tsiTaskCategoryId = '';
//         //         tsiTaskCategory.forEach(element => {
//         //             if (element.Id == act.TsiTaskCategoryId) {
//         //                 tsiTaskCategoryId = element.Name
//         //             }
//         //         });

//         //         let createdDate = (Number(act.CreatedOn.substring(6,19)) + (new Date().getTimezoneOffset()) * 60 * 1000);
//         //         let modifiedDate = (Number(act.ModifiedOn.substring(6,19)) + (new Date().getTimezoneOffset()) * 60 * 1000);

//         //         activity += `
//         //             <div class="event-card ${statusId !== 'Завершена' ? 'updating' : {}}">
//         //             <p class="event-name">${act.Title}</p>
//         //             <p class="event-status">${statusId}</p>
//         //             <p class="event-created">Создана: ${(new Date(createdDate).toString())}</p>
//         //             <p class="event-modifyed">Последнее изменение: ${(new Date(modifiedDate).toTimeString()).substring(0,5)}</p>
//         //             <p class="event-simptoms">${act.TsiSymptoms}</p>
//         //             <p class="event-adress">${act.TsiAddress}</p>
//         //             <p class="event-info">${act.TsiDescription}</p>
//         //             <p class="event-categorys">${tsiResCategoryId == '' ? 'x3' : tsiResCategoryId}</p>
//         //             <p class="event-categorys">${tsiTaskCategoryId == '' ? 'x3' : tsiTaskCategoryId}</p>
//         //             </div>
//         //             `
//         //         });
//         //         document.querySelector(`.event-cards[login=${profile.login}]`).innerHTML = activity;
//         //         console.log('up')

//         //     });
//         }
//     }

// const view = new View();

// ipcRenderer.on('updateUsers' , function(event , data){
//     view.updateUsers();
// });

// ipcRenderer.on('updateUsersData' , function(event , data){
//     view.updateUsersData();
//     document.querySelector('section').className = 'active';
//     setTimeout(() => {
//         document.querySelector('section').className = '';
//     }, 1000);
// });

// ipcRenderer.on('updateActivityes' , function(event , data){
//     setTimeout(() => {      
//         view.updateActivityes();
//     }, 1000);
//     // document.querySelector('section').className = 'active';
//     // // document.querySelector('section').className.replace(" active", "");
//     // setTimeout(() => {
//     //     document.querySelector('section').className = '';
//     // }, 1000);
// });

// ipcRenderer.on('log-add' , function(event , data){
//     let child = document.createElement('li');
//     child.innerHTML = (new Date().toTimeString()).substring(0,8) + ' ' + data.msg;

//     document.querySelector('aside > ul').appendChild(child)
//     document.querySelector('aside > ul').scrollTop = document.querySelector('aside > ul').scrollHeight;
//     // setTimeout(() => {
//     // }, 1000);
// });

// ipcRenderer.on('status' , function(e,data){
//     document.querySelector('.status').innerHTML = data.msg;
//     if (data.status) {
//         document.querySelector('.process-button').disabled = true;
//         document.querySelector('.update-button').disabled = true;
//         document.querySelector('.status').className += " start"
//     } else {
//         document.querySelector('.process-button').disabled = false;
//         document.querySelector('.update-button').disabled = false;
//         document.querySelector('.status').className = document.querySelector('.status').className.replace(" start", "");
//     }
// });


// ipcRenderer.send('started' , {msg:'hello from renderer'});


var el = require('electron')
const { ipcRenderer } = require('electron');
var fs = require('fs')
const path = require('path')


class AppRender extends React.Component {
    constructor(props) {
        super(props);
        this.state = { state: true, selected : ""};
        this.forceUpdate = this.forceUpdate.bind(this);
    }
    forceUpdate(){
        this.setState({ state: true });
        console.log('update')
    }
    selectHandler = (a) => {
        this.setState({selected: a})
    }
    render() {
        console.log('render')
        return (
            <layout>
                <header>
                    <div className="head-container">
                        <img src="logo.png" alt="" />
                        <div className="logo-text"></div>
                        <Control_buttons />
                    </div>
                </header>
                <main>
                    <div class="child"></div>
                    <section class="asdasd">
                        <Profiles forceUpdate={this.forceUpdate} selectHandler={this.selectHandler} selected={this.state.selected} users={el.remote.getGlobal('sharedObject').modelArray}/>
                        <div className="decor-line"></div>
                        <div className="data">
                            <Activity_data selected={this.state.selected} users={el.remote.getGlobal('sharedObject').modelArray} />
                        </div> 
                    </section>
                        <aside class="noselect">
                            <ul>

                                <li>
                                    Hi there baby
                            </li>

                            </ul>
                        </aside>
                </main>
            </layout>
                )
        }
    }
    
    
    
// setInterval(() => {
//     ReactDOM.render(<AppRender users={el.remote.getGlobal('sharedObject').modelArray} />, document.querySelector('#app'))
// }, 2000);
// setInterval(() => {
//     ReactDOM.render(<AppRender />, document.querySelector('#app'))
// }, 2000);

ReactDOM.render(<AppRender />, document.querySelector('#app'))