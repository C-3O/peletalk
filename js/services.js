angular.module('app.services', [])

.factory('ChatDetails', ['sharedConn','$rootScope', function(sharedConn,$rootScope){
	ChatDetailsObj={};
	
	ChatDetailsObj.setTo = function(to_id){
		ChatDetailsObj.to=to_id;
	
	}
	

	ChatDetailsObj.getTo = function(){
		return ChatDetailsObj.to;
	}
	ChatDetailsObj.getName = function(){
		return ChatDetailsObj.name;
	}
	return ChatDetailsObj;	
}])




.factory('UserProfile', ['sharedConn','$rootScope', function(sharedConn,$rootScope){
	
	var onResult = function(stanza) {
    };
	
	UserProfileObj={};
	UserProfileObj.setTo = function(to_id){
		UserProfileObj.to=to_id;
		sharedConn.connection.vcard.get(function(stanza) {
			//console.log("stanza : " + stanza);
            var $vCard = $(stanza).find("vCard");
            var img = $vCard.find('BINVAL').text();
			var  orgunit = $vCard.find('ORGUNIT').text();
			var  title = $vCard.find('TITLE').text();
            var type = $vCard.find('TYPE').text();
           UserProfileObj.userimage  = img;
		   UserProfileObj.title = title;
		    UserProfileObj.orgunit = orgunit;
		
        },
                          to_id);

		
		
		
		
		
	
	}
	
UserProfileObj.getimage = function(){
		return UserProfileObj.userimage;
	}
	UserProfileObj.getTo = function(){
		return UserProfileObj.to;
	}
	UserProfileObj.getName = function(){
		return UserProfileObj.name;
	}
	return UserProfileObj;	
}])


.factory('GroupProfile', ['sharedConn','$rootScope', function(sharedConn,$rootScope){
	
	var onResult = function(stanza) {
    };
	
	GroupProfileObj={};
	GroupProfileObj.setTo = function(to_id){
		GroupProfileObj.to=to_id;
		sharedConn.connection.vcard.get(function(stanza) {
			//console.log("stanza : " + stanza);
            var $vCard = $(stanza).find("vCard");
            var img = $vCard.find('BINVAL').text();
			var  orgunit = $vCard.find('ORGUNIT').text();
			var  title = $vCard.find('TITLE').text();
            var type = $vCard.find('TYPE').text();
           GroupProfileObj.userimage  = img;
		   GroupProfileObj.title = title;
		    GroupProfileObj.orgunit = orgunit;
		
        },
                          to_id);

		
		
		
		
		
	
	}
	
GroupProfileObj.getimage = function(){
		return GroupProfileObj.userimage;
	}
	GroupProfileObj.getTo = function(){
		return GroupProfileObj.to;
	}
	GroupProfileObj.getName = function(){
		return GroupProfileObj.name;
	}
	return GroupProfileObj;	
}])



