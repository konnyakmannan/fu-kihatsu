var app = require('app');
var path = require('path');
var BrowserWindow = require('browser-window');

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() { app.quit(); });

app.on('ready', function() {
  mainWindow = new BrowserWindow({
                    icon: path.join(__dirname, 'resouce', 'image', 'icon', 'gomaabura.png'),
                    width: 800,
                    height: 600
                  });

  mainWindow.loadUrl('file://' +　__dirname + '/index.html');

  mainWindow.on('closed', function() { mainWindow = null; });

  mainWindow.on('will-navigate', function(e, url) {
    e.preventDefault();
    openExternal(url);
  });
});
