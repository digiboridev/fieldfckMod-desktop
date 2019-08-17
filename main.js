const {app, BrowserWindow} = require('electron')
const path = require('path')

// var client = require('node-rest-client-promise').Client();

var Model = require('./model').Model;
var Profile = require('./model').Profile;

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
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  console.log('window run');
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

model.additem(
    new Profile({
        login:'vkomelkov',
        password:"Qwer1111",
        intervals:{
            aTob:20,
            bToc:30
        },
        gpsPattern:[
            {long:42.123123,lat:34.321321},
            {long:44.123123,lat:36.321321},
            {long:45.123123,lat:31.321321},
            {long:46.123123,lat:37.321321}
        ]})
)
model.additem(
    new Profile({
        login:'fghh',
        password:"123"
    })
)

// console.log(model.getarr());
// model.loadActivityData('vkomelkov').then(a => {
//     l(model.getitem('vkomelkov').showdata());
// }).catch(a => l("error " + a));
function dothat(){
  model.loadActivityData('vkomelkov')
  .then(a => {
    l(a)
    return model.processActivityData('vkomelkov')
  })
  .then((a) => {
    console.log(a)
  })
  .catch(a => l("error " + a));
}
dothat();

// setInterval(dothat,5000)