.factory('Chats', ['sharedConn','$rootScope','$state','sqlContact', function(sharedConn,$rootScope,$state,sqlContact){
	
	ChatsObj={};

	connection=sharedConn.getConnectObj();
	


connection.addHandler(onNotificationReceived, null, "message", "chat", null,  null);
function onNotificationReceived(msg)
{

    var composing = $(msg).find('composing'),
        paused = $(msg).find('paused'),
        active = $(msg).find('active'),
        jid = $(msg).attr('from');

        if (composing.length > 0)
        {
            $('.chat-feedback').css('display', 'block');
            // alert(1);
        }

        if (paused.length > 0)
        {
            $('.chat-feedback').css('display', 'none');
            // alert(2);
        }

        if (active.length > 0)
        {
            $('.chat-feedback').css('display', 'none');
            // alert(3);
        }

    return true;
} 
	ChatsObj.roster=[];

	loadRoster= function() {
		//sqlContact.EmptyContact();
			var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
				
				connection.sendIQ(iq, 
					//On recieve roster iq
					function(iq) {
						
						console.log(iq);
						
						if (!iq || iq.length == 0)
							return;
						
						//jquery load data after loading the page.This function updates data after jQuery loading
						$rootScope.$apply(function() {
							
							$(iq).find("item").each(function(){
		
						 
		sharedConn.connection.vcard.get(function(stanza) {
		//	console.log("stanza : " + stanza);
            var $vCard = $(stanza).find("vCard");
            var img = $vCard.find('BINVAL').text();
			var  orgunit = $vCard.find('ORGUNIT').text();
			var  title = $vCard.find('TITLE').text();
            var type = $vCard.find('TYPE').text();
			
			
			var zphone2 = [];
			 var xphone = $vCard.find('NUMBER').filter(function() {var str =  $(this).text(); str = str.replace(/\s/g, ''); 
			 str = str.replace("<NUMBER>",'');
			 str = str.replace("</NUMBER>",'');
			 zphone2.push(str);
			 return  str;})
			 var phone = "";
			 var phone1 = "";
			 var phone2 = "";
			for (var i = 0, len = zphone2.length; i < len; i++) {
				
				switch(i) {
    case 0:
      phone=  zphone2[i];
        break;
    case 1:
      phone1=  zphone2[i];
        break;
		 case 2:
    phone2 =    zphone2[i];
        break;
    default:
      phone =  zphone2[i];
}
				
				
};

			 
			 
			  var email = $vCard.find('USERID').text();
			    var name = $vCard.find('GIVEN').text();
         		console.log(email);
			sqlContact.insertContact({jid: email,	name:name,orgunit:orgunit,phone:phone,phone1:phone1,phone2:phone2,photo: img,title: title});	
	
	
			
		
        },
                         $(this).attr("jid"));
								
								
								
			//////////////////////////////////					
						
								
				/////////////////////////////////////////////				
								ChatsObj.roster.push({
									id: $(this).attr("jid"),
									name:  $(this).attr("name") || $(this).attr("jid"),
									lastText: 'Available to Chat',
									face: ''
								});
				
							});						
						
						});	
							
					});
					// set up presence handler and send initial presence
					connection.addHandler(
						//on recieve precence iq
						function (presence){
							console.log	(presence);						
						   var presence_type = $(presence).attr('type'); // unavailable, subscribed, etc...
						   var from = $(presence).attr('from'); // the jabber_id of the contact
						   if (presence_type != 'error'){
							 if (presence_type === 'unavailable'){
								console.log("offline"); //alert('offline');
							 }else{
							   var show = $(presence).find("show").text(); // this is what gives away, dnd, etc.
							   if (show === 'chat' || show === ''){
								 console.log("online"); //alert('online');
							   }else{
								 console.log("etc");//alert('etc');
							   }
							 }
						   }
						  
						   return true;
						}
					, null, "presence");
					
					connection.send($pres());		
			
					connection.addHandler(
						//on recieve update roster iq
						function(iq) {
							
							console.log(iq);
							
							if (!iq || iq.length == 0)
								return;
							
							//jquery load data after loading the page.This function updates data after jQuery loading
							$rootScope.$apply(function() {
								
								$(iq).find("item").each(function(){
									
									//roster update via Client 1(ie this client) accepting request
									if($(this).attr("subscription")=="from"){
										
										ChatsObj.roster.push({
											id: $(this).attr("jid"),
											name:  $(this).attr("name") || $(this).attr("jid"),
											lastText: 'Available to Chat',
											face: 'img/ben.png'
										});
									}
									// Waiting for the Client 2 to accept the request
									else if ( $(this).attr("subscription")=="none"  && $(this).attr("ask")=="subscribe" ){
										
										ChatsObj.roster.push({
											id: $(this).attr("jid"),
											name:  $(this).attr("name") || $(this).attr("jid"),
											lastText: 'Waiting to Accept',
											face: 'img/ben.png'
										});
										
										
									}

									//roster update via Client 2 deleting the roster contact
									else if($(this).attr("subscription")=="none"){ 
										console.log( $(this).attr("jid")  );
										ChatsObj.removeRoster( ChatsObj.getRoster( $(this).attr("jid") ) );
									}
									
								});
								$state.go('tabsController.chatlogs', {}, {location: "replace", reload: true});
							
							});	
								
						}

					,"jabber:iq:roster", "iq", "set");
									
		
					return ChatsObj.roster;
					
	}	
				
 

	ChatsObj.allRoster= function() {
		loadRoster();
		return ChatsObj.roster;
	}
 
 

	ChatsObj.removeRoster= function(chat) {
		ChatsObj.roster.splice(ChatsObj.roster.indexOf(chat), 1);
	}

	ChatsObj.getRoster= function(chatId) {
		for (var i = 0; i < ChatsObj.roster.length; i++) {
			if (ChatsObj.roster[i].id == chatId) {
			  return ChatsObj.roster[i];
			}
		  }
	}
	
	
	ChatsObj.addNewRosterContact=function(to_id){
		console.log(to_id);
		connection.send($pres({ to: to_id , type: "subscribe" }));		
	}
		
	
	return ChatsObj;
  

}])


