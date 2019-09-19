// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
'use strict';
function l(a){
    console.log("\nRenderer:")
    console.log(a)
    console.log("\n")
}

var el = require('electron')
const { ipcRenderer } = require('electron');
var fs = require('fs')

const activityStatusCollection = JSON.parse(fs.readFileSync('ActivityStatusCollection.json')).results;
const tsiResCategory = JSON.parse(fs.readFileSync('TsiResourceTypeTTCollection.json'));
const tsiTaskCategory = JSON.parse(fs.readFileSync('TsiTaskCategoryCollection.json'));

l("run");

// Page workers

function addListToProfiles(){
    var btns = document.querySelectorAll('.card');
    for (var i = 0; i < btns.length; i++) {
      btns[i].addEventListener("click", function() {
      var current = document.querySelectorAll('.card.active');
      current[0] == undefined ? {} : current[0].className = current[0].className.replace(" active", "");
      this.className += " active";

      var current = document.querySelectorAll('.event-cards.active');
      current[0] == undefined ? {} : current[0].className = current[0].className.replace(" active", "");
      document.querySelector(`.event-cards[login=${this.attributes[1].value}]`).className += " active";
      });
    }
}
addListToProfiles()

function addActionstoP(){
    document.querySelectorAll('.close').forEach(function (e){
        e.addEventListener("click", function(ev) {
            console.log(ev)
        });
    })
}
addActionstoP()

//


class View {
    constructor (data) {
        this.data = data;
        
    }
    showAll(){
        return this.data;
    }
    showOne(){
        return this.data[0];
    }
    updateUsers(){
        let usersCollection = '';
        let eventCardsUsers = '';
        this.data.forEach(element => {
            usersCollection += `
                <li class="card" login="${element.login}">
                    <h3 class="card-header">${element.login}</h3>
                    <div class="card-info">
                        <p>${element.nowOn}</p>
                        
                        <p>${element.status}</p>
                    </div>
                    <div class="close"></div>
                    <div class="info"></div>
                </li>
            `
            eventCardsUsers += `
                <div class="event-cards" login="${element.login}"></div>
            `
        });
        usersCollection += `
            <li class="add-card">
                <div class="add"></div>
            </li>
        `
        document.querySelector('.profiles > ul').innerHTML = usersCollection;
        document.querySelector('.data-container').innerHTML = eventCardsUsers;
        setTimeout(() => {
            document.querySelector('.card').click();
        }, 2000);
        addListToProfiles();
        addActionstoP();
        return usersCollection

    }
    updateUsersData(){
        this.data.forEach(element => {
            document.querySelectorAll(`[login=${element.login}] > .card-info > p`)[0].innerHTML = element.nowOn;
            document.querySelectorAll(`[login=${element.login}] > .card-info > p`)[1].innerHTML = element.status;
        });
    }
    updateActivityes(){
        
        this.data.forEach(profile => {
            let activity = ''
            profile.data.activity.forEach(act => {
                
                // let activityStatusCollection = JSON.parse(fs.readFileSync('ActivityStatusCollection.json')).results;
                let statusId = '';
                activityStatusCollection.forEach(element => {
                    if (element.Id == act.StatusId) {
                        statusId = element.Name
                    }
                });

                // let tsiResCategory = JSON.parse(fs.readFileSync('TsiResourceTypeTTCollection.json'));
                let tsiResCategoryId = '';
                tsiResCategory.forEach(element => {
                    if (element.Id == act.TsiResCategoryId) {
                        tsiResCategoryId = element.Name
                    }
                });

                // let tsiTaskCategory = JSON.parse(fs.readFileSync('TsiTaskCategoryCollection.json'));
                let tsiTaskCategoryId = '';
                tsiTaskCategory.forEach(element => {
                    if (element.Id == act.TsiTaskCategoryId) {
                        tsiTaskCategoryId = element.Name
                    }
                });

                let createdDate = (Number(act.CreatedOn.substring(6,19)) + (new Date().getTimezoneOffset()) * 60 * 1000);
                let modifiedDate = (Number(act.ModifiedOn.substring(6,19)) + (new Date().getTimezoneOffset()) * 60 * 1000);

                activity += `
                    <div class="event-card ${statusId !== 'Завершена' ? 'updating' : {}}">
                        <p class="event-name">${act.Title}</p>
                        <p class="event-status">${statusId}</p>
                        <p class="event-created">Создана: ${(new Date(createdDate).toString())}</p>
                        <p class="event-modifyed">Последнее изменение: ${(new Date(modifiedDate).toTimeString()).substring(0,5)}</p>
                        <p class="event-simptoms">${act.TsiSymptoms}</p>
                        <p class="event-adress">${act.TsiAddress}</p>
                        <p class="event-info">${act.TsiDescription}</p>
                        <p class="event-categorys">${tsiResCategoryId == '' ? 'x3' : tsiResCategoryId}</p>
                        <p class="event-categorys">${tsiTaskCategoryId == '' ? 'x3' : tsiTaskCategoryId}</p>
                    </div>
                `
            });
            document.querySelector(`.event-cards[login=${profile.login}]`).innerHTML = activity;
            
        });
    }
}


ipcRenderer.on('updateUsers' , function(event , data){
    view.updateUsers();
});

ipcRenderer.on('updateUsersData' , function(event , data){
    view.updateUsersData();
    document.querySelector('section').className = 'active';
    setTimeout(() => {
        document.querySelector('section').className = '';
    }, 1000);
});

ipcRenderer.on('updateActivityes' , function(event , data){
    view.updateActivityes();
    // document.querySelector('section').className = 'active';
    // // document.querySelector('section').className.replace(" active", "");
    // setTimeout(() => {
    //     document.querySelector('section').className = '';
    // }, 1000);
});

ipcRenderer.on('log-add' , function(event , data){
    let child = document.createElement('li');
    child.innerHTML = data.msg;
    
    setTimeout(() => {
        document.querySelector('aside > ul').appendChild(child)
        document.querySelector('aside > ul').scrollTop = document.querySelector('aside > ul').scrollHeight;
    }, 5000);
});

const view = new View(el.remote.getGlobal('sharedObject').someProperty);

ipcRenderer.send('started' , {msg:'hello from renderer'});

