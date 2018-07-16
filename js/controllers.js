angular.module('app.controllers', [])


.controller ('TabCtrl' ,function($scope, $ionicHistory) {
  // $scope.myGoBack = function() {
    // $ionicHistory.goBack();
  // };
  
  
    // $scope.clearHistory = function() {
      // $ionicHistory.clearHistory();
   // };
   
   
})


.controller('registerCtrl', function($scope , $state , sharedConn   ) { 
	
	$scope.goToLogin=function(){
		$state.go('login', {}, {location: "replace", reload: true});
	}
	$scope.reg=function(r){
		sharedConn.register(r.jid,r.pass,r.name);
	}
	//Comment
	$scope.insert=function(r){
		$scope.register.jid="T " + $scope.register.jid ;
	}
	
	
})

.controller('settingsCtrl', function($scope,$state,$cordovaSQLite,$ionicPopup,sharedConn,$rootScope,Chats, $timeout,ionicMaterialMotion, ionicMaterialInk) {
	
	$scope.sppversion = $rootScope.version;
	$scope.userimage ='';
	sharedConn.connection.vcard.get(function(stanza) {
            var $vCard = $(stanza).find("vCard");
            var img = $vCard.find('BINVAL').text();
            var type = $vCard.find('TYPE').text();
           $scope.userimage  = img;
	
        },
                         sharedConn.getConnectObj().authzid );
						 
	  // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
$scope.getimg =  function() {
   
sharedConn.connection.vcard.get(function(stanza) {
            var $vCard = $(stanza).find("vCard");
            var img = $vCard.find('BINVAL').text();
            var type = $vCard.find('TYPE').text();
           $scope.userimage  = img;
	
        },
                         sharedConn.getConnectObj().authzid );
						 
						 
						
} ;

   $scope.init =  function() {
   

						 
						 
						
} ;
	
	
	$scope.DeleteDB = function()
	{
		
		var confirmPopup = $ionicPopup.confirm({
				 title: 'Warning!',
				 template: ' you are about to delete all you history'
			});
			
		   confirmPopup.then(function(res) {
			 if(res) {
			   	console.log("Delete DataBase");
		$cordovaSQLite.execute($rootScope.db,"DROP TABLE chats");
		$cordovaSQLite.execute($rootScope.db,"DROP TABLE contacts");
		sharedConn.logout();
		$state.go('login', {}, {location: "replace", reload: true});
			 } else {
			 	console.log("Delete DataBase Canceled");
			 }
		   });
		   
		   
	
	}
	
	
	
	$scope.ListRooms = function(){
		
		Chats.listRooms();
		
		
	}
	
	$scope.DeleteDBContact = function()
	{
		
		var confirmPopup = $ionicPopup.confirm({
				 title: 'Warning!',
				 template: ' you are about to delete all you contacts'
			});
			
		   confirmPopup.then(function(res) {
			 if(res) {
			   	console.log("Delete DataBase");
		
		$cordovaSQLite.execute($rootScope.db,"DROP TABLE contacts");
		
			 } else {
			 	console.log("Delete DataBase Canceled");
			 }
		   });
		   
		   
	
	}
	
	
	
	$scope.logout=function(){
		console.log("T");
		sharedConn.logout();
		$state.go('login', {}, {location: "replace", reload: true});
	};
})