.factory('sharedConn', ['$ionicPopup','$state','$rootScope','sql','sqlGroups',function($ionicPopup, $state, $rootScope, sql,sqlGroups ){
	
	 var SharedConnObj={};
/* 	Strophe.log = function (lvl, msg) { 
	console.log("lvl: " + lvl);
	console.log("LOG: " + msg);


	};
 */
	 // SharedConnObj.BOSH_SERVICE = 'http://peletalk1-vvw.pelephone.co.il:7070/http-bind/';  
	 SharedConnObj.BOSH_SERVICE = 'http://msso.pelephone.co.il/http-bind/';  
	 SharedConnObj.connection   = null;    // The main Strophe connection object.
	 SharedConnObj.loggedIn=false;
	 

	 //------------------------------------------HELPER FUNCTIONS---------------------------------------------------------------
	 SharedConnObj.getConnectObj=function(){
			return SharedConnObj.connection; 
	 };
	  
	 SharedConnObj.isLoggedIn=function(){
			return SharedConnObj.loggedIn; 
	 };
	 
	 SharedConnObj.getBareJid=function(s){	
		var str=s.substring(0, s.indexOf('/'));
        return str;
     };
		 
	
 SharedConnObj.getResourceFromJid=function(s){	
		var str=Strophe.getResourceFromJid(s);
        return str;
     };
	
		 
	SharedConnObj.GetRoomOcc = function(roomid){
	SharedConnObj.connection.muc.queryOccupants(roomid,
	
	function(d){
		console.log(d);
	}
	,null);
	};	
		 
	SharedConnObj.JoinRoom = function(roomid){
	SharedConnObj.connection.muc.join( roomid,SharedConnObj.getConnectObj().authzid);
	};	
		 	 
	 
	 //--------------------------------------***END HELPER FUNCTIONS***----------------------------------------------------------
	 	
	//Login Function
	SharedConnObj.login=function (jid,host,pass) {	 
	
		SharedConnObj.connection = new Strophe.Connection( SharedConnObj.BOSH_SERVICE , {'keepalive': true});  // We initialize the Strophe connection.
		SharedConnObj.connection.connect(jid+'@'+host, pass , SharedConnObj.onConnect);
		
		SharedConnObj .connection.xmlOutput = function (data) { 
		
		console.log("OUTXML:"); 
		console.log( data); 
		
		
		};
		SharedConnObj .connection.rawInput = function (data) { console.log(" IN: " + data); };
		SharedConnObj .connection.rawOuput = function (data) { console.log("OUT: " + data); };
		
		
		
		
		
		
	};
	
	//On connect XMPP
	SharedConnObj.onConnect=function(status){
		if (status === Strophe.Status.CONNECTING) {
			console.log('Strophe is connecting.');
		
} else if (status === Strophe.Status.AUTHENTICATING) {
            console.log ('status AUTHENTICATING');
        } else if (status === Strophe.Status.AUTHFAIL) {
            console.log ('status AUTHFAIL');
        } else if (status === Strophe.Status.ATTACHED){
            console.log ('status ATTACHED');


}
		else if (status === Strophe.Status.CONNFAIL) {
			console.log('Strophe failed to connect.');
		} else if (status === Strophe.Status.DISCONNECTING) {
			console.log('Strophe is disconnecting.');
		} else if (status === Strophe.Status.DISCONNECTED) {
			console.log('Strophe is disconnected.');
		} else if (status === Strophe.Status.CONNECTED) {	
				console.log("Strophe.Status.CONNECTED");		
			
				SharedConnObj.loggedIn=true;
			SharedConnObj.connection.send($pres());	
	
	
					SharedConnObj.connection.addHandler(SharedConnObj.onMessage, null, 'message', null, null ,null);
				SharedConnObj.connection.addHandler(SharedConnObj.onInvite, 'jabber:x:conference');
				SharedConnObj.connection.addHandler(SharedConnObj.on_subscription_request, null, "presence", "subscribe");
				if(window.plugins !== undefined) {


			 window.plugins.OneSignal.sendTag("User", SharedConnObj.getConnectObj().authzid);

			};

				$state.go('tabsController.chatlogs', {}, {location: "replace", reload: true});
		}
	};

	
	
	//When a new invaite is recieved
	SharedConnObj.onInvite=function(msg){
		
		console.log("onInvite ");
		console.log(msg);
		
		var confirmPopup = $ionicPopup.confirm({
				 title: 'Confirm Friend Request!',
				 template: ' ' + msg.getAttribute("from")+' wants to be your freind'
			});
			
		   confirmPopup.then(function(res) {
			 if(res) {
			   SharedConnObj.connection.send($pres({ to: msg.getAttribute("from") , type: "subscribed" }));
			   sqlGroups.insertGroup(msg.getAttribute("from"));
			   push_map( msg.getAttribute("from") ); //helper
			 } else {
			   SharedConnObj.connection.send($pres({ to: msg.getAttribute("from") , type: "unsubscribed" }));
			 }
		   });
		   
		   
		   
		
		
		SharedConnObj.connection.muc.join( msg.getAttribute("from"),SharedConnObj.getConnectObj().authzid);
		$rootScope.$broadcast('msgRecievedBroadcast', msg );
		return true;
	};
	
	
	//When a new message is recieved
	SharedConnObj.onMessage=function(msg){
		
		console.log("new msg: ");
		console.log(msg);
		
		
		/////////////////////////
		var to = msg.getAttribute('to');
		var xfrom = msg.getAttribute('from');

	to=SharedConnObj.getBareJid(to);
		xfrom=SharedConnObj.getBareJid(xfrom);
	 
	var type = msg.getAttribute('type');
	var elems = msg.getElementsByTagName('body');
  
	var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');

	if (type == "chat" && elems.length > 0 ) {
		  
		var body = elems[0];
		var textMsg = Strophe.getText(body);
		
		
		//SQL -- MSG RECIEVE
		
		sql.insertChat({
			to_id: to,
			from_id: xfrom,
			message: textMsg
		});
		
		
		
		
	} 
		
		else if (type == "groupchat" && elems.length > 0) {
    var body = elems[0];
	var textMsg = Strophe.getText(body);
	xfrom =msg.getAttribute('from');
    var room = Strophe.unescapeNode(Strophe.getNodeFromJid(xfrom));
    var nick = Strophe.getResourceFromJid(xfrom);
	sql.insertChat({
			to_id: Strophe.getBareJidFromJid(xfrom),
			from_id: Strophe.getResourceFromJid(xfrom),
			message: textMsg
		});
	
	
    console.log('GROUP CHAT: I got a message from ' + nick + ': ' + Strophe.getText(body) + ' in room: ' + room);
  }
		
		///////////////////////
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		$rootScope.$broadcast('msgRecievedBroadcast', msg );
		$rootScope.$apply();
		return true;
	};
	
	SharedConnObj.register=function (jid,pass,name) {
		//to add register function
	};
	
	SharedConnObj.logout=function () {
		console.log("reached");
		SharedConnObj.connection.options.sync = true; // Switch to using synchronous requests since this is typically called onUnload.
		SharedConnObj.connection.flush();
		SharedConnObj.connection.disconnect();
	};
	
	//Helper Function------------------------------
	var accepted_map={};  //store all the accpeted jid
	function is_element_map(jid){
		if (jid in accepted_map) {return true;} 
		else {return false;}	
	}
	function push_map(jid){
		accepted_map[jid]=true;
	}
	//--------------------------------------------
	
	
	SharedConnObj.on_subscription_request = function(stanza){
		
		console.log(stanza);
		
		if(stanza.getAttribute("type") == "subscribe" && !is_element_map(stanza.getAttribute("from")) )
		{	
			
			//the friend request is recieved from Client 2
			var confirmPopup = $ionicPopup.confirm({
				 title: 'Confirm Friend Request!',
				 template: ' ' + stanza.getAttribute("from")+' wants to be your freind'
			});
			
		   confirmPopup.then(function(res) {
			 if(res) {
			   SharedConnObj.connection.send($pres({ to: stanza.getAttribute("from") , type: "subscribed" }));
			   
			   push_map( stanza.getAttribute("from") ); //helper
			 } else {
			   SharedConnObj.connection.send($pres({ to: stanza.getAttribute("from") , type: "unsubscribed" }));
			 }
		   });
			   
			return true;
		}

	}




	
	return SharedConnObj;
}])



