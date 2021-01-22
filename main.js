// Modules to control application life and create native browser window
const {app, BrowserWindow} = require('electron')
const ioHook = require('iohook')
const path = require('path')
const robot = require("robotjs")

var keyRing = []
var inMono = false

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  //mainWindow.loadFile('index.html')
  mainWindow.loadURL("https://docs.google.com/document/d/1bGekK5WCiPDyH7ylZuyrmQHqRQ0WGnqWXbKLV7V6hyU/edit")

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
  console.log("createWindow");
  return mainWindow;
}

function isDigit(n) {
  return Boolean([true, true, true, true, true, true, true, true, true, true][n]);
}

function sendKeybinding (win, keyCode) {
  let modifiers = []
  if (isDigit(keyCode)) {
    modifiers.push('alt') // 'control', 'meta', etc.
    modifiers.push('meta') // 'control', 'meta', etc.
  }
  if (keyCode == '/') {
    modifiers.push('alt')
  }
  console.log(modifiers);

  win.webContents.sendInputEvent({ type: 'keyDown', modifiers, keyCode })
  win.webContents.sendInputEvent({ type: 'char', modifiers, keyCode })
  win.webContents.sendInputEvent({ type: 'keyUp', modifiers, keyCode })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  app.userAgentFallback = "Mozilla/5.0 (Macintosh; Intel Mac OS X 11_1_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.141 Safari/537.36"

  let mainWindow = createWindow();
  ioHook.on("keyup", event => {

    console.log(event); // {keychar: 'f', keycode: 19, rawcode: 15, type: 'keup'}
    console.log(String.fromCharCode(event.keycode));
    if (event.keycode == 4 && event.shiftKey) {
      console.log("BAM");
      keyRing.push("#");
    }
    if (event.keycode == 41) {
      keyRing.push("`");
    }
    if (event.keycode == 57) /* space */ {
      if (keyRing.length > 0 && keyRing[0] === "#") {
        sendKeybinding(mainWindow, '' + keyRing.length);
        for (var i=0; i <= keyRing.length; i++) { // i + 1 times
          sendKeybinding(mainWindow, "Backspace");
        }
      } else if (keyRing.length > 2 && keyRing[0] === "`") {
        sendKeybinding(mainWindow, '6');
        for (var i=0; i <= keyRing.length; i++) { // i + 1 times
          sendKeybinding(mainWindow, "Backspace");
        }
      } else if (event.keycode == 57 && keyRing.length == 1 && keyRing[0] === "`") {
        console.log("COURIER TIME");
        sendKeybinding(mainWindow, "Backspace");
        sendKeybinding(mainWindow, "Backspace");
        if (inMono) {
          sendKeybinding(mainWindow, ' ');
          sendKeybinding(mainWindow, '/');
          sendKeybinding(mainWindow, 'a');
          sendKeybinding(mainWindow, 'r');
          sendKeybinding(mainWindow, 'i');
          sendKeybinding(mainWindow, 'a');
          sendKeybinding(mainWindow, 'l');
          setTimeout(() => {
            robot.keyTap("enter");
          }, 300);
        } else {
          sendKeybinding(mainWindow, ' ');
          sendKeybinding(mainWindow, '/');
          sendKeybinding(mainWindow, 'c');
          sendKeybinding(mainWindow, 'o');
          sendKeybinding(mainWindow, 'u');
          sendKeybinding(mainWindow, 'r');
          sendKeybinding(mainWindow, 'i');
          sendKeybinding(mainWindow, 'e');
          setTimeout(() => {
            robot.keyTap("enter");
          }, 300);
        }
        inMono = !inMono;
      }
      keyRing = []
  
    }

  })
  ioHook.start()
  
  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
