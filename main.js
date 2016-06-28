'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var configuration = require('./configuration');
var globalShortcut = require('global-shortcut');

//Declared null b/c the window would otherwise be closed
//once JavaScript garbage collection kicks in.
var mainWindow = null;

//Starts up the app
app.on('ready', function() {
    mainWindow = new BrowserWindow({
    	frame: false,
        height: 450,
        resizable: false,
        width: 368
    });

    mainWindow.loadUrl('file://' + __dirname + '/app/index.html');

    if (!configuration.readSettings('shortcutKeys')) {
         configuration.saveSettings('shortcutKeys', ['ctrl', 'shift']);
    }

    setGlobalShortcuts();
});

ipc.on('close-main-window', function(){
	app.quit();
});

var settingsWindow = null;

ipc.on('open-settings-window', function () {
    if (settingsWindow) {
        return;
    }

    settingsWindow = new BrowserWindow({
        frame: false,
        height: 200,
        resizable: false,
        width: 200
    });

    settingsWindow.loadUrl('file://' + __dirname + '/app/settings.html');

    settingsWindow.on('closed', function () {
        settingsWindow = null;
    });
});


ipc.on('close-settings-window', function () {
    if (settingsWindow) {
        settingsWindow.close();
    }
});

ipc.on('set-global-shortcuts', function () {
    setGlobalShortcuts();
});

function setGlobalShortcuts() {
    globalShortcut.unregisterAll();

    var shortcutKeysSetting = configuration.readSettings('shortcutKeys');
    var shortcutPrefix = shortcutKeysSetting.length === 0 ? '' : shortcutKeysSetting.join('+') + '+';

    globalShortcut.register(shortcutPrefix + '1', function () {
        mainWindow.webContents.send('global-shortcut', 0);
    });
    globalShortcut.register(shortcutPrefix + '2', function () {
        mainWindow.webContents.send('global-shortcut', 1);
    });
    globalShortcut.register(shortcutPrefix + '3', function () {
        mainWindow.webContents.send('global-shortcut', 2);
    });
    globalShortcut.register(shortcutPrefix + '4', function () {
        mainWindow.webContents.send('global-shortcut', 3);
    });
}

