'use strict';

var app = require('app');
var BroserWindow = require('browser-window');
var Menu = require('menu');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
  if (precess.platform !== 'darwin')
    app.quit();
});

app.on('ready', function() {
  mainWindow = new BroserWindow({ width: 800, height: 600});
  mainWindow.loadUrl('file://' +　__dirname + '/index.html');

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
});

var template = [
  {
    label: 'ReadUs',
    submenu: [
      {label: 'Quit', accelerator: 'Command+Q', click: function() { app.quit(); }}
    ]
  },
  {
    label: 'File',
    submenu: [
      {label: 'Open', accelerator: 'Command+O', click: function() {
        require('dialog').showOpenDialog({properties: ['openDirectory']},
                            function(baseDir) {
                              if (baseDir && baseDir[0]) {
                                openWindow(baseDir[0]);
                              }
                            });
      }}
    ]
  },
  {
    label: 'View',
    submenu: [
      {label: 'Reload', accelerator: 'Command+R', click: function() {
        BroserWindow.getFocusedWindow().reloadIgnoringCache();
      }},
      {label: 'Toggle DevTools', accelerator: 'Alt+Command+I', click: function() {
        BroserWindow.getFocusedWindow.toggleDevTools();
      }}
    ]
  }
];

var menu = Menu.buildFromTemplate(template);
