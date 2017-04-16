// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modulesopenDatabase
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('app', ['ionic', 'app.controllers', 'app.routes', 'app.services', 'app.directives','ngCordova','ionic-material', 'ionMdInput'])  // <--include ngCordova

.run(function($ionicPlatform, $cordovaSQLite, $rootScope,$window) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	  if(window.plugins !== undefined) {


    window.plugins.OneSignal
      .startInit("caf57c31-8f35-4015-b530-dc20386d84c5", "951844355160")
      .handleNotificationReceived(function(jsonData) {
   alert("Notification received:\n" + JSON.stringify(jsonData));
   console.log('Did I receive a notification: ' + JSON.stringify(jsonData));
 })
 .handleNotificationOpened(function(jsonData) {
   alert("Notification opened:\n" + JSON.stringify(jsonData));
   console.log('didOpenRemoteNotificationCallBack: ' + JSON.stringify(jsonData));
 })
      .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification)
      .endInit();

  }

	//SQL lite database

	console.log (window.cordova);
if (window.cordova) {

      $rootScope.db = $cordovaSQLite.openDB({ name: "chats_local.db" ,location:'default'}); //device
    }else{
      $rootScope.db = window.openDatabase("chats_local.db", '1', 'xmpp_chat', 1024 * 1024 * 100); // browser
    }

	$cordovaSQLite.execute($rootScope.db,"CREATE TABLE IF NOT EXISTS chats(id INTEGER primary key, to_id TEXT, from_id TEXT, message TEXT, timestamp DATE DEFAULT (datetime('now','localtime')) )");
	$cordovaSQLite.execute($rootScope.db,"CREATE TABLE IF NOT EXISTS contacts(jid TEXT primary key,  name TEXT, orgunit TEXT,phone TEXT,photo TEXT,title TEXT, timestamp DATE DEFAULT (datetime('now','localtime')) )");

  });
})
