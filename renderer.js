// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
console.log('render run');
var el = require('electron')
console.log(el.remote.getGlobal('sharedObject').someProperty)
let modelData = el.remote.getGlobal('sharedObject').someProperty;

const { ipcRenderer } = require('electron');

ipcRenderer.on('info' , function(event , data){ console.log(data.msg) });


ipcRenderer.on('update-all' , function(event , data){ 
    document.querySelector('.thes').innerText = modelData[0].data.bpmcsrf;
 });

 ipcRenderer.on('update-users' , function(event , data){ 
    document.querySelector('.thes').innerText = modelData[0].data.bpmcsrf;
    
 });