.controller('searchCtrl', function($scope,$state,$cordovaSQLite,$ionicPopup,sharedConn,$rootScope,Chats, $timeout,ionicMaterialMotion, ionicMaterialInk) {
	
	$scope.sppversion = $rootScope.version;
	$scope.userimage ='';
	sharedConn.connection.vcard.get(function(stanza) {
            var $vCard = $(stanza).find("vCard");
            var img = $vCard.find('BINVAL').text();
            var type = $vCard.find('TYPE').text();
           $scope.userimage  = img;
	
        },
                         sharedConn.getConnectObj().authzid );
						 
	  // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
$scope.getimg =  function() {
   
sharedConn.connection.vcard.get(function(stanza) {
            var $vCard = $(stanza).find("vCard");
            var img = $vCard.find('BINVAL').text();
            var type = $vCard.find('TYPE').text();
           $scope.userimage  = img;
	
        },
                         sharedConn.getConnectObj().authzid );
						 
						 
						
} ;


 // $scope.add = function(add_jid){
		
		
    // $scope.friendsList =	sharedConn.search(add_jid);
		
	  // };
	  
	  
	  
	  $scope.add = function(add_jid) {
   var xxxxxx =   $scope.getAllFriends(add_jid);
        

}

$scope.getAllFriends = function(name) {
      	sharedConn.search(name).
		then(function(res){
			 $scope.friendsList =res;
		}).
		catch(function(err){
		console.log(err);
		  });
            

}


	  

   $scope.init =  function() {
   

						 
						 
						
} ;
	
	
	$scope.DeleteDB = function()
	{
		
		var confirmPopup = $ionicPopup.confirm({
				 title: 'Warning!',
				 template: ' you are about to delete all you history'
			});
			
		   confirmPopup.then(function(res) {
			 if(res) {
			   	console.log("Delete DataBase");
		$cordovaSQLite.execute($rootScope.db,"DROP TABLE chats");
		$cordovaSQLite.execute($rootScope.db,"DROP TABLE contacts");
		sharedConn.logout();
		$state.go('login', {}, {location: "replace", reload: true});
			 } else {
			 	console.log("Delete DataBase Canceled");
			 }
		   });
		   
		   
	
	}
	
	
	
	$scope.ListRooms = function(){
		
		Chats.listRooms();
		
		
	}
	
	$scope.DeleteDBContact = function()
	{
		
		var confirmPopup = $ionicPopup.confirm({
				 title: 'Warning!',
				 template: ' you are about to delete all you contacts'
			});
			
		   confirmPopup.then(function(res) {
			 if(res) {
			   	console.log("Delete DataBase");
		
		$cordovaSQLite.execute($rootScope.db,"DROP TABLE contacts");
		
			 } else {
			 	console.log("Delete DataBase Canceled");
			 }
		   });
		   
		   
	
	}
	
	
	
	$scope.logout=function(){
			sharedConn.GetSearch();
	};
})





.controller('UserProfileCtrl', function($scope,$state,$cordovaSQLite,$ionicPopup,sharedConn,$rootScope,Chats,UserProfile,sqlContact,$timeout, $stateParams,ionicMaterialMotion, ionicMaterialInk) {
	var jid = UserProfile.getTo();
var init = function () {
//  $scope.contact = sqlContact.loadContacts(jid);

 $scope.contact = Chats.loadcontactfromserver(jid);

};
// and fire it after definition
init();
	  // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
  $scope.to_id =  UserProfile.getTo();
 $scope.userimage =UserProfile.getimage();
 
 
  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
})


.controller('GroupProfileCtrl', function($scope,$state,$cordovaSQLite,$ionicPopup,sharedConn,$rootScope,GroupProfile,sqlContact,$timeout, $stateParams,ionicMaterialMotion, ionicMaterialInk) {
	 var jid = GroupProfile.getTo();
	console.log(jid);
sharedConn.GetRoomOcc(jid);
	  // Set Motion
    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    // Set Ink
    ionicMaterialInk.displayEffect();
	
//$scope.contact = sqlContact.loadContacts(jid);

 $scope.to_id =  GroupProfile.getTo();
$scope.userimage =GroupProfile.getimage();

})


.controller('contactsCtrl', function($scope,Chats,$state,ChatDetails,sqlContact) {
 
	// var contacts   = 	Chats.allRoster();
	 $scope.chats = Chats.allRoster();
	 // $scope.chats =   sqlContact.loadAllContacts();
	   // $scope.showface = function(jid){
		   
		  // var face = sqlContact.loadContacts(jid).photo ;
		  // return face
	   // }
	  $scope.remove = function(chat) {
		Chats.removeRoster(chat);
	  };
	
	  $scope.chatD=function(to_id){ 
		ChatDetails.setTo(to_id);
		$state.go('tabsController.chatDetails', {}, {location: "replace", reload: false});
	  };
	
	$scope.add = function(add_jid){
		Chats.addNewRosterContact(add_jid);
		
	  };
})

