const {app, BrowserWindow} = require('electron')
const path = require('path')
var fs = require('fs')
// var client = require('node-rest-client-promise').Client();

var Model = require('./model').Model;

function l(a){
    console.log(a)
}
l('main run')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 200,
    height: 100,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

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

const model = new Model();

model.additem({
        login:'vkomelkov',
        password:"Qwer1111",
        intervals:{
            aTob:5,
            bToc:5,
            cTod:5
        },
        gpsPattern:[
            {lat:50.750528,long:26.043798}
        ]}
)


// console.log(model.getarr());
// model.loadActivityData('vkomelkov').then(a => {
//     l(model.getitem('vkomelkov').showdata());
// }).catch(a => l("error " + a));

function processingProfile(key,index){
  	return new Promise(function(resolve,reject){
    	index == undefined ? index = 1 : {};
    	model.login(key)
    	.then((a) => {
    	  	l(a)
    	  	return model.loadActivityData(key)
    	})
    	.then(a => {
    	  	l(a)
    	  	return model.processActivityData(key)
    	})
    	.then(a => {
    	  	l(a)
    	  	if(a == "Nothnt"){
    	  	  	resolve('Nothn\'t to process');
    	  	} else if (a == 'w8'){
    	  	  	resolve('Wait fo next step');
    	  	} else {
				return model.changeActivityState(a)
    	  	}
		})
		.then(a => {
			// return model.sendTsiVisit(a)
		})
		.then(a => {
			return model.updateLocation(key)
		})
    	.then(a => {
    	  	l(a)
    	  	resolve('All done for: ' + key)
    	})
    	.catch(a => {
    	  	l("error " + a);
    	  	fs.writeFile('error.json', a , function (err) {
    	  	  	if (err) throw err;
    	  	  	console.log('Saved!');
    	  	});
    	  	if(index >= 3){
    	  	  	reject(a)
    	  	} else {
    	  	  	resolve(processingProfile(key,++index))
    	  	}
    	});
  	})
}
// processingProfile('vvitriv').then(a=>{l(a)}).catch(a => {l('error ' + a)})
processingProfile('vkomelkov').then(a=>{l(a)}).catch(a => {l('error ' + a)})

const controller = {
  
}



// function promtst(me,index){
//   return new Promise(function(rs,rj){
//       index == undefined ? index = 1 : {};
//       new Promise(function(resolve,reject){
//         setTimeout(()=>{
//           reject('time')
//         },2000)
//       })
//       .then(a => {
//         rs (a)
//       })
//       .catch(a => {
//         if(index > 3){
//           rj(a)
//         } else {
//           rs(promtst(me,++index))
//         }
//       })
      
//       console.log('iter ' + me)
//   })
// }

// promtst('kiss-kiss').then(a=>{console.log(a)}).catch(a=>{console.log('error' + a)})