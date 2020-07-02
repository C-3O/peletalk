angular.module('app.services', [])

.factory('ChatDetails', ['sharedConn','$rootScope', function(sharedConn,$rootScope){
	ChatDetailsObj={};
	
	ChatDetailsObj.setTo = function(to_id){
		ChatDetailsObj.to=to_id;
	
	}
	ChatDetailsObj.setGroupTo = function(to_id){
		ChatDetailsObj.to=to_id.groupjid;
		ChatDetailsObj.title = to_id.title;
	}
	
	ChatDetailsObj.GetGroupTo = function(){
		return ChatDetailsObj.to;
	}
	
	ChatDetailsObj.GetGroupTitle = function(){
		return ChatDetailsObj.title;
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
	
	/*var onResult = function(stanza) {
    };*/
	
	GroupProfileObj={};
	GroupProfileObj.setTo = function(to_id){
		GroupProfileObj.to=to_id;
	
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



.factory('Chats', ['sharedConn','$rootScope','$state','sqlContact','sqlGroups', function(sharedConn,$rootScope,$state,sqlContact,sqlGroups){
	
	ChatsObj={};
ChatsObj.Contact=[];

	connection=sharedConn.getConnectObj();
	connection.muc.init(connection);


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
	  var email = $(this).attr("jid").text();
      var name = $vCard.find('GIVEN').text();
      console.log($(this).attr("jid"));
	  sqlContact.insertContact({jid: email,	name:name,orgunit:orgunit,phone:phone,phone1:phone1,phone2:phone2,photo: img,title: title});	
	  },
      $(this).attr("jid"));
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
 
 
 //load from server
	ChatsObj.loadcontactfromserver = function(jid)
	{
		
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
	   ChatsObj.Contact.jid = jid;
						 ChatsObj.Contact.name=   $vCard.find('FN').text();
						 ChatsObj.Contact.title=  title;
						 ChatsObj.Contact.photo= img;
						ChatsObj.Contact.phone=phone;
						 ChatsObj.Contact.phone1= phone1;
						  ChatsObj.Contact.phone2= phone2;
						ChatsObj.Contact.orgunit= orgunit;				 
				}
				
		},jid)		 
			return ChatsObj.Contact;			 
	  
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
	
function room_msg_handler(a, b, c) {
  console.log('MUC: room_msg_handler');
  return true;
}

function room_pres_handler(a, b, c) {
  console.log('MUC: room_pres_handler');
  return true;
}

function onCreateRoomSuccess(stanza) {
	console.log('MUC: onCreateRoomSuccess: '+stanza);
	return true;
}

function onCreateRoomError(stanza) {
	console.log('MUC: onCreateRoomError: '+stanza);
	return true;
}

function exitRoom(room) {
  console.log("exitRoom: " + room);
  //TBD
}

	ChatsObj.listRooms =function () {
		var server = "conference.peletalk1-vvw.pelephone.co.il";
  console.log("listRooms: " + server);
  connection.muc.listRooms(server, function(msg) {
    console.log("listRooms - success: ");
    $(msg).find('item').each(function() {
      var jid = $(this).attr('jid'),
        name = $(this).attr('name');
      console.log('	>room: ' + name + ' (' + jid + ')');
    });
  }, function(err) {
    console.log("listRooms - error: " + err);
  });
}


	ChatsObj.CreateNewRoom =function(to_id){
		// console.log(to_id);
		// connection.muc.init(connection);
		
		var descr = "testroom";
		var subject = "testroom";
		 var roomName = to_id + "@conference.peletalk1-vvw.pelephone.co.il";
								   
	 
 connection.muc.join(roomName, connection.authzid, room_msg_handler, room_pres_handler);
 var config = {"muc#roomconfig_publicroom": "1", "muc#roomconfig_persistentroom": "1"};
 if (descr)  config["muc#roomconfig_roomdesc"] = descr;
 if (subject)  config["muc#roomconfig_subject"] = subject;
connection.muc.createConfiguredRoom(roomName, config, onCreateRoomSuccess, onCreateRoomError);

				 connection.send($pres({ to: roomName , type: "subscribed" }));
			   sqlGroups.insertGroup(roomName);
			   //push_map( msg.getAttribute("from") ); //helper



	}
	
		ChatsObj.LeaveRoom =function(to_id){
		// console.log(to_id);
		// connection.muc.init(connection);
		
		 
		 var roomName = to_id;
								   
	 
 var xxxxxx = connection.muc.leave(roomName, connection.authzid, room_msg_handler, "bye");
 
			   sqlGroups.DeleteGroup(roomName);
			   //push_map( msg.getAttribute("from") ); //helper



	}
	
		
	return ChatsObj;
  

}])


.factory('sharedConn', ['$ionicPopup','$state','$rootScope','sql','sqlGroups','$q',function($ionicPopup, $state, $rootScope, sql,sqlGroups,$q ){
	
	 var SharedConnObj={};
 	// Strophe.log = function (lvl, msg) { 
	// console.log("lvl: " + lvl);
	// console.log("LOG: " + msg);


	// };

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
	SharedConnObj.connection.muc.queryOccupants( roomid,null,null);
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
		SharedConnObj.connection.rawInput = function (data) { console.log(" IN: " + data); };
		SharedConnObj.connection.rawOuput = function (data) { console.log("OUT: " + data); };
		
		
		
		
		
		
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
				/*	SharedConnObj.connection.addHandler(SharedConnObj.onSubject, null, 'message', "groupchat", null ,null);
											 addHandler(handler,ns,name,type,id,from,options	) */

				SharedConnObj.connection.addHandler(SharedConnObj.onInvite, 'jabber:x:conference');
				SharedConnObj.connection.addHandler(SharedConnObj.on_subscription_request, null, "presence", "subscribe");
				SharedConnObj.connection.si_filetransfer.addFileHandler(SharedConnObj.fileHandler);
				SharedConnObj.connection.ibb.addIBBHandler(SharedConnObj.ibbHandler);

				
				if(window.plugins !== undefined) {
					window.plugins.OneSignal.sendTag("User", SharedConnObj.getConnectObj().authzid);
				};
				$state.go('tabsController.chatlogs', {}, {location: "replace", reload: true});
				}};

	
	
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
		
		var xfrom = msg.getAttribute('from');
		var to = msg.getAttribute('to'); 
		if (!to)
		{
	to=SharedConnObj.getBareJid(to);
		}else
		{
			to= SharedConnObj.getConnectObj().authzid;
		}
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
  
  
  
  	var type = msg.getAttribute('type');
	var elems = msg.getElementsByTagName('subject');
  
	var d = new Date();
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
	
	
		if (type == "groupchat" && elems.length > 0) {
    var body = elems[0];
	var textMsg = Strophe.getText(body);
	xfrom =msg.getAttribute('from');
 
	sqlGroups.UpdateGroup(textMsg,xfrom)
	//to add register function
	}
		
		
		$rootScope.$broadcast('msgRecievedBroadcast', msg );
		$rootScope.$apply();
		return true;
	};
	
	SharedConnObj.onSubject=function (msg) {
	
		console.log("onSubject ");
		console.log(msg);
		
	
	
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
	
	
	SharedConnObj.GetSearch = function(name)
	
	{
		 var deferred = $q.defer();
	var iq = $iq({
     type: 'get',
    id: 'search4',
     to: 'search.peletalk1-vvw.pelephone.co.il'
 }).c('query', {xmlns: 'jabber:iq:search'});
connection.sendIQ(iq, function (stanza) {
    // using _ ([underscore](http://underscorejs.org/)) here.
    // the users will be your final list
    var users = _.map(stanza.getElementsByTagName("item"), function (item) {
        return {
			
			
            jid: $('[var="jid"]', item).text(),
            name: $('[var="Username"]', item).text()
        }
    });
	   deferred.resolve(users);
},function(err){ 
   deferred.reject(err)
}
);
return deferred.promise;
	};
	
	
	SharedConnObj.search = function(who)
	{
		
	 var deferred = $q.defer();
		
			 var iq = $iq({
       type: 'set',
      id: 'search4',
to: 'search.peletalk1-vvw.pelephone.co.il'
 })
 .c('query', {xmlns: 'jabber:iq:search'})
 .c('x', {xmlns: 'jabber:x:data', type:'submit'})
 .c('field', {type: 'hidden', var:'FORM_TYPE'})
 .c('value','jabber:iq:search').up().up()
 .c('field', {var: 'search',type:"text-single"})
 .c('value',  who  ).up().up()
 .c('field', {var: 'Username', type:"boolean"})
 .c('value','1').up().up()
 .c('field', {var: 'Name', type:"boolean"})
 .c('value','1').up().up()

 


connection.sendIQ(iq, function (stanza) {
    // using _ ([underscore](http://underscorejs.org/)) here.
    // the users will be your final list
    var users = _.map(stanza.getElementsByTagName("item"), function (item) {
        return {
			
			
            jid: $('[var="jid"]', item).text(),
			Username: $('[var="Username"]', item).text(),
			Email: $('[var="Email"]', item).text(),
            Name: $('[var="Name"]', item).text()
        }
    });
	   deferred.resolve(users);
},function(err){ 
   deferred.reject(err)
}
);
return deferred.promise;
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
	
	
	//File Helper ----------------------------------------------
	
	// file
var sid = null;
var chunksize;
var data;
var file = null;
var aFileParts, mimeFile, fileName;

function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object
    file = files[0];
}



 SharedConnObj.sendFile = function(file,to) {
	//var to = $('#to').get(0).value;
	var filename = file.name;
	var filesize = file.size;
	var mime = file.type;
	chunksize = filesize;
	sid = connection._proto.sid;
	console.log('sendFile: to=' + to);
	// send a stream initiation
	connection.si_filetransfer.send(to, sid, filename, filesize, mime, function(err) {
		fileTransferHandler(file, err);
	});
}

SharedConnObj.fileHandler = function(from, sid, filename, size, mime) {
  // received a stream initiation
  // save to data and be prepared to receive the file.
  console.log("fileHandler: from=" + from + ", file=" + filename + ", size=" + size + ", mime=" + mime);
  mimeFile = mime;
  fileName = filename;
  return true;
}

 SharedConnObj.ibbHandler = function(type, from, sid, data, seq) {
  console.log("ibbHandler: type=" + type + ", from=" + from);
  switch (type) {
    case "open":
      // new file, only metadata
      aFileParts = [];
      break;
    case "data":
      console.log("	>seq=" + seq);
      console.log("	>data=" + data);
      aFileParts.push(data);
      // data
      break;
    case "close":
      // and we're done
      var data = "data:" + mimeFile + ";base64,";
      for (var i = 0; i < aFileParts.length; i++) {
        data += aFileParts[i].split(",")[1];
      }
      console.log("	>data=" + data);
      console.log("	>data.len=" + data.length);
      if (mimeFile.indexOf("png") > 0) {
        var span = document.createElement('span');
        span.innerHTML = ['<img class="thumb" src="', data, '" title=""/>'].join('');
      } else {
        var span = document.createElement('span');
        span.innerHTML = ['<a class="link" download="' + fileName + '" href="', data, '" title="">download</a>'].join('');
      }
      document.getElementById('list').insertBefore(span, null);
    default:
      throw new Error("shouldn't be here.")
  }
  return true;
}

function fileTransferHandler(file, err) {
  console.log("fileTransferHandler: err=" + err);
  if (err) {
    return console.log(err);
  }
  var to = $('#to').get(0).value;
  chunksize = file.size;

  chunksize = 20 * 1024;

  // successfully initiated the transfer, now open the band
  connection.ibb.open(to, sid, chunksize, function(err) {
    console.log("ibb.open: err=" + err);
    if (err) {
      return console.log(err);
    }


    readChunks(file, function(data, seq) {
      sendData(to, seq, data);
    });
  });
}

function readAll(file, cb) {
    var reader = new FileReader();

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function(evt) {
      if (evt.target.readyState == FileReader.DONE) { // DONE == 2
        cb(evt.target.result);
      }
    };

    reader.readAsDataURL(file);
}

function readChunks(file, callback) {
  var fileSize = file.size;
  var chunkSize = 20 * 1024; // bytes
  var offset = 0;
  var block = null;
  var seq = 0;

  var foo = function(evt) {
    if (evt.target.error === null) {
      offset += chunkSize; //evt.target.result.length;
      seq++;
      callback(evt.target.result, seq); // callback for handling read chunk
    } else {
      console.log("Read error: " + evt.target.error);
      return;
    }
    if (offset >= fileSize) {
      console.log("Done reading file");
      return;
    }

    block(offset, chunkSize, file);
  }

  block = function(_offset, length, _file) {
    console.log("_block: length=" + length + ", _offset=" + _offset);
    var r = new FileReader();
    var blob = _file.slice(_offset, length + _offset);
    r.onload = foo;
    r.readAsDataURL(blob);
  }

  block(offset, chunkSize, file);
}

function sendData(to, seq, data) {
  // stream is open, start sending chunks of data
  connection.ibb.data(to, sid, seq, data, function(err) {
    console.log("ibb.data: err=" + err);
    if (err) {
      return console.log(err);
    }
    // ... repeat calling data
    // keep sending until you're ready you've reached the end of the file
    connection.ibb.close(to, sid, function(err) {
      log("ibb.close: err=" + err);
      if (err) {
        return console.log(err);
      }
      // done
    });
  });
}
	
	
	
	
	//-------------------------------------------------------------
	
	SharedConnObj.on_subscription_request = function(stanza){
		
		console.log(stanza);
		
		if(stanza.getAttribute("type") == "subscribe" && !is_element_map(stanza.getAttribute("from")) )
		{	
			
			//the friend request is recieved from Client 2
			var confirmPopup = $ionicPopup.confirm({
				 title: 'Confirm Friend Request!',
				 template: ' ' + stanza.getAttribute("from")+' wants to be your Friend'
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
	sqlObj.isgroup = function(id)
	{
		var group = 0;
		if (id.includes("@conference")  > 0) 
		{ group = 1}
	return group;
	}
	
	//Load Chatlogs
	sqlObj.loadChats = function(my) {
			sqlObj.chatlogs = [];
		//Bad implementation 	
       // var query = "SELECT distinct from_id FROM chats where from_id not like ? ";
	

	//  var query = "SELECT distinct from_id,max(id) as id   FROM chats   where chats.from_id not like ? ";
	
	//var query = "SELECT distinct from_id,count(*) as mcount ,max(id) as id  ,sum(read) as read,message FROM chats where (chats.from_id not like ?  ) group by from_id";
		var query = "SELECT distinct to_id as from_id,count(*) as mcount ,max(id) as id ,sum(read) as read,message FROM chats where (chats.to_id not like ? ) group by to_id";


        $cordovaSQLite.execute($rootScope.db, query,[my]).then(function(res) {
			
			
            if(res.rows.length  != null && res.rows.length> 0  ) {
				for (var i=0 ; i<res.rows.length; i=i+1) {
					var photo = res.rows.item(i).photo;
					if (photo != null)
					{
					if (photo.length  != null &&   photo.length  ===0)
					{
						photo = "img/ben.png";
					}
					else 
					{
							photo = "data:image/png;base64," + res.rows.item(i).photo;
					}
					}
					else
					{	photo = "img/ben.png";}
					
					
					
					
					var thisDate =res.rows.item(i).timestamp;
					var jDate = new Date();
					if (thisDate != null)
					{
var thisDateT = thisDate.substr(0, 10) + "T" + thisDate.substr(11, 8);

 jDate = new Date(thisDateT);
					}
					
					
					sqlObj.chatlogs.push({
						 
						id: res.rows.item(i).from_id,
						name: res.rows.item(i).name || res.rows.item(i).from_id ,
						lastText: res.rows.item(i).message,
						time : jDate,
						mcount : res.rows.item(i).mcount - res.rows.item(i).read ,
						group: sqlObj.isgroup(res.rows.item(i).from_id),
						face:photo
					});
                }				
					
            } else {
                console.log("No results found");
            }
        }, function (err) {
            console.error(err);
		});
			
		query = "SELECT distinct from_id,count(*) as mcount ,max(id) as id ,message FROM chats where chats.from_id not like ? group by from_id";

		
		
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
					
						var thisDate =res.rows.item(i).timestamp;
var thisDateT = thisDate.substr(0, 10) + "T" + thisDate.substr(11, 8);

var jDate = new Date(thisDateT);
					sqlObj.messages.push({
					  userId: res.rows.item(i).from_id,
					  text: res.rows.item(i).message,
					  time:jDate
					});
				}				
					
			} else {
				console.log("No message found");
			}
		}, function (err) {
			console.error(err);
		});

		
		query = "update chats set read= 1 where (to_id = ? or to_id = ?)  and (from_id = ? or from_id = ?) ";
		$cordovaSQLite.execute($rootScope.db, query,[my_id, recievers_id, my_id, recievers_id]);
		return sqlObj.messages;  

	}
	
	
	
	sqlObj.showRoomChats=function(roomid){
		
		sqlObj.messages=[];
	  
		var query = "SELECT * FROM chats where (to_id = ? )";
		$cordovaSQLite.execute($rootScope.db, query,[roomid]).then(function(res) {
			if(res.rows.length > 0) {
				for (var i=0 ; i<res.rows.length; i=i+1) {
					
						var thisDate =res.rows.item(i).timestamp;
var thisDateT = thisDate.substr(0, 10) + "T" + thisDate.substr(11, 8);

var jDate = new Date(thisDateT);

					sqlObj.messages.push({
					  userId: res.rows.item(i).from_id,
					  text: res.rows.item(i).message,
					  time: jDate
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


.factory('sqlContact', ['$rootScope','$cordovaSQLite'    ,function($rootScope,$cordovaSQLite){

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
	
	sqlGroupObj.DeleteGroup = function(r) {
		console.log(r);
	
		var query = "delete from groups  where groupjid = ? ";
		$cordovaSQLite.execute( $rootScope.db, query, [r]).then(function(res) {
			console.log("Group Deleted");
		}, function (err) {
			console.log("Group DB Error");
			console.log(err);
		});
    }
		
	sqlGroupObj.UpdateGroup = function(groupid , title) {
			
		var query = "update groups set title=? where groupjid = ? ";
		$cordovaSQLite.execute( $rootScope.db, query, [groupid,title]).then(function(res) {
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