.controller('groupsCtrl', function($scope,Chats,$state,ChatDetails,sqlGroups,sqlGroupsConnector) {
 
	
	 
	 $scope.chats =   sqlGroupsConnector.loadAllGroups();
	   $scope.showface = function(jid){
		   
		  var face = sqlContact.loadContacts(jid).photo ;
		  return face
	   }
	  $scope.remove = function(chat) {
		Chats.removeRoster(chat);
	  };
	
	  
	  $scope.chatG=function(chat){ 
		ChatDetails.setGroupTo(chat);
		$state.go('tabsController.GroupchatDetails', {}, {location: "replace", reload: false});
	  };
	  
	  
	  $scope.add = function(add_jid){
		Chats.CreateNewRoom(add_jid);
		 $scope.chats =   sqlGroupsConnector.loadAllGroups();
		 
		
	  };
	  
	    $scope.remove = function(add_jid){
		Chats.LeaveRoom(add_jid);
		 $scope.chats =   sqlGroupsConnector.loadAllGroups();
		 
		
	  };
	  
})

.controller('chatlogsCtrl', function($scope,sql,sharedConn, ChatDetails, $state) {
	var myid= sharedConn.getBareJid( sharedConn.getConnectObj().jid );
	var init = function () {
//  $scope.contact = sqlContact.loadContacts(jid);

 //$scope.contact = Chats.loadcontactfromserver(jid);

};
// and fire it after definition
init();

/*
	var to_jid  = Strophe.getBareJidFromJid('talt@pelephone.co.il');
		var timestamp = new Date().getTime();
		var reqChannelsItems = $msg({id:timestamp, to:to_jid , type: 'chat' })
								   .c("body").t("ccc");
		sharedConn.getConnectObj().send(reqChannelsItems.tree());
	*/	
		
	$scope.chatlogs = sql.loadChats(myid);
	
	$scope.chatD=function(to_id){ 
		ChatDetails.setTo(to_id);
		$state.go('tabsController.chatDetails', {}, {location: "replace", reload: false});
	};
	
	
	 $scope.$on('$ionicView.loaded', function(){
    console.log('chatlogsCtrl Loaded');
  });

  $scope.$on('$ionicView.enter', function(){
    console.log('chatlogsCtrl Entered');
	$scope.chatlogs = sql.loadChats(myid);
  });
 
 
 	$scope.msgbroadcast =function(to,body,urgent){
		var to_jid  = Strophe.getBareJidFromJid(to);
		var timestamp = new Date().getTime();
		var reqChannelsItems = $msg({id:timestamp, to:to_jid , type: urgent })
								   .c("body").t(body);
		sharedConn.getConnectObj().send(reqChannelsItems.tree());
	};
	
	
 $scope.messageRecieve=function(msg){	
  
	
	
		var stoptypping  = msg.getElementsByTagName('body');
		if (stoptypping.length > 0 ) {
		 
			  $scope.chatlogs = sql.loadChats(myid);
		}
  }

   $scope.$on('msgRecievedBroadcast', function(event, data) {
		$scope.messageRecieve(data);
    });

 
 

	
})

.controller('loginCtrl', function($scope , sharedConn,$state,$timeout,ionicMaterialInk) {


	var XMPP_DOMAIN  = 'peletalk1-vvw.pelephone.co.il'; // Domain we are going to be connected to.
	var xmpp_user    = 'admin';     // xmpp user name
	var xmpp_pass    = 'admin';
	
	$scope.goToRegister=function(){
		$state.go('register', {}, {location: "replace", reload: true});
	}
	
	
	
	$scope.login=function(user){
		
		window.localStorage.setItem("userjid", user.jid);
		window.localStorage.setItem("userpass", user.pass);
		window.localStorage.setItem("XMPP_DOMAIN", 'peletalk1-vvw.pelephone.co.il');
		sharedConn.login(user.jid,XMPP_DOMAIN,user.pass);
	}
	
	var userjid = window.localStorage["userjid"];
	var userpass = window.localStorage["userpass"];
	
	if (userjid)
	{
		sharedConn.login(userjid,XMPP_DOMAIN,userpass);
	}

	//
})


