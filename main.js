const {app, BrowserWindow} = require('electron')
const { ipcMain } = require('electron')
const path = require('path')
var fs = require('fs')
// var client = require('node-rest-client-promise').Client();

var Model = require('./model').Model;
var Profile = require('./model').Profile;

let windowReady = false;

function l(a){
    console.log('\n')
    console.log(a)
    function sendLog(){
        // mainWindow.webContents.send('log-add' , {msg:a})
        windowReady == false ? {} : mainWindow.webContents.send('log-add' , {msg:a})
    }
    sendLog()
}
l('main run')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
	  preload: path.join(__dirname, 'preload.js'),
	  nodeIntegration: true
	},
	icon:'logo.png'
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.setMenu(null);

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  console.log('window run');
  // setTimeout(dothat,5000);
  // setInterval(dothat,30000);
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})




class Controller{
	constructor (data) {
		this.data = {};
	}
	findUser(data){
		model.checkAuthData(data.login,data.password)
		.then(a => {
			// send data
			l(a)
		}).catch(a => {
			// send retry or check  correct
			l(a)
			fs.appendFile('error.json', '\n' + (new Date()).toLocaleTimeString() +  ' ' + ' ' + a , function (err) {
				if (err) throw err;
				console.log('Saved!');
		  });
		})
	}
	addUser(data){
		model.additem(data);
	}
	deleteUser(key){
		model.removeitem(key)
	}
	updateUser(key,index){
		let profile = model.getitem(key);
		return new Promise(function(resolve,reject){
			index == undefined ? index = 1 : {};
			profile.status = 'Авторизация';
			this.viewUpdateUsersData();
		  	model.login(key)
		  	.then((a) => {
				l(a)
				profile.status = 'Загрузка активностей';
				this.viewUpdateUsersData();
				return model.loadActivityData(key)
		  	})
		  	.then(a => {
				l(a)
				profile.status = 'Обновлено:  ' + (new Date().toTimeString()).substring(0,5);
				this.viewUpdateUsersData();
				resolve('Update done for: ' + key)
		  	})
		  	.catch(a => {
				l("error " + a);
				fs.appendFile('error.json', '\n' + (new Date()).toLocaleTimeString() +  ' ' + key + ' ' + a , function (err) {
					if (err) throw err;
					console.log('Saved!');
				});
				profile.status = 'Ошибка:  ' + (new Date().toTimeString()).substring(0,5);
				this.viewUpdateUsersData();
				if(index >= 3){
					reject(a)
				} else {
					resolve(this.processUser(key,++index))
				}
		  	});
		}.bind(this))
	}
	processUser(key,index){
		let data = {};
		let profile = model.getitem(key);
		return new Promise(function(resolve,reject){
		index == undefined ? index = 1 : {};
		profile.status = 'Авторизация';
		this.viewUpdateUsersData();
		model.login(key)
		.then((a) => {
				l(a)
				profile.status = 'Загрузка активностей';
				this.viewUpdateUsersData();
				return model.loadActivityData(key)
		})
		.then(a => {
				l(a)
				profile.status = 'Обновление местоположения';
				this.viewUpdateUsersData();
				return model.updateLocation(key)
		})
		.then(a => {
				l(a)
				profile.status = 'Обработка данных';
				this.viewUpdateUsersData();
				return model.processActivityData(key)
		})
		.then(a => {
			  data = a;
				l(data)
				if(a == "Nothnt"){
					resolve('Nothn\'t to process');
					profile.status = 'Обновлено:  ' + (new Date().toTimeString()).substring(0,5);
					this.viewUpdateUsersData();
					throw "olgud"	
				} else if (a == 'w8'){
					resolve('Wait fo next step');
					profile.status = 'Обновлено:  ' + (new Date().toTimeString()).substring(0,5);
					this.viewUpdateUsersData();
					throw "olgud"	
				} else {
					profile.status = 'Изменение активности';
					this.viewUpdateUsersData();
					return model.changeActivityState(data)
				}
		})
		.then(a => {
			  l(a);
			  profile.status = 'Добавление визита';
			  this.viewUpdateUsersData();
			  return model.sendTsiVisit(data)
		})
		.then((a) => {
				l(a)
				profile.status = 'Загрузка данных';
				this.viewUpdateUsersData();
				return model.loadActivityData(key)
		})
		.then(a => {
				l(a)
				resolve('All done for: ' + key)
				profile.status = 'Обновлено:  ' + (new Date().toTimeString()).substring(0,5);
				this.viewUpdateActivityes();
		})
		.catch(a => {
			  if(a == 'olgud'){
				  l('accepted olgud')
				  return
			  }
				l("error " + a);
				fs.appendFile('error.json', '\n' + (new Date()).toLocaleTimeString() +  ' ' + key + ' ' + a , function (err) {
					  if (err) throw err;
					  console.log('Saved!');
				});
				profile.status = 'Ошибка:  ' + (new Date().toTimeString()).substring(0,5);
				this.viewUpdateUsersData();
				if(index >= 3){
					  reject(a)
				} else {
					  resolve(this.processUser(key,++index))
				}
		  });
		}.bind(this))
	}
	updateAll(){
		let arr = model.getarr();
		arr.reduce((p, c) => 
		p.then(d => new Promise(resolve =>
			
			// setTimeout(function () {
			// 	console.log(c.login);
			// 	resolve();
			// }, 1000)
			this.updateUser(c.login)
			.then(a =>{
				resolve()
				l('tru loopped: ' + c.login)
				this.viewUpdateActivityes();
			})
			.catch(a => {
				resolve()
				l('no tru loopped: ' + c.login)
			})

			
		)), Promise.resolve());
	}
	processAll(){
		let arr = model.getarr();
		arr.reduce((p, c) => 
		p.then(d => new Promise(resolve =>
			
			// setTimeout(function () {
			// 	console.log(c.login);
			// 	resolve();
			// }, 1000)
			this.processUser(c.login)
			.then(a =>{
				resolve()
				l('tru loopped fo: ' + c.login)
				this.viewUpdateActivityes();
			})
			.catch(a => {
				resolve()
				l('no tru loopped: ' + c.login)
			})

			
		)), Promise.resolve());
	}
	viewUpdateUsers(){
		mainWindow.webContents.send('updateUsers' , {msg:'hello from main process'})
	}
	viewUpdateUsersData(){
		mainWindow.webContents.send('updateUsersData' , {msg:'hello from main process'})
	}
	viewUpdateActivityes(){
		mainWindow.webContents.send('updateActivityes' , {msg:'hello from main process'})	
	}
	loopStart(minutes){
		if(this.data.started == true){
			return
		}
		this.data.started = true;
		this.data.timer = setInterval(()=>{controller.processAll()},minutes * 60 * 1000)	
	}
	loopStop(){
		this.data.started = false;
		clearInterval(this.data.timer)
	}
}





