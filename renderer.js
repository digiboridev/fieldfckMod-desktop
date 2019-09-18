// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
'use strict';
function l(a){
    console.log("\nRenderer:")
    console.log(a)
    console.log("\n")
}

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
//

var el = require('electron')
const { ipcRenderer } = require('electron');


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
        addListToProfiles();
        return usersCollection

    }
    updateUsersData(){
        this.data.forEach(element => {
            document.querySelectorAll(`[login=${element.login}] > .card-info > p`)[0].innerHTML = element.nowOn;
            document.querySelectorAll(`[login=${element.login}] > .card-info > p`)[1].innerHTML = element.status;
            console.log(element.data.activity)
        });
    }
    updateActivityes(){
        console.log('asd')
        this.data.forEach(profile => {
            let activity = ''
            profile.data.activity.forEach(act => {
                activity += `
                    <div class="event-card">
                        <p class="event-name">${act.Title}</p>
                        <p class="event-status">В пути</p>
                        <p class="event-created">2019-09-16T14:35:10.407Z</p>
                        <p class="event-modifyed">2019-09-16T14:50:19.407Z</p>
                        <p class="event-simptoms">не раб.тлф</p>
                        <p class="event-adress">Донецька область; Добропілля; ул.Первомайская, 125-79.</p>
                        <p class="event-info">Описание:"Причина: не раб.тлф\nТЗ: 27390"</p>
                        <p class="event-categorys">Сигнальний контроллер SPS</p>
                        <p class="event-categorys">Діагностика</p>
                    </div>
                `
            });
            document.querySelector(`.event-cards[login=${profile.login}]`).innerHTML = activity;
        });
    }
}


ipcRenderer.on('info' , function(event , data){
    console.log(data.msg);
    console.log(view.showOne());
});

ipcRenderer.on('updateUsers' , function(event , data){
    view.updateUsers();
});

ipcRenderer.on('updateUsersData' , function(event , data){
    view.updateUsersData();
});

ipcRenderer.on('updateActivityes' , function(event , data){
    view.updateActivityes();
});

const view = new View(el.remote.getGlobal('sharedObject').someProperty);