.controller('chatDetailsCtrl', function($scope, $timeout, $ionicScrollDelegate,sharedConn,ChatDetails,UserProfile,sql,$state,$stateParams,ionicMaterialMotion, $timeout,ionicMaterialInk,$ionicHistory,sqlContact,$ionicViewSwitcher) {
 
var init = function () {
 $scope.to_id=ChatDetails.getTo(); 
 $scope.contact = sqlContact.loadContacts( $scope.to_id);

};
// and fire it after definition
init();

  $scope.myGoBack = function() {
    $ionicHistory.goBack();
  };
	
  $scope.hideTime = true;
  $scope.data = {};
  $scope.myId = sharedConn.getBareJid( sharedConn.getConnectObj().jid );
 $scope.typing = false;
  //Loading Previous Conversation
  $scope.messages = sql.showChats( $scope.myId , $scope.to_id );
    $ionicScrollDelegate.scrollBottom(false);
	
  
	  var isIOS = ionic.Platform.isIOS(); 
	
   $scope.goprofile=function(to_id){ 
		console.log(to_id);
		UserProfile.setTo(to_id);
		$ionicViewSwitcher.nextDirection("back");
		$state.go('tabsController.UserProfile', {}, {location: "replace", reload: false});
	  };

  	$scope.sendMsg=function(to,body){
		var to_jid  = Strophe.getBareJidFromJid(to);
		var timestamp = new Date().getTime();
		var reqChannelsItems = $msg({id:timestamp, to:to_jid , type: 'chat' })
								   .c("body").t(body);
		sharedConn.getConnectObj().send(reqChannelsItems.tree());
	};
  
$scope.sendFileClick=function() {
	
	  var   f = $scope.myFile,
        r = new FileReader();

    r.onloadend = function(e) {
      var data = e.target.result;
      //send your binary data via $http or $resource or do anything else with it
    }

    r.readAsBinaryString(f);
	
	
	sharedConn.sendFile(myFileInput,$scope.to_id);
	
	readAll(myFileInput, function(data) {
		console.log("handleFileSelect:");
		console.log("	>data="+data);
		console.log("	>data.len="+data.length);
	});
}
  $scope.showSendMessage = function() {
	$scope.sendMsg($scope.to_id,$scope.data.message);  
    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

	//Adding the message to UI
    $scope.messages.push({
      userId: $scope.myId,
      text: $scope.data.message,
      time: d
    });
	
	//SQL -- MSG SEND
	sql.insertChat({
		to_id: $scope.to_id,
		from_id:$scope.myId,
		message: $scope.data.message
	});	
    delete $scope.data.message;
    $ionicScrollDelegate.scrollBottom(true);
  };
  
  $scope.messageRecieve=function(msg){	
  
	//  var to = msg.getAttribute('to');
	var from = msg.getAttribute('from');
	from=sharedConn.getBareJid(from);
	var type = msg.getAttribute('type');
	var elems = msg.getElementsByTagName('body');
	var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
	if (type == "chat" && elems.length > 0 ) {
		var body = elems[0];
		var textMsg = Strophe.getText(body);
	/*	
		//SQL -- MSG RECIEVE
		sql.insertChat({
			to_id: $scope.myId,
			from_id: from,
			message: textMsg
		});
		*/
		
		if( from == $scope.to_id ){
			$scope.messages.push({
			  userId: from,
			  text: textMsg,
			  time: d
			});
			
			$ionicScrollDelegate.scrollBottom(true);
			$scope.$apply();
			//console.log($scope.messages);
			console.log('Message recieved from ' + from + ': ' + textMsg);
		}
	}
	else
	{
		var stoptypping  = msg.getElementsByTagName('paused');
		if (stoptypping.length > 0 ) {
		$scope.$apply(function() {  	$scope.typing=false;		})		
		}else {
			$scope.$apply(function() {  	$scope.typing=true;		})	
		}
	}
  }

   $scope.$on('msgRecievedBroadcast', function(event, data) {
		$scope.messageRecieve(data);
    });

  $scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(false);
    }, 300);
  };

  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };

  $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
  };
})