.factory('sql', ['$rootScope','$cordovaSQLite','sqlContact', function($rootScope,$cordovaSQLite,sqlContact){

	sqlObj={};
	sqlObj.chatlogs=[];
	
	//Load Chatlogs
	sqlObj.loadChats = function(my) {
			sqlObj.chatlogs = [];
		//Bad implementation 	
       // var query = "SELECT distinct from_id FROM chats where from_id not like ? ";
	

	   var query = "SELECT distinct from_id,max(id) as id , message,contacts.* FROM chats INNER JOIN contacts ON chats.from_id=contacts.jid where chats.from_id not like ? ";
        $cordovaSQLite.execute($rootScope.db, query,[my]).then(function(res) {
			
			
            if(res.rows.length > 0) {
				for (var i=0 ; i<res.rows.length; i=i+1) {
					var photo = res.rows.item(i).photo;
					if (photo.length ===0)
					{
						photo = "img/ben.png";
					}
					else 
					{
							photo = "data:image/png;base64," + res.rows.item(i).photo;
					}
					
					sqlObj.chatlogs.push({
						 
						id: res.rows.item(i).from_id,
						name: res.rows.item(i).name || res.rows.item(i).from_id ,
						lastText: res.rows.item(i).message,
						face:photo
					});
                }				
					
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
		});
			
		
		return sqlObj.chatlogs;
    }
	
	//Insert Chat   to_id,from_id,message,
	sqlObj.insertChat = function(r) {
		var query = "INSERT INTO chats (to_id,from_id,message) VALUES (?,?,?) ";
		$cordovaSQLite.execute( $rootScope.db, query, [r.to_id, r.from_id, r.message]).then(function(res) {
			console.log("Message Added");
		}, function (err) {
			console.log("DB Error");
		});
    }
	
	
	//Loads users previous chat
	sqlObj.showChats=function(my_id,recievers_id){
		
		sqlObj.messages=[];
	  
		var query = "SELECT * FROM chats where (to_id = ? or to_id = ?)  and (from_id = ? or from_id = ?) ";
		$cordovaSQLite.execute($rootScope.db, query,[my_id, recievers_id, my_id, recievers_id]).then(function(res) {
			if(res.rows.length > 0) {
				for (var i=0 ; i<res.rows.length; i=i+1) {
					sqlObj.messages.push({
					  userId: res.rows.item(i).from_id,
					  text: res.rows.item(i).message,
					  time: res.rows.item(i).timestamp
					});
				}				
					
			} else {
				console.log("No message found");
			}
		}, function (err) {
			console.error(err);
		});

		return sqlObj.messages;  

	}
	
	
	
	sqlObj.showRoomChats=function(roomid){
		
		sqlObj.messages=[];
	  
		var query = "SELECT * FROM chats where (to_id = ? )";
		$cordovaSQLite.execute($rootScope.db, query,[roomid]).then(function(res) {
			if(res.rows.length > 0) {
				for (var i=0 ; i<res.rows.length; i=i+1) {
					sqlObj.messages.push({
					  userId: res.rows.item(i).from_id,
					  text: res.rows.item(i).message,
					  time: res.rows.item(i).timestamp
					});
				}				
					
			} else {
				console.log("No message found");
			}
		}, function (err) {
			console.error(err);
		});

		return sqlObj.messages;  

	}
	
	
	
	return sqlObj;
	
}])


.factory('sqlContact', ['$rootScope','$cordovaSQLite', function($rootScope,$cordovaSQLite){

	sqlContactObj={};
	sqlContactObj.Contacts={};
	sqlContactObj.AllContacts=[];
	
	
	//Load Contacts
  	sqlContactObj.loadContacts = function(my) {
			sqlContactObj.Contacts = {};

			//Bad implementation 	
        var query = "SELECT jid,name,title,photo,phone,phone1,phone2,orgunit FROM contacts where jid like ? ";
		
		
		console.log(my);
        $cordovaSQLite.execute($rootScope.db,query,[my]).then(function(res) {
					
            if(res.rows.length > 0) {
				
				
				for (var i=0 ; i<res.rows.length; i=i+1) {
					
				
				 
						 sqlContactObj.Contacts.jid = res.rows.item(i).jid;
						 sqlContactObj.Contacts.name=  res.rows.item(i).name;
						 sqlContactObj.Contacts.title= res.rows.item(i).title;
						 sqlContactObj.Contacts.photo= res.rows.item(i).photo;
						 sqlContactObj.Contacts.phone=res.rows.item(i).phone;
						  sqlContactObj.Contacts.phone1=res.rows.item(i).phone1;
						   sqlContactObj.Contacts.phone2=res.rows.item(i).phone2;
						 sqlContactObj.Contacts.orgunit=res.rows.item(i).orgunit;
					
                 }				
				
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
		});
			
		console.log(sqlContactObj.Contacts);
		return sqlContactObj.Contacts;
    } 
	
	
	
		sqlContactObj.loadAllContacts = function() {
			sqlContactObj.AllContacts = [];

			//Bad implementation 	
        var query = "SELECT jid,name,title,photo,phone,phone1,phone2,orgunit FROM contacts";
		
		
		
        $cordovaSQLite.execute($rootScope.db,query).then(function(res) {
					
            if(res.rows.length > 0) {
				
				
				for (var i=0 ; i<res.rows.length; i=i+1) {
					
					var photo = res.rows.item(i).photo;
					if (photo.length ===0)
					{
						photo = "img/ben.png";
					}
					else 
					{
							photo = "data:image/png;base64," + res.rows.item(i).photo;
					}
					
				sqlContactObj.AllContacts.push({
				 
						 jid : res.rows.item(i).jid,
						 name:  res.rows.item(i).name,
						 title: res.rows.item(i).title,
						 photo: photo,
						phone:res.rows.item(i).phone,
						orgunit:res.rows.item(i).orgunit
				});
                 }				
				
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
		});
			
		console.log(sqlContactObj.AllContacts);
		return sqlContactObj.AllContacts;
    } 
	
	
	
	//Insert Chat   to_id,from_id,message,
	sqlContactObj.insertContact = function(r) {
		console.log(r);
	
		var query = "INSERT  INTO contacts (jid,name,orgunit,phone,phone1,phone2,photo,title) VALUES (?,?,?,?,?,?,?,?) ";
		$cordovaSQLite.execute( $rootScope.db, query, [r.jid, r.name, r.orgunit,r.phone,r.phone1,r.phone2,r.photo,r.title]).then(function(res) {
			console.log("Contact Added");
		}, function (err) {
			console.log("DB Error");
			console.log(err);
		});
    }
	
	sqlContactObj.EmptyContact = function() {
		
		var query = "Delete From contacts ";
		$cordovaSQLite.execute( $rootScope.db, query).then(function(res) {
			console.log("Delete all");
		}, function (err) {
			console.log("DB Error");
		});
    }
	
	
	return sqlContactObj;
	
}])






.factory('sqlGroups', ['$rootScope','$cordovaSQLite', function($rootScope,$cordovaSQLite){

	sqlGroupObj={};
	sqlGroupObj.Contacts={};
	sqlGroupObj.AllContacts=[];
	
	
	//Load Contacts
  	sqlGroupObj.loadContacts = function(my) {
			sqlGroupObj.Contacts = {};

			//Bad implementation 	
        var query = "SELECT groupjid  FROM groups where groupjid like ? ";
		
		
		console.log(my);
        $cordovaSQLite.execute($rootScope.db,query,[my]).then(function(res) {
					
            if(res.rows.length > 0) {
				
				
				for (var i=0 ; i<res.rows.length; i=i+1) {
					
				
				 
						 sqlGroupObj.group.groupjid = res.rows.item(i).groupjid;
						
					
                 }				
				
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
		});
			
		console.log(sqlContactObj.Contacts);
		return sqlContactObj.Contacts;
    } 
	
	
	
		sqlGroupObj.loadAllGroups = function() {
			sqlGroupObj.AllGroups = [];

			//Bad implementation 	
        var query = "SELECT groupjid,title  FROM groups";
		
		
		
        $cordovaSQLite.execute($rootScope.db,query).then(function(res) {
					
            if(res.rows.length > 0) {
				
				
				for (var i=0 ; i<res.rows.length; i=i+1) {
				/*	
					var photo = res.rows.item(i).photo;
					if (photo.length ===0)
					{
						photo = "img/ben.png";
					}
					else 
					{
							photo = "data:image/png;base64," + res.rows.item(i).photo;
					}
					*/
				sqlGroupObj.AllGroups.push({
				 
						 groupjid : res.rows.item(i).groupjid  ,
						
					//	name:  res.rows.item(i).name,
						 title: res.rows.item(i).title
/*						 photo: photo,
						phone:res.rows.item(i).phone,
						orgunit:res.rows.item(i).orgunit */
				});
                 }				
				
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
		});
			
		console.log(sqlGroupObj.AllGroups);
		return sqlGroupObj.AllGroups;
    } 
	
	
	
	//Insert Chat   to_id,from_id,message,
	sqlGroupObj.insertGroup = function(r) {
		console.log(r);
	
		var query = "INSERT  INTO groups (groupjid) VALUES (?) ";
		$cordovaSQLite.execute( $rootScope.db, query, [r]).then(function(res) {
			console.log("Group Added");
		}, function (err) {
			console.log("Group DB Error");
			console.log(err);
		});
    }
	
	sqlGroupObj.EmptyGroups = function() {
		
		var query = "Delete From groups ";
		$cordovaSQLite.execute( $rootScope.db, query).then(function(res) {
			console.log("Delete all");
		}, function (err) {
			console.log("DB Error");
		});
    }
	
	
	return sqlGroupObj;
	
}])





.factory('sqlGroupsConnector', ['$rootScope','$cordovaSQLite','sharedConn', function($rootScope,$cordovaSQLite,sharedConn){

	sqlGroupsConnectorObj={};

		
	//Load Contacts
  
		sqlGroupsConnectorObj.loadAllGroups = function() {
	sqlGroupsConnectorObj.AllGroups = [];

			//Bad implementation 	
        var query = "SELECT groupjid,title  FROM groups";
		
		
        $cordovaSQLite.execute($rootScope.db,query).then(function(res) {
					
            if(res.rows.length > 0) {
				
				
				for (var i=0 ; i<res.rows.length; i=i+1) {
									
					sharedConn.JoinRoom(res.rows.item(i).groupjid);
				sqlGroupsConnectorObj.AllGroups.push({
				 
						 groupjid : res.rows.item(i).groupjid  ,
						
				
						 title: res.rows.item(i).title
/*						 photo: photo,
						phone:res.rows.item(i).phone,
						orgunit:res.rows.item(i).orgunit */
				});
                 }				
				
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
		});
			
		console.log(sqlGroupsConnectorObj.AllGroups);
		return sqlGroupsConnectorObj.AllGroups;
    } 
	
	
	
	
	
	
	return sqlGroupsConnectorObj;
	
}])






.service('BlankService', [function(){

}]);

