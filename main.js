#! /usr/bin/env node


if(!process.argv[2] || process.argv[3]){
    console.error(`
Missing argument!
Usage: twitch-chat-electron-panel <nameOfTwitchUser>
`);
    process.exit();
}

const {app, BrowserWindow} = require("electron");
const path = require("path");
if(!app){
    const {status, stdout, stderr} = require("child_process").spawnSync(path.join(__dirname, "./node_modules/.bin/electron"), [__filename].concat(process.argv.slice(2)));
    console.log(status, stdout.toString(), stderr.toString());
    process.exit();
}
app.allowRendererProcessReuse = true;

const url = "https://www.twitch.tv/popout/" + process.argv[2] + "/chat";

function createWindow () {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        frame: false,
        webPreferences: {
            preload: url
        }
    });

    mainWindow.loadURL(url);

    mainWindow.webContents.on("did-finish-load", () => mainWindow.webContents.insertCSS(`
#root .chat-input, #root .stream-chat-header {
    display: none !important;
    background: red;
}
.simplebar-content::after{
    position: absolute;
    top: 0;
    font-size: 10px;
    vertical-align: middle;
    text-align: center;
    -webkit-app-region: drag;
    content: "move \\A window";
    white-space: pre;
    line-height: 10px;
    right: 0;
}
`));
}

app.whenReady().then(createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
// On macOS it is common for applications and their menu bar
// to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") app.quit()
});

app.on("activate", function () {
// On macOS it's common to re-create a window in the app when the
// dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
});