.controller('GroupchatDetailsCtrl', function($scope, $timeout, $cordovaToast,$ionicScrollDelegate,sharedConn,ChatDetails,GroupProfile,sql,$state,$stateParams,ionicMaterialMotion, $timeout,ionicMaterialInk,$ionicHistory, _ ,$ionicViewSwitcher) {
  $scope.myGoBack = function() {
	  $ionicViewSwitcher.nextDirection('back');
    $ionicHistory.goBack();
  };
	var init = function () {
 $scope.to_id=ChatDetails.GetGroupTo();
   var xtitle = ChatDetails.GetGroupTitle();
   if (xtitle) {
	    $scope.title =  xtitle;
   }else
   {
	      $scope.title =  ChatDetails.GetGroupTo();
   }
   };

// and fire it after definition
init();
	
  $scope.hideTime = true;
  $scope.data = {};
  $scope.myId = sharedConn.getBareJid( sharedConn.getConnectObj().jid );
 $scope.typing = false;
  //Loading Previous Conversation
  $scope.messages = sql.showRoomChats( $scope.to_id );
    $ionicScrollDelegate.scrollBottom(true);
	  var isIOS = ionic.Platform.isIOS(); 
	
   $scope.goprofile=function(to_id){ 
		console.log(to_id);
		GroupProfile.setTo(to_id);
		$state.go('tabsController.GroupProfile', {}, {location: "replace", reload: false});
	  };
	  

  	$scope.sendMsg=function(to,body){
		var to_jid  = Strophe.getBareJidFromJid(to);
		
		
		var timestamp = new Date().getTime();
		var reqChannelsItems = $msg({id:timestamp, to:to_jid , type: 'groupchat' })
								   .c("body").t(body);
		sharedConn.getConnectObj().send(reqChannelsItems.tree());
	
	};
  
  
    $scope.toLocaleDate = function(e) {
    e.timestamp = e.timestamp;
    return e;
  };
  

  $scope.showSendMessage = function() {
	  
	$scope.sendMsg($scope.to_id,$scope.data.message);  

    var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
	
	//Adding the message to UI
    $scope.messages.push({
      userId: $scope.myId,
      text: $scope.data.message,
      time: d
    });
	
	
	//SQL -- MSG SEND
	
	/*	
	sql.insertChat({
		to_id: $scope.to_id,
		from_id:$scope.myId,
		message: $scope.data.message
	});	
*/
    delete $scope.data.message;
    $ionicScrollDelegate.scrollBottom(false);

  };
  $scope.messageRecieve=function(msg){	
	//  var to = msg.getAttribute('to');
	var from = msg.getAttribute('from');
	from=sharedConn.getResourceFromJid(from);
	
	var type = msg.getAttribute('type');
	var elems = msg.getElementsByTagName('body');
  
	var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

	if (type == "groupchat" && elems.length > 0 && from != $scope.myId) {
		  
		var body = elems[0];
		body  =  Strophe.unescapeNode(body);
		var textMsg = body.innerHTML.toString();
		
	/*	
		//SQL -- MSG RECIEVE
		sql.insertChat({
			to_id: $scope.myId,
			from_id: from,
			message: textMsg
		});
		*/
		
		
			
			$scope.messages.push({
			  userId: from,
			  text: textMsg,
			  time: d
			});
			
			$ionicScrollDelegate.scrollBottom(false);
			$scope.$apply();
			
			console.log($scope.messages);
			console.log('Message recieved from ' + from + ': ' + textMsg);
		
		
	}
	
	else
	{
		var stoptypping  = msg.getElementsByTagName('paused');
													
		if (stoptypping.length > 0 ) {
		$scope.$apply(function() {  	$scope.typing=false;		})		
		}else {
			$scope.$apply(function() {  	$scope.typing=true;		})	
		}
	}
		
  }
  
  
   $scope.$on('msgRecievedBroadcast', function(event, data) {
		$scope.messageRecieve(data);
		
	 $cordovaToast
        .show("Here's a message", 'short', 'center')
        .then(function(success) {
            console.log('Success');
        }, function (error) {
            console.log('Error');
        });
    });
  $scope.inputUp = function() {
    if (isIOS) $scope.data.keyboardHeight = 216;
    $timeout(function() {
      $ionicScrollDelegate.scrollBottom(false);
    }, 300);
  };
  $scope.inputDown = function() {
    if (isIOS) $scope.data.keyboardHeight = 0;
    $ionicScrollDelegate.resize();
  };
  $scope.closeKeyboard = function() {
    // cordova.plugins.Keyboard.close();
  };
});


