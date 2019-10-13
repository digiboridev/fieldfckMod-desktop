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

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
	//   preload: path.join(__dirname, 'preload.js'),
	  nodeIntegration: true
	},
	icon:'logo.png'
  })

  mainWindow.loadFile('index.html')

  // Open the DevTools.
//   mainWindow.webContents.openDevTools()

//   mainWindow.setMenu(null);

  mainWindow.on('closed', function () {
	app.quit()
  })

  console.log('window run');
}


app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
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
		mainWindow.webContents.send('status' , {msg:'обновление данных',status:true})
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
		mainWindow.webContents.send('status' , {msg:'обработка',status:true})
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
				mainWindow.webContents.send('status' , {msg:'обновлено: ' + (new Date().toTimeString()).substring(0,5),status:false})
			})
			.catch(a => {
				resolve()
				l('no tru loopped: ' + c.login)
				mainWindow.webContents.send('status' , {msg:'обновлено c ошибками : ' + (new Date().toTimeString()).substring(0,5),status:false})
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
				// mainWindow.webContents.send('status' , {msg:'обработано: ' + (new Date().toTimeString()).substring(0,5),status:false})
				if(this.data.started == true){
					mainWindow.webContents.send('status' , {msg:'Запущен',status:false})
				} else {
					mainWindow.webContents.send('status' , {msg:'Остановлен',status:false})
				}
			})
			.catch(a => {
				resolve()
				l('no tru loopped: ' + c.login)
				// mainWindow.webContents.send('status' , {msg:'обработано c ошибками : ' + (new Date().toTimeString()).substring(0,5),status:false})
				if(this.data.started == true){
					mainWindow.webContents.send('status' , {msg:'Запущен',status:false})
				} else {
					mainWindow.webContents.send('status' , {msg:'Остановлен',status:false})
				}
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
		mainWindow.webContents.send('status' , {msg:'Запущен'})	
	}
	loopStop(){
		this.data.started = false;
		clearInterval(this.data.timer)
		mainWindow.webContents.send('status' , {msg:'Остановлен'})
	}
}





const model = new Model();
const controller = new Controller();


// controller.addUser({
// 	login:'vkomelkov',
// 	password:"Qwer2222",
// 	intervals:{
// 		aTob:5,
// 		bToc:10,
// 		cTod:40
// 	},
// 	gpsPattern:[
// 		{lat:48.4646372,long:37.0812746}
// 	],
//     gpsSettings:{
//         randomSorting:true,
//         randomizePosition:true,
//         currentPosition:0
//     }
// })
controller.addUser({
	login:'vnikolin',
	password:"Qwer3333",
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
controller.addUser({
	login:'vvitriv',
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
controller.addUser({
	login:'smyhydiuk',
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
	modelArray: model.getarr(),
	modelFinder: model.checkAuthData,
	addUser:controller.addUser,
	removeUser:controller.deleteUser
}



ipcMain.on('started', (event, arg) => {
  console.log('received started')
    setTimeout(() => {
        // controller.loopStart(2)
        controller.viewUpdateUsers();
        controller.updateAll()
    }, 4000);
    windowReady = true;
})

ipcMain.on('loop-start', (event, arg) => {
	l('Interval add')
	controller.loopStart(3)
	setTimeout(() => {
		controller.processAll()
	}, 500);
  })
ipcMain.on('loop-stop', (event, arg) => {
	l('Interval cleared')
	controller.loopStop();
  })
ipcMain.on('processNow', (event, arg) => {
	controller.processAll()
  })
ipcMain.on('updateNow', (event, arg) => {
	controller.updateAll();
  })


// setTimeout(() => {
// 	mainWindow.webContents.send('info' , {msg:'hello from main process'});
// }, 2000);