const model = new Model();
const controller = new Controller();


controller.addUser({
	login:'vkomelkov',
	password:"Qwer2222",
	intervals:{
		aTob:5,
		bToc:10,
		cTod:40
	},
	gpsPattern:[
		{lat:50.7505282,long:26.0437982}
	],
    gpsSettings:{
        randomSorting:true,
        randomizePosition:true,
        currentPosition:0
    }
})
controller.addUser({
	login:'vnikolin',
	password:"Qwer2222",
	intervals:{
		aTob:5,
		bToc:10,
		cTod:40
	},
	gpsPattern:[
		{lat:48.4646372,long:37.0812746}
	],
    gpsSettings:{
        randomSorting:true,
        randomizePosition:true,
        currentPosition:0
    }
})

// controller.processUser('vnikolin').then(a=>{l(a)}).catch(a => {l('error ' + a)})
// controller.updateAll()
// controller.loopStart(2)
// setTimeout(() => {
// 	controller.viewUpdateUsers();
// 	controller.updateAll()
// }, 4000);

// controller.findUser({login:'vkomelkov',password:'Qwer2222'})
global.sharedObject = {
	someProperty: model.getarr()
}



ipcMain.on('started', (event, arg) => {
  console.log('received started')
    setTimeout(() => {
        controller.loopStart(2)
        controller.viewUpdateUsers();
        controller.updateAll()
    }, 4000);
    windowReady = true;
})
// setTimeout(() => {
// 	mainWindow.webContents.send('info' , {msg:'hello from main process'});
// }, 2000